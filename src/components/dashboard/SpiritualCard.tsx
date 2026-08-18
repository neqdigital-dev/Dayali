import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

export default function SpiritualCard() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const headerText = isEn ? "Youth Sabbath School Lesson" : "Lição da Escola Sabatina Jovem";
  const verseText = isEn 
    ? '"For I consider that the sufferings of this present time are not worth comparing with the glory that is to be revealed to us."'
    : '"Porque para mim tenho por certo que as aflições deste tempo presente não são para comparar com a glória que em nós há de ser revelada."';
  const verseRef = isEn ? "Romans 8:18" : "Romanos 8:18";
  const reflectionHeader = isEn ? "My Daily Reflection" : "Minha Reflexão do Dia";
  const reflectionPlaceholder = isEn ? "Write your reflection on the text here..." : "Escreva aqui sua reflexão sobre o texto...";

  return (
    <div className="spiritual-card animate-fade-in-up" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Sparkles size={20} color="var(--color-primary)" />
        <span className="text-sm font-medium tracking-wider" style={{ textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.1em' }}>
          {headerText}
        </span>
      </div>

      {/* Content */}
      <div className="spiritual-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        
        {/* Lesson Text */}
        <div style={{ 
          background: 'var(--color-bg-subtle)', 
          padding: 'var(--space-4)', 
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)'
        }}>
          <p className="spiritual-verse" style={{ 
            fontSize: '0.95rem', 
            lineHeight: 1.6, 
            fontStyle: 'italic', 
            fontWeight: 'var(--weight-medium)' 
          }}>
            {verseText}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: 'var(--space-2)' }}>
            <span className="spiritual-reference" style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'bold' }}>
              {verseRef}
            </span>
          </div>
        </div>

        {/* Reflection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 'var(--weight-semibold)', color: 'var(--color-primary)' }}>
            {reflectionHeader}
          </span>
          <textarea 
            className="input" 
            placeholder={reflectionPlaceholder} 
            style={{ 
              width: '100%', 
              minHeight: '120px', 
              resize: 'vertical', 
              background: 'transparent',
              border: '1px dashed var(--color-border)',
              padding: 'var(--space-3)'
            }}
          />
        </div>

      </div>
    </div>
  );
}
