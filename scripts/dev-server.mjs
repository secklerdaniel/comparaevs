// Servidor local só pra testar as funções de /api antes do deploy de
// verdade — não faz parte do projeto (não vai pro Vercel). Serve os
// arquivos estáticos da raiz e roteia /api/<nome> pro handler
// correspondente, imitando a assinatura (req, res) que a Vercel usa pra
// funções serverless Node simples.
//
// node --env-file=.env.local scripts/dev-server.mjs
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL("..", import.meta.url)));
const PORT = 8789;

const MIME = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };

function parseQuery(url) {
  const u = new URL(url, "http://localhost");
  return Object.fromEntries(u.searchParams.entries());
}

async function callApi(name, req, res) {
  const mod = await import(`../api/${name}.js?t=${Date.now()}`);
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString("utf-8");

  const shimRes = {
    _status: 200,
    status(code) { this._status = code; return this; },
    setHeader(k, v) { res.setHeader(k, v); return this; },
    end(body) { res.writeHead(this._status); res.end(body); },
  };

  const shimReq = {
    method: req.method,
    query: parseQuery(req.url),
    body: rawBody ? JSON.parse(rawBody) : undefined,
  };

  await mod.default(shimReq, shimRes);
}

const server = http.createServer(async (req, res) => {
  const path = req.url.split("?")[0];

  if (path.startsWith("/api/")) {
    const name = path.slice(5);
    try {
      await callApi(name, req, res);
    } catch (err) {
      console.error(`api/${name}:`, err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }));
    }
    return;
  }

  const filePath = join(ROOT, path === "/" ? "/index.html" : path);
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => console.log(`Dev server local em http://localhost:${PORT}`));
