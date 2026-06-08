import React, { useState, useEffect } from 'react';
import { Sprout, Mail, User, Leaf, Users, Lock } from 'lucide-react';
import { loginUser, registerStudent, getTurmas } from '../db';

const ADMIN_EMAILS = ['esterferreira1800@gmail.com', 'esterferreira18000@gmail.com'];

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turmaId, setTurmaId] = useState('');
  const [turmas, setTurmas] = useState([]);
  const [error, setError] = useState('');

  const isAdminEmail = ADMIN_EMAILS.includes(email.trim().toLowerCase());

  useEffect(() => {
    setTurmas(getTurmas());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor, insira o seu e-mail.');
      return;
    }
    if (!password) {
      setError('Por favor, insira a sua senha.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(cleanEmail);

    try {
      if (mode === 'login') {
        const loggedUser = await loginUser(cleanEmail, password);
        onLogin(loggedUser);
      } else {
        // Cadastro (apenas alunos)
        if (isAdmin) {
          setError('Contas de administrador já existem. Por favor, faça login.');
          return;
        }
        if (!name) {
          setError('Alunos precisam preencher o nome completo.');
          return;
        }
        const loggedUser = await registerStudent(name.trim(), cleanEmail, password, null);
        onLogin(loggedUser);
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo">
            <Sprout size={48} className="logo-icon" />
          </div>
          <h1>Cultiva APP</h1>
          <p className="subtitle">Da Semente à Planta • Educação Ambiental</p>
        </div>

        {/* Seletor de Modo (Entrar vs Cadastrar) */}
        <div className="auth-mode-selector" style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          backgroundColor: '#f1f8e9',
          padding: '4px',
          borderRadius: '24px',
          border: '1px solid #c5e1a5'
        }}>
          <button
            type="button"
            className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: mode === 'login' ? 'var(--primary)' : 'transparent',
              color: mode === 'login' ? 'white' : '#558b2f',
              boxShadow: mode === 'login' ? '0 2px 6px rgba(46, 125, 50, 0.2)' : 'none'
            }}
            onClick={() => { setMode('login'); setError(''); }}
          >
            🔑 Entrar
          </button>
          <button
            type="button"
            className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: mode === 'register' ? 'var(--primary)' : 'transparent',
              color: mode === 'register' ? 'white' : '#558b2f',
              boxShadow: mode === 'register' ? '0 2px 6px rgba(46, 125, 50, 0.2)' : 'none'
            }}
            onClick={() => { setMode('register'); setError(''); }}
          >
            🌱 Cadastrar-se
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Nome Completo (apenas no Cadastro) */}
          {mode === 'register' && (
            <div className="input-group animate-fade-in" style={{ marginBottom: '16px' }}>
              <label htmlFor="name">Nome Completo</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  required
                />
              </div>
            </div>
          )}

          {/* E-mail */}
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label htmlFor="email">E-mail</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
              />
            </div>
            {isAdminEmail && mode === 'login' && (
              <p className="input-tip" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>
                Ester, insira sua senha administrativa de acesso.
              </p>
            )}
          </div>

          {/* Senha */}
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder={isAdminEmail ? "Senha do ADM" : "Sua senha"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
              />
            </div>
          </div>



          {error && <div className="error-message" style={{
            color: '#d32f2f',
            backgroundColor: '#ffebee',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            marginBottom: '16px',
            fontWeight: 500,
            border: '1px solid #ffcdd2'
          }}>{error}</div>}

          <button type="submit" className="btn btn-primary btn-block">
            {mode === 'login' ? 'Entrar no Cultiva' : 'Criar Conta'} <Leaf size={16} style={{ marginLeft: 8 }} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Aprenda jardinagem, sustentabilidade e registre o crescimento das suas plantas de forma interativa!</p>
        </div>
      </div>
    </div>
  );
}
