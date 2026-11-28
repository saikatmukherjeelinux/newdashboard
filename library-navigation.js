/* One visible navigation control; existing lesson engines keep their state. */
(() => {
 const lab=document.body.dataset.lab;
 const names={python:'Python',dsa:'Data structures & algorithms',unix:'Unix',ml:'Machine learning',statistics:'Statistics'};
 if(!names[lab])return;
 const main=document.querySelector('main'),index=document.querySelector(lab==='python'?'#lessonNav':lab==='dsa'?'#nav':'#lessonList');
 if(!main||!index)return;
 document.body.classList.add('simple-reader','library-reader');
 const header=document.createElement('header');header.className='library-heading';
 header.innerHTML=`<p class="library-wordmark">Learning Library</p><h1>${names[lab]}</h1><label for="library-browse">Browse lessons and resources</label><select id="library-browse"><option value="">Choose what to open…</option></select>`;
 main.prepend(header);
 const select=header.querySelector('select');let entries=[];
 const tools=[...document.querySelectorAll('.mode-tabs button,.modes button,.toolbar nav a')];
 function group(label){const g=document.createElement('optgroup');g.label=label;select.append(g);return g;}
 function update(){
   entries=[...index.querySelectorAll('a[href],button[data-lesson]')];
   select.replaceChildren(new Option('Choose what to open…',''));
   const resources=group('Resources');
   for(const [text,value] of [['All subjects','../index.html'],['Cheat Sheet','cheat-sheet.html'],['Worked examples','worked-examples.html'],['Complete section programs','section-projects.html']])resources.append(new Option(text,'url:'+value));
   const topics=group('Lessons');
   entries.forEach((e,i)=>{const option=new Option((e.title||e.textContent).replace(/\s+/g,' ').trim(),'lesson:'+i);topics.append(option);if(e.matches('[aria-current="page"],.active'))option.selected=true;});
   if(tools.length){const practice=group('Practice and reference');tools.forEach((e,i)=>{const text=e.textContent.replace(/[◈⌘◎▤]/g,'').replace(/\s+/g,' ').trim();if(!/worked code examples/i.test(text))practice.append(new Option(text,'tool:'+i));});}
   if(document.querySelector('#theme'))group('Appearance').append(new Option('Switch light / dark appearance','theme'));
 }
 select.addEventListener('change',()=>{
   const value=select.value;
   if(value.startsWith('url:')){location.href=value.slice(4);return;}
   if(value.startsWith('lesson:'))entries[Number(value.slice(7))]?.click();
   if(value.startsWith('tool:'))tools[Number(value.slice(5))]?.click();
   if(value==='theme')document.querySelector('#theme').click();
   // Native selectors retain focus so keyboard users can continue navigating.
 });
 new MutationObserver(update).observe(index,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-current']});update();
 if(!location.hash&&lab==='ml')location.hash='lesson/notation';
 if(!location.hash&&lab==='statistics')location.hash='topic/population';
})();
