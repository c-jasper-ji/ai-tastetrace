# Privacy and Ethics

## Data minimisation

The prototype stores only recommendation feedback in browser `localStorage`. It does not require an account and does not collect contact, payment, employer, or precise-location data.

## Preference sensitivity

Music taste can reveal or correlate with culture, religion, language, age, mood, and community identity. A production system should treat preference histories as personal data, provide deletion and export controls, and avoid sensitive-trait inference.

## Artist exposure

Recommendation systems can concentrate attention on already popular artists. TasteTrace therefore:

- includes long-tail value in the base score;
- provides an emerging-artist option;
- constrains repeated artists and albums;
- reports catalogue niche share;
- separates personal fit from momentum.

These controls improve exposure diversity but do not guarantee fairness.

## Global representation

The demonstration catalogue is broader than the original trial but remains incomplete. Country is a coarse label, genre tags are subjective, and global scenes are underrepresented. Production expansion should include regional curators, multilingual metadata, and exposure audits by geography and audience tier.

## Review-source governance

RYM, AOTY, and Pitchfork are linked for user investigation. Their live scores and text are not copied into the prototype. Production ingestion should require:

- permission or a stable authorised API;
- source and retrieval timestamps;
- clear attribution;
- cache and deletion policy;
- terms-of-service review;
- separation between critic, user, and model signals.

## Human agency

The fit index is descriptive decision support. Users can inspect why a track appears, adjust model strategy, provide feedback, and open independent sources. The application should not imply objective musical quality.

