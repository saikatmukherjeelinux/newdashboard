const {chromium}=require(process.env.ML_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 const page=await browser.newPage(),root=path.resolve(__dirname,'..'),errors=[];page.on('pageerror',e=>errors.push(e.message));fs.mkdirSync(path.join(root,'test-results/library'),{recursive:true});
 for(const width of [1440,390]){await page.setViewportSize({width,height:950});await page.goto(pathToFileURL(path.join(root,'index.html')).href);assert.equal(await page.locator('.subject-list>a').count(),5);await page.screenshot({path:path.join(root,`test-results/library/dashboard-${width}.png`)});
 for(const lab of ['python-motion-lab','dsa-motion-lab','unix-motion-lab','ml-motion-lab','statistics-lab']){
 await page.goto(pathToFileURL(path.join(root,lab,'index.html')).href);await page.waitForSelector('#library-browse');
 assert.equal(await page.locator('.library-heading a').count(),0);
 const title=page.locator('#lessonTitle');const before=await title.count()?await title.textContent():'';
 await page.locator('#library-browse').selectOption('lesson:1');
 if(before)await page.waitForFunction(old=>document.querySelector('#lessonTitle').textContent!==old,before);
 await page.locator('#library-browse').selectOption('lesson:0');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 const tool=await page.locator('#library-browse option').evaluateAll(options=>options.find(x=>x.value.startsWith('tool:')&&/quiz|math|calculations/i.test(x.textContent))?.value);
 if(tool){await page.locator('#library-browse').selectOption(tool);await page.locator('#library-browse').selectOption('lesson:0');}
 await page.screenshot({path:path.join(root,`test-results/library/${lab}-${width}.png`)});
 await page.locator('#library-browse').selectOption('url:cheat-sheet.html');await page.waitForURL('**/cheat-sheet.html');assert.equal(await page.locator('header a').count(),1);assert.equal(await page.locator('.copy-code').count(),8);await page.locator('header a').click();await page.waitForSelector('#library-browse');
 await page.locator('#library-browse').selectOption('url:worked-examples.html');await page.waitForURL('**/worked-examples.html');assert.equal(await page.locator('header a').count(),1);
 }}assert.deepEqual(errors,[]);console.log('PASS: dashboard, five single-menu labs, topic changes, practice tools, cheat sheets, examples, desktop/mobile, no script errors.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
