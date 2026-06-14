import { describe, expect, it } from "vitest";
import { DEFAULT_SEEDS } from "../data/catalogue";
import { artistRadar, recommend, searchCatalogue, tasteProfile } from "./recommender";

const settings = {
  preferenceText: "More electronic, atmospheric and less mainstream. Prioritise emerging artists.",
  mood: "Melancholic",
  era: "1990-2025",
  exploration: 78,
  diversity: 88,
  emergingFirst: true,
  excludeSeedArtists: true,
  resultCount: 12,
};

describe("recommendation engine", () => {
  it("returns ranked, diversified recommendations", () => {
    const results = recommend({ seedIds: DEFAULT_SEEDS, settings });
    expect(results).toHaveLength(12);
    expect(results[0].score).toBeGreaterThanOrEqual(results.at(-1)!.score);
    expect(new Set(results.map((track) => track.artist)).size).toBe(results.length);
    expect(results.every((track) => !DEFAULT_SEEDS.includes(track.id))).toBe(true);
  });

  it("keeps component scores bounded and evidence linked", () => {
    const results = recommend({ seedIds: DEFAULT_SEEDS, settings });
    results.forEach((track) => {
      Object.values(track.metrics).forEach((metric) => {
        expect(metric).toBeGreaterThanOrEqual(0);
        expect(metric).toBeLessThanOrEqual(100);
      });
      expect(track.reviewLinks.rym).toContain("rateyourmusic.com");
      expect(track.reviewLinks.aoty).toContain("albumoftheyear.org");
      expect(track.reviewLinks.pitchfork).toContain("pitchfork.com");
    });
  });

  it("builds a profile and prioritised artist radar", () => {
    const results = recommend({ seedIds: DEFAULT_SEEDS, settings });
    const profile = tasteProfile(DEFAULT_SEEDS);
    const radar = artistRadar(results);
    expect(profile.topTags.length).toBeGreaterThan(0);
    expect(profile.eraCentre).toBeGreaterThan(1990);
    expect(radar).toHaveLength(12);
    expect(radar[0].fit).toBeGreaterThan(0);
  });

  it("searches across tracks, artists, albums and tags", () => {
    expect(searchCatalogue("ambient")).not.toHaveLength(0);
    expect(searchCatalogue("Arooj")).not.toHaveLength(0);
  });
});

