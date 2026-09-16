const fs = require('fs');
let html = fs.readFileSync('stitch.html', 'utf8');

// Remove CDN link
html = html.replace('<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>', '');

// Replace tailwind-config script block and the embedded style block with link to our built CSS
html = html.replace(/<script id="tailwind-config">[\s\S]*?<\/style>/, '<link rel="stylesheet" href="/src/style.css" />');

// Append main.js before closing body
html = html.replace('</body></html>', '  <script type="module" src="/src/main.js"></script>\n</body></html>');

fs.writeFileSync('index.html', html);
