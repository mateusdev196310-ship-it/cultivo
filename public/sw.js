const CACHE_NAME = 'cultiva-app-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg'
];

// Instalação do Service Worker e cache inicial de arquivos estáticos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação do Service Worker e limpeza de caches antigos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação de requisições: Tenta rede, se falhar vai para o cache
self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (e.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// ====== NOTIFICAÇÕES DIÁRIAS ======

// Mensagens rotativas de lembrete
const MENSAGENS_LEMBRETE = [
  {
    title: '🌿 Hora de cuidar da sua planta!',
    body: 'Regue sua plantinha e deixe-a tomar sol por pelo menos 2 horas hoje! ☀️💧'
  },
  {
    title: '🌱 Cultiva APP te lembra!',
    body: 'Sua planta está com saudades de você! Verifique como ela está crescendo hoje. 🌱'
  },
  {
    title: '☀️ Dia de cuidar do verde!',
    body: 'Não esqueça: rega diária + sol direto = planta forte e saudável! 💪🌿'
  },
  {
    title: '💧 Hora da Rega! Cultiva APP',
    body: 'Passou um dia desde o último lembrete. Sua planta precisa de água e carinho hoje!'
  },
  {
    title: '🌻 Bom dia, jardineiro(a)!',
    body: 'Comece o dia cuidando da sua sementinha. Registre uma foto nova se ela cresceu! 📸'
  }
];

// Receber notificação push (quando app estiver fechado)
self.addEventListener('push', (e) => {
  const idx = Math.floor(Math.random() * MENSAGENS_LEMBRETE.length);
  const msg = MENSAGENS_LEMBRETE[idx];

  e.waitUntil(
    self.registration.showNotification(msg.title, {
      body: msg.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'cultiva-daily-reminder',
      renotify: true,
      requireInteraction: false,
      vibrate: [200, 100, 200]
    })
  );
});

// Receber mensagem do app principal para disparar notificação local
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'DAILY_REMINDER') {
    const windowContext = e.data.window || 'morning';
    const windowMsgs = {
      morning: { title: '🌿 Bom dia! Hora do sol ☀️', body: 'Comece o dia colocando sua plantinha para tomar sol e regue se a terra estiver seca! 🌱' },
      afternoon1: { title: '🌱 Cultiva APP: Lembrete das 13:30h', body: 'Como está sua sementinha ou plântula nesta tarde? Aproveite para dar uma olhada nela! 💧' },
      afternoon2: { title: '💪 Fim da tarde: Cultiva APP', body: 'Não se esqueça do cuidado verde de hoje! Veja se sua planta está bem e segura. 🌿' }
    };
    const msg = windowMsgs[windowContext] || windowMsgs.morning;

    self.registration.showNotification(msg.title, {
      body: msg.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'cultiva-daily-reminder',
      renotify: true,
      requireInteraction: false,
      vibrate: [200, 100, 200],
      actions: [
        { action: 'abrir', title: '🌿 Abrir App' },
        { action: 'dispensar', title: 'Dispensar' }
      ]
    });
  }
});

// Clique na notificação: abre o app
self.addEventListener('notificationclick', (e) => {
  e.notification.close();

  if (e.action === 'dispensar') return;

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se o app já estiver aberto, foca nele
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Senão, abre uma nova janela
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
