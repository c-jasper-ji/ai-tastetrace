# Data Dictionary

## Track entity

| Field | Type | Source in prototype | Purpose |
|---|---|---|---|
| `id` | string | curated | Stable internal identifier |
| `title` | string | curated | Display and search |
| `artist` | string | curated | Identity and diversity constraint |
| `album` | string | curated | Context and album repetition constraint |
| `year` | integer | curated | Era filtering and proximity |
| `country` | string | curated | Artist context and scene proximity |
| `tags` | string array | curated | Genre, mood, and scene representation |
| `audienceTier` | enum | curated prototype label | Mainstream, crossover, niche, or emerging |
| `criticIndex` | integer 0-100 | synthetic/curated prototype feature | Evidence-strength ranking feature |
| `momentum` | integer 0-100 | synthetic/curated prototype feature | Emerging-artist prioritisation |
| `popularity` | integer 0-100 | synthetic/curated prototype feature | Long-tail reward and popularity penalty |
| `features.energy` | float 0-1 | deterministic derivation | Sonic similarity |
| `features.dance` | float 0-1 | deterministic derivation | Sonic similarity |
| `features.acoustic` | float 0-1 | deterministic derivation | Sonic similarity and text matching |
| `features.warmth` | float 0-1 | deterministic derivation | Mood and sonic similarity |
| `features.experimental` | float 0-1 | deterministic derivation | Discovery and sonic similarity |

## Recommendation output

| Field | Type | Meaning |
|---|---|---|
| `score` | integer 0-100 | Presentation fit index, not a probability |
| `rawScore` | float 0-1 | Weighted relevance before final presentation calibration |
| `metrics.sonic` | integer 0-100 | Distance-based feature similarity |
| `metrics.tags` | integer 0-100 | Seed and candidate tag overlap |
| `metrics.scene` | integer 0-100 | Tag, era, and geography proximity |
| `metrics.brief` | integer 0-100 | Explicit preference match |
| `metrics.evidence` | integer 0-100 | Prototype evidence-strength feature |
| `metrics.discovery` | integer 0-100 | Long-tail, tier, and momentum signal |
| `metrics.diversity` | integer 0-100 | Non-redundancy relative to already selected results |
| `bridgeSeed` | string | Seed track with the strongest candidate connection |
| `sharedTags` | string array | Visible overlap evidence |
| `reviewLinks` | URL object | External search links for RYM, AOTY, and Pitchfork |

## User-controlled data

| Field | Storage | Sensitivity |
|---|---|---|
| seed IDs | React state | Low |
| natural-language brief | React state | Potentially personal taste data |
| controls | React state | Low |
| like/dislike/save feedback | browser localStorage | Personal preference data |

No account, email, payment, precise location, or streaming history is collected.

