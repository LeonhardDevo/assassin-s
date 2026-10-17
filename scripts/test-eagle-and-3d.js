import { chromium } from 'playwright';

async function testEagleAnd3D() {
  console.log('🧪 Testing 3D Card Perspective and Eagle Vision...');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--enable-gpu', '--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

  // Dismiss intro
  try {
    const intro = await page.$('#ac-intro');
    if (intro) await intro.click().catch(() => {});
  } catch (e) {}
  await page.waitForTimeout(1200);

  // 1. Test 3D Perspective Tilt on Card Hover
  const cardBox = await page.locator('#hero-char-card').boundingBox();
  console.log('Card bounding box:', cardBox);

  // Move mouse to top-right corner of card to induce positive rotateY and negative rotateX
  const hoverX = cardBox.x + cardBox.width * 0.85;
  const hoverY = cardBox.y + cardBox.height * 0.2;
  await page.mouse.move(hoverX, hoverY);
  await page.waitForTimeout(400);

  const tiltStats = await page.evaluate(() => {
    const card = document.getElementById('hero-char-card');
    const hud = document.getElementById('hero-hud-rot');
    const glare = document.getElementById('hero-card-glare');
    return {
      cardTransform: card ? card.style.transform : null,
      hudText: hud ? hud.textContent : null,
      glareBg: glare ? glare.style.background : null
    };
  });
  console.log('✨ 3D Tilt Stats (Top-Right Hover):', tiltStats);

  // Capture screenshot of tilted 3D card
  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\brain\\ed640ff2-d603-4b2a-9370-b721fdbeff82\\card-3d-tilted.png' });
  console.log('📸 Saved card-3d-tilted.png');

  // 2. Test "Activate Eagle Vision" button click
  console.log('Testing Eagle Vision button click...');
  const eagleBtn = page.locator('#hero-eagle-btn');
  await eagleBtn.click();
  await page.waitForTimeout(600);

  const eagleOnStats = await page.evaluate(() => {
    const overlay = document.getElementById('ac-eagle');
    const btnText = document.getElementById('hero-eagle-btn-text');
    const isHtmlActive = document.documentElement.classList.contains('ac-eagle-active');
    const isOverlayOn = overlay.classList.contains('ac-eagle--on');
    return { isOverlayOn, isHtmlActive, btnText: btnText.textContent };
  });
  console.log('🦅 Eagle Vision Activated Stats:', eagleOnStats);

  // Capture screenshot of Eagle Vision mode
  await page.screenshot({ path: 'C:\\Users\\Asus\\.gemini\\antigravity\brain\\ed640ff2-d603-4b2a-9370-b721fdbeff82\\card-eagle-vision-active.png' });
  console.log('📸 Saved card-eagle-vision-active.png');

  // 3. Test deactivating Eagle Vision
  await eagleBtn.click();
  await page.waitForTimeout(400);
  const eagleOffStats = await page.evaluate(() => {
    const overlay = document.getElementById('ac-eagle');
    const btnText = document.getElementById('hero-eagle-btn-text');
    return { isOverlayOn: overlay.classList.contains('ac-eagle--on'), btnText: btnText.textContent };
  });
  console.log('🦅 Eagle Vision Deactivated Stats:', eagleOffStats);

  // 4. Test 'V' key shortcut
  console.log('Testing "V" keyboard shortcut...');
  await page.keyboard.press('v');
  await page.waitForTimeout(400);
  const vKeyStats = await page.evaluate(() => {
    const overlay = document.getElementById('ac-eagle');
    return { isOverlayOn: overlay.classList.contains('ac-eagle--on') };
  });
  console.log('🦅 "V" Key Activated Stats:', vKeyStats);

  // 5. Test Character Switching (Click Basim / Abbasid Caliphate)
  console.log('Testing character pill click (Basim)...');
  const basimBtn = page.locator('#hero-character-nav button', { hasText: 'Abbasid Caliphate' });
  if (await basimBtn.count() > 0) {
    await basimBtn.click();
    await page.waitForTimeout(600);
    const basimCardInfo = await page.evaluate(() => {
      return {
        name: document.getElementById('hero-card-name')?.textContent,
        era: document.getElementById('hero-card-era')?.textContent,
        archetype: document.getElementById('hero-card-archetype')?.textContent
      };
    });
    console.log('👤 Basim Card Info:', basimCardInfo);
  }

  await browser.close();
}

testEagleAnd3D().catch(console.error);
