const {chromium}=require(process.env.ML_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const bank=require('./section-projects.json');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=(lab,file='index.html')=>pathToFileURL(path.resolve(__dirname,'..',lab,file)).href;
 let total=0;
 for(const [lab,projects] of Object.entries(bank)){
   await page.goto(url(lab));await page.waitForSelector('#library-browse');
   await page.locator('#library-browse').selectOption('url:section-projects.html');
   await page.waitForSelector('#project-choice');
   assert.equal(await page.locator('#project-choice option').count(),projects.length+1);
   for(const project of projects){
     await page.locator('#project-choice').selectOption(project.id);
     await page.waitForFunction(title=>document.querySelector('#project-view h2')?.textContent===title,project.title);
     assert.equal(await page.locator('.project-code code').textContent(),project.code);
     assert.equal(await page.locator('.project-output code').textContent(),project.output);
     assert.equal(await page.locator('#project-view ol li').count(),project.steps.length);
     await page.setViewportSize({width:390,height:900});
     assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
     total++;
   }
   await page.locator('.project-copy').click();await page.waitForFunction(()=>/copied|selected/i.test(document.querySelector('.project-copy-status').textContent));
   await page.goto(url(lab));await page.waitForSelector('#library-browse');
   // Visit one representative lesson from every section; confirm inline coverage.
   const sections=await page.evaluate(lab=>{
     const source=lab==='dsa-motion-lab'?lessons:lab==='python-motion-lab'?window.LESSONS:lab==='unix-motion-lab'?window.UNIX_LESSONS:lab==='ml-motion-lab'?window.ML_DATA.lessons:window.STATS_DATA.lessons;
     const seen=new Set();return source.filter(l=>{const g=l.group||l.category;if(seen.has(g))return false;seen.add(g);return true;}).map(l=>({id:l.id,group:l.group||l.category}));
   },lab);
   for(const item of sections){
     await page.evaluate(({lab,id})=>{
       if(lab==='dsa-motion-lab')choose(id);
       else if(lab==='python-motion-lab')document.querySelector(`#lessonNav button[data-lesson="${id}"]`).click();
       else location.hash=(lab==='unix-motion-lab'?'learn/':lab==='ml-motion-lab'?'lesson/':'topic/')+id;
     },{lab,id:item.id});
     const project=projects.find(p=>p.section===item.group);assert(project,item.group);
     await page.waitForFunction(id=>!!document.querySelector(`.section-project[data-project="${id}"]`),project.id);
   }
   if(lab==='unix-motion-lab'){
     for(const [route,id] of [['industry','industry-practice'],['architecture','unix-architecture']]){
       await page.evaluate(route=>location.hash=route,route);
       await page.waitForFunction(id=>!!document.querySelector(`.section-project[data-project="${id}"]`),id);
     }
   }
 }
 assert.equal(total,77);assert.deepEqual(errors,[]);
 console.log('PASS: 77 projects, exact code/output display, mobile overflow, copy, Browse access and inline coverage of every section.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
