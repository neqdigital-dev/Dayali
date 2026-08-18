import { useState } from 'react';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: { title: string; priority: 'low' | 'normal' | 'high'; category: string }) => void;
  defaultCategory?: string;
}

export default function TaskModal({ isOpen, onClose, onSave, defaultCategory = 'personal' }: TaskModalProps) {

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [category, setCategory] = useState(defaultCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, priority, category });
    setTitle('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Tarefa">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
            Título da Tarefa
          </label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Estudar inglês 📚"
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
              transition: 'border-color 0.2s'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
              Prioridade
            </label>
            <select 
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-base)',
                color: 'var(--color-text-primary)'
              }}
            >
              <option value="low">Baixa</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}>
              Categoria
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-base)',
                color: 'var(--color-text-primary)'
              }}
            >
              <option value="personal">Atividades do dia</option>
              <option value="work">Trabalho</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-ghost"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!title.trim()}
          >
            Adicionar Tarefa
          </button>
        </div>
      </form>
    </Modal>
  );
}
