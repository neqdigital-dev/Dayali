export default function Agenda() {
  return (
    <div className="page-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header className="page-header">
        <h1 className="page-title">Agenda</h1>
        <p className="page-description">Sua visão geral do mês e semana.</p>
      </header>
      <div className="page-content" style={{ flex: 1 }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>O calendário detalhado será construído aqui.</p>
      </div>
    </div>
  );
}
