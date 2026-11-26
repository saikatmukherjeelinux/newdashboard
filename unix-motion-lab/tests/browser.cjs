const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.UML_PLAYWRIGHT_PATH || 'playwright');
const {lessons,quizzes:questions} = require('./load-content.cjs');
(async()=>{
  const browser = await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const url=pathToFileURL(path.resolve(__dirname,'../index.html')).href;
    await page.goto(url);assert.equal(await page.locator('.lesson-link').count(),lessons.length);
    assert(await page.locator('#browseView').isVisible());assert.equal(await page.locator('.command-card').count(),80);
    await page.locator('#collection').selectOption('expanded');assert.equal(await page.locator('.command-card').count(),28);
    await page.locator('#catalogSearch').fill('memory');assert((await page.locator('.command-card').count())>0);
    await page.locator('#catalogSearch').fill('doesnotexistzz');assert.equal(await page.locator('.command-card').count(),0);
    await page.locator('#clearFilters').click();assert.equal(await page.locator('.command-card').count(),80);
    await page.locator('#catalogTopic').selectOption('Network & services');assert.equal(await page.locator('.command-card').count(),3);await page.locator('#clearFilters').click();
    await page.locator('.path-options summary').click();await page.locator('[data-path="Start from zero"]').click();assert.equal(await page.locator('.command-card').count(),10);
    await page.locator('.command-card').first().click();await page.locator('#next').click();assert((await page.locator('#lesson h2').textContent()).includes('help'));
    await page.locator('[data-view="browse"]').click();await page.locator('#clearFilters').click();
    await page.locator('#menu').click();
    for(const l of lessons){await page.goto(`${url}#learn/${l.id}`);await page.waitForFunction(id=>document.querySelector('#lesson h2')?.textContent===window.UNIX_LESSONS.find(l=>l.id===id).title,l.id);assert.equal(await page.locator('.example').count(),3);assert.equal(await page.locator('.example > pre code').first().textContent(),l.examples[0].code);assert.equal(await page.locator('.beginner-steps li').count(),3);assert((await page.locator('.beginner-intro').textContent()).length>80);}
    await page.locator('#search').fill('nonexistenttermzz');assert.equal(await page.locator('.lesson-link').count(),0);
    await page.locator('#search').fill('pipefail');assert((await page.locator('.lesson-link').count())>0);await page.locator('#search').fill('');
    await page.goto(`${url}#learn/grep`);await page.locator('#bookmark').click();await page.locator('#complete').click();await page.reload();
    assert.equal(await page.locator('#bookmark').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#complete').getAttribute('aria-pressed'),'true');
    await page.locator('#filter').selectOption('saved');assert.equal(await page.locator('.lesson-link').count(),1);await page.locator('#filter').selectOption('all');
    await page.locator('#category').selectOption('Files & paths');assert.equal(await page.locator('.lesson-link').count(),9);await page.locator('#category').selectOption('all');
    await page.locator('[data-view="pipeline"]').click();await page.locator('#timeline').fill('4');assert.equal(await page.locator('#pipelineOutput').textContent(),'2');
    await page.locator('#pipelineInput').fill('b\na\nb\n');await page.locator('#pipelinePattern').fill('');await page.locator('#pipelineApply').click();await page.locator('#timeline').fill('3');assert.equal(await page.locator('#pipelineOutput').textContent(),'a\nb');
    await page.locator('#pipelineInput').fill('');await page.locator('#pipelineApply').click();await page.locator('#timeline').fill('4');assert.equal(await page.locator('#pipelineOutput').textContent(),'0');
    await page.locator('#pipelinePlay').click();assert.equal(await page.locator('#pipelinePlay').textContent(),'Pause');await page.locator('[data-view="cards"]').click();assert.equal(await page.locator('#pipelinePlay').textContent(),'Play');
    await page.locator('#cardDeck').selectOption('saved');assert((await page.locator('#cards h2').textContent()).includes('grep'));await page.locator('#revealCard').click();assert(await page.locator('.flash-answer').isVisible());
    await page.locator('[data-view="quiz"]').click();await page.locator('#quizLength').selectOption('all');await page.locator('#startQuiz').click();
    for(let i=0;i<questions.length;i++){
      const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('unix-motion-lab-v1')).quiz);const q=questions.find(q=>q.id===session.ids[session.index]);
      await page.locator(`[data-answer="${i%2 ? (q.answer+1)%4 : q.answer}"]`).click();assert.equal(await page.locator('.answer:disabled').count(),4);assert((await page.locator('.feedback').textContent()).includes(q.explanation));
      if(i===0){await page.reload();assert(await page.locator('.feedback').isVisible());}
      await page.locator('#quizNext').click();
    }
    assert.equal(await page.locator('.quiz-score').textContent(),`${Math.ceil(questions.length/2)} / ${questions.length}`);await page.locator('#retryMissed').click();
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('unix-motion-lab-v1')).quiz.ids.length),Math.floor(questions.length/2));
    await page.locator('#finishQuiz').click();await page.locator('#newQuiz').click();await page.locator('#quizCategory').selectOption('Start here');await page.locator('#startQuiz').click();assert((await page.locator('.quiz-meta').textContent()).includes('/ 2'));
    await page.locator('#theme').click();await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');await page.locator('#theme').click();
    const output=path.resolve(__dirname,'../test-results');fs.mkdirSync(output,{recursive:true});
    await page.locator('[data-view="browse"]').click();await page.screenshot({path:path.join(output,'catalog.png')});
    await page.goto(`${url}#learn/grep`);await page.screenshot({path:path.join(output,'desktop.png')});
    await page.locator('.reading-tools summary').click();await page.locator('#fontSize').click();await page.locator('#wrapCode').click();await page.reload();assert(await page.locator('body').evaluate(n=>n.classList.contains('large-text')&&n.classList.contains('wrap-code')));
    await page.locator('.reading-tools summary').click();await page.locator('#fontSize').click();await page.locator('#wrapCode').click();
    await page.locator('.glossary summary').click();assert.equal(await page.locator('.glossary dt').count(),20);
    await page.locator('#examples').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'examples.png')});
    await page.locator('[data-view="pipeline"]').click();await page.locator('#pipelineView').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'pipeline.png')});
    for(const width of [390,768]){
      await page.setViewportSize({width,height:844});
      for(const mode of ['browse','learn','pipeline','quiz','cards']){if(width<=760)await page.locator('#mobileView').selectOption(mode);else await page.locator(`[data-view="${mode}"]`).click();assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),`Overflow at ${width} / ${mode}`);}
    }
    await page.setViewportSize({width:390,height:844});await page.locator('#mobileView').selectOption('learn');
    if(await page.locator('#menu').getAttribute('aria-expanded')==='true')await page.locator('.sidebar-close').click();
    await page.screenshot({path:path.join(output,'mobile.png')});
    await page.locator('#menu').click();await page.locator('#lessonList a[href="#learn/ls"]').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'false');
    await page.goto(`${url}#learn/unknown`);assert((await page.locator('#lesson h2').textContent()).includes('shell'));
    // Corrupt persisted data must never prevent loading.
    await page.evaluate(()=>localStorage.setItem('unix-motion-lab-v1','{"done":"invalid","quiz":{"ids":[]}}'));await page.reload();assert.equal(await page.locator('.example').count(),3);
    await page.goto(pathToFileURL(path.resolve(__dirname,'../../index.html')).href);assert.equal(await page.locator('.labs > a').count(),3);assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)));
    await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:path.join(output,'dashboard.png')});
    assert.deepEqual(errors,[]);console.log(`PASS: ${lessons.length} beginner lessons; all ${questions.length} quiz paths; catalog search, new collection, guided sequence, glossary, reading preferences, retry/resume, filters, bookmarks, completion, themes, cards, pipeline, corrupt storage, dashboard and mobile layouts.`);
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
