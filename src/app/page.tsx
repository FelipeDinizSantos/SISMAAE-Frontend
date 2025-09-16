'use client';

import './Login.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const jaLogado = localStorage.getItem('token');
    if (jaLogado) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idtMilitar: email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || 'Erro ao realizar login.');
        setLoading(false);
        return;
      }

      await login(data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setErro('Erro na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="inner">
          <div className="card">
            <div className="card-content">
              <h1 className="form-title">Entre com seus dados</h1>
              <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Identidade Militar</label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Ex: 1234567890"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group password-group">
                  <label htmlFor="password">Senha</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      required
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                      {showPassword ? '🔓' : '🔒'}
                    </button>
                  </div>
                </div>

                {erro && <p style={{ color: 'red' }}>{erro}</p>}

                <button type="submit" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>

                <p className="register-text">
                  Sem acesso? <a href="/registrar">Entre em contato com nossa equipe</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}