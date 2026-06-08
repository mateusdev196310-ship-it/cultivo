import React, { useState, useEffect, useRef } from 'react';
import { Sprout, User, Shield, Bell, BellOff } from 'lucide-react';
import { initDb } from './db';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Learn from './components/Learn';
import Gallery from './components/Gallery';
import Feed from './components/Feed';
import Admin from './components/Admin';
import Ranking from './components/Ranking';

// Chaves no localStorage para controle de notificações
const NOTIF_ENABLED_KEY = 'cultiva_notif_enabled';
const NOTIF_LAST_SENT_KEY = 'cultiva_notif_last_sent';
const NOTIF_HOUR_KEY = 'cultiva_notif_hour'; // hora preferida (padrão 8h)

const DEFAULT_HOUR = 8; // 8h da manhã
const MS_24H = 24 * 60 * 60 * 1000;
const CHECK_INTERVAL = 60 * 1000; // verificar a cada 1 minuto

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('learn');
  const [isDbReady, setIsDbReady] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifStatus, setNotifStatus] = useState(''); // mensagem de status para o usuário
  const intervalRef = useRef(null);
  const swRef = useRef(null); // referência para o ServiceWorkerRegistration

  // Inicializar banco de dados e verificar login ativo
  useEffect(() => {
    const startDb = async () => {
      await initDb(true);
      setIsDbReady(true);
    };
    startDb();

    const savedUser = localStorage.getItem('cultiva_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Verificar se notificações estavam ativadas anteriormente
    const savedEnabled = localStorage.getItem(NOTIF_ENABLED_KEY) === 'true';
    setNotifEnabled(savedEnabled);

    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        swRef.current = registration;
        console.log('[Cultiva] SW registrado:', registration.scope);
      }).catch((err) => {
        console.warn('[Cultiva] Erro ao registrar SW:', err);
      });
    }
  }, []);

  // Função que verifica e dispara o lembrete diário
  const checkAndSendDailyReminder = () => {
    const enabled = localStorage.getItem(NOTIF_ENABLED_KEY) === 'true';
    if (!enabled) return;
    if (Notification.permission !== 'granted') return;

    const now = new Date();
    const currentHour = now.getHours();
    const preferredHour = parseInt(localStorage.getItem(NOTIF_HOUR_KEY) || DEFAULT_HOUR);
    const lastSentStr = localStorage.getItem(NOTIF_LAST_SENT_KEY);
    const lastSent = lastSentStr ? parseInt(lastSentStr) : 0;
    const msSinceLastSent = Date.now() - lastSent;

    // Disparar se: está na hora certa E ainda não enviou hoje (>23h desde o último)
    const isCorrectHour = currentHour === preferredHour;
    const sentMoreThan23hAgo = msSinceLastSent > (23 * 60 * 60 * 1000);

    if (isCorrectHour && sentMoreThan23hAgo) {
      sendDailyReminder();
    }
  };

  // Envia o lembrete via SW (se disponível) ou Notification API diretamente
  const sendDailyReminder = () => {
    if (Notification.permission !== 'granted') return;

    // Salvar timestamp do envio
    localStorage.setItem(NOTIF_LAST_SENT_KEY, Date.now().toString());

    if (swRef.current && swRef.current.active) {
      // Enviar via Service Worker (funciona mesmo com app em background)
      swRef.current.active.postMessage({ type: 'DAILY_REMINDER' });
    } else {
      // Fallback: notificação direta
      const msgs = [
        { title: '🌿 Hora de cuidar da sua planta!', body: 'Regue sua plantinha e deixe-a tomar sol hoje! ☀️💧' },
        { title: '🌱 Cultiva APP te lembra!', body: 'Sua planta está com saudades! Veja como ela cresceu hoje. 🌱' },
        { title: '☀️ Dia de cuidar do verde!', body: 'Rega diária + sol direto = planta forte e saudável! 💪' },
      ];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      new Notification(msg.title, {
        body: msg.body,
        icon: '/favicon.svg',
        tag: 'cultiva-daily-reminder',
        renotify: true,
      });
    }
  };

  // Ativar o intervalo de verificação diária quando notificações estiverem ativas
  useEffect(() => {
    if (notifEnabled) {
      // Verificar imediatamente ao ativar
      checkAndSendDailyReminder();
      // Depois verifica a cada minuto
      intervalRef.current = setInterval(checkAndSendDailyReminder, CHECK_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [notifEnabled]);

  // Toggle de ativar/desativar notificações
  const handleToggleNotifications = async () => {
    if (notifEnabled) {
      // Desativar
      localStorage.setItem(NOTIF_ENABLED_KEY, 'false');
      setNotifEnabled(false);
      setNotifStatus('🔕 Lembretes desativados.');
      setTimeout(() => setNotifStatus(''), 3000);
      return;
    }

    // Ativar — verificar permissão
    if (!('Notification' in window)) {
      setNotifStatus('❌ Seu navegador não suporta notificações.');
      setTimeout(() => setNotifStatus(''), 4000);
      return;
    }

    if (Notification.permission === 'denied') {
      setNotifStatus('🔒 Notificações bloqueadas. Ative nas configurações do navegador.');
      setTimeout(() => setNotifStatus(''), 5000);
      return;
    }

    let permission = Notification.permission;
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'granted') {
      localStorage.setItem(NOTIF_ENABLED_KEY, 'true');
      setNotifEnabled(true);

      // Enviar confirmação imediata
      const preferredHour = parseInt(localStorage.getItem(NOTIF_HOUR_KEY) || DEFAULT_HOUR);
      new Notification('🌿 Lembretes Ativados!', {
        body: `Você receberá lembretes diários às ${preferredHour}h para cuidar da sua planta. 🌱`,
        icon: '/favicon.svg',
        tag: 'cultiva-activation',
      });
      setNotifStatus(`✅ Lembretes ativados! Aviso diário às ${preferredHour}h.`);
      setTimeout(() => setNotifStatus(''), 4000);
    } else {
      setNotifStatus('❌ Permissão negada. Ative nas configurações do navegador.');
      setTimeout(() => setNotifStatus(''), 4000);
    }
  };

  // Disparar lembrete manual (botão 🔔)
  const handleManualReminder = () => {
    if (Notification.permission !== 'granted') {
      handleToggleNotifications();
      return;
    }
    sendDailyReminder();
    setNotifStatus('📨 Lembrete enviado agora!');
    setTimeout(() => setNotifStatus(''), 3000);
  };

  const handleUpdateUserPoints = (newPoints) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, points: newPoints };
      localStorage.setItem('cultiva_user', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('cultiva_user', JSON.stringify(userData));
    if (userData.isAdmin) {
      setActiveTab('admin');
    } else {
      setActiveTab('learn');
    }
  };

  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair do aplicativo?")) {
      setUser(null);
      localStorage.removeItem('cultiva_user');
      setActiveTab('learn');
    }
  };

  if (!isDbReady) {
    return (
      <div className="loading-screen">
        <Sprout size={48} className="spinner text-green" />
        <p>Carregando o Cultiva APP...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const preferredHour = parseInt(localStorage.getItem(NOTIF_HOUR_KEY) || DEFAULT_HOUR);

  return (
    <div className="mobile-app-wrapper">
      <div className="mobile-frame">
        {/* Cabeçalho do Aplicativo */}
        <header className="app-header">
          <div className="header-logo">
            <Sprout className="logo-icon" size={24} />
            <h1>Cultiva</h1>
          </div>

          <div className="header-user-profile">
            <div className="user-info-text">
              <span className="user-name-label">{user.name}</span>
              {user.isAdmin ? (
                <span className="user-role-badge admin">ADM</span>
              ) : (
                <span className="user-role-badge student">{user.points || 0} XP</span>
              )}
            </div>
            <div className="user-avatar-circle">
              {user.isAdmin ? <Shield size={16} /> : <User size={16} />}
            </div>
          </div>
        </header>

        {/* Banner de Cuidado Diário com Controle de Notificação */}
        {!user.isAdmin && (
          <div className="care-reminder-banner animate-fade-in">
            <span className="reminder-icon">☀️💧</span>
            <div className="reminder-text">
              <strong>Cuidado Diário:</strong> Regue sua planta e coloque-a sob a luz do sol!
              {notifStatus && (
                <div className="notif-status-msg animate-fade-in">{notifStatus}</div>
              )}
            </div>
            <div className="notif-controls">
              {/* Botão de enviar lembrete agora */}
              <button
                className="btn-bell-reminder"
                onClick={handleManualReminder}
                title="Enviar lembrete agora"
              >
                📨
              </button>
              {/* Botão toggle de notificações diárias */}
              <button
                className={`btn-bell-toggle ${notifEnabled ? 'active' : ''}`}
                onClick={handleToggleNotifications}
                title={notifEnabled ? `Notificações ativas (${preferredHour}h) — Clique para desativar` : 'Ativar lembretes diários'}
              >
                {notifEnabled ? <Bell size={16} /> : <BellOff size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo Principal (Scrollável) */}
        <main className="app-content">
          {activeTab === 'learn' && (
            <Learn
              user={user}
              onUpdateUserPoints={handleUpdateUserPoints}
              onGoToRanking={() => setActiveTab('ranking')}
            />
          )}
          {activeTab === 'gallery' && <Gallery user={user} />}
          {activeTab === 'feed' && <Feed user={user} />}
          {activeTab === 'ranking' && <Ranking currentUser={user} />}
          {activeTab === 'admin' && user.isAdmin && <Admin />}
        </main>

        {/* Barra de Navegação Inferior */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}
