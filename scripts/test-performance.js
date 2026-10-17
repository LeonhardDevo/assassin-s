import { chromium } from 'playwright';

async function testPerformance() {
  console.log('🚀 Launching Chrome via Playwright for performance profiling...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--enable-gpu', '--disable-features=Translate', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleLogs = [];
  const errors = [];

  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      console.error('❌ Browser Console Error:', msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(err.message);
    console.error('💥 Uncaught Page Exception:', err.message);
  });

  console.log('🌐 Navigating to http://127.0.0.1:4173/ ...');
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

  // Dismiss intro overlay if present
  try {
    const intro = await page.$('#ac-intro');
    if (intro) await intro.click().catch(() => {});
  } catch (e) {}
  await page.waitForTimeout(1200);

  console.log('⏱️ Profiling idle performance for 2 seconds...');
  const idleMetrics = await page.evaluate(async () => {
    return new Promise(resolve => {
      let frames = 0;
      let longFrames = 0;
      let maxDelta = 0;
      let lastTime = performance.now();
      const startTime = lastTime;

      function check(now) {
        frames++;
        const delta = now - lastTime;
        lastTime = now;
        if (delta > maxDelta) maxDelta = delta;
        if (delta > 33.3) longFrames++; // dropped below 30fps

        if (now - startTime < 2000) {
          requestAnimationFrame(check);
        } else {
          resolve({
            fps: Math.round((frames / (now - startTime)) * 1000),
            longFrames,
            maxDeltaMs: Math.round(maxDelta),
          });
        }
      }
      requestAnimationFrame(check);
    });
  });

  console.log('📊 Idle Metrics:', idleMetrics);

  console.log('📜 Profiling SCROLL performance (simulating user scroll)...');
  const scrollMetrics = await page.evaluate(async () => {
    return new Promise(resolve => {
      let frames = 0;
      let longFrames = 0;
      let jankFrames = 0; // >50ms
      let maxDelta = 0;
      let lastTime = performance.now();
      const startTime = lastTime;

      const totalScroll = document.body.scrollHeight - window.innerHeight;
      let currentScroll = 0;
      const scrollStep = totalScroll / 120; // simulate 120 steps

      function scrollLoop(now) {
        frames++;
        const delta = now - lastTime;
        lastTime = now;
        if (delta > maxDelta) maxDelta = delta;
        if (delta > 33.3) longFrames++;
        if (delta > 50.0) jankFrames++;

        currentScroll += scrollStep;
        window.scrollTo(0, currentScroll);

        if (currentScroll < totalScroll && (now - startTime < 4000)) {
          requestAnimationFrame(scrollLoop);
        } else {
          resolve({
            fps: Math.round((frames / (now - startTime)) * 1000),
            totalFrames: frames,
            longFrames,
            jankFrames,
            maxDeltaMs: Math.round(maxDelta),
          });
        }
      }
      requestAnimationFrame(scrollLoop);
    });
  });

  console.log('📊 Scroll Metrics:', scrollMetrics);
  console.log('⚠️ Total Console Errors:', errors.length);

  await browser.close();
}

testPerformance().catch(console.error);
