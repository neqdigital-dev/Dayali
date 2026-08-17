import { useState } from 'react';
// Forcing Vite HMR
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Check, Droplet } from 'lucide-react';

const WATER_STEPS = [
  { id: 'fill', label: 'Encher Garrafa', icon: '🚰' },
  { id: 'two_cups', label: '2 Copos', icon: '🥛' },
  { id: 'half', label: 'Meia Garrafa', icon: '🥤' },
  { id: 'full', label: 'Garrafa Seca', icon: '✅' },
];

export default function WaterTracker() {
  const { t } = useTranslation('dashboard');
  
  // Temporary state for the 4 steps (will come from DB later)
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    fill: false,
    two_cups: false,
    half: false,
    full: false,
  });

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isComplete = Object.values(completedSteps).every(Boolean);

  return (
    <div className={`water-tracker ${isComplete ? 'water-complete' : ''}`} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
        <div className="water-icon">
          <Droplet size={20} />
        </div>
        <span className="water-label" style={{ fontWeight: 'var(--weight-semibold)' }}>{t('water.title')}</span>
      </div>

      <div className="water-checklist" style={{ display: 'flex', flexDirection: 'row', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {WATER_STEPS.map((step) => {
          const isChecked = completedSteps[step.id];
          return (
            <motion.div
              key={step.id}
              className="task-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                opacity: isChecked ? 0.6 : 1,
                background: isChecked ? 'var(--color-bg-subtle)' : 'var(--color-bg-elevated)',
                transition: 'all 0.2s ease',
                flex: '1 1 auto',
                minWidth: '120px'
              }}
              onClick={() => toggleStep(step.id)}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`task-checkbox ${isChecked ? 'checked' : ''}`}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  border: `2px solid ${isChecked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isChecked ? 'var(--color-primary)' : 'transparent',
                }}
              >
                {isChecked && <Check size={14} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: '1rem' }}>{step.icon}</span>
              <span style={{ 
                fontSize: 'var(--text-sm)',
                textDecoration: isChecked ? 'line-through' : 'none',
                whiteSpace: 'nowrap'
              }}>
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
