# TasteTrace Prototype Model Card

## Status

Deterministic product prototype. Not a trained or calibrated production recommender.

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

- offline train/validation/test data;
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

