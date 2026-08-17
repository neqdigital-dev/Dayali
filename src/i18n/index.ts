import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import ptCommon from './locales/pt/common.json';
import ptDashboard from './locales/pt/dashboard.json';
import enCommon from './locales/en/common.json';
import enDashboard from './locales/en/dashboard.json';

const resources = {
  pt: {
    common: ptCommon,
    dashboard: ptDashboard,
  },
  en: {
    common: enCommon,
    dashboard: enDashboard,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('dayali-language') || 'pt',
  fallbackLng: 'pt',
  defaultNS: 'common',
  ns: ['common', 'dashboard'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
