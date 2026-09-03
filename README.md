# rianbutala.xyz

Hand-written HTML, no CSS files, no build step. A zero-dependency Node server
(`server.js`) maps the old portfolio's clean URLs onto the HTML files and
serves everything else statically.

```bash
node server.js   # http://localhost:3000 (or PORT=8080 node server.js)
```

- Pages: `index.html`, `projects.html`, `blog.html`, `projects/*.html`, `blog/*.html`, `404.html`
- Old routes `/about` and `/contact` 301 to the home page
- On Vercel: set Framework Preset to "Other", no build command &mdash; `vercel.json` replicates the server's clean URLs and redirects statically (`server.js` is only for local/self-hosting)
- `server.js` refuses to serve itself, `package.json`, and `IMG_2612.jpeg` (the unstripped original headshot — has GPS EXIF, keep it out of deploys)
