const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const base = 'http://127.0.0.1:4200';
  const outDir = './e2e/screenshots';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await context.newPage();
  try {
    // Services
    await page.goto(base + '/services', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Services', { timeout: 5000 }).catch(() => {});
    await page.screenshot({ path: outDir + '/services.png', fullPage: true });
    console.log('Saved', outDir + '/services.png');

    // My Bookings (if auth required this will still capture the page)
    await page.goto(base + '/my-bookings', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=My Bookings', { timeout: 5000 }).catch(() => {});
    await page.screenshot({ path: outDir + '/my-bookings.png', fullPage: true });
    console.log('Saved', outDir + '/my-bookings.png');

  } catch (err) {
    console.error('Screenshot script failed:', err);
    process.exitCode = 2;
  } finally {
    await context.close();
    await browser.close();
  }
})();
