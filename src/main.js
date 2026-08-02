import { CORPUS } from "./data.js";
import { initEmbedder, embed, embedAll, getMode } from "./embed.js";
import { pca, kmeans, project, cosine } from "./ml.js";
import { Galaxy } from "./galaxy.js";

const $ = (s) => document.querySelector(s);
const stage = $("#stage"), bar = $("#bar"), pct = $("#pct");
const canvas = $("#galaxy"), tooltip = $("#tooltip");
const input = $("#q"), resultsEl = $("#results"), badge = $("#modeBadge");
const statN = $("#statN"), statD = $("#statD"), statK = $("#statK");

let galaxy, vectors, components, meta;
const K_CLUSTERS = 9, TOP_K = 6;

function setStage(p, label) {
  bar.style.width = Math.round(p * 100) + "%";
  pct.textContent = label;
}

async function boot() {
  meta = CORPUS;
  statN.textContent = CORPUS.length;
  statD.textContent = "384";
  statK.textContent = K_CLUSTERS;

  setStage(0.05, "loading on-device transformer…");
  const mode = await initEmbedder((p, msg) => setStage(0.05 + p * 0.45, msg));

  setStage(0.5, "embedding corpus on-device…");
  vectors = await embedAll(CORPUS.map(c => c.t), (p) => setStage(0.5 + p * 0.35, `embedding ${Math.round(p * CORPUS.length)}/${CORPUS.length}`));

  setStage(0.9, "reducing 384-D → 3-D (PCA)…");
  const { coords, components: comps } = pca(vectors, 3);
  components = comps;

  setStage(0.96, "clustering (k-means)…");
  const { assign } = kmeans(vectors, K_CLUSTERS);

  galaxy = new Galaxy(canvas, tooltip);
  galaxy.setData(coords, assign, meta);

  badge.textContent = mode === "transformer" ? "⚡ MiniLM · on-device" : "⚙ hash-embed fallback";
  badge.classList.add(mode === "transformer" ? "ok" : "warn");

  setStage(1, "ready");
  setTimeout(() => { stage.classList.add("hidden"); input.focus(); }, 500);
}

async function runQuery(text) {
  if (!text.trim() || !galaxy) return;
  resultsEl.innerHTML = `<div class="thinking">embedding query on-device…</div>`;
  const qv = await embed(text);
  const scored = vectors
    .map((v, idx) => ({ idx, score: cosine(qv, v) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K);

  const anchor3 = project(qv, components);
  galaxy.showResults(scored, galaxy.worldFromCoord(anchor3));

  resultsEl.innerHTML = scored.map((r, i) => `
    <div class="hit" style="animation-delay:${i * 40}ms">
      <div class="hit-score">${(r.score * 100).toFixed(0)}<span>%</span></div>
      <div class="hit-body"><div class="hit-dom">${meta[r.idx].d}</div>${meta[r.idx].t}</div>
    </div>`).join("");
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runQuery(input.value);
  if (e.key === "Escape") { input.value = ""; resultsEl.innerHTML = ""; galaxy?.clearResults(); }
});
$("#go").addEventListener("click", () => runQuery(input.value));
$("#clear").addEventListener("click", () => { input.value = ""; resultsEl.innerHTML = ""; galaxy?.clearResults(); });
document.querySelectorAll(".chip").forEach(c =>
  c.addEventListener("click", () => { input.value = c.textContent; runQuery(c.textContent); }));

boot().catch(err => { setStage(1, "error — see console"); console.error(err); });
