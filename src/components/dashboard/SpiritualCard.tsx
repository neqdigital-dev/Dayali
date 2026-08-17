import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

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
