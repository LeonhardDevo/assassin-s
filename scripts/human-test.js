import { chromium } from 'playwright';

async function runHumanTest() {
  console.log('🤖 Starting comprehensive HUMAN SIMULATION test on http://127.0.0.1:4173/ ...');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--enable-gpu', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error('❌ Console Error:', msg.text());
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
    console.error('💥 Page Exception:', err.message);
  });

  // 1. Load Page
  console.log('Step 1: Navigating to page...');
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

  // 2. Wait or click intro overlay
  console.log('Step 2: Checking and dismissing intro overlay...');
  const intro = await page.$('#ac-intro');
  if (intro) {
    await intro.click().catch(() => {});
    await page.waitForTimeout(1000);
  }

  // Inject FPS & Jank monitor
  await page.evaluate(() => {
    window.__perfStats = {
      frames: 0,
      longFrames: 0, // >33.3ms
      jankFrames: 0, // >50ms
      maxDelta: 0,
      deltas: [],
      scrollPositions: []
    };
    let last = performance.now();

    function loop(now) {
      window.__perfStats.frames++;
      const delta = now - last;
      last = now;
      if (delta > window.__perfStats.maxDelta) window.__perfStats.maxDelta = delta;
      if (delta > 33.3) window.__perfStats.longFrames++;
      if (delta > 50.0) window.__perfStats.jankFrames++;

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    window.addEventListener('scroll', () => {
      window.__perfStats.scrollPositions.push(window.scrollY);
    }, { passive: true });
  });

  // 3. Human interaction in Hero: Move mouse around to test 3D parallax
  console.log('Step 3: Simulating human mouse exploration over 3D card...');
  for (let i = 0; i < 10; i++) {
    const x = 700 + Math.sin(i) * 200;
    const y = 350 + Math.cos(i) * 150;
    await page.mouse.move(x, y);
    await page.waitForTimeout(50);
  }

  // 4. Test Era Selector Buttons in Hero
  console.log('Step 4: Clicking through hero memory eras...');
  const eraPills = await page.$$('#hero-character-nav button');
  console.log(`Found ${eraPills.length} era buttons.`);
  for (let i = 0; i < Math.min(3, eraPills.length); i++) {
    await eraPills[i].click();
    await page.waitForTimeout(300);
  }

  // 5. Test Mode Switcher: Video vs Interactive
  console.log('Step 5: Testing Hero Trailer / Character mode toggle...');
  const videoModeBtn = await page.$('#hero-mode-video');
  if (videoModeBtn) {
    await videoModeBtn.click();
    await page.waitForTimeout(400);
  }
  const charModeBtn = await page.$('#hero-mode-char');
  if (charModeBtn) {
    await charModeBtn.click();
    await page.waitForTimeout(400);
  }

  // 6. Natural Human Scrolling down the page
  console.log('Step 6: Simulating natural human wheel scrolling down entire page...');
  for (let step = 0; step < 30; step++) {
    await page.mouse.wheel(0, 180);
    await page.waitForTimeout(70);
  }

  const midScrollY = await page.evaluate(() => window.scrollY);
  console.log(`Mid-page scroll position reached: ${midScrollY}px (native scroll active!)`);

  // 7. Test Main Entries carousel navigation buttons
  console.log('Step 7: Testing Saga carousel next/prev buttons...');
  const nextBtn = await page.$('.games-next');
  if (nextBtn) {
    await nextBtn.click();
    await page.waitForTimeout(250);
    await nextBtn.click();
    await page.waitForTimeout(250);
  }
  const prevBtn = await page.$('.games-prev');
  if (prevBtn) {
    await prevBtn.click();
    await page.waitForTimeout(250);
  }

  // 8. Test Era Filter tabs
  console.log('Step 8: Testing Era Filter tabs...');
  const eraTabs = await page.$$('#era-filters .era-tab');
  if (eraTabs.length > 2) {
    await eraTabs[1].click();
    await page.waitForTimeout(300);
    await eraTabs[2].click();
    await page.waitForTimeout(300);
    await eraTabs[0].click(); // Back to 'All'
    await page.waitForTimeout(300);
  }

  // 9. Scroll through Timeline and Lore
  console.log('Step 9: Scrolling through Timeline, Lore, and Store sections...');
  for (let step = 0; step < 30; step++) {
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(60);
  }

  const deepScrollY = await page.evaluate(() => window.scrollY);
  console.log(`Deep scroll position reached: ${deepScrollY}px`);

  // 10. Click a game card to open Details Modal
  console.log('Step 10: Testing game modal open and close...');
  const firstCard = await page.$('#saga-grid .group');
  if (firstCard) {
    await firstCard.click();
    await page.waitForTimeout(500);
    // Press ESC to close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 11. Test Search Overlay
  console.log('Step 11: Testing search modal and query typing...');
  const searchBtn = await page.$('#btn-search');
  if (searchBtn) {
    await searchBtn.click();
    await page.waitForTimeout(300);
    await page.fill('#search-input', 'Valhalla');
    await page.waitForTimeout(400);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // 12. Test Eagle Vision toggle
  console.log('Step 12: Testing Eagle Vision mode...');
  await page.keyboard.press('v');
  await page.waitForTimeout(400);
  await page.keyboard.press('v');
  await page.waitForTimeout(300);

  // 13. Fast scroll back to top
  console.log('Step 13: Simulating fast flick scroll back to top...');
  for (let step = 0; step < 20; step++) {
    await page.mouse.wheel(0, -350);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(600);

  const finalStats = await page.evaluate(() => {
    const p = window.__perfStats;
    const avgFps = Math.round((p.frames / (performance.now() - 1000)) * 1000);
    return {
      totalFrames: p.frames,
      longFrames: p.longFrames,
      jankFrames: p.jankFrames,
      maxDeltaMs: Math.round(p.maxDelta),
      finalScrollY: window.scrollY,
      scrollEventsCount: p.scrollPositions.length
    };
  });

  console.log('\n=============================================');
  console.log('🏆 HUMAN SIMULATION TEST RESULTS:');
  console.log(`• Total Frames Processed: ${finalStats.totalFrames}`);
  console.log(`• Long Frames (>33ms): ${finalStats.longFrames}`);
  console.log(`• Jank Frames (>50ms): ${finalStats.jankFrames}`);
  console.log(`• Max Delta: ${finalStats.maxDeltaMs} ms`);
  console.log(`• Scroll Events Captured: ${finalStats.scrollEventsCount}`);
  console.log(`• Console Errors: ${consoleErrors.length}`);
  console.log('=============================================\n');

  if (consoleErrors.length > 0) {
    console.log('Errors logged:', consoleErrors);
  }

  await browser.close();
}

runHumanTest().catch(console.error);
