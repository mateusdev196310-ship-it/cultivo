import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import webPush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const PORT = process.env.PORT || 3000;
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn('[Server] Supabase URL ou Anon Key ausentes. Recursos do banco desativados.');
}

// Configuração do Web Push (VAPID Keys)
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || "BK9gu45ouwu5ajLR1P5C4g2qc11u4RwjV7sxWxeBYBOB1eHwPYRaanS0d4t_N0f0Yayjrxfl2zRnSSNYS5Nq2zg";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "AvtzGCzuYe6lGmAXah5WK4WvNdZrwcuhX70yEbEyB5Y";
const vapidEmail = process.env.VAPID_EMAIL || "mailto:mateusdev196310@gmail.com";

webPush.setVapidDetails(
  vapidEmail,
  vapidPublicKey,
  vapidPrivateKey
);

console.log('[Server] Web-Push VAPID configurado com sucesso.');

// Função para obter o horário atual no fuso America/Sao_Paulo (Brasília)
const getBrasiliaTime = () => {
  try {
    const options = {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const formatter = new Intl.DateTimeFormat('pt-BR', options);
    const formatted = formatter.format(new Date()); // ex: "08:30:15"
    const [hour, minute, second] = formatted.split(':').map(Number);
    return { hour, minute, second };
  } catch (err) {
    console.error('[Time] Erro ao obter fuso horário de Brasília, usando hora local:', err);
    const now = new Date();
    return { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };
  }
};

// Envia as notificações em lote para todos os assinantes
async function sendScheduledReminders(windowContext) {
  if (!supabase) {
    console.warn('[Scheduler] Banco Supabase não conectado. Não é possível disparar push.');
    return;
  }

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('email, name, pushSubscription')
      .not('pushSubscription', 'is', null);

    if (error) {
      console.error('[Scheduler] Erro ao buscar assinaturas de push no Supabase:', error);
      return;
    }

    if (!users || users.length === 0) {
      console.log('[Scheduler] Nenhuma assinatura de push ativa encontrada.');
      return;
    }

    const windowMsgs = {
      morning: {
        title: '🌿 Bom dia! Hora do sol ☀️',
        body: 'Comece o dia colocando sua plantinha para tomar sol e regue se a terra estiver seca! 🌱'
      },
      afternoon1: {
        title: '🌱 Cultiva APP: Lembrete das 13:30h',
        body: 'Como está sua sementinha ou plântula nesta tarde? Aproveite para dar uma olhada nela! 💧'
      },
      afternoon2: {
        title: '💪 Fim da tarde: Cultiva APP',
        body: 'Não se esqueça do cuidado verde de hoje! Veja se sua planta está bem e segura. 🌿'
      }
    };

    const msg = windowMsgs[windowContext] || windowMsgs.morning;
    const payload = JSON.stringify(msg);

    console.log(`[Scheduler] Iniciando envio para ${users.length} usuários para a janela: ${windowContext}`);

    for (const u of users) {
      const sub = u.pushSubscription;
      if (!sub || typeof sub !== 'object') continue;

      webPush.sendNotification(sub, payload)
        .then(() => {
          console.log(`[Scheduler] Notificação enviada com sucesso para ${u.email}`);
        })
        .catch(async (err) => {
          console.error(`[Scheduler] Erro ao enviar notificação para ${u.email}:`, err.message);
          // 410 (Gone) ou 404 (Not Found) indica assinatura inválida/expirada
          if (err.statusCode === 410 || err.statusCode === 404) {
            console.log(`[Scheduler] Removendo assinatura inválida de ${u.email}`);
            await supabase
              .from('users')
              .update({ pushSubscription: null })
              .eq('email', u.email);
          }
        });
    }
  } catch (err) {
    console.error('[Scheduler] Falha geral ao enviar lembretes:', err);
  }
}

// Histórico para garantir envio único diário por janela de tempo
let lastSentReminders = {
  date: '',
  morning: false,
  afternoon1: false,
  afternoon2: false
};

const checkAndSendScheduledReminders = () => {
  const { hour, minute } = getBrasiliaTime();
  const today = new Date().toISOString().split('T')[0];

  // Reseta ao mudar o dia
  if (lastSentReminders.date !== today) {
    lastSentReminders = {
      date: today,
      morning: false,
      afternoon1: false,
      afternoon2: false
    };
  }

  // 08:00 BRT
  if (hour === 8 && minute === 0 && !lastSentReminders.morning) {
    lastSentReminders.morning = true;
    sendScheduledReminders('morning');
  }

  // 13:30 BRT
  if (hour === 13 && minute === 30 && !lastSentReminders.afternoon1) {
    lastSentReminders.afternoon1 = true;
    sendScheduledReminders('afternoon1');
  }

  // 16:00 BRT
  if (hour === 16 && minute === 0 && !lastSentReminders.afternoon2) {
    lastSentReminders.afternoon2 = true;
    sendScheduledReminders('afternoon2');
  }
};

// Iniciar agendamento em background (checa a cada 30 segundos)
setInterval(checkAndSendScheduledReminders, 30000);

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  // Rota rápida de ping para manter o servidor ativo e para monitoramento
  if (req.url === '/ping' || req.url === '/healthz') {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    });
    res.end('pong');
    return;
  }

  // Rota de configuração dinâmica em tempo de execução
  if (req.url === '/config.js') {
    const config = {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || "",
      VITE_VAPID_PUBLIC_KEY: vapidPublicKey
    };
    res.writeHead(200, {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    });
    res.end(`window.CULTIVA_CONFIG = ${JSON.stringify(config)};`);
    return;
  }

  // Rota para disparar push de teste (manual)
  if (req.url === '/api/send-push' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const { subscription, title, body: msgBody } = payload;
        
        if (!subscription) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Assinatura (subscription) obrigatória.' }));
          return;
        }

        const pushPayload = JSON.stringify({
          title: title || '🌿 Teste do Cultiva APP',
          body: msgBody || 'Suas notificações push estão funcionando perfeitamente! 🎉'
        });

        await webPush.sendNotification(subscription, pushPayload);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error('[API Push] Erro ao enviar push:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Decodificar URL para lidar com espaços e acentos
  let filePath = path.join(distPath, decodeURIComponent(req.url));
  
  // Se for diretório, serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Se o arquivo não existir, faz fallback para index.html (comportamento SPA)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distPath, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erro interno do servidor');
    } else {
      const headers = { 'Content-Type': contentType };
      if (ext === '.html') {
        headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
      }
      res.writeHead(200, headers);
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`[Server] rodando na porta ${PORT}`);

  const externalUrl = RENDER_EXTERNAL_URL || process.env.APP_URL;

  // Auto-ping a cada 5 minutos
  if (externalUrl) {
    const targetPingUrl = `${externalUrl.replace(/\/$/, '')}/ping`;
    console.log(`[Server] Configurando auto-ping para: ${targetPingUrl}`);
    
    const doPing = () => {
      fetch(targetPingUrl)
        .then(res => {
          if (res.ok) {
            console.log(`[Server] Auto-ping enviado com sucesso para ${targetPingUrl}`);
          } else {
            console.warn(`[Server] Auto-ping respondeu com status: ${res.status}`);
          }
        })
        .catch(err => console.warn('[Server] Erro no auto-ping:', err.message));
    };

    // Executa um ping inicial após 10 segundos para testar e manter acordado desde o boot
    setTimeout(doPing, 10000);

    // Repete a cada 5 minutos
    setInterval(doPing, 5 * 60 * 1000);
  } else {
    console.log('[Server] RENDER_EXTERNAL_URL/APP_URL não encontrada. Auto-ping desativado.');
  }
});
