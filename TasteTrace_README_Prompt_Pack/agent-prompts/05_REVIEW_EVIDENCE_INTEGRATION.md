# Phase 5: Review Evidence Integration

## Objective

Add editorial and community context without creating unauthorised or misleading dependencies.

## First action

Inspect the current terms, API availability, attribution requirements, and robots/access rules for every intended source.

## Required work

- source adapter interface;
- source, URL, retrieval date, and confidence metadata;
- critic and user scores kept separate;
- clear missing-data states;
- outbound-link fallback;
- caching and refresh policy;
- permission and takedown process;
- no copied review text beyond licensed excerpts.

## Verification

- no displayed score lacks source metadata;
- stale data is labelled;
- source failure does not break recommendation ranking;
- external values are not confused with the internal evidence index.

