import { chromium } from 'playwright';

async function testScrollingElement() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--enable-gpu', '--no-sandbox']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); // wait past intro

  const info = await page.evaluate(() => {
    const se = document.scrollingElement;
    
    // Try scrolling se directly
    se.scrollTop = 500;
    
    return {
      scrollingElementTag: se.tagName,
      seScrollTop: se.scrollTop,
      windowScrollY: window.scrollY,
      bodyHeight: document.body.offsetHeight,
      htmlHeight: document.documentElement.offsetHeight,
      windowInnerHeight: window.innerHeight,
      bodyClass: document.body.className,
      htmlClass: document.documentElement.className,
      bodyStyle: document.body.getAttribute('style'),
      htmlStyle: document.documentElement.getAttribute('style')
    };
  });

  console.log('Scrolling Element Info:', info);
  await browser.close();
}

testScrollingElement().catch(console.error);
