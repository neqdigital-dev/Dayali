import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';
import type { AgendaEvent } from '../../stores/useDataStore';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<AgendaEvent>) => void;
  event: AgendaEvent | null;
}

export default function EventModal({ isOpen, onClose, onSave, event }: EventModalProps) {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const lang = i18n.language as 'pt' | 'en';

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [link, setLink] = useState('');

  // Update local state when event changes
  useEffect(() => {
    if (isOpen && event) {
      setTitle(event.title_pt || '');
      setDate(event.date || '');
      setTime(event.time || '');
      setNotes(event.notes || '');
      setLink(event.link || '');
    }
  }, [isOpen, event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title_pt: title, date, time, notes, link });
    onClose();
  };

  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('event.edit', { ns: 'dashboard', defaultValue: 'Editar Evento' })}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
            {t('event.title', { ns: 'dashboard', defaultValue: 'Título' })}
          </label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-base)',
              color: 'var(--color-text-primary)',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
              Data
            </label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-base)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
              Horário
            </label>
            <input 
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-base)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
            Link (Opcional)
          </label>
          <input 
            type="url" 
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-base)',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
            Observações
          </label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Anotações, detalhes, links de reunião..."
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-base)',
              color: 'var(--color-text-primary)',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-ghost"
          >
            {t('actions.cancel', { ns: 'common', defaultValue: 'Cancelar' })}
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!title.trim() || !date}
          >
            {t('actions.save', { ns: 'common', defaultValue: 'Salvar' })}
          </button>
        </div>
      </form>
    </Modal>
  );
}
