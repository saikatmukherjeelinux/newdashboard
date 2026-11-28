const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.ML_PLAYWRIGHT_PATH || 'playwright');
const root = path.resolve(process.argv[2] || '.');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'unix-motion-lab/assets/architecture-visuals.js'),'utf8'),context);
const groups = context.window.UNIX_ARCHITECTURE_VISUALS;
assert.equal(Object.values(groups).flat().length,80);
assert.equal(Object.keys(groups).length,14);
(async()=>{
 const browser = await chromium.launch({channel:'msedge',headless:true});
 try {
  const page = await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [1200,390]){
   await page.setViewportSize({width,height:900});
   for(const id of Object.keys(groups)){
    await page.goto(pathToFileURL(path.join(root,'unix-motion-lab/index.html')).href+'#architecture/'+id);
    await page.waitForSelector('#architectureView:not([hidden]) .arch-detail');
    assert.equal(await page.locator('.arch-detail').count(),groups[id].length);
    const images=page.locator('#architectureView .arch-figure img');
    for(let n=0;n<await images.count();n++){
     const img=images.nth(n);await img.scrollIntoViewIfNeeded();
     await img.evaluate(el=>el.decode());
     const size=await img.boundingBox();assert(size.width<=481);assert(size.height<=341);
    }
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   }
  }
  await page.goto(pathToFileURL(path.join(root,'unix-motion-lab/index.html')).href+'#architecture/overview');
  await page.setViewportSize({width:1200,height:900});
  await page.locator('.arch-detail').first().scrollIntoViewIfNeeded();
  fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
  await page.screenshot({path:path.join(root,'test-results/architecture-80-diagrams.png')});
  assert.deepEqual(errors,[]);
  console.log('PASS: 80 new diagrams across 14 chapters; desktop and mobile load, medium sizing, no overflow or script errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
