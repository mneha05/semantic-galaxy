# Changelog

All notable changes to Semantic Galaxy are documented here.

## [1.0.0]
### Added
- On-device sentence-transformer embeddings (`Xenova/all-MiniLM-L6-v2`) via transformers.js.
- Hand-written PCA (power iteration) to project 384-D embeddings into 3-D.
- Hand-written k-means (k-means++ seeding) for cluster colors.
- Cosine-similarity semantic search with live query embedding.
- Three.js galaxy renderer: additive-glow star shader, raycast hover, query beams, camera fly-to.
- Deterministic hash-embedding fallback so the demo works offline.
- GitHub Actions workflow that auto-deploys to GitHub Pages.

### Design
- Cosmic "aurora" visual identity — teal → violet → nebula-pink on deep space black.
- Animated hero, pipeline, and demo diagrams.
