import React, { useState, useEffect } from 'react';
import { Sprout, Mail, User, Leaf, Users } from 'lucide-react';
import { registerOrGetUser, getTurmas } from '../db';

const ADMIN_EMAILS = ['esterferreira1800@gmail.com', 'esterferreira18000@gmail.com'];

export default function Auth({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [turmaId, setTurmaId] = useState('');
  const [turmas, setTurmas] = useState([]);
  const [error, setError] = useState('');

  const isAdminEmail = ADMIN_EMAILS.includes(email.trim().toLowerCase());

  useEffect(() => {
    setTurmas(getTurmas());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, insira o seu e-mail.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(cleanEmail);

    if (isAdmin) {
      const loggedUser = registerOrGetUser('Ester Ferreira (ADM)', cleanEmail, true);
      onLogin(loggedUser);
    } else {
      if (!name) {
        setError('Alunos precisam preencher o nome.');
        return;
      }
      if (turmas.length > 0 && !turmaId) {
        setError('Por favor, escolha sua turma para entrar.');
        return;
      }
      const loggedUser = registerOrGetUser(name.trim(), cleanEmail, false, turmaId || null);
      onLogin(loggedUser);
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

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
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
            <p className="input-tip">Ester, use seu e-mail administrativo para entrar como ADM.</p>
          </div>

          {/* Campos só para alunos */}
          {!isAdminEmail && (
            <>
              <div className="input-group animate-fade-in">
                <label htmlFor="name">Nome Completo</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                  />
                </div>
              </div>

              {/* Seletor de Turma */}
              {turmas.length > 0 && (
                <div className="input-group animate-fade-in">
                  <label htmlFor="turma">Sua Turma 🏫</label>
                  <div className="input-wrapper">
                    <Users size={18} className="input-icon" />
                    <select
                      id="turma"
                      value={turmaId}
                      onChange={(e) => {
                        setTurmaId(e.target.value);
                        setError('');
                      }}
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        paddingLeft: '36px',
                        height: '100%',
                        fontSize: '14px',
                        color: 'var(--text-main)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">— Escolha sua turma —</option>
                      {turmas.map(t => (
                        <option key={t.id} value={t.id}>{t.nome}</option>
                      ))}
                    </select>
                  </div>
                  <p className="input-tip">Sua turma foi criada pela professora Ester.</p>
                </div>
              )}
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block">
            Entrar no Cultiva <Leaf size={16} style={{ marginLeft: 8 }} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Aprenda jardinagem, sustentabilidade e registre o crescimento das suas plantas de forma interativa!</p>
        </div>
      </div>
    </div>
  );
}
