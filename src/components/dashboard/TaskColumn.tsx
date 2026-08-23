import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Plus, GripVertical, Check, Trash2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Category } from '../../lib/constants';

interface TaskItem {
  id: string;
  title_pt: string;
  title_en?: string | null;
  completed: boolean;
  priority: 'low' | 'normal' | 'high';
  time?: string;
  date?: string;
  notes?: string;
}

interface TaskColumnProps {
  category: Category;
  tasks: TaskItem[];
  onToggleTask?: (id: string, completed: boolean) => void;
  onDeleteTask?: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<TaskItem>) => void;
  onAddSubmit?: (title: string, repeat: boolean) => void;
  onReorderTask?: (activeId: string, overId: string) => void;
  dragHandleProps?: any;
}

const categoryConfig: Record<Category, { iconBg: string; label: string }> = {
  personal: { iconBg: 'personal', label: 'category.personal' },
  work: { iconBg: 'work', label: 'category.work' },
  college: { iconBg: 'college', label: 'category.college' },
  church: { iconBg: 'church', label: 'category.church' },
};

function SortableTask({ task, onToggleTask, onDeleteTask, onUpdateTask }: { task: TaskItem; onToggleTask?: (id: string, c: boolean) => void; onDeleteTask?: (id: string) => void; onUpdateTask?: (id: string, u: Partial<TaskItem>) => void }) {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  const isEn = i18n.language === 'en';
  const displayTitle = isEn && task.title_en ? task.title_en : task.title_pt;
  
  const [editTitle, setEditTitle] = useState(task.title_pt);
  const [editTime, setEditTime] = useState(task.time || '');
  const [editDate, setEditDate] = useState(task.date || '');
  const [editNotes, setEditNotes] = useState(task.notes || '');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const
  };

  const handleSaveSettings = () => {
    onUpdateTask?.(task.id, { time: editTime, date: editDate, notes: editNotes, title_pt: editTitle.trim() || task.title_pt });
    setIsEditing(false);
    setIsEditingTitle(false);
  };

  const handleSaveTitleInline = () => {
    if (editTitle.trim() && editTitle !== task.title_pt) {
      onUpdateTask?.(task.id, { title_pt: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        layout
        className={`task-item ${task.completed ? 'completed' : ''}`}
      >
        <div 
          {...attributes} 
          {...listeners}
          style={{ cursor: 'grab', display: 'flex', alignItems: 'center', opacity: 0.3, paddingRight: 'var(--space-2)' }}
        >
          <GripVertical size={16} />
        </div>

        <div 
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggleTask?.(task.id, task.completed)}
        >
          {task.completed && <Check size={14} />}
        </div>

        <div className="task-content" style={{ flex: 1, cursor: 'pointer' }} onClick={() => { if(!isEditingTitle) setIsEditing(true); }}>
          {isEditingTitle ? (
            <input
              autoFocus
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitleInline}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitleInline();
                if (e.key === 'Escape') { setEditTitle(task.title_pt); setIsEditingTitle(false); }
              }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', fontSize: 'var(--text-sm)', border: 'none', background: 'transparent', outline: 'none', color: 'var(--color-text-primary)' }}
            />
          ) : (
            <span 
              className="task-title" 
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              onClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); setEditTitle(task.title_pt); }}
            >
              {displayTitle}
            </span>
          )}
          
          {task.priority === 'high' && (
            <span className="badge badge-error" style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
              High
            </span>
          )}
          {(task.time || task.date || task.notes) && (
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
              {task.time && <span className="badge" style={{ background: 'var(--color-bg-subtle)', fontSize: '9px' }}>{task.time}</span>}
              {task.date && <span className="badge" style={{ background: 'var(--color-bg-subtle)', fontSize: '9px' }}>{task.date.split('-').reverse().join('/')}</span>}
              {task.notes && <span className="badge" style={{ background: 'var(--color-bg-subtle)', fontSize: '9px', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.notes}</span>}
            </div>
          )}
        </div>

        <div className="task-actions" style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={() => onDeleteTask?.(task.id)}>
            <Trash2 size={16} color="var(--color-error)" />
          </button>
        </div>
      </motion.div>

      {/* MODAL DE EDIÇÃO DE TAREFA */}
      {isEditing && (
        <div 
          onClick={() => setIsEditing(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: 'var(--space-4)'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{
              width: '100%',
              maxWidth: '400px',
              background: 'var(--color-bg-base)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Editar Tarefa</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Título</label>
              <input 
                type="text" 
                value={editTitle} 
                onChange={e => setEditTitle(e.target.value)} 
                className="input" 
                style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'transparent' }} 
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Horário</label>
                <input 
                  type="time" 
                  value={editTime} 
                  onChange={e => setEditTime(e.target.value)} 
                  className="input" 
                  style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'transparent' }} 
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Data</label>
                <input 
                  type="date" 
                  value={editDate} 
                  onChange={e => setEditDate(e.target.value)} 
                  className="input" 
                  style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'transparent' }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Observações</label>
              <textarea 
                value={editNotes} 
                onChange={e => setEditNotes(e.target.value)}
                placeholder="Anotações..."
                className="input"
                style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'var(--color-bg-subtle)', minHeight: '80px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSaveSettings}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function TaskColumn({ category, tasks: initialTasks, onToggleTask, onDeleteTask, onUpdateTask, onAddSubmit, onReorderTask, dragHandleProps }: TaskColumnProps) {
  const { t } = useTranslation(['dashboard', 'common']);
  const [tasks, setTasks] = useState(initialTasks);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [repeatNewTask, setRepeatNewTask] = useState(false);
  const config = categoryConfig[category];

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      if (onReorderTask) {
        onReorderTask(active.id, over.id);
      }
    }
  };

  const handleAddSubmit = () => {
    if (newTaskTitle.trim() && onAddSubmit) {
      onAddSubmit(newTaskTitle.trim(), repeatNewTask);
      setNewTaskTitle('');
      setRepeatNewTask(false);
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddSubmit();
    if (e.key === 'Escape') setIsAdding(false);
  };

  return (
    <div className={`card card-category ${category}`}>
      <div className="task-column-header">
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {dragHandleProps && (
                <div {...dragHandleProps} style={{ cursor: 'grab', opacity: 0.4, display: 'flex' }}>
                  <GripVertical size={16} />
                </div>
              )}
              <span className={`badge badge-${config.iconBg}`}>{t(config.label, { ns: 'common' })}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="task-column-count text-sm text-tertiary">{completedCount}/{tasks.length}</span>
              <button className="btn-icon" title={t('actions.add', { ns: 'common' })} onClick={() => { setIsAdding(true); setNewTaskTitle(''); }}>
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div style={{ height: 4, background: 'var(--color-bg-subtle)', borderRadius: 2, width: '100%', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: `var(--color-${category})`, width: `${progress}%`, transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      <div className="task-column-list">
        {isAdding && (
          <div className="task-item" style={{ padding: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <div className="task-checkbox" style={{ opacity: 0.5, cursor: 'default' }} />
              <input
                type="text"
                autoFocus
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('actions.add', { ns: 'common' }) + '...'}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-primary)'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '28px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={repeatNewTask} onChange={(e) => setRepeatNewTask(e.target.checked)} />
                Repetir toda semana?
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: '10px', padding: '2px 6px' }} onClick={() => setIsAdding(false)}>Cancelar</button>
                <button className="btn btn-primary btn-sm" style={{ fontSize: '10px', padding: '2px 6px' }} onClick={handleAddSubmit}>Adicionar</button>
              </div>
            </div>
          </div>
        )}
        {tasks.length === 0 && !isAdding ? (
          <p className="task-column-empty text-sm text-tertiary">{t('empty.tasks', { ns: 'common' })}</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <SortableTask key={task.id} task={task} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} onUpdateTask={onUpdateTask} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
