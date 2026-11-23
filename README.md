# petal-browser-site
Public support and privacy policy pages for Sweb (GitHub Pages)

## Living setups pages

- `packs.html`: public pack library (search, popular/new), loaded from the sync server.
- `p.html?id=<id>`: live pack preview; "Add to Sweb" opens `petal://share?i=<id>` (install + Follow).
- `m.html#<id>.<key>`: Move my Sweb. The decryption key stays in the fragment. `m.html#d=` is the offline fallback (also in the fragment).
- `h.html#<code>`: helper invite for a family Sweb.
- `s.html?d=`: the static share link; still works when the server is unreachable.
- `scripts/prerender.mjs` + `.github/workflows/prerender.yml`: writes `packs/<id>.html` and `sitemap.xml` every 6 hours against the live server (`https://sweb-sync.sweb-app.workers.dev`; a `SWEB_API` repo variable overrides it). `sweb.js` points at the same URL.
