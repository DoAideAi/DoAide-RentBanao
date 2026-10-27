/**
 * SEO Prerender Build Step
 *
 * After `vite build`, this script reads dist/index.html and produces
 * per-route HTML files with unique title, canonical, description,
 * h1, JSON-LD, and social-preview meta tags.
 * React hydrates on load — the h1 is hidden with a data attribute
 * and removed by the client once the app mounts.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, 'dist')
const SITE = 'https://rent.doaide.com'

// Import route metadata
const { routes } = await import('./routeMeta.js')

const template = readFileSync(join(DIST, 'index.html'), 'utf-8')

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHtml(route) {
  let html = template
  const canonical = `${SITE}${route.path === '/' ? '' : route.path}`

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(route.title)}</title>`
  )

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(route.description)}" />`
  )

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonical}" />`
  )

  // Replace og tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`
  )
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`
  )
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${canonical}" />`
  )
  html = html.replace(
    /<meta property="og:type" content="[^"]*" \/>/,
    `<meta property="og:type" content="${route.ogType || 'website'}" />`
  )

  // Replace twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`
  )
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`
  )

  // Replace JSON-LD
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n    ${JSON.stringify(route.jsonLd)}\n    </script>`
  )

  // Insert prerendered h1 just after <div id="root">
  // The h1 is visible to crawlers but styled to not cause layout shift.
  // React removes it on hydration via data-prerender attribute.
  const prerenderH1 = `<div id="root"><h1 data-prerender="true" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden">${escapeHtml(route.h1)}</h1>`
  html = html.replace('<div id="root"></div>', `${prerenderH1}</div>`)

  return html
}

let count = 0
for (const route of routes) {
  const html = buildHtml(route)

  if (route.path === '/') {
    writeFileSync(join(DIST, 'index.html'), html)
  } else {
    const dir = join(DIST, route.path)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), html)
  }
  count++
}

console.log(`Prerendered ${count} routes with unique SEO tags.`)
