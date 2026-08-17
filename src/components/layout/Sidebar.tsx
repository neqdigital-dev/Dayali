import { NavLink, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  GraduationCap,
  Church,
  History,
  Settings,
  X,
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

const navItems = [
  { path: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { path: '/tasks', icon: CheckSquare, labelKey: 'nav.tasks' },
  { path: '/agenda', icon: Calendar, labelKey: 'nav.agenda' },
  { path: '/college', icon: GraduationCap, labelKey: 'nav.college' },
  { path: '/church', icon: Church, labelKey: 'nav.church' },
  { path: '/history', icon: History, labelKey: 'nav.history' },
  { path: '/settings', icon: Settings, labelKey: 'nav.settings' },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">D</div>
          <span className="sidebar-logo-text">Dayali</span>
          <button
            className="sidebar-close-btn btn btn-ghost btn-icon btn-sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="nav-section">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} className="nav-item-icon" />
                <span>{t(item.labelKey)}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom spacer */}
        <div style={{ flex: 1 }} />

        {/* Version */}
        <div className="sidebar-footer">
          <span className="sidebar-version">Dayali v0.1.0</span>
        </div>
      </aside>
    </>
  );
}
