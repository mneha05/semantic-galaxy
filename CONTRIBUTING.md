# Contributing

Thanks for taking a look! This is a personal project, but ideas and fixes are welcome.

## Running it
No build step. Serve the folder over HTTP (not `file://`):
```bash
npx serve .
```

## Ideas that would be fun
- Swap in a different embedding model (e.g. a larger MiniLM or a multilingual one).
- Replace PCA with UMAP for the 3-D layout and compare the shapes.
- Let users paste their own text corpus at runtime.
- Add a 2-D "map view" toggle alongside the 3-D galaxy.

## Style
Vanilla ES modules, 2-space indent, no framework. Keep it dependency-light and keep everything running **in the browser** — no backend.
