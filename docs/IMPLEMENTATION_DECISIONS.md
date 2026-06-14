# Implementation Decisions

## Frontend-only prototype

React, TypeScript, and Vite provide a reliable public-demo architecture with no credentials. The next production phase can place typed API adapters behind the existing data and ranking contracts.

## Curated catalogue

The app uses a structured local catalogue so every demo is reproducible. This avoids API availability failures and unsupported scraping while allowing the product and model workflow to be evaluated.

## Deterministic AI/ML logic

Natural-language parsing uses explicit vocabulary and feature rules. Recommendation explanations are generated from structured evidence. This avoids hallucinated tracks, scores, or review claims.

## Diversity as a ranking stage

Artist and album variety are not handled by UI filtering alone. A reranker changes the final result set using redundancy and hard repetition penalties.

## External review integration

The MVP uses outbound source searches. This is proportionate to a public open-source prototype because RYM, AOTY, and Pitchfork do not provide a shared, stable public rating API suitable for an unauthorised production dependency.

## Persistence

Feedback is stored locally in the browser. This keeps the prototype private and credential-free. Server persistence, accounts, consent, deletion, and model retraining are future work.

## Out of scope

- music playback and licensing;
- authentication;
- payments;
- scraping;
- production ML training;
- social features;
- playlist export;
- commercial artist promotion.

