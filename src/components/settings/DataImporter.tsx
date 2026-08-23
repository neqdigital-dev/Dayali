import { useRef, useState } from 'react';
import { DownloadCloud } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';

export default function DataImporter() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore(s => s.user);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setLoading(true);
        const json = JSON.parse(event.target?.result as string);
        
        // Save to local storage
        localStorage.setItem('dayali-storage-v2', JSON.stringify(json));
        
        // Save to Supabase if logged in
        if (user && user.id !== 'mock-user-id') {
          await supabase
            .from('profiles')
            .upsert({ id: user.id, state_backup: json });
        }

        alert('Backup importado com sucesso! A página será recarregada para aplicar os dados.');
        window.location.reload();
      } catch (err) {
        alert('Erro ao ler o arquivo JSON. Certifique-se de que é o arquivo correto de backup.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const data = localStorage.getItem('dayali-storage-v2');
    if (!data) {
      alert('Nenhum dado encontrado para exportar.');
      return;
    }
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dayali-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)' }}>
            <DownloadCloud size={16} />
            Backup Local (Exportar/Restaurar)
          </span>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
            Exporte ou importe seus dados para manter cópias de segurança.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <input 
            type="file" 
            accept=".json" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleImport}
          />
          <button 
            className="btn btn-outline" 
            onClick={handleExport}
            disabled={loading}
          >
            Exportar
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            {loading ? 'Restaurando...' : 'Importar'}
          </button>
        </div>
      </div>
    </div>
  );
}

