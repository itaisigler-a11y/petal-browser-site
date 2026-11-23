// Writes a static, indexable page per public pack (packs/<id>.html) plus sitemap.xml, so search engines and
// link previews see real content. Each page still loads the live preview from the server when it can.
// Usage: SWEB_API=https://sync.example node scripts/prerender.mjs
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';

const API = (process.env.SWEB_API || '').replace(/\/+$/, '');
const SITE = 'https://itaisigler-a11y.github.io/petal-browser-site';
if (!API) {
  console.log('SWEB_API not set; nothing to prerender.');
  process.exit(0);
}
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };

const seen = new Map();
for (const sort of ['popular', 'new']) {
  const r = await fetch(`${API}/v1/packs?sort=${sort}&limit=100`);
  if (!r.ok) throw new Error(`packs ${r.status}`);
  for (const p of (await r.json()).packs) seen.set(p.id, p);
}

export function page(p) {
  const m = p.meta || {};
  const title = m.title || p.name || 'A Sweb pack';
  const desc = m.description || `${p.siteCount} sites, ready in one tap: ${p.preview.slice(0, 5).map((s) => s.title || host(s.url)).join(', ')}.`;
  const url = `${SITE}/packs/${p.id}.html`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · Sweb pack</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/icon.png">
<link rel="stylesheet" href="../sweb.css"></head>
<body><main><nav><a href="../index.html">Sweb</a><a href="../packs.html">Packs</a><a href="../privacy.html">Privacy</a></nav>
<h1>${esc(title)}</h1>${m.description ? `<p>${esc(m.description)}</p>` : ''}<p class="muted">${p.siteCount} sites · ${p.followers} following</p>
<div class="card"><div class="tiles">${p.preview.map((s) => `<div class="tile">${esc(s.title || host(s.url))}</div>`).join('')}</div></div>
<a class="btn" href="../p.html?id=${encodeURIComponent(p.id)}">See every site and add to Sweb</a></main></body></html>
`;
}

mkdirSync('packs', { recursive: true });
const kept = [];
// Ranked lists are not a full inventory: keep a page that dropped out of them unless the pack itself is gone or unlisted.
for (const f of readdirSync('packs')) {
  const id = f.slice(0, -5);
  if (!f.endsWith('.html') || seen.has(id)) continue;
  const r = await fetch(`${API}/v1/setups/${encodeURIComponent(id)}`);
  const s = r.ok ? await r.json() : null;
  if (r.status === 404 || r.status === 410 || (s && (s.kind !== 'pack' || !s.listed))) rmSync(`packs/${f}`);
  else kept.push(id);
}
for (const p of seen.values()) writeFileSync(`packs/${p.id}.html`, page(p));
const urls = ['', 'packs.html', 'folders.html', 'privacy.html', 'support.html', ...[...seen.keys(), ...kept].map((id) => `packs/${id}.html`)];
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Prerendered ${seen.size} packs.`);
