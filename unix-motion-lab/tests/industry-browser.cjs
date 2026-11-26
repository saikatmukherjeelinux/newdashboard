const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const {chromium}=require(process.env.UML_PLAYWRIGHT_PATH||'playwright');
const {questions}=require('../assets/industry-data.js');
(async()=>{
  const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const url=pathToFileURL(path.resolve(__dirname,'../index.html')).href;
    await page.goto(url);await page.locator('.industry-home-link').click();
    assert(await page.locator('#industryView').isVisible());assert(!(await page.locator('#browseView').isVisible()));
    assert.equal(await page.locator('.industry-question').count(),20);assert.equal(await page.locator('#industryCount').textContent(),'300 questions found');
    await page.locator('#industryNextPage').click();assert((await page.locator('.industry-number').first().textContent()).includes('021'));
    await page.locator('#industryCategory').selectOption('Services');assert.equal(await page.locator('.industry-question').count(),20);
    await page.locator('#industrySearch').fill('journalctl');assert.equal(await page.locator('.industry-question').count(),9);
    await page.locator('#industrySearch').fill('not-a-question-zz');assert.equal(await page.locator('.industry-question').count(),0);
    await page.locator('#industryReset').click();
    for(const q of questions){
      await page.goto(`${url}#industry/${q.id}`);
      await page.waitForFunction(title=>document.querySelector('#industryTitle')?.textContent===title,q.title);
      assert.equal(await page.locator('.industry-simple-explanation').textContent(),q.simpleExplanation);
      assert((await page.locator('.industry-input-guide').textContent()).includes(q.introduction));
      assert.equal(await page.locator('#industryCode').textContent(),q.code);
      assert.equal(await page.locator('#industryOutput').textContent(),q.output||'(No output on success)');
      assert.equal(await page.locator('.industry-summary p').textContent(),q.summary);
      assert.deepEqual(await page.locator('.industry-steps li').allTextContents(),q.steps);
      assert.equal(await page.locator('#industrySolution').getAttribute('open'),null);
      assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),q.id);
    }
    await page.goto(`${url}#industry/ops-001`);await page.locator('#industrySolution>summary').click();
    assert(await page.locator('#industryCode').isVisible());
    await page.evaluate(()=>{window.copiedText='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copiedText=text;}}});});
    await page.locator('[data-industry-copy="code"]').click();assert.equal(await page.evaluate(()=>window.copiedText),questions[0].code);
    assert(!(await page.locator('#industrySetup').isVisible()));
    await page.locator('.industry-try>summary').click();
    await page.locator('[data-industry-copy="setup"]').click();assert((await page.evaluate(()=>window.copiedText)).includes(questions[0].setup));
    await page.locator('#industrySave').click();await page.locator('#industryDone').click();await page.reload();
    assert.equal(await page.locator('#industrySave').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#industryDone').getAttribute('aria-pressed'),'true');
    await page.locator('.industry-back').click();await page.locator('#industryFilter').selectOption('saved');assert.equal(await page.locator('.industry-question').count(),1);
    await page.locator('#industryFilter').selectOption('done');assert.equal(await page.locator('.industry-question').count(),1);
    await page.locator('#industryFilter').selectOption('todo');assert.equal(await page.locator('#industryCount').textContent(),'299 questions found');
    await page.locator('#industryReset').click();
    const output=path.join(__dirname,'../test-results');fs.mkdirSync(output,{recursive:true});
    await page.screenshot({path:path.join(output,'industry-desktop.png'),fullPage:true});
    await page.goto(`${url}#industry/ops-264`);await page.locator('#industrySolution>summary').click();
    await page.screenshot({path:path.join(output,'industry-solution.png'),fullPage:true});
    for(const width of [390,768]){
      await page.setViewportSize({width,height:844});
      for(const id of ['', '/ops-001','/ops-142','/ops-264','/ops-300']){
        await page.goto(`${url}#industry${id}`);
        if(id)await page.locator('#industrySolution>summary').click();
        assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),`Overflow ${width}${id}`);
      }
    }
    await page.setViewportSize({width:390,height:844});await page.locator('#mobileView').selectOption('browse');await page.locator('#mobileView').selectOption('industry');
    assert(await page.locator('#industryView').isVisible());await page.screenshot({path:path.join(output,'industry-mobile.png'),fullPage:true});
    await page.goto(`${url}#industry/ops-999`);assert((await page.locator('#industryCount').textContent()).includes('not found'));
    await page.evaluate(()=>localStorage.setItem('unix-industry-practice-v1','{"done":"bad","saved":["ops-001","invalid"]}'));await page.reload();
    assert((await page.locator('.industry-progress').textContent()).includes('0 / 300 completed · 1 saved'));
    assert.deepEqual(errors,[]);console.log('PASS: all 300 question/solution/output/summary displays; search, categories, pagination, copy, saved/completed persistence, invalid routes and responsive layouts.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
