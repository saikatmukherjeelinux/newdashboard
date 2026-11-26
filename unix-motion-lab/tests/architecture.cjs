const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const {chapters,docs}=require('../assets/architecture-data.js');
assert.equal(chapters.length,14);assert.equal(new Set(chapters.map(c=>c.id)).size,14);assert.equal(new Set(chapters.map(c=>c.image)).size,11);
for(const c of chapters){assert(c.intro.length>80);assert(c.sections.length>=2);assert(c.takeaway.length>30);assert(c.terms.length>=2);assert(docs[c.source]);for(const [title,text] of c.sections){assert(title);assert(text.length>70);}const svg=fs.readFileSync(path.join(__dirname,'../assets/architecture',c.image+'.svg'),'utf8');assert(svg.includes('<title'));assert(svg.includes('<desc'));assert(!svg.includes('<script'));if(c.example){assert(c.example.code);assert(c.example.output);assert(c.example.explanation.length>30);}}
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');const app=fs.readFileSync(path.join(__dirname,'../assets/app.js'),'utf8');
assert(!/id="(?:pipelineView|cardsView)"|data-view="(?:pipeline|cards)"/.test(html));assert(!/renderPipeline|renderCards|buildPipeline/.test(app));
assert.equal(chapters.find(c=>c.id==='command-journey').steps.length,8);
console.log('PASS: 14 architecture chapters, 11 accessible SVG illustrations, examples, public references, 8-step command journey; removed sections absent.');
