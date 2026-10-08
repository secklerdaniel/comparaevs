import { db, sendJson, sendError } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return sendError(res, 405, "Método não suportado.");
  try {
    const { email, origem } = req.body ?? {};
    if (!email) return sendError(res, 400, "Campo 'email' obrigatório.");
    await db().query(`insert into public.newsletter_leads (email, origem) values ($1, $2)`, [
      email,
      origem ?? null,
    ]);
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    console.error("api/leads-newsletter:", err);
    return sendError(res, 500, err instanceof Error ? err.message : "Erro interno.");
  }
}
