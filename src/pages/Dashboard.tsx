import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useTasks, useAddTask, useUpdateTask } from '../hooks/useTasks';
import type { TaskItem } from '../components/dashboard/TaskColumn';
import SpiritualCard from '../components/dashboard/SpiritualCard';
import WaterTracker from '../components/dashboard/WaterTracker';
import TaskColumn from '../components/dashboard/TaskColumn';
import CollegeCard from '../components/dashboard/CollegeCard';
import ProgressCard from '../components/dashboard/ProgressCard';
import AgendaPreview from '../components/dashboard/AgendaPreview';

type Priority = 'high' | 'normal' | 'low';
interface TaskItem {
  id: string;
  title_pt: string;
  title_en: string | null;
  completed: boolean;
  priority: Priority;
}

const initialPersonalTasks: Partial<TaskItem>[] = [
  { title_pt: 'Tomar café da manhã', title_en: 'Eat breakfast', priority: 'normal' },
  { title_pt: 'Fazer almoço', title_en: 'Make lunch', priority: 'normal' },
  { title_pt: 'Treinar 💪', title_en: 'To train 💪', priority: 'high' },
  { title_pt: 'Ler a Bíblia', title_en: 'Read the bible', priority: 'high' },
  { title_pt: 'Estudar lição', title_en: 'Study lesson', priority: 'normal' },
  { title_pt: 'Ler livro', title_en: 'Read book', priority: 'normal' },
  { title_pt: 'Dormir às 21h 😴', title_en: 'Sleep at 21h 😴', priority: 'high' },
  { title_pt: 'Tirar um cochilo 😴', title_en: 'Take a nap 😴', priority: 'low' },
  { title_pt: 'Falar com Deus 🙏', title_en: 'Speak with God 🙏', priority: 'high' },
  { title_pt: 'Parar de trabalhar 18h 🛑', title_en: 'Stop working 18h 🛑', priority: 'high' },
  { title_pt: 'Alongamento 🤸', title_en: 'Stretching 🤸', priority: 'low' },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const { data: tasks, isLoading } = useTasks();
  const addTask = useAddTask();
  const updateTask = useUpdateTask();

  const personalTasks = tasks?.filter(t => t.category === 'personal') || [];
  const workTasks = tasks?.filter(t => t.category === 'work') || [];

  // Seed inicial se o banco estiver vazio
  useEffect(() => {
    if (tasks?.length === 0 && user && !addTask.isPending) {
      initialPersonalTasks.forEach(t => {
        addTask.mutate({
          user_id: user.id,
          title_pt: t.title_pt!,
          category: 'personal',
          type: 'daily',
          priority: t.priority
        });
      });
    }
  }, [tasks, user]);

  const toggleTask = (id: string, currentCompleted: boolean) => {
    updateTask.mutate({ id, updates: { is_active: !currentCompleted } }); 
  };

  // Calculate overall progress
  const allTasks = [...personalTasks, ...workTasks];
  const completedCount = allTasks.filter((t) => (t as any).completed).length; // Provisório até conectarmos ocorrências

  if (isLoading) return <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>Carregando dados...</div>;

  return (
    <div className="dashboard-grid">
      {/* Spiritual Message */}
      <div className="dashboard-spiritual">
        <SpiritualCard />
      </div>

      {/* Water Tracker */}
      <div className="dashboard-water">
        <WaterTracker />
      </div>

      {/* Three columns: Personal / Work / College */}
      <div className="dashboard-columns">
        <TaskColumn
          category="personal"
          tasks={personalTasks as any}
          onToggleTask={(id) => toggleTask(id, false)}
        />
        <TaskColumn
          category="work"
          tasks={workTasks as any}
          onToggleTask={(id) => toggleTask(id, false)}
        />
        <CollegeCard />
      </div>

      {/* Progress */}
      <div className="dashboard-progress">
        <ProgressCard completed={completedCount} total={allTasks.length} />
      </div>

      {/* Agenda */}
      <div className="dashboard-agenda">
        <AgendaPreview />
      </div>
    </div>
  );
}
