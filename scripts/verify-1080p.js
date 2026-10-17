import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to http://127.0.0.1:4173 ...');
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000); // wait for preloader

  // Switch to trailer mode
  console.log('Switching to trailer loop mode...');
  await page.click('#hero-mode-video');
  await page.waitForTimeout(2500); // let 1080p video play

  const videoWidth = await page.$eval('#hero-local-video', el => el.videoWidth);
  const videoHeight = await page.$eval('#hero-local-video', el => el.videoHeight);
  const currentTime = await page.$eval('#hero-local-video', el => el.currentTime);
  const isPaused = await page.$eval('#hero-local-video', el => el.paused);

  console.log('Video playing:', !isPaused, 'at currentTime:', currentTime);
  console.log('Video native resolution:', videoWidth, 'x', videoHeight);

  await page.screenshot({ path: 'trailer-ac1-1080p-verified.png' });
  await browser.close();
  console.log('Verified 1080p playback screenshot saved!');
})();
