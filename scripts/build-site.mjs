import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, loadEnv } from 'vite';

const dist = resolve('dist');
const siteUrl = loadEnv('production', process.cwd(), 'VITE_').VITE_SITE_URL;
const demoOrigin = 'https://accumax-demo4-apfi.vercel.app';
const origin = new URL(siteUrl || demoOrigin).origin;
const server = mkdtempSync(resolve('.seo-build-'));

try {
  await build();
  await build({
    build: {
      ssr: 'src/prerender.tsx',
      ssrEmitAssets: true,
      outDir: server,
      copyPublicDir: false,
    },
  });

  const { renderPage, pageSeo, sitePaths } = await import(pathToFileURL(join(server, 'prerender.js')).href);
  const template = readFileSync(join(dist, 'index.html'), 'utf8');
  const sitemapEntries = [];

  for (const path of [...sitePaths, '/404']) {
    const { head, body } = renderPage(path);
    const isNotFound = path === '/404';
    const destination = join(dist, path === '/' ? 'index.html' : path.slice(1) + '.html');
    const html = template
      .replace(/<title>.*?<\/title>/, () => head + '\n<noscript><style>[data-scroll-reveal],.process-chart{opacity:1!important;transform:none!important}</style></noscript>')
      .replace('<div id="root"></div>', () => `<div id="root"${isNotFound ? '' : ' data-prerendered'}>${body}</div>`);

    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, html);
    if (pageSeo(path, origin).indexable) sitemapEntries.push('  <url><loc>' + origin + path + '</loc></url>');
  }

  writeFileSync(join(dist, 'sitemap.xml'), [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapEntries,
    '</urlset>',
    '',
  ].join('\n'));

  if (siteUrl) {
    writeFileSync(join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + origin + '/sitemap.xml\n');
  }

  console.log(`Rendered ${sitePaths.length} pages and a 404 page. Sitemap includes ${sitemapEntries.length} URLs.`);
} finally {
  rmSync(server, { recursive: true, force: true });
}
