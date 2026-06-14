# TasteTrace Architecture

## System context

TasteTrace is currently a credential-free static web application. The browser owns interaction state, deterministic recommendation logic, and local feedback persistence.

```text
User
  |
  v
React application
  |
  +-- seed search and discovery controls
  +-- catalogue and feature store
  +-- hybrid scoring engine
  +-- diversity reranker
  +-- explanation and evidence formatter
  +-- localStorage feedback
  `-- external review search links
```

## Module boundaries

### `src/data/catalogue.ts`

- track identity and descriptive metadata;
- tags and audience tier;
- prototype evidence, popularity, and momentum features;
- deterministic derived audio-style features;
- catalogue summary statistics.

### `src/lib/recommender.ts`

- text normalisation and brief parsing;
- tag, scene, and feature similarity;
- weighted base score;
- discovery and evidence signals;
- feedback adjustments;
- MMR-style diversity reranking;
- artist radar aggregation;
- taste profile construction;
- catalogue search.

### `src/App.tsx`

- view orchestration;
- controls and interaction states;
- recommendation table and detail evidence;
- browser feedback persistence;
- responsive navigation.

## Recommendation sequence

```text
1. Resolve selected seed tracks.
2. Parse explicit mood, era, exploration, and diversity controls.
3. Parse natural-language preference terms.
4. Filter seed tracks, seed artists, and era violations.
5. Score every candidate on six signals.
6. Apply popularity and feedback adjustments.
7. Sort candidates by base relevance.
8. Rerank the list for diversity.
9. Enforce artist and album repetition penalties.
10. Generate component evidence, bridge seed, and external review links.
```

## Production target

A production architecture should add:

```text
React frontend
      |
      v
Typed API gateway
      |
      +-- identity resolver -> MusicBrainz
      +-- candidate service -> Last.fm / ListenBrainz
      +-- feature service -> embeddings and tags
      +-- ranking service -> versioned models
      +-- evidence service -> licensed review metadata
      +-- feedback service -> privacy-controlled database
      `-- observability -> evaluation and drift monitoring
```

Canonical identifiers should use MusicBrainz recording and release-group IDs where possible.

