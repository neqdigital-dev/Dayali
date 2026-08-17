import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/useUIStore';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthForm() {
  const { t } = useTranslation();
  const addToast = useUIStore((s) => s.addToast);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      addToast({ type: 'error', message: error.message || 'Erro ao conectar com Google' });
      setLoading(false);
    }
  };

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        addToast({ type: 'success', message: 'Bem-vindo de volta!' });
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        addToast({ type: 'success', message: 'Conta criada com sucesso!' });
      }
    } catch (error: any) {
      addToast({ type: 'error', message: error.message || 'Erro na autenticação' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, width: '100%', margin: '0 auto', padding: 'var(--space-8)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-md)', 
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'var(--text-2xl)', fontWeight: 'bold', margin: '0 auto var(--space-4)'
        }}>D</div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>
          {isLogin ? 'Entrar no Dayali' : 'Criar conta no Dayali'}
        </h2>
        <p className="text-secondary" style={{ marginTop: 'var(--space-2)' }}>
          Seu painel pessoal de organização
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-group">
        <button 
          type="button" 
          className="btn btn-outline" 
          style={{ width: '100%', marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar com o Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--space-4) 0', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          <span style={{ padding: '0 var(--space-3)' }}>ou com e-mail</span>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
        </div>

        <div className="form-group">
          <label className="label">E-mail</label>
          <input
            {...register('email')}
            type="email"
            className="input"
            placeholder="seu@email.com"
            disabled={loading}
          />
          {errors.email && <span className="form-error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label className="label">Senha</label>
          <input
            {...register('password')}
            type="password"
            className="input"
            placeholder="••••••••"
            disabled={loading}
          />
          {errors.password && <span className="form-error">{errors.password.message}</span>}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: 'var(--space-4)' }}
          disabled={loading}
        >
          {loading ? t('actions.loading') : isLogin ? 'Entrar' : 'Criar conta'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
        <button 
          type="button" 
          className="btn btn-ghost btn-sm"
          onClick={() => setIsLogin(!isLogin)}
          disabled={loading}
        >
          {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
        </button>
      </div>
    </div>
  );
}
