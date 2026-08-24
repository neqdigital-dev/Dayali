import { useTranslation } from 'react-i18next';
import { Droplet, Check } from 'lucide-react';
import { useDataStore } from '../../stores/useDataStore';

const WATER_STEPS = [
  { id: 'two_cups', label: '2 Copos', icon: '🥛' },
  { id: 'fill', label: 'Encher Garrafa', icon: '🚰' },
  { id: 'half', label: 'Meia Garrafa', icon: '🥤' },
  { id: 'full', label: 'Garrafa Seca', icon: '✅' },
];

export default function WaterTracker() {
  const { t } = useTranslation(['dashboard']);
  const { waterSteps, toggleWaterStep } = useDataStore();

  const completedCount = Object.values(waterSteps).filter(Boolean).length;
  const progressPercent = (completedCount / WATER_STEPS.length) * 100;

  return (
    <div className="card card-category personal">
      <div className="task-column-header">
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-personal" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Droplet size={14} />
                {t('progress.water', { ns: 'dashboard', defaultValue: 'Água' })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="task-column-count text-sm text-tertiary">{completedCount}/{WATER_STEPS.length}</span>
            </div>
          </div>
          <div style={{ height: 4, background: 'var(--color-bg-subtle)', borderRadius: 2, width: '100%', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--color-personal)', width: `${progressPercent}%`, transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      <div className="task-column-list water-tracker-list">
        {WATER_STEPS.map((step) => {
          const isChecked = waterSteps[step.id];
          return (
            <div 
              key={step.id} 
              className={`task-item ${isChecked ? 'completed' : ''}`}
              onClick={() => toggleWaterStep(step.id)}
              style={{ flex: 1, minWidth: '100px', display: 'flex', alignItems: 'center' }}
            >
              <div className={`task-checkbox ${isChecked ? 'checked' : ''}`} style={{ flexShrink: 0 }}>
                {isChecked && <Check size={14} />}
              </div>
              <div className="task-content" style={{ flex: 1, cursor: 'pointer', overflow: 'hidden' }}>
                <span 
                  className="task-title" 
                  style={{ 
                    textDecoration: isChecked ? 'line-through' : 'none', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    display: 'block'
                  }}
                >
                  {t(`water.${step.id}`, { ns: 'dashboard', defaultValue: step.label })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
