"""Original, fictional section projects. Python examples assert key results."""
import textwrap
PROJECTS=[]
def add(lab,section,title,goal,code,steps,meaning,variation,output=None):
    PROJECTS.append(dict(lab=lab,section=section,title=title,goal=goal,code=textwrap.dedent(code).strip(),steps=steps.split('|'),meaning=meaning,variation=variation,output=output,language='bash' if lab=='unix-motion-lab' else 'python'))

P='python-motion-lab'
add(P,'Concurrency','Process a batch with worker threads','Submit independent tasks, collect their results in order, and handle a failed item without losing the rest.', '''
from concurrent.futures import ThreadPoolExecutor

def inspect_item(item):
    name, quantity = item
    if quantity < 0:
        raise ValueError("quantity cannot be negative")
    return name, quantity * 10

def process_batch(items):
    results = []
    with ThreadPoolExecutor(max_workers=2) as pool:
        futures = [pool.submit(inspect_item, item) for item in items]
        # Reading futures in submission order makes this report deterministic.
        for item, future in zip(items, futures):
            try:
                name, value = future.result()
                results.append((name, value))
            except ValueError as error:
                print(f"Rejected {item[0]}: {error}")
    return results

items = [("notebook", 3), ("pencil", -1), ("folder", 2)]
results = process_batch(items)
for name, value in results:
    print(f"{name}: {value}")
print("Total:", sum(value for _, value in results))
assert results == [("notebook", 30), ("folder", 20)]
assert process_batch([]) == []
''','A task receives one tuple and rejects negative quantities before computing.|The pool owns two worker threads; submit returns a Future representing each task.|future.result waits for that task and re-raises its exception in the caller.|The with block waits for workers and releases the pool. Results are printed in input order.','The rejected pencil is excluded, and the two valid amounts sum to 50. This small arithmetic example teaches orchestration, not a speedup: threads are usually useful for I/O waits, not GIL-bound CPU work.','Add another valid item and predict the new total before running.')
add(P,'Memory & objects','Copy a nested shopping basket safely','Compare shared references, shallow copies, and independent deep copies.', '''
from copy import deepcopy

def total(basket):
    return sum(item["price"] * item["quantity"] for item in basket)

def show(label, basket):
    quantities = [item["quantity"] for item in basket]
    print(f"{label}: quantities={quantities}, total={total(basket)}")

original = [
    {"name": "book", "price": 10, "quantity": 1},
    {"name": "pen", "price": 2, "quantity": 2},
]
alias = original
shallow = original.copy()
independent = deepcopy(original)

shallow[0]["quantity"] = 3
show("original", original)
show("alias", alias)
show("shallow", shallow)
show("deep copy", independent)
print("Same outer list:", shallow is original)
print("Same first dictionary:", shallow[0] is original[0])
assert total(original) == 34
assert total(independent) == 14
assert alias is original
''','The basket is a list containing dictionaries; there are two levels of objects.|Assignment creates another name for the same outer list.|copy makes a new list but shares each dictionary, so a nested edit is visible through both lists.|deepcopy recursively copies these ordinary containers, preserving the earlier independent quantities.','The outer lists can differ while their nested items are identical objects. A copy strategy must match which level your program will change.','Append a third item only to shallow; explain why that append does not change original.')
add(P,'Iteration','Read, validate and summarize rows lazily','Build a generator pipeline that cleans input before calculating totals.', '''
def parsed_rows(lines):
    for number, line in enumerate(lines, start=1):
        fields = line.strip().split(",")
        if len(fields) != 2:
            print(f"Skip line {number}: expected two fields")
            continue
        name, text = fields
        try:
            quantity = int(text)
        except ValueError:
            print(f"Skip line {number}: not an integer")
            continue
        if quantity < 0:
            print(f"Skip line {number}: negative quantity")
            continue
        yield name, quantity

lines = ["apple,3", "pear,2", "apple,4", "bad,row", "missing"]
totals = {}
for name, quantity in parsed_rows(lines):
    totals[name] = totals.get(name, 0) + quantity
for name in sorted(totals):
    print(f"{name}: {totals[name]}")
assert totals == {"apple": 7, "pear": 2}
iterator = parsed_rows(["plum,1"])
assert list(iterator) == [("plum", 1)]
assert list(iterator) == []  # A generator is exhausted after consumption.
''','enumerate adds human-readable line numbers starting at one.|Each malformed line is skipped with a specific explanation; valid rows are yielded one at a time.|The consumer accumulates quantities with a dictionary rather than storing all parsed rows.|A generator remembers where it paused and is exhausted once it finishes.','Only valid quantities contribute. This deliberately simple comma format does not support quoted commas; use csv.reader for actual CSV.','Add a blank line, a zero quantity and another apple row; predict which affect the total.')
add(P,'Functions','Calculate invoices with small reusable functions','Separate validation, per-line calculations and reporting so each operation can be tested.', '''
def line_total(price_cents, quantity):
    if price_cents < 0 or quantity < 0:
        raise ValueError("price and quantity must be nonnegative")
    return price_cents * quantity

def invoice(items, discount_cents=0):
    subtotal = sum(line_total(price, quantity) for _, price, quantity in items)
    if not 0 <= discount_cents <= subtotal:
        raise ValueError("discount must be between zero and subtotal")
    return {"subtotal": subtotal, "discount": discount_cents,
            "due": subtotal - discount_cents}

def money(cents):
    return f"{cents // 100}.{cents % 100:02d}"

items = [("notebook", 250, 3), ("pen", 125, 2)]
bill = invoice(items, discount_cents=100)
for label, amount in bill.items():
    print(f"{label}: {money(amount)}")
assert line_total(250, 3) == 750
assert bill["due"] == 900
assert invoice([])["due"] == 0
try:
    invoice(items, discount_cents=2000)
except ValueError as error:
    print("Rejected:", error)
''','line_total validates one item; invoice combines those results.|The default discount is zero, but callers can supply a named argument.|Integer cents avoid fractional binary floating-point rounding for these amounts.|money formats the integer amount without changing it; returned data remains suitable for checks.','The subtotal is 10.00, discount is 1.00 and amount due is 9.00. This is a teaching invoice, without tax or currency-conversion rules.','Add a shipping_cents parameter, validate it and include it in the amount due.')
add(P,'Classes & design','Model a small lending library','Keep state and the rules for changing that state together in a class.', '''
from dataclasses import dataclass

@dataclass
class Book:
    title: str
    available: int

    def borrow(self):
        if self.available <= 0:
            raise ValueError("no copies available")
        self.available -= 1

    def return_copy(self):
        self.available += 1

catalog = {"B1": Book("Learning Python", 2),
           "B2": Book("Algorithms", 1)}
requests = ["B1", "B1", "B1", "B2"]
for identifier in requests:
    book = catalog[identifier]
    try:
        book.borrow()
        print(f"Borrowed: {book.title}")
    except ValueError as error:
        print(f"Unavailable: {book.title} ({error})")
catalog["B1"].return_copy()
for identifier, book in catalog.items():
    print(f"{identifier}: {book.available} remaining")
assert catalog["B1"].available == 1
assert catalog["B2"].available == 0
''','dataclass creates initialization and readable representations from declared fields.|Each instance keeps its own title and available count.|borrow checks the rule before mutating state, so a rejected loan leaves the count unchanged.|The catalog maps identifiers to objects; reporting reads their final state.','This shows encapsulation but not a complete lending system: real returns need loan records to prevent returning unborrowed copies.','Track borrower IDs and reject a return unless that borrower has an outstanding loan.')
add(P,'Python toolkit','Turn CSV input into a checked JSON report','Use standard-library parsers and decimal arithmetic for a small data-processing task.', '''
import csv
import io
import json
from decimal import Decimal

source = "item,price,quantity\\nbook,12.50,2\\npen,1.25,4\\n"
rows = csv.DictReader(io.StringIO(source))
report = []
grand_total = Decimal("0")
for row in rows:
    price = Decimal(row["price"])
    quantity = int(row["quantity"])
    if price < 0 or quantity < 0:
        raise ValueError("negative amount")
    amount = price * quantity
    grand_total += amount
    report.append({"item": row["item"], "amount": f"{amount:.2f}"})

document = {"lines": report, "total": f"{grand_total:.2f}"}
encoded = json.dumps(document, indent=2)
print(encoded)
decoded = json.loads(encoded)
assert decoded["total"] == "30.00"
assert len(decoded["lines"]) == 2
assert Decimal(decoded["lines"][0]["amount"]) == Decimal("25.00")
''','StringIO provides an in-memory file interface, so no existing files are touched.|DictReader maps each row to the column names from the first line.|Decimal reads prices from strings and avoids binary rounding for these decimal amounts.|JSON stores the formatted decimal amounts as strings; loads reconstructs the document for checks.','The two line amounts are 25.00 and 5.00, giving 30.00. Unexpected columns and malformed numbers would need an explicit error-reporting policy in a larger importer.','Add a third CSV row, then verify the report total and the number of lines.')

M='ml-motion-lab'
add(M,'01 · Foundations','Build a prediction and error report','Follow features, parameters, predictions and targets through one complete calculation.', '''
def predict(hours, weight, bias):
    return weight * hours + bias

def evaluate(rows, weight, bias):
    if not rows:
        raise ValueError("need at least one example")
    squared_errors = []
    for hours, target in rows:
        estimate = predict(hours, weight, bias)
        error = estimate - target
        squared_errors.append(error ** 2)
        print(f"hours={hours}, target={target}, predicted={estimate}, error={error}")
    return sum(squared_errors) / len(squared_errors)

data = [(1, 3), (2, 5), (3, 8)]
weight, bias = 2, 1
mse = evaluate(data, weight, bias)
print(f"MSE: {mse:.4f}")
print("New prediction:", predict(4, weight, bias))
assert predict(2, weight, bias) == 5
assert abs(mse - 1 / 3) < 1e-12
try:
    evaluate([], weight, bias)
except ValueError as error:
    print("Empty input:", error)
''','Each row contains one feature and its known target.|weight and bias define a fixed rule; this program evaluates it but does not train it.|Signed errors show over- or underprediction; squaring prevents cancellation.|The average squared error summarizes these three rows; a separate call predicts a new input.','Only the last row is wrong, by -1, so MSE is one third. A new prediction is not a known answer until it is checked against new data.','Change the bias to zero and compare every error, not only the final average.')
add(M,'02 · Linear algebra','Apply a matrix transformation to a batch','Implement shape checking and matrix multiplication without external libraries.', '''
def shape(matrix):
    if not matrix or not matrix[0]:
        raise ValueError("empty matrix")
    width = len(matrix[0])
    if any(len(row) != width for row in matrix):
        raise ValueError("ragged rows")
    return len(matrix), width

def matmul(left, right):
    rows, inner = shape(left)
    other_inner, columns = shape(right)
    if inner != other_inner:
        raise ValueError("inner dimensions differ")
    return [[sum(left[i][k] * right[k][j] for k in range(inner))
             for j in range(columns)] for i in range(rows)]

features = [[1, 2], [3, 4], [5, 6]]
weights = [[2, 0], [1, 3]]
result = matmul(features, weights)
print("Input shape:", shape(features))
print("Output shape:", shape(result))
for row in result:
    print(row)
assert result == [[4, 6], [10, 12], [16, 18]]
assert matmul([[1, 0], [0, 1]], weights) == weights
''','shape checks that rows have consistent lengths.|The feature matrix is 3 by 2; the weights are 2 by 2, so the result is 3 by 2.|Each output entry is a row-column dot product; the shared inner dimension is summed away.|The identity-matrix assertion checks that an identity transformation preserves the weights.','For the first row, the first output is 1×2 + 2×1 = 4; the second is 1×0 + 2×3 = 6.','Add a third output column and predict the new matrix shape before computing it.')
add(M,'03 · Calculus','Check an analytic gradient with finite differences','Compare a derived gradient with a numerical approximation, then take a small descent step.', '''
def loss(weight, rows):
    return sum((weight * x - y) ** 2 for x, y in rows) / len(rows)

def gradient(weight, rows):
    return 2 * sum((weight * x - y) * x for x, y in rows) / len(rows)

def numerical_gradient(weight, rows, step):
    return (loss(weight + step, rows) - loss(weight - step, rows)) / (2 * step)

rows = [(1, 2), (2, 4), (3, 6)]
weight = 0.5
analytic = gradient(weight, rows)
print(f"Analytic gradient: {analytic:.4f}")
for step in [0.1, 0.01, 0.001]:
    estimate = numerical_gradient(weight, rows, step)
    print(f"step={step}: numerical={estimate:.4f}")
    assert abs(analytic - estimate) < 1e-8
before = loss(weight, rows)
new_weight = weight - 0.05 * analytic
after = loss(new_weight, rows)
print(f"Weight: {weight:.4f} -> {new_weight:.4f}")
print(f"Loss: {before:.4f} -> {after:.4f}")
assert after < before
''','The loss is the mean of squared prediction errors.|The chain rule contributes both 2×error and the feature x to the derivative.|Central differences compare nearby loss values on either side of the weight.|Subtracting a small learning-rate multiple of the gradient reduces this particular loss.','Finite differences are a debugging approximation, not proof that every derivative is correct. Very small steps suffer floating-point cancellation.','Try a learning rate of 1 and inspect whether the loss still decreases; remove the descent assertion only after explaining its failure.')
add(M,'04 · Probability','Compute Bayes probabilities from a frequency table','Build the numerator and denominator from fictional counts rather than memorizing a formula.', '''
table = {
    "red": {"striped": 30, "plain": 20},
    "blue": {"striped": 10, "plain": 40},
}
total = sum(sum(row.values()) for row in table.values())
red_total = sum(table["red"].values())
striped_total = sum(row["striped"] for row in table.values())

def fraction(numerator, denominator):
    if denominator == 0:
        raise ValueError("conditioning group is empty")
    return numerator / denominator

prior = fraction(red_total, total)
likelihood = fraction(table["red"]["striped"], red_total)
evidence = fraction(striped_total, total)
posterior = likelihood * prior / evidence
direct = fraction(table["red"]["striped"], striped_total)
print(f"P(red) = {prior:.2f}")
print(f"P(striped | red) = {likelihood:.2f}")
print(f"P(striped) = {evidence:.2f}")
print(f"P(red | striped) = {posterior:.2f}")
assert abs(posterior - direct) < 1e-12
assert abs(posterior - 0.75) < 1e-12
''','The full table has 100 objects and the red group has 50.|Among the red objects, 30 of 50 are striped: this is the likelihood.|Among all objects, 40 are striped: this is the evidence probability.|Conditioning on striped changes the denominator to 40; 30 of those are red.','P(striped|red) is 0.60, while P(red|striped) is 0.75. Reversing a conditional probability changes the group you divide by.','Double the number of plain blue objects and recalculate both the prior and posterior.')
add(M,'05 · Statistics','Fit preprocessing using training data only','Standardize training and held-out values without leaking test information into fitted statistics.', '''
from math import sqrt

def fit_scaler(values):
    if not values:
        raise ValueError("training values are required")
    mean = sum(values) / len(values)
    variance = sum((x - mean) ** 2 for x in values) / len(values)
    scale = sqrt(variance)
    if scale == 0:
        scale = 1.0  # Explicit convention for a constant training feature.
    return mean, scale

def transform(values, fitted):
    mean, scale = fitted
    return [(x - mean) / scale for x in values]

training = [1, 2, 3]
testing = [4, 10]
fitted = fit_scaler(training)
train_scaled = transform(training, fitted)
test_scaled = transform(testing, fitted)
print(f"Training mean: {fitted[0]:.3f}; scale: {fitted[1]:.3f}")
print("Train:", [round(x, 3) for x in train_scaled])
print("Test:", [round(x, 3) for x in test_scaled])
assert abs(sum(train_scaled)) < 1e-12
assert transform([7, 8], fit_scaler([7, 7])) == [0.0, 1.0]
''','fit_scaler learns two numbers from training data only.|The divisor n defines population-style variance for preprocessing, not an unbiased sample-variance estimator.|transform uses the already learned mean and scale on any later values.|An explicit scale of one prevents division by zero for a constant feature.','Test values can lie far beyond the training range. Recomputing the scaler on test data would change the model pipeline and leak information.','Add an extreme test value and verify that the training mean and scale stay unchanged.')
add(M,'06 · Information theory','Compare probability forecasts with cross-entropy','Measure how confidently a model assigns probability to the observed class.', '''
from math import log

def log_loss(probabilities, labels):
    if len(probabilities) != len(labels) or not labels:
        raise ValueError("need matching nonempty inputs")
    losses = []
    for distribution, label in zip(probabilities, labels):
        if any(p <= 0 or p > 1 for p in distribution):
            raise ValueError("this example requires positive probabilities")
        if abs(sum(distribution) - 1) > 1e-10:
            raise ValueError("probabilities must sum to one")
        losses.append(-log(distribution[label]))
    return sum(losses) / len(losses)

labels = [0, 1, 0]
confident = [[0.9, 0.1], [0.2, 0.8], [0.8, 0.2]]
uncertain = [[0.5, 0.5]] * 3
wrong = [[0.1, 0.9], [0.8, 0.2], [0.2, 0.8]]
scores = {}
for name, predictions in [("confident", confident), ("uncertain", uncertain), ("wrong", wrong)]:
    scores[name] = log_loss(predictions, labels)
    print(f"{name}: {scores[name]:.4f} nats")
assert scores["confident"] < scores["uncertain"] < scores["wrong"]
''','Each probability vector describes two mutually exclusive classes.|Indexing by the observed label selects the probability assigned to the correct class.|Negative natural logarithms penalize small correct-class probabilities strongly.|Averaging yields cross-entropy for one-hot labels; natural logs measure it in nats.','Confident correct forecasts have smaller loss. Confident wrong forecasts are much worse than uncertain forecasts, even when the label decision alone hides that difference.','Change one correct-class probability to 0.01 and inspect how much it affects the average.')
add(M,'07 · Optimization','Train a one-parameter model with gradient descent','Run repeated parameter updates and compare the learned value with a known solution.', '''
def loss(weight, examples):
    return sum((weight * x - y) ** 2 for x, y in examples) / len(examples)

def gradient(weight, examples):
    return 2 * sum(x * (weight * x - y) for x, y in examples) / len(examples)

def train(examples, rate, iterations):
    weight = 0.0
    history = []
    for step in range(iterations + 1):
        current_loss = loss(weight, examples)
        history.append(current_loss)
        if step in {0, 1, 5, iterations}:
            print(f"step={step:2d} weight={weight:.4f} loss={current_loss:.6f}")
        if step < iterations:
            weight -= rate * gradient(weight, examples)
    return weight, history

rows = [(1, 2), (2, 4), (3, 6)]
weight, history = train(rows, rate=0.05, iterations=30)
print(f"Prediction at x=4: {weight * 4:.4f}")
assert abs(weight - 2) < 1e-6
assert all(b <= a for a, b in zip(history, history[1:]))
''','The data were constructed with y=2x, so the exact best weight is known.|The loop records loss before each update, including the final state.|The learning rate scales how far each step moves against the gradient.|Assertions check both the learned solution and decreasing loss for this chosen setting.','This small convex problem has a simple solution; the same rate and monotonic behavior are not guaranteed for arbitrary neural networks.','Add noisy targets, then compare the best weight with 2 instead of expecting exact recovery.')
add(M,'08 · Mathematics inside models','Run a tiny neural-network forward pass','Trace matrix-like weighted sums, ReLU activations and normalized class scores.', '''
from math import exp

def dense(values, weights, biases):
    if len(weights) != len(biases):
        raise ValueError("one bias is required for each output")
    if any(len(row) != len(values) for row in weights):
        raise ValueError("weight dimensions do not match inputs")
    return [sum(x * w for x, w in zip(values, row)) + bias
            for row, bias in zip(weights, biases)]

def softmax(scores):
    maximum = max(scores)
    terms = [exp(score - maximum) for score in scores]
    return [term / sum(terms) for term in terms]

inputs = [2, -1]
hidden_raw = dense(inputs, [[1, 1], [-1, 2]], [0, 1])
hidden = [max(0, value) for value in hidden_raw]
scores = dense(hidden, [[2, 1], [-1, 1]], [0, 0])
probabilities = softmax(scores)
print("Hidden before ReLU:", hidden_raw)
print("Hidden after ReLU:", hidden)
print("Class scores:", scores)
print("Probabilities:", [round(p, 4) for p in probabilities])
print("Predicted class:", max(range(2), key=probabilities.__getitem__))
assert hidden == [1, 0]
assert abs(sum(probabilities) - 1) < 1e-12
''','Each weight row produces one output unit; its dot product receives a bias.|ReLU replaces negative values with zero.|A second dense layer converts hidden activations into two class scores.|Subtracting the largest score makes softmax more numerically stable without changing the probability ratios.','This is inference with hand-selected weights, not a trained or validated classifier. The result demonstrates computation, not model accuracy.','Change one input and calculate the hidden values by hand before running the program.')
add(M,'09 · Advanced connections','Group points with a small k-means loop','Alternate nearest-center assignments and center updates on fictional two-dimensional points.', '''
def squared_distance(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b))

def assign(points, centers):
    return [min(range(len(centers)), key=lambda j: squared_distance(point, centers[j]))
            for point in points]

def update(points, labels, centers):
    updated = []
    for j, old_center in enumerate(centers):
        members = [p for p, label in zip(points, labels) if label == j]
        # Keep the old center if its group is empty.
        updated.append(tuple(sum(p[d] for p in members) / len(members)
                             for d in range(2)) if members else old_center)
    return updated

points = [(0, 0), (0, 2), (8, 8), (8, 10)]
centers = [(0, 0), (8, 8)]
for iteration in range(3):
    labels = assign(points, centers)
    centers = update(points, labels, centers)
    print(f"iteration={iteration + 1}, labels={labels}, centers={centers}")
inertia = sum(squared_distance(p, centers[j]) for p, j in zip(points, labels))
print(f"Within-group squared distance: {inertia:.1f}")
assert centers == [(0.0, 1.0), (8.0, 9.0)]
assert inertia == 4
''','Squared distance measures closeness to each current center.|Assignment chooses the closest center, with the first center winning ties.|Update replaces each nonempty center with the coordinate-wise mean of its members.|The final sum of squared distances is the k-means objective for this assignment.','The two groups are obvious in this toy dataset. Initialization, scaling and the chosen number of groups can change real results; groups do not automatically represent meaningful categories.','Move one point between the groups and try a different pair of starting centers.')
add(M,'10 · Generative mathematics','Calculate a toy attention-weighted representation','Turn query-key similarities into weights and combine value vectors.', '''
from math import exp, sqrt

def dot(a, b):
    if len(a) != len(b):
        raise ValueError("vector lengths differ")
    return sum(x * y for x, y in zip(a, b))

def softmax(scores):
    shifted = [exp(x - max(scores)) for x in scores]
    total = sum(shifted)
    return [x / total for x in shifted]

query = [1.0, 0.0]
keys = [[1.0, 0.0], [0.0, 1.0], [-1.0, 0.0]]
values = [[10.0, 0.0], [0.0, 10.0], [2.0, 2.0]]
scores = [dot(query, key) / sqrt(len(query)) for key in keys]
weights = softmax(scores)
context = [sum(weight * value[d] for weight, value in zip(weights, values))
           for d in range(len(values[0]))]
print("Scaled scores:", [round(x, 4) for x in scores])
print("Attention weights:", [round(x, 4) for x in weights])
print("Combined value:", [round(x, 4) for x in context])
assert abs(sum(weights) - 1) < 1e-12
assert weights[0] > weights[1] > weights[2]
assert all(0 <= x <= 10 for x in context)
''','The query describes what this position is looking for; each key supplies a comparison vector.|A dot product gives each query-key score; dividing by square-root dimension is the usual scaling.|Softmax creates nonnegative weights that sum to one.|The final representation is a weighted average of the value vectors, not of the keys.','This illustrates one unmasked attention query. It does not train a transformer or generate text; causal masks, learned projections and multiple heads are additional components.','Use query [0,1] and predict which key receives the largest weight.')

S='statistics-lab'
add(S,'01 · Understanding data','Audit a small survey before summarizing it','Check missing responses, duplicate identifiers and invalid measurements.', '''
rows = [
    {"id": "A", "minutes": 12},
    {"id": "B", "minutes": None},
    {"id": "A", "minutes": 14},
    {"id": "C", "minutes": -2},
    {"id": "D", "minutes": 18},
]
seen, accepted, rejected = set(), [], []
for row in rows:
    identifier, value = row["id"], row["minutes"]
    if identifier in seen:
        rejected.append((identifier, "duplicate identifier"))
        continue
    seen.add(identifier)
    if value is None:
        rejected.append((identifier, "missing measurement"))
    elif value < 0:
        rejected.append((identifier, "negative travel time"))
    else:
        accepted.append(row)
for identifier, reason in rejected:
    print(f"Rejected {identifier}: {reason}")
mean = sum(row["minutes"] for row in accepted) / len(accepted)
print("Accepted:", len(accepted), "of", len(rows))
print(f"Observed mean: {mean:.1f} minutes")
assert [row["id"] for row in accepted] == ["A", "D"]
assert mean == 15
''','State a measurement rule first: one nonnegative travel time per identifier.|The first occurrence of an identifier is kept under this explicit policy.|Missing and negative measurements are reported, not silently changed to zero.|The mean is calculated only from accepted observations, with the count reported beside it.','Two accepted responses do not describe the whole population automatically. Missingness and exclusions may introduce bias; the audit is a data-quality step, not a proof of representativeness.','Change the duplicate policy to reject every duplicated ID and compare the resulting sample.')
add(S,'02 · Summarizing values','Produce a descriptive summary with an outlier comparison','Calculate central values and spread, then show how an extreme observation changes them.', '''
from statistics import mean, median, variance, stdev

def summarize(values):
    if len(values) < 2:
        raise ValueError("need at least two values for sample variance")
    return {"n": len(values), "mean": mean(values), "median": median(values),
            "minimum": min(values), "maximum": max(values),
            "sample variance": variance(values), "sample SD": stdev(values)}

def print_summary(label, values):
    print(label)
    result = summarize(values)
    for name, value in result.items():
        print(f"  {name}: {value:.3f}")
    return result

ordinary = [2, 4, 6, 8, 10]
with_outlier = [2, 4, 6, 8, 100]
first = print_summary("Original", ordinary)
second = print_summary("One value changed", with_outlier)
assert first["mean"] == 6
assert first["sample variance"] == 10
assert second["median"] == first["median"]
assert second["mean"] > first["mean"]
''','The summary checks its minimum sample size before using n-1 variance.|Mean and median describe location; minimum, maximum and SD describe different aspects of spread.|The second dataset changes just the largest observation.|Printing the same statistics side by side makes the sensitivity of each statistic visible.','The median remains 6 while the mean and SD increase. This does not make one statistic universally better; choose summaries according to the question and distribution.','Replace 100 with -100 and compare which statistics change direction.')
add(S,'03 · Seeing patterns','Build a text histogram and check its bins','Show a distribution with explicit bin boundaries and no plotting dependencies.', '''
values = [1, 2, 2, 3, 5, 5, 6, 7, 8, 9, 9, 10]
edges = [0, 3, 6, 9, 12]

def histogram(values, edges):
    if any(b <= a for a, b in zip(edges, edges[1:])):
        raise ValueError("bin edges must increase")
    counts = [0] * (len(edges) - 1)
    outside = 0
    for value in values:
        for index, (low, high) in enumerate(zip(edges, edges[1:])):
            if low <= value < high:
                counts[index] += 1
                break
        else:
            outside += 1
    return counts, outside

counts, outside = histogram(values, edges)
for low, high, count in zip(edges, edges[1:], counts):
    print(f"[{low:2d}, {high:2d}): {'#' * count} ({count})")
print("Outside bins:", outside)
assert counts == [3, 3, 3, 3]
assert sum(counts) + outside == len(values)
''','Each bin includes its lower endpoint and excludes its upper endpoint.|Every value is assigned to the first matching interval.|The for-else clause records values outside all bins.|Hash marks encode frequencies; the total-count assertion checks that no observation was lost.','Equal counts here do not imply a uniform population. Bin width and boundaries affect the visible shape, especially with only 12 observations.','Use edges [0,6,12], then explain what detail disappears when bins become wider.')
add(S,'04 · Probability foundations','Enumerate two dice and calculate conditional probabilities','Use a complete finite sample space to distinguish counts, probabilities and conditioning.', '''
from itertools import product
from fractions import Fraction

outcomes = list(product(range(1, 7), repeat=2))

def probability(predicate, space):
    if not space:
        raise ValueError("empty conditioning set")
    count = sum(predicate(pair) for pair in space)
    return Fraction(count, len(space))

sum_seven = lambda pair: sum(pair) == 7
first_even = lambda pair: pair[0] % 2 == 0
conditioned = [pair for pair in outcomes if first_even(pair)]
print("Total equally likely outcomes:", len(outcomes))
print("P(sum is 7):", probability(sum_seven, outcomes))
print("P(first is even):", probability(first_even, outcomes))
print("P(sum is 7 | first is even):", probability(sum_seven, conditioned))
print("Outcomes giving 7:", [pair for pair in outcomes if sum_seven(pair)])
assert probability(sum_seven, outcomes) == Fraction(1, 6)
assert len(conditioned) == 18
assert probability(sum_seven, conditioned) == Fraction(1, 6)
''','product enumerates 36 ordered pairs for two independent fair dice.|Probability is the favorable count divided by the size of the equally likely sample space.|Conditioning filters the space before applying the probability calculation.|Fraction preserves exact rational results rather than rounding decimals.','The equality of these two probabilities holds for this event and condition. Do not assume every pair of events is independent.','Replace the target sum with 8 and compare the unconditional and conditional probabilities.')
add(S,'05 · Probability distributions','Construct and check a binomial probability table','Calculate each possible count, the total probability and the expected count.', '''
from math import comb, isclose

def binomial_probability(n, k, p):
    if not 0 <= p <= 1 or not 0 <= k <= n:
        raise ValueError("invalid binomial parameters")
    return comb(n, k) * p ** k * (1 - p) ** (n - k)

n, p = 5, 0.4
table = [(k, binomial_probability(n, k, p)) for k in range(n + 1)]
print("successes probability")
for k, probability in table:
    print(f"{k:9d} {probability:.5f}")
total = sum(probability for _, probability in table)
expected = sum(k * probability for k, probability in table)
variance = sum((k - expected) ** 2 * probability for k, probability in table)
tail = sum(probability for k, probability in table if k >= 3)
print(f"Total probability: {total:.5f}")
print(f"Expected count: {expected:.3f}")
print(f"Variance: {variance:.3f}")
print(f"P(at least 3): {tail:.5f}")
assert isclose(total, 1)
assert isclose(expected, n * p)
assert isclose(variance, n * p * (1 - p))
''','comb counts how many placements of k successes exist among n trials.|The remaining factors give the probability of any one such placement.|Summing every row checks that the distribution accounts for all possible counts.|Weighted sums calculate the expectation, variance and upper-tail probability.','This model assumes independent trials with the same success probability. Varying probabilities or dependence require a different model.','Use p=0.5 and verify the symmetry between k successes and n-k successes.')
add(S,'06 · Sampling and resampling','Enumerate an exact bootstrap distribution for a tiny sample','Resample with replacement and inspect the variation of the sample mean.', '''
from itertools import product
from statistics import mean

data = [2, 4, 6]
resamples = list(product(data, repeat=len(data)))
bootstrap_means = sorted(mean(row) for row in resamples)

def percentile(sorted_values, fraction):
    # Linear interpolation between adjacent ordered values.
    position = (len(sorted_values) - 1) * fraction
    low = int(position)
    high = min(low + 1, len(sorted_values) - 1)
    weight = position - low
    return sorted_values[low] * (1 - weight) + sorted_values[high] * weight

low = percentile(bootstrap_means, 0.025)
high = percentile(bootstrap_means, 0.975)
print("Observed mean:", mean(data))
print("Ordered resamples:", len(resamples))
print(f"Mean of bootstrap means: {mean(bootstrap_means):.3f}")
print(f"Percentile interval: [{low:.3f}, {high:.3f}]")
print("First five means:", [round(x, 3) for x in bootstrap_means[:5]])
assert len(resamples) == 27
assert mean(bootstrap_means) == mean(data)
''','With three values and three draws, replacement gives 3³ ordered resamples.|The statistic is recalculated for every resample.|The percentile helper states its interpolation convention explicitly.|The entire tiny distribution is enumerated, so no random seed or simulation error is involved.','This is a mechanics demonstration, not a reliable uncertainty estimate from three observations. Bootstrap inference still depends on sampling assumptions and sufficient data.','Use four observations and count how many ordered resamples would be needed before running.')
add(S,'07 · Estimating unknown quantities','Calculate a Wilson interval for a proportion','Report an estimate and interval without treating zero observed events as zero uncertainty.', '''
from math import sqrt

def wilson(successes, trials, z=1.96):
    if trials <= 0 or not 0 <= successes <= trials:
        raise ValueError("invalid counts")
    estimate = successes / trials
    denominator = 1 + z * z / trials
    center = (estimate + z * z / (2 * trials)) / denominator
    half = z * sqrt(estimate * (1 - estimate) / trials
                    + z * z / (4 * trials * trials)) / denominator
    return estimate, center - half, center + half

cases = [(0, 20), (5, 20), (50, 200)]
for successes, trials in cases:
    estimate, low, high = wilson(successes, trials)
    print(f"{successes}/{trials}: estimate={estimate:.3f}, interval=[{low:.3f}, {high:.3f}]")
    assert -1e-12 <= low <= high <= 1 + 1e-12
assert wilson(0, 20)[2] > 0
small = wilson(5, 20)
large = wilson(50, 200)
assert large[2] - large[1] < small[2] - small[1]
''','The point estimate is successes divided by trials.|The Wilson center and width include a correction that behaves better near zero and one than a simple Wald interval.|z=1.96 gives an approximate 95% interval under the binomial sampling model.|Equal proportions with more trials generally produce narrower intervals.','The confidence level describes the procedure across repeated samples, not a 95% posterior probability about this fixed proportion. Independence and representative sampling remain important.','Compare 1/10 with 10/100 and explain why identical estimates need not have identical uncertainty.')
add(S,'08 · Testing claims','Perform an exact sign-flip test on paired changes','Use all possible signs of four paired differences to illustrate a two-sided randomization calculation.', '''
from itertools import product
from statistics import mean

before = [10, 12, 9, 11]
after = [12, 15, 10, 13]
differences = [new - old for old, new in zip(before, after)]
observed = abs(mean(differences))
null_statistics = []
for signs in product([-1, 1], repeat=len(differences)):
    reassigned = [sign * value for sign, value in zip(signs, differences)]
    null_statistics.append(abs(mean(reassigned)))

extreme = sum(value >= observed - 1e-12 for value in null_statistics)
p_value = extreme / len(null_statistics)
print("Paired changes:", differences)
print(f"Observed mean change: {mean(differences):.3f}")
print("Sign assignments:", len(null_statistics))
print("At least as extreme:", extreme)
print(f"Two-sided p-value: {p_value:.3f}")
assert len(null_statistics) == 16
assert extreme == 2
assert p_value == 0.125
''','Subtract within each pair rather than treating before and after as unrelated samples.|The test statistic is the absolute mean change, allowing either direction.|The null calculation flips each difference sign and enumerates all 16 combinations.|The p-value counts statistics at least as large as the observed value, including ties.','Sign flips need justification, such as an appropriate paired randomization design or independent symmetric differences under the null. This p-value is not the probability of no effect.','Change one positive difference to negative and compare the observed mean and p-value.')
add(S,'09 · Comparing groups responsibly','Calculate a contingency-table chi-square statistic','Compare observed and expected counts while checking the expected-cell sizes.', '''
observed = [[30, 20], [20, 30]]
row_totals = [sum(row) for row in observed]
column_totals = [sum(row[j] for row in observed) for j in range(2)]
total = sum(row_totals)
expected = [[row_total * column_total / total for column_total in column_totals]
            for row_total in row_totals]

statistic = 0.0
for i in range(2):
    for j in range(2):
        count, model = observed[i][j], expected[i][j]
        if model == 0:
            raise ValueError("zero expected count")
        contribution = (count - model) ** 2 / model
        statistic += contribution
        print(f"cell({i},{j}): observed={count}, expected={model:.1f}, contribution={contribution:.2f}")
degrees_of_freedom = (len(observed) - 1) * (len(observed[0]) - 1)
print(f"Chi-square statistic: {statistic:.3f}")
print("Degrees of freedom:", degrees_of_freedom)
print("All expected counts >= 5:", all(x >= 5 for row in expected for x in row))
assert statistic == 4
assert sum(map(sum, expected)) == total
''','Row and column totals define the independence model for this contingency table.|Each expected count is row total times column total divided by the grand total.|Each squared discrepancy is scaled by its expected count before summation.|Degrees of freedom count independent cell constraints for this standard table.','This program reports the uncorrected statistic, not a p-value. The usual approximation needs independent observations and adequate expected counts; paired counts require a different analysis.','Make one expected cell sparse and explain why an exact method may be preferable.')
add(S,'10 · Statistical models','Fit a straight line and inspect residuals','Calculate least-squares coefficients, fitted values and prediction errors by hand in code.', '''
from statistics import mean

def fit_line(xs, ys):
    if len(xs) != len(ys) or len(xs) < 2:
        raise ValueError("need matching data with at least two rows")
    x_mean, y_mean = mean(xs), mean(ys)
    denominator = sum((x - x_mean) ** 2 for x in xs)
    if denominator == 0:
        raise ValueError("x must vary")
    slope = sum((x - x_mean) * (y - y_mean) for x, y in zip(xs, ys)) / denominator
    return slope, y_mean - slope * x_mean

xs, ys = [1, 2, 3, 4], [3, 5, 7, 10]
slope, intercept = fit_line(xs, ys)
residuals = []
print(f"Fitted line: y = {slope:.3f} x + {intercept:.3f}")
for x, y in zip(xs, ys):
    fitted = slope * x + intercept
    residuals.append(y - fitted)
    print(f"x={x}: observed={y}, fitted={fitted:.3f}, residual={y-fitted:.3f}")
print(f"Residual sum of squares: {sum(r*r for r in residuals):.3f}")
assert abs(slope - 2.3) < 1e-12
assert abs(sum(residuals)) < 1e-12
''','Centering x and y separates the slope calculation from the intercept.|The denominator measures variation in x and must be nonzero.|Each residual is observed minus fitted, unlike the prediction-minus-target convention used in some ML examples.|With an intercept, least-squares residuals sum to approximately zero.','A fitted association is not proof of causation. These four observations are too few to establish a reliable model or justify extrapolation.','Add a far-away x value with an unusual y and inspect its influence on the fitted slope.')
add(S,'11 · Study design and evidence','Compare two groups with an exact permutation calculation','Enumerate equally sized assignments under an exchangeable-label null model.', '''
from itertools import combinations
from statistics import mean

group_a = [2, 3, 4]
group_b = [5, 6, 7]
pooled = group_a + group_b
size_a = len(group_a)
observed = mean(group_b) - mean(group_a)
permuted = []
for chosen in combinations(range(len(pooled)), size_a):
    chosen = set(chosen)
    a = [value for i, value in enumerate(pooled) if i in chosen]
    b = [value for i, value in enumerate(pooled) if i not in chosen]
    permuted.append(mean(b) - mean(a))
extreme = sum(abs(value) >= abs(observed) - 1e-12 for value in permuted)
p_value = extreme / len(permuted)
print(f"Observed difference B-A: {observed:.3f}")
print("Possible assignments:", len(permuted))
print("Two-sided extreme assignments:", extreme)
print(f"Exact p-value: {p_value:.3f}")
assert observed == 3
assert len(permuted) == 20
assert p_value == 0.1
''','The effect estimate is mean B minus mean A in the original assignment.|All size-three allocations of the six observed values are enumerated.|Both positive and negative differences count in a two-sided comparison.|Exhaustive enumeration needs no simulation correction because every assignment is counted.','A permutation test needs exchangeability under the null, often supported by random assignment. It does not repair confounding in an observational comparison.','Enumerate assignments with four observations per group and compare how many possibilities there are.')
add(S,'12 · Time, dependence and advanced methods','Evaluate forecasts without looking into the future','Compare a last-value baseline with a trailing mean using time-ordered evaluation.', '''
from statistics import mean

series = [10, 12, 11, 13, 12, 14, 13, 15]
window = 3
errors = {"last value": [], "trailing mean": []}
for index in range(window, len(series)):
    past = series[:index]  # Never include the target or a later observation.
    forecasts = {"last value": past[-1],
                 "trailing mean": mean(past[-window:])}
    actual = series[index]
    print(f"time={index}, actual={actual}, last={forecasts['last value']:.2f}, mean={forecasts['trailing mean']:.2f}")
    for name, forecast in forecasts.items():
        errors[name].append(abs(actual - forecast))

print("Mean absolute errors")
for name, values in errors.items():
    print(f"{name}: {mean(values):.3f}")
assert len(errors["last value"]) == len(series) - window
assert abs(mean(errors["last value"]) - 1.6) < 1e-12
assert all(value >= 0 for values in errors.values() for value in values)
''','The loop starts only after enough past observations exist for a three-point mean.|Each forecast sees values strictly before its target time.|Both methods predict the same target observations, making the comparison fair.|Mean absolute error averages errors in the original measurement units.','This is a tiny rolling-origin demonstration. Choosing window length after inspecting all evaluation results would require a separate final holdout period.','Try windows of two and four, comparing forecasts only on a common evaluation period.')
