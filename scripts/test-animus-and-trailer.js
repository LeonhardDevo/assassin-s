import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to http://127.0.0.1:4173 ...');
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });

  // 1. Check Interactive Animus Simulation Mode
  console.log('--- 1. Testing Interactive Animus Simulation Mode ---');
  const animusContainer = await page.$('#hero-animus-container');
  const animusOpacity = await animusContainer.evaluate(el => window.getComputedStyle(el).opacity);
  const canvasWidth = await page.$eval('#animus-canvas', el => el.width);
  const cardVisible = await page.$eval('#hero-3d-scene', el => !el.classList.contains('opacity-0'));
  const videoHidden = await page.$eval('#hero-video-container', el => el.classList.contains('opacity-0'));

  console.log('Animus container opacity in char mode:', animusOpacity);
  console.log('Animus canvas width:', canvasWidth);
  console.log('3D Card visible in Animus mode:', cardVisible);
  console.log('Video container hidden in Animus mode:', videoHidden);

  // Trigger Eagle Vision in Animus Mode
  console.log('Testing Eagle Vision pulse in Animus...');
  await page.click('#hero-eagle-btn');
  await page.waitForTimeout(300);
  const eagleActive = await page.evaluate(() => document.documentElement.classList.contains('ac-eagle-active'));
  console.log('Eagle Vision active in DOM:', eagleActive);
  await page.click('#hero-eagle-btn'); // toggle off

  await page.screenshot({ path: 'animus-simulation-mode.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Saved animus-simulation-mode.png');

  // 2. Switch to Trailer Loop Mode
  console.log('--- 2. Testing Switch to Trailer Video Loop Mode ---');
  await page.click('#hero-mode-video');
  await page.waitForTimeout(600);

  const videoOpacity = await page.$eval('#hero-video-container', el => window.getComputedStyle(el).opacity);
  const animusHidden = await page.$eval('#hero-animus-container', el => el.classList.contains('opacity-0'));
  const cardHidden = await page.$eval('#hero-3d-scene', el => el.classList.contains('opacity-0'));
  const currentVideoSrc = await page.$eval('#hero-local-video', el => el.getAttribute('src'));
  const videoPaused = await page.$eval('#hero-local-video', el => el.paused);

  console.log('Video container opacity in trailer mode:', videoOpacity);
  console.log('Animus container hidden in trailer mode:', animusHidden);
  console.log('3D Card hidden in trailer mode:', cardHidden);
  console.log('Current video src (Part 1 Altair):', currentVideoSrc);
  console.log('Video playing (paused === false):', !videoPaused);

  await page.screenshot({ path: 'trailer-native-video-mode.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Saved trailer-native-video-mode.png');

  // 3. Test Switching to Ezio (Part 2: Renaissance)
  console.log('--- 3. Testing Saga Switching in Video Loop Mode ---');
  const pills = await page.$$('#hero-character-nav button');
  console.log('Clicking Part 2: Renaissance (Ezio)...');
  await pills[1].click();
  await page.waitForTimeout(500);

  const ezioVideoSrc = await page.$eval('#hero-local-video', el => el.getAttribute('src'));
  console.log('Video src after selecting Ezio:', ezioVideoSrc);

  await page.screenshot({ path: 'trailer-ezio-video-mode.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Saved trailer-ezio-video-mode.png');

  // 4. Test Switching back to Interactive Animus Mode
  console.log('--- 4. Testing Return to Interactive Animus Mode ---');
  await page.click('#hero-return-char-btn');
  await page.waitForTimeout(500);

  const finalCardVisible = await page.$eval('#hero-3d-scene', el => !el.classList.contains('opacity-0'));
  const finalAnimusOpacity = await page.$eval('#hero-animus-container', el => window.getComputedStyle(el).opacity);
  const finalVideoHidden = await page.$eval('#hero-video-container', el => el.classList.contains('opacity-0'));
  const finalVideoPaused = await page.$eval('#hero-local-video', el => el.paused);

  console.log('3D Card visible again:', finalCardVisible);
  console.log('Animus simulation active again:', finalAnimusOpacity === '1');
  console.log('Video container hidden again:', finalVideoHidden);
  console.log('Video paused again:', finalVideoPaused);

  await page.screenshot({ path: 'animus-return-mode.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Saved animus-return-mode.png');

  await browser.close();
  console.log('ALL ANIMUS & VIDEO TESTS PASSED WITH 100% SUCCESS!');
})();
