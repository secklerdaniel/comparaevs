// Servidor de desenvolvimento: serve os .html e executa as funções de /api
// como a Vercel faz. Só para testar local — não vai para produção.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// split com \r?\n: no Windows o \r ficava colado no valor e a connection
// string do Neon virava inválida, caindo no localhost:5432 default do pg.
for (const linha of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = linha.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (m) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, '');
}
if (!process.env.NEON_DATABASE_URL) {
  console.error('NEON_DATABASE_URL não carregou do .env.local');
  process.exit(1);
}

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
  '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.json': 'application/json',
};

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost');

  if (u.pathname.startsWith('/api/')) {
    const arquivo = path.resolve('api', u.pathname.slice(5) + '.js');
    if (!fs.existsSync(arquivo)) { res.writeHead(404).end('{"error":"rota inexistente"}'); return; }

    let corpo = '';
    for await (const c of req) corpo += c;
    req.query = Object.fromEntries(u.searchParams);
    try { req.body = corpo ? JSON.parse(corpo) : undefined; } catch { req.body = undefined; }
    res.status = (c) => { res.statusCode = c; return res; };

    try {
      const { default: handler } = await import(pathToFileURL(arquivo).href);
      await handler(req, res);
    } catch (e) {
      console.error(e);
      if (!res.writableEnded) res.writeHead(500).end(JSON.stringify({ error: String(e) }));
    }
    return;
  }

  let p = u.pathname === '/' ? '/index.html' : u.pathname;
  if (!path.extname(p)) p += '.html';           // cleanUrls, igual à Vercel
  const arquivo = path.resolve('.' + p);
  if (!fs.existsSync(arquivo)) { res.writeHead(404).end('não encontrado'); return; }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
  fs.createReadStream(arquivo).pipe(res);
}).listen(4180, () => console.log('dev server em http://localhost:4180'));
