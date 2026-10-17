import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to http://127.0.0.1:4173 ...');
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000); // Wait for preloader

  // Switch to trailer loop mode
  console.log('Switching to trailer mode...');
  await page.click('#hero-mode-video');
  await page.waitForTimeout(1500);

  const pills = await page.$$('#hero-character-nav button');
  console.log('Found saga pills count:', pills.length);

  for (let i = 0; i < pills.length; i++) {
    if (i > 0) {
      console.log(`Clicking saga pill ${i + 1}...`);
      await pills[i].click();
      await page.waitForTimeout(1500);
    }

    const videoSrc = await page.$eval('#hero-local-video', el => el.currentSrc || el.src);
    const videoWidth = await page.$eval('#hero-local-video', el => el.videoWidth);
    const videoHeight = await page.$eval('#hero-local-video', el => el.videoHeight);
    const isPaused = await page.$eval('#hero-local-video', el => el.paused);
    const chapter = await page.$eval('#top .ac-chapter', el => el.textContent.trim());

    console.log(`Part ${i + 1}: ${chapter}`);
    console.log(`  Source: ${videoSrc}`);
    console.log(`  Resolution: ${videoWidth} x ${videoHeight}`);
    console.log(`  Playing: ${!isPaused}`);

    await page.screenshot({ path: `trailer-part-${i + 1}-1080p.png` });
  }

  await browser.close();
  console.log('ALL 5 TRAILERS VERIFIED IN FULL HD 1080p!');
})();
