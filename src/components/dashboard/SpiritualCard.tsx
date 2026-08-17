import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

// Static demo content — will be replaced with Supabase data
const demoContent = {
  pt: {
    verse: '"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."',
    reference: 'João 3:16',
    reflection: 'Hoje, lembre-se de que o amor de Deus não depende de nossas conquistas, mas da Sua graça infinita.',
    source: 'Bíblia Sagrada (ARA)',
  },
  en: {
    verse: '"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."',
    reference: 'John 3:16',
    reflection: 'Today, remember that God\'s love does not depend on our achievements, but on His infinite grace.',
    source: 'Holy Bible (NIV)',
  },
};

export default function SpiritualCard() {
  const { i18n } = useTranslation('dashboard');
  const { t } = useTranslation('dashboard');
  const lang = i18n.language as 'pt' | 'en';
  const content = demoContent[lang] || demoContent.pt;

  return (
    <div className="spiritual-card animate-fade-in-up">
      <div className="spiritual-symbol">
        <Sparkles size={22} />
      </div>
      <p className="spiritual-label">{t('spiritual.title')}</p>
      <blockquote className="spiritual-verse">{content.verse}</blockquote>
      <p className="spiritual-reference">— {content.reference}</p>
      <p className="spiritual-reflection">{content.reflection}</p>
      <p className="spiritual-source">
        {t('spiritual.source_label')}: {content.source}
      </p>
    </div>
  );
}
