import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { useDataStore } from '../../stores/useDataStore';

export default function SpiritualCard() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const reflectionText = useDataStore((s) => s.reflectionText);
  const setReflectionText = useDataStore((s) => s.setReflectionText);

  const headerText = isEn ? "Youth Sabbath School Lesson" : "Lição da Escola Sabatina Jovem";
  const verses = [
    { textPt: '"Porque para mim tenho por certo que as aflições deste tempo presente não são para comparar com a glória que em nós há de ser revelada."', refPt: 'Romanos 8:18', textEn: '"For I consider that the sufferings of this present time are not worth comparing with the glory that is to be revealed to us."', refEn: 'Romans 8:18' },
    { textPt: '"Tudo posso naquele que me fortalece."', refPt: 'Filipenses 4:13', textEn: '"I can do all things through him who strengthens me."', refEn: 'Philippians 4:13' },
    { textPt: '"O Senhor é o meu pastor; nada me faltará."', refPt: 'Salmos 23:1', textEn: '"The Lord is my shepherd; I shall not want."', refEn: 'Psalm 23:1' },
    { textPt: '"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."', refPt: 'João 3:16', textEn: '"For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."', refEn: 'John 3:16' },
    { textPt: '"Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento."', refPt: 'Provérbios 3:5', textEn: '"Trust in the Lord with all your heart, and do not lean on your own understanding."', refEn: 'Proverbs 3:5' },
    { textPt: '"E conhecereis a verdade, e a verdade vos libertará."', refPt: 'João 8:32', textEn: '"And you will know the truth, and the truth will set you free."', refEn: 'John 8:32' },
    { textPt: '"Não fui eu que ordenei a você? Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor, o seu Deus, estará com você por onde você andar."', refPt: 'Josué 1:9', textEn: '"Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go."', refEn: 'Joshua 1:9' }
  ];

  const lastResetDate = useDataStore((s) => s.lastResetDate) || new Date().toISOString().split('T')[0];
  const todayDate = new Date(lastResetDate + 'T12:00:00'); // Use noon to avoid timezone issues
  const dayOfYear = Math.floor((todayDate.getTime() - new Date(todayDate.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const dailyVerse = verses[dayOfYear % verses.length];

  const verseText = isEn ? dailyVerse.textEn : dailyVerse.textPt;
  const verseRef = isEn ? dailyVerse.refEn : dailyVerse.refPt;
  
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
            value={reflectionText || ''}
            onChange={(e) => setReflectionText(e.target.value)}
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
