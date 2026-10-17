import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: false });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://127.0.0.1:4173');
  console.log('Opened page in real Edge browser');
  await page.waitForTimeout(2000);

  console.log('Clicking Trailer Loop...');
  await page.click('#hero-mode-video');
  await page.waitForTimeout(4000);

  console.log('Clicking Part 3: Vikings...');
  const pills = await page.$$('#hero-character-nav button');
  if (pills[2]) await pills[2].click();
  await page.waitForTimeout(4000);

  console.log('Clicking Return to 3D Assassin...');
  await page.click('#hero-return-char-btn');
  await page.waitForTimeout(3000);

  await browser.close();
  console.log('Finished visual check!');
})();
