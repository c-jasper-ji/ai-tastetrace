# Phase 3: Hybrid Recommender

## Objective

Implement reproducible candidate generation, ranking, preference parsing, and evidence output.

## Required work

- seed-vector construction;
- content and tag similarity;
- collaborative or scene-based candidate signals;
- natural-language preference parser;
- evidence and novelty signals;
- configurable weights;
- structured explanation contract;
- feedback adjustment;
- bounded score output.

## Safety rules

- Do not let an LLM invent candidate tracks.
- Do not invent metadata or review evidence.
- Explanations must use structured model facts.
- Do not describe scores as calibrated probabilities.

## Verification

- seed exclusion;
- stable ranking;
- score boundaries;
- preference behaviour;
- provider and API fallback;
- explanation grounding.

