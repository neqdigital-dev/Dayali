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
            .update({ state_backup: json })
            .eq('id', user.id);
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

  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)' }}>
          <DownloadCloud size={16} />
          Restaurar Backup (Nuvem/Local)
        </span>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
          Selecione o seu arquivo .json para recuperar todas as tarefas.
        </p>
      </div>
      <div>
        <input 
          type="file" 
          accept=".json" 
          style={{ display: 'none' }} 
          ref={fileInputRef} 
          onChange={handleImport}
        />
        <button 
          className="btn btn-outline" 
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          {loading ? 'Restaurando...' : 'Importar Arquivo'}
        </button>
      </div>
    </div>
  );
}
