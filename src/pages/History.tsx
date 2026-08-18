import { useState } from 'react';
import { Calendar, CheckCircle2, Filter } from 'lucide-react';

export default function History() {
  const [filter, setFilter] = useState('15'); // 15 dias por padrão

  // Mocked daily history data showing general completion
  const historyItems = [
    { id: 1, date: 'Ontem', completion: 85, completedItems: 17, totalItems: 20 },
    { id: 2, date: '16 de Agosto', completion: 100, completedItems: 18, totalItems: 18 },
    { id: 3, date: '15 de Agosto', completion: 60, completedItems: 12, totalItems: 20 },
    { id: 4, date: '14 de Agosto', completion: 90, completedItems: 18, totalItems: 20 },
    { id: 5, date: '13 de Agosto', completion: 75, completedItems: 15, totalItems: 20 },
  ];

  const getCompletionColor = (percentage: number) => {
    if (percentage === 100) return 'var(--color-success, #10b981)';
    if (percentage >= 75) return 'var(--color-primary, #3b82f6)';
    if (percentage >= 50) return 'var(--color-warning, #f59e0b)';
    return 'var(--color-danger, #ef4444)';
  };

  return (
    <div className="page-container">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Histórico de Conclusão</h1>
          <p className="page-description">Acompanhe seu desempenho geral diário.</p>
        </div>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', background: 'var(--color-bg-subtle)', padding: 'var(--space-1)', borderRadius: 'var(--radius-md)' }}>
          <button 
            onClick={() => setFilter('15')}
            style={{ 
              padding: 'var(--space-2) var(--space-4)', 
              borderRadius: 'var(--radius-sm)',
              background: filter === '15' ? 'var(--color-bg)' : 'transparent',
              color: filter === '15' ? 'var(--color-text)' : 'var(--color-text-secondary)',
              fontWeight: filter === '15' ? 'var(--weight-medium)' : 'var(--weight-regular)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            15 Dias
          </button>
          <button 
            onClick={() => setFilter('30')}
            style={{ 
              padding: 'var(--space-2) var(--space-4)', 
              borderRadius: 'var(--radius-sm)',
              background: filter === '30' ? 'var(--color-bg)' : 'transparent',
              color: filter === '30' ? 'var(--color-text)' : 'var(--color-text-secondary)',
              fontWeight: filter === '30' ? 'var(--weight-medium)' : 'var(--weight-regular)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            30 Dias
          </button>
          <button 
            onClick={() => setFilter('quarter')}
            style={{ 
              padding: 'var(--space-2) var(--space-4)', 
              borderRadius: 'var(--radius-sm)',
              background: filter === 'quarter' ? 'var(--color-bg)' : 'transparent',
              color: filter === 'quarter' ? 'var(--color-text)' : 'var(--color-text-secondary)',
              fontWeight: filter === 'quarter' ? 'var(--weight-medium)' : 'var(--weight-regular)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Trimestre
          </button>
        </div>
      </header>
      
      <div className="page-content" style={{ maxWidth: '600px', marginTop: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {historyItems.map((item, index) => (
            <div key={item.id} style={{ display: 'flex', gap: 'var(--space-4)' }}>
              {/* Timeline dot and line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: getCompletionColor(item.completion), 
                  color: 'white',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  zIndex: 1
                }}>
                  <Calendar size={14} />
                </div>
                {index !== historyItems.length - 1 && (
                  <div style={{ width: '2px', flex: 1, background: 'var(--color-border)', margin: '4px 0', minHeight: '30px' }} />
                )}
              </div>
              
              {/* Content */}
              <div className="card" style={{ flex: 1, padding: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-base)', margin: 0 }}>{item.date}</h4>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: '4px', display: 'block' }}>
                      {item.completedItems} de {item.totalItems} itens concluídos gerais (Água, Igreja, Pessoal, etc.)
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-1)' }}>
                    <span style={{ 
                      fontSize: 'var(--text-lg)', 
                      fontWeight: 'bold', 
                      color: getCompletionColor(item.completion) 
                    }}>
                      {item.completion}%
                    </span>
                    
                    {/* Mini progress bar */}
                    <div style={{ 
                      width: '100px', 
                      height: '6px', 
                      background: 'var(--color-bg-subtle)', 
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${item.completion}%`,
                        background: getCompletionColor(item.completion),
                        borderRadius: '10px'
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
