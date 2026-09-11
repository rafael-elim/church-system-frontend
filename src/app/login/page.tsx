'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { AuthCard } from '@/components/molecules/AuthCard/AuthCard';
import Link from 'next/link';
import { AuthUser } from '@/types/auth-user';
import { getDefaultAuthenticatedPath } from '@/utils/permissions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  async function handleLogin() {
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      login(response.data.token, {
        id: response.data.userId,
        email: response.data.email,
        name: response.data.name,
        companyId: response.data.companyId,
      });

      const me = await api.get<AuthUser>('/auth/me');
      login(response.data.token, me.data);
      router.push(getDefaultAuthenticatedPath(me.data));
    } catch {
      setError('Usuário ou senha inválidos');
    }
  }

  return (
    <AuthCard
      title="Acesse sua conta"
      subtitle="Insira suas credenciais para fazer login"
      footer={
        <Link href="/register">Criar uma nova conta</Link>
      }
    >
      <h1>Login</h1>

      <input
        id="email"
        name="email"
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        id="password"
        name="password"
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={handleLogin}>Entrar</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p>
        Não tem conta?{' '}
        <a href="/register">Cadastre-se</a>
      </p>

    </AuthCard>
  );
}
