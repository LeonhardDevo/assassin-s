import { chromium } from 'playwright';

async function testFix() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--enable-gpu', '--no-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const result = await page.evaluate(() => {
    // Apply the fix in page
    if (window.lenis) {
      window.lenis.destroy();
      window.lenis = null;
    }
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.classList.remove('overflow-x-hidden');
    document.body.style.overflow = 'visible';

    const before = window.scrollY;
    window.scrollTo(0, 500);
    const after = window.scrollY;

    return { before, after };
  });

  console.log('Window scrollTo with fix:', result);

  // Now test real mouse wheel
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(300);

  const wheelResult = await page.evaluate(() => window.scrollY);
  console.log('Real mouse wheel with fix:', wheelResult);

  await browser.close();
}

testFix().catch(console.error);
