const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.ML_PLAYWRIGHT_PATH || 'playwright');
const examples = require('./study-examples.json');
(async () => {
  const browser = await chromium.launch({headless:true, channel:'msedge'});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const width of [1440, 390]) {
      await page.setViewportSize({width, height:900});
      for (const [lab, entries] of Object.entries(examples)) {
        await page.goto(pathToFileURL(path.resolve(__dirname, '..', lab, 'index.html')).href);
        await page.getByRole('link', {name:'Cheat Sheet', exact:true}).click();
        assert.match(await page.title(), /Cheat Sheet/);
        assert(await page.locator('tbody tr').count() >= 18);
        assert.equal(await page.locator('.copy-code').count(), 8);
        for (const [i, entry] of entries.entries()) {
          assert.equal(await page.locator(`#code-${i+1}`).textContent(), entry.code.trim());
          assert.equal(await page.locator('.expected-output code').nth(i).textContent(), entry.output.trimEnd());
        }
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        await page.locator('.copy-code').first().click();
        await page.waitForFunction(() => /copied|selected/i.test(document.querySelector('#copy-status').textContent));
        await page.getByRole('link', {name:'Read the worked-example guide', exact:true}).first().click();
        assert(await page.locator('#example-1').isVisible());
      }
    }
    assert.deepEqual(errors, []);
    console.log('PASS: five cheat sheets, navigation, 40 matching snippets and outputs, copy buttons, detailed-example links, desktop and mobile layouts.');
  } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode=1;});
