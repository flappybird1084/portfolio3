// Zero-dependency static server with the old site's routes.
// Run with: node server.js
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// old-portfolio paths whose content now lives on the home page
const REDIRECTS = {
  '/about': '/',
  '/contact': '/#contact',
  '/index.html': '/',
  '/projects.html': '/projects',
  '/blog.html': '/blog',
};

// files in this folder that are not part of the site
const HIDDEN = new Set(['/server.js', '/package.json', '/IMG_2612.jpeg']);

function notFound(res) {
  res.writeHead(404, { 'Content-Type': MIME['.html'] });
  fs.createReadStream(path.join(ROOT, '404.html')).pipe(res);
}

http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return notFound(res);
  }

  if (REDIRECTS[pathname]) {
    res.writeHead(301, { Location: REDIRECTS[pathname] });
    return res.end();
  }
  if (pathname.length > 1 && pathname.endsWith('/')) {
    res.writeHead(301, { Location: pathname.slice(0, -1) });
    return res.end();
  }
  if (HIDDEN.has(pathname) || pathname.includes('..') || pathname.includes('\0')) {
    return notFound(res);
  }

  const candidates =
    pathname === '/' ? ['/index.html'] : [pathname, pathname + '.html'];
  for (const rel of candidates) {
    const abs = path.join(ROOT, rel);
    if (!abs.startsWith(ROOT + path.sep)) continue;
    let stat;
    try {
      stat = fs.statSync(abs);
    } catch {
      continue;
    }
    if (!stat.isFile()) continue;
    const type = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': stat.size });
    return fs.createReadStream(abs).pipe(res);
  }
  notFound(res);
}).listen(PORT, () => {
  console.log(`serving on http://localhost:${PORT}`);
});
