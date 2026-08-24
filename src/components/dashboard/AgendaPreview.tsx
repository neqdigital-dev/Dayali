import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, ChevronRight, Plus, ChevronLeft, Trash2, Check, X } from 'lucide-react';
import { useDataStore } from '../../stores/useDataStore';
import Modal from '../ui/Modal';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];


export default function AgendaPreview({ tasks: _tasks = [] }: { tasks?: any[] }) {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const { masterTasks, agendaEvents, addAgendaEvent, deleteAgendaEvent, toggleAgendaEvent, addMasterTask, toggleMasterTask, deleteMasterTask } = useDataStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'list'>('month');
  
  const [addingEventToDay, setAddingEventToDay] = useState<number | null>(null);
  const [viewingDayEvents, setViewingDayEvents] = useState<{ day: number, events: any[] } | null>(null);
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

  const allItems = [
    ...agendaEvents.map(e => ({ ...e, isMasterTask: false, title: e.title_pt })),
    ...masterTasks.filter(t => t.date).map(t => ({ ...t, isMasterTask: true, title: t.title_pt }))
  ];

  const taskEvents = allItems.reduce((acc, task) => {
    if (task.date) {
      const taskDate = new Date(task.date);
      // Ajuste simples de timezone para pegar o dia exato da string YYYY-MM-DD
      const localDate = new Date(taskDate.getTime() + taskDate.getTimezoneOffset() * 60000);
      if (localDate.getMonth() === month && localDate.getFullYear() === year) {
        const day = localDate.getDate().toString();
        if (!acc[day]) acc[day] = [];
        const displayTitle = i18n.language === 'en' && task.title_en ? task.title_en : task.title_pt || task.title;
        acc[day].push({ id: task.id, title: displayTitle, type: task.category, completed: task.completed, isMasterTask: task.isMasterTask });
      }
    }
    return acc;
  }, {} as Record<string, { id?: string; title: string; type: string; completed?: boolean; isMasterTask?: boolean }[]>);

  const handleDayAddSubmit = (dayNum: number) => {
    if (newEventTitle.trim()) {
      const dateStr = new Date(year, month, dayNum, 12).toISOString().split('T')[0];
      if (newEventCategory === 'personal' || newEventCategory === 'work') {
        addMasterTask({ title_pt: newEventTitle.trim(), category: newEventCategory as 'personal' | 'work', repeatType: 'none', date: dateStr, completed: false });
      } else {
        addAgendaEvent({ title_pt: newEventTitle.trim(), category: newEventCategory, date: dateStr, subtopics: [] });
      }
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
          <div key={`blank-${b}`} style={{ background: 'var(--color-bg-base)', height: '110px' }} />
        ))}

        {/* Days */}
        {days.map(day => {
          const events = getEventsForDay(day.toString());
          return (
            <div key={day} className="custom-scrollbar" onClick={() => events.length > 0 ? setViewingDayEvents({ day, events }) : (setAddingEventToDay(day), setNewEventTitle(''), setNewEventCategory('personal'))} style={{ 
              background: 'var(--color-bg-base)', 
              height: '110px', 
              padding: 'var(--space-2)',
              position: 'relative',
              overflowY: 'auto',
              overflowX: 'hidden',
              cursor: 'pointer'
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
                  onClick={(e) => { e.stopPropagation(); setAddingEventToDay(day); setNewEventTitle(''); setNewEventCategory('personal'); }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus size={12} />
                </button>
              </div>

              <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {events.map((ev: any, i: number) => {
                  let bgCol = 'var(--color-primary-ghost)';
                  let borderCol = 'var(--color-primary)';
                  if (ev.type === 'college') { bgCol = 'var(--color-college-bg, hsla(152, 55%, 42%, 0.1))'; borderCol = 'var(--color-college, hsl(152, 55%, 42%))'; }
                  if (ev.type === 'work') { bgCol = 'var(--color-work-bg, hsla(200, 70%, 50%, 0.1))'; borderCol = 'var(--color-work, hsl(200, 70%, 50%))'; }
                  if (ev.type === 'personal' || ev.type === 'church') { bgCol = 'var(--color-warning-bg, hsla(38, 80%, 52%, 0.1))'; borderCol = 'var(--color-warning, hsl(38, 80%, 52%))'; }

                  return (
                    <div key={i} style={{
                      fontSize: '0.65rem',
                      padding: '2px 4px',
                      background: bgCol,
                      borderLeft: `2px solid ${borderCol}`,
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      opacity: ev.completed ? 0.6 : 1
                    }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, textDecoration: ev.completed ? 'line-through' : 'none' }} title={ev.title}>
                        {ev.title}
                      </span>
                    </div>
                  );
                })}
                

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
              <div key={i} className="custom-scrollbar" onClick={() => events.length > 0 ? setViewingDayEvents({ day: dayNum, events }) : (setAddingEventToDay(dayNum), setNewEventTitle(''), setNewEventCategory('personal'))} style={{ 
                background: 'var(--color-bg-base)', 
                height: '150px', 
                padding: 'var(--space-2)',
                position: 'relative',
                overflowY: 'auto',
                overflowX: 'hidden',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{WEEKDAYS[i]}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: 'var(--text-sm)', opacity: isCurrentMonth ? 0.8 : 0.4 }}>{dayNum}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setAddingEventToDay(dayNum); setNewEventTitle(''); setNewEventCategory('personal'); }}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {events.map((ev: any, i: number) => {
                    let bgCol = 'var(--color-primary-ghost)';
                    let borderCol = 'var(--color-primary)';
                    if (ev.type === 'college') { bgCol = 'var(--color-college-bg, hsla(152, 55%, 42%, 0.1))'; borderCol = 'var(--color-college, hsl(152, 55%, 42%))'; }
                    if (ev.type === 'work') { bgCol = 'var(--color-work-bg, hsla(200, 70%, 50%, 0.1))'; borderCol = 'var(--color-work, hsl(200, 70%, 50%))'; }
                    if (ev.type === 'personal' || ev.type === 'church') { bgCol = 'var(--color-warning-bg, hsla(38, 80%, 52%, 0.1))'; borderCol = 'var(--color-warning, hsl(38, 80%, 52%))'; }

                    return (
                      <div key={i} style={{
                        fontSize: '0.65rem',
                        padding: '2px 4px',
                        background: bgCol,
                        borderLeft: `2px solid ${borderCol}`,
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        opacity: ev.completed ? 0.6 : 1
                      }}>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, textDecoration: ev.completed ? 'line-through' : 'none' }} title={ev.title}>
                          {ev.title}
                        </span>
                      </div>
                    );
                  })}
                  

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

      {viewingDayEvents && (
        <Modal 
          isOpen={true} 
          onClose={() => setViewingDayEvents(null)} 
          title={`${viewingDayEvents.day} de ${monthNames[month]}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {viewingDayEvents.events.length > 0 ? viewingDayEvents.events.map((ev: any, i: number) => {
              let bgCol = 'var(--color-primary-ghost)';
              let borderCol = 'var(--color-primary)';
              if (ev.type === 'college') { bgCol = 'var(--color-college-bg, hsla(152, 55%, 42%, 0.1))'; borderCol = 'var(--color-college, hsl(152, 55%, 42%))'; }
              if (ev.type === 'work') { bgCol = 'var(--color-work-bg, hsla(200, 70%, 50%, 0.1))'; borderCol = 'var(--color-work, hsl(200, 70%, 50%))'; }
              if (ev.type === 'personal' || ev.type === 'church') { bgCol = 'var(--color-warning-bg, hsla(38, 80%, 52%, 0.1))'; borderCol = 'var(--color-warning, hsl(38, 80%, 52%))'; }

              return (
                <div key={i} style={{
                  padding: 'var(--space-2)',
                  background: bgCol,
                  borderLeft: `3px solid ${borderCol}`,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: ev.completed ? 0.6 : 1
                }}>
                  <div 
                    onClick={(e) => { e.stopPropagation(); ev.isMasterTask ? toggleMasterTask(ev.id!) : toggleAgendaEvent(ev.id!); setViewingDayEvents({ ...viewingDayEvents, events: viewingDayEvents.events.map(e => e.id === ev.id ? { ...e, completed: !e.completed } : e) }); }}
                    style={{ cursor: 'pointer', flexShrink: 0, marginRight: 'var(--space-3)', width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${borderCol}`, background: ev.completed ? borderCol : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                     {ev.completed && <Check size={12} color="white" />}
                  </div>
                  <span style={{ flex: 1, fontSize: 'var(--text-base)', textDecoration: ev.completed ? 'line-through' : 'none', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); ev.isMasterTask ? toggleMasterTask(ev.id!) : toggleAgendaEvent(ev.id!); setViewingDayEvents({ ...viewingDayEvents, events: viewingDayEvents.events.map(e => e.id === ev.id ? { ...e, completed: !e.completed } : e) }); }}>
                    {ev.title}
                  </span>
                  {ev.id && (
                    <button onClick={(e) => { e.stopPropagation(); if(window.confirm('Tem certeza que deseja excluir?')) { ev.isMasterTask ? deleteMasterTask(ev.id!) : deleteAgendaEvent(ev.id!); setViewingDayEvents({ ...viewingDayEvents, events: viewingDayEvents.events.filter(e => e.id !== ev.id) }); } }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, flexShrink: 0, marginLeft: 'var(--space-2)' }}>
                      <Trash2 size={16} color="var(--color-error)" />
                    </button>
                  )}
                </div>
              );
            }) : (
              <p style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: 'var(--space-4)' }}>Nenhum evento neste dia.</p>
            )}
            
            <button 
              className="btn btn-outline" 
              style={{ marginTop: 'var(--space-2)', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              onClick={() => { setAddingEventToDay(viewingDayEvents.day); setViewingDayEvents(null); setNewEventTitle(''); setNewEventCategory('personal'); }}
            >
              <Plus size={16} /> Adicionar Evento
            </button>
          </div>
        </Modal>
      )}

      {addingEventToDay !== null && (
        <Modal 
          isOpen={true} 
          onClose={() => setAddingEventToDay(null)} 
          title={`Adicionar Evento - ${addingEventToDay} de ${monthNames[month]}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Título</label>
              <input
                autoFocus
                type="text"
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleDayAddSubmit(addingEventToDay);
                }}
                placeholder="Título do evento..."
                style={{ width: '100%', fontSize: 'var(--text-base)', padding: 'var(--space-2)', outline: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', background: 'var(--color-bg-base)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Categoria</label>
              <select
                value={newEventCategory}
                onChange={e => setNewEventCategory(e.target.value)}
                style={{ width: '100%', fontSize: 'var(--text-base)', padding: 'var(--space-2)', outline: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', background: 'var(--color-bg-base)' }}
              >
                <option value="personal">Pessoal</option>
                <option value="work">Trabalho</option>
                <option value="college">Faculdade</option>
                <option value="church">Igreja</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleDayAddSubmit(addingEventToDay)}>Salvar</button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAddingEventToDay(null)}>Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
