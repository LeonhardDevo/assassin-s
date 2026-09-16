const fs = require('fs');
const html = fs.readFileSync('stitch.html', 'utf8');
const match = html.match(/tailwind\.config\s*=\s*(\{[\s\S]*?\})\s*<\/script/);
if (match) {
  const config = eval('(' + match[1] + ')');
  let css = '@import "tailwindcss";\n\n@theme {\n';
  for (const [k, v] of Object.entries(config.theme.extend.colors)) {
    css += `  --color-${k}: ${v};\n`;
  }
  for (const [k, v] of Object.entries(config.theme.extend.fontFamily)) {
    css += `  --font-${k}: "${v[0]}";\n`;
  }
  for (const [k, v] of Object.entries(config.theme.extend.fontSize)) {
    css += `  --text-${k}: ${v[0]};\n`;
    css += `  --text-${k}--line-height: ${v[1].lineHeight};\n`;
    css += `  --text-${k}--font-weight: ${v[1].fontWeight};\n`;
    if(v[1].letterSpacing) css += `  --text-${k}--letter-spacing: ${v[1].letterSpacing};\n`;
  }
  css += '}\n\n';
  css += `
@layer base {
  body {
    background-color: var(--color-background);
    color: var(--color-on-surface);
  }
}
@layer utilities {
  .glow-gold {
      box-shadow: 0 0 15px 0 rgba(233, 195, 73, 0.2);
      transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  }
  .glow-gold:hover {
      box-shadow: 0 0 25px 0 rgba(233, 195, 73, 0.4);
      background-color: var(--color-secondary);
      color: var(--color-surface-container-lowest) !important;
  }
  
  .text-shadow-cinematic {
      text-shadow: 0 4px 24px rgba(0,0,0,0.8);
  }

  .parallax-bg {
      background-attachment: fixed;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
  }
  
  .no-scrollbar::-webkit-scrollbar {
      display: none;
  }
  .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }

  .reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s ease-out;
  }
  .reveal.active {
      opacity: 1;
      transform: translateY(0);
  }
}
`;
  fs.writeFileSync('src/style.css', css);
}
