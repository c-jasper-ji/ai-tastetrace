export type AudienceTier = "mainstream" | "crossover" | "niche" | "emerging";

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  country: string;
  tags: string[];
  audienceTier: AudienceTier;
  criticIndex: number;
  momentum: number;
  popularity: number;
  features: {
    energy: number;
    dance: number;
    acoustic: number;
    warmth: number;
    experimental: number;
  };
};

export type RecommendationMetrics = {
  sonic: number;
  tags: number;
  scene: number;
  brief: number;
  evidence: number;
  discovery: number;
  diversity: number;
};

export type Recommendation = Track & {
  score: number;
  rawScore: number;
  metrics: RecommendationMetrics;
  sharedTags: string[];
  explanation: string;
  bridgeSeed: string;
  reviewLinks: {
    rym: string;
    aoty: string;
    pitchfork: string;
  };
};

export type RecommendationSettings = {
  preferenceText: string;
  mood: string;
  era: string;
  exploration: number;
  diversity: number;
  emergingFirst: boolean;
  excludeSeedArtists: boolean;
  resultCount: number;
};

export type ModelWeights = {
  sonic: number;
  tags: number;
  scene: number;
  brief: number;
  evidence: number;
  discovery: number;
};

export type TasteProfile = {
  topTags: Array<{ name: string; value: number }>;
  eraCentre: number;
  energy: number;
  experimental: number;
  acoustic: number;
  discoveryReadiness: number;
  blindSpot: string;
};

export type ArtistSignal = {
  artist: string;
  country: string;
  tier: AudienceTier;
  momentum: number;
  fit: number;
  bridgeSeed: string;
  tags: string[];
  trackCount: number;
};

