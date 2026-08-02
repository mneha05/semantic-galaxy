// Three.js galaxy: every document is a glowing star, positioned by PCA(embeddings)
// and colored by its k-means cluster. Hover reads the raycaster; a query lights up
// beams to the nearest neighbors.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const CLUSTER_PALETTE = [
  0x7cf6ff, 0x5b9dff, 0xb58bff, 0xff8bd8, 0xffd166,
  0xff6b6b, 0x7bffa6, 0xc8b6ff, 0xffb454, 0x8affc1, 0xff9ecb, 0x9db4ff,
];

export class Galaxy {
  constructor(canvas, tooltipEl) {
    this.canvas = canvas;
    this.tooltip = tooltipEl;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05060f, 0.012);

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
    this.camera.position.set(0, 8, 46);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.35;

    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points.threshold = 0.9;
    this.mouse = new THREE.Vector2(-2, -2);

    this._addBackdrop();
    this._bind();
    this.resize();
    this._loop();
  }

  _addBackdrop() {
    // faint distant starfield for depth
    const N = 1400, g = new THREE.BufferGeometry(), pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 120 + Math.random() * 500;
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({ color: 0x8899cc, size: 1.1, sizeAttenuation: true, transparent: true, opacity: 0.5, depthWrite: false });
    this.scene.add(new THREE.Points(g, m));
  }

  // coords: [[x,y,z],...] normalized-ish; clusters: int[]; meta: [{t,d}]
  setData(coords, clusters, meta) {
    this.meta = meta;
    this.clusters = clusters;
    // scale coords to a pleasing spread
    const scale = 26 / (maxAbs(coords) || 1);
    this.sceneScale = scale;
    this.positions = coords.map(c => c.map(v => v * scale));

    const n = coords.length;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const siz = new Float32Array(n);
    const tmp = new THREE.Color();
    for (let i = 0; i < n; i++) {
      pos[i * 3] = this.positions[i][0];
      pos[i * 3 + 1] = this.positions[i][1];
      pos[i * 3 + 2] = this.positions[i][2];
      tmp.setHex(CLUSTER_PALETTE[clusters[i] % CLUSTER_PALETTE.length]);
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
      siz[i] = 2.2;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(siz, 1));
    this.baseColor = col.slice();
    this.baseSize = siz.slice();

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTex: { value: makeGlowTexture() }, uTime: { value: 0 } },
      vertexShader: `
        attribute float aSize; varying vec3 vCol;
        void main(){ vCol = color; vec4 mv = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = aSize * (300.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `
        uniform sampler2D uTex; varying vec3 vCol;
        void main(){ vec4 t = texture2D(uTex, gl_PointCoord); if(t.a<0.02) discard;
          gl_FragColor = vec4(vCol, 1.0) * t; }`,
      transparent: true, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    if (this.points) { this.points.geometry.dispose(); this.scene.remove(this.points); }
    this.points = new THREE.Points(geo, mat);
    this.scene.add(this.points);

    // beam container
    if (this.beams) this.scene.remove(this.beams);
    this.beamGeo = new THREE.BufferGeometry();
    this.beams = new THREE.LineSegments(this.beamGeo, new THREE.LineBasicMaterial({ color: 0x9fefff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.scene.add(this.beams);
  }

  // highlight query result: results = [{idx, score}], anchor = [x,y,z] of query
  showResults(results, anchor) {
    const n = this.meta.length;
    const col = this.baseColor.slice();
    const siz = this.baseSize.slice();
    const top = new Set(results.map(r => r.idx));
    for (let i = 0; i < n; i++) {
      if (!top.has(i)) { // dim non-matches
        col[i * 3] *= 0.28; col[i * 3 + 1] *= 0.28; col[i * 3 + 2] *= 0.28;
      } else {
        siz[i] = 5.5;
        col[i * 3] = Math.min(1, col[i * 3] * 1.6 + 0.3);
        col[i * 3 + 1] = Math.min(1, col[i * 3 + 1] * 1.6 + 0.3);
        col[i * 3 + 2] = Math.min(1, col[i * 3 + 2] * 1.6 + 0.3);
      }
    }
    this._applyColorSize(col, siz);

    // beams from the query anchor to each top result
    const pts = [];
    for (const r of results) {
      pts.push(anchor[0], anchor[1], anchor[2]);
      const p = this.positions[r.idx];
      pts.push(p[0], p[1], p[2]);
    }
    this.beamGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    this.beamGeo.attributes.position.needsUpdate = true;

    // fly camera toward centroid of results
    const c = [0, 0, 0];
    for (const r of results) { const p = this.positions[r.idx]; c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; }
    const k = results.length || 1;
    this._flyTo(c[0] / k, c[1] / k, c[2] / k);
  }

  // map a raw PCA coordinate into the galaxy's scaled world space
  worldFromCoord(c) { return c.map(v => v * this.sceneScale); }

  clearResults() {
    this._applyColorSize(this.baseColor.slice(), this.baseSize.slice());
    if (this.beamGeo) this.beamGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(0), 3));
  }

  _applyColorSize(col, siz) {
    this.points.geometry.setAttribute("color", new THREE.BufferAttribute(col, 3));
    this.points.geometry.setAttribute("aSize", new THREE.BufferAttribute(siz, 1));
  }

  _flyTo(x, y, z) {
    this._target = new THREE.Vector3(x, y, z);
    this.controls.autoRotate = false;
    clearTimeout(this._rotTimer);
    this._rotTimer = setTimeout(() => (this.controls.autoRotate = true), 6000);
  }

  _bind() {
    addEventListener("resize", () => this.resize());
    this.canvas.addEventListener("pointermove", (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      this.mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      this._mouseScreen = { x: e.clientX, y: e.clientY };
    });
    this.canvas.addEventListener("pointerleave", () => { this.mouse.set(-2, -2); this.tooltip.style.opacity = 0; });
  }

  resize() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }

  _hover() {
    if (!this.points) return;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObject(this.points);
    if (hits.length) {
      const i = hits[0].index, m = this.meta[i];
      this.tooltip.innerHTML = `<span class="tt-dom">${m.d}</span>${m.t}`;
      this.tooltip.style.opacity = 1;
      this.tooltip.style.left = (this._mouseScreen.x + 16) + "px";
      this.tooltip.style.top = (this._mouseScreen.y + 16) + "px";
    } else {
      this.tooltip.style.opacity = 0;
    }
  }

  _loop() {
    const tick = (t) => {
      this._raf = requestAnimationFrame(tick);
      if (this._target) {
        this.controls.target.lerp(this._target, 0.05);
        if (this.controls.target.distanceTo(this._target) < 0.05) this._target = null;
      }
      if (this.points) this.points.material.uniforms.uTime.value = t * 0.001;
      this.controls.update();
      this._hover();
      this.renderer.render(this.scene, this.camera);
    };
    this._raf = requestAnimationFrame(tick);
  }
}

function maxAbs(coords) {
  let m = 0;
  for (const c of coords) for (const v of c) m = Math.max(m, Math.abs(v));
  return m;
}

function makeGlowTexture() {
  const s = 128, cv = document.createElement("canvas"); cv.width = cv.height = s;
  const ctx = cv.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.85)");
  g.addColorStop(0.5, "rgba(255,255,255,0.28)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(cv); tex.needsUpdate = true; return tex;
}
