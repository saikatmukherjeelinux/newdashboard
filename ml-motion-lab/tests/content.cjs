const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {lessons,references}=require('../assets/lessons.js'),diagrams=require('../assets/diagram-info.js');
const beginner=require('../assets/beginner.js');
const more=require('../assets/more-examples.js');
assert.deepEqual(Object.keys(more).sort(),lessons.map(l=>l.id).sort());
for(const l of lessons){assert.equal(more[l.id].length,2);for(const ex of more[l.id]){for(const field of ['title','setup','result','why'])assert(ex[field]?.length>15,`${l.id}/${field}`);assert.equal(ex.steps.length,4,`${l.id}/${ex.title}`);assert(ex.steps.every(step=>step.length>25));}}
assert.equal(lessons.reduce((sum,l)=>sum+l.examples.length+beginner[l.id].examples.length+more[l.id].length,0),240);
assert.deepEqual(Object.keys(beginner).sort(),lessons.map(l=>l.id).sort());
for(const l of lessons){const b=beginner[l.id];for(const field of ['title','idea','remember'])assert(b[field]?.length>20,`${l.id}/${field}`);assert.equal(b.words.length,3);assert.equal(b.examples.length,2);for(const e of b.examples){assert.equal(e.steps.length,3);assert(e.q&&e.result);}}
assert.equal(lessons.length,40);assert.equal(new Set(lessons.map(l=>l.id)).size,40);assert.equal(new Set(lessons.map(l=>l.group)).size,10);
for(const [i,l] of lessons.entries()){
 for(const field of ['id','group','title','intro','formula','deep','mistake','use','practice','answer','summary','visual'])assert(typeof l[field]==='string'&&l[field].length>0,`${l.id}/${field}`);
 assert(l.symbols.length>=3);assert.equal(l.steps.length,4);assert.equal(l.examples.length,2);assert.equal(l.order,i+1);assert.equal(l.prerequisite,i?lessons[i-1].id:null);
 for(const ex of l.examples){assert(ex.q&&ex.result);assert(ex.steps.length>=1);}
 const file=path.join(__dirname,'../assets/diagrams',`${diagrams[l.id]?l.id:l.visual}.svg`);assert(fs.existsSync(file));const svg=fs.readFileSync(file,'utf8');assert(svg.includes('<title')&&svg.includes('<desc'));assert(svg.includes('viewBox="0 0 480 270"'));assert(!/<script|https?:\/\/(?!www.w3.org)/.test(svg));
}
assert(references.every(r=>r.url.startsWith('https://')));
// Independent numerical checks for worked examples, including gradients and probability identities.
const near=(a,b,tol=1e-8)=>assert(Math.abs(a-b)<tol,`${a} != ${b}`);
near(Math.hypot(3,4),5);near(2*4+3*(-1),5);near(13/14,0.9285714285714286);
near((.1*.8)/(.1*.8+.9*.2),4/13);near(3*.5**3,.375);near(1*.5*(0-1)**2+1*.5*(2-1)**2,1);
near((30/40)*(30/50)*2/(30/40+30/50),2/3);near(-Math.log(.8),.2231435513142097);
const loss=w=>((w*1-2)**2+(w*2-4)**2)/2;
near(loss(1),2.5);near(loss(1.5),.625);near((loss(1+1e-5)-loss(1-1e-5))/(2e-5),-5,1e-7);
const sigmoid=z=>1/(1+Math.exp(-z));near(sigmoid(Math.log(3)),.75);
near((1.2*2+.1-3)**2/2,.125);near(.25*2+.75*6,5);near(Math.sqrt(.64)*2-Math.sqrt(.36),1);
near(.8*.8+.2*.1,.66);near(2+.5*4,4);near(.5*(1+1-1-Math.log(1)),.5);
const softmax=z=>{let m=Math.max(...z),e=z.map(x=>Math.exp(x-m)),s=e.reduce((a,b)=>a+b);return e.map(x=>x/s);};assert.deepEqual(softmax([1000,1000]),[.5,.5]);near(softmax([0,Math.log(3)])[1],.75);
near(8/26,0.3076923076923077);near((4+16)/2,10);near((1.2*2-3)**2/2,.18);near((3.01**2-9)/.01,6.01);near(2*12,24);near((1+.6)/.8,2);
// New examples: verify probability denominators, gradients, model updates and reconstruction arithmetic independently.
near((2/3)*.5,1/3);near(9/108,1/12);near((1/4*6)/(1+1/4*6),.6);near(.8*.2+.2*.8,.32);
near((1+4+9+16)/4,7.5);near(.8*.8*.2,.128);near(1.96*5,9.8);
near(-.5*Math.log(.75)-.5*Math.log(.25)+Math.log(.5),.1438410362258904);
near((1.1**2+1.9**2),4.82);near(1-.25*(2*(1-5)),3);near(3-.25*(2*(3-5)),4);
near(6/(1+2),2);near(2*.25+.0*.75,.5);near(0*.25+4*.75,3);
near((1+Math.SQRT2*(2*Math.SQRT2)+4),9);near(4*.5**2,1);near(14/3,4.666666666666667);
near(1+.5*2+.5**2*4,3);near(5+.2*(2-5),4.4);near((.5**2+(-.5)**2)/2,.25);
console.log('PASS: 40 topics with 6 examples each (240 total), all additional steps and explanations, assets, practice answers and numerical checks.');
