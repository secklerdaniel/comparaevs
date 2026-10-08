// node marketing-posts/post.mjs "RANKING" "Texto do post..." nome-do-arquivo
// Gera marketing-posts/<nome>.png (1080x1080) a partir de modelo.html.
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const [tag, texto, nome = "post"] = process.argv.slice(2);
if (!tag || !texto) throw new Error('uso: node post.mjs "TAG" "texto" [nome]');
const dir = dirname(fileURLToPath(import.meta.url));
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const tmp = join(dir, `_${nome}.html`);
writeFileSync(
  tmp,
  readFileSync(join(dir, "modelo.html"), "utf8")
    .replace("{{TAG}}", () => esc(tag))
    .replace("{{TEXTO}}", () => esc(texto)),
);
const chrome = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const out = join(dir, `${nome}.png`);
try {
  execFileSync(
    chrome,
    ["--headless", "--disable-gpu", "--hide-scrollbars", "--window-size=1080,1080",
      "--virtual-time-budget=4000", `--screenshot=${out}`, pathToFileURL(tmp).href],
    { stdio: "ignore" },
  );
} finally {
  unlinkSync(tmp);
}
console.log(out);
