import { useAppStore } from '../stores/useAppStore';
import { User, Bell, Globe, Moon, Sun, Monitor } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme, language, setLanguage } = useAppStore();

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Configurações</h1>
        <p className="page-description">Preferências do sistema e perfil.</p>
      </header>
      
      <div className="page-content" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Profile Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <User size={18} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', margin: 0 }}>Perfil</h2>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={32} color="var(--color-text-tertiary)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 'var(--weight-medium)' }}>Usuário Local</h3>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Acesso sem login ativado.</p>
            </div>
            <button className="btn btn-outline" style={{ marginLeft: 'auto' }}>Editar Perfil</button>
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <Monitor size={18} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', margin: 0 }}>Preferências do Aplicativo</h2>
          </div>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            
            {/* Theme */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 'var(--weight-medium)' }}>
                  {theme === 'dark' ? <Moon size={16} /> : theme === 'light' ? <Sun size={16} /> : <Monitor size={16} />}
                  Tema
                </span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>Escolha a aparência do Dayali.</p>
              </div>
              <div style={{ display: 'flex', gap: '4px', background: 'var(--color-bg-subtle)', padding: '2px', borderRadius: 'var(--radius-md)' }}>
                <button className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTheme('light')}>Claro</button>
                <button className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTheme('dark')}>Escuro</button>
                <button className={`btn btn-sm ${theme === 'system' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTheme('system')}>Auto</button>
              </div>
            </div>

            <hr className="divider" />

            {/* Language */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 'var(--weight-medium)' }}>
                  <Globe size={16} />
                  Idioma
                </span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>Linguagem da interface.</p>
              </div>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as any)}
                style={{ padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}
              >
                <option value="pt">Português (BR)</option>
                <option value="en">English (US)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <Bell size={18} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', margin: 0 }}>Notificações</h2>
          </div>
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 'var(--weight-medium)' }}>Alertas Diários</span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>Lembretes para metas e tarefas.</p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
            </label>
          </div>
        </section>

      </div>
    </div>
  );
}
