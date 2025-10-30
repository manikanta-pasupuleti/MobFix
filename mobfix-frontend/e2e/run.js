const { chromium } = require('playwright');

(async () => {
  const base = 'http://localhost:4200';
  const api = 'http://localhost:5000/api';
  const ts = Date.now();
  const email = `e2e${ts}@example.com`;
  const password = 'Test123!';
  const name = 'E2E User';
  console.log('Starting Playwright e2e test against', base);

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Register
    await page.goto(base + '/register', { waitUntil: 'networkidle' });
    await page.getByLabel('Name').fill(name);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    // Click register and capture the XHR/Fetch response for the register API
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/users/register') && (r.status() === 200 || r.status() === 201), { timeout: 10000 }).catch(e => null),
      page.getByRole('button', { name: 'Register' }).click()
    ]);

    if (response) {
      const body = await response.json().catch(() => null);
      console.log('Register response body:', body);
    }

    // Wait for services heading to appear instead of relying on navigation event
    await page.waitForSelector('text=Services', { timeout: 10000 }).catch(() => {});
    console.log('Registered via UI:', email);

    // Confirm services page
    await page.waitForSelector('text=Services', { timeout: 5000 });
    const servicesText = await page.locator('h2').first().textContent();
    console.log('On page:', servicesText && servicesText.trim());

    // Grab token from localStorage
    const token = await page.evaluate(() => localStorage.getItem('mf_token'));
    if (!token) throw new Error('No token found in localStorage after register/login');
    console.log('Got token length', token.length);

    // Create a booking via fetch inside the browser context so cookies/headers are consistent
    const bookingPayload = {
      serviceId: null,
      mobileModel: 'E2E Phone',
      issueDescription: 'E2E test booking',
      date: new Date().toISOString().slice(0,10),
      time: '09:00'
    };

    // get first service id via API
    const services = await page.evaluate(async (args) => {
      const res = await fetch(args.api + '/services');
      return res.json();
    }, { api });

    if (!services || services.length === 0) throw new Error('No services available to book');
    bookingPayload.serviceId = services[0]._id;

    const createRes = await page.evaluate(async (args) => {
      const res = await fetch(args.api + '/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + args.token },
        body: JSON.stringify(args.payload)
      });
      return { status: res.status, body: await res.json() };
    }, { api, payload: bookingPayload, token });

  console.log('Booking create status:', createRes.status);
  console.log('Booking create body:', JSON.stringify(createRes.body));

    // As a sanity check, call /bookings/mine via fetch to ensure API returns the booking
    const mineRes = await page.evaluate(async (args) => {
      const res = await fetch(args.api + '/bookings/mine', { headers: { Authorization: 'Bearer ' + args.token } });
      return { status: res.status, body: await res.json() };
    }, { api, token });
    console.log('API /bookings/mine status:', mineRes.status, 'body:', JSON.stringify(mineRes.body));
    if (createRes.status !== 200 && createRes.status !== 201) {
      throw new Error('Failed to create booking: ' + JSON.stringify(createRes));
    }

    // Navigate to My Bookings
    await page.goto(base + '/my-bookings', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=My Bookings', { timeout: 5000 });

    // Check for our booking text
  const pageContent = await page.content();
  console.log('My Bookings page snippet:', pageContent.slice(0,2000));
  const found = pageContent.includes('E2E Phone') || pageContent.includes('E2E test booking');
  if (!found) throw new Error('Created booking not visible in My Bookings');

    console.log('E2E test PASSED: booking visible in My Bookings');

  } catch (err) {
    console.error('E2E test FAILED:', err);
    process.exitCode = 2;
  } finally {
    await context.close();
    await browser.close();
  }
})();
