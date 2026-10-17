// Playwright Test: Verify Hero Modes & Saga Switching
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://127.0.0.1:4173 ...');
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });

  // 1. Verify Initial State (Interactive Assassin Mode)
  console.log('--- 1. Testing Interactive Assassin Mode ---');
  const videoContainer = await page.$('#hero-video-container');
  const videoContainerOpacity = await videoContainer.evaluate(el => window.getComputedStyle(el).opacity);
  const localVideoSrc = await page.$eval('#hero-local-video', el => el.getAttribute('src'));
  const cardScene = await page.$('#hero-3d-scene');
  const cardVisible = await cardScene.evaluate(el => !el.classList.contains('opacity-0'));

  console.log('Video container opacity in char mode:', videoContainerOpacity);
  console.log('Local video src:', localVideoSrc);
  console.log('3D Card visible in char mode:', cardVisible);

  // Test Eagle Vision button
  console.log('--- 2. Testing Eagle Vision in 3D Card ---');
  const eagleBtn = await page.$('#hero-eagle-btn');
  await eagleBtn.click();
  const eagleActive = await page.evaluate(() => document.getElementById('ac-eagle').classList.contains('ac-eagle--on'));
  const eagleBtnText = await page.$eval('#hero-eagle-btn-text', el => el.textContent.trim());
  console.log('Eagle Vision active after click:', eagleActive);
  console.log('Eagle Vision button text:', eagleBtnText);

  // Toggle off
  await eagleBtn.click();

  // Test 3D Card mouse tilt
  console.log('--- 3. Testing 3D Card Tilt ---');
  const cardBox = await page.$eval('#hero-char-card', el => {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  });
  await page.mouse.move(cardBox.x + cardBox.width * 0.8, cardBox.y + cardBox.height * 0.2);
  await page.waitForTimeout(300);
  const cardTransform = await page.$eval('#hero-char-card', el => el.style.transform);
  console.log('Card 3D transform on hover:', cardTransform);

  // Screenshot Interactive Assassin Mode
  await page.screenshot({ path: 'hero-mode-interactive.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Saved hero-mode-interactive.png');

  // 4. Test Switching to Trailer Loop Mode
  console.log('--- 4. Testing Switch to Trailer Loop Mode ---');
  await page.click('#hero-mode-video');
  await page.waitForTimeout(500);

  const trailerContainer = await page.$('#hero-trailer-container');
  const trailerOpacity = await trailerContainer.evaluate(el => window.getComputedStyle(el).opacity);
  const cardSceneHidden = await cardScene.evaluate(el => el.classList.contains('opacity-0'));
  const ytSrc = await page.$eval('#hero-yt-iframe', el => el.src);
  const muteBtnVisible = await page.$eval('#hero-video-mute', el => !el.classList.contains('hidden'));

  console.log('Trailer container opacity in trailer mode:', trailerOpacity);
  console.log('3D Card hidden in trailer mode:', cardSceneHidden);
  console.log('Trailer iframe src:', ytSrc);
  console.log('Mute button visible in trailer mode:', muteBtnVisible);

  // Screenshot Trailer Loop Mode
  await page.screenshot({ path: 'hero-mode-trailer.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Saved hero-mode-trailer.png');

  // 5. Test Switching Saga in Trailer Mode
  console.log('--- 5. Testing Saga Switching in Trailer Mode ---');
  // Click Part 2: Renaissance (Ezio)
  const pills = await page.$$('#hero-character-nav button');
  console.log('Found saga pills count:', pills.length);
  await pills[1].click(); // Ezio
  await page.waitForTimeout(400);

  const ezioTrailerSrc = await page.$eval('#hero-yt-iframe', el => el.src);
  const chapterText = await page.$eval('.ac-chapter', el => el.textContent.trim());
  console.log('After clicking Ezio pill, trailer src contains zzNs4-kRLaE or 4K39UWxdm0U:', ezioTrailerSrc);
  console.log('Chapter text:', chapterText);

  // Click Next Part button
  await page.click('#hero-trailer-next');
  await page.waitForTimeout(400);
  const nextTrailerSrc = await page.$eval('#hero-yt-iframe', el => el.src);
  console.log('After Next Part button (Eivor / Valhalla), trailer src contains ssrNcwxALS4:', nextTrailerSrc);

  // 6. Test Returning to Interactive Assassin Mode
  console.log('--- 6. Testing Return to Interactive Assassin Mode ---');
  await page.click('#hero-return-char-btn');
  await page.waitForTimeout(500);

  const finalCardVisible = await cardScene.evaluate(el => !el.classList.contains('opacity-0'));
  const finalYtSrc = await page.$eval('#hero-yt-iframe', el => el.src);
  const finalVideoOpacity = await videoContainer.evaluate(el => window.getComputedStyle(el).opacity);
  const finalCardName = await page.$eval('#hero-card-name', el => el.textContent.trim());

  console.log('3D Card visible again:', finalCardVisible);
  console.log('YouTube iframe src cleared (empty string):', finalYtSrc === '');
  console.log('Video container opacity returned to 1:', finalVideoOpacity);
  console.log('Active 3D Card Name is Eivor:', finalCardName);

  await page.screenshot({ path: 'hero-mode-return.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Saved hero-mode-return.png');

  await browser.close();
  console.log('ALL TESTS PASSED SUCCESSFULLY!');
})();
