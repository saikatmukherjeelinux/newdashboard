from pathlib import Path
import re
root=Path('.')
labs=['python-motion-lab','dsa-motion-lab','unix-motion-lab','ml-motion-lab','statistics-lab']
for lab in labs:
    page=root/lab/'index.html';text=page.read_text(encoding='utf-8')
    text=re.sub(r'library\.css\?v=[^"\s]+','library.css?v=projects-1',text)
    text=re.sub(r'library-navigation\.js\?v=[^"\s]+','library-navigation.js?v=projects-1',text)
    if 'section-projects-data.js' not in text:
        text=text.replace('</body>','<script src="../section-projects-data.js?v=1"></script><script src="../section-projects-ui.js?v=1"></script></body>')
    page.write_text(text,encoding='utf-8')
page=root/'library-navigation.js';text=page.read_text(encoding='utf-8')
if 'section-projects.html' not in text:
    text=text.replace("['Worked examples','worked-examples.html']","['Worked examples','worked-examples.html'],['Complete section programs','section-projects.html']")
page.write_text(text,encoding='utf-8')
print('Installed section programs beside lessons and in the existing Browse menu.')
