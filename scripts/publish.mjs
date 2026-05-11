#!/usr/bin/env node
// Publishes wiki/ to docs/ as a static HTML site styled per DESIGN.md (VoiceBox).
// Wipes docs/ on every run and regenerates from scratch.

import { readFileSync, writeFileSync, rmSync, mkdirSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative, basename, extname, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WIKI = join(ROOT, "wiki");
const DOCS = join(ROOT, "docs");
const ASSETS = join(DOCS, "assets");
const DESIGN_PATH = join(ROOT, "DESIGN.md");

// ---------------------------------------------------------------- design tokens
// Parsed from DESIGN.md at build time so the stylesheet stays in sync.
function parseDesignTokens(md) {
  const t = {};
  const grab = (label) => {
    const re = new RegExp(`\\|\\s*${label}\\s*\\|\\s*\`([^\`]+)\``, "i");
    const m = md.match(re);
    return m ? m[1] : null;
  };
  t.primary = grab("Primary") || "#0A0A0A";
  t.secondary = grab("Secondary") || "#EF4444";
  t.tertiary = grab("Tertiary") || "#FAFAFA";
  t.background = grab("Background") || "#FAFAFA";
  t.surface = grab("Surface") || "#F5F5F5";
  t.surfaceRaised = grab("Surface Raised") || "#E5E5E5";
  t.textPrimary = grab("Text Primary") || "#0A0A0A";
  t.textSecondary = grab("Text Secondary") || "#525252";
  t.textTertiary = grab("Text Tertiary") || "#A3A3A3";
  t.borderSubtle = grab("Border Subtle") || "#E5E5E5";
  t.borderMedium = grab("Border Medium") || "#D4D4D4";
  t.borderStrong = grab("Border Strong") || "#0A0A0A";
  return t;
}

function buildCss(t) {
  return `/* Generated from DESIGN.md — VoiceBox. Do not edit by hand; rerun /publish. */
:root {
  --primary: ${t.primary};
  --secondary: ${t.secondary};
  --tertiary: ${t.tertiary};
  --bg: ${t.background};
  --surface: ${t.surface};
  --surface-raised: ${t.surfaceRaised};
  --text: ${t.textPrimary};
  --text-2: ${t.textSecondary};
  --text-3: ${t.textTertiary};
  --border-subtle: ${t.borderSubtle};
  --border-medium: ${t.borderMedium};
  --border-strong: ${t.borderStrong};
  --display: "Archivo Black", Impact, "Arial Black", sans-serif;
  --body: "Work Sans", -apple-system, "Segoe UI", Helvetica, sans-serif;
  --mono: "Space Mono", "Courier New", Consolas, monospace;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: var(--body); font-size: 16px; line-height: 1.7; }
a { color: var(--text); text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px; }
a:hover { color: var(--secondary); }

/* masthead */
.masthead { border-bottom: 2px solid var(--border-strong); background: var(--bg); position: sticky; top: 0; z-index: 10; }
.masthead-inner { max-width: 1200px; margin: 0 auto; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.brand { font-family: var(--display); font-size: 22px; letter-spacing: -0.01em; text-transform: uppercase; text-decoration: none; color: var(--text); }
.brand .accent { color: var(--secondary); }
.masthead nav a { font-family: var(--body); font-weight: 700; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; margin-left: 24px; }
.masthead nav a:hover { color: var(--secondary); }
.menu-toggle { display: none; background: var(--primary); color: var(--tertiary); border: 2px solid var(--primary); padding: 8px 14px; font-family: var(--body); font-weight: 700; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; border-radius: 0; }
.menu-toggle:hover { background: var(--secondary); border-color: var(--secondary); }

/* layout */
.shell { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 280px 1fr; gap: 48px; padding: 48px 24px 96px; }
.sidebar { border-right: 2px solid var(--border-subtle); padding-right: 24px; position: sticky; top: 80px; align-self: start; max-height: calc(100vh - 100px); overflow-y: auto; }
.sidebar h2 { font-family: var(--body); font-weight: 700; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-2); margin: 24px 0 8px; }
.sidebar h2:first-child { margin-top: 0; }
.sidebar ul { list-style: none; margin: 0; padding: 0; }
.sidebar li { padding: 6px 0; border-bottom: 1px solid var(--border-subtle); }
.sidebar li:last-child { border-bottom: none; }
.sidebar a { display: block; font-size: 14px; text-decoration: none; padding: 4px 0; }
.sidebar a:hover { color: var(--secondary); }
.sidebar a.active { border-bottom: 3px solid var(--secondary); padding-bottom: 2px; }

/* article */
article { min-width: 0; }
.overline { font-family: var(--body); font-weight: 700; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-2); margin-bottom: 16px; }
article h1 { font-family: var(--display); font-weight: 400; font-size: 56px; line-height: 1.05; letter-spacing: -0.03em; margin: 0 0 24px; }
article h2 { font-family: var(--display); font-weight: 400; font-size: 32px; line-height: 1.1; letter-spacing: -0.02em; margin: 48px 0 16px; padding-bottom: 8px; border-bottom: 4px solid var(--secondary); display: inline-block; }
article h3 { font-family: var(--display); font-weight: 400; font-size: 22px; line-height: 1.2; letter-spacing: -0.01em; margin: 32px 0 12px; }
article h4 { font-family: var(--body); font-weight: 700; font-size: 14px; letter-spacing: 0.06em; text-transform: uppercase; margin: 24px 0 8px; }
article p { font-size: 16px; line-height: 1.7; margin: 0 0 16px; }
article p:first-of-type { font-size: 20px; line-height: 1.65; }
article ul, article ol { margin: 0 0 16px; padding-left: 24px; }
article li { margin: 6px 0; }
article strong { font-weight: 700; }
article em { font-style: italic; }
article code { font-family: var(--mono); font-size: 14px; background: var(--surface); padding: 2px 6px; border: 1px solid var(--border-subtle); }
article pre { font-family: var(--mono); font-size: 14px; background: var(--surface); border: 2px solid var(--border-medium); padding: 16px; overflow-x: auto; }
article pre code { background: transparent; border: none; padding: 0; }
article blockquote { border-left: 4px solid var(--secondary); padding: 8px 0 8px 24px; margin: 24px 0; font-size: 20px; line-height: 1.65; font-style: italic; color: var(--text); background: var(--surface); }
article hr { border: none; border-top: 2px solid var(--border-strong); margin: 48px 0; }
article table { border-collapse: collapse; width: 100%; margin: 24px 0; font-size: 14px; }
article table th, article table td { border: 2px solid var(--border-medium); padding: 10px 14px; text-align: left; vertical-align: top; }
article table th { background: var(--primary); color: var(--tertiary); font-family: var(--body); font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 0.06em; }
article table tr:nth-child(even) td { background: var(--surface); }

/* citations — text matching "(Source: …)" gets a subtle treatment via class hook */
article .cite { color: var(--text-2); font-size: 14px; }

/* index categories */
.cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin: 32px 0; }
.cat-card { border: 2px solid var(--border-subtle); border-top: 4px solid var(--secondary); padding: 24px; background: var(--bg); }
.cat-card:hover { border-color: var(--border-strong); border-top-color: var(--secondary); }
.cat-card h3 { font-family: var(--display); font-size: 20px; margin: 0 0 12px; }
.cat-card ul { list-style: none; margin: 0; padding: 0; }
.cat-card li { padding: 6px 0; border-bottom: 1px solid var(--border-subtle); }
.cat-card li:last-child { border-bottom: none; }
.cat-card a { font-size: 14px; text-decoration: none; }
.cat-card a:hover { color: var(--secondary); }

/* footer */
footer { border-top: 2px solid var(--border-strong); padding: 32px 24px; max-width: 1200px; margin: 0 auto; font-size: 12px; color: var(--text-2); display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
footer .built { font-family: var(--body); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }

/* responsive */
@media (max-width: 880px) {
  .shell { grid-template-columns: 1fr; gap: 24px; padding: 24px; }
  .sidebar { position: static; max-height: none; border-right: none; border-top: 2px solid var(--border-strong); padding: 24px 0 0; display: none; }
  .sidebar.open { display: block; }
  .menu-toggle { display: inline-block; }
  article h1 { font-size: 38px; }
  article h2 { font-size: 26px; }
}
`;
}

// ----------------------------------------------------------- file system utils
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function ensureDir(p) { mkdirSync(p, { recursive: true }); }

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ----------------------------------------------------------------- sidebar nav
// Parse wiki/index.md into { category: [{title, href}] } so every page shares nav.
function parseIndexNav(indexMd) {
  const cats = [];
  let current = null;
  for (const line of indexMd.split(/\r?\n/)) {
    const cat = line.match(/^##\s+(.+?)\s*$/);
    if (cat) {
      current = { name: cat[1].trim(), items: [] };
      cats.push(current);
      continue;
    }
    const item = line.match(/^[-*]\s+\[([^\]]+)\]\(([^)]+\.md)\)/);
    if (item && current) {
      current.items.push({ title: item[1].trim(), href: item[2].trim() });
    }
  }
  return cats.filter(c => c.items.length > 0);
}

function navHtml(cats, currentCanonicalHref, assetPrefix) {
  const parts = [];
  for (const c of cats) {
    parts.push(`<h2>${esc(c.name)}</h2><ul>`);
    for (const it of c.items) {
      const canonical = it.href.replace(/\.md$/, ".html");
      const href = assetPrefix + canonical;
      const active = canonical === currentCanonicalHref ? ' class="active"' : "";
      parts.push(`<li><a href="${esc(href)}"${active}>${esc(it.title)}</a></li>`);
    }
    parts.push(`</ul>`);
  }
  return parts.join("\n");
}

// ----------------------------------------------------------------- page render
marked.setOptions({ gfm: true, breaks: false });

// Rewrite .md links to .html in the rendered HTML.
function rewriteMdLinks(html) {
  return html.replace(/href="([^"]+?)\.md(#[^"]*)?"/g, (_m, base, hash) => `href="${base}.html${hash || ""}"`);
}

// Wrap "(Source: …)" spans so they can be styled subtly.
function decorateCitations(html) {
  return html.replace(/\(Source:\s*([^)]+)\)/g, '<span class="cite">(Source: $1)</span>');
}

function pageLayout({ title, overline, bodyHtml, navMarkup, assetPrefix }) {
  const cssHref = `${assetPrefix}assets/site.css`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(title)} — Summit Ridge HOA</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Work+Sans:wght@400;500;700&family=Space+Mono&display=swap">
<link rel="stylesheet" href="${cssHref}" />
</head>
<body>
<header class="masthead">
  <div class="masthead-inner">
    <a class="brand" href="${assetPrefix}index.html">SUMMIT<span class="accent">·</span>RIDGE</a>
    <nav>
      <a href="${assetPrefix}index.html">Index</a>
      <button class="menu-toggle" type="button" aria-controls="sidebar" aria-expanded="false">Menu</button>
    </nav>
  </div>
</header>
<div class="shell">
  <aside class="sidebar" id="sidebar">
    ${navMarkup}
  </aside>
  <article>
    ${overline ? `<div class="overline">${esc(overline)}</div>` : ""}
    ${bodyHtml}
  </article>
</div>
<footer>
  <span>Summit Ridge Townhomes HOA — Lake Oswego, OR</span>
  <span class="built">Generated from wiki/ via /publish</span>
</footer>
<script>
  (function(){
    var btn = document.querySelector(".menu-toggle");
    var side = document.getElementById("sidebar");
    if (!btn || !side) return;
    btn.addEventListener("click", function(){
      var open = side.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  })();
</script>
</body>
</html>
`;
}

function categoryForPage(cats, slug) {
  for (const c of cats) {
    for (const it of c.items) {
      const itSlug = it.href.replace(/\.md$/, "").split("/").pop();
      if (itSlug === slug) return c.name;
    }
  }
  return null;
}

function renderIndexBody(indexMd, cats) {
  // Use the first paragraph(s) before the first ## as the lede.
  const firstH2 = indexMd.search(/^##\s/m);
  const head = firstH2 === -1 ? indexMd : indexMd.slice(0, firstH2);
  // Drop the boilerplate "derived from authoritative source documents" paragraph.
  const trimmedHead = head
    .split(/\r?\n\r?\n/)
    .filter(p => !/derived from the authoritative source documents/i.test(p))
    .join("\n\n");
  const headHtml = decorateCitations(rewriteMdLinks(marked.parse(trimmedHead)));
  const cards = cats.map(c => {
    const items = c.items.map(it => {
      const href = it.href.replace(/\.md$/, ".html");
      return `<li><a href="${esc(href)}">${esc(it.title)}</a></li>`;
    }).join("");
    return `<div class="cat-card"><h3>${esc(c.name)}</h3><ul>${items}</ul></div>`;
  }).join("");
  return `${headHtml}<div class="cat-grid">${cards}</div>`;
}

// ------------------------------------------------------------------------ main
function main() {
  if (!existsSync(WIKI)) {
    console.error("wiki/ not found");
    process.exit(1);
  }
  if (!existsSync(DESIGN_PATH)) {
    console.error("DESIGN.md not found");
    process.exit(1);
  }

  // 1. Wipe docs/ completely.
  if (existsSync(DOCS)) rmSync(DOCS, { recursive: true, force: true });
  ensureDir(DOCS);
  ensureDir(ASSETS);

  // 2. Write CSS from DESIGN.md tokens.
  const design = readFileSync(DESIGN_PATH, "utf8");
  const tokens = parseDesignTokens(design);
  writeFileSync(join(ASSETS, "site.css"), buildCss(tokens));

  // 3. Parse nav from wiki/index.md.
  const indexMdPath = join(WIKI, "index.md");
  const indexMd = existsSync(indexMdPath) ? readFileSync(indexMdPath, "utf8") : "";
  const cats = parseIndexNav(indexMd);

  // 4. Walk every .md file under wiki/.
  const allMd = walk(WIKI).filter(p => {
    if (!p.endsWith(".md")) return false;
    if (p.includes(".manifest")) return false;
    const rel = relative(WIKI, p).split(/[\\/]/).join("/");
    if (rel === "log.md") return false; // log is internal — not published
    return true;
  });
  let count = 0;
  for (const srcPath of allMd) {
    const rel = relative(WIKI, srcPath).split(/[\\/]/).join("/"); // posix-style
    const outRel = rel.replace(/\.md$/, ".html");
    const outPath = join(DOCS, outRel);
    ensureDir(dirname(outPath));

    const md = readFileSync(srcPath, "utf8");
    const isIndex = rel === "index.md";
    const slug = basename(rel, ".md");

    // Asset prefix: number of "../" needed to climb back to docs/ root.
    const depth = rel.split("/").length - 1;
    const assetPrefix = depth === 0 ? "" : "../".repeat(depth);

    const currentCanonicalHref = rel.replace(/\.md$/, ".html");
    const navMarkup = navHtml(cats, currentCanonicalHref, assetPrefix);

    let bodyHtml;
    let overline = null;
    if (isIndex) {
      bodyHtml = renderIndexBody(indexMd, cats);
    } else {
      bodyHtml = decorateCitations(rewriteMdLinks(marked.parse(md)));
      overline = categoryForPage(cats, slug);
    }

    // Title = first H1, falling back to slug.
    const h1 = md.match(/^#\s+(.+?)\s*$/m);
    const title = h1 ? h1[1].trim() : slug;

    const html = pageLayout({ title, overline, bodyHtml, navMarkup, assetPrefix });
    writeFileSync(outPath, html);
    count++;
  }

  console.log(`docs/ rebuilt: ${count} page(s).`);
}

main();
