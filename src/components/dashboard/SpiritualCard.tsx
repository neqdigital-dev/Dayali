import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

export default function SpiritualCard() {
  return (
    <div className="spiritual-card animate-fade-in-up" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
      <div className="spiritual-symbol" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-3)' }}>
        <Sparkles size={22} color="var(--color-primary)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className="text-sm font-medium tracking-wider" style={{ textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.1em' }}>
          Lição da Escola Sabatina Jovem
        </span>
      </div>

      <div className="spiritual-content" style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
        <p className="spiritual-verse" style={{ 
          fontSize: '1.1rem', 
          lineHeight: 1.6, 
          fontStyle: 'italic', 
          maxWidth: '80%', 
          margin: '0 auto',
          fontWeight: 'var(--weight-medium)' 
        }}>
          "A esperança de um futuro com Cristo nos motiva a viver o presente com propósito. Mesmo em meio aos desafios, a fé nos conecta à eternidade."
        </p>
        
        <span className="spiritual-reference" style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>
          — Texto Base: Romanos 8:18
        </span>

        <p className="spiritual-reflection" style={{ 
          fontSize: 'var(--text-sm)', 
          lineHeight: 1.5, 
          opacity: 0.7, 
          maxWidth: '70%', 
          margin: '0 auto' 
        }}>
          Resumo de hoje: Ao refletir sobre as promessas de Deus, encontramos forças para ser luz em nosso ambiente de trabalho e estudo.
        </p>
        
        <span className="spiritual-source" style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: 'var(--space-2)' }}>
          Fonte: Lição Jovem - Trimestre atual
        </span>
      </div>
    </div>
  );
}
