<!-- HERO -->
<p align="center">
  <img src="docs/hero.svg" alt="Semantic Galaxy — search a universe of ideas by meaning" width="100%"/>
</p>

<p align="center">
  <a href="https://mneha05.github.io/semantic-galaxy/"><img src="https://img.shields.io/badge/%E2%96%B6_LIVE_DEMO-open_in_browser-7cf6ff?style=for-the-badge&labelColor=05060f" alt="Live demo"/></a>
  <img src="https://img.shields.io/badge/backend-none_needed-b58bff?style=for-the-badge&labelColor=05060f" alt="No backend"/>
  <img src="https://img.shields.io/badge/API_keys-zero-7bffa6?style=for-the-badge&labelColor=05060f" alt="No API keys"/>
  <img src="https://img.shields.io/badge/runs-100%25_in_your_browser-ffd166?style=for-the-badge&labelColor=05060f" alt="Runs in browser"/>
</p>

<h1 align="center">Type a thought. Watch it find its place in the universe.</h1>

<p align="center">
<b>Semantic Galaxy turns a hundred ideas into a living 3-D galaxy you can fly through —<br/>
and when you ask a question in plain English, it lights up the exact region of meaning that answers it.</b>
</p>

<p align="center"><img src="docs/demo.svg" alt="A query beams into the galaxy and the nearest concepts light up, ranked by similarity" width="88%"/></p>

---

## 👀 What you're actually looking at

Most search bars match **letters**. This one matches **meaning**.

Search **“how do machines understand language?”** — there isn't a single shared keyword with the answer, yet the galaxy instantly flies you to the cluster about *self-attention, transformers, and word embeddings*. Search **“growing money over time”** and it lands on *compound interest*. It understands what you **mean**, then shows you — visually, in three dimensions — *where that meaning lives.*

And here's the part that makes people lean in:

> ### 🤯 There is no server. There is no API key. Nothing is sent anywhere.
> A real neural network — a **sentence-transformer** — is downloaded into your browser **once** and then runs **entirely on your own machine**, offline. The "AI" isn't in some data center. It's *right there in the tab.*

That's why the live demo can't rate-limit, can't run up a bill, can't leak your data, and can't fail because a backend went down mid-interview. You open a link and it just… works.

---

## ⭐ Why this makes people stop scrolling

| | |
|---|---|
| 🧠 **It reads meaning, not words** | Ask anything in natural language; it ranks every idea by *semantic* similarity, so paraphrases and synonyms just work. |
| 🌌 **The map isn't hand-drawn — it's discovered** | Nobody told the app which ideas are "similar." It *figured out* the clusters from the embeddings alone. The galaxy's shape **is** what the model learned. |
| ⚡ **A transformer running live in a browser tab** | The same class of model behind modern AI, streamed to the client and executed on-device in real time. |
| 🎛️ **The hard math, written from scratch** | PCA (power-iteration) and k-means (k-means++) implemented by hand — no NumPy, no scikit-learn — then visualized in a custom WebGL shader. |
| 🎬 **Bulletproof for a live demo** | If the model can't download, it *silently* falls back to a built-in embedder so the galaxy and search still work. It never breaks on stage. |

---

## ▶️ Try it in 10 seconds

**Live:** **[mneha05.github.io/semantic-galaxy](https://mneha05.github.io/semantic-galaxy/)** — just open it.

**Or locally** (no build step, no install):
```bash
git clone https://github.com/mneha05/semantic-galaxy.git
cd semantic-galaxy
npx serve .        # open the printed http://localhost URL
```
> Then type a question, or tap a suggestion chip, and watch the galaxy respond.
> Drag to orbit · scroll to zoom · hover any star to read it.

---

## 🔬 How it works (the honest, technical version)

```
your text ─▶  MiniLM sentence-transformer  ─▶  a 384-number "meaning vector"
              (runs on-device, in-browser)                 │
                                                           ├─▶  PCA  ────────▶  3-D position in the galaxy
                                                           ├─▶  k-means ─────▶  which glowing cluster it joins
                                                           └─▶  cosine sim ──▶  ranked answer to your query
                                                                     │
                                             Three.js additive-glow point cloud  ─▶  the universe you fly through
```

1. **Embed.** Every document (and your live query) is passed through `Xenova/all-MiniLM-L6-v2` via [transformers.js](https://github.com/huggingface/transformers.js), producing a 384-dimensional vector where *distance = difference in meaning*.
2. **Reduce.** 384 dimensions can't be drawn, so custom **PCA** (deflation + power iteration on the covariance) projects them down to the 3 axes of greatest variance — the galaxy's X, Y, Z.
3. **Cluster.** **k-means** (with k-means++ seeding) groups the vectors; each cluster gets its own color. *These groupings emerge from the model — they are never given to it.*
4. **Search.** Your query is embedded live and scored against every star by **cosine similarity**; the top matches flare up, beams connect them, and the camera flies in.
5. **Render.** A custom Three.js shader draws each idea as an additively-blended glowing star with real-time hover picking.

Every step runs client-side. The only network call is the **one-time** model download, which the browser then caches.

## 🧩 What's under the hood

| File | What it does |
|---|---|
| [`src/embed.js`](src/embed.js) | Loads the transformer, embeds text on-device, hash-embed fallback |
| [`src/ml.js`](src/ml.js) | **PCA + k-means + cosine similarity — hand-written**, zero ML libraries |
| [`src/galaxy.js`](src/galaxy.js) | Three.js scene, glow shader, query beams, raycast hover |
| [`src/main.js`](src/main.js) | Ties the pipeline to the UI |
| [`src/data.js`](src/data.js) | The concept corpus (swap in your own docs!) |

## 🛠️ Built with
`transformers.js` (on-device inference) · `Three.js` (WebGL) · hand-rolled linear algebra · vanilla ES modules · **no backend, no framework, no build step**

## 💡 Make it yours
Drop your own text into [`src/data.js`](src/data.js) — support tickets, research papers, product reviews, song lyrics — and reload. It re-embeds, re-clusters, and re-renders your *own* galaxy. It's a general-purpose semantic search engine wearing a beautiful costume.

<p align="center"><br/><sub>Designed & built by <b>Neha Mahesh</b> · MIT licensed · ⭐ it if the demo made you smile</sub></p>
