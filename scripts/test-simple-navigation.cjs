const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const {chromium}=require(process.env.ML_PLAYWRIGHT_PATH||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const root=path.resolve(__dirname,'..');fs.mkdirSync(path.join(root,'test-results/simple'),{recursive:true});
 for(const width of [1440,390]){await page.setViewportSize({width,height:900});
 for(const lab of ['python-motion-lab','dsa-motion-lab','unix-motion-lab','ml-motion-lab','statistics-lab']){
 await page.goto(pathToFileURL(path.join(root,lab,'index.html')).href);
 await page.waitForSelector('#simple-topic option:nth-child(3)',{state:'attached'});
 assert(await page.locator('#simple-topic').isVisible());
 assert.equal(await page.getByRole('link',{name:'Cheat Sheet',exact:true}).count(),1);
 assert(!(await page.locator('.simple-options').getAttribute('open')));
 await page.locator('#simple-topic').selectOption('1');
 if(lab==='ml-motion-lab'||lab==='statistics-lab')await page.waitForSelector('#lessonTitle');
 await page.locator('#simple-topic').selectOption('0');
 const search=page.locator('.simple-navigation>input');await search.fill('zzzznotatopic');
 await page.waitForFunction(()=>document.querySelector('#simple-topic').options.length===1);
 await search.fill('');await page.waitForFunction(()=>document.querySelector('#simple-topic').options.length>2);
 await page.locator('.simple-options>summary').click();
 if(lab!=='dsa-motion-lab'){assert(await page.locator('#theme').isVisible());await page.locator('#theme').click();await page.locator('#theme').click();}
 assert(await page.locator('.reading-foundations summary').isVisible());
 await page.locator('.simple-options>summary').click();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.screenshot({path:path.join(root,`test-results/simple/${lab}-${width}.png`)});
 }}assert.deepEqual(errors,[]);console.log('PASS: five labs, one topic chooser, topic selection, search, optional tools, themes, desktop/mobile and no script errors.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
