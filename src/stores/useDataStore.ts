import { create } from 'zustand';

export interface MasterTask {
  id: string;
  title: string;
  category: 'personal' | 'work' | 'college' | 'church';
  repeatType: 'weekday' | 'saturday' | 'sunday';
  completed: boolean;
  time?: string;
  date?: string;
  notes?: string;
}

export interface AgendaEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: string;
  subtopics?: { id: string; title: string; completed: boolean }[];
}

interface DataState {
  masterTasks: MasterTask[];
  agendaEvents: AgendaEvent[];
  waterSteps: Record<string, boolean>;
  dashboardOrder: string[];
  
  addMasterTask: (task: Omit<MasterTask, 'id' | 'completed'>) => void;
  toggleMasterTask: (id: string) => void;
  deleteMasterTask: (id: string) => void;
  updateMasterTask: (id: string, updates: Partial<MasterTask>) => void;
  
  addAgendaEvent: (event: Omit<AgendaEvent, 'id'>) => void;
  deleteAgendaEvent: (id: string) => void;
  addSubtopic: (eventId: string, title: string) => void;
  toggleSubtopic: (eventId: string, subtopicId: string) => void;
  deleteSubtopic: (eventId: string, subtopicId: string) => void;
  
  toggleWaterStep: (id: string) => void;
  setDashboardOrder: (order: string[]) => void;
}

export const useDataStore = create<DataState>((set) => ({
  masterTasks: [
    { id: '1', title: 'Tomar café da manhã', category: 'personal', repeatType: 'weekday', completed: false },
    { id: '2', title: 'Ler livro', category: 'personal', repeatType: 'weekday', completed: false },
    { id: '3', title: 'Reunião Diária', category: 'work', repeatType: 'weekday', completed: false },
    { id: '4', title: 'Limpar a casa', category: 'personal', repeatType: 'saturday', completed: false },
    { id: '5', title: 'Culto', category: 'church', repeatType: 'sunday', completed: false },
  ],
  agendaEvents: [
    { id: '10', title: 'Prova de Estruturas', category: 'college', date: new Date().toISOString().split('T')[0], subtopics: [{ id: 's1', title: 'Capítulo 4', completed: false }] }
  ],
  waterSteps: {
    fill: false,
    two_cups: false,
    half: false,
    full: false,
  },
  dashboardOrder: ['personal', 'work', 'college', 'church'],

  addMasterTask: (task) => set((state) => ({
    masterTasks: [{ ...task, id: Math.random().toString(), completed: false }, ...state.masterTasks]
  })),

  toggleMasterTask: (id) => set((state) => ({
    masterTasks: state.masterTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  })),

  deleteMasterTask: (id) => set((state) => ({
    masterTasks: state.masterTasks.filter(t => t.id !== id)
  })),

  updateMasterTask: (id, updates) => set((state) => ({
    masterTasks: state.masterTasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  addAgendaEvent: (event) => set((state) => ({
    agendaEvents: [...state.agendaEvents, { ...event, id: Math.random().toString(), subtopics: event.subtopics || [] }]
  })),

  deleteAgendaEvent: (id) => set((state) => ({
    agendaEvents: state.agendaEvents.filter(e => e.id !== id)
  })),

  addSubtopic: (eventId, title) => set((state) => ({
    agendaEvents: state.agendaEvents.map(e => e.id === eventId ? {
      ...e, subtopics: [...(e.subtopics || []), { id: Math.random().toString(), title, completed: false }]
    } : e)
  })),

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

  setDashboardOrder: (order) => set({ dashboardOrder: order })
}));
