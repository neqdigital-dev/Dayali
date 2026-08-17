import AuthForm from '../components/auth/AuthForm';
import { Navigate } from 'react-router';
import { useAuthStore } from '../stores/useAuthStore';

export default function Login() {
  const user = useAuthStore((s) => s.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 'var(--space-4)',
      background: 'var(--color-bg)'
    }}>
      <AuthForm />
    </div>
  );
}
