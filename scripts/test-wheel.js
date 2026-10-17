import { chromium } from 'playwright';

async function testWheel() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--enable-gpu', '--no-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  try {
    const intro = await page.$('#ac-intro');
    if (intro) await intro.click().catch(() => {});
  } catch (e) {}
  await page.waitForTimeout(1500);

  console.log('Testing wheel scroll responsiveness concurrently...');
  
  // Start the listener in page
  await page.evaluate(() => {
    window.__scrollDeltas = [];
    window.__lastY = window.scrollY;
    window.__jankCount = 0;
    window.__frameCount = 0;
    let lastFrame = performance.now();

    window.addEventListener('scroll', () => {
      const cur = window.scrollY;
      window.__scrollDeltas.push(cur - window.__lastY);
      window.__lastY = cur;
    }, { passive: true });

    function tick(now) {
      window.__frameCount++;
      const delta = now - lastFrame;
      lastFrame = now;
      if (delta > 33.3) window.__jankCount++;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  // Now emit real wheel events from Playwright
  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(80);
  }

  // Wait 500ms for momentum to settle
  await page.waitForTimeout(500);

  const stats = await page.evaluate(() => {
    return {
      finalScrollY: window.scrollY,
      deltasCount: window.__scrollDeltas.length,
      first5Deltas: window.__scrollDeltas.slice(0, 5),
      last5Deltas: window.__scrollDeltas.slice(-5),
      frameCount: window.__frameCount,
      jankCount: window.__jankCount,
      hasLenis: !!window.lenis,
      isSmoothBehavior: getComputedStyle(document.documentElement).scrollBehavior
    };
  });

  console.log('📊 Concurrent Wheel Test Stats:', stats);
  await browser.close();
}

testWheel().catch(console.error);
