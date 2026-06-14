import { TRACKS } from "../data/catalogue";
import type {
  ArtistSignal,
  ModelWeights,
  Recommendation,
  RecommendationSettings,
  TasteProfile,
  Track,
} from "../types";

export const DEFAULT_WEIGHTS: ModelWeights = {
  sonic: 0.30,
  tags: 0.20,
  scene: 0.14,
  brief: 0.12,
  evidence: 0.10,
  discovery: 0.14,
};

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const mean = (values: number[]) =>
  values.reduce((total, value) => total + value, 0) / Math.max(values.length, 1);

const normalise = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function overlap(left: string[], right: string[]) {
  const a = new Set(left);
  const union = new Set([...left, ...right]);
  if (!union.size) return 0;
  return [...a].filter((item) => right.includes(item)).length / union.size;
}

function sonicSimilarity(left: Track, right: Track) {
  const keys = Object.keys(left.features) as Array<keyof Track["features"]>;
  const distance = Math.sqrt(
    mean(keys.map((key) => (left.features[key] - right.features[key]) ** 2)),
  );
  return clamp(1 - distance);
}

function sceneSimilarity(left: Track, right: Track) {
  const tagScore = overlap(left.tags, right.tags);
  const geography = left.country === right.country ? 0.18 : 0;
  const eraDistance = Math.abs(left.year - right.year);
  const eraScore = clamp(1 - eraDistance / 35);
  return clamp(tagScore * 0.58 + eraScore * 0.28 + geography);
}

function parseBrief(text: string, mood: string) {
  const source = normalise(`${text} ${mood === "Any" ? "" : mood}`);
  const allTags = [...new Set(TRACKS.flatMap((track) => track.tags))];
  const desiredTags = allTags.filter((tag) => source.includes(normalise(tag)));
  const synonyms: Record<string, string[]> = {
    electronic: ["electronic", "synth", "digital"],
    experimental: ["experimental", "unusual", "leftfield", "adventurous"],
    melancholic: ["melancholic", "sad", "wistful", "blue"],
    atmospheric: ["atmospheric", "spacious", "immersive", "cinematic"],
    intimate: ["intimate", "close", "personal", "quiet"],
    energetic: ["energetic", "upbeat", "driving", "intense"],
    meditative: ["meditative", "calm", "focus", "peaceful"],
    "post punk": ["post punk", "angular"],
    shoegaze: ["shoegaze", "fuzzy", "wall of sound"],
    jazz: ["jazz", "improvised"],
  };
  Object.entries(synonyms).forEach(([tag, words]) => {
    if (words.some((word) => source.includes(word)) && !desiredTags.includes(tag)) {
      desiredTags.push(tag);
    }
  });
  return {
    desiredTags,
    niche: /(niche|underground|obscure|hidden|deep cut|less mainstream)/.test(source),
    emerging: /(emerging|growing|new artist|rising|breakthrough)/.test(source),
    acoustic: /(acoustic|organic|unplugged)/.test(source),
    electronic: /(electronic|synth|digital)/.test(source),
    calmer: /(calm|quiet|meditative|slow|focus)/.test(source),
    energetic: /(energetic|upbeat|driving|intense)/.test(source),
    darker: /(dark|bleak|harrowing|nocturnal)/.test(source),
    warmer: /(warm|soulful|human|comforting)/.test(source),
  };
}

function briefMatch(track: Track, parsed: ReturnType<typeof parseBrief>) {
  const parts: number[] = [];
  if (parsed.desiredTags.length) {
    parts.push(
      parsed.desiredTags.filter((tag) => track.tags.includes(tag)).length /
        parsed.desiredTags.length,
    );
  }
  if (parsed.acoustic) parts.push(track.features.acoustic);
  if (parsed.electronic) parts.push(1 - track.features.acoustic);
  if (parsed.calmer) parts.push(1 - track.features.energy);
  if (parsed.energetic) parts.push(track.features.energy);
  if (parsed.darker) parts.push(1 - track.features.warmth);
  if (parsed.warmer) parts.push(track.features.warmth);
  return parts.length ? mean(parts) : 0.62;
}

function discoverySignal(
  track: Track,
  parsed: ReturnType<typeof parseBrief>,
  settings: RecommendationSettings,
) {
  const longTail = 1 - track.popularity / 100;
  const momentum = track.momentum / 100;
  const tierBonus =
    track.audienceTier === "emerging"
      ? 1
      : track.audienceTier === "niche"
        ? 0.78
        : track.audienceTier === "crossover"
          ? 0.42
          : 0.10;
  const requestedBoost = parsed.niche || parsed.emerging || settings.emergingFirst ? 0.14 : 0;
  return clamp(longTail * 0.42 + tierBonus * 0.34 + momentum * 0.24 + requestedBoost);
}

function evidenceSignal(track: Track) {
  const critic = track.criticIndex / 100;
  const support = Math.min(1, 0.44 + track.popularity / 180 + track.momentum / 300);
  return critic * 0.76 + support * 0.24;
}

function eraMatches(track: Track, era: string) {
  if (era === "Any time") return true;
  const [start, end] = era.split("-").map(Number);
  return track.year >= start && track.year <= end;
}

function reviewLinks(track: Track) {
  const query = encodeURIComponent(`${track.artist} ${track.album}`);
  return {
    rym: `https://rateyourmusic.com/search?searchterm=${query}&searchtype=l`,
    aoty: `https://www.albumoftheyear.org/search/albums/?q=${query}`,
    pitchfork: `https://pitchfork.com/search/?query=${query}`,
  };
}

function explain(
  track: Track,
  sharedTags: string[],
  bridgeSeed: Track,
  discovery: number,
  settings: RecommendationSettings,
) {
  const clauses: string[] = [];
  if (sharedTags.length) {
    clauses.push(`shares ${sharedTags.slice(0, 2).join(" and ")} with ${bridgeSeed.title}`);
  } else {
    clauses.push(`sits near ${bridgeSeed.title} in the model's sonic feature space`);
  }
  if (track.audienceTier === "emerging") {
    clauses.push("adds a high-momentum emerging artist");
  } else if (track.audienceTier === "niche" && discovery > 0.62) {
    clauses.push("keeps the route in the long tail rather than the obvious catalogue");
  } else if (settings.diversity > 65) {
    clauses.push("widens the set without abandoning your central taste");
  }
  return `This recommendation ${clauses.join(" and ")}.`;
}

function candidateSimilarity(left: Recommendation, right: Recommendation) {
  return overlap(left.tags, right.tags) * 0.56 + sonicSimilarity(left, right) * 0.44;
}

function diversify(
  candidates: Recommendation[],
  resultCount: number,
  diversity: number,
) {
  const selected: Recommendation[] = [];
  const pool = [...candidates];
  const diversityWeight = 0.12 + (diversity / 100) * 0.48;

  while (pool.length && selected.length < resultCount) {
    const scored = pool.map((candidate) => {
      const similarArtist = selected.some((item) => item.artist === candidate.artist);
      const sameAlbum = selected.some((item) => item.album === candidate.album);
      const redundancy = selected.length
        ? Math.max(...selected.map((item) => candidateSimilarity(candidate, item)))
        : 0;
      const hardPenalty = similarArtist ? 0.40 : sameAlbum ? 0.28 : 0;
      const emergingLift =
        candidate.audienceTier === "emerging" && !selected.some((item) => item.audienceTier === "emerging")
          ? 0.035
          : 0;
      const rerank = candidate.rawScore - redundancy * diversityWeight - hardPenalty + emergingLift;
      return { candidate, rerank, redundancy };
    });
    scored.sort((left, right) => right.rerank - left.rerank);
    const winner = scored[0];
    selected.push({
      ...winner.candidate,
      metrics: {
        ...winner.candidate.metrics,
        diversity: Math.round((1 - winner.redundancy) * 100),
      },
    });
    pool.splice(
      pool.findIndex((candidate) => candidate.id === winner.candidate.id),
      1,
    );
  }

  return selected.map((track, index) => ({
    ...track,
    score: Math.round(clamp(track.rawScore + 0.11 - index * 0.002) * 100),
  }));
}

export function recommend({
  seedIds,
  settings,
  weights = DEFAULT_WEIGHTS,
  feedback = {},
}: {
  seedIds: string[];
  settings: RecommendationSettings;
  weights?: ModelWeights;
  feedback?: Record<string, "like" | "dislike" | "saved" | undefined>;
}) {
  const seeds = TRACKS.filter((track) => seedIds.includes(track.id));
  if (!seeds.length) return [];
  const parsed = parseBrief(settings.preferenceText, settings.mood);
  const seedArtists = new Set(seeds.map((track) => track.artist));

  const candidates = TRACKS.filter((track) => !seedIds.includes(track.id))
    .filter((track) => !settings.excludeSeedArtists || !seedArtists.has(track.artist))
    .filter((track) => eraMatches(track, settings.era))
    .map((track): Recommendation => {
      const seedScores = seeds.map((seed) => ({
        seed,
        sonic: sonicSimilarity(seed, track),
        tags: overlap(seed.tags, track.tags),
        scene: sceneSimilarity(seed, track),
      }));
      const bridge = [...seedScores].sort(
        (left, right) =>
          right.sonic + right.tags + right.scene - (left.sonic + left.tags + left.scene),
      )[0];
      const sonic = mean(seedScores.map((item) => item.sonic));
      const tags = mean(seedScores.map((item) => item.tags));
      const scene = mean(seedScores.map((item) => item.scene));
      const brief = briefMatch(track, parsed);
      const evidence = evidenceSignal(track);
      const discovery = discoverySignal(track, parsed, settings);
      const explorationScale = 0.45 + settings.exploration / 100;
      const discoveryWeighted = clamp(discovery * explorationScale);
      const feedbackAdjustment =
        feedback[track.id] === "like"
          ? 0.06
          : feedback[track.id] === "saved"
            ? 0.04
            : feedback[track.id] === "dislike"
              ? -0.22
              : 0;
      const popularityPenalty =
        parsed.niche || settings.emergingFirst
          ? Math.max(0, track.popularity - 58) / 420
          : Math.max(0, track.popularity - 91) / 500;
      const rawScore = clamp(
        sonic * weights.sonic +
          tags * weights.tags +
          scene * weights.scene +
          brief * weights.brief +
          evidence * weights.evidence +
          discoveryWeighted * weights.discovery -
          popularityPenalty +
          feedbackAdjustment,
      );
      const sharedTags = track.tags
        .filter((tag) => seeds.some((seed) => seed.tags.includes(tag)) || parsed.desiredTags.includes(tag))
        .slice(0, 4);

      return {
        ...track,
        score: 0,
        rawScore,
        metrics: {
          sonic: Math.round(sonic * 100),
          tags: Math.round(tags * 100),
          scene: Math.round(scene * 100),
          brief: Math.round(brief * 100),
          evidence: Math.round(evidence * 100),
          discovery: Math.round(discoveryWeighted * 100),
          diversity: 100,
        },
        sharedTags,
        bridgeSeed: bridge.seed.title,
        explanation: explain(track, sharedTags, bridge.seed, discovery, settings),
        reviewLinks: reviewLinks(track),
      };
    })
    .sort((left, right) => right.rawScore - left.rawScore);

  return diversify(candidates, settings.resultCount, settings.diversity);
}

export function tasteProfile(seedIds: string[]): TasteProfile {
  const seeds = TRACKS.filter((track) => seedIds.includes(track.id));
  if (!seeds.length) {
    return {
      topTags: [],
      eraCentre: 0,
      energy: 0,
      experimental: 0,
      acoustic: 0,
      discoveryReadiness: 0,
      blindSpot: "Add seed tracks to reveal a blind spot.",
    };
  }
  const counts = new Map<string, number>();
  seeds.flatMap((track) => track.tags).forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  const topTags = [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value: Math.round((value / seeds.length) * 100) }));
  const unrepresented = [
    "jazz",
    "ambient",
    "post punk",
    "art pop",
    "experimental",
    "folk",
    "club",
    "shoegaze",
  ].find((tag) => !counts.has(tag));
  return {
    topTags,
    eraCentre: Math.round(mean(seeds.map((track) => track.year))),
    energy: Math.round(mean(seeds.map((track) => track.features.energy)) * 100),
    experimental: Math.round(mean(seeds.map((track) => track.features.experimental)) * 100),
    acoustic: Math.round(mean(seeds.map((track) => track.features.acoustic)) * 100),
    discoveryReadiness: Math.round(mean(seeds.map((track) => 100 - track.popularity)) + 42),
    blindSpot: unrepresented
      ? `Your seeds contain little ${unrepresented}; it is a useful controlled exploration direction.`
      : "Your seed set already spans several distinct scenes.",
  };
}

export function artistRadar(results: Recommendation[]): ArtistSignal[] {
  const artists = new Map<string, Recommendation[]>();
  results.forEach((track) => {
    artists.set(track.artist, [...(artists.get(track.artist) ?? []), track]);
  });
  return [...artists.entries()]
    .map(([artist, tracks]) => {
      const best = [...tracks].sort((left, right) => right.score - left.score)[0];
      return {
        artist,
        country: best.country,
        tier: best.audienceTier,
        momentum: best.momentum,
        fit: Math.round(mean(tracks.map((track) => track.score))),
        bridgeSeed: best.bridgeSeed,
        tags: [...new Set(tracks.flatMap((track) => track.tags))].slice(0, 4),
        trackCount: tracks.length,
      };
    })
    .sort((left, right) => {
      const leftPriority = left.fit + left.momentum * 0.22 + (left.tier === "emerging" ? 7 : 0);
      const rightPriority = right.fit + right.momentum * 0.22 + (right.tier === "emerging" ? 7 : 0);
      return rightPriority - leftPriority;
    });
}

export function searchCatalogue(query: string, excludedIds: string[] = []) {
  const normalised = normalise(query);
  if (normalised.length < 2) return [];
  return TRACKS.filter((track) => !excludedIds.includes(track.id))
    .map((track) => ({
      track,
      score: normalise(`${track.title} ${track.artist} ${track.album} ${track.tags.join(" ")}`).includes(
        normalised,
      )
        ? 1
        : normalise(`${track.artist} ${track.title}`).split(" ").filter((word) => normalised.includes(word))
            .length / 4,
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || left.track.artist.localeCompare(right.track.artist))
    .slice(0, 8)
    .map((item) => item.track);
}

