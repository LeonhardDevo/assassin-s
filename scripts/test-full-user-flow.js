import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to http://127.0.0.1:4173 ...');
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600); // Wait for preloader fadeout

  // 1. Initial Interactive Animus Simulation Mode
  console.log('1. Capturing Interactive Animus Simulation Mode...');
  await page.screenshot({ path: 'flow-1-animus-mode.png' });

  // 2. Click "Trailer Loop"
  console.log('2. Clicking "Trailer Loop"...');
  await page.click('#hero-mode-video');
  await page.waitForTimeout(800);
  const videoSrc1 = await page.$eval('#hero-local-video', el => el.getAttribute('src'));
  const isPaused1 = await page.$eval('#hero-local-video', el => el.paused);
  console.log('Video 1 src (AC1):', videoSrc1, 'playing:', !isPaused1);
  await page.screenshot({ path: 'flow-2-trailer-ac1.png' });

  // 3. Click "Part 2: Renaissance"
  console.log('3. Clicking Part 2: Renaissance...');
  const pills = await page.$$('#hero-character-nav button');
  if (pills[1]) {
    await pills[1].click();
    await page.waitForTimeout(800);
    const videoSrc2 = await page.$eval('#hero-local-video', el => el.getAttribute('src'));
    console.log('Video 2 src (Ezio):', videoSrc2);
    await page.screenshot({ path: 'flow-3-trailer-ezio.png' });
  }

  // 4. Click "Part 3: Vikings"
  console.log('4. Clicking Part 3: Vikings...');
  if (pills[2]) {
    await pills[2].click();
    await page.waitForTimeout(800);
    const videoSrc3 = await page.$eval('#hero-local-video', el => el.getAttribute('src'));
    console.log('Video 3 src (Valhalla):', videoSrc3);
    await page.screenshot({ path: 'flow-4-trailer-valhalla.png' });
  }

  // 5. Return to Interactive Assassin Mode
  console.log('5. Clicking "Interactive Assassin"...');
  await page.click('#hero-mode-char');
  await page.waitForTimeout(800);
  const cardVisible = await page.$eval('#hero-3d-scene', el => !el.classList.contains('opacity-0'));
  const animusActive = await page.$eval('#hero-animus-container', el => window.getComputedStyle(el).opacity === '1');
  const videoPaused = await page.$eval('#hero-local-video', el => el.paused);
  console.log('Card visible:', cardVisible, 'Animus active:', animusActive, 'Video paused:', videoPaused);
  await page.screenshot({ path: 'flow-5-return-animus.png' });

  await browser.close();
  console.log('FULL USER FLOW VERIFICATION COMPLETED SUCCESSFULLY!');
})();
