import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEffect } from 'react';

export default function ProtectedRoute() {
  const { user, loading, initialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  if (!initialized || loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--color-bg)',
        color: 'var(--color-text)'
      }}>
        <div className="skeleton skeleton-circle" style={{ width: 48, height: 48 }}></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
