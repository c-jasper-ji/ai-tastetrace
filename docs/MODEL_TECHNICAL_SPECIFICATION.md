# TasteTrace Model Technical Specification

## 1. Model purpose

TasteTrace is designed as a public, cold-start music and artist finder. It does not require a personal streaming history. A user supplies:

- one or more seed tracks or artists;
- optional genre, mood, era, country, and discovery preferences; and
- exploration and diversity controls.

The system retrieves content-near candidates and then diversifies the final set. The recommended production design is:

```text
MusicBrainz -> catalogue, tags, relationships, and canonical identifiers
FMA / archived AcousticBrainz / local Essentia -> acoustic feature layer
TasteTrace KNN -> nearest-track and nearest-artist candidate retrieval
TasteTrace MMR -> repetition control and final list diversification
```

## 2. Data-source responsibilities

### MusicBrainz

MusicBrainz is the canonical identity and metadata layer:

- artist, recording, release, and release-group MBIDs;
- names, aliases, dates, countries, labels, and relationships;
- community tags and genres where available;
- cover-art linkage through the Cover Art Archive.

MusicBrainz is not treated as a complete acoustic feature or recommendation-label dataset. API responses should be cached and requested with an identifiable User-Agent while respecting service rate limits. At larger scale, database dumps are preferable to crawling the public API.

### AcousticBrainz

AcousticBrainz contains historically useful low- and high-level descriptors keyed by MusicBrainz recording IDs. The project stopped collecting new submissions in 2022, so TasteTrace must not depend on it as a continuously maintained production service. It may be used as an optional archived enrichment source.

### Free Music Archive dataset

FMA provides a reproducible research dataset with track metadata, genre labels, play counts, pre-computed features, and licenced audio subsets. It is the primary proposed source for:

- feature-engineering experiments;
- genre and similarity baselines;
- artist-grouped train, validation, and test splits;
- KNN and ranking hyperparameter evaluation.

### Local audio model

For production tracks with legally accessible audio or previews, Essentia and pre-trained models such as MusiCNN can generate:

- embeddings;
- tempo, key, and tonal descriptors;
- loudness and spectral descriptors;
- genre, mood, danceability, and voice/instrument tags.

This is the preferred current replacement for relying on the discontinued AcousticBrainz ingestion pipeline.

## 3. Observation unit and variables

The unit of observation is a recording identified by a MusicBrainz recording MBID.

### Independent variables

For recording \(i\):

```text
X_i = [
  audio_embedding,
  tempo,
  key_profile,
  loudness,
  danceability,
  mood_probabilities,
  genre_tag_vector,
  release_year,
  artist_country,
  artist_relationship_features,
  popularity_proxy,
  evidence_confidence
]
```

Continuous variables are standardised using statistics fitted on the training split. Categorical metadata is represented with multi-hot encoding or learned embeddings. Missing features receive explicit missingness flags rather than silent zero substitution.

### Query vector

For seed set \(S\), the query representation is a weighted centroid:

```text
q = sum(w_s * X_s for s in S) / sum(w_s)
```

The user may assign equal weights, or the interface may give the first seed a larger anchor weight.

### Dependent variable

Unsupervised KNN retrieval does not require a conventional dependent variable. It ranks candidates using distance in feature space.

For supervised evaluation or future learning-to-rank, define:

```text
y(q, i) in {0, 1, 2}

0 = irrelevant
1 = plausible or weakly relevant
2 = strongly relevant
```

Labels may come from expert similarity judgements, controlled user studies, playlist co-occurrence, or privacy-approved interaction feedback. MusicBrainz metadata alone is not treated as ground-truth preference.

## 4. KNN candidate retrieval

### Mixed similarity

TasteTrace combines feature blocks rather than forcing every field into one distance:

```text
similarity(q, i) =
    0.50 * cosine(audio_embedding_q, audio_embedding_i)
  + 0.20 * cosine(tag_vector_q, tag_vector_i)
  + 0.10 * tempo_similarity
  + 0.08 * tonal_similarity
  + 0.07 * era_similarity
  + 0.05 * scene_similarity
```

The weights are starting values, not learned coefficients. They must be tuned on the validation set.

### Proposed hyperparameters

| Parameter | Initial value | Validation search |
|---|---:|---|
| Candidate neighbours `k` | 100 | 25, 50, 100, 200 |
| Audio metric | cosine | cosine, Euclidean |
| Tag representation | TF-IDF multi-hot | binary, TF-IDF |
| Seed aggregation | weighted mean | mean, medoid, max similarity |
| Minimum metadata confidence | 0.50 | 0.30-0.80 |
| Same-seed-artist exclusion | enabled | enabled, disabled |
| ANN index | exact/brute for prototype | FAISS HNSW or pgvector HNSW |
| HNSW `M` | 16 | 8, 16, 32 |
| HNSW `ef_search` | 64 | 32, 64, 128 |

Exact KNN is suitable for a small catalogue. Approximate nearest-neighbour indexing is required when the catalogue reaches hundreds of thousands or millions of recordings.

## 5. MMR diversity reranking

After KNN produces the candidate pool, maximal marginal relevance selects each next result:

```text
MMR(i) =
    lambda * relevance(q, i)
  - (1 - lambda) * max(similarity(i, j) for j in selected)
  - same_artist_penalty
  - same_album_penalty
  + emerging_artist_bonus
```

Initial parameters:

| Parameter | Initial value |
|---|---:|
| `lambda` | 0.65 |
| Same artist penalty | 0.40 |
| Same album penalty | 0.28 |
| Emerging artist coverage bonus | 0.035 |
| Maximum results per artist | 1 |
| Candidate pool before reranking | 100 |
| Final result count | 12 |

Lower `lambda` increases exploration and diversity. Higher `lambda` prioritises similarity to the query.

## 6. Training and evaluation design

KNN is instance-based: it stores indexed observations rather than estimating a conventional parametric prediction equation. Training still includes fitting preprocessing and choosing hyperparameters.

### Proposed split

Use an artist-grouped split to reduce identity leakage:

```text
Training:   70% of artists
Validation: 15% of artists
Test:       15% of artists
```

- Training fits scalers, vocabularies, dimensionality reduction, and optional metric-learning models.
- Validation selects feature weights, `k`, distance metric, MMR `lambda`, and penalties.
- Test is used once for final reporting.

### Baselines

1. Popularity-only ranking.
2. Genre/tag Jaccard similarity.
3. Audio-only KNN.
4. Metadata-only KNN.
5. Hybrid KNN without MMR.
6. Hybrid KNN with MMR.

### Metrics

- Precision@K, Recall@K, MAP@K, and NDCG@K;
- intra-list diversity;
- unique artist and album ratio;
- catalogue coverage;
- novelty and long-tail exposure;
- same-artist and same-album rate;
- latency and cache hit rate;
- explanation usefulness in a controlled user study.

## 7. Backend architecture

```text
React public web application
          |
          v
FastAPI recommendation API
          |
          +-- MusicBrainz identity adapter and cache
          +-- PostgreSQL catalogue and provenance store
          +-- Essentia feature extraction workers
          +-- Feature registry and versioned preprocessing
          +-- pgvector / FAISS nearest-neighbour index
          +-- KNN candidate retrieval service
          +-- MMR reranking service
          `-- explanation and evidence formatter
```

### Batch sequence

1. Ingest or refresh MusicBrainz metadata.
2. Resolve duplicate recordings through MBIDs and release relationships.
3. Attach FMA, archived AcousticBrainz, or locally extracted features.
4. Validate schemas and record missingness.
5. Standardise features with a versioned preprocessing pipeline.
6. Rebuild the vector index.
7. Run offline quality and representation tests.
8. Promote the new index only when validation checks pass.

The public API serves the latest validated index while the previous version remains available for rollback.

## 8. Current prototype versus target model

| Capability | Current application | Target architecture |
|---|---|---|
| Catalogue | 83 curated tracks | MusicBrainz-backed catalogue |
| Audio variables | deterministic tag-derived values | Essentia embeddings and descriptors |
| Retrieval | full-catalogue weighted scoring | KNN / ANN candidate retrieval |
| Training set | none | FMA and labelled similarity tasks |
| Dependent variable | none | optional graded relevance labels |
| Diversity | MMR-style deterministic reranking | validated MMR with exposure monitoring |
| Backend | browser-only | FastAPI, PostgreSQL, vector index, workers |
| Updates | code release | versioned batch pipeline |

## 9. Governance and limitations

- MusicBrainz tags are community-generated and incomplete.
- FMA is useful for research but does not represent the entire commercial music catalogue.
- AcousticBrainz coverage is historical and frozen.
- Audio extraction requires lawful access to audio or previews.
- Recommendation similarity is not the same as artistic quality.
- Country, genre, popularity, and emerging-artist labels can introduce representation bias.
- Every feature, model, and index version should retain source, date, licence, and transformation provenance.

## 10. Sources

- MusicBrainz API: https://musicbrainz.org/doc/MusicBrainz_API
- MusicBrainz database downloads: https://musicbrainz.org/doc/MusicBrainz_Database/Download
- AcousticBrainz: https://acousticbrainz.org/
- FMA dataset: https://github.com/mdeff/fma
- Essentia models: https://essentia.upf.edu/models.html
- Carbonell and Goldstein (1998), maximal marginal relevance.

