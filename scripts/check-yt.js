import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://127.0.0.1:4173');
  await page.click('#hero-mode-video');
  await page.waitForTimeout(4000);

  const iframeState = await page.$eval('#hero-yt-iframe', el => ({
    src: el.src,
    width: el.offsetWidth,
    height: el.offsetHeight,
    rect: el.getBoundingClientRect(),
    display: window.getComputedStyle(el).display,
    visibility: window.getComputedStyle(el).visibility,
    opacity: window.getComputedStyle(el).opacity
  }));
  console.log('Iframe state:', iframeState);

  const parentState = await page.$eval('#hero-trailer-container', el => ({
    opacity: window.getComputedStyle(el).opacity,
    display: window.getComputedStyle(el).display,
    visibility: window.getComputedStyle(el).visibility,
    zIndex: window.getComputedStyle(el).zIndex
  }));
  console.log('Parent container state:', parentState);

  await page.screenshot({ path: 'test-yt-wait.png' });
  console.log('Saved test-yt-wait.png');
  await browser.close();
})();
