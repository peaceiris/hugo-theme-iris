const { chromium } = require('playwright-chromium');
const expect = require('expect');

beforeAll(async () => {
  const browser = await chromium.launch();
});

afterAll(async () => {
  await browser.close();
});

beforeEach(async () => {
  const page = await browser.newPage();
});

afterEach(async () => {
  await page.close();
});

describe('Keyboard Shortcut', () => {
  test('Press g+p, go to /posts/', async () => {
    await page.goto('https://hugothemeiris.peaceiris.app/');
    await page.keyboard.press('g+p', {delay: 1000});
    expect(page.url()).toBe('https://hugothemeiris.peaceiris.app/posts/');
    expect(await page.title()).toBe('Posts');
  });
});
