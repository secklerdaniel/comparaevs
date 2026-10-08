import pg from "pg";
import { timingSafeEqual } from "node:crypto";

// Prefixo "_" tira este arquivo do roteamento de funções da Vercel (não vira
// endpoint) — só helper compartilhado entre as outras funções de /api.

// O driver `pg` devolve bigint (OID 20 — id de pbe_veiculos_eletricos,
// pbe_motos_eletricas, patrocinadores_slots, eventos_cliques...) como
// STRING por padrão, pra não perder precisão em valores gigantes. O
// PostgREST do Supabase sempre devolveu número pra esses ids, e o
// front-end inteiro compara com `===`/Set.has() esperando número
// (selecionados.has(v.id), todosVeiculos.find(v => v.id === id)) — sem
// isso o comparador de veículos abre vazio, porque a comparação
// string/number nunca bate. Seguro fazer global aqui: nenhum id desta
// base passa perto de Number.MAX_SAFE_INTEGER.
pg.types.setTypeParser(20, (val) => parseInt(val, 10));

let pool;

export function db() {
  if (!pool) {
    pool = new pg.Pool({ connectionString: process.env.NEON_DATABASE_URL });
  }
  return pool;
}

export async function query(text, params = []) {
  const { rows } = await db().query(text, params);
  return rows;
}

// Escrita e leituras internas exigem o header x-admin-key igual à env
// ADMIN_KEY (Vercel). Sem a env configurada, nega tudo (falha fechada).
export function isAdmin(req) {
  const expected = Buffer.from(process.env.ADMIN_KEY ?? "");
  const got = Buffer.from(String(req.headers["x-admin-key"] ?? ""));
  return expected.length > 0 && got.length === expected.length && timingSafeEqual(got, expected);
}

// Nomes de coluna vêm do corpo JSON e entram no SQL como identificador —
// só letras, números e _ (senão dá pra injetar SQL por uma chave com aspas).
export function safeColumns(names) {
  return names.every((n) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(n));
}

export function sendJson(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8").end(JSON.stringify(body));
}

export function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}
