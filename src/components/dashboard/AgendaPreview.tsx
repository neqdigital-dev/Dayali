import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, ChevronRight, Plus, ChevronLeft } from 'lucide-react';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Demo Data matching his request
const demoEvents: Record<string, { title: string; type: string }[]> = {
  '19': [{ title: 'Pregação vila tera', type: 'preaching' }],
  '26': [{ title: 'Start Mission IACS', type: 'participation' }],
  '27': [{ title: 'One Day', type: 'default' }],
};

export default function AgendaPreview() {
  const { t } = useTranslation('dashboard');
  const [currentDate] = useState(new Date(2026, 8, 1)); // Setembro 2026 for demo

  // Simple calendar math for Sept 2026
  const daysInMonth = 30;
  const firstDayOfWeek = 2; // Sept 1st 2026 is a Tuesday (0=Sun, 1=Mon, 2=Tue)

  const blanks = Array.from({ length: firstDayOfWeek }).map((_, i) => i);
  const days = Array.from({ length: daysInMonth }).map((_, i) => i + 1);

  return (
    <div className="card agenda-card">
      <div className="agenda-card-header" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="agenda-card-title-row">
          <CalendarIcon size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="agenda-card-title">Agenda (Visão Calendário)</h3>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn-icon" title={t('actions.add')} style={{ width: 28, height: 28, background: 'var(--color-bg-subtle)' }}>
            <Plus size={16} />
          </button>
          <button className="btn btn-ghost btn-sm">
            <span className="text-sm">Semanal</span>
          </button>
        </div>
      </div>

      <div className="agenda-calendar-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <span style={{ fontWeight: 'var(--weight-semibold)' }}>Setembro de 2026</span>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn-icon"><ChevronLeft size={16}/></button>
          <button className="btn btn-ghost btn-sm">Hoje</button>
          <button className="btn-icon"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="agenda-calendar-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '1px', 
        background: 'var(--color-border)', 
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}>
        {/* Weekdays header */}
        {WEEKDAYS.map(day => (
          <div key={day} style={{ 
            background: 'var(--color-bg-base)', 
            padding: 'var(--space-2)', 
            textAlign: 'center', 
            fontSize: 'var(--text-xs)', 
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--color-text-tertiary)'
          }}>
            {day}
          </div>
        ))}

        {/* Blank days */}
        {blanks.map(b => (
          <div key={`blank-${b}`} style={{ background: 'var(--color-bg-base)', minHeight: '80px' }} />
        ))}

        {/* Days */}
        {days.map(day => {
          const events = demoEvents[day.toString()] || [];
          return (
            <div key={day} style={{ 
              background: 'var(--color-bg-base)', 
              minHeight: '80px', 
              padding: 'var(--space-2)',
              position: 'relative'
            }}>
              <span style={{ 
                fontSize: 'var(--text-sm)', 
                opacity: 0.8,
                fontWeight: day === 1 ? 'var(--weight-bold)' : 'normal'
              }}>
                {day === 1 ? '1 de set.' : day}
              </span>

              <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {events.map((ev, i) => (
                  <div key={i} style={{
                    fontSize: '0.65rem',
                    padding: '2px 4px',
                    background: ev.type === 'preaching' ? 'var(--color-bg-subtle)' : 'var(--color-bg-elevated)',
                    borderLeft: `2px solid ${ev.type === 'preaching' ? 'var(--color-preaching)' : 'var(--color-primary)'}`,
                    borderRadius: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {ev.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
