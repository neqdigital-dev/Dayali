import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDataStore } from '../stores/useDataStore';
import SpiritualCard from '../components/dashboard/SpiritualCard';
import WaterTracker from '../components/dashboard/WaterTracker';
import TaskColumn from '../components/dashboard/TaskColumn';
import CollegeCard from '../components/dashboard/CollegeCard';
import ChurchCard from '../components/dashboard/ChurchCard';
import AgendaPreview from '../components/dashboard/AgendaPreview';

function SortableCard({ id, render }: { id: string, render: (dragHandleProps: any) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    breakInside: 'avoid' as const,
    pageBreakInside: 'avoid' as const,
    marginBottom: 'var(--space-4)',
    display: 'block',
    width: '100%',
  };
  return (
    <div ref={setNodeRef} style={style}>
      {render({ ...attributes, ...listeners })}
    </div>
  );
}

export default function Dashboard() {
  const { masterTasks, toggleMasterTask, deleteMasterTask, updateMasterTask, addMasterTask, agendaEvents, dashboardOrder, setDashboardOrder } = useDataStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = dashboardOrder.indexOf(active.id as string);
      const newIndex = dashboardOrder.indexOf(over.id as string);
      setDashboardOrder(arrayMove(dashboardOrder, oldIndex, newIndex));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const dayIndex = new Date().getDay();
  let todayType: 'weekday' | 'saturday' | 'sunday' = 'weekday';
  if (dayIndex === 0) todayType = 'sunday';
  if (dayIndex === 6) todayType = 'saturday';

  // Filter master tasks for today's dashboard
  const activeTasks = masterTasks.filter(t => t.repeatType === todayType);

  const personalTasks = activeTasks
    .filter(t => t.category === 'personal')
    .map(t => ({ id: t.id, title_pt: t.title, title_en: t.title, priority: 'normal' as const, completed: t.completed, time: t.time, date: t.date, notes: t.notes }));

  const workTasks = activeTasks
    .filter(t => t.category === 'work')
    .map(t => ({ id: t.id, title_pt: t.title, title_en: t.title, priority: 'normal' as const, completed: t.completed, time: t.time, date: t.date, notes: t.notes }));

  const handleAddTask = (title: string, category: 'personal' | 'work') => {
    addMasterTask({ title, category, repeatType: todayType });
  };

  const toggleTask = (id: string) => toggleMasterTask(id);
  const handleDeleteTask = (id: string) => deleteMasterTask(id);

  // Calculate overall progress
  const allTasks = [...personalTasks, ...workTasks];
  const completedCount = allTasks.filter((t) => t.completed).length;
  const overallProgress = allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0;

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

      {/* Progress Section */}
      <div className="dashboard-progress" style={{ gridColumn: '1 / -1' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'var(--weight-semibold)', whiteSpace: 'nowrap' }}>Progresso do dia</span>
            <span style={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>{overallProgress}%</span>
          </div>
        </div>
      </div>

      {/* Main Columns */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={dashboardOrder} strategy={rectSortingStrategy}>
          <div className="dashboard-columns" style={{ 
            columnCount: 'auto', 
            columnWidth: '350px', 
            columnGap: 'var(--space-4)',
            width: '100%'
          }}>
            {dashboardOrder.map(id => (
              <SortableCard key={id} id={id} render={(dragProps) => (
                <>
                  {id === 'personal' && (
                    <TaskColumn 
                      dragHandleProps={dragProps}
                      category="personal" 
                      tasks={personalTasks} 
                      onToggleTask={toggleTask}
                      onDeleteTask={handleDeleteTask}
                      onUpdateTask={updateMasterTask}
                      onAddSubmit={(title) => handleAddTask(title, 'personal')}
                    />
                  )}
                  {id === 'work' && (
                    <TaskColumn 
                      dragHandleProps={dragProps}
                      category="work" 
                      tasks={workTasks} 
                      onToggleTask={toggleTask}
                      onDeleteTask={handleDeleteTask}
                      onUpdateTask={updateMasterTask}
                      onAddSubmit={(title) => handleAddTask(title, 'work')}
                    />
                  )}
                  {id === 'college' && <CollegeCard dragHandleProps={dragProps} />}
                  {id === 'church' && <ChurchCard dragHandleProps={dragProps} />}
                </>
              )} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Agenda */}
      <div className="dashboard-agenda">
        <AgendaPreview tasks={agendaEvents} />
      </div>
    </div>
  );
}
