# TasteTrace Prototype Model Card

## Status

Deterministic product prototype. Not a trained or calibrated production recommender.

The specified production target is a public cold-start content recommender:
MusicBrainz identity and metadata, FMA and locally extracted Essentia features,
KNN or ANN candidate retrieval, and MMR diversity reranking. AcousticBrainz is
treated only as optional historical enrichment because its ingestion project
ended in 2022.

## Intended use

- demonstrate explainable music recommendation;
- compare relevance and diversity trade-offs;
- prioritise niche and emerging artists;
- expose evidence and source links;
- support classroom evaluation of an AI/ML product workflow.

## Not intended for

- predicting a user's probability of liking a track;
- commercial royalty, promotion, or artist-ranking decisions;
- replacing music critics;
- inferring sensitive identity from listening preferences;
- claiming comprehensive coverage of global music.

## Inputs

- 3-10 seed tracks;
- natural-language discovery brief;
- mood and era;
- exploration and diversity settings;
- emerging-artist and seed-artist controls;
- optional local feedback.

## Method

The model combines:

1. derived audio-style feature distance;
2. tag overlap;
3. scene proximity;
4. explicit preference match;
5. prototype evidence strength;
6. discovery value.

A separate reranker applies redundancy, same-artist, and same-album penalties.

## Interpretability

Each recommendation exposes:

- component scores;
- shared tags;
- strongest seed bridge;
- audience tier and momentum;
- explanation text generated from structured facts;
- external review searches.

## Evaluation completed

Automated tests verify:

- bounded component scores;
- deterministic ranking;
- seed exclusion;
- one artist per final result set;
- review-link generation;
- profile and artist-radar outputs;
- catalogue search.

## Evaluation still required

A production model requires:

- an artist-grouped FMA train/validation/test design;
- relevance labels from real interactions;
- precision@k, recall@k, NDCG, coverage, novelty, and intra-list diversity;
- baseline comparisons;
- calibration analysis before probability language;
- representation and exposure auditing;
- online experiment design.

## Main limitations

- curated catalogue;
- derived rather than measured audio features;
- no collaborative-filtering interaction matrix;
- no live review-source ingestion;
- no persistent server-side learning;
- subjective audience-tier labels.

See `MODEL_TECHNICAL_SPECIFICATION.md` and
`TASTETRACE_MODEL_TECHNICAL_SPECIFICATION.pdf` for the explicit variables,
KNN parameters, MMR parameters, backend services, and batch lifecycle.
