import ChurchCard from '../components/dashboard/ChurchCard';

export default function Church() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Igreja</h1>
        <p className="page-description">Pregações, participações e informativos.</p>
      </header>
      <div className="page-content">
        <div style={{ maxWidth: 800 }}>
          <ChurchCard />
        </div>
      </div>
    </div>
  );
}
