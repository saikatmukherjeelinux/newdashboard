/* A command-specific scenario follows each command's short examples. */
(() => {
 const lesson=document.getElementById('lesson');if(!lesson)return;
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(){
   const title=lesson.querySelector(':scope>h2')?.textContent;
   const item=window.UNIX_SITUATIONS.find(item=>item.lessonTitle===title);if(!item)return;
   const previous=lesson.querySelector(':scope>.unix-situation');
   if(previous?.dataset.command===item.id)return;
   previous?.remove();
   const section=document.createElement('section');section.className='unix-situation';section.dataset.command=item.id;
   const status=item.execution==='matched'?'This exact output was checked with Bash and the available GNU tools bundled on Windows. Native Linux behavior was not separately tested.':item.variable?'This is an illustrative transcript. Values, ordering, terminal behavior or available services can differ on your machine.':'This output is authored for the supplied fixtures; this script has not been execution-verified on the authoring host.';
   section.innerHTML=`<h3>Situation: ${esc(item.title)}</h3><p>${esc(item.steps[0])}</p><details><summary>Complete script, flags and output · ${item.lines} lines</summary><h4>Before you run it</h4><p>Requires: ${esc(item.requires)}. Save the full code as practice.sh and run <code>bash practice.sh</code>. It creates its own disposable files and removes them when it finishes. Do not change the temporary directory to an existing project folder.</p><h4>Complete script</h4><button class="situation-copy" type="button">Copy complete script</button><pre class="situation-code"><code>${esc(item.code)}</code></pre><h4>${item.variable?'Illustrative output — yours may differ':'Expected output with these sample files'}</h4><p class="situation-verification">${esc(status)}</p><pre class="situation-output"><code>${esc(item.output)}</code></pre><h4>Read it step by step</h4><ol>${item.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><h4>Command flags and syntax used here</h4><ul>${item.flags.map(flag=>`<li>${esc(flag)}</li>`).join('')}</ul><details class="situation-setup-help"><summary>Understand the shared setup and cleanup</summary><ul>${item.commonFlags.map(flag=>`<li>${esc(flag)}</li>`).join('')}</ul></details><h4>Try it yourself</h4><p>${esc(item.tryIt)}</p><p><a href="${esc(item.source[1])}" target="_blank" rel="noopener noreferrer">Command reference: ${esc(item.source[0])}</a></p><p class="situation-status" role="status" aria-live="polite"></p></details>`;
   section.querySelector('.situation-copy').onclick=async()=>{
     const status=section.querySelector('.situation-status');
     try{await navigator.clipboard.writeText(item.code);status.textContent='Script copied. Output is not included.';}
     catch{const range=document.createRange();range.selectNodeContents(section.querySelector('.situation-code code'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Script selected. Press Ctrl+C or Command+C to copy.';}
   };
   const takeaway=lesson.querySelector('#lessonTakeaway');if(takeaway)takeaway.before(section);else lesson.append(section);
 }
 let pending=false;
 new MutationObserver(()=>{if(!pending){pending=true;requestAnimationFrame(()=>{pending=false;render();});}}).observe(lesson,{childList:true});
 render();
})();
