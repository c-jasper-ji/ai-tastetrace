# TasteTrace App Notes

## Product rules

- The first screen is the working discovery product.
- Every visible score must be traceable to deterministic data or model logic.
- Never label the fit index as a probability.
- Do not present external review-site ratings as live unless a licensed, dated source adapter exists.
- Protect catalogue diversity: artist and album repetition controls are core behaviour.

## Visual rules

- Preserve the dark research-console aesthetic.
- Use violet for model state, lime for discovery, cyan for evidence, and semantic colours sparingly.
- Keep radii at 7px or below.
- Avoid decorative gradients, oversized marketing copy, and empty landing-page sections.
- Use Phosphor icons rather than custom SVGs or text glyphs.

## Engineering rules

- Keep recommendation logic in `src/lib/recommender.ts`.
- Keep catalogue records and data labels in `src/data/catalogue.ts`.
- Add behavioural tests for ranking changes.
- Preserve credential-free demo mode.

