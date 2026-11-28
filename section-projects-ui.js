/* Render the same section program beside lessons and in the standalone reader. */
(() => {
 const folders={python:'python-motion-lab',dsa:'dsa-motion-lab',unix:'unix-motion-lab',ml:'ml-motion-lab',statistics:'statistics-lab'};
 const lab=document.body.dataset.lab, folder=document.body.dataset.projectLab||folders[lab];
 const projects=window.SECTION_PROJECTS?.[folder];if(!projects)return;
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(project,container){
   const run=project.language==='python'?'Save the complete code as example.py and run python example.py. Python 3 and its standard library are sufficient.':'Save the complete code as example.sh and run bash example.sh in Bash on Linux with GNU utilities. It creates a temporary practice directory and removes that directory on exit.';
   container.innerHTML=`<p class="project-section">Section: ${esc(project.section)}</p><h2>${esc(project.title)}</h2><p>${esc(project.goal)}</p><h3>How to run</h3><p>${esc(run)}</p><p>${project.verified?'Executed successfully with the displayed output and built-in scenario checks.':'Expected output is authored for these fixtures. This Bash program has not been executed on the Windows authoring host.'}</p><h3>Complete program · ${project.lines} lines</h3><button type="button" class="project-copy">Copy complete program</button><pre class="project-code"><code>${esc(project.code)}</code></pre><h3>Expected output</h3><pre class="project-output"><code>${esc(project.output)}</code></pre><h3>Step-by-step explanation</h3><ol>${project.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><h3>What the result means</h3><p>${esc(project.meaning)}</p><h3>Try a change</h3><p>${esc(project.variation)}</p><p class="project-copy-status" role="status" aria-live="polite"></p>`;
   container.querySelector('.project-copy').onclick=async()=>{
     const status=container.querySelector('.project-copy-status');
     try{await navigator.clipboard.writeText(project.code);status.textContent='Complete program copied. Expected output is not included.';}
     catch{const range=document.createRange();range.selectNodeContents(container.querySelector('.project-code code'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Program selected. Press Ctrl+C or Command+C to copy.';}
   };
 }
 const selector=document.querySelector('#project-choice');
 if(selector){
   for(const project of projects)selector.add(new Option(project.section+' — '+project.title,project.id));
   function route(){const id=decodeURIComponent(location.hash.slice(1));const project=projects.find(p=>p.id===id)||projects[0];selector.value=project.id;render(project,document.querySelector('#project-view'));}
   selector.onchange=()=>{if(selector.value==='back'){location.href='index.html';return;}location.hash=selector.value;};
   window.addEventListener('hashchange',route);route();return;
 }
 const main=document.querySelector('main');if(!main)return;
 let scheduled=false;
 function current(){
   if(lab==='python'){
     const id=Number(document.querySelector('#lessonNav [aria-current="page"]')?.dataset.lesson);
     return {section:window.LESSONS.find(l=>l.id===id)?.category,host:document.querySelector('#lessonBody')};
   }
   if(lab==='dsa'){
     const title=document.querySelector('#lessonTitle')?.textContent;
     const item=typeof lessons!=='undefined'?lessons.find(l=>l.title===title):null;
     return {section:item?.group,host:document.querySelector('#learningContent')};
   }
   if(lab==='ml'||lab==='statistics'){
     const data=lab==='ml'?window.ML_DATA:window.STATS_DATA;
     const id=location.hash.split('/')[1];return {section:data.lessons.find(l=>l.id===id)?.group,host:document.querySelector('#view>article')};
   }
   if(lab==='unix'){
     for(const [id,section] of [['industryView','Industry Practice'],['architectureView','Unix Architecture']]){
       const host=document.getElementById(id);if(host&&!host.hidden)return {section,host};
     }
     return {section:document.querySelector('#lesson>.eyebrow')?.textContent,host:document.querySelector('#lesson')};
   }
   return {};
 }
 function refresh(){
   scheduled=false;const {section,host}=current();if(!host)return;
   const project=projects.find(p=>p.section===section);if(!project)return;
   const existing=host.querySelector(':scope > .section-project');
   if(existing?.dataset.project===project.id)return;
   existing?.remove();
   const details=document.createElement('details');details.className='section-project';details.dataset.project=project.id;
   const summary=document.createElement('summary');summary.textContent='Complete section program: '+project.title;
   const content=document.createElement('div');content.className='section-project-content';render(project,content);
   details.append(summary,content);host.append(details);
 }
 new MutationObserver(()=>{if(!scheduled){scheduled=true;requestAnimationFrame(refresh);}}).observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
 window.addEventListener('hashchange',refresh);refresh();
})();
