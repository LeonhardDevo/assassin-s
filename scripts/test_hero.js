import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Listen for console messages and errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);

  // Screenshot 1: Altair (Part 1)
  await page.screenshot({ path: 'C:/Users/Asus/.gemini/antigravity/brain/ed640ff2-d603-4b2a-9370-b721fdbeff82/test-altair-3d.png' });
  console.log('Saved test-altair-3d.png');

  // Switch to Eivor (Part 3: Vikings)
  const pills = await page.locator('#hero-character-nav button').all();
  console.log('Found saga pills:', pills.length);
  if (pills[2]) {
    await pills[2].click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: 'C:/Users/Asus/.gemini/antigravity/brain/ed640ff2-d603-4b2a-9370-b721fdbeff82/test-eivor-3d.png' });
    console.log('Saved test-eivor-3d.png');
  }

  // Hover over Eivor card to test 3D tilt & glare
  const card = page.locator('#hero-char-card');
  const box = await card.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.25);
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'C:/Users/Asus/.gemini/antigravity/brain/ed640ff2-d603-4b2a-9370-b721fdbeff82/test-eivor-tilt-3d.png' });
    console.log('Saved test-eivor-tilt-3d.png');
  }

  // Switch to Shadows (Part 5: Feudal Japan)
  if (pills[4]) {
    await pills[4].click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: 'C:/Users/Asus/.gemini/antigravity/brain/ed640ff2-d603-4b2a-9370-b721fdbeff82/test-shadows-3d.png' });
    console.log('Saved test-shadows-3d.png');
  }

  // Click card to test strike
  await card.click();
  await page.waitForTimeout(100);
  await page.screenshot({ path: 'C:/Users/Asus/.gemini/antigravity/brain/ed640ff2-d603-4b2a-9370-b721fdbeff82/test-strike-fx.png' });
  console.log('Saved test-strike-fx.png');

  await browser.close();
})();
