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
    .map(t => ({ id: t.id, title_pt: t.title_pt, title_en: t.title_en || t.title_pt, priority: 'normal' as const, completed: t.completed, time: t.time, date: t.date, notes: t.notes }));

  const workTasks = activeTasks
    .filter(t => t.category === 'work')
    .map(t => ({ id: t.id, title_pt: t.title_pt, title_en: t.title_en || t.title_pt, priority: 'normal' as const, completed: t.completed, time: t.time, date: t.date, notes: t.notes }));

  const churchTasks = activeTasks
    .filter(t => t.category === 'church')
    .map(t => ({ id: t.id, title_pt: t.title_pt, title_en: t.title_en || t.title_pt, priority: 'normal' as const, completed: t.completed, time: t.time, date: t.date, notes: t.notes }));

  const handleGlobalAdd = (title: string, category: string, currentTab: Tab) => {
    addMasterTask({ title_pt: title, category, repeatType: currentTab });
    if (currentTab === 'weekday') {
      addMasterTask({ title_pt: title, category, repeatType: 'saturday' });
      addMasterTask({ title_pt: title, category, repeatType: 'sunday' });
    }
  };

  const handleCopyWeekdaysToWeekends = () => {
    if (window.confirm("Isso vai copiar todas as suas tarefas de Segunda a Sexta para o Sábado e Domingo. Deseja continuar?")) {
      const weekdayTasks = masterTasks.filter(t => t.repeatType === 'weekday');
      weekdayTasks.forEach(task => {
        addMasterTask({ title_pt: task.title_pt, category: task.category, repeatType: 'saturday' });
        addMasterTask({ title_pt: task.title_pt, category: task.category, repeatType: 'sunday' });
      });
      alert("Tarefas copiadas com sucesso! Vá para as abas de Sábado e Domingo para limpar o que não quiser.");
    }
  };

  return (
    <div className="page-container">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Tarefas (Configuração Mestre)</h1>
          <p className="page-description">Gerencie a repetição das suas tarefas. O Dashboard lerá esta configuração para saber o que exibir hoje.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleCopyWeekdaysToWeekends}>
          Copiar de Seg-Sex para Sáb/Dom
        </button>
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
            onDeleteTask={(id) => { if(window.confirm('Tem certeza que deseja excluir?')) deleteMasterTask(id); }}
            onUpdateTask={updateMasterTask}
            onAddSubmit={(title) => handleGlobalAdd(title, 'personal', activeTab)}
          />
          <TaskColumn 
            category="work" 
            tasks={workTasks} 
            onToggleTask={(id) => toggleMasterTask(id)}
            onDeleteTask={(id) => { if(window.confirm('Tem certeza que deseja excluir?')) deleteMasterTask(id); }}
            onUpdateTask={updateMasterTask}
            onAddSubmit={(title) => handleGlobalAdd(title, 'work', activeTab)}
          />
          {(activeTab === 'saturday' || activeTab === 'sunday') && (
            <TaskColumn 
              category="church" 
              tasks={churchTasks} 
              onToggleTask={(id) => toggleMasterTask(id)}
              onDeleteTask={(id) => { if(window.confirm('Tem certeza que deseja excluir?')) deleteMasterTask(id); }}
              onUpdateTask={updateMasterTask}
              onAddSubmit={(title) => handleGlobalAdd(title, 'church', activeTab)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
