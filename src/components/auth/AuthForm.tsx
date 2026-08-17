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
