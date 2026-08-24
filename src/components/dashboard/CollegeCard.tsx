import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Plus, Trash2, GripVertical } from 'lucide-react';
import { getDaysUntil, getDaysUntilLabel } from '../../lib/dates';
import { useDataStore, type AgendaEvent } from '../../stores/useDataStore';
import EventModal from '../ui/EventModal';

export default function CollegeCard({ dragHandleProps }: { dragHandleProps?: any }) {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const lang = i18n.language as 'pt' | 'en';
  
  const { agendaEvents, addAgendaEvent, addSubtopic, toggleSubtopic, deleteSubtopic, deleteAgendaEvent } = useDataStore();
  
  const collegeEvents = agendaEvents.filter(e => e.category === 'college' && !e.completed);
  
  // Sorting and filtering
  const sortedEvents = [...collegeEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const [visibleCount, setVisibleCount] = useState(4);
  const visibleEvents = sortedEvents.slice(0, visibleCount);
  const hiddenCount = sortedEvents.length - visibleEvents.length;

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  
  const [addingSubtopicTo, setAddingSubtopicTo] = useState<string | null>(null);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');

  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);

  const handleAddEvent = () => {
    if (newEventTitle.trim() && newEventDate) {
      addAgendaEvent({ title_pt: newEventTitle.trim(), date: newEventDate, category: 'college', subtopics: [] });
      setNewEventTitle('');
      setNewEventDate('');
      setIsAddingEvent(false);
    }
  };

  const handleAddSubtopic = (eventId: string) => {
    if (newSubtopicTitle.trim()) {
      addSubtopic(eventId, newSubtopicTitle.trim());
      setNewSubtopicTitle('');
      setAddingSubtopicTo(null);
    }
  };

  const completedCount = collegeEvents.reduce((acc, ev) => acc + (ev.subtopics?.filter(s => s.completed).length || 0), 0);
  const totalCount = collegeEvents.reduce((acc, ev) => acc + (ev.subtopics?.length || 0), 0);
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="card card-category college">
      <div className="task-column-header">
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {dragHandleProps && (
                <div {...dragHandleProps} style={{ cursor: 'grab', opacity: 0.4, display: 'flex' }}>
                  <GripVertical size={16} />
                </div>
              )}
              <span className="badge badge-college">{t('category.college', { ns: 'common' })}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="task-column-count text-sm text-tertiary">{completedCount}/{totalCount}</span>
              <button className="btn-icon" title={t('actions.add', { ns: 'common' })} onClick={() => { setIsAddingEvent(true); setNewEventTitle(''); }}>
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div style={{ height: 4, background: 'var(--color-bg-subtle)', borderRadius: 2, width: '100%', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--color-college)', width: `${progress}%`, transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      <div className="college-sections">
        {isAddingEvent && (
          <div className="college-section" style={{ background: 'var(--color-bg-subtle)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
            <input
              type="text"
              autoFocus
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="Ex: Prova de Lógica"
              style={{ width: '100%', marginBottom: '4px', fontSize: 'var(--text-sm)', padding: '4px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'var(--color-text-primary)' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                style={{ flex: 1, fontSize: 'var(--text-sm)', padding: '4px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'var(--color-text-primary)' }}
              />
              <button className="btn btn-primary btn-sm" onClick={handleAddEvent}>Salvar</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsAddingEvent(false)}>Cancelar</button>
            </div>
          </div>
        )}

        {collegeEvents.length === 0 && !isAddingEvent && (
          <p className="text-sm text-tertiary" style={{ padding: 'var(--space-2)' }}>{t('empty.events', { ns: 'common', defaultValue: 'Nenhuma prova pendente.' })}</p>
        )}

        {visibleEvents.map(event => {
          const days = getDaysUntil(event.date);
          let bg = 'var(--color-bg-subtle)';
          let border = '1px solid transparent';
          
          if (days <= 0) { bg = 'rgba(239, 68, 68, 0.15)'; border = '1px solid rgba(239, 68, 68, 0.3)'; }
          else if (days === 1) { bg = 'rgba(249, 115, 22, 0.15)'; border = '1px solid rgba(249, 115, 22, 0.3)'; }
          else if (days >= 2 && days <= 4) { bg = 'rgba(234, 179, 8, 0.15)'; border = '1px solid rgba(234, 179, 8, 0.3)'; }

          return (
          <div key={event.id} style={{ marginBottom: 'var(--space-2)' }}>
            {/* Event Header styling like a Task */}
            <div className="task-item" style={{ background: bg, border }}>
              <div 
                className="task-content" 
                style={{ flex: 1, cursor: 'pointer' }}
                onClick={() => setEditingEvent(event)}
              >
                <span className="task-title" style={{ transition: 'color 0.2s' }}>
                  {lang === 'en' && event.title_en ? event.title_en : event.title_pt}
                </span>
                <div style={{ display: 'flex', gap: '4px', marginTop: '2px', alignItems: 'center' }}>
                  <BookOpen size={10} style={{ color: 'var(--color-text-tertiary)' }} />
                  <span className="badge" style={{ background: 'var(--color-bg-base)', fontSize: '9px' }}>{event.date.split('-').reverse().join('/')}</span>
                  <span className="badge badge-warning" style={{ fontSize: '9px' }}>{getDaysUntilLabel(event.date, lang)}</span>
                </div>
              </div>
              <div className="task-actions" style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-icon" onClick={() => setAddingSubtopicTo(event.id)} style={{ width: 28, height: 28 }}>
                  <Plus size={16} />
                </button>
                <button className="btn-icon" onClick={() => deleteAgendaEvent(event.id)} style={{ width: 28, height: 28 }}>
                  <Trash2 size={16} color="var(--color-error)" />
                </button>
              </div>
            </div>
              
            <div className="task-column-list" style={{ marginTop: '2px' }}>
              {event.subtopics?.map(sub => (
                <div key={sub.id} className={`task-item ${sub.completed ? 'completed' : ''}`} style={{ paddingLeft: 'var(--space-6)' }}>
                  <div className={`task-checkbox ${sub.completed ? 'checked' : ''}`} onClick={() => toggleSubtopic(event.id, sub.id)}>
                    {sub.completed && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className="task-content" style={{ flex: 1 }}>
                    <span className="task-title" style={{ textDecoration: sub.completed ? 'line-through' : 'none' }}>{lang === 'en' && sub.title_en ? sub.title_en : sub.title_pt}</span>
                  </div>
                  <div className="task-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-icon" onClick={() => deleteSubtopic(event.id, sub.id)} style={{ width: 28, height: 28 }}>
                      <Trash2 size={16} color="var(--color-error)" />
                    </button>
                  </div>
                </div>
              ))}
              
              {addingSubtopicTo === event.id && (
                <div className="task-item" style={{ paddingLeft: 'var(--space-6)' }}>
                  <div className="task-checkbox" style={{ opacity: 0.5, cursor: 'default' }} />
                  <input
                    type="text"
                    autoFocus
                    value={newSubtopicTitle}
                    onChange={(e) => setNewSubtopicTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddSubtopic(event.id);
                      if (e.key === 'Escape') setAddingSubtopicTo(null);
                    }}
                    onBlur={() => { if (newSubtopicTitle.trim()) handleAddSubtopic(event.id); else setAddingSubtopicTo(null); }}
                    placeholder="Novo subtópico..."
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}
                  />
                </div>
              )}
            </div>
          </div>
        )})}
        
        {hiddenCount > 0 && (
          <button 
            className="btn btn-ghost btn-sm" 
            style={{ width: '100%', marginTop: 'var(--space-2)' }} 
            onClick={() => setVisibleCount(prev => prev + 4)}
          >
            Ver mais {Math.min(hiddenCount, 4)} {Math.min(hiddenCount, 4) === 1 ? 'evento futuro' : 'eventos futuros'}
          </button>
        )}
        
        {visibleCount > 4 && (
          <button 
            className="btn btn-ghost btn-sm" 
            style={{ width: '100%', marginTop: 'var(--space-2)' }} 
            onClick={() => setVisibleCount(4)}
          >
            Ver menos
          </button>
        )}
      </div>

      <EventModal 
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        event={editingEvent}
        onSave={(updates) => {
          if (editingEvent) {
            useDataStore.getState().updateAgendaEvent(editingEvent.id, updates);
          }
        }}
      />
    </div>
  );
}
