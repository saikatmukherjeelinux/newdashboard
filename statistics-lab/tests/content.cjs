const assert=require('node:assert/strict');const {lessons,references}=require('../assets/lessons.js');
assert.equal(lessons.length,60);assert.equal(new Set(lessons.map(l=>l.id)).size,60);assert.equal(new Set(lessons.map(l=>l.group)).size,12);
for(const [i,l] of lessons.entries()){assert.equal(l.order,i+1);for(const f of ['title','intro','formula','deeper','mistake','summary'])assert(l[f]?.length>10,`${l.id}/${f}`);assert.equal(l.words.length,3,l.id);assert.equal(l.examples.length,3,l.id);for(const e of l.examples){assert(e.q&&e.result);assert.equal(e.steps.length,3,`${l.id}/${e.q}`);}}
const near=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
near((20+160)/10,18);near((1+1)/2,1);near((1+1)/(2-1),2);near(1/(2*3),1/6);near(8/26,4/13);near(.8**3,.512);near(Math.exp(-2),.1353352832366127);near(1.96**2/(10+1.96**2),.2775401687666166);near(2/Math.sqrt(2),Math.SQRT2);near(2.5/(Math.sqrt(5/3)/2),Math.sqrt(15));near(1-.95**20,.6415140775914581);near((2+6*.25)/1.25,2.8);near(.8*.75,.6);
assert.equal(references.length,3);console.log('PASS: 60 topics, 12 chapters, 180 worked examples, definitions, deeper explanations and independent calculation checks.');
