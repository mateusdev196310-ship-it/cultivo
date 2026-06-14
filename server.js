import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000;
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

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
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || ""
    };
    res.writeHead(200, {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    });
    res.end(`window.CULTIVA_CONFIG = ${JSON.stringify(config)};`);
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
      res.writeHead(200, { 'Content-Type': contentType });
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
