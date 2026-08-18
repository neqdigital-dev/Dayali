import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MasterTask {
  id: string;
  title_pt: string;
  title_en?: string;
  category: 'personal' | 'work' | 'college' | 'church';
  repeatType: 'weekday' | 'saturday' | 'sunday';
  completed: boolean;
  time?: string;
  date?: string;
  notes?: string;
}

export interface AgendaEvent {
  id: string;
  title_pt: string;
  title_en?: string;
  date: string; // YYYY-MM-DD
  category: string;
  subtopics?: { id: string; title_pt: string; title_en?: string; completed: boolean }[];
}

interface DataState {
  masterTasks: MasterTask[];
  agendaEvents: AgendaEvent[];
  waterSteps: Record<string, boolean>;
  dashboardColumns: string[][];
  
  addMasterTask: (task: Omit<MasterTask, 'id' | 'completed'>) => void;
  toggleMasterTask: (id: string) => void;
  deleteMasterTask: (id: string) => void;
  updateMasterTask: (id: string, updates: Partial<MasterTask>) => void;
  reorderMasterTasks: (activeId: string, overId: string) => void;
  
  addAgendaEvent: (event: Omit<AgendaEvent, 'id'>) => void;
  deleteAgendaEvent: (id: string) => void;
  addSubtopic: (eventId: string, title: string) => void;
  toggleSubtopic: (eventId: string, subtopicId: string) => void;
  deleteSubtopic: (eventId: string, subtopicId: string) => void;
  
  toggleWaterStep: (id: string) => void;
  setDashboardColumns: (columns: string[][]) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      masterTasks: [
    { id: '1', title_pt: 'Tomar café da manhã', title_en: 'Have breakfast', category: 'personal', repeatType: 'weekday', completed: false },
    { id: '2', title_pt: 'Ler livro', title_en: 'Read book', category: 'personal', repeatType: 'weekday', completed: false },
    { id: '3', title_pt: 'Reunião Diária', title_en: 'Daily Meeting', category: 'work', repeatType: 'weekday', completed: false },
    { id: '4', title_pt: 'Limpar a casa', title_en: 'Clean the house', category: 'personal', repeatType: 'saturday', completed: false },
    { id: '5', title_pt: 'Culto', title_en: 'Church Service', category: 'church', repeatType: 'sunday', completed: false },
  ],
  agendaEvents: [
    { id: '10', title_pt: 'Prova de Estruturas', title_en: 'Structures Exam', category: 'college', date: new Date().toISOString().split('T')[0], subtopics: [{ id: 's1', title_pt: 'Capítulo 4', title_en: 'Chapter 4', completed: false }] }
  ],
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

  addMasterTask: (task) => {
    const id = Math.random().toString();
    const newTask = { ...task, id, completed: false, title_en: task.title_pt };
    
    set((state) => ({
      masterTasks: [newTask, ...state.masterTasks]
    }));

    // Auto-translate in background
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

  setDashboardColumns: (columns) => set({ dashboardColumns: columns })
    }),
    {
      name: 'dayali-storage-v2',
    }
  )
);
