import AgendaPreview from '../components/dashboard/AgendaPreview';

export default function Agenda() {
  return (
    <div className="page-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header className="page-header">
        <h1 className="page-title">Agenda</h1>
        <p className="page-description">Sua visão geral do calendário.</p>
      </header>
      <div className="page-content" style={{ flex: 1 }}>
        <AgendaPreview />
      </div>
    </div>
  );
}
