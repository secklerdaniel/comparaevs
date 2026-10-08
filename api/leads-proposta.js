import { db, sendJson, sendError } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return sendError(res, 405, "Método não suportado.");
  try {
    const { nome, whatsapp, email, cidade, veiculo_id, veiculo_marca, veiculo_modelo, origem } = req.body ?? {};
    if (!nome || !whatsapp) return sendError(res, 400, "Campos 'nome' e 'whatsapp' obrigatórios.");
    await db().query(
      `insert into public.leads_propostas (nome, whatsapp, email, cidade, veiculo_id, veiculo_marca, veiculo_modelo, origem)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [nome, whatsapp, email ?? null, cidade ?? null, veiculo_id ?? null, veiculo_marca ?? null, veiculo_modelo ?? null, origem ?? "comparador"]
    );
    return sendJson(res, 200, { ok: true });
  } catch (err) {
    console.error("api/leads-proposta:", err);
    return sendError(res, 500, err instanceof Error ? err.message : "Erro interno.");
  }
}
