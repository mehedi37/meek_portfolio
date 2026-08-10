-- Seed: TRACE research entry (B.Sc. thesis, RUET)
-- Source: research_course_bottleneck/docs/B_Sc__in_CSE__RUET___Thesis_Template/document.pdf
-- Research entries are stored in blog_posts (repurposed; see 20260804_add_education_and_research.sql).
-- Idempotent: skips the insert if a row with this slug already exists.

INSERT INTO public.blog_posts (
  slug,
  title,
  excerpt,
  content,
  cover_image,
  video_url,
  venue,
  tags,
  author,
  published,
  is_featured,
  published_at,
  reading_time,
  sort_order
)
SELECT
  'trace-curriculum-bottleneck-detection',
  'TRACE: A Multi-Modal Framework for Curriculum Bottleneck Detection and Causal Validation',
  'TRACE fuses prerequisite-graph centrality, Bayesian fail rates, and student sentiment into a single bottleneck score, validated on 23,369 OULAD students and generalized across the RUET, MIT, and Stanford curricula.',
  $research$## Abstract

Some courses act as academic bottlenecks, where one failure cascades through later semesters. A course can become a bottleneck for three different reasons: its position in the prerequisite graph, a high fail rate, or a poor student experience. Prior work treats these signals separately. Fusing them has rarely been tested, and the obstacle is access rather than rarity, because the real curricula that carry all three signals sit inside institutions and are not public.

This thesis presents **TRACE** (Triangulated Retrospective Analysis of Curriculum Efficacy), a graph mining framework that fuses prerequisite centrality, Bayesian fail rates, and student sentiment into one bottleneck score. To test the framework fairly, the thesis also builds a reproducible synthetic-curriculum generator that plants bottlenecks of known type, so a detector can be scored against ground truth.

On this benchmark, the best single signal reaches an F-measure of 0.375. Fusion reaches 0.75 on the same measure and an NDCG@10 of 0.81, doubling the baseline. TRACE is then validated on real data from 23,369 students in the Open University Learning Analytics Dataset (OULAD), where causal analysis links high assignment engagement to a 19.9 percentage-point gain in pass rate on a held-out cohort.

The structure-only detector also transfers across three very different institutions (RUET, MIT, and Stanford), where the top five hub courses gate between 44 and 55 percent of the downstream curriculum. On the RUET CSE curriculum, TRACE surfaces high-failure courses that a purely structural expert ranking misses, a mismatch driven by a "Preparation Paradox," where students work harder at tough foundational courses, hiding how difficult those courses really are.

## Key Contributions

- **TRACE framework** — fuses structural (prerequisite centrality), performance (Bayesian fail-rate), and experiential (sentiment) signals into a single, weighted bottleneck score.
- **Synthetic curriculum benchmark** — a reproducible generator that plants bottlenecks of known type and severity, enabling ground-truth evaluation of any detector.
- **Causal validation** — links assignment engagement to pass-rate outcomes on OULAD (23,369 students) using DoWhy-based causal inference, with e-value sensitivity analysis.
- **Cross-institution generalization** — structural detection transfers across RUET, MIT, and Stanford curricula.
- **The "Preparation Paradox"** — an empirical finding explaining why purely structural rankings miss real high-failure bottleneck courses.

## Methodology

TRACE runs a four-stage pipeline:

1. **Domain Normalization** — aligns course records across heterogeneous catalogues.
2. **Multi-Modal Signal Extraction** — computes three independent signals per course: a *structural* signal from prerequisite-graph centrality, a *performance* signal from Bayesian-estimated fail rates, and an *experiential* signal from sentiment / grade-variance proxies.
3. **Multi-Modal Score Fusion** — combines the three signals into a single composite bottleneck score.
4. **Temporal Causal Validation** — tests causal claims, such as engagement driving pass rate, using DoWhy, with e-value sensitivity checks.

## Datasets

- A reproducible **synthetic benchmark** with planted, known-type bottlenecks.
- **OULAD** — 23,369 students, Open University Learning Analytics Dataset.
- **RUET CSE** curriculum records, a real institutional case study.
- **MIT** and **Stanford** course catalogues, used for cross-institution generalization.

## Results

| Metric | Best Single Signal | TRACE (Fusion) |
|---|---|---|
| F-measure (synthetic benchmark) | 0.375 | **0.75** |
| NDCG@10 | — | **0.81** |

- Causal validation on OULAD: high assignment engagement → **+19.9 pp** pass-rate gain on a held-out cohort.
- Cross-institution: top 5 hub courses gate **44–55%** of the downstream curriculum across RUET, MIT, and Stanford.
- RUET case study: TRACE surfaces high-failure courses that purely structural rankings miss, attributed to the **Preparation Paradox**.

## Keywords

Educational Data Mining, Curriculum Analytics, Bottleneck Detection, Causal Inference, Knowledge Graphs, Multi-Modal Fusion

---

**Author:** MD. Mehedi Hasan Maruf (Roll 2003037)
**Supervisor:** Farjana Parvin, Assistant Professor, Dept. of CSE, RUET
**Institution:** Rajshahi University of Engineering & Technology (RUET), Bangladesh
**Repository:** [github.com/mehedi37/research_course_bottleneck](https://github.com/mehedi37/research_course_bottleneck)
$research$,
  NULL,
  NULL,
  'B.Sc. Thesis — RUET, 2026',
  ARRAY['educational data mining', 'curriculum analytics', 'bottleneck detection', 'causal inference', 'knowledge graphs', 'multi-modal fusion'],
  'MD. Mehedi Hasan Maruf',
  false,
  true,
  NULL,
  4,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM public.blog_posts WHERE slug = 'trace-curriculum-bottleneck-detection'
);
