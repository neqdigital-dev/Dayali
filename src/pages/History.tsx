import { CheckCircle2, Calendar, BookOpen } from 'lucide-react';

export default function History() {
  const historyItems = [
    { id: 1, type: 'task', title: 'Ler a Bíblia', date: 'Hoje, 07:30', category: 'personal' },
    { id: 2, type: 'task', title: 'Tomar café da manhã', date: 'Hoje, 08:00', category: 'personal' },
    { id: 3, type: 'agenda', title: 'Prova de Estruturas de Dados', date: 'Ontem', category: 'college' },
    { id: 4, type: 'task', title: 'Reunião Diária', date: 'Ontem, 09:00', category: 'work' },
    { id: 5, type: 'task', title: 'Alongamento', date: 'Ontem, 18:00', category: 'personal' },
  ];

  const getIcon = (type: string, category: string) => {
    if (type === 'agenda') return <Calendar size={16} />;
    if (category === 'college') return <BookOpen size={16} />;
    return <CheckCircle2 size={16} />;
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Histórico</h1>
        <p className="page-description">Linha do tempo de tarefas e eventos concluídos.</p>
      </header>
      <div className="page-content" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {historyItems.map((item, index) => (
            <div key={item.id} style={{ display: 'flex', gap: 'var(--space-4)' }}>
              {/* Timeline dot and line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: `var(--color-${item.category})`, 
                  color: 'white',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  zIndex: 1
                }}>
                  {getIcon(item.type, item.category)}
                </div>
                {index !== historyItems.length - 1 && (
                  <div style={{ width: '2px', flex: 1, background: 'var(--color-border)', margin: '4px 0' }} />
                )}
              </div>
              
              {/* Content */}
              <div className="card" style={{ flex: 1, padding: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)', margin: 0 }}>{item.title}</h4>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      {item.type === 'agenda' ? 'Evento de Agenda' : 'Tarefa Concluída'}
                    </span>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
