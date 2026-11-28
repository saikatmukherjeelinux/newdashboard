# Statistics Lab

An independent, buildless statistics learning site with 60 topics, 180 worked examples, 12 chapters, eight executable Python examples, a descriptive calculator and a method-selection starting guide. The text starts with definitions and examples. Formulas and deeper assumptions are in optional disclosures.

## Syllabus

1. Populations, data types, measurement, collection and missing data.
2. Frequencies, averages, median/mode, quantiles and variability.
3. Histograms, box plots, scatter plots, correlation and transformations.
4. Probability rules, conditioning, Bayes, expectation and counting.
5. Bernoulli/categorical, binomial, Poisson, normal and other continuous distributions.
6. Sampling design, bias, sampling distributions, resampling and sample-size planning.
7. Estimation, likelihood, confidence intervals, proportion intervals and Bayesian inference.
8. Hypothesis tests, one/two means, paired comparisons and proportions.
9. Chi-square, ANOVA, rank tests, multiplicity, effect sizes and power.
10. Regression, multiple predictors, generalized linear models, diagnostics and prediction.
11. Experiments, A/B tests, causal inference, surveys and meta-analysis.
12. Time series, forecasting, survival, multivariate methods and advanced model selection.

This is a broad core and applied syllabus, not an exhaustive reference to every statistical research method. The final topic identifies further directions. No lesson substitutes a numerical result for its assumptions. Examples are original, fictional and publicly shareable; public sources are further reading rather than copied lesson text.

## Use and validation

Open `index.html` or serve the repository root using `python -m http.server 4173`. There are no runtime dependencies or external datasets. Progress uses the separate browser key `statistics-lab-v1`. The worked-code page also reads without JavaScript. Python examples require only the standard library.

- `node statistics-lab/tests/content.cjs` from the repository root checks coverage and calculations.
- `python scripts/verify-study-examples.py` executes all 32 new Python snippets across four labs in temporary directories and compares exact output. Eight Unix examples are authored for GNU/Bash; this Windows environment has no Bash/WSL installation, so their execution remains unverified.
- `node scripts/test-reading-ui.cjs` uses Playwright and installed Edge on Windows. Set `ML_PLAYWRIGHT_PATH` to an existing Playwright package if necessary. It checks all lab navigation, coding guides, responsive layouts and every Statistics topic.

The shared presentation layer preserves instructional interactions while removing decorative dashboard scripts. Existing ML, Python, DSA and Unix lesson banks are preserved except for a specifically documented correction to the Python GIL introduction.
