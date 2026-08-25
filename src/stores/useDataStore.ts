import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';
import { getTodayISO } from '../lib/dates';

export interface MasterTask {
  id: string;
  title_pt: string;
  title_en?: string | null;
  category: 'personal' | 'work' | 'college' | 'church';
  repeatType: 'weekday' | 'saturday' | 'sunday' | 'none';
  completed: boolean;
  time?: string;
  date?: string;
  notes?: string;
}

export interface AgendaEvent {
  id: string;
  title_pt: string;
  title_en?: string | null;
  date: string; // YYYY-MM-DD
  time?: string;
  notes?: string;
  link?: string;
  category: string;
  completed?: boolean;
  subtopics?: { id: string; title_pt: string; title_en?: string | null; completed: boolean }[];
}

interface DataState {
  masterTasks: MasterTask[];
  agendaEvents: AgendaEvent[];
  waterSteps: Record<string, boolean>;
  dashboardColumns: string[][];
  reflectionText: string;
  lastResetDate: string;
  history: Array<{ id: string; date: string; completion: number; completedItems: number; totalItems: number }>;
  
  addMasterTask: (task: Omit<MasterTask, 'id' | 'completed'>) => void;
  toggleMasterTask: (id: string) => void;
  deleteMasterTask: (id: string) => void;
  updateMasterTask: (id: string, updates: Partial<MasterTask>) => void;
  reorderMasterTasks: (activeId: string, overId: string) => void;
  
  addAgendaEvent: (event: Omit<AgendaEvent, 'id'>) => void;
  updateAgendaEvent: (id: string, updates: Partial<AgendaEvent>) => void;
  deleteAgendaEvent: (id: string) => void;
  toggleAgendaEvent: (id: string) => void;
  addSubtopic: (eventId: string, title: string) => void;
  toggleSubtopic: (eventId: string, subtopicId: string) => void;
  deleteSubtopic: (eventId: string, subtopicId: string) => void;
  
  toggleWaterStep: (id: string) => void;
  setDashboardColumns: (columns: string[][]) => void;
  setReflectionText: (text: string) => void;
  setReflectionTextEn: (text: string) => void;
  checkDailyReset: () => void;
  forceSyncFromCloud: () => Promise<void>;
}

let cloudSyncReady = false;

const supabaseStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    // 1. Tenta recuperar do Local Storage primeiro (rápido e funciona offline)
    const localData = localStorage.getItem(name);
    
    // 2. Verifica se o usuário está logado no Supabase
    const user = useAuthStore.getState().user;
    if (!user || user.id === 'mock-user-id') {
      cloudSyncReady = false;
      return localData;
    }

    // 3. Busca o backup nas nuvens
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('state_backup')
        .eq('id', user.id)
        .single();
      
      cloudSyncReady = true;
      
      const cloudBackup = data?.state_backup;
      
      if (localData) {
        try {
          const localParsed = JSON.parse(localData);
          const localTasks = localParsed?.state?.masterTasks?.length || 0;
          const cloudTasks = cloudBackup?.state?.masterTasks?.length || 0;

          // Se o armazenamento local tiver mais tarefas que a nuvem (ex: nuvem foi apagada),
          // assumimos o local como mais atualizado e forçamos o envio para a nuvem.
          if (!cloudBackup || localTasks > cloudTasks) {
            supabase.from('profiles').update({ state_backup: localParsed }).eq('id', user.id).then();
            return localData;
          }
        } catch (e) {
          console.error("Erro ao comparar dados", e);
        }
      }
      
      if (error || !cloudBackup) {
         return localData;
      }
      
      return JSON.stringify(cloudBackup);
    } catch (e) {
      console.error("Erro ao buscar dados da nuvem", e);
      return localData;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    // 1. Salva no local storage para o app funcionar super rápido e offline
    localStorage.setItem(name, value);
    
    // 2. Sincroniza em background com o Supabase
    const user = useAuthStore.getState().user;
    if (!user || user.id === 'mock-user-id') return;
    
    // Só envia para a nuvem se já tivermos carregado os dados da nuvem com sucesso
    // Isso evita que um celular novo apague os dados do PC ao salvar o estado local vazio
    if (!cloudSyncReady) return;

    try {
      const parsedValue = JSON.parse(value);
      await supabase
        .from('profiles')
        .upsert({ id: user.id, state_backup: parsedValue });
    } catch (e) {
      console.error("Erro ao sincronizar com as nuvens", e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    localStorage.removeItem(name);
    const user = useAuthStore.getState().user;
    if (!user || user.id === 'mock-user-id') return;

    try {
      await supabase
        .from('profiles')
        .update({ state_backup: null })
        .eq('id', user.id);
    } catch (e) {
      console.error("Erro ao remover backup das nuvens", e);
    }
  },
};

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      masterTasks: [],
      agendaEvents: [],
      waterSteps: {
        fill: false,
        two_cups: false,
        half: false,
        full: false,
      },
      dashboardColumns: [
        ['personal'],
        ['work'],
        ['college'],
        ['church']
      ],
      reflectionText: '',
      reflectionTextEn: '',
      lastResetDate: getTodayISO(),
      history: [],

      addMasterTask: (task) => {
        const id = Math.random().toString();
        const newTask = { ...task, id, completed: false, title_en: task.title_pt };
        
        set((state) => ({
          masterTasks: [newTask, ...state.masterTasks]
        }));

        import('../services/translation').then(async ({ translationService }) => {
          const title_en = await translationService.translateToEnglish(task.title_pt);
          if (title_en !== task.title_pt) {
            set((state) => ({
              masterTasks: state.masterTasks.map(t => t.id === id ? { ...t, title_en } : t)
            }));
          }
        });
      },

      toggleMasterTask: (id) => set((state) => ({
        masterTasks: state.masterTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),

      deleteMasterTask: (id) => set((state) => ({
        masterTasks: state.masterTasks.filter(t => t.id !== id)
      })),

      updateMasterTask: (id, updates) => set((state) => ({
        masterTasks: state.masterTasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),

      reorderMasterTasks: (activeId, overId) => set((state) => {
        const oldIndex = state.masterTasks.findIndex(t => t.id === activeId);
        const newIndex = state.masterTasks.findIndex(t => t.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newTasks = [...state.masterTasks];
          const [moved] = newTasks.splice(oldIndex, 1);
          newTasks.splice(newIndex, 0, moved);
          return { masterTasks: newTasks };
        }
        return state;
      }),

      addAgendaEvent: (event) => {
        const id = Math.random().toString();
        const newEvent = { ...event, id, subtopics: event.subtopics || [], title_en: event.title_pt };
        set((state) => ({ agendaEvents: [...state.agendaEvents, newEvent] }));
        
        import('../services/translation').then(async ({ translationService }) => {
          const title_en = await translationService.translateToEnglish(event.title_pt);
          if (title_en !== event.title_pt) {
            set((state) => ({
              agendaEvents: state.agendaEvents.map(e => e.id === id ? { ...e, title_en } : e)
            }));
          }
        });
      },

      deleteAgendaEvent: (id) => set((state) => ({
        agendaEvents: state.agendaEvents.filter(e => e.id !== id)
      })),

      toggleAgendaEvent: (id) => set((state) => ({
        agendaEvents: state.agendaEvents.map(e => e.id === id ? { ...e, completed: !e.completed } : e)
      })),

      updateAgendaEvent: (id, updates) => set((state) => {
        const event = state.agendaEvents.find(e => e.id === id);
        if (!event) return state;

        const updatedEvent = { ...event, ...updates };

        if (updates.title_pt && updates.title_pt !== event.title_pt) {
          import('../services/translation').then(async ({ translationService }) => {
            const title_en = await translationService.translateToEnglish(updates.title_pt!);
            if (title_en !== updates.title_pt) {
              useDataStore.getState().updateAgendaEvent(id, { title_en });
            }
          });
        }

        return {
          agendaEvents: state.agendaEvents.map(e => e.id === id ? updatedEvent : e)
        };
      }),

      addSubtopic: (eventId, title_pt) => {
        const subtopicId = Math.random().toString();
        set((state) => ({
          agendaEvents: state.agendaEvents.map(e => e.id === eventId ? {
            ...e, subtopics: [...(e.subtopics || []), { id: subtopicId, title_pt, title_en: title_pt, completed: false }]
          } : e)
        }));

        import('../services/translation').then(async ({ translationService }) => {
          const title_en = await translationService.translateToEnglish(title_pt);
          if (title_en !== title_pt) {
            set((state) => ({
              agendaEvents: state.agendaEvents.map(e => e.id === eventId ? {
                ...e, subtopics: e.subtopics?.map(s => s.id === subtopicId ? { ...s, title_en } : s)
              } : e)
            }));
          }
        });
      },

      toggleSubtopic: (eventId, subtopicId) => set((state) => ({
        agendaEvents: state.agendaEvents.map(e => e.id === eventId ? {
          ...e, subtopics: e.subtopics?.map(s => s.id === subtopicId ? { ...s, completed: !s.completed } : s)
        } : e)
      })),

      deleteSubtopic: (eventId, subtopicId) => set((state) => ({
        agendaEvents: state.agendaEvents.map(e => e.id === eventId ? {
          ...e, subtopics: e.subtopics?.filter(s => s.id !== subtopicId)
        } : e)
      })),

      toggleWaterStep: (id) => set((state) => ({
        waterSteps: {
          ...state.waterSteps,
          [id]: !state.waterSteps[id]
        }
      })),

      setDashboardColumns: (columns) => set({ dashboardColumns: columns }),
      setReflectionText: (text) => set({ reflectionText: text }),
      setReflectionTextEn: (text) => set({ reflectionTextEn: text }),
      
      checkDailyReset: () => {
        const today = getTodayISO();
        set((state) => {
          if (state.lastResetDate !== today) {
            // Calculate yesterday's completion before resetting
            let totalItems = 0;
            let completedItems = 0;
            
            state.masterTasks.forEach(task => {
              totalItems++;
              if (task.completed) completedItems++;
            });
            
            Object.values(state.waterSteps).forEach(step => {
              totalItems++;
              if (step) completedItems++;
            });

            const completion = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
            
            const newHistoryItem = {
              id: Math.random().toString(),
              date: state.lastResetDate, // Save it as the date that just passed
              completion,
              completedItems,
              totalItems
            };

            return {
              lastResetDate: today,
              reflectionText: '', // Clear the reflection for the new day
              reflectionTextEn: '', // Clear the english reflection too
              history: [newHistoryItem, ...state.history].slice(0, 90), // Keep last 90 days
              waterSteps: {
                fill: false,
                two_cups: false,
                half: false,
                full: false,
              },
              masterTasks: state.masterTasks
                .filter(t => !(t.repeatType === 'none' && t.completed)) // Remove completed 'none' tasks
                .map(t => ({
                  ...t,
                  completed: false // Uncheck all remaining tasks
                }))
            };
          }
          return state;
        });
      },

      forceSyncFromCloud: async () => {
        const user = useAuthStore.getState().user;
        if (!user || user.id === 'mock-user-id') return;

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('state_backup')
            .eq('id', user.id)
            .single();

          // Marcamos que a comunicação com a nuvem foi feita, permitindo que alterações futuras sejam salvas
          cloudSyncReady = true;

          const cloudState = data?.state_backup?.state || data?.state_backup;
          
          // Pegamos o estado atual (local) que já foi carregado
          const localState = useDataStore.getState();
          const localTasks = localState.masterTasks?.length || 0;
          const cloudTasks = cloudState?.masterTasks?.length || 0;

          // Se a nuvem estiver vazia ou tiver menos tarefas que o armazenamento local,
          // o armazenamento local (PC) é o verdadeiro e deve ser enviado para a nuvem!
          if (!data?.state_backup || localTasks > cloudTasks) {
            const payload = { id: user.id, state_backup: { state: localState, version: 0 } };
            await supabase.from('profiles').upsert(payload);
            return;
          }

          // Caso contrário, a nuvem está correta, então atualizamos a tela com os dados da nuvem
          if (cloudState) {
            set((state) => ({
               ...state,
               ...cloudState
            }));
            // Como puxamos dados da nuvem que podem ser do dia anterior, devemos forçar a verificação de virada de dia
            useDataStore.getState().checkDailyReset();
          }
        } catch (e) {
          console.error("Erro ao forçar sincronização", e);
        }
      },
    }),
    {
      name: 'dayali-storage-v2',
      storage: createJSONStorage(() => supabaseStorage),
    }
  )
);

