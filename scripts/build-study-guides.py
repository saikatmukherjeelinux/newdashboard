"""Build standalone, information-first code guides for every lab."""
from pathlib import Path
from html import escape as h
import json
ROOT=Path(__file__).resolve().parents[1]
guides={}
def add(lab,title,idea,code,output,steps,lesson):
    guides.setdefault(lab,[]).append(dict(title=title,idea=idea,code=code,output=output,steps=steps.split('|'),lesson=lesson,language='bash' if lab=='unix-motion-lab' else 'python'))
add('python-motion-lab','Names, values and a small bill','A variable gives a name to a value. Keeping quantities separate makes a calculation easier to read and change.',
'''price = 12
quantity = 3
total = price * quantity
print(f"Total: {total}")''','Total: 36\n',
'price and quantity store integers. Their names explain what the numbers mean.|The * operator multiplies; the result is stored in total.|The f-string inserts total inside the displayed text. print ends the line with a newline.|Change quantity to 4 and reason that the output becomes Total: 48 before running it.','A variable is a name for a value, not a promise that the value can never change.')
add('python-motion-lab','Convert text before arithmetic','User input and file fields often arrive as strings. Convert them when the operation requires numbers.',
'''text = "15"
number = int(text)
print(text + "5")
print(number + 5)''','155\n20\n',
'The quotation marks create text. Adding two strings joins their characters.|int(text) parses an integer from the text; it can raise ValueError for invalid input.|The first print joins "15" and "5". The second adds the numbers 15 and 5.|If text were "fifteen", conversion would fail rather than guess a number.','The same + symbol has different behavior for strings and numbers.')
add('python-motion-lab','Filter a list with a loop','A loop repeats a small action for each item. An if statement chooses when that action should happen.',
'''values = [2, 7, 4, 9]
kept = []
for value in values:
    if value >= 5:
        kept.append(value)
print(kept)''','[7, 9]\n',
'Start with an empty result list. Each iteration gives value the next number.|The >= test is true only for 7 and 9.|append adds one accepted item to the end. Input order is preserved.|A list comprehension [v for v in values if v >= 5] expresses the same selection more compactly.','Use the longer loop until the condition and update are clear.')
add('python-motion-lab','Write a function with a clear return value','A function packages a reusable rule. Returning an answer is different from displaying it.',
'''def bill(count, price=10):
    return count * price

first = bill(3)
second = bill(2, price=7)
print(first)
print(second)''','30\n14\n',
'def defines a function; its body runs when the function is called.|price=10 supplies a default only when no price argument is provided.|return sends a value back to the caller. Here the caller stores it in a name.|The two print calls display the results; the function itself does not print.','Separate calculation from display so a function can be reused in other contexts.')
add('python-motion-lab','Count items with a dictionary','A dictionary associates keys with values. It can keep a running count for each label.',
'''labels = ["red", "blue", "red", "green", "blue", "red"]
counts = {}
for label in labels:
    counts[label] = counts.get(label, 0) + 1
for label in sorted(counts):
    print(label, counts[label])''','blue 2\ngreen 1\nred 3\n',
'The label is the key and its count is the value.|get(label, 0) returns an existing count or zero for a new label.|Adding one and assigning it updates the count for that occurrence.|sorted(counts) sorts keys for predictable display; it does not change the stored counts.','Dictionaries are useful when you need a value associated with each distinct key.')
add('python-motion-lab','Understand a list copy','Two names can refer to the same mutable list. A shallow copy creates a new outer list, but does not recursively copy nested objects.',
'''original = [1, 2]
alias = original
separate = original.copy()
alias.append(3)
print(original)
print(separate)''','[1, 2, 3]\n[1, 2]\n',
'alias = original does not create a list. Both names point to the same object.|copy creates a new outer list containing the same entries.|Appending through alias therefore changes original, but not separate.|For nested lists, a shallow copy still shares the nested objects; consider the intended ownership before copying.','Assignment and copying are different operations.')
add('python-motion-lab','Handle a specific conversion failure','An exception lets code report that an operation could not finish normally. Catch the failure you can actually handle.',
'''items = ["3", "bad", "5"]
total = 0
for item in items:
    try:
        total += int(item)
    except ValueError:
        print(f"Skipped: {item}")
print(f"Total: {total}")''','Skipped: bad\nTotal: 8\n',
'int succeeds for "3" and "5", adding them to total.|It raises ValueError for "bad". Control moves to the matching except block.|The message records the skipped input rather than silently losing it.|The loop continues, but in some applications rejecting the entire input would be more appropriate.','Choose error handling according to the task instead of catching every exception blindly.')
add('python-motion-lab','Generate values one at a time','A generator yields a sequence without constructing the entire result list in advance.',
'''def squares(limit):
    for number in range(limit):
        yield number * number

stream = squares(4)
print(next(stream))
print(list(stream))''','0\n[1, 4, 9]\n',
'Calling squares creates a generator; it does not immediately run every loop iteration.|next requests the first yielded value, 0.|list consumes the remaining values, not the already-consumed first value.|Once exhausted, a generator does not restart; call squares again to create a new one.','A generator is a stateful stream, so consuming it changes what remains.')
add('dsa-motion-lab','Linear search: inspect one item at a time','Linear search works without sorted input. It returns the first matching position, or a clearly specified missing marker.',
'''def find_first(values, target):
    for index, value in enumerate(values):
        if value == target:
            return index
    return -1

print(find_first([8, 3, 7, 3], 3))
print(find_first([8, 3, 7, 3], 9))''','1\n-1\n',
'enumerate supplies the zero-based index and its value.|The first match returns immediately, so the later 3 is not returned.|If the loop ends without a match, -1 is the chosen sentinel.|Worst-case work grows linearly with the list length: O(n) time and O(1) extra space.','Document the missing marker so callers do not accidentally use -1 as a valid Python list index.')
add('dsa-motion-lab','Binary search: halve a sorted search range','Binary search needs sorted data. It compares with the middle and discards the half that cannot contain the target.',
'''def binary_search(values, target):
    low, high = 0, len(values) - 1
    while low <= high:
        mid = (low + high) // 2
        if values[mid] == target:
            return mid
        if values[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

print(binary_search([2, 4, 6, 8, 10], 8))
print(binary_search([], 8))''','3\n-1\n',
'low and high bound the remaining inclusive range.|Integer division // picks a valid middle index.|The updates exclude the already-compared middle, ensuring progress.|Time is O(log n) on a sorted random-access list; sorting an unsorted input first has its own cost.','Never apply this version to an unsorted list and trust the answer.')
add('dsa-motion-lab','Use a stack to check brackets','A stack remembers the most recent unmatched opening bracket. The next closing bracket must match it.',
'''def balanced(text):
    stack = []
    matching = {')': '(', ']': '[', '}': '{'}
    for char in text:
        if char in '([{':
            stack.append(char)
        elif char in matching:
            if not stack or stack.pop() != matching[char]:
                return False
    return not stack

print(balanced("([])"))
print(balanced("([)]"))''','True\nFalse\n',
'append pushes an opening bracket onto the stack.|pop removes the most recent opener, implementing last-in-first-out order.|A closer with an empty stack or the wrong opener fails immediately.|This checks bracket characters, not a full programming-language grammar; quoted strings are not specially parsed.','The stack structure mirrors nested matching. Time and worst-case space are O(n).')
add('dsa-motion-lab','Breadth-first search with a queue','BFS explores an unweighted graph in layers. A queue processes earlier discoveries before later ones.',
'''from collections import deque
graph = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}
queue = deque(["A"])
seen = {"A"}
order = []
while queue:
    node = queue.popleft()
    order.append(node)
    for neighbor in graph[node]:
        if neighbor not in seen:
            seen.add(neighbor)
            queue.append(neighbor)
print(order)''',"['A', 'B', 'C', 'D']\n",
'deque supports removing the oldest queued item efficiently.|Mark nodes seen when they are enqueued, preventing D from being added twice.|Neighbor-list order determines the order among nodes at the same layer.|With adjacency lists, work is O(V+E) for the explored graph; memory tracks the queue and visited nodes.','BFS finds shortest edge-count paths in unweighted graphs, not arbitrary weighted shortest paths.')
add('dsa-motion-lab','Merge two already-sorted lists','Keep a pointer into each list. Repeatedly take the smaller next value, then append any remaining tail.',
'''def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

print(merge([1, 4, 7], [2, 4, 8]))''','[1, 2, 4, 4, 7, 8]\n',
'Each pointer identifies the next unused value.|Choosing <= takes an equal value from the left first, preserving cross-list order for ties in a stable merge.|Once either list ends, its partner’s remaining values are already ordered.|Time is O(n+m); the returned list uses O(n+m) space.','This merges sorted inputs; it does not sort arbitrary unsorted inputs.')
add('dsa-motion-lab','Two-sum with remembered values','Remember earlier values so that each new value can ask whether its complement has appeared.',
'''def two_sum(values, target):
    seen = {}
    for index, value in enumerate(values):
        other = target - value
        if other in seen:
            return (seen[other], index)
        seen[value] = index
    return None

print(two_sum([2, 7, 11, 15], 9))
print(two_sum([3, 3], 6))''','(0, 1)\n(0, 1)\n',
'For value 7 and target 9, the complement is 2.|Check before inserting the current item, so it cannot pair with itself.|Repeated values can still form a valid pair at different indices.|Expected time is O(n) with ordinary hash-table behavior; extra storage is O(n).','Return indices or values deliberately: callers need to know which interpretation they receive.')
add('dsa-motion-lab','Dynamic programming: reuse earlier answers','The number of ways to climb n steps using steps of size 1 or 2 can be built from the two smaller answers.',
'''def ways(n):
    if n < 0:
        raise ValueError("n must be nonnegative")
    previous, current = 1, 1
    for _ in range(2, n + 1):
        previous, current = current, previous + current
    return current

print(ways(4))
print(ways(0))''','5\n1\n',
'The final move is either one step from n−1 or two steps from n−2.|The base case n=0 counts one empty sequence; n=1 has one way.|Only the previous two counts are needed, so the code stores two integers.|There are O(n) updates and O(1) stored integer objects; integer bit sizes grow with n.','A recurrence plus base cases makes repeated subproblems explicit.')
add('dsa-motion-lab','Prefix sums answer range questions quickly','Precompute totals before each position. A range total is the difference between two prefix totals.',
'''values = [3, 1, 4, 2]
prefix = [0]
for value in values:
    prefix.append(prefix[-1] + value)

def range_sum(start, stop):
    return prefix[stop] - prefix[start]

print(prefix)
print(range_sum(1, 3))''','[0, 3, 4, 8, 10]\n5\n',
'prefix[k] holds the sum of values before index k.|The query uses a half-open range: start is included and stop is excluded.|For [1,3), subtract prefix[1]=3 from prefix[3]=8 to obtain 1+4=5.|Building costs O(n) time and storage; each valid query costs O(1).','If the underlying values change, this stored prefix array must be updated or rebuilt.')
add('unix-motion-lab','Print predictable lines with printf','Use a fixed set of fictional names as input. These examples target Bash with GNU/Linux utilities; they do not execute in the web page.',
r'''printf '%s\n' 'Ada' 'Ben' 'Cara' ''', 'Ada\nBen\nCara\n',
'printf is a shell command that formats arguments.|%s means print the next argument as text. The format’s \\n means end the line.|The format is reused for each remaining argument, producing one line per name.|Single quotes preserve text literally. This command has a format argument, not a dash-prefixed option.','Prefer printf for predictable formatting; echo handling of escapes varies across environments.')
add('unix-motion-lab','Find matching lines and show their positions','A pipe sends one command’s output to the next command’s input. grep selects lines matching a pattern.',
r'''printf '%s\n' 'INFO ready' 'ERROR disk' 'ERROR network' | grep -n 'ERROR' ''','2:ERROR disk\n3:ERROR network\n',
'printf supplies three lines to the pipe.|grep reads those lines from standard input.|-n prefixes each match with its original line number, starting at 1.|The pattern ERROR matches these uppercase strings; this example does not use -i for case-insensitive matching.','Line numbers refer to the input stream. grep normally returns status 1 when no line matches; that is not the same as a tool error.')
add('unix-motion-lab','Count repeated labels after sorting','uniq combines adjacent identical lines. Sorting first makes all identical labels adjacent.',
r'''export LC_ALL=C
printf '%s\n' 'red' 'blue' 'red' 'blue' 'red' | sort | uniq -c | awk '{print $1, $2}' ''','2 blue\n3 red\n',
'LC_ALL=C requests a consistent byte-oriented sorting locale for this example.|sort orders the lines; it does not count them.|uniq -c adds an occurrence count. The -c option means count.|awk prints its first and second whitespace-separated fields with one space, removing uniq’s padding from the displayed output.','uniq alone only notices adjacent duplicates, so input ordering matters.')
add('unix-motion-lab','Sort numbers as numbers','Text sorting and numerical sorting answer different questions. Specify the intended interpretation.',
r'''printf '%s\n' 10 2 30 | sort -n ''','2\n10\n30\n',
'The input lines contain decimal integer text.|sort -n compares numerical values instead of ordinary text order.|Without numerical comparison, text beginning with 1 may come before text beginning with 2.|Add -r together with -n if you deliberately want largest first; this example keeps ascending order.','GNU sort -n and -g have different numeric parsing rules. Use -g when you specifically need its general numeric format behavior.')
add('unix-motion-lab','Filter rows with awk and calculate a total','The fictional input has two whitespace-separated fields: a product name and a quantity.',
r'''printf '%s\n' 'pen 3' 'book 5' 'bag 2' | awk '$2 >= 3 {total += $2; print $1} END {print "total", total}' ''','pen\nbook\ntotal 8\n',
'$2 names the second field. The condition $2 >= 3 selects the first two rows.|Inside braces, total += $2 accumulates selected quantities and print $1 displays the product.|END runs once after all input lines and prints the accumulated total.|The single-quoted program is an awk argument, not a shell variable expression. There are no command flags in this example.','The field format is part of the example. This is not a general CSV parser with quoted commas or embedded newlines.')
add('unix-motion-lab','Replace text using sed','sed can transform a stream without changing any existing file. This example replaces a word on every line.',
r'''printf '%s\n' 'red red' 'blue red' | sed 's/red/green/g' ''','green green\nblue green\n',
's introduces substitution; the slashes separate pattern, replacement and modifiers.|red is the pattern and green is the replacement.|The final g replaces every match on each line. Without it, only the first match on each line is replaced.|No -i option is used: the transformed text goes to standard output, not back into a file.','sed patterns are regular expressions. Special characters need appropriate escaping when you intend literal matching.')
add('unix-motion-lab','Select a delimited field with cut','cut extracts positions or fields from simple delimited text.',
r'''printf '%s\n' 'Ada:10' 'Ben:20' | cut -d ':' -f 2 ''','10\n20\n',
'-d chooses the delimiter, here a colon.|-f 2 selects the second field on each input line.|Single quotes make the colon an explicit literal argument.|The names are omitted and the quantity field is printed on its own line.','For real CSV with quoting rules, use a CSV-aware parser rather than assuming cut handles every case.')
add('unix-motion-lab','Count a filtered result and inspect exit status','Commands communicate through both printed output and an exit status. They are different channels of information.',
r'''printf '%s\n' 'INFO ready' 'ERROR disk' 'ERROR network' | grep -c 'ERROR'
printf '%s\n' 'INFO ready' | grep -q 'ERROR'
status=$?
printf 'status=%s\n' "$status" ''','2\nstatus=1\n',
'grep -c prints the number of matching lines, here 2; it counts lines, not occurrences within each line.|grep -q runs quietly and prints no matches.|$? immediately after that pipeline is the status of its last command under this ordinary Bash pipeline configuration. Save it before another command changes it.|Status 1 means no match for grep. The quoted "$status" passes one argument to printf.','These commands are for an ordinary interactive Bash session without set -e; automatic exit-on-failure scripts need deliberate handling of no-match results.')
add('ml-motion-lab','Make a numeric prediction and inspect every contribution','A weighted sum is the same arithmetic as a shopping bill. Each feature contributes its value times its weight.',
'''features = [2, 3]
weights = [4, -1]
contributions = [x * w for x, w in zip(features, weights)]
bias = 1
prediction = sum(contributions) + bias
print(contributions)
print(prediction)''','[8, -3]\n6\n',
'Each feature pairs with its corresponding weight; the assumed list lengths match.|The contributions are 2×4=8 and 3×(−1)=−3.|Their sum is 5, then the fixed bias adds 1.|zip stops at the shorter input, so production code should validate equal lengths rather than silently accept mismatches.','A negative weight reduces a score; its meaning depends on the feature and fitted model.')
add('ml-motion-lab','Measure prediction error with MSE','Mean squared error turns a list of residuals into one nonnegative summary.',
'''actual = [2, 4, 6]
predicted = [1, 5, 6]
errors = [p - y for p, y in zip(predicted, actual)]
squares = [e * e for e in errors]
print(errors)
print(squares)
print(f"MSE={sum(squares) / len(squares):.4f}")''','[-1, 1, 0]\n[1, 1, 0]\nMSE=0.6667\n',
'Subtract actual from predicted consistently to define each residual.|Squaring prevents negative and positive residuals from canceling.|Sum the squares and divide by the number of examples.|:.4f displays four decimal places; the internal division is not rounded at that earlier step.','MSE emphasizes larger errors and uses squared target units. It is not the only sensible loss.')
add('ml-motion-lab','Follow gradient descent for three steps','This is a one-parameter training example with a known minimum at w=3.',
'''w = 0.0
rate = 0.1
for step in range(1, 4):
    gradient = 2 * (w - 3)
    w -= rate * gradient
    loss = (w - 3) ** 2
    print(f"step={step} w={w:.4f} loss={loss:.4f}")''','step=1 w=0.6000 loss=5.7600\nstep=2 w=1.0800 loss=3.6864\nstep=3 w=1.4640 loss=2.3593\n',
'The derivative of (w−3)² is 2(w−3), evaluated at the current w.|Subtract rate times gradient to move locally downhill.|Recalculate loss after the update so the printed weight and loss match.|The loss decreases here; a rate that is too large can make this same procedure diverge.','An optimization example is not evidence that every model will find a global minimum.')
add('ml-motion-lab','Calculate softmax without enormous exponentials','Softmax turns scores into positive values summing to one. Subtracting a shared maximum leaves the probabilities unchanged.',
'''from math import exp
scores = [1000.0, 1001.0]
largest = max(scores)
scaled = [exp(x - largest) for x in scores]
total = sum(scaled)
probabilities = [x / total for x in scaled]
print([round(p, 4) for p in probabilities])
print(f"sum={sum(probabilities):.4f}")''','[0.2689, 0.7311]\nsum=1.0000\n',
'Direct exp(1000) can overflow; shifting gives exponent arguments −1 and 0.|Exponentials are positive, then division by their sum normalizes them.|The larger score receives the larger probability.|The example rounds only the displayed list. Very tiny probabilities can still underflow in extreme cases; log-softmax is useful when log probabilities are needed.','A numerically stable formula can be algebraically equivalent to an unstable one.')
add('ml-motion-lab','Compute a Bayes update with counts','Fictional item flags illustrate why a useful detector can still produce many false alarms.',
'''faulty_and_flagged = 8
good_and_flagged = 18
flagged = faulty_and_flagged + good_and_flagged
posterior = faulty_and_flagged / flagged
print(f"Flagged: {flagged}")
print(f"Faulty among flagged: {posterior:.2%}")''','Flagged: 26\nFaulty among flagged: 30.77%\n',
'Restrict attention to the group already known to be flagged.|Count all flags, including false alarms, to obtain the correct denominator.|Divide the faulty flags by all flags.|:.2% converts a fraction into a displayed percentage with two decimal places.','This is the probability of a fault given a flag, not the probability of a flag given a fault.')
add('ml-motion-lab','Build an attention-weighted mixture','Attention mixes value vectors using weights. This example supplies the weights so the mixing step is easy to inspect.',
'''weights = [0.25, 0.75]
values = [[2, 0], [0, 4]]
result = [
    sum(weight * value[j] for weight, value in zip(weights, values))
    for j in range(2)
]
print(result)''','[0.5, 3.0]\n',
'Each value vector has two coordinates.|For the first coordinate, calculate 0.25×2+0.75×0=0.5.|For the second, calculate 0.25×0+0.75×4=3.|A complete attention layer calculates weights from queries and keys; this snippet isolates the weighted-value calculation.','The vector output keeps its coordinate dimension while combining information across positions.')
add('ml-motion-lab','Standardize using training information only','Preprocessing is part of the fitted procedure. Use the training mean and scale for later examples.',
'''from statistics import mean, pstdev
train = [2, 4, 6]
center = mean(train)
scale = pstdev(train)
new_value = 8
z = (new_value - center) / scale
print(f"mean={center:.1f} scale={scale:.4f}")
print(f"new z={z:.4f}")''','mean=4.0 scale=1.6330\nnew z=2.4495\n',
'mean computes the training center. pstdev uses the population denominator over the training values for this scaling convention.|The new value does not enter the fitted mean or scale.|Subtract the stored center and divide by the stored positive scale.|A constant training feature has zero scale and needs an explicit handling rule before division.','Including held-out data in fitted preprocessing can leak information into evaluation.')
add('ml-motion-lab','Check a tiny classifier beyond accuracy','Counts of true and false positives answer different questions from overall accuracy.',
'''tp, fp, fn, tn = 30, 10, 20, 40
precision = tp / (tp + fp)
recall = tp / (tp + fn)
accuracy = (tp + tn) / (tp + fp + fn + tn)
print(f"precision={precision:.2f}")
print(f"recall={recall:.2f}")
print(f"accuracy={accuracy:.2f}")''','precision=0.75\nrecall=0.60\naccuracy=0.70\n',
'Precision asks how many predicted positives were actually positive.|Recall asks how many actual positives were found.|Accuracy counts all correct labels over all labels.|The example denominators are nonzero; a reusable implementation needs a documented convention for undefined precision or recall.','Choose metrics that match the consequences of mistakes, not only the largest-looking score.')
add('statistics-lab','Mean, median and two variance conventions','The standard library can calculate common summaries, but you still need to choose the correct interpretation.',
'''from statistics import mean, median, pvariance, variance
values = [2, 4, 6, 8]
print(f"mean={mean(values):.1f}")
print(f"median={median(values):.1f}")
print(f"population variance={pvariance(values):.4f}")
print(f"sample variance={variance(values):.4f}")''','mean=5.0\nmedian=5.0\npopulation variance=5.0000\nsample variance=6.6667\n',
'The mean is 20/4=5. The median averages the middle pair 4 and 6.|Squared distances from 5 are 9,1,1,9; their sum is 20.|pvariance divides by 4, treating this list as the described population.|variance divides by 3 for the usual sample-variance estimator. It requires at least two values.','Different denominator conventions answer different questions; neither should be chosen to manipulate a result.')
add('statistics-lab','Build a frequency table with percentages','Count labels first, then divide by the explicitly defined sample size.',
'''from collections import Counter
answers = ["yes", "no", "yes", "yes", "no"]
counts = Counter(answers)
for label in sorted(counts):
    count = counts[label]
    print(f"{label}: {count} ({count / len(answers):.0%})")''','no: 2 (40%)\nyes: 3 (60%)\n',
'Counter counts each occurrence of each label.|The denominator is all five answers in this example.|Sorting gives a predictable output order for comparison with the expected output.|Missing or multiple-response answers would require an explicit denominator policy.','A percentage is meaningful only after its whole has been defined.')
add('statistics-lab','Weighted averages for unequal groups','Combining group averages requires group sizes when the target is the overall observation-level mean.',
'''group_means = [10, 20]
group_sizes = [2, 8]
total = sum(m * n for m, n in zip(group_means, group_sizes))
combined = total / sum(group_sizes)
print(f"combined mean={combined:.1f}")
print(f"unweighted group mean={sum(group_means) / 2:.1f}")''','combined mean=18.0\nunweighted group mean=15.0\n',
'A group’s mean times its size recovers its total.|Combine totals 20 and 160, then divide by the 10 observations.|The unweighted mean gives each group equal influence, despite different sizes.|Both calculations can have a purpose, but they answer different questions.','Weight by observation count only when an individual-level combined mean is the target.')
add('statistics-lab','Compute an exact binomial probability','This calculates one count probability directly for a small independent-trial model.',
'''from math import comb
n, k, p = 3, 2, 0.5
probability = comb(n, k) * p ** k * (1 - p) ** (n - k)
print(f"arrangements={comb(n, k)}")
print(f"probability={probability:.3f}")''','arrangements=3\nprobability=0.375\n',
'comb(3,2) counts which two trial positions are successes.|p**k is the contribution from successes and (1-p)**(n-k) from failures.|The combination factor includes all three successful arrangements.|The model assumes fixed n, independent trials and the same p in each trial.','The formula gives a model probability, not a guarantee about a particular sample.')
add('statistics-lab','Show the working in a normal-approximation interval','This example uses an explicitly supplied standard error and normal critical multiplier. It is not a universal small-sample recipe.',
'''estimate = 50.0
standard_error = 2.0
critical_value = 1.96
margin = critical_value * standard_error
print(f"margin={margin:.2f}")
print(f"interval=[{estimate - margin:.2f}, {estimate + margin:.2f}]")''','margin=3.92\ninterval=[46.08, 53.92]\n',
'A standard error describes uncertainty in the estimate, not spread of individual observations.|Multiply by the critical value to obtain the margin.|Subtract and add the margin to build the interval.|Normal approximation and standard-error validity need justification; a t or design-based method may be appropriate instead.','The confidence interpretation belongs to the interval procedure and its assumptions.')
add('statistics-lab','Analyze paired changes rather than unrelated groups','Before and after values must remain matched to the same units.',
'''from statistics import mean, stdev
from math import sqrt
before = [5, 7, 9, 10]
after = [6, 9, 12, 14]
differences = [b - a for a, b in zip(before, after)]
average = mean(differences)
se = stdev(differences) / sqrt(len(differences))
print(differences)
print(f"mean change={average:.4f}")
print(f"SE={se:.4f}")
print(f"t={average / se:.4f}")''','[1, 2, 3, 4]\nmean change=2.5000\nSE=0.6455\nt=3.8730\n',
'Subtract before from after for each matched unit, yielding the differences.|Calculate the mean and sample SD of differences, not two unrelated outcome SDs.|Divide that SD by √number of pairs to get the SE under the independence assumptions.|The statistic needs an appropriate t reference with 3 degrees of freedom for a p-value; this snippet stops at the statistic.','A paired analysis depends on valid matching and appropriate assumptions about the differences.')
add('statistics-lab','Fit a small least-squares line','This hand-written calculation exposes the arithmetic of simple regression without an external package.',
'''from statistics import mean
x, y = [1, 2, 3], [2, 4, 5]
mx, my = mean(x), mean(y)
numerator = sum((a - mx) * (b - my) for a, b in zip(x, y))
denominator = sum((a - mx) ** 2 for a in x)
slope = numerator / denominator
intercept = my - slope * mx
print(f"slope={slope:.4f}")
print(f"intercept={intercept:.4f}")
print(f"prediction at 4={intercept + slope * 4:.4f}")''','slope=1.5000\nintercept=0.6667\nprediction at 4=6.6667\n',
'Center x and y around their own means.|The slope is their centered cross-product sum divided by the centered x squared sum.|Choose the intercept so the line passes through the two means.|Prediction at 4 is beyond the observed x range 1–3, so it is an extrapolation that needs caution.','If every x were equal, the denominator would be zero and this slope would not be identifiable.')
add('statistics-lab','Enumerate all bootstrap resamples of a tiny sample','For three observations there are only 3³=27 ordered same-size bootstrap samples, so exact enumeration is practical as a demonstration.',
'''from itertools import product
from statistics import mean
values = [2, 4, 6]
bootstrap_means = [mean(sample) for sample in product(values, repeat=3)]
print(f"resamples={len(bootstrap_means)}")
print(f"average of means={mean(bootstrap_means):.1f}")
print(f"range={min(bootstrap_means):.1f} to {max(bootstrap_means):.1f}")''','resamples=27\naverage of means=4.0\nrange=2.0 to 6.0\n',
'product with repeat=3 lists ordered draws with replacement, including repetitions such as (2,2,6).|Each ordered resample has equal probability under this empirical sampling model.|Compute a mean for every resample to examine a bootstrap distribution.|The full minimum-to-maximum range is not a 95% confidence interval. Enumeration grows exponentially and is only for this tiny example.','Resampling reuses observed information; it does not create 27 new independent real-world studies.')

names={'python-motion-lab':'Python Lab','dsa-motion-lab':'DSA Lab','unix-motion-lab':'Unix Lab','ml-motion-lab':'ML Lab','statistics-lab':'Statistics Lab'}
for lab,examples in guides.items():
    sections=[]
    for i,e in enumerate(examples,1):
        sections.append(f'''<article class="guide-example panel" id="example-{i}"><p class="eyebrow">EXAMPLE {i} · {e['language'].upper()}</p><h2>{h(e['title'])}</h2><p>{h(e['idea'])}</p><h3>Complete code</h3><button class="copy-code" data-code="code-{i}">Copy code</button><pre><code id="code-{i}">{h(e['code'].strip())}</code></pre><h3>Expected output</h3><pre class="expected-output"><code>{h(e['output'].rstrip())}</code></pre><h3>Read it step by step</h3><ol>{''.join('<li>'+h(s)+'</li>' for s in e['steps'])}</ol><p class="guide-takeaway"><strong>Remember:</strong> {h(e['lesson'])}</p><a href="#guide-index">Back to example list</a></article>''')
    setup='Use Bash with GNU/Linux tools. These snippets use fictional input streams and do not alter existing files. Run one complete example at a time. Outputs are authored for the shown input; this Windows authoring environment has no Bash/WSL installation to execute them.' if lab=='unix-motion-lab' else 'Use Python 3. All examples use only the standard library. Copy one complete example into a .py file and run it with python filename.py. Each example starts independently; the page displays code and does not run it.'
    document=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{names[lab]} · Worked code examples</title><link rel="stylesheet" href="../reading.css"></head><body class="code-guide"><a class="skip" href="#main">Skip to content</a><header><a href="../index.html">Dashboard</a><a href="index.html">Return to {names[lab]}</a></header><main id="main"><h1>{names[lab]}: worked code examples</h1><p>Read the idea, run the code, compare the output, and follow each explanation. All input data is fictional.</p><section class="panel"><h2>How to run these examples</h2><p>{h(setup)}</p></section><nav id="guide-index" class="panel" aria-label="Examples"><h2>Choose an example</h2><ol>{''.join(f'<li><a href="#example-{i}">{h(e["title"])}</a></li>' for i,e in enumerate(examples,1))}</ol></nav>{''.join(sections)}</main><p id="copy-status" role="status" aria-live="polite"></p><script src="../study-copy.js"></script></body></html>'''
    (ROOT/lab/'worked-examples.html').write_text(document,encoding='utf-8')
(ROOT/'scripts/study-examples.json').write_text(json.dumps(guides,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Built {sum(map(len,guides.values()))} worked code examples across {len(guides)} labs.')
