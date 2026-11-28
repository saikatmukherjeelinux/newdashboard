"""Extend the existing lesson algorithms with readable scenario checks."""
import ast
import json
from pathlib import Path
from section_projects import add

CASES={
'Sorting': [('mixed','bubble_sort([4, 1, 3, 1])',[1,1,3,4]),('empty','bubble_sort([])',[]),('negative','bubble_sort([-1, 2, -3])',[-3,-1,2])],
'Searching': [('present','linear_search([4,7,2],7)',1),('absent','linear_search([4,7,2],9)',-1),('empty','linear_search([],7)',-1)],
'Graphs': [('from A',"bfs('A')",None)],
'Trees': [('empty','list(inorder(None))',[]),('single','list(inorder(insert(None, 4)))',[4]),('existing','list(inorder(root))',None)],
'Array Patterns': [('normal','prefix_sums([2,3,4])',[2,5,9]),('empty','prefix_sums([])',[]),('negative','prefix_sums([2,-3,4])',[2,-1,3])],
'Dynamic Programming': [('mixed','maximum_subarray([-2,3,-1,4,-5])',6),('negative','maximum_subarray([-5,-2,-8])',-2),('single','maximum_subarray([4])',4)],
'Advanced Graphs': [('weighted',"dijkstra({'A':[('B',5),('C',1)],'C':[('B',2)]},'A')",{'A':0,'C':1,'B':3}),('single',"dijkstra({'A':[]},'A')",{'A':0})],
'Advanced DP': [('increasing','longest_increasing_subsequence([1,2,3])',[1,2,3]),('duplicates','longest_increasing_subsequence([2,2,2])',[2]),('empty','longest_increasing_subsequence([])',[])],
'String Algorithms': [('overlap',"kmp_search('AAAA','AA')",0),('absent',"kmp_search('ABC','Z')",-1),('whole',"kmp_search('ABC','ABC')",0)],
'String Matching': [('overlap',"z_search('AAAA','AA')",[0,1,2]),('absent',"z_search('ABC','Z')",[]),('whole',"z_search('ABC','ABC')",[0])],
'String Indexes': [('prefix',"trie_autocomplete('ca',['car','cat','dog'])",['car','cat']),('absent',"trie_autocomplete('z',['car','cat'])",[]),('single',"trie_autocomplete('dog',['dog'])",['dog'])],
'Palindrome Algorithms': [('even',"manacher('cbbd')",'bb'),('whole',"manacher('racecar')",'racecar'),('empty',"manacher('')",'')],
'String Dynamic Programming': [('subsequence',"longest_common_subsequence('ABC','AC')",'AC'),('disjoint',"longest_common_subsequence('ABC','XYZ')",''),('empty',"longest_common_subsequence('','ABC')",'')],
'String Sliding Windows': [('classic',"minimum_window('ADOBECODEBANC','ABC')",'BANC'),('absent',"minimum_window('ABC','Z')",''),('repeated',"minimum_window('AABC','AA')",'AA')],
'Interview Hashing': [('pair','two_sum([2,7,11,15],9)',[0,1]),('duplicate','two_sum([3,3],6)',[0,1])],
'Interview Two Pointers': [('triples','three_sum([-1,0,1,2,-1,-4])',[[-1,-1,2],[-1,0,1]]),('none','three_sum([1,2,3])',[]),('zeros','three_sum([0,0,0,0])',[[0,0,0]])],
'Interview Arrays': [('normal','product_except_self([1,2,3,4])',[24,12,8,6]),('one zero','product_except_self([0,2,3])',[6,0,0]),('two zeros','product_except_self([0,0,3])',[0,0,0])],
'Interview Binary Search': [('present','rotated_search([4,5,6,7,0,1,2],0)',4),('absent','rotated_search([4,5,6,7,0,1,2],3)',-1),('single','rotated_search([1],1)',0)],
'Interview Intervals': [('overlap','merge_intervals([[1,3],[2,6],[8,10]])',[[1,6],[8,10]]),('touching','merge_intervals([[1,2],[2,3]])',[[1,3]]),('empty','merge_intervals([])',[])],
'Interview Heaps': [('overlap','meeting_rooms([[0,30],[5,10],[15,20]])',2),('reuse','meeting_rooms([[0,5],[5,10]])',1),('empty','meeting_rooms([])',0)],
'Interview Selection': [('second','kth_largest([3,1,4,2],2)',3),('duplicates','kth_largest([5,5,1],2)',5),('single','kth_largest([7],1)',7)],
'Interview Monotonic Structures': [('mixed','next_greater([2,1,2,4,3])',[4,2,4,-1,-1]),('decreasing','next_greater([3,2,1])',[-1,-1,-1]),('empty','next_greater([])',[])],
'Interview Greedy': [('reachable','jump_game([2,3,1,1,4])',True),('blocked','jump_game([3,2,1,0,4])',False),('single','jump_game([0])',True)],
'Interview Dynamic Programming': [('normal','house_robber([2,7,9,3,1])',12),('single','house_robber([5])',5),('empty','house_robber([])',0)],
'Interview Backtracking': [('two elements','len(subsets([1,2]))',4),('three elements','len(subsets([1,2,3]))',8),('empty','subsets([])',[[]])],
'Interview Graphs & Grids': [('separate','number_of_islands([[1,0],[0,1]])',2),('connected','number_of_islands([[1,1],[1,0]])',1),('water','number_of_islands([[0,0],[0,0]])',0)],
'Interview Range Queries': [('updated','fenwick_ranges([2,1,3],[[1,2]],[[0,2],[1,1]])',{'array':[2,3,3],'sums':[8,3]}),('unchanged','fenwick_ranges([1,2,3],[],[[0,1]])',{'array':[1,2,3],'sums':[3]})]
}

def install():
    sources=json.loads((Path(__file__).parent/'dsa-project-sources.json').read_text(encoding='utf-8'))
    for source in sources:
        group=source['group']
        if group.startswith('Regex '):
            continue
        if group=='Linear Structures':
            code='''from collections import deque

class WorkQueue:
    def __init__(self):
        self.pending = deque()
        self.finished = []

    def add(self, item):
        self.pending.append(item)

    def process_next(self):
        if not self.pending:
            return None
        item = self.pending.popleft()
        self.finished.append(item)
        return item

queue = WorkQueue()
for task in ["read", "validate", "report"]:
    queue.add(task)
while queue.pending:
    print("Processed:", queue.process_next())
assert queue.finished == ["read", "validate", "report"]
assert queue.process_next() is None
print("Undo order:")
while queue.finished:
    print(queue.finished.pop())
assert queue.finished == []'''
        else:
            # Retain the lesson's implementation and setup, but replace its one print.
            tree=ast.parse(source['code']);lines=source['code'].splitlines()
            remove=set()
            for node in tree.body:
                if isinstance(node,ast.Expr) and isinstance(node.value,ast.Call) and isinstance(node.value.func,ast.Name) and node.value.func.id=='print':
                    remove.update(range(node.lineno-1,node.end_lineno))
            code='\n'.join(line for i,line in enumerate(lines) if i not in remove).rstrip()
            code+='\n\n# Run independent scenarios and compare with known answers.\n'
            for label,expression,expected in CASES[group]:
                code+=f'\nresult = {expression}\nprint({label!r} + ":", result)\n'
                if expected is not None:code+=f'assert result == {expected!r}, "Unexpected result for {label}"\n'
            if group=='Graphs':
                code+='assert result[0] == "A"\nassert len(result) == len(set(result))\nassert set(result) == set(graph)\n'
            if group=='Trees':
                code+='assert result == sorted(result)\n'
            code+='\nprint("All scenario checks passed")'
        description=source['explanation'].strip()
        # The existing beginner guide is included as algorithm-specific explanation.
        steps='Read the input and result contract: '+source['title']+'.|'+description.replace('|',' / ')+'|Run the complete implementation before changing it. The final part supplies named scenarios and checks their results.|Each assert compares a computed answer with an expected answer; a failing assertion stops execution at the first discrepancy.'
        add('dsa-motion-lab',group,source['title']+' — complete scenario runner',
            'Use the section’s representative algorithm in a complete program with normal and boundary scenarios.',code,steps,
            'The printed scenarios expose what the algorithm returns. '+str(source['cost'])+' The checks cover selected cases, not a proof for all inputs.',
            'Add another boundary case with an independently calculated expected answer. Explain whether it changes the time or memory requirement.')

    regex_specs=[
      ('Regex Foundations','Find literal terms',r'cat','The cat met another cat.','matches','', ['cat','cat']),
      ('Regex Quantifiers & Anchors','Validate short identifiers',r'[A-Z][A-Z0-9]{2,5}','AB12','validate','',True),
      ('Regex Assertions','Extract keys before a colon',r'\b[A-Za-z]+(?=:)','name: Alex age: 25','matches','',['name','age']),
      ('Regex Extraction','Extract date-shaped fields',r'([0-9]{4})-([0-9]{2})-([0-9]{2})','Dates: 2025-01-02 and 2026-03-04','groups','',[('2025','01','02'),('2026','03','04')]),
      ('Regex Validation','Validate a simple label',r'[a-z][a-z0-9_]{2,11}','sample_12','validate','',True),
      ('Regex Transformations','Normalize separators',r'[,;\s]+','red,green; blue\tyellow','split','',['red','green','blue','yellow'])
    ]
    for group,title,pattern,text,mode,flags,expected in regex_specs:
        code=f'''import re

def apply_pattern(text, pattern, mode):
    expression = re.compile(pattern)
    if mode == "validate":
        # fullmatch requires the entire string, not just a matching fragment.
        return expression.fullmatch(text) is not None
    if mode == "split":
        return expression.split(text)
    matches = list(expression.finditer(text))
    if mode == "groups":
        return [match.groups() for match in matches]
    return [match.group(0) for match in matches]

pattern = {pattern!r}
text = {text!r}
mode = {mode!r}
print("Input:", repr(text))
print("Pattern:", pattern)
result = apply_pattern(text, pattern, mode)
print("Result:", result)
assert result == {expected!r}
print("Empty-input result:", apply_pattern("", pattern, mode))
try:
    apply_pattern(text, "[", mode)
except re.error:
    print("Invalid pattern rejected")
'''
        add('dsa-motion-lab',group,title+' — complete text processor','Apply a trusted pattern with an explicit match mode and check the result.',code,
            'Compile the regular expression once before examining the text.|fullmatch validates the entire input; finditer produces non-overlapping matches; split returns the pieces between delimiters.|Groups return captured substrings, while group(0) returns the whole match. Positive lookahead checks following text without consuming it.|The final checks cover the normal input, empty input and a malformed pattern.',
            'This uses Python re with fictional ASCII input. Date-shaped strings are not necessarily valid calendar dates. These patterns are not a substitute for a complete parser or untrusted-pattern resource limits.',
            'Change one input character and predict whether it changes a match, a captured group or the validation result.')
