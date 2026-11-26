"""Build original, compact SVG teaching diagrams. No external images or packages."""
from pathlib import Path
from html import escape
import math

OUT = Path(__file__).resolve().parents[1] / 'assets' / 'diagrams'
OUT.mkdir(parents=True, exist_ok=True)
def text(x,y,s,color='#dce8ff',size=16):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-family="Segoe UI,Arial,sans-serif">{escape(s)}</text>'
def line(x1,y1,x2,y2,color='#526581',arrow=False):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="2"'+(' marker-end="url(#arrow)"' if arrow else '')+'/>'
def box(x,y,w,h,label,color='#9be6d6'):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="#1c2b43" stroke="{color}"/>'+text(x+12,y+h/2+6,label,color)
def dot(x,y,r=5,color='#9be6d6'):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}"/>'
def path(points,color='#9be6d6'):
    return '<polyline points="'+' '.join(f'{x:.2f},{y:.2f}' for x,y in points)+f'" fill="none" stroke="{color}" stroke-width="3"/>'
def write(name,title,desc,body):
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">{escape(desc)}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#9be6d6"/></marker></defs><rect width="480" height="270" rx="16" fill="#101b2d"/>'+text(22,31,title,'#ffffff',18)+body+'</svg>'
    (OUT/f'{name}.svg').write_text(svg,encoding='utf-8')
write('flow','From examples to learning','Inputs and parameters produce a prediction. Compare it with a target to obtain loss, then use gradients to update parameters.',
 box(24,69,120,48,'Inputs x')+box(181,69,120,48,'Model f(x)')+box(338,69,120,48,'Prediction')+line(144,93,179,93,'#9be6d6',True)+line(301,93,336,93,'#9be6d6',True)+box(181,168,120,48,'Loss')+line(397,119,300,168,'#9be6d6',True)+text(23,158,'Observed target y',size=14)+line(115,163,180,183,'#9be6d6',True)+text(24,243,'Gradients tell us how to change the parameters.',size=14))
write('line','Slope changes a prediction','The straight line y=2x+1 rises by 2 when x increases by 1.',
 line(65,217,430,217)+line(65,217,65,52)+path([(65,187),(355,67)])+text(359,66,'y = 2x + 1',size=14)+line(162,147,259,147,'#c2b3ff')+line(259,147,259,107,'#c2b3ff')+text(177,169,'Δx = 1',size=14)+text(269,132,'Δy = 2',size=14)+text(426,241,'x')+text(40,58,'y')+text(56,239,'0')+text(24,259,'Slope = output change / input change',size=14))
curve=[(60+i*3.6,210-0.004*(i*3.6-180)**2) for i in range(101)]
# Upward quadratic in screen coordinates: small y values are visually high.
write('curve','A slope is local','A quadratic bowl has zero slope at its minimum. A tangent on its right side has positive slope.',
 line(45,226,438,226)+line(45,226,45,50)+path(curve)+line(280,213.6,390,134.4,'#c2b3ff')+dot(330,177.6)+dot(240,210)+text(253,245,'Minimum',size=14)+text(288,63,'Tangent: local slope',size=14)+text(24,259,'The slope changes as you move along the curve.',size=14))
write('sets','Combine or restrict events','Two overlapping event circles illustrate union and intersection. Conditioning restricts attention to a known event.',
 '<circle cx="190" cy="143" r="74" fill="#9be6d6" fill-opacity="0.15" stroke="#9be6d6"/><circle cx="290" cy="143" r="74" fill="#c2b3ff" fill-opacity="0.18" stroke="#c2b3ff"/>'+text(149,145,'A',size=23)+text(315,145,'B',size=23)+text(220,145,'A∩B',size=14)+text(35,248,'Union: either circle. Intersection: their overlap.',size=14))
write('vector','Direction, length and projection','The vector (3,4) has length 5. Its horizontal projection is (3,0). Dashed lines mark its coordinates.',
 line(65,215,425,215)+line(65,215,65,52)+line(65,215,170,75,'#9be6d6',True)+line(65,215,170,215,'#c2b3ff',True)+'<path d="M170 75V215" fill="none" stroke="#c2b3ff" stroke-dasharray="5 5"/>'+text(181,78,'(3,4)')+text(234,133,'length = √(3²+4²) = 5',size=14)+text(91,242,'projection (3,0)',size=14)+text(180,158,'4',size=14)+text(113,205,'3',size=14))
write('matrix','Check the dimensions first','A batch with five rows and three features multiplied by a three by two weight matrix gives five rows and two outputs.',
 box(24,81,123,90,'X: 5 × 3')+text(158,132,'×',size=24)+box(185,81,123,90,'W: 3 × 2','#c2b3ff')+text(319,132,'=',size=24)+box(347,81,109,90,'Y: 5 × 2')+text(54,211,'Inner sizes match: 3 and 3',size=16)+text(54,241,'Outer sizes become the result: 5 and 2',size=14))
body=line(50,214,425,214)+line(50,214,50,52)+line(85,210,395,65,'#c2b3ff',True)
for x,y in [(110,192),(150,173),(183,180),(214,143),(250,139),(285,108),(325,102),(360,74)]: body+=dot(x,y)
write('pca','Find the main direction of variation','A cloud of points is elongated along a diagonal direction. PCA projects centered data onto such directions.',body+text(125,58,'First principal direction',size=14)+text(64,246,'Projection gives one coordinate per point.',size=14))
bell=[(60+i*3.6,218-150*math.exp(-((i-50)/19)**2/2)) for i in range(101)]
fill='<polygon points="'+ ' '.join(f'{x:.2f},{y:.2f}' for x,y in [(192,218)]+[p for p in bell if 192<=p[0]<=288]+[(288,218)])+'" fill="#9be6d6" fill-opacity="0.18"/>'
write('distribution','Density is not probability','The area under a density curve over a selected interval gives its probability. A bell curve is used here only as an illustration.',
 fill+line(45,220,438,220)+path(bell)+text(202,248,'interval',size=14)+text(24,58,'Area under the curve = probability',size=14)+text(341,207,'value',size=14))
write('bars','Turn scores into probabilities','Softmax converts scores zero and log three into probabilities one quarter and three quarters.',
 text(30,68,'Scores: [0, ln 3]',size=16)+box(30,91,125,52,'softmax')+line(157,116,194,116,'#9be6d6',True)+'<rect x="230" y="167" width="60" height="45" rx="6" fill="#9be6d6"/><rect x="330" y="77" width="60" height="135" rx="6" fill="#c2b3ff"/>'+text(240,154,'0.25',size=16)+text(340,64,'0.75',size=16)+text(233,238,'class 1',size=14)+text(333,238,'class 2',size=14)+text(24,260,'Probabilities are nonnegative and sum to 1.',size=14))
body=''
for y1 in [90,170]:
    for y2 in [70,130,190]: body+=line(80,y1,230,y2)
for y in [70,130,190]: body+=line(230,y,395,130)
for x,ys,color in [(80,[90,170],'#9be6d6'),(230,[70,130,190],'#c2b3ff'),(395,[130],'#f0c884')]:
    for y in ys: body+=dot(x,y,17,color)
write('network','Combine, transform, pass onward','A schematic neural layer combines two inputs into three hidden values and one output. Connections represent learned weighted contributions, not fixed numerical results.',body+text(53,232,'Inputs',size=14)+text(183,232,'Hidden values',size=14)+text(367,232,'Output',size=14)+text(24,260,'Forward: values. Backward: gradients.',size=14))
# Topic-specific numerical storyboards supplement the geometric illustrations.
stories=[
 ('logs','Products become sums',[('Probabilities','0.5 × 0.25'),('Joint result','0.125'),('Base-2 log','−3')],'log₂(0.5) + log₂(0.25) = −1 − 2 = −3'),
 ('systems','Fit a constant to two observations',[('Data','2 and 4'),('Best constant','3'),('Squared error','1 + 1 = 2')],'The best constant is their mean.'),
 ('eigen','A direction that keeps its orientation',[('Matrix','diag(3,1)'),('Input vector','[1,0]'),('Output vector','[3,0]')],'The horizontal direction has eigenvalue 3.'),
 ('chain','Follow a change through two operations',[('Input','x = 2'),('Inner function','u = 3x+1 = 7'),('Outer function','y = u² = 49')],'dy/dx = (2u) × 3 = 14 × 3 = 42'),
 ('gradients','One slope for each independent input',[('Function','x² + 3y²'),('At (2,1)','∂x: 4   ∂y: 6'),('Gradient','[4,6]')],'Hold the other input fixed for each partial derivative.'),
 ('curvature','Slope and curvature explain a change',[('Value at 3','9'),('Slope term','6 × 0.1'),('Curvature term','0.01')],'For x²: 9 + 0.6 + 0.01 = 3.1² = 9.61'),
 ('integrals','Probability is area',[('Uniform [0,4]','height = ¼'),('Interval [1,3]','width = 2'),('Probability','½')],'Rectangle area = density × interval width.'),
 ('probability','Conditioning narrows the sample space',[('Fair die','1,2,3,4,5,6'),('Known even','2,4,6'),('Above 3','4,6')],'Two favorable outcomes out of three: probability 2/3.'),
 ('bayes','Normalize evidence-weighted beliefs',[('Faulty + flag','0.08'),('Good + flag','0.18'),('Posterior','0.08 / 0.26')],'About 30.77% of flagged items are faulty in this example.'),
 ('moments','Center first, then measure spread',[('Equal chances','X = 0 or 2'),('Mean','1'),('Variance','1')],'Both values are one unit away from the mean.'),
 ('distributions','Count the successful arrangements',[('3 fair tosses','8 outcomes'),('Exactly 2 H','HHT HTH THH'),('Probability','3/8')],'Binomial counting includes every arrangement.'),
 ('sampling','More samples reduce random error',[('Spread σ','10'),('n = 100','SE = 1'),('n = 400','SE = 0.5')],'For independent samples: SE = σ / √n.'),
 ('estimation','A prior changes a point estimate',[('Data','3 H, 1 T'),('MLE','3/4'),('Beta(2,2) MAP','2/3')],'MLE uses likelihood; MAP also includes the prior.'),
 ('inference','An interval around an estimate',[('Mean estimate','50'),('Margin','1.96 × 2'),('Interval','46.08–53.92')],'Approximate 95% normal interval with SE = 2.'),
 ('generalization','Keep evaluation separate',[('Training','Fit parameters'),('Validation','Choose model'),('Test','Final check')],'Fit preprocessing on training data, too.'),
 ('metrics','Different denominators, different questions',[('TP / FP / FN','30 / 10 / 20'),('Precision','30/40 = 75%'),('Recall','30/50 = 60%')],'Precision checks predictions; recall checks actual positives.'),
 ('entropy','Surprise decreases as confidence rises',[('True event p','0.2'),('True event p','0.8'),('True event p','1')],'Negative log losses: 1.6094, 0.2231, and 0 nats.'),
 ('stochastic','Average a mini-batch gradient',[('Gradients','2 and 6'),('Average','4'),('Update','5 − 0.1×4')],'New parameter = 4.6. Batch gradients are averaged here.'),
 ('convexity','A penalty changes the preferred solution',[('Data loss','(w−4)²'),('Add penalty','+ w²'),('New optimum','w = 2')],'Without this penalty the optimum was w = 4.'),
 ('regression','One training step reduces error',[('Initial weight','w = 1'),('Gradient','−5'),('New weight','w = 1.5')],'For x=[1,2], y=[2,4], η=0.1: MSE 2.5 becomes 0.625.'),
 ('logistic','A score becomes a probability',[('Logit','ln 3'),('Sigmoid','0.75'),('Target y = 0','loss ≈ 1.3863')],'The score gradient is p − y = 0.75.'),
 ('convolution','Reuse one filter across a sequence',[('Input','1, 2, 3, 4'),('Filter','[1, −1]'),('Output','−1, −1, −1')],'Cross-correlation, stride 1, no padding.'),
 ('attention','Attention forms a weighted average',[('Scores','[0, ln 3]'),('Weights','[¼, ¾]'),('Values','[2,6]')],'Output = ¼ × 2 + ¾ × 6 = 5'),
 ('kernels','An implicit feature-space dot product',[('Inputs','x=2, z=3'),('Kernel','(xz+1)²'),('Value','49')],'A valid kernel represents an inner product in feature space.'),
 ('clustering','Move centers to their group means',[('Points','0, 2, 8, 10'),('Initial centers','0 and 10'),('New centers','1 and 9')],'Nearest-center assignment followed by averaging.'),
 ('graphs','Propagate state probabilities',[('Initial','[1,0]'),('One step','[0.8,0.2]'),('Two steps','[0.66,0.34]')],'Transition rows: [0.8,0.2] and [0.1,0.9].'),
 ('rl','Immediate and future rewards',[('Reward now','2'),('Next reward','4'),('Discount γ','0.5')],'Return = 2 + 0.5 × 4 = 4'),
 ('generative','Reparameterize a latent sample',[('Mean μ','2'),('Scale σ','0.5'),('Noise ε','−1')],'Latent sample z = μ + σε = 2 − 0.5 = 1.5'),
 ('diffusion','Mix known signal and noise',[('Clean x₀','2'),('Signal factor','√0.64 = 0.8'),('Noise ε','−1')],'xₜ = 0.8 × 2 + √0.36 × (−1) = 1')
]
import json
captions={}
for name,title,cards,foot in stories:
    body=''
    for i,(label,value) in enumerate(cards):
        x=20+i*154
        body+=f'<rect x="{x}" y="74" width="132" height="116" rx="12" fill="#1c2b43" stroke="'+['#9be6d6','#c2b3ff','#f0c884'][i]+'"/>'
        body+=text(x+9,104,label,size=14)+text(x+9,147,value,['#9be6d6','#c2b3ff','#f0c884'][i],16)
        if i<2: body+=line(x+134,132,x+151,132,'#9be6d6',True)
    # Wrap the caption without changing its meaning.
    import textwrap
    for j,row in enumerate(textwrap.wrap(foot,59)): body+=text(20,224+j*21,row,size=14)
    description=title+'. '+'. '.join(label+': '+value for label,value in cards)+'. '+foot
    captions[name]=description
    write(name,title,description,body)
(OUT.parent/'diagram-info.js').write_text('(function(r){const d='+json.dumps(captions,ensure_ascii=False)+';if(typeof module!=="undefined"&&module.exports)module.exports=d;else r.ML_DIAGRAMS=d;})(typeof window!=="undefined"?window:globalThis);',encoding='utf-8')
print(f'Built {len(list(OUT.glob("*.svg")))} compact original diagrams.')
