# TasteTrace

**Explainable, diversity-aware music discovery for listeners who want more than another popularity loop.**

TasteTrace is a functional AI/ML product prototype. A listener selects several seed tracks, describes a discovery goal in natural language, and receives a diversified recommendation set with traceable component scores, artist-level discovery, and external review links.

The application is designed for the Imperial College London group-project option on AI product prototyping. It demonstrates a complete product workflow rather than a static landing page:

`User taste evidence -> feature model -> hybrid ranking -> diversity reranking -> explanation -> feedback`

Public demo: https://c-jasper-ji.github.io/ai-tastetrace/

Technical model guide:
[TASTETRACE_MODEL_TECHNICAL_SPECIFICATION.pdf](TASTETRACE_MODEL_TECHNICAL_SPECIFICATION.pdf)

## Product problem

Mainstream music recommenders are effective at reducing search effort, but they can also:

- repeat the same artists, albums, and closely related tracks;
- over-reward popularity and catalogue familiarity;
- make recommendations difficult to audit;
- provide limited support for emerging or niche artists; and
- separate listening recommendations from editorial and community context.

TasteTrace addresses those problems with transparent ranking, explicit diversity constraints, a niche-first artist radar, and review-source links.

## Working features

- Search an 80+ track, 70+ artist curated prototype catalogue.
- Select 3-10 seed tracks.
- Parse a natural-language discovery brief.
- Control mood, era, exploration, diversity, emerging-artist priority, and seed-artist exclusion.
- Rank candidates using six visible signals.
- Apply maximal marginal relevance-style reranking.
- Enforce a maximum of one selected result per artist and penalise album duplication.
- Inspect a 0-100 fit index and seven component scores.
- Open Rate Your Music, Album of the Year, and Pitchfork searches for each album.
- Explore a niche-first Artist Radar.
- Review a descriptive Taste Profile and a controlled blind spot.
- Adjust model weights in Model Lab.
- Like, dislike, and save recommendations with browser persistence.
- Use the complete prototype without API keys.

## Run locally

Requirements: Node.js 20.19 or later.

### Windows launcher

Double-click:

```text
START_TASTETRACE.cmd
```

### Terminal

```powershell
cd app
npm install
npm run dev
```

Open `http://127.0.0.1:4173`.

## Verify

```powershell
cd app
npm test
npm run build
npm audit
```

## Recommendation method

The prototype uses a deterministic hybrid score:

```text
BaseScore =
    30% sonic-feature similarity
  + 20% tag overlap
  + 14% scene proximity
  + 12% natural-language brief match
  + 10% evidence strength
  + 14% discovery value
  - popularity penalty
  + feedback adjustment
```

The ranked candidate list then enters a diversity stage:

```text
RerankScore =
    BaseScore
  - diversity_weight * similarity_to_selected_results
  - same_artist_penalty
  - same_album_penalty
  + emerging_artist_coverage_bonus
```

This separates relevance from set quality. A track can be individually similar but still be removed when it makes the final list repetitive.

## Evidence and review sources

The application does **not** scrape or reproduce live Rate Your Music, Album of the Year, or Pitchfork ratings. It provides:

- a clearly labelled, synthetic prototype evidence index used as a ranking feature; and
- outbound search links so users can inspect the album on each source.

This avoids presenting stale or unauthorised external data as live evidence. A production integration would require permission, stable APIs, provenance dates, caching, and source-specific terms review.

## Catalogue and data claims

The bundled catalogue is a hand-curated demonstration dataset. Track identity, artist, album, year, country, and tags are intended for product prototyping. Audio-style features, momentum, popularity, and the evidence index are derived or curated prototype features, not measurements copied from a streaming platform.

The project demonstrates a scalable data architecture; it does not claim that the bundled dataset alone is "big data".

## Repository map

```text
.
|-- app/                         # React, TypeScript, Vite application
|   |-- src/data/                # Curated catalogue
|   |-- src/lib/                 # Ranking, diversity, search, profile logic
|   |-- src/App.tsx              # Product views and interactions
|   `-- src/styles.css           # Responsive visual system
|-- docs/                        # Architecture, model, data, ethics, and demo docs
|-- TasteTrace_README_Prompt_Pack/
|   `-- agent-prompts/           # Structured future build prompts
|-- TASTETRACE_PROJECT_GUIDE.pdf # Visual project specification
|-- TASTETRACE_MODEL_TECHNICAL_SPECIFICATION.pdf
|-- BUILD_STATUS.md
|-- START_TASTETRACE.cmd
`-- start-tastetrace.ps1
```

## Academic and engineering position

TasteTrace should be presented as an AI-assisted, ML-informed product prototype:

- **AI product design:** natural-language preference input and evidence-based explanations.
- **ML logic:** vector similarity, multi-signal ranking, feedback adjustment, and MMR-style reranking.
- **Data architecture:** structured track entities, features, evidence metadata, and future source adapters.
- **Responsible claims:** no invented live ratings, no claim that the fit index is a calibrated probability, and no claim of production-scale model accuracy.

See [docs/MODEL_CARD.md](docs/MODEL_CARD.md),
[docs/MODEL_TECHNICAL_SPECIFICATION.md](docs/MODEL_TECHNICAL_SPECIFICATION.md),
and [docs/PRIVACY_AND_ETHICS.md](docs/PRIVACY_AND_ETHICS.md).

## Current limitations

- The catalogue is curated and finite.
- Audio-style features are derived prototype values, not extracted from audio files.
- The community/scene signal is a structured approximation rather than a trained collaborative-filtering model.
- Review links are external searches, not licensed score ingestion.
- Feedback is local to one browser and does not train a persistent production model.
- No user accounts, streaming playback, or commercial API integrations are included.

## Production roadmap

1. Use MusicBrainz recording and release-group IDs as canonical identifiers.
2. Use FMA for reproducible feature and retrieval experiments.
3. Treat AcousticBrainz as optional historical enrichment, not a live dependency.
4. Replace derived features with locally extracted Essentia or MusiCNN embeddings.
5. Retrieve candidates with validated KNN or approximate-nearest-neighbour search.
6. Apply MMR reranking and monitor artist, album, and catalogue exposure.
7. Measure precision, recall, NDCG, coverage, novelty, and intra-list diversity.
8. Add FastAPI, PostgreSQL, a vector index, provenance, and rollback controls.

## Licence

No open-source licence has been selected yet. The repository is publicly
visible, but reuse rights are not granted until a licence is added.
