import React, { useState, useEffect, useRef } from 'react';
import { Sprout, User, Shield, Bell, BellOff, RefreshCw } from 'lucide-react';
import { initDb, checkInactivityPenalties, normalizeDbObject, clearLocalUserData } from './db';
import { supabase } from './supabaseClient';
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
  const [installPrompt, setInstallPrompt] = useState(null); // controle de instalação do PWA
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dbUpdateTick, setDbUpdateTick] = useState(0);
  const intervalRef = useRef(null);
  const swRef = useRef(null); // referência para o ServiceWorkerRegistration

  // Inicializar banco de dados e verificar login ativo
  useEffect(() => {
    const startDb = async () => {
      await initDb(true);
      setIsDbReady(true);

      const savedUser = localStorage.getItem('cultiva_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Rodar verificação de inatividade e atualizar pontos locais se mudou
        const penaltyUpdated = checkInactivityPenalties(parsed.email);
        if (penaltyUpdated) {
          const latestUsers = JSON.parse(localStorage.getItem('cultiva_users') || '[]');
          const cleanEmail = parsed.email.trim().toLowerCase();
          const found = latestUsers.find(u => u.email === cleanEmail);
          if (found) {
            setUser(found);
            localStorage.setItem('cultiva_user', JSON.stringify(found));
          }
        }
      }
    };
    startDb();

    const savedUser = localStorage.getItem('cultiva_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Verificar se notificações estavam ativadas anteriormente
    const savedEnabled = localStorage.getItem(NOTIF_ENABLED_KEY) === 'true';
    setNotifEnabled(savedEnabled);

    // Registrar Service Worker com recarga automática se houver atualização
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        swRef.current = registration;
        console.log('[Cultiva] SW registrado:', registration.scope);

        // Forçar busca de updates na inicialização
        registration.update().catch(err => console.warn('[SW Update] Erro:', err));

        // Ouvir atualizações que estão sendo ativadas
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                console.log('[Cultiva SW] Novo SW ativado! Recarregando página...');
                window.location.reload();
              }
            });
          }
        });
      }).catch((err) => {
        console.warn('[Cultiva] Erro ao registrar SW:', err);
      });

      // Recarrega quando o service worker assume o controle da página
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          console.log('[Cultiva SW] Controle alterado! Recarregando página...');
          window.location.reload();
        }
      });
    }
  }, []);

  // Evitar que o Render entre em suspensão enquanto o usuário estiver ativo na página
  useEffect(() => {
    const keepAlive = () => {
      fetch('/ping')
        .then(() => console.log('[Cultiva] Keep-alive ping enviado com sucesso.'))
        .catch(err => console.warn('[Cultiva] Erro no ping keep-alive:', err));
    };

    // Pinga a cada 5 minutos (300.000 ms)
    const interval = setInterval(keepAlive, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Sincronizar perfil do usuário com o Supabase ao mudar de aba para atualizar turma/XP
  useEffect(() => {
    const syncUserProfile = async () => {
      if (!user || !supabase) return;
      try {
        const cleanEmail = user.email.trim().toLowerCase();
        const { data: latestProfile } = await supabase
          .from('users')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();
        
        if (latestProfile) {
          const normalizedProfile = normalizeDbObject(latestProfile);
          const hasChanged = normalizedProfile.turmaId !== user.turmaId || normalizedProfile.points !== user.points;
          if (hasChanged) {
            const updated = { ...user, ...normalizedProfile };
            setUser(updated);
            localStorage.setItem('cultiva_user', JSON.stringify(updated));
            console.log('[App Sync] Perfil do usuário atualizado a partir do banco:', updated);
          }
        } else {
          console.log('[App Sync] Perfil não encontrado no banco. Efetuando logout automático.');
          clearLocalUserData(cleanEmail);
          setUser(null);
        }
      } catch (err) {
        console.warn('[App Sync] Falha ao sincronizar perfil do usuário:', err);
      }
    };
    syncUserProfile();
  }, [activeTab, user?.email, user?.turmaId, user?.points]);

  // Capturar evento de instalação do PWA
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setInstallPrompt(null);
      console.log('[Cultiva] PWA instalado com sucesso!');
    });
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`[Cultiva] Instalação do PWA pelo usuário: ${outcome}`);
    setInstallPrompt(null);
  };

  // Função que verifica e dispara o lembrete nos horários reais: 08:00h, 13:30h e 16:00h
  const checkAndSendDailyReminder = () => {
    const enabled = localStorage.getItem(NOTIF_ENABLED_KEY) === 'true';
    if (!enabled) return;
    if (Notification.permission !== 'granted') return;

    const now = new Date();
    const hrs = now.getHours();
    const mins = now.getMinutes();
    const todayDateStr = now.toISOString().split('T')[0];

    let currentWindow = null;

    if (hrs === 8 && mins >= 0 && mins < 5) {
      currentWindow = 'morning';
    } else if (hrs === 13 && mins >= 30 && mins < 35) {
      currentWindow = 'afternoon1';
    } else if (hrs === 16 && mins >= 0 && mins < 5) {
      currentWindow = 'afternoon2';
    }

    if (currentWindow) {
      const windowKey = `${currentWindow}_${todayDateStr}`;
      const lastSentWindow = localStorage.getItem('cultiva_last_notif_window');

      if (lastSentWindow !== windowKey) {
        localStorage.setItem('cultiva_last_notif_window', windowKey);
        sendDailyReminder(currentWindow);
      }
    }
  };

  // Envia o lembrete via SW (se disponível) ou Notification API diretamente
  const sendDailyReminder = (windowContext = 'morning') => {
    if (Notification.permission !== 'granted') return;

    localStorage.setItem(NOTIF_LAST_SENT_KEY, Date.now().toString());

    const windowMsgs = {
      morning: { title: '🌿 Bom dia! Hora do sol ☀️', body: 'Comece o dia colocando sua plantinha para tomar sol e regue se a terra estiver seca! 🌱' },
      afternoon1: { title: '🌱 Cultiva APP: Lembrete das 13:30h', body: 'Como está sua sementinha ou plântula nesta tarde? Aproveite para dar uma olhada nela! 💧' },
      afternoon2: { title: '💪 Fim da tarde: Cultiva APP', body: 'Não se esqueça do cuidado verde de hoje! Veja se sua planta está bem e segura. 🌿' }
    };

    const msg = windowMsgs[windowContext] || windowMsgs.morning;

    if (swRef.current && swRef.current.active) {
      swRef.current.active.postMessage({ type: 'DAILY_REMINDER', window: windowContext });
    } else {
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
      checkAndSendDailyReminder();
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

  // Sincronização em tempo real global
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('global-realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
        console.log('[Realtime Sync] Alteração detectada no banco:', payload.table, payload.eventType);
        try {
          await initDb(true);
          setDbUpdateTick(prev => prev + 1);
        } catch (err) {
          console.warn('[Realtime Sync] Falha ao sincronizar dados recebidos:', err);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await initDb(true);
      setDbUpdateTick(prev => prev + 1);
      console.log('[Manual Sync] Banco de dados sincronizado manualmente!');
    } catch (err) {
      console.warn('[Manual Sync] Falha ao sincronizar manualmente:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  // Toggle de ativar/desativar notificações
  const handleToggleNotifications = async () => {
    if (notifEnabled) {
      localStorage.setItem(NOTIF_ENABLED_KEY, 'false');
      setNotifEnabled(false);
      setNotifStatus('🔕 Lembretes desativados.');
      setTimeout(() => setNotifStatus(''), 3000);
      return;
    }

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

      new Notification('🌿 Lembretes Ativados!', {
        body: `Você receberá avisos diários nos horários de cultivo: 08:00 AM, 13:30 PM e 16:00 PM. 🌱`,
        icon: '/favicon.svg',
        tag: 'cultiva-activation',
      });
      setNotifStatus(`✅ Lembretes ativos (08:00, 13:30 e 16:00).`);
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
    sendDailyReminder('morning');
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
    
    // Rodar verificação de inatividade ao logar
    const penaltyUpdated = checkInactivityPenalties(userData.email);
    if (penaltyUpdated) {
      const latestUsers = JSON.parse(localStorage.getItem('cultiva_users') || '[]');
      const cleanEmail = userData.email.trim().toLowerCase();
      const found = latestUsers.find(u => u.email === cleanEmail);
      if (found) {
        setUser(found);
        localStorage.setItem('cultiva_user', JSON.stringify(found));
      }
    }

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
            <button
              onClick={handleManualRefresh}
              className={`btn-global-refresh ${isRefreshing ? 'spinning' : ''}`}
              title="Atualizar dados do servidor"
              disabled={isRefreshing}
            >
              <RefreshCw size={16} />
            </button>
            {installPrompt && (
              <button className="btn-install-pwa animate-pulse" onClick={handleInstallPwa}>
                📥 Baixar App
              </button>
            )}
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
                title={notifEnabled ? 'Lembretes ativos (08h, 13:30h e 16h) — Clique para desativar' : 'Ativar lembretes diários'}
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
          {activeTab === 'gallery' && <Gallery user={user} dbUpdateTick={dbUpdateTick} />}
          {activeTab === 'feed' && <Feed user={user} dbUpdateTick={dbUpdateTick} />}
          {activeTab === 'ranking' && <Ranking currentUser={user} dbUpdateTick={dbUpdateTick} />}
          {activeTab === 'admin' && user.isAdmin && <Admin dbUpdateTick={dbUpdateTick} />}
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
