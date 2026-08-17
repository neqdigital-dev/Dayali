import AuthForm from '../components/auth/AuthForm';

export default function Login() {
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
