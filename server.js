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

  // Auto-ping a cada 5 minutos
  if (RENDER_EXTERNAL_URL) {
    console.log(`[Server] Configurando auto-ping para: ${RENDER_EXTERNAL_URL}`);
    // Usando a API Fetch global do Node 18+
    setInterval(() => {
      fetch(RENDER_EXTERNAL_URL)
        .then(() => console.log('[Server] Auto-ping enviado com sucesso.'))
        .catch(err => console.warn('[Server] Erro no auto-ping:', err));
    }, 5 * 60 * 1000);
  } else {
    console.log('[Server] RENDER_EXTERNAL_URL não encontrada. Auto-ping desativado.');
  }
});
