import { chromium } from 'playwright';

async function testWithAndWithoutLenis() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--enable-gpu', '--no-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Test 1: with current setup
  await page.mouse.move(500, 500);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(600);
  const scroll1 = await page.evaluate(() => ({
    scrollY: window.scrollY,
    lenisScroll: window.lenis?.scroll
  }));
  console.log('Test 1 (Default):', scroll1);

  // Test 2: Destroy Lenis and remove scroll-behavior
  await page.evaluate(() => {
    if (window.lenis) {
      window.lenis.destroy();
      window.lenis = null;
    }
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
  });

  await page.mouse.move(500, 500);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(600);
  const scroll2 = await page.evaluate(() => ({
    scrollY: window.scrollY
  }));
  console.log('Test 2 (Lenis destroyed, native scroll):', scroll2);

  await browser.close();
}

testWithAndWithoutLenis().catch(console.error);
