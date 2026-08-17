import { useState } from 'react';
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

const initialPersonalTasks: TaskItem[] = [
  { id: 'p1', title_pt: 'Treinar', title_en: 'Work out', completed: true, priority: 'normal' },
  { id: 'p2', title_pt: 'Estudar inglês', title_en: 'Study English', completed: true, priority: 'normal' },
  { id: 'p3', title_pt: 'Ler Bíblia', title_en: 'Read Bible', completed: false, priority: 'high' },
  { id: 'p4', title_pt: 'Exercícios de respiração', title_en: 'Breathing exercises', completed: false, priority: 'low' },
];

const initialWorkTasks: TaskItem[] = [
  { id: 'w1', title_pt: 'Criar post', title_en: 'Create post', completed: true, priority: 'high' },
  { id: 'w2', title_pt: 'Gravar vídeo', title_en: 'Record video', completed: false, priority: 'high' },
  { id: 'w3', title_pt: 'Editar thumbnail', title_en: 'Edit thumbnail', completed: false, priority: 'normal' },
  { id: 'w4', title_pt: 'Responder mensagens', title_en: 'Reply to messages', completed: true, priority: 'normal' },
  { id: 'w5', title_pt: 'Publicar conteúdo', title_en: 'Publish content', completed: false, priority: 'normal' },
];

export default function Dashboard() {
  const [personalTasks, setPersonalTasks] = useState<TaskItem[]>(initialPersonalTasks);
  const [workTasks, setWorkTasks] = useState<TaskItem[]>(initialWorkTasks);

  const toggleTask = (
    tasks: TaskItem[],
    setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
    id: string
  ) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Calculate overall progress
  const allTasks = [...personalTasks, ...workTasks];
  const completedCount = allTasks.filter((t) => t.completed).length;

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
          tasks={personalTasks}
          onToggleTask={(id) => toggleTask(personalTasks, setPersonalTasks, id)}
        />
        <TaskColumn
          category="work"
          tasks={workTasks}
          onToggleTask={(id) => toggleTask(workTasks, setWorkTasks, id)}
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
