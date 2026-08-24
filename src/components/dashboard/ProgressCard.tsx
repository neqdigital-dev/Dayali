import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

interface ProgressCardProps {
  completed: number;
  total: number;
}

export default function ProgressCard({ completed, total }: ProgressCardProps) {
  const { t } = useTranslation('dashboard');
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="card progress-card">
      <div className="progress-header">
        <h3 className="progress-title">{t('progress.title')}</h3>
        <span className="progress-percentage">{percentage}%</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            background:
              percentage >= 80
                ? 'var(--color-success)'
                : percentage >= 50
                ? 'var(--color-primary)'
                : 'var(--color-warning)',
          }}
        />
      </div>

      <p className="progress-detail text-sm text-secondary">
        {t('progress.tasks_done', { done: completed, total })}
      </p>
    </div>
  );
}
