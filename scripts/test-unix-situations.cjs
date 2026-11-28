const {chromium}=require(process.env.ML_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const cases=require('./unix-situations.json');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 const url=pathToFileURL(path.resolve(__dirname,'../unix-motion-lab/index.html')).href;
 for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});
   for(const item of cases){
     await page.goto(url+'#learn/'+item.id);
     await page.waitForSelector(`.unix-situation[data-command="${item.id}"]`);
     assert.equal(await page.locator('.unix-situation').count(),1);
     const section=page.locator('.unix-situation');await section.locator(':scope>details>summary').click();
     assert.equal(await section.locator('.situation-code code').textContent(),item.code);
     assert.equal(await section.locator('.situation-output code').textContent(),item.output);
     assert.equal(await section.locator('ol>li').count(),4);
     assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
     const status=await section.locator('.situation-verification').textContent();
     assert(status.includes(item.execution==='matched'?'checked':item.variable?'illustrative':'not been execution-verified'));
   }
 }
 await page.locator('.situation-copy').click();await page.waitForFunction(()=>/copied|selected/i.test(document.querySelector('.situation-status').textContent));
 await page.goto(url+'#learn/grep');await page.waitForSelector('.unix-situation[data-command="grep"]');
 await page.goto(url+'#learn/cp');await page.waitForSelector('.unix-situation[data-command="cp"]');
 assert.equal(await page.locator('.unix-situation').count(),1);
 assert.deepEqual(errors,[]);
 console.log('PASS: all 80 command-specific situations on desktop/mobile, code/output/flags, verification labels, copy and lesson changes.');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
