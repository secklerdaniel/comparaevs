// node scripts/adminauth.selfcheck.mjs — confere a trava do admin da API.
import assert from "node:assert";
import { isAdmin, safeColumns } from "../api/_db.js";

const req = (key) => ({ headers: key === undefined ? {} : { "x-admin-key": key } });

delete process.env.ADMIN_KEY;
assert.equal(isAdmin(req("qualquer")), false, "sem ADMIN_KEY configurada nega tudo");

process.env.ADMIN_KEY = "segredo-123";
assert.equal(isAdmin(req("segredo-123")), true);
assert.equal(isAdmin(req("segredo-12")), false);
assert.equal(isAdmin(req("")), false);
assert.equal(isAdmin(req(undefined)), false);

assert.equal(safeColumns(["Marca", "Autonomia_km", "preco"]), true);
assert.equal(safeColumns(['Marca" = 1; drop table x; --']), false);
assert.equal(safeColumns(["a b"]), false);

console.log("ok");
