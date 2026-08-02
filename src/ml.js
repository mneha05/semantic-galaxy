// Hand-rolled ML: PCA (via power iteration on the covariance matrix) and
// k-means. No numpy, no sklearn — this is the "we actually understand the
// math" part of the demo. Everything runs on the 384-dim MiniLM embeddings.

// ---------- vector helpers ----------
export function dot(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
export function norm(a) { return Math.sqrt(dot(a, a)) || 1e-9; }
export function cosine(a, b) { return dot(a, b) / (norm(a) * norm(b)); }

function subMean(rows) {
  const n = rows.length, d = rows[0].length;
  const mean = new Float32Array(d);
  for (const r of rows) for (let j = 0; j < d; j++) mean[j] += r[j];
  for (let j = 0; j < d; j++) mean[j] /= n;
  return rows.map(r => { const o = new Float32Array(d); for (let j = 0; j < d; j++) o[j] = r[j] - mean[j]; return o; });
}

// Top-k principal components via deflation + power iteration on X^T X.
export function pca(rows, k = 3, iters = 120) {
  const X = subMean(rows);
  const n = X.length, d = X[0].length;
  const comps = [];
  // deflated copy we progressively strip components out of
  const R = X.map(r => Float32Array.from(r));

  const rng = mulberry32(1337);
  for (let c = 0; c < k; c++) {
    let v = new Float32Array(d);
    for (let j = 0; j < d; j++) v[j] = rng() - 0.5;
    normalizeInPlace(v);

    for (let it = 0; it < iters; it++) {
      // w = (R^T R) v  computed as R^T (R v) to stay O(n*d)
      const Rv = new Float32Array(n);
      for (let i = 0; i < n; i++) Rv[i] = dot(R[i], v);
      const w = new Float32Array(d);
      for (let i = 0; i < n; i++) { const ri = R[i], s = Rv[i]; for (let j = 0; j < d; j++) w[j] += ri[j] * s; }
      normalizeInPlace(w);
      v = w;
    }
    comps.push(v);
    // deflate: remove the projection onto v from every row
    for (let i = 0; i < n; i++) {
      const proj = dot(R[i], v);
      const ri = R[i];
      for (let j = 0; j < d; j++) ri[j] -= proj * v[j];
    }
  }

  // project centered data onto the components -> coordinates
  const coords = X.map(r => comps.map(v => dot(r, v)));
  return { coords, components: comps };
}

// Project a single new vector into an existing PCA basis (mean-centered enough
// for a normalized query — we skip re-centering since embeddings are unit-norm).
export function project(vec, components) { return components.map(v => dot(vec, v)); }

// ---------- k-means ----------
export function kmeans(rows, k = 8, iters = 40) {
  const n = rows.length, d = rows[0].length;
  const rng = mulberry32(42);
  // k-means++ seeding
  const centers = [rows[Math.floor(rng() * n)].slice()];
  while (centers.length < k) {
    const dists = rows.map(r => Math.min(...centers.map(c => sqdist(r, c))));
    const sum = dists.reduce((a, b) => a + b, 0) || 1;
    let x = rng() * sum, idx = 0;
    while (x > 0 && idx < n - 1) { x -= dists[idx]; idx++; }
    centers.push(rows[idx].slice());
  }

  const assign = new Int32Array(n);
  for (let it = 0; it < iters; it++) {
    let moved = false;
    for (let i = 0; i < n; i++) {
      let best = 0, bd = Infinity;
      for (let c = 0; c < k; c++) { const dd = sqdist(rows[i], centers[c]); if (dd < bd) { bd = dd; best = c; } }
      if (assign[i] !== best) { assign[i] = best; moved = true; }
    }
    const sums = Array.from({ length: k }, () => new Float64Array(d));
    const counts = new Int32Array(k);
    for (let i = 0; i < n; i++) { counts[assign[i]]++; const s = sums[assign[i]], r = rows[i]; for (let j = 0; j < d; j++) s[j] += r[j]; }
    for (let c = 0; c < k; c++) if (counts[c]) for (let j = 0; j < d; j++) centers[c][j] = sums[c][j] / counts[c];
    if (!moved && it > 0) break;
  }
  return { assign: Array.from(assign), centers };
}

function sqdist(a, b) { let s = 0; for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; s += d * d; } return s; }
function normalizeInPlace(v) { const n = norm(v); for (let i = 0; i < v.length; i++) v[i] /= n; }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
