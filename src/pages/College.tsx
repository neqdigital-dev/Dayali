import CollegeCard from '../components/dashboard/CollegeCard';

export default function College() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Faculdade</h1>
        <p className="page-description">Provas, trabalhos e cronograma de estudos.</p>
      </header>
      <div className="page-content">
        <div style={{ maxWidth: 800 }}>
          <CollegeCard />
        </div>
      </div>
    </div>
  );
}
