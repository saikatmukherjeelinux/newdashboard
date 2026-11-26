/* Static, offline learning UI. No shell commands are executed by this app. */
(() => {
  'use strict';
  const lessons = window.UNIX_LESSONS, questions = window.UNIX_QUIZZES;
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key = 'unix-motion-lab-v1';
  let saved;
  try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch { saved = {}; }
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
  const validIds = new Set(lessons.map(l => l.id));
  const cleanIds = ids => Array.isArray(ids) ? [...new Set(ids.filter(id => validIds.has(id)))] : [];
  const state = {done: cleanIds(saved.done), bookmarks: cleanIds(saved.bookmarks), theme: saved.theme === 'light' ? 'light' : 'dark', largeText: saved.largeText === true, wrapCode: saved.wrapCode === true,
    indexHidden: typeof saved.indexHidden === 'boolean' ? saved.indexHidden : true,
    attempts: Array.isArray(saved.attempts) ? saved.attempts.filter(a => a && Number.isInteger(a.score) && Number.isInteger(a.total) && typeof a.date === 'string').slice(-10) : []};
  let current = lessons.find(l => l.id === saved.last) || lessons[0], view = 'browse', quiz = null, cardIndex = 0, cardFilter = 'all', revealed = false;
  const paths = [
    {name:'Start from zero', text:'Your first steps in the terminal.', ids:['shell','help','pwd','cd','ls','cat','mkdir','cp','quoting','pipes']},
    {name:'Find & process text', text:'Search logs and turn records into answers.', ids:['grep','regex','find','sort','uniq','cut','sed','awk','join','comm']},
    {name:'Handle files confidently', text:'Navigate, inspect, package and copy.', ids:['basename','dirname','realpath','file-stat','chmod','tar','gzip','zip','rsync','temp']},
    {name:'Troubleshoot a machine', text:'Inspect resources, processes and services.', ids:['ps','top','free','disk','lsof','network','dig','systemctl','journalctl','timeout']},
    {name:'Write useful scripts', text:'Build repeatable workflows in small steps.', ids:['status','env','read','loops','conditions','functions','getopts','scripts']}
  ];
  let activePath = 'all';
  const searchIndex = new Map(lessons.map(l=>[l.id, JSON.stringify([l,window.UNIX_BEGINNERS[l.id]]).toLowerCase()]));
  const modes = ['browse','learn','pipeline','quiz','cards','industry'];
  const browseTab = document.createElement('button'); browseTab.dataset.view='browse'; browseTab.textContent='Command catalog'; browseTab.setAttribute('aria-pressed','false'); document.querySelector('.modes').prepend(browseTab);
  const mobileMode=document.createElement('select');mobileMode.id='mobileView';mobileMode.setAttribute('aria-label','Choose learning section');mobileMode.innerHTML=modes.map((v,i)=>`<option value="${v}">${['Command catalog','Read a lesson','Pipeline practice','Quiz','Flashcards','Industry practice'][i]}</option>`).join('');document.querySelector('.toolbar').append(mobileMode);
  const browse = document.createElement('section'); browse.id='browseView'; browse.hidden=true;
  browse.innerHTML=`<div class="section-heading"><p class="eyebrow">FIND YOUR NEXT COMMAND</p><h2>What would you like to do?</h2><p>Choose a guided path, explore the new additions, or search for a command or task.</p></div><div class="resume-panel"><div><strong id="resumeTitle"></strong><p id="resumeText"></p></div><button class="primary" id="resumeLesson">Continue learning</button></div><div id="learningPaths" class="learning-paths"></div><div class="catalog-toolbar"><label for="catalogSearch">Search all commands, flags & examples<input type="search" id="catalogSearch" placeholder="Try backup, memory, -n, or read a file…"></label><label for="collection">Collection<select id="collection"><option value="all">All 80 lessons</option><option value="expanded">28 new lessons</option><option value="starter">First steps</option></select></label></div><div class="catalog-status"><p id="catalogCount" role="status"></p><button id="clearFilters">Clear filters</button></div><div id="catalog" class="catalog-grid"></div>`;
  $('learnView').before(browse);
  browse.insertAdjacentHTML('afterbegin','<a class="industry-home-link" href="#industry"><strong>Industry practice · 300 coding questions</strong><span>Realistic tasks, worked solutions, outputs and a summary for every question.</span></a>');
  const sidebarReset=document.createElement('button');sidebarReset.id='resetFilters';sidebarReset.textContent='Reset filters';$('filter').after(sidebarReset);
  const closeIndex=document.createElement('button');closeIndex.className='sidebar-close';closeIndex.textContent='Close commands';$('sidebar').prepend(closeIndex);
  const backdrop=document.createElement('button');backdrop.className='backdrop';backdrop.setAttribute('aria-label','Close command index');document.body.append(backdrop);
  function closeSidebar(){state.indexHidden=true;updateIndex();persist();$('menu').focus();}
  closeIndex.onclick=closeSidebar;backdrop.onclick=closeSidebar;
  // Keep the home page small: one starting point, search, and an optional guided path.
  document.querySelector('.hero').innerHTML=`<p class="eyebrow">UNIX, ONE SMALL STEP AT A TIME</p><h1>Learn the command line.</h1><p>${lessons.length} plain-language lessons. ${lessons.reduce((n,l)=>n+l.examples.length,0)} examples with explained outputs.<br>New to Unix? Start with the shell. No experience needed.</p><a class="start-link" href="#learn/shell">Start with the basics</a>`;
  $('collection').insertAdjacentHTML('beforeend','<option value="deep">40 new in-depth examples</option>');
  const pathDetails=document.createElement('details');pathDetails.className='path-options';pathDetails.innerHTML='<summary>Or choose a guided learning path</summary>';$('learningPaths').before(pathDetails);pathDetails.append($('learningPaths'));
  const catalogTopic=document.createElement('label');catalogTopic.setAttribute('for','catalogTopic');catalogTopic.innerHTML='Topic<select id="catalogTopic"></select>';document.querySelector('.catalog-toolbar').append(catalogTopic);
  let pipelineStep = 0, pipelineFrames = [], playTimer = null;
  const fixture = `# Run in Bash on Linux / WSL. Creates a fresh practice directory.
lab_dir=$(mktemp -d /tmp/unix-motion-lab.XXXXXX) || exit 1
cd "$lab_dir" || exit 1
export LC_ALL=C
mkdir docs
printf 'Ada\\nLinus\\nAda\\nGrace\\n' > names.txt
printf 'name,age\\nAda,36\\nLinus,54\\nGrace,85\\n' > people.csv
printf 'INFO start\\nERROR disk\\nWARN memory\\nERROR network\\nINFO done\\n' > logs.txt
printf 'Read the manual.\\n' > docs/guide.txt
touch .hidden
printf 'Practice directory: %s\\n' "$PWD"`;
  $('setupCode').textContent = fixture;
  function persist() {
    try { localStorage.setItem(key, JSON.stringify({...state, last: current.id, quiz})); }
    catch { toast('Browser storage is unavailable; progress remains in this session.'); }
  }
  function toast(message) { $('toast').textContent = message; $('toast').classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => $('toast').classList.remove('show'), 3000); }
  async function copy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const input = document.createElement('textarea'); input.value = text; input.style.position = 'fixed'; input.style.top = '-10000px'; document.body.append(input); input.select();
        const ok = document.execCommand('copy'); input.remove(); if (!ok) throw new Error('copy blocked');
      }
      toast('Copied commands.');
    } catch { toast('Copy is unavailable. Select the code and copy it manually.'); }
  }
  function updateTheme() { document.documentElement.dataset.theme = state.theme; $('theme').textContent = state.theme === 'dark' ? 'Light theme' : 'Dark theme'; }
  function updateIndex() { document.body.classList.toggle('index-hidden', state.indexHidden); $('menu').setAttribute('aria-expanded', String(!state.indexHidden)); $('menu').textContent = state.indexHidden ? 'Find a command' : 'Hide commands';const modal=matchMedia('(max-width:760px)').matches&&!state.indexHidden;$('content').inert=modal;document.querySelector('.topbar').inert=modal; }
  matchMedia('(max-width:760px)').addEventListener('change',e=>{if(e.matches)state.indexHidden=true;updateIndex();});
  const groups = [...new Set(lessons.map(l => l.group))];
  $('category').innerHTML += groups.map(g => `<option value="${escape(g)}">${escape(g)}</option>`).join('');
  $('catalogTopic').innerHTML=$('category').innerHTML;
  function readingPreferences() {
    document.body.classList.toggle('large-text',state.largeText);document.body.classList.toggle('wrap-code',state.wrapCode);
    $('fontSize').setAttribute('aria-pressed',String(state.largeText));$('wrapCode').setAttribute('aria-pressed',String(state.wrapCode));
  }
  function readingMinutes(l) {return Math.max(3,Math.ceil(JSON.stringify([l,window.UNIX_BEGINNERS[l.id]]).split(/\s+/).length/170));}
  function renderCatalog() {
    const matches=filteredLessons();
    $('catalogTopic').value=$('category').value;
    $('catalogCount').textContent=`${matches.length} lessons found${activePath==='all'?'':` · ${paths.find(p=>p.name===activePath).name}`}`;
    $('resumeTitle').textContent=state.done.length ? 'Keep your momentum' : 'A good place to begin';
    $('resumeText').textContent=`${current.title} · ${state.done.length} of ${lessons.length} lessons completed`;
    $('learningPaths').innerHTML=paths.map(p=>`<button class="path-card" data-path="${escape(p.name)}" aria-pressed="${activePath===p.name}"><strong>${escape(p.name)}</strong><span>${escape(p.text)}</span><small>${p.ids.filter(id=>state.done.includes(id)).length} / ${p.ids.length} completed</small></button>`).join('');
    $('learningPaths').querySelectorAll('[data-path]').forEach(b=>b.onclick=()=>{
      activePath=activePath===b.dataset.path?'all':b.dataset.path;$('category').value='all';$('collection').value='all';$('filter').value='all';$('search').value='';$('catalogSearch').value='';renderList();
    });
    $('catalog').innerHTML=matches.length ? matches.map(l=>`<a class="command-card" href="#learn/${l.id}"><div class="card-labels"><span>${escape(l.group)}</span>${l.collection==='expanded'?'<span class="new-label">NEW</span>':''}</div><h3>${escape(l.title)}</h3><p>${escape(l.summary)}</p><div class="card-labels"><span>${readingMinutes(l)} min · ${l.examples.length} examples</span><span>${state.done.includes(l.id)?'✓ Completed':state.bookmarks.includes(l.id)?'★ Saved':'Read lesson'}</span></div></a>`).join('') : '<div class="panel empty"><h3>No matching commands</h3><p>Try a shorter search, another topic, or Clear filters above.</p></div>';
  }
  function filteredLessons() {
    const term = $('search').value.trim().toLowerCase(), category = $('category').value, filter = $('filter').value;
    const collection=$('collection').value, path=paths.find(p=>p.name===activePath);
    return lessons.filter(l => (category === 'all' || l.group === category) && (!path || path.ids.includes(l.id)) &&
      (collection!=='expanded' || l.collection==='expanded') && (collection!=='starter' || paths[0].ids.includes(l.id)) && (collection!=='deep' || l.examples.some(e=>e.collection==='deep')) &&
      (filter !== 'saved' || state.bookmarks.includes(l.id)) && (filter !== 'done' || state.done.includes(l.id)) && (filter !== 'unfinished' || !state.done.includes(l.id)) &&
      (!term || term.split(/\s+/).every(word=>searchIndex.get(l.id).includes(word)))).sort((a,b)=>path?path.ids.indexOf(a.id)-path.ids.indexOf(b.id):0);
  }
  function renderList() {
    const matches = filteredLessons();
    $('count').textContent = `${matches.length} / ${lessons.length}`;
    $('progressText').textContent = `${state.done.length} / ${lessons.length}`;
    $('progress').max = lessons.length; $('progress').value = state.done.length;
    $('lessonList').innerHTML = matches.length ? groups.map(group => {
      const items = matches.filter(l => l.group === group);
      return items.length ? `<div class="nav-group">${escape(group)}</div>${items.map(l => `<a class="lesson-link" href="#learn/${l.id}" ${current.id === l.id ? 'aria-current="page"' : ''}>${state.done.includes(l.id) ? '✓ ' : ''}${escape(l.title)}${state.bookmarks.includes(l.id) ? ' ★' : ''}</a>`).join('')}` : '';
    }).join('') : '<p class="empty">No matching lessons. Try another search or reset the filters.</p>';
    $('lessonList').querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (matchMedia('(max-width:760px)').matches) { state.indexHidden = true; updateIndex(); persist(); }
    }));
    renderCatalog();
  }
  function renderLesson() {
    const l = current, beginner=window.UNIX_BEGINNERS[l.id];
    $('lesson').innerHTML = `<div class="eyebrow">${escape(l.group)}</div><h2>${escape(l.title)}</h2><p>${escape(l.summary)}</p><span class="badge">${escape(l.platform)}</span>
      <div class="lesson-actions"><div><button id="bookmark" aria-pressed="${state.bookmarks.includes(l.id)}">${state.bookmarks.includes(l.id) ? 'Bookmarked' : 'Bookmark'}</button><button id="complete" aria-pressed="${state.done.includes(l.id)}">${state.done.includes(l.id) ? 'Completed' : 'Mark completed'}</button></div><a href="#examples">Jump to examples</a></div>
      <nav class="lesson-jumps" aria-label="Jump within lesson"><button data-jump="lessonBasics">Overview</button><button data-jump="lessonFlags">Flags</button><button data-jump="examples">Examples & outputs</button><button data-jump="lessonTakeaway">Takeaway</button></nav>
      <div class="beginner-intro"><h3 id="lessonBasics" tabindex="-1">What does this mean?</h3><p>${escape(beginner.plain)}</p><h4>When would I use it?</h4><p>${escape(beginner.when)}</p></div>
      <details class="more-detail"><summary>A little more detail</summary><p>${escape(l.detail)}</p></details>
      <details class="glossary"><summary>New words? Read the simple definitions</summary><dl>${window.UNIX_GLOSSARY.map(([term,definition])=>`<dt>${escape(term)}</dt><dd>${escape(definition)}</dd>`).join('')}</dl></details>
      <h3>How to write it</h3><pre><code>${escape(l.syntax)}</code></pre><p class="muted syntax-help">This line shows the general shape. Square brackets [ ] mean an optional part; do not type those brackets. Copy a complete example below when you are ready to try it.</p>
      <h3 id="lessonFlags" tabindex="-1">Flags, operands & syntax explained</h3><p class="muted">Practical options used in this lesson, plus common variants. Consult the linked manual for every option supported by your installed version.</p><div class="table-wrap"><table><thead><tr><th scope="col">Option / syntax</th><th scope="col">Meaning</th></tr></thead><tbody>${l.flags.map(f => `<tr><td><code>${escape(f.flag)}</code></td><td>${escape(f.meaning)}</td></tr>`).join('')}</tbody></table></div>
      <h3>Common mistake</h3><p class="note">${escape(l.pitfall)}</p><h3 id="examples">Worked examples</h3><p class="muted">Each example starts independently after the practice setup above. Read the command, compare the output, then follow the explanation.</p>
      ${l.examples.map((e,i) => `<section class="example"><h3>${i+1}. ${escape(e.title)}</h3><div class="code-head"><span>COMMAND TO TYPE</span><button data-copy="${i}" aria-label="Copy example ${i+1}">Copy command</button></div><pre><code>${escape(e.code)}</code></pre><div class="code-head"><span>${e.variable ? 'SAMPLE RESULT · YOUR RESULT CAN DIFFER' : 'EXPECTED RESULT · WITH THE PRACTICE FILES'}</span></div><pre class="output"><code>${escape(e.output)}</code></pre>${i===0?`<h4>Let’s read this one step at a time</h4><ol class="beginner-steps">${beginner.steps.map(step=>`<li>${escape(step)}</li>`).join('')}</ol>`:''}<h4>Why do we get this result?</h4><p>${escape(e.explanation)}</p></section>`).join('')}
      <div class="takeaway" id="lessonTakeaway" tabindex="-1"><strong>Remember this</strong><p>${escape(l.summary)}</p><a href="${escape(l.source[1])}" target="_blank" rel="noopener noreferrer">Reference: ${escape(l.source[0])}</a></div>`;
    $('readingMeta').textContent=`Lesson ${lessons.indexOf(l)+1} / ${lessons.length} · about ${readingMinutes(l)} min`;
    $('lesson').querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{$(b.dataset.jump).scrollIntoView({block:'start'});$(b.dataset.jump).focus({preventScroll:true});});
    $('bookmark').onclick = () => toggle('bookmarks'); $('complete').onclick = () => toggle('done');
    $('lesson').querySelectorAll('[data-copy]').forEach(b => b.onclick = () => copy(l.examples[Number(b.dataset.copy)].code));
    // Extra reasoning is progressively disclosed so five-example lessons stay readable.
    $('lesson').querySelectorAll('.example').forEach((section,i)=>{
      const e=l.examples[i];section.id=`example-${i+1}`;
      if(e.collection!=='deep')return;
      section.classList.add('deep-example');
      const scenario=document.createElement('p');scenario.className='example-scenario';scenario.innerHTML=`<span class="badge">NEW · IN-DEPTH PRACTICE</span><br><strong>The task:</strong> ${escape(e.scenario)}`;section.querySelector('h3').after(scenario);
      const reasoning=section.querySelector('h4');
      reasoning.textContent='Follow the reasoning, one step at a time';
      const summary=reasoning.nextElementSibling;const list=document.createElement('ol');list.className='deep-steps';list.innerHTML=e.steps.map(s=>`<li>${escape(s)}</li>`).join('');summary.replaceWith(list);
      const detail=document.createElement('details');detail.className='example-input example-flags';detail.innerHTML=`<summary>Every option and symbol used here</summary><dl>${e.flags.map(f=>`<dt><code>${escape(f.flag)}</code></dt><dd>${escape(f.meaning)}</dd>`).join('')}</dl>`;section.append(detail);
      const mistake=document.createElement('p');mistake.className='note';mistake.innerHTML=`<strong>Watch out:</strong> ${escape(e.pitfall)}`;section.append(mistake);
      const challenge=document.createElement('div');challenge.className='example-challenge';challenge.innerHTML=`<h4>Check your understanding</h4><p>${escape(e.challenge.question)}</p><details><summary>Show the answer</summary><p>${escape(e.challenge.answer)}</p></details>`;section.append(challenge);
    });
    if(l.examples.some(e=>e.collection==='deep')){
      const jump=document.createElement('a');jump.href='#example-4';jump.textContent='Go to the 2 new in-depth examples';jump.className='deep-jump';jump.onclick=event=>{event.preventDefault();$('example-4').scrollIntoView({block:'start'});};$('examples').after(jump);
    }
    const inputs={'names.txt':'Ada\nLinus\nAda\nGrace','people.csv':'name,age\nAda,36\nLinus,54\nGrace,85','logs.txt':'INFO start\nERROR disk\nWARN memory\nERROR network\nINFO done','docs/guide.txt':'Read the manual.'};
    $('lesson').querySelectorAll('.example').forEach((section,i)=>{
      const files=Object.entries(inputs).filter(([name])=>l.examples[i].code.includes(name));
      if(!files.length)return;
      const details=document.createElement('details');details.className='example-input';details.innerHTML='<summary>What is in the starting file?</summary><p>These are the initial contents from the practice setup. Any changes shown in this example happen afterward.</p>'+files.map(([name,contents])=>`<h4>${escape(name)}</h4><pre><code>${escape(contents)}\n</code></pre>`).join('');
      section.querySelector('.code-head').before(details);
    });
    // Keep example jumps within the lesson route rather than replacing the deep link.
    $('lesson').querySelector('a[href="#examples"]').onclick = event => { event.preventDefault(); $('examples').scrollIntoView({block:'start'}); };
    const sequence=filteredLessons(), index=sequence.findIndex(item=>item.id===l.id);
    $('previous').disabled = index <= 0; $('next').disabled = index < 0 || index===sequence.length-1;
    $('nextUnfinished').disabled=!sequence.some(item=>item.id!==l.id && !state.done.includes(item.id));
  }
  function toggle(field) { state[field] = state[field].includes(current.id) ? state[field].filter(id => id !== current.id) : [...state[field], current.id]; persist(); renderLesson(); renderList(); }
  function navigate(id) { location.hash = `learn/${id}`; }
  function stopPlay() { clearTimeout(playTimer); playTimer = null; $('pipelinePlay').textContent = 'Play'; }
  function route() {
    const [mode, id] = location.hash.slice(1).split('/');
    view = modes.includes(mode) ? mode : 'browse';
    if (view === 'learn' && id) current = lessons.find(l => l.id === id) || lessons[0];
    stopPlay();
    for (const v of modes) $(`${v}View`).hidden = v !== view;
    document.querySelector('.hero').hidden=view!=='browse';
    document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    $('mobileView').value=view;
    if (view === 'learn') renderLesson();
    if (view === 'pipeline') renderPipeline();
    if (view === 'quiz') renderQuiz();
    if (view === 'cards') renderCards();
    if (view === 'industry') window.UnixIndustry.render(id);
    renderList(); persist();
  }
  function stepLesson(delta) {const sequence=filteredLessons(), index=sequence.findIndex(l=>l.id===current.id);if(sequence[index+delta])navigate(sequence[index+delta].id);}
  $('previous').onclick = () => stepLesson(-1);$('next').onclick = () => stepLesson(1);
  $('nextUnfinished').onclick=()=>{const sequence=filteredLessons(),i=sequence.findIndex(l=>l.id===current.id);const next=[...sequence.slice(i+1),...sequence.slice(0,i+1)].find(l=>l.id!==current.id&&!state.done.includes(l.id));if(next)navigate(next.id);};
  function refreshFilters(){$('catalogTopic').value=$('category').value;renderList();if(view==='learn')renderLesson();}
  $('search').oninput = () => {$('catalogSearch').value=$('search').value;refreshFilters();};
  $('catalogSearch').oninput=()=>{$('search').value=$('catalogSearch').value;refreshFilters();};
  $('category').onchange=refreshFilters;$('filter').onchange=refreshFilters;$('collection').onchange=refreshFilters;
  $('catalogTopic').onchange=()=>{$('category').value=$('catalogTopic').value;refreshFilters();};
  function clearFilters(){activePath='all';for(const id of ['category','filter','collection'])$(id).value='all';$('search').value='';$('catalogSearch').value='';refreshFilters();}
  $('clearFilters').onclick=clearFilters;$('resetFilters').onclick=clearFilters;
  $('resumeLesson').onclick=()=>navigate(current.id);
  $('fontSize').onclick=()=>{state.largeText=!state.largeText;readingPreferences();persist();};
  $('wrapCode').onclick=()=>{state.wrapCode=!state.wrapCode;readingPreferences();persist();};
  $('showSetup').onclick=()=>{const setup=document.querySelector('.setup');setup.open=true;setup.scrollIntoView({block:'start'});setup.querySelector('summary').focus();};
  $('theme').onclick = () => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; updateTheme(); persist(); };
  $('menu').onclick = () => { state.indexHidden = !state.indexHidden; updateIndex();if(!state.indexHidden)$('search').focus(); persist(); };
  $('copySetup').onclick = () => copy(fixture);
  document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => { location.hash = b.dataset.view === 'learn' ? `learn/${current.id}` : b.dataset.view; });
  $('mobileView').onchange=()=>{location.hash=$('mobileView').value==='learn'?`learn/${current.id}`:$('mobileView').value;};
  window.addEventListener('hashchange', () => {route();window.scrollTo(0,0);if(view==='learn')$('lesson').focus({preventScroll:true});});
  document.addEventListener('keydown', e => { if (e.key === '/' && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); state.indexHidden = false; updateIndex(); $('search').focus(); } });
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && matchMedia('(max-width:760px)').matches){state.indexHidden=true;updateIndex();$('menu').focus();persist();}});
  document.addEventListener('keydown',e=>{if(e.key==='Tab' && matchMedia('(max-width:760px)').matches&&!state.indexHidden){const nodes=[...$('sidebar').querySelectorAll('button,input,select,a')].filter(n=>!n.disabled);const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});

  function buildPipeline() {
    stopPlay();
    const raw = $('pipelineInput').value.replace(/\r\n?/g,'\n');
    let lines = raw ? raw.split('\n') : []; if (raw.endsWith('\n')) lines.pop();
    if (lines.length > 200) { toast('Use at most 200 lines.'); return; }
    const pattern = $('pipelinePattern').value, matched = lines.filter(l => l.includes(pattern)), sorted = [...matched].sort(), unique = sorted.filter((l,i) => i === 0 || l !== sorted[i-1]);
    pipelineFrames = [
      {label:'input', lines, detail:'Start with newline-terminated records supplied in the input area.'},
      {label:'grep -F', lines:matched, detail:`Select lines containing the literal text ${JSON.stringify(pattern)}. ${matched.length} of ${lines.length} records match. A real grep exits 1 when none match.`},
      {label:'sort', lines:sorted, detail:'Sort matching lines lexically. For ASCII input this mirrors LC_ALL=C sort. Equal lines become adjacent.'},
      {label:'uniq', lines:unique, detail:`Collapse adjacent duplicate records. ${unique.length} distinct matching lines remain.`},
      {label:'wc -l', lines:[String(unique.length)], detail:'Count the newline-terminated records from uniq. The result is a count of unique matching lines, not a count of original occurrences.'}
    ];
    pipelineStep = 0; renderPipeline();
  }
  function renderPipeline() {
    if (!pipelineFrames.length) return;
    $('pipelineStages').innerHTML = pipelineFrames.map((f,i) => `<button data-stage="${i}" aria-pressed="${i === pipelineStep}">${escape(f.label)}</button>`).join('');
    $('pipelineStages').querySelectorAll('button').forEach(b => b.onclick = () => { stopPlay(); pipelineStep = Number(b.dataset.stage); renderPipeline(); });
    const frame = pipelineFrames[pipelineStep]; $('pipelineOutput').textContent = frame.lines.length ? frame.lines.join('\n') : '(no output)';
    $('pipelineStatus').textContent = `Stage ${pipelineStep+1} / 5 · ${frame.detail}`;
    $('timeline').value = pipelineStep; $('pipelineBack').disabled = pipelineStep === 0; $('pipelineNext').disabled = pipelineStep === 4;
  }
  $('pipelineApply').onclick = buildPipeline;
  $('pipelineNext').onclick = () => { stopPlay(); pipelineStep = Math.min(4,pipelineStep+1); renderPipeline(); };
  $('pipelineBack').onclick = () => { stopPlay(); pipelineStep = Math.max(0,pipelineStep-1); renderPipeline(); };
  $('pipelineReset').onclick = () => { stopPlay(); pipelineStep = 0; renderPipeline(); };
  $('timeline').oninput = () => { stopPlay(); pipelineStep = Number($('timeline').value); renderPipeline(); };
  $('pipelinePlay').onclick = () => {
    if (playTimer) { stopPlay(); return; }
    if (pipelineStep === 4) pipelineStep = 0;
    $('pipelinePlay').textContent = 'Pause'; renderPipeline();
    function tick() { pipelineStep++; renderPipeline(); if (pipelineStep === 4) stopPlay(); else playTimer = setTimeout(tick, Number($('pipelineSpeed').value)); }
    playTimer = setTimeout(tick, Number($('pipelineSpeed').value));
  };
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopPlay(); });
  function shuffle(items) { const copy = [...items]; for (let i=copy.length-1;i>0;i--) {const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]];} return copy; }
  function validQuiz(q) {
    return q && Array.isArray(q.ids) && q.ids.length > 0 && new Set(q.ids).size === q.ids.length && q.ids.every(id => questions.some(item => item.id === id)) &&
      Array.isArray(q.answers) && q.answers.length === q.ids.length && q.answers.every(a => a === null || Number.isInteger(a) && a >= 0 && a < 4) &&
      Number.isInteger(q.index) && q.index >= 0 && q.index <= q.ids.length && typeof q.recorded === 'boolean' &&
      Array.isArray(q.orders) && q.orders.length === q.ids.length && q.orders.every(order => Array.isArray(order) && order.length === 4 && [...order].sort().join('') === '0123');
  }
  if (validQuiz(saved.quiz)) quiz = saved.quiz;
  function startQuiz(pool, length) {
    const items = shuffle(pool).slice(0,length);
    if (!items.length) { toast('No questions match this selection.'); return; }
    quiz = {ids:items.map(q=>q.id), answers:items.map(()=>null), orders:items.map(()=>shuffle([0,1,2,3])), index:0, recorded:false};
    persist(); renderQuiz();
  }
  function renderQuiz() {
    if (!quiz) {
      $('quiz').innerHTML = `<h3>Choose your practice session</h3><p>${questions.length} questions across all ${lessons.length} lessons. First answers are locked; unfinished sessions and recent scores are saved locally.</p><label for="quizCategory">Topic</label><select id="quizCategory"><option value="all">All topics</option>${groups.map(g=>`<option>${escape(g)}</option>`).join('')}</select><label for="quizLength">Session length</label><select id="quizLength"><option value="10">10 questions</option><option value="20">20 questions</option><option value="all">All matching questions</option></select><p id="available"></p><button class="primary" id="startQuiz">Start quiz</button><h3>Recent attempts</h3>${state.attempts.length ? `<ul>${state.attempts.slice().reverse().map(a=>`<li>${escape(a.date)} · ${a.score} / ${a.total}</li>`).join('')}</ul>` : '<p class="muted">Your completed sessions will appear here.</p>'}`;
      const pool = () => questions.filter(q => $('quizCategory').value === 'all' || lessons.find(l=>l.id === q.lesson).group === $('quizCategory').value);
      const update = () => $('available').textContent = `${pool().length} questions available.`;
      $('quizCategory').onchange = update; update();
      $('startQuiz').onclick = () => startQuiz(pool(), $('quizLength').value === 'all' ? pool().length : Number($('quizLength').value));
      return;
    }
    if (quiz.index >= quiz.ids.length) {
      const score = quiz.ids.filter((id,i) => questions.find(q=>q.id === id).answer === quiz.answers[i]).length;
      const missed = quiz.ids.filter((id,i) => questions.find(q=>q.id === id).answer !== quiz.answers[i]);
      if (!quiz.recorded) { state.attempts.push({score,total:quiz.ids.length,date:new Date().toLocaleDateString()}); state.attempts = state.attempts.slice(-10); quiz.recorded = true; persist(); }
      $('quiz').innerHTML = `<p class="eyebrow">SESSION COMPLETE</p><div class="quiz-score">${score} / ${quiz.ids.length}</div><p>${missed.length ? 'Review the explanations and revisit the lessons you missed.' : 'Every answer correct. Try another topic or explain the commands aloud.'}</p><div class="card-controls"><button id="newQuiz">New session</button><button id="retryMissed" ${missed.length ? '' : 'disabled'}>Retry missed / unanswered</button></div><h3>Review</h3>${quiz.ids.map((id,i)=>{const q=questions.find(q=>q.id===id);return `<details><summary>${quiz.answers[i]===q.answer?'✓':'○'} ${escape(q.prompt)}</summary><p>Your answer: ${quiz.answers[i]===null?'Unanswered':escape(q.options[quiz.answers[i]])}</p><p>Correct: ${escape(q.options[q.answer])}</p><p>${escape(q.explanation)} <a href="#learn/${q.lesson}">Read lesson</a></p></details>`;}).join('')}`;
      $('newQuiz').onclick = () => { quiz = null; persist(); renderQuiz(); };
      $('retryMissed').onclick = () => startQuiz(questions.filter(q=>missed.includes(q.id)), missed.length);
      return;
    }
    const q = questions.find(q => q.id === quiz.ids[quiz.index]), answer = quiz.answers[quiz.index], answered = answer !== null;
    $('quiz').innerHTML = `<div class="quiz-meta"><span class="eyebrow">QUESTION ${quiz.index+1} / ${quiz.ids.length}</span><button id="finishQuiz">Finish session</button></div><h3>${escape(q.prompt)}</h3><div class="answers">${quiz.orders[quiz.index].map(i => `<button class="answer ${answered && i === q.answer ? 'correct' : ''} ${answered && i === answer && i !== q.answer ? 'incorrect' : ''}" data-answer="${i}" ${answered?'disabled':''}>${escape(q.options[i])}</button>`).join('')}</div>${answered ? `<div class="feedback" role="status"><strong>${answer === q.answer ? 'Correct.' : 'Not quite.'}</strong> ${escape(q.explanation)}<p>Correct answer: <b>${escape(q.options[q.answer])}</b></p><a href="#learn/${q.lesson}">Review this lesson</a></div>` : ''}<button id="quizNext" class="primary" ${answered?'':'disabled'}>${quiz.index === quiz.ids.length-1 ? 'Show results' : 'Next question'}</button>`;
    $('quiz').querySelectorAll('[data-answer]').forEach(b => b.onclick = () => { if (quiz.answers[quiz.index] !== null) return; quiz.answers[quiz.index] = Number(b.dataset.answer); persist(); renderQuiz(); });
    $('quizNext').onclick = () => { quiz.index++; persist(); renderQuiz(); };
    $('finishQuiz').onclick = () => { quiz.index = quiz.ids.length; persist(); renderQuiz(); };
  }
  function cardDeck() { return lessons.filter(l => cardFilter === 'all' || cardFilter === 'saved' && state.bookmarks.includes(l.id) || cardFilter === 'unfinished' && !state.done.includes(l.id)); }
  function renderCards() {
    const deck = cardDeck(); cardIndex = deck.length ? cardIndex % deck.length : 0; const l = deck[cardIndex];
    $('cards').innerHTML = `<label for="cardDeck">Deck</label><select id="cardDeck"><option value="all">All lessons</option><option value="saved">Bookmarked lessons</option><option value="unfinished">Not completed</option></select>${l ? `<p class="eyebrow">CARD ${cardIndex+1} / ${deck.length} · ${escape(l.group)}</p><h2>${escape(l.title)}</h2><p>What does it do? Explain one flag and predict an example’s output before revealing.</p><button id="revealCard" aria-expanded="${revealed}">${revealed?'Hide answer':'Reveal answer'}</button><div class="flash-answer" ${revealed?'':'hidden'}><p>${escape(l.summary)}</p><p><code>${escape(l.flags[0].flag)}</code>: ${escape(l.flags[0].meaning)}</p><pre><code>${escape(l.examples[0].code)}</code></pre><p>${l.examples[0].variable?'Illustrative':'Expected'} output:</p><pre><code>${escape(l.examples[0].output)}</code></pre><p>${escape(l.examples[0].explanation)}</p><a href="#learn/${l.id}">Open full lesson</a></div><div class="card-controls"><button id="againCard">Next card</button><button id="randomCard">Random card</button><button id="knowCard" ${revealed?'':'disabled'}>Got it · mark completed</button></div>` : '<p class="empty">No cards in this deck. Bookmark a lesson or select another deck.</p>'}`;
    $('cardDeck').value = cardFilter; $('cardDeck').onchange = () => {cardFilter=$('cardDeck').value;cardIndex=0;revealed=false;renderCards();};
    if (!l) return;
    $('revealCard').onclick = () => {revealed=!revealed;renderCards();};
    $('againCard').onclick = () => {cardIndex++;revealed=false;renderCards();};
    $('randomCard').onclick = () => {cardIndex=deck.length > 1 ? (cardIndex + 1 + Math.floor(Math.random()*(deck.length-1))) % deck.length : 0;revealed=false;renderCards();};
    $('knowCard').onclick = () => {if(!state.done.includes(l.id))state.done.push(l.id);persist();renderList();if(cardFilter!=='unfinished')cardIndex++;revealed=false;renderCards();};
  }
  updateTheme(); updateIndex(); readingPreferences(); buildPipeline(); route();
})();
