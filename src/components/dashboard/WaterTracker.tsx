import { useTranslation } from 'react-i18next';
import { Droplet } from 'lucide-react';
import { useDataStore } from '../../stores/useDataStore';

const WATER_STEPS = [
  { id: 'fill', label: 'Encher Garrafa', icon: '🚰' },
  { id: 'two_cups', label: '2 Copos', icon: '🥛' },
  { id: 'half', label: 'Meia Garrafa', icon: '🥤' },
  { id: 'full', label: 'Garrafa Seca', icon: '✅' },
];

export default function WaterTracker() {
  const { waterSteps, toggleWaterStep } = useDataStore();

  const completedCount = Object.values(waterSteps).filter(Boolean).length;
  const progressPercent = (completedCount / WATER_STEPS.length) * 100;

  return (
    <div className="card water-card" style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      
      {/* Top Section: Flex Row */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        
        {/* Left Column: Icon + Text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: 'var(--space-4)', borderRight: '1px solid var(--color-border)' }}>
          <Droplet size={20} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase', marginTop: '2px' }}>
            Água
          </span>
        </div>

        {/* Middle Column: 4 Steps */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', padding: '0 var(--space-2)' }}>
          {WATER_STEPS.map((step, index) => {
            const isChecked = waterSteps[step.id];
            return (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div 
                  onClick={() => toggleWaterStep(step.id)}
                  style={{
                    cursor: 'pointer',
                    opacity: isChecked ? 0.4 : 1,
                    transition: 'opacity 0.2s',
                    textAlign: 'center',
                    flex: 1
                  }}
                >
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: isChecked ? 'var(--weight-bold)' : 'var(--weight-medium)',
                    color: isChecked ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    textDecoration: isChecked ? 'line-through' : 'none',
                    whiteSpace: 'nowrap'
                  }}>
                    {step.label}
                  </span>
                </div>
                {index < WATER_STEPS.length - 1 && (
                  <div style={{ width: '1px', height: '20px', background: 'var(--color-border)' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Percentage */}
        <div style={{ paddingLeft: 'var(--space-4)', borderLeft: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Bottom Section: Progress Bar */}
      <div style={{ width: '100%', height: 4, background: 'var(--color-bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--color-primary)', width: `${progressPercent}%`, transition: 'width 0.4s ease' }} />
      </div>

    </div>
  );
}
