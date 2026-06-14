# Phase 2: Catalogue and Identity

## Objective

Build a scalable, traceable track and artist data layer.

## Required work

1. Define canonical track, recording, release, album, and artist entities.
2. Prefer MusicBrainz recording and release-group IDs.
3. Record source, retrieval date, licence, and confidence.
4. Implement exact and fuzzy identity resolution.
5. Create a cache and rate-limit policy for public APIs.
6. Preserve a realistic offline demo fixture.
7. Expand geographic, genre, era, and audience-tier representation.

## Verification

- duplicate artists, albums, and recordings are detectable;
- low-confidence matches require confirmation;
- data dictionary matches schemas;
- offline mode remains functional.

