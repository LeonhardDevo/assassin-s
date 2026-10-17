import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });

  const getBox = async (selector) => {
    const el = await page.$(selector);
    if (!el) return null;
    return await el.boundingBox();
  };

  console.log('--- LAYOUT IN INITIAL (ANIMUS) MODE ---');
  console.log('Header:', await getBox('#main-header'));
  console.log('Mode switch container:', await getBox('#top > div.absolute.top-24'));
  console.log('Mode char btn:', await getBox('#hero-mode-char'));
  console.log('Hero h1:', await getBox('#top h1.ac-glitch'));
  console.log('Hero quote:', await getBox('#hero-quote-text'));
  console.log('Hero card col:', await getBox('#hero-3d-scene-col'));
  console.log('Hero card:', await getBox('#hero-char-card'));
  console.log('Hero container #top:', await getBox('#top'));

  await browser.close();
})();
