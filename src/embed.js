// On-device sentence embeddings via transformers.js (Xenova/all-MiniLM-L6-v2).
// The model (~23 MB quantized) is downloaded once and cached by the browser,
// then runs entirely locally in a WebAssembly/WebGPU backend — no server, no
// API key. If the CDN/model is unreachable, we fall back to a deterministic
// hashing embedding so the galaxy and search still work in a live demo.

import { norm } from "./ml.js";

let pipe = null;
let mode = "loading"; // "transformer" | "fallback"

export function getMode() { return mode; }

export async function initEmbedder(onProgress) {
  try {
    const { pipeline, env } = await import(
      "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2/dist/transformers.min.js"
    );
    env.allowLocalModels = false;
    pipe = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
      progress_callback: (p) => {
        if (p && p.status === "progress" && p.total) {
          onProgress?.(p.progress / 100, `downloading ${p.file?.split("/").pop() || "model"}`);
        } else if (p && p.status === "ready") {
          onProgress?.(1, "model ready");
        }
      },
    });
    mode = "transformer";
    return "transformer";
  } catch (err) {
    console.warn("Transformer load failed, using hash fallback:", err);
    mode = "fallback";
    return "fallback";
  }
}

export async function embed(text) {
  if (mode === "transformer" && pipe) {
    const out = await pipe(text, { pooling: "mean", normalize: true });
    return Float32Array.from(out.data);
  }
  return hashEmbed(text);
}

export async function embedAll(texts, onEach) {
  const vecs = [];
  for (let i = 0; i < texts.length; i++) {
    vecs.push(await embed(texts[i]));
    onEach?.((i + 1) / texts.length);
  }
  return vecs;
}

// ---- deterministic fallback: hashed word-trigram bag projected to 384 dims ----
const DIM = 384;
function hashEmbed(text) {
  const v = new Float32Array(DIM);
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const grams = [];
  for (const w of words) {
    grams.push(w);
    const p = "#" + w + "#";
    for (let i = 0; i < p.length - 2; i++) grams.push(p.slice(i, i + 3));
  }
  for (const g of grams) {
    let h = 2166136261;
    for (let i = 0; i < g.length; i++) { h ^= g.charCodeAt(i); h = Math.imul(h, 16777619); }
    const idx = (h >>> 0) % DIM;
    v[idx] += 1;
    v[(idx * 7 + 13) % DIM] += 0.5;
  }
  const n = norm(v);
  for (let i = 0; i < DIM; i++) v[i] /= n;
  return v;
}
