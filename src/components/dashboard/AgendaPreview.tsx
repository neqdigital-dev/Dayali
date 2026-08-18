import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, ChevronRight, Plus, ChevronLeft, Trash2 } from 'lucide-react';
import { useDataStore } from '../../stores/useDataStore';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];


export default function AgendaPreview({ tasks = [] }: { tasks?: any[] }) {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const { addAgendaEvent, deleteAgendaEvent } = useDataStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'list'>('month');
  
  const [addingEventToDay, setAddingEventToDay] = useState<number | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('personal');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const blanks = Array.from({ length: firstDayOfWeek }).map((_, i) => i);
  const days = Array.from({ length: daysInMonth }).map((_, i) => i + 1);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const monthLabel = `${monthNames[month]} de ${year}`;

  const taskEvents = tasks.reduce((acc, task) => {
    if (task.date) {
      const taskDate = new Date(task.date);
      // Ajuste simples de timezone para pegar o dia exato da string YYYY-MM-DD
      const localDate = new Date(taskDate.getTime() + taskDate.getTimezoneOffset() * 60000);
      if (localDate.getMonth() === month && localDate.getFullYear() === year) {
        const day = localDate.getDate().toString();
        if (!acc[day]) acc[day] = [];
        const displayTitle = i18n.language === 'en' && task.title_en ? task.title_en : task.title_pt || task.title;
        acc[day].push({ id: task.id, title: displayTitle, type: task.category });
      }
    }
    return acc;
  }, {} as Record<string, { id?: string; title: string; type: string }[]>);

  const handleDayAddSubmit = (dayNum: number) => {
    if (newEventTitle.trim()) {
      const dateStr = new Date(year, month, dayNum, 12).toISOString().split('T')[0];
      addAgendaEvent({ title_pt: newEventTitle.trim(), category: newEventCategory, date: dateStr, subtopics: [] });
      setNewEventTitle('');
      setAddingEventToDay(null);
    }
  };

  const getEventsForDay = (day: string) => {
    return taskEvents[day] || [];
  };

  const getWeekDays = () => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const startOfWeek = new Date(d.setDate(diff));
    const week = [];
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      week.push(weekDay);
    }
    return week;
  };

  return (
    <div className="card agenda-card">
      <div className="agenda-card-header" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="agenda-card-title-row">
          <CalendarIcon size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="agenda-card-title">{t('agenda.title', { ns: 'dashboard', defaultValue: 'Agenda (Visão Calendário)' })}</h3>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn-icon" title={t('actions.add')} style={{ width: 28, height: 28, background: 'var(--color-bg-subtle)' }}>
            <Plus size={16} />
          </button>
          <div style={{ display: 'flex', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
            <button className={`btn btn-sm ${view === 'month' ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '0 8px' }} onClick={() => setView('month')}>{t('view.monthly', { ns: 'dashboard', defaultValue: 'Mensal' })}</button>
            <button className={`btn btn-sm ${view === 'week' ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '0 8px' }} onClick={() => setView('week')}>{t('view.weekly', { ns: 'dashboard', defaultValue: 'Semanal' })}</button>
            <button className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '0 8px' }} onClick={() => setView('list')}>{t('view.list', { ns: 'dashboard', defaultValue: 'Lista' })}</button>
          </div>
        </div>
      </div>

      <div className="agenda-calendar-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <span style={{ fontWeight: 'var(--weight-semibold)' }}>{monthLabel}</span>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn-icon" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}><ChevronLeft size={16}/></button>
          <button className="btn btn-ghost btn-sm" onClick={() => setCurrentDate(new Date())}>{t('agenda.today', { ns: 'dashboard', defaultValue: 'Hoje' })}</button>
          <button className="btn-icon" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}><ChevronRight size={16}/></button>
        </div>
      </div>

      {view === 'month' && (

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
          const events = getEventsForDay(day.toString());
          return (
            <div key={day} style={{ 
              background: 'var(--color-bg-base)', 
              minHeight: '80px', 
              padding: 'var(--space-2)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ 
                  fontSize: 'var(--text-sm)', 
                  opacity: 0.8,
                  fontWeight: day === 1 ? 'var(--weight-bold)' : 'normal'
                }}>
                  {day === 1 ? '1 de ' + monthNames[month].substring(0, 3).toLowerCase() + '.' : day}
                </span>
                <button 
                  onClick={() => { setAddingEventToDay(day); setNewEventTitle(''); setNewEventCategory('personal'); }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus size={12} />
                </button>
              </div>

              <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {events.map((ev: any, i: number) => (
                  <div key={i} style={{
                    fontSize: '0.65rem',
                    padding: '2px 4px',
                    background: ev.type === 'preaching' ? 'var(--color-bg-subtle)' : 'var(--color-bg-elevated)',
                    borderLeft: `2px solid ${ev.type === 'preaching' ? 'var(--color-preaching)' : 'var(--color-primary)'}`,
                    borderRadius: '2px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</span>
                    {ev.id && (
                      <button onClick={() => deleteAgendaEvent(ev.id!)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
                        <Trash2 size={10} color="var(--color-error)" />
                      </button>
                    )}
                  </div>
                ))}
                
                {addingEventToDay === day && (
                  <div style={{ marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }} onClick={e => e.stopPropagation()}>
                    <input
                      autoFocus
                      type="text"
                      value={newEventTitle}
                      onChange={e => setNewEventTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleDayAddSubmit(day);
                        if (e.key === 'Escape') setAddingEventToDay(null);
                      }}
                      placeholder="Título..."
                      style={{ width: '100%', fontSize: '0.65rem', padding: '2px', outline: 'none', border: '1px solid var(--color-border)', borderRadius: '2px', color: 'var(--color-text-primary)', background: 'var(--color-bg-base)' }}
                    />
                    <select
                      value={newEventCategory}
                      onChange={e => setNewEventCategory(e.target.value)}
                      style={{ width: '100%', fontSize: '0.65rem', padding: '2px', outline: 'none', border: '1px solid var(--color-border)', borderRadius: '2px', color: 'var(--color-text-primary)', background: 'var(--color-bg-base)' }}
                    >
                      <option value="personal">Pessoal</option>
                      <option value="work">Trabalho</option>
                      <option value="college">Faculdade</option>
                      <option value="church">Igreja</option>
                    </select>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <button style={{ flex: 1, fontSize: '0.6rem', padding: '2px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '2px', cursor: 'pointer' }} onClick={() => handleDayAddSubmit(day)}>OK</button>
                      <button style={{ flex: 1, fontSize: '0.6rem', padding: '2px', background: 'var(--color-bg-subtle)', color: 'var(--color-text-secondary)', border: 'none', borderRadius: '2px', cursor: 'pointer' }} onClick={() => setAddingEventToDay(null)}>X</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {view === 'week' && (
        <div className="agenda-calendar-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '1px', 
          background: 'var(--color-border)', 
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden'
        }}>
          {getWeekDays().map((date, i) => {
            const dayNum = date.getDate();
            const isCurrentMonth = date.getMonth() === month;
            const events = isCurrentMonth ? getEventsForDay(dayNum.toString()) : [];
            
            return (
              <div key={i} style={{ 
                background: 'var(--color-bg-base)', 
                minHeight: '150px', 
                padding: 'var(--space-2)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{WEEKDAYS[i]}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: 'var(--text-sm)', opacity: isCurrentMonth ? 0.8 : 0.4 }}>{dayNum}</span>
                    <button 
                      onClick={() => { setAddingEventToDay(dayNum); setNewEventTitle(''); setNewEventCategory('personal'); }}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {events.map((ev: any, i: number) => (
                    <div key={i} style={{
                      fontSize: '0.65rem',
                      padding: '2px 4px',
                      background: ev.type === 'preaching' ? 'var(--color-bg-subtle)' : 'var(--color-bg-elevated)',
                      borderLeft: `2px solid ${ev.type === 'preaching' ? 'var(--color-preaching)' : 'var(--color-primary)'}`,
                      borderRadius: '2px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</span>
                      {ev.id && (
                        <button onClick={() => deleteAgendaEvent(ev.id!)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
                          <Trash2 size={10} color="var(--color-error)" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {addingEventToDay === dayNum && isCurrentMonth && (
                    <div style={{ marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }} onClick={e => e.stopPropagation()}>
                      <input
                        autoFocus
                        type="text"
                        value={newEventTitle}
                        onChange={e => setNewEventTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleDayAddSubmit(dayNum);
                          if (e.key === 'Escape') setAddingEventToDay(null);
                        }}
                        placeholder="Título..."
                        style={{ width: '100%', fontSize: '0.65rem', padding: '2px', outline: 'none', border: '1px solid var(--color-border)', borderRadius: '2px', color: 'var(--color-text-primary)', background: 'var(--color-bg-base)' }}
                      />
                      <select
                        value={newEventCategory}
                        onChange={e => setNewEventCategory(e.target.value)}
                        style={{ width: '100%', fontSize: '0.65rem', padding: '2px', outline: 'none', border: '1px solid var(--color-border)', borderRadius: '2px', color: 'var(--color-text-primary)', background: 'var(--color-bg-base)' }}
                      >
                        <option value="personal">Pessoal</option>
                        <option value="work">Trabalho</option>
                        <option value="college">Faculdade</option>
                        <option value="church">Igreja</option>
                      </select>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <button style={{ flex: 1, fontSize: '0.6rem', padding: '2px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '2px', cursor: 'pointer' }} onClick={() => handleDayAddSubmit(dayNum)}>OK</button>
                        <button style={{ flex: 1, fontSize: '0.6rem', padding: '2px', background: 'var(--color-bg-subtle)', color: 'var(--color-text-secondary)', border: 'none', borderRadius: '2px', cursor: 'pointer' }} onClick={() => setAddingEventToDay(null)}>X</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'list' && (
        <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-tertiary)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
          Visualização em Lista em construção...
        </div>
      )}
    </div>
  );
}
