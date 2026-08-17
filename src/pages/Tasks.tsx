import { useState } from 'react';
import { useDataStore } from '../stores/useDataStore';
import TaskColumn from '../components/dashboard/TaskColumn';

type Tab = 'weekday' | 'saturday' | 'sunday';

export default function Tasks() {
  const { masterTasks, addMasterTask, toggleMasterTask, deleteMasterTask, updateMasterTask } = useDataStore();
  const [activeTab, setActiveTab] = useState<Tab>('weekday');

  const activeTasks = masterTasks.filter(t => t.repeatType === activeTab);

  const personalTasks = activeTasks
    .filter(t => t.category === 'personal')
    .map(t => ({ id: t.id, title_pt: t.title, title_en: t.title, priority: 'normal' as const, completed: t.completed, time: t.time, date: t.date, notes: t.notes }));

  const workTasks = activeTasks
    .filter(t => t.category === 'work')
    .map(t => ({ id: t.id, title_pt: t.title, title_en: t.title, priority: 'normal' as const, completed: t.completed, time: t.time, date: t.date, notes: t.notes }));

  const churchTasks = activeTasks
    .filter(t => t.category === 'church')
    .map(t => ({ id: t.id, title_pt: t.title, title_en: t.title, priority: 'normal' as const, completed: t.completed, time: t.time, date: t.date, notes: t.notes }));

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Tarefas (Configuração Mestre)</h1>
        <p className="page-description">Gerencie a repetição das suas tarefas. O Dashboard lerá esta configuração para saber o que exibir hoje.</p>
      </header>

      <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-4)', background: 'var(--color-bg-subtle)', padding: '4px', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
        <button 
          className={`btn btn-sm ${activeTab === 'weekday' ? 'btn-primary' : 'btn-ghost'}`} 
          onClick={() => setActiveTab('weekday')}
        >
          Dias da Semana (Seg-Sex)
        </button>
        <button 
          className={`btn btn-sm ${activeTab === 'saturday' ? 'btn-primary' : 'btn-ghost'}`} 
          onClick={() => setActiveTab('saturday')}
        >
          Sábado
        </button>
        <button 
          className={`btn btn-sm ${activeTab === 'sunday' ? 'btn-primary' : 'btn-ghost'}`} 
          onClick={() => setActiveTab('sunday')}
        >
          Domingo
        </button>
      </div>

      <div className="page-content">
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <TaskColumn 
            category="personal" 
            tasks={personalTasks} 
            onToggleTask={(id) => toggleMasterTask(id)}
            onDeleteTask={(id) => deleteMasterTask(id)}
            onUpdateTask={updateMasterTask}
            onAddSubmit={(title) => {
              addMasterTask({ title, category: 'personal', repeatType: activeTab });
            }}
          />
          <TaskColumn 
            category="work" 
            tasks={workTasks} 
            onToggleTask={(id) => toggleMasterTask(id)}
            onDeleteTask={(id) => deleteMasterTask(id)}
            onUpdateTask={updateMasterTask}
            onAddSubmit={(title) => {
              addMasterTask({ title, category: 'work', repeatType: activeTab });
            }}
          />
          {(activeTab === 'saturday' || activeTab === 'sunday') && (
            <TaskColumn 
              category="church" 
              tasks={churchTasks} 
              onToggleTask={(id) => toggleMasterTask(id)}
              onDeleteTask={(id) => deleteMasterTask(id)}
              onUpdateTask={updateMasterTask}
              onAddSubmit={(title) => {
                addMasterTask({ title, category: 'church', repeatType: activeTab });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
