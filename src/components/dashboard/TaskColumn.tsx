import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Check, Plus, MoreHorizontal, ArrowUp, ArrowDown } from 'lucide-react';
import type { Category } from '../../lib/constants';

interface TaskItem {
  id: string;
  title_pt: string;
  title_en: string | null;
  completed: boolean;
  priority: 'low' | 'normal' | 'high';
}

interface TaskColumnProps {
  category: Category;
  tasks: TaskItem[];
  onToggleTask?: (id: string) => void;
}

const categoryConfig: Record<Category, { iconBg: string; label: string }> = {
  personal: { iconBg: 'personal', label: 'category.personal' },
  work: { iconBg: 'work', label: 'category.work' },
  college: { iconBg: 'college', label: 'category.college' },
};

export default function TaskColumn({ category, tasks, onToggleTask }: TaskColumnProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const config = categoryConfig[category];
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className={`card card-category ${category}`}>
      {/* Header */}
      <div className="task-column-header">
        <div className="task-column-title-row">
          <span className={`badge badge-${config.iconBg}`}>
            {t(config.label)}
          </span>
          <span className="task-column-count text-sm text-tertiary" style={{ marginLeft: 'auto', marginRight: 'var(--space-2)' }}>
            {completedCount}/{tasks.length}
          </span>
          <button className="btn-icon" title={t('actions.add')} style={{ width: 24, height: 24, background: 'var(--color-bg-subtle)' }}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="task-column-list">
        {tasks.length === 0 ? (
          <p className="task-column-empty text-sm text-tertiary">
            {t('empty.tasks')}
          </p>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              className={`task-item ${task.completed ? 'completed' : ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => onToggleTask?.(task.id)}
            >
              <motion.div
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                whileTap={{ scale: 0.85 }}
              >
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check size={14} />
                  </motion.div>
                )}
              </motion.div>

              <div className="task-content" style={{ flex: 1 }}>
                <span className="task-title">
                  {lang === 'en' && task.title_en ? task.title_en : task.title_pt}
                </span>
                {task.priority === 'high' && (
                  <span className="badge badge-error" style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                    {t('priority.high')}
                  </span>
                )}
              </div>

              <div className="task-actions" style={{ display: 'flex', gap: '2px', opacity: 0.5 }}>
                <button className="btn-icon" style={{ width: 20, height: 20 }}>
                  <ArrowUp size={12} />
                </button>
                <button className="btn-icon" style={{ width: 20, height: 20 }}>
                  <ArrowDown size={12} />
                </button>
                <button className="btn-icon" style={{ width: 20, height: 20 }}>
                  <MoreHorizontal size={12} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
