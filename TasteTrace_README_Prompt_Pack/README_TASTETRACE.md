# TasteTrace Build Prompt Pack

This pack defines a controlled sequence for extending TasteTrace with coding agents.

## Product objective

Build an explainable music-discovery application that improves catalogue diversity, supports niche and emerging artists, and makes recommendation evidence inspectable.

## Required product principles

- A usable application, not a marketing page.
- Deterministic and testable ranking logic.
- Diversity treated as a model constraint.
- No invented tracks, ratings, reviews, or API results.
- External review data used only with permission and provenance.
- Fit index described as an index, not a probability.
- Credential-free demo mode preserved.
- All public claims supported by implementation evidence.

## Intended production architecture

```text
React frontend
  -> typed API
  -> track identity service
  -> candidate generation
  -> feature and evidence store
  -> hybrid ranker
  -> diversity reranker
  -> explanation service
  -> feedback and evaluation store
```

## Build order

Use `AGENT_BUILD_SEQUENCE_TASTETRACE.md` and execute prompts in numerical order. Each phase must update `BUILD_STATUS.md` and pass its checks before the next phase begins.

