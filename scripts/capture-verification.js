import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--enable-gpu', '--no-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  try {
    const intro = await page.$('#ac-intro');
    if (intro) await intro.click().catch(() => {});
  } catch (e) {}
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\ed640ff2-d603-4b2a-9370-b721fdbeff82\\perf-hero-check.png' });
  console.log('📸 Hero screenshot captured.');

  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\ed640ff2-d603-4b2a-9370-b721fdbeff82\\perf-saga-check.png' });
  console.log('📸 Saga screenshot captured.');

  await browser.close();
}

capture().catch(console.error);
