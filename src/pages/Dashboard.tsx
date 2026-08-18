import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, type DragEndEvent, type DragOverEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDataStore } from '../stores/useDataStore';
import SpiritualCard from '../components/dashboard/SpiritualCard';
import WaterTracker from '../components/dashboard/WaterTracker';
import TaskColumn from '../components/dashboard/TaskColumn';
import CollegeCard from '../components/dashboard/CollegeCard';
import ChurchCard from '../components/dashboard/ChurchCard';
import AgendaPreview from '../components/dashboard/AgendaPreview';
import { useTranslation } from 'react-i18next';

function SortableCard({ id, render }: { id: string, render: (dragHandleProps: any) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    display: 'block',
    width: '100%',
  };
  return (
    <div ref={setNodeRef} style={style}>
      {render({ ...attributes, ...listeners })}
    </div>
  );
}

function DroppableColumn({ id, items, renderItem }: { id: string, items: string[], renderItem: (id: string) => React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  
  return (
    <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
      <div 
        ref={setNodeRef} 
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minHeight: '150px' }}
      >
        {items.map(renderItem)}
      </div>
    </SortableContext>
  );
}

export default function Dashboard() {
  const { i18n } = useTranslation();
  const { masterTasks, toggleMasterTask, deleteMasterTask, updateMasterTask, addMasterTask, reorderMasterTasks, agendaEvents, dashboardColumns, setDashboardColumns } = useDataStore();

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let activeContainerIndex = -1;
    let overContainerIndex = -1;

    dashboardColumns.forEach((col, index) => {
      if (col.includes(activeId)) activeContainerIndex = index;
      if (col.includes(overId) || `col-${index}` === overId) overContainerIndex = index;
    });

    if (
      activeContainerIndex === -1 ||
      overContainerIndex === -1 ||
      activeContainerIndex === overContainerIndex
    ) {
      return;
    }

    const activeItems = dashboardColumns[activeContainerIndex];
    const overItems = dashboardColumns[overContainerIndex];
    const activeIndex = activeItems.indexOf(activeId);
    let overIndex = overItems.indexOf(overId);

    if (overId.startsWith('col-')) {
      overIndex = overItems.length;
    }

    const newColumns = [...dashboardColumns];
    newColumns[activeContainerIndex] = [...activeItems];
    newColumns[overContainerIndex] = [...overItems];

    newColumns[activeContainerIndex].splice(activeIndex, 1);
    newColumns[overContainerIndex].splice(overIndex, 0, activeId);

    setDashboardColumns(newColumns);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let activeContainerIndex = -1;
    let overContainerIndex = -1;

    dashboardColumns.forEach((col, index) => {
      if (col.includes(activeId)) activeContainerIndex = index;
      if (col.includes(overId) || `col-${index}` === overId) overContainerIndex = index;
    });

    if (activeContainerIndex !== -1 && activeContainerIndex === overContainerIndex) {
      const items = dashboardColumns[activeContainerIndex];
      const activeIndex = items.indexOf(activeId);
      const overIndex = items.indexOf(overId);

      if (activeIndex !== overIndex) {
        const newColumns = [...dashboardColumns];
        newColumns[activeContainerIndex] = arrayMove(items, activeIndex, overIndex);
        setDashboardColumns(newColumns);
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const dayIndex = new Date().getDay();
  let todayType: 'weekday' | 'saturday' | 'sunday' = 'weekday';
  if (dayIndex === 0) todayType = 'sunday';
  if (dayIndex === 6) todayType = 'saturday';

  const activeTasks = masterTasks.filter(t => t.repeatType === todayType);

  const personalTasks = activeTasks
    .filter(t => t.category === 'personal')
    .map(t => ({ id: t.id, title_pt: t.title_pt, title_en: t.title_en || t.title_pt, priority: 'normal' as const, completed: t.completed, time: t.time, date: t.date, notes: t.notes }));

  const workTasks = activeTasks
    .filter(t => t.category === 'work')
    .map(t => ({ id: t.id, title_pt: t.title_pt, title_en: t.title_en || t.title_pt, priority: 'normal' as const, completed: t.completed, time: t.time, date: t.date, notes: t.notes }));

  const handleAddTask = (title: string, category: 'personal' | 'work') => {
    addMasterTask({ title_pt: title, category, repeatType: todayType });
  };

  const toggleTask = (id: string) => toggleMasterTask(id);
  const handleDeleteTask = (id: string) => deleteMasterTask(id);

  const allTasks = [...personalTasks, ...workTasks];
  const completedCount = allTasks.filter((t) => t.completed).length;
  const overallProgress = allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0;

  const renderCard = (id: string, dragProps: any) => {
    if (id === 'personal') {
      return (
        <TaskColumn 
          dragHandleProps={dragProps}
          category="personal" 
          tasks={personalTasks} 
          onToggleTask={toggleTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={updateMasterTask}
          onAddSubmit={(title) => handleAddTask(title, 'personal')}
          onReorderTask={reorderMasterTasks}
        />
      );
    }
    if (id === 'work') {
      return (
        <TaskColumn 
          dragHandleProps={dragProps}
          category="work" 
          tasks={workTasks} 
          onToggleTask={toggleTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={updateMasterTask}
          onAddSubmit={(title) => handleAddTask(title, 'work')}
          onReorderTask={reorderMasterTasks}
        />
      );
    }
    if (id === 'college') return <CollegeCard dragHandleProps={dragProps} />;
    if (id === 'church') return <ChurchCard dragHandleProps={dragProps} />;
    return null;
  };

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
        <div className="card" style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', whiteSpace: 'nowrap' }}>
              {i18n.language === 'en' ? 'Daily Progress' : 'Progresso do dia'}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>{overallProgress}%</span>
          </div>
          <div style={{ width: '100%', height: 4, background: 'var(--color-bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--color-primary)', width: `${overallProgress}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* Main Columns */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="dashboard-columns" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)', alignItems: 'start' }}>
          {(dashboardColumns || []).map((colItems, colIndex) => (
            <DroppableColumn key={colIndex} id={`col-${colIndex}`} items={colItems} renderItem={(id) => (
              <SortableCard key={id} id={id} render={(dragProps) => renderCard(id, dragProps)} />
            )} />
          ))}
        </div>
      </DndContext>

      {/* Agenda */}
      <div className="dashboard-agenda">
        <AgendaPreview tasks={agendaEvents} />
      </div>
    </div>
  );
}
