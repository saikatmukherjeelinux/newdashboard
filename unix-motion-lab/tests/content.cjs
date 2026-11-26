const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {lessons, quizzes} = require('./load-content.cjs');
const {guides, glossary}=require('../assets/beginners.js');
assert.equal(lessons.length, 80);
assert.equal(lessons.filter(l=>l.collection==='expanded').length,28);
assert.equal(Object.keys(guides).length,lessons.length);
assert(glossary.length>=20);
assert.equal(new Set(lessons.map(l=>l.id)).size, lessons.length);
for (const lesson of lessons) {
  for (const field of ['id','group','title','summary','syntax','detail','pitfall','platform']) assert(lesson[field]?.length, `${lesson.id}: ${field}`);
  assert(lesson.flags.length >= 2, lesson.id);
  for (const flag of lesson.flags) assert(flag.flag && flag.meaning);
  assert.equal(lesson.examples.length, 3, lesson.id);
  for (const example of lesson.examples) {
    for (const field of ['title','code','output','explanation']) assert(example[field]?.length, `${lesson.id}: example ${field}`);
    assert.equal(typeof example.variable, 'boolean');
  }
  assert(lesson.source[1].startsWith('https://'));
  assert(guides[lesson.id].plain.length>50,lesson.id);
  assert(guides[lesson.id].when.length>20,lesson.id);
  assert.equal(guides[lesson.id].steps.length,3,lesson.id);
}
assert.equal(quizzes.length, lessons.length);
assert.equal(new Set(quizzes.map(q=>q.id)).size, quizzes.length);
assert.equal(new Set(quizzes.map(q=>q.lesson)).size, lessons.length);
for (const q of quizzes) {
  assert(lessons.some(l=>l.id===q.lesson));
  assert.equal(q.options.length, 4); assert.equal(new Set(q.options).size, 4);
  assert(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
  assert(q.explanation.length > 20);
}
const root = path.resolve(__dirname,'..');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (/^https?:/.test(match[1])) continue;
  assert(fs.existsSync(path.resolve(root,match[1])), `Missing local asset: ${match[1]}`);
}
assert(fs.readFileSync(path.join(root,'..','index.html'),'utf8').includes('unix-motion-lab/index.html'));
console.log(`PASS: ${lessons.length} complete lessons, ${lessons.length*3} examples, ${quizzes.length} linked quiz questions and all local links.`);
