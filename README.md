<h1 align="center">◐ Semantic Galaxy</h1>
<p align="center"><b>A neural search engine you can fly through.</b><br/>
A transformer embedding model runs <i>entirely in your browser</i> — no server, no API key —
turning a corpus into a navigable 3-D galaxy you search by <i>meaning</i>, not keywords.</p>

<p align="center">
  <a href="#-live-demo"><b>Live Demo</b></a> ·
  <a href="#-how-it-works">How it works</a> ·
  <a href="#-run-locally">Run locally</a> ·
  <a href="#-why-this-is-hard">Why it's hard</a>
</p>

---

## ✨ What it does
Type a question in plain English. The app embeds it **on-device** with a real
sentence-transformer, ranks every document by **cosine similarity**, fires beams
to the nearest concepts, and flies the camera to that region of meaning-space —
while ~100 documents float as glowing stars, positioned by **PCA** and colored by
**k-means** clusters that *emerge from the embeddings alone* (the categories are
never given to the layout).

> Search **“how do machines understand language?”** and watch it land squarely in
> the NLP/transformer cluster — not because of shared keywords, but because the
> model understands the *meaning*.

## 🧠 How it works
```
text ──▶ MiniLM sentence-transformer ──▶ 384-D embedding      (transformers.js, on-device)
        (Xenova/all-MiniLM-L6-v2)            │
                                             ├─▶ PCA  (power iteration, from scratch) ──▶ 3-D coords
                                             ├─▶ k-means (k-means++ seeding, from scratch) ──▶ clusters
                                             └─▶ cosine similarity vs. query ──▶ ranked results
                                                              │
                                             Three.js additive-blended point cloud ──▶ the galaxy
```

- **On-device inference.** The ~23 MB quantized transformer downloads once, is cached
  by the browser, then runs locally in WebAssembly/WebGPU. The live demo needs **no backend.**
- **Math from scratch.** PCA (via power iteration on the covariance) and k-means
  (with k-means++ seeding) are implemented by hand in [`src/ml.js`](src/ml.js) — no numpy, no sklearn.
- **Never breaks on stage.** If the model CDN is unreachable, it transparently falls back
  to a deterministic hashing embedding so the galaxy and search still work.

## 🚀 Live demo
Hosted on GitHub Pages: **`https://mneha05.github.io/semantic-galaxy/`**
*(enable Pages → “GitHub Actions” once; the included workflow deploys on every push.)*

## 💻 Run locally
No build step. Any static server works:
```bash
npx serve .          # then open the printed URL
# or:  python -m http.server 8000
```
> Open via `http://localhost`, **not** `file://` — ES modules and the model fetch need an origin.

## 🔬 Why this is hard
- Streaming a transformer into the browser and running inference at interactive speed.
- Implementing numerically stable PCA (deflation + power iteration) and k-means++ in plain JS.
- Rendering a hover-pickable, additively-blended point cloud with per-star glow shaders in Three.js.
- Keeping the query vector in the *same* PCA basis as the corpus so beams land correctly.

## 🗂 Structure
| File | Role |
|---|---|
| [`src/embed.js`](src/embed.js) | Loads transformers.js, embeds text, hash fallback |
| [`src/ml.js`](src/ml.js) | PCA + k-means + cosine, hand-rolled |
| [`src/galaxy.js`](src/galaxy.js) | Three.js scene, glow shader, beams, raycast hover |
| [`src/main.js`](src/main.js) | Orchestration + UI |
| [`src/data.js`](src/data.js) | The concept corpus |

## Stack
`transformers.js` · `Three.js` · vanilla ES modules · zero backend

<p align="center"><sub>Built by Neha Mahesh</sub></p>
