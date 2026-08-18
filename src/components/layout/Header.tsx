import { useTranslation } from 'react-i18next';
import { Menu, Plus, Sun, Moon, WifiOff } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { getGreetingKey } from '../../lib/dates';
import { useDataStore } from '../../stores/useDataStore';

export default function Header() {
  const { t, i18n } = useTranslation();
  const {
    language,
    setLanguage,
    resolvedTheme,
    setTheme,
    toggleSidebar,
    isOnline,
  } = useAppStore();

  const handleLanguageToggle = () => {
    const newLang = language === 'pt' ? 'en' : 'pt';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleThemeToggle = () => {
    const next = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  const { addMasterTask } = useDataStore();

  const handleQuickAdd = () => {
    const title = window.prompt(t('header.new_task') + ':');
    if (title && title.trim()) {
      const dayIndex = new Date().getDay();
      let todayType: 'weekday' | 'saturday' | 'sunday' = 'weekday';
      if (dayIndex === 0) todayType = 'sunday';
      if (dayIndex === 6) todayType = 'saturday';
      addMasterTask({ title_pt: title.trim(), category: 'personal', repeatType: todayType });
    }
  };

  return (
    <>
      {/* Offline banner */}
      {!isOnline && (
        <div className="offline-banner">
          <WifiOff size={14} />
          <span>{t('header.offline')}</span>
        </div>
      )}

      <header className="app-header">
        <div className="header-left">
          <button
            className="btn btn-ghost btn-icon header-menu-btn"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="header-greeting">{t(getGreetingKey())} ✦</h1>
        </div>

        <div className="header-right">
          {/* New task quick action */}
          <button className="btn btn-primary btn-sm header-new-btn" onClick={handleQuickAdd}>
            <Plus size={16} />
            <span className="header-new-label">{t('header.new_task')}</span>
          </button>

          {/* Theme toggle */}
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
            title={resolvedTheme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {resolvedTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Language toggle */}
          <button
            className="btn btn-ghost btn-sm header-lang-btn"
            onClick={handleLanguageToggle}
            aria-label="Toggle language"
          >
            <span className="header-lang-flag">
              {language === 'pt' ? '🇧🇷' : '🇺🇸'}
            </span>
            <span className="header-lang-code">
              {language === 'pt' ? 'PT' : 'EN'}
            </span>
          </button>
        </div>
      </header>
    </>
  );
}
