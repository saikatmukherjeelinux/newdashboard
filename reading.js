(()=>{const name=document.body.dataset.lab;if(!name||name==='dashboard')return;const main=document.querySelector('main');if(!main||document.querySelector('.reading-start'))return;const labs=[['python','python-motion-lab','Python'],['dsa','dsa-motion-lab','DSA'],['unix','unix-motion-lab','Unix'],['ml','ml-motion-lab','ML'],['statistics','statistics-lab','Statistics']];const section=document.createElement('section');section.className='reading-start';section.setAttribute('aria-label','Study shortcuts');section.innerHTML='<h2>Worked examples</h2><p><a href="cheat-sheet.html">Cheat Sheet</a></p><p><a href="worked-examples.html">Code examples &amp; outputs</a></p><details><summary>Other labs</summary><nav aria-label="Learning labs"><a href="../index.html">Dashboard</a>'+labs.filter(l=>l[0]!==name).map(l=>`<a href="../${l[1]}/index.html">${l[2]} Lab</a>`).join('')+'</nav></details>';const entry=main.querySelector(".cheat-sheet-entry");if(entry){section.querySelector('a[href="cheat-sheet.html"]')?.closest("p").remove();entry.after(section);}else{main.prepend(section);}})();
// Supporting explanations stay available without pushing the selected lesson down.
(() => {
  const lab = document.body.dataset.lab;
  const foundations = {
    python: {
      title: 'How to read a Python example',
      paragraphs: [
        'Python runs ordinary statements from top to bottom. An assignment gives a name to a value. Calling print displays a value; an assignment by itself does not display anything in a script.',
        'In this example, prices is a list: an ordered collection. The for loop visits each price. total starts at zero and is replaced with the old total plus the current price. Indentation identifies the statement repeated by the loop. The final print is outside the loop, so it runs once.'
      ],
      code: 'prices = [10, 20, 5]\ntotal = 0\nfor price in prices:\n    total = total + price\nprint(total)',
      output: '35',
      explanation: 'The running total changes from 0 to 10, then to 30, then to 35. An empty prices list would leave total at 0. If print were indented inside the loop, it would display three lines: 10, 30, and 35. These are different program behaviors, not different formatting styles.'
    },
    dsa: {
      title: 'How to understand an algorithm before playing it',
      paragraphs: [
        'An algorithm is a sequence of steps that transforms an input into an answer. First identify the input, the required answer, and what one step changes. A data structure is how the values are organized, such as a list or a queue.',
        'For example, a linear search checks each value in order. Here the target is 7. Python positions start at zero. The first comparison checks position 0, whose value is 4. The second checks position 1, whose value is 7, so the search stops.'
      ],
      code: 'values = [4, 7, 2]\ntarget = 7\nposition = -1\nfor i, value in enumerate(values):\n    if value == target:\n        position = i\n        break\nprint(position)',
      output: '1',
      explanation: 'The output is the position, not the matching value. If the target were absent, the output would remain -1. Searching an unsorted list may require checking all n values, so the worst-case time is O(n). This describes how work grows; it does not mean n seconds. Use the animation to follow comparisons after reading the steps.'
    },
    unix: {
      title: 'How to read a command, its flags and its output',
      paragraphs: [
        'A shell reads a command line and starts the requested program. The command name selects the program. Arguments supply data or file names. Options, often called flags, change how the program behaves. A flag has meaning for a particular command; the same letter can mean something different elsewhere.',
        'This Bash example creates text in memory and searches it. printf prints the format once for each following argument. The format %s means a string and \\n means a newline. Quotes keep the backslash inside the format. The pipe | sends that text to grep as input; it does not create a file.'
      ],
      code: "printf '%s\\n' apple pear apple | grep -n 'apple'",
      output: '1:apple\n3:apple',
      explanation: 'grep selects lines matching the pattern apple. Its -n option adds the original line number, starting at 1. The second input line is pear, so it is omitted. grep normally treats the pattern as a regular expression and matches anywhere in a line. Use grep -F for literal text and grep -x to require a whole-line match. This example uses no private logs or existing files.'
    },
    ml: {
      title: 'How an input becomes a prediction and an error',
      paragraphs: [
        'A feature is an input number. A prediction is the answer produced by a model. A parameter is a number used inside the model, such as a multiplier. Training adjusts parameters using examples whose target answers are known.',
        'Suppose a tiny model predicts a score using predicted = weight × hours + bias. For three hours, weight 2 and bias 1 give 7. If the observed score is 8, prediction minus observation is -1. Squaring that error gives 1. Squaring makes positive and negative errors contribute nonnegative amounts.'
      ],
      code: 'hours = 3\nweight = 2\nbias = 1\nobserved = 8\npredicted = weight * hours + bias\nerror = predicted - observed\nprint(predicted)\nprint(error ** 2)',
      output: '7\n1',
      explanation: 'This calculates one prediction and one squared error; it does not train the model. Training would repeat calculations on training examples and update parameters. To judge new-data performance, evaluate on separate examples that were not used to fit or choose the model. A low error on one example does not show that the model works generally.'
    },
    statistics: {
      title: 'How to connect a calculation to its meaning',
      paragraphs: [
        'Begin with what each number measures and its unit. A statistic summarizes observed values. The mean adds the values and divides by their count. The median is the middle value after sorting, or the average of the two middle values when the count is even.',
        'These three fictional waiting times are in minutes. Their total is 15 and their count is 3, so the mean is 5 minutes. The middle value is 4 minutes. The mean and median answer different questions and need not agree.'
      ],
      code: 'from statistics import mean, median\nwaits = [2, 4, 9]\nprint(mean(waits))\nprint(median(waits))',
      output: '5\n4',
      explanation: 'Changing 9 to 90 raises the mean to 32 minutes, but the median stays 4. The mean responds to every value; the median depends on order and the middle position. Neither number describes all the variation. Three observed waits also cannot establish the typical wait for every customer without considering how they were sampled.'
    }
  };
  const item = foundations[lab];
  const shortcuts = document.querySelector('.reading-start');
  if (!item || !shortcuts) return;
  const escape = value => value.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const details = document.createElement('details');
  details.className = 'reading-foundations';
  details.innerHTML = `<summary>${item.title}</summary>${item.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}<h3>Example</h3><pre><code>${escape(item.code)}</code></pre><h3>Expected output</h3><pre><code>${escape(item.output)}</code></pre><h3>Why this result matters</h3><p>${escape(item.explanation)}</p>`;
  shortcuts.after(details);
  // Keep completion and practice actions after the explanation, not before it.
  if (lab === 'python') {
    const body = document.querySelector('#lessonBody');
    const tools = document.querySelector('.lesson-tools');
    if (body && tools) body.after(tools);
  }
  // Route renderers replace the article; move its existing buttons without
  // recreating them so their handlers and saved progress continue to work.
  if (lab === 'ml' || lab === 'statistics') {
    const view = document.querySelector('#view');
    const reorder = () => {
      const article = view?.querySelector('article');
      const actions = article?.querySelector('.lesson-header .actions');
      if (actions) {
        const next = article.querySelector('.lesson-bottom');
        if (next) next.before(actions); else article.append(actions);
      }
    };
    if (view) {
      new MutationObserver(reorder).observe(view, {childList:true, subtree:true});
      reorder();
    }
  }
  if (lab === 'dsa') {
    const guide = document.querySelector('#simpleGuide');
    const workspace = document.querySelector('.workspace');
    if (guide && workspace) workspace.before(guide);
  }
})();
