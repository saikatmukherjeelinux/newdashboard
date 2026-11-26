const assert=require('node:assert/strict');
const {questions}=require('../assets/industry-data.js');
assert.equal(questions.length,300);
assert.equal(new Set(questions.map(q=>q.id)).size,300);
assert.equal(new Set(questions.map(q=>q.title)).size,300);
assert.equal(new Set(questions.map(q=>q.code)).size,300);
const categories=[...new Set(questions.map(q=>q.category))];
assert.equal(categories.length,15);
for(const category of categories)assert.equal(questions.filter(q=>q.category===category).length,20);
questions.forEach((q,i)=>{
  assert.equal(q.id,`ops-${String(i+1).padStart(3,'0')}`);assert.equal(q.number,i+1);
  for(const field of ['title','question','code','summary','environment','caveat','source'])assert(typeof q[field]==='string'&&q[field].trim().length>0,`${q.id}: ${field}`);
  for(const field of ['introduction','simpleExplanation','topic'])assert(q[field].length>8,`${q.id}: missing plain-language ${field}`);
  assert(q.question.startsWith('Your task: '));
  assert.equal(q.steps.length,3);q.steps.forEach(s=>assert(s.length>30,`${q.id}: explanation too short`));
  assert(q.commands.length>0,`${q.id}: command guide missing`);
  for(const command of q.commands){assert(command.meaning.length>5);for(const flag of command.flags)assert(flag.flag&&flag.meaning.length>5);}
  assert(Array.isArray(q.commandSyntax));assert(Array.isArray(q.setupCommands));
  assert.equal(typeof q.output,'string');assert.equal(typeof q.variable,'boolean');assert.equal(typeof q.setup,'string');
  assert(q.source.startsWith('https://'));assert(!q.code.includes('\r'));assert(!q.code.includes('\0'));
});
assert.equal(questions.filter(q=>q.variable).length,63);
console.log('PASS: 300 distinct questions; 15 topics × 20; 900 explanation steps; 300 summaries; 237 fixed-output exercises and 63 illustrative host/identity examples.');

const flags=(n,name)=>questions[n-1].commands.find(c=>c.name===name).flags.map(f=>f.flag);
assert.deepEqual(flags(19,'grep'),['-n','-C1']);
assert.deepEqual(flags(185,'ss'),['-l','-t','-n','-p']);
assert.deepEqual(flags(225,'tar'),['-c','-f','-x','-O']);
assert.deepEqual(flags(280,'grep'),['-F','-x','-q']);
assert(questions[16].commandSyntax.some(x=>x.symbol==='key=$1 "/" $2'));
assert(!questions[0].commandSyntax.some(x=>x.symbol==='> file'));
assert(!questions[135].commandSyntax.some(x=>x.symbol==='$(command)'));
assert(!questions[48].commandSyntax.some(x=>x.symbol==='d action (sed)'));
assert(questions[42].commandSyntax.some(x=>x.symbol==='d action (sed)'));
console.log('PASS: every answer has command and option explanations; combined flags and shell/awk symbol distinctions checked.');
