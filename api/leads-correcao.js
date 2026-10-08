import { db, sendJson, sendError } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return sendError(res, 405, "Método não suportado.");
  try {
    const { categoria, descricao, email, origem } = req.body ?? {};
    if (!descricao) return sendError(res, 400, "Campo 'descricao' obrigatório.");
    await db().query(
      `insert into public.sugestoes_correcao (categoria, descricao, email, origem) values ($1, $2, $3, $4)`,
      [categoria ?? "Outros", descricao, email ?? null, origem ?? "comparaevs"]
    );
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    console.error("api/leads-correcao:", err);
    return sendError(res, 500, err instanceof Error ? err.message : "Erro interno.");
  }
}
