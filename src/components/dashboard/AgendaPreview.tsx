import { useTranslation } from 'react-i18next';
import { Calendar, ChevronRight, Mic, MapPin, Info } from 'lucide-react';

interface AgendaEvent {
  id: string;
  time: string;
  title_pt: string;
  title_en: string;
  type?: 'default' | 'preaching' | 'participation' | 'informative';
}

interface DayEvents {
  label_pt: string;
  label_en: string;
  events: AgendaEvent[];
}

// Demo data
const demoAgenda: DayEvents[] = [
  {
    label_pt: 'Hoje',
    label_en: 'Today',
    events: [
      { id: '1', time: '09:00', title_pt: 'Reunião de equipe', title_en: 'Team meeting', type: 'default' },
      { id: '2', time: '14:00', title_pt: 'Aula — Banco de Dados', title_en: 'Class — Database', type: 'default' },
      { id: '3', time: '19:30', title_pt: 'Reunião de liderança', title_en: 'Leadership meeting', type: 'participation' },
    ],
  },
  {
    label_pt: 'Amanhã',
    label_en: 'Tomorrow',
    events: [
      { id: '4', time: '08:00', title_pt: 'Aula — Estruturas de Dados', title_en: 'Class — Data Structures', type: 'default' },
      { id: '5', time: '19:00', title_pt: 'Pregação — Igreja Vila Tereza', title_en: 'Preaching — Vila Tereza Church', type: 'preaching' },
    ],
  },
];

const typeConfig = {
  default: { color: 'var(--color-primary)', icon: null },
  preaching: { color: 'var(--color-preaching)', icon: Mic },
  participation: { color: 'var(--color-participation)', icon: MapPin },
  informative: { color: 'var(--color-informative)', icon: Info },
};

export default function AgendaPreview() {
  const { t, i18n } = useTranslation('dashboard');
  const lang = i18n.language;

  return (
    <div className="card agenda-card">
      <div className="agenda-card-header">
        <div className="agenda-card-title-row">
          <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="agenda-card-title">{t('agenda_preview.title')}</h3>
        </div>
        <button className="btn btn-ghost btn-sm">
          <span className="text-sm">{t('agenda_preview.view_all')}</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="agenda-card-body">
        {demoAgenda.map((day, dayIndex) => (
          <div key={dayIndex} className="agenda-section">
            <p className="agenda-day-label">
              {lang === 'en' ? day.label_en : day.label_pt}
            </p>
            {day.events.map((event) => {
              const config = typeConfig[event.type || 'default'];
              const TypeIcon = config.icon;

              return (
                <div key={event.id} className="agenda-event">
                  <span className="agenda-time">{event.time}</span>
                  <div
                    className="agenda-event-indicator"
                    style={{ background: config.color }}
                  />
                  <span className="agenda-event-title">
                    {lang === 'en' && event.title_en ? event.title_en : event.title_pt}
                  </span>
                  {TypeIcon && (
                    <span
                      className={`badge badge-${event.type}`}
                      style={{ marginLeft: 'auto', padding: '2px 6px' }}
                    >
                      <TypeIcon size={12} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {demoAgenda.length === 0 && (
          <p className="text-sm text-tertiary" style={{ padding: 'var(--space-4) 0', textAlign: 'center' }}>
            {t('agenda_preview.no_events')}
          </p>
        )}
      </div>
    </div>
  );
}
