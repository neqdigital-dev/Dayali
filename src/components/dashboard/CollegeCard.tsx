import { useTranslation } from 'react-i18next';
import { GraduationCap, BookOpen, FileText } from 'lucide-react';
import { getDaysUntilLabel } from '../../lib/dates';

// Demo data
const demoData = {
  nextExam: {
    subject_pt: 'Estruturas de Dados',
    subject_en: 'Data Structures',
    date: '2026-08-22',
  },
  nextAssignment: {
    subject_pt: 'Banco de Dados',
    subject_en: 'Database',
    date: '2026-08-27',
  },
  todayStudies: [
    { id: '1', title_pt: 'Capítulo 4 — Árvores', title_en: 'Chapter 4 — Trees', completed: false },
    { id: '2', title_pt: 'Exercícios lista 3', title_en: 'Exercise set 3', completed: false },
    { id: '3', title_pt: 'Revisão de Pilhas', title_en: 'Stack Review', completed: true },
  ],
};

export default function CollegeCard() {
  const { t, i18n } = useTranslation('dashboard');
  const lang = i18n.language as 'pt' | 'en';

  return (
    <div className="card card-category college">
      {/* Header */}
      <div className="task-column-header">
        <div className="task-column-title-row">
          <span className="badge badge-college">
            {useTranslation().t('category.college')}
          </span>
        </div>
      </div>

      <div className="college-sections">
        {/* Next Exam */}
        <div className="college-section">
          <div className="college-section-header">
            <BookOpen size={14} className="college-section-icon" />
            <span className="college-section-label">{t('college_preview.next_exam')}</span>
          </div>
          <div className="college-section-content">
            <p className="college-subject">
              {lang === 'en' ? demoData.nextExam.subject_en : demoData.nextExam.subject_pt}
            </p>
            <div className="college-date-row">
              <span className="college-date">{demoData.nextExam.date.split('-').reverse().join('/')}</span>
              <span className="badge badge-warning" style={{ fontSize: 'var(--text-xs)' }}>
                {getDaysUntilLabel(demoData.nextExam.date, lang)}
              </span>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* Next Assignment */}
        <div className="college-section">
          <div className="college-section-header">
            <FileText size={14} className="college-section-icon" />
            <span className="college-section-label">{t('college_preview.next_assignment')}</span>
          </div>
          <div className="college-section-content">
            <p className="college-subject">
              {lang === 'en' ? demoData.nextAssignment.subject_en : demoData.nextAssignment.subject_pt}
            </p>
            <div className="college-date-row">
              <span className="college-date">{demoData.nextAssignment.date.split('-').reverse().join('/')}</span>
              <span className="badge badge-primary" style={{ fontSize: 'var(--text-xs)' }}>
                {getDaysUntilLabel(demoData.nextAssignment.date, lang)}
              </span>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* Today Studies */}
        <div className="college-section">
          <div className="college-section-header">
            <GraduationCap size={14} className="college-section-icon" />
            <span className="college-section-label">{t('college_preview.today_studies')}</span>
          </div>
          <div className="college-study-list">
            {demoData.todayStudies.map((study) => (
              <div
                key={study.id}
                className={`task-item ${study.completed ? 'completed' : ''}`}
                style={{ padding: 'var(--space-2) 0' }}
              >
                <div className={`task-checkbox ${study.completed ? 'checked' : ''}`} style={{ width: 16, height: 16 }}>
                  {study.completed && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="task-title" style={{ fontSize: 'var(--text-sm)' }}>
                  {lang === 'en' && study.title_en ? study.title_en : study.title_pt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
