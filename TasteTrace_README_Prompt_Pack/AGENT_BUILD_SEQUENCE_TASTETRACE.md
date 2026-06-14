# Agent Build Sequence

## Global instruction

> Read the root README, current phase prompt, BUILD_STATUS.md, and relevant source files. Preserve working behaviour and user changes. Implement the phase completely, run the required checks, and update BUILD_STATUS.md. Do not make unsupported data, AI, ML, or review-source claims.

## Phase order

| Phase | Prompt | Outcome |
|---|---|---|
| 0 | `00_PROJECT_GUARDRAILS.md` | Scope, claims, repository and data governance |
| 1 | `01_FOUNDATION_AND_PRODUCT_UI.md` | Stable responsive product shell |
| 2 | `02_CATALOGUE_AND_IDENTITY.md` | Canonical track and artist data layer |
| 3 | `03_HYBRID_RECOMMENDER.md` | Candidate scoring and explanations |
| 4 | `04_DIVERSITY_AND_ARTIST_RADAR.md` | Repetition controls and emerging-artist discovery |
| 5 | `05_REVIEW_EVIDENCE_INTEGRATION.md` | Permissioned review context and provenance |
| 6 | `06_EVALUATION_AND_RESPONSIBLE_AI.md` | Metrics, tests, ethics and model evidence |
| 7 | `07_FINAL_AUDIT_AND_RELEASE.md` | Release-ready quality and documentation |

## Definition of complete

- every control performs a real action;
- all scores have traceable sources;
- diversity metrics and constraints are tested;
- external data has licence, source, and retrieval metadata;
- tests, build, and dependency audit pass;
- desktop and mobile layouts pass visual QA;
- setup instructions work from a clean clone;
- README claims match the working product.

