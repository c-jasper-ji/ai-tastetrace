import { useEffect, useMemo, useState } from "react";
import {
  ArrowClockwise,
  ArrowSquareOut,
  BookOpenText,
  BookmarkSimple,
  Brain,
  ChartPolar,
  Check,
  Compass,
  Database,
  Flask,
  Heart,
  Info,
  List,
  MagnifyingGlass,
  MusicNotes,
  SlidersHorizontal,
  Sparkle,
  Target,
  ThumbsDown,
  TrendUp,
  VinylRecord,
  X,
} from "@phosphor-icons/react";
import { CATALOGUE_STATS, DEFAULT_SEEDS, TRACKS } from "./data/catalogue";
import {
  DEFAULT_WEIGHTS,
  artistRadar,
  recommend,
  searchCatalogue,
  tasteProfile,
} from "./lib/recommender";
import type {
  ModelWeights,
  Recommendation,
  RecommendationSettings,
  Track,
} from "./types";

type View = "discover" | "artists" | "profile" | "evidence" | "lab";
type Feedback = Record<string, "like" | "dislike" | "saved" | undefined>;

const NAVIGATION = [
  { id: "discover" as const, label: "Discover", icon: Compass },
  { id: "artists" as const, label: "Artist Radar", icon: Target },
  { id: "profile" as const, label: "Taste Profile", icon: ChartPolar },
  { id: "evidence" as const, label: "Evidence", icon: BookOpenText },
  { id: "lab" as const, label: "Model Lab", icon: Flask },
];

const METRIC_LABELS = {
  sonic: "Sonic fit",
  tags: "Tag overlap",
  scene: "Scene proximity",
  brief: "Brief match",
  evidence: "Evidence strength",
  discovery: "Long-tail value",
  diversity: "Set diversity",
};

const DEFAULT_SETTINGS: RecommendationSettings = {
  preferenceText:
    "More electronic and atmospheric, with a melancholic edge. Prefer niche and emerging artists.",
  mood: "Melancholic",
  era: "1990-2025",
  exploration: 78,
  diversity: 88,
  emergingFirst: true,
  excludeSeedArtists: true,
  resultCount: 12,
};

function useStoredFeedback() {
  const [feedback, setFeedback] = useState<Feedback>(() => {
    try {
      return JSON.parse(localStorage.getItem("tastetrace.feedback") ?? "{}") as Feedback;
    } catch {
      return {};
    }
  });

  function update(id: string, value: NonNullable<Feedback[string]>) {
    const next = { ...feedback, [id]: feedback[id] === value ? undefined : value };
    setFeedback(next);
    localStorage.setItem("tastetrace.feedback", JSON.stringify(next));
  }

  return [feedback, update] as const;
}

function Logo() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <VinylRecord size={24} weight="duotone" />
      </div>
      <div>
        <strong>
          Taste<span>Trace</span>
        </strong>
        <small>Discovery with receipts.</small>
      </div>
    </div>
  );
}

function Sidebar({
  view,
  setView,
  mobileOpen,
  setMobileOpen,
}: {
  view: View;
  setView: (view: View) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  return (
    <>
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <Logo />
        <nav aria-label="Main navigation">
          <p>Workspace</p>
          {NAVIGATION.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={view === item.id ? "active" : ""}
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setMobileOpen(false);
                }}
              >
                <Icon size={19} weight={view === item.id ? "fill" : "regular"} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-spacer" />
        <section className="sidebar-callout">
          <Sparkle size={19} weight="fill" />
          <strong>Niche-first mode</strong>
          <p>Emerging artists receive visibility, while artist and album repetition are constrained.</p>
        </section>
        <footer>
          <span>AI product prototype</span>
          <b>Imperial College London · 2026</b>
        </footer>
      </aside>
      {mobileOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

function PageHeader({
  view,
  setMobileOpen,
}: {
  view: View;
  setMobileOpen: (open: boolean) => void;
}) {
  const copy: Record<View, [string, string]> = {
    discover: ["Explainable discovery", "Find music beyond the obvious."],
    artists: ["Long-tail discovery", "Artist Radar"],
    profile: ["Taste intelligence", "Your listening profile"],
    evidence: ["Traceable recommendations", "Evidence desk"],
    lab: ["Transparent modelling", "Model Lab"],
  };
  return (
    <header className="page-header">
      <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
        <List size={21} />
      </button>
      <div>
        <span className="eyebrow">{copy[view][0]}</span>
        <h1>{copy[view][1]}</h1>
      </div>
      <div className="model-status">
        <span />
        <div>
          <strong>Prototype model online</strong>
          <small>{CATALOGUE_STATS.tracks} curated tracks · deterministic ranking</small>
        </div>
      </div>
    </header>
  );
}

function StatStrip() {
  const stats = [
    [CATALOGUE_STATS.tracks, "curated tracks"],
    [CATALOGUE_STATS.artists, "distinct artists"],
    [CATALOGUE_STATS.countries, "countries"],
    [`${CATALOGUE_STATS.nicheShare}%`, "niche or emerging"],
  ];
  return (
    <section className="stat-strip" aria-label="Catalogue summary">
      {stats.map(([value, label]) => (
        <div key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}

function TrackGlyph({ track, size = "medium" }: { track: Track; size?: "small" | "medium" | "large" }) {
  return (
    <span className={`track-glyph ${size}`} aria-hidden="true">
      <VinylRecord size={size === "large" ? 34 : size === "small" ? 18 : 24} weight="duotone" />
      <i>{track.artist.slice(0, 2).toUpperCase()}</i>
    </span>
  );
}

function SeedPicker({
  seedIds,
  setSeedIds,
}: {
  seedIds: string[];
  setSeedIds: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const seeds = TRACKS.filter((track) => seedIds.includes(track.id));
  const suggestions = searchCatalogue(query, seedIds);

  function addTrack(id: string) {
    if (seedIds.length < 10) setSeedIds([...seedIds, id]);
    setQuery("");
  }

  return (
    <section className="panel setup-panel">
      <div className="step-heading">
        <i>1</i>
        <div>
          <h2>Build a taste anchor</h2>
          <p>Select 3-10 tracks. A mixed seed set creates a more useful discovery space.</p>
        </div>
        <span>{seedIds.length} / 10</span>
      </div>
      <div className="seed-grid">
        {seeds.map((track) => (
          <div className="seed-chip" key={track.id}>
            <TrackGlyph track={track} size="small" />
            <span>
              <strong>{track.title}</strong>
              <small>{track.artist}</small>
            </span>
            <button
              aria-label={`Remove ${track.title}`}
              onClick={() => setSeedIds(seedIds.filter((id) => id !== track.id))}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
      <div className="search-box">
        <MagnifyingGlass size={19} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by song, artist, album, genre or mood..."
        />
        {suggestions.length > 0 && (
          <div className="search-results">
            {suggestions.map((track) => (
              <button key={track.id} onClick={() => addTrack(track.id)}>
                <TrackGlyph track={track} size="small" />
                <span>
                  <strong>{track.title}</strong>
                  <small>{track.artist} · {track.album} · {track.year}</small>
                </span>
                <em>{track.audienceTier}</em>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button className={`toggle ${checked ? "on" : ""}`} onClick={onChange} aria-pressed={checked}>
      <span />
      <b>{label}</b>
    </button>
  );
}

function DiscoveryBrief({
  settings,
  setSettings,
}: {
  settings: RecommendationSettings;
  setSettings: (settings: RecommendationSettings) => void;
}) {
  return (
    <section className="panel setup-panel">
      <div className="step-heading">
        <i>2</i>
        <div>
          <h2>Set the discovery brief</h2>
          <p>Control how far the model travels and how aggressively it removes repetition.</p>
        </div>
      </div>
      <div className="brief-grid">
        <label className="brief-field">
          <span>Describe the route in your own words</span>
          <textarea
            maxLength={260}
            value={settings.preferenceText}
            onChange={(event) => setSettings({ ...settings, preferenceText: event.target.value })}
          />
          <small>{settings.preferenceText.length}/260</small>
        </label>
        <div className="range-stack">
          <RangeControl
            label="Exploration"
            value={settings.exploration}
            hint="Rewards long-tail and lower-popularity candidates."
            left="Familiar"
            right="Deep cut"
            onChange={(value) => setSettings({ ...settings, exploration: value })}
          />
          <RangeControl
            label="Result diversity"
            value={settings.diversity}
            hint="Penalises similar tracks already selected into the result set."
            left="Tight"
            right="Wide"
            onChange={(value) => setSettings({ ...settings, diversity: value })}
          />
        </div>
      </div>
      <div className="control-grid">
        <label>
          <span>Mood</span>
          <select value={settings.mood} onChange={(event) => setSettings({ ...settings, mood: event.target.value })}>
            <option>Any</option>
            <option>Melancholic</option>
            <option>Atmospheric</option>
            <option>Energetic</option>
            <option>Intimate</option>
            <option>Meditative</option>
          </select>
        </label>
        <label>
          <span>Era</span>
          <select value={settings.era} onChange={(event) => setSettings({ ...settings, era: event.target.value })}>
            <option>Any time</option>
            <option>1990-2025</option>
            <option>1990-2009</option>
            <option>2010-2025</option>
            <option>2020-2025</option>
          </select>
        </label>
        <Toggle
          checked={settings.emergingFirst}
          onChange={() => setSettings({ ...settings, emergingFirst: !settings.emergingFirst })}
          label="Prioritise emerging artists"
        />
        <Toggle
          checked={settings.excludeSeedArtists}
          onChange={() => setSettings({ ...settings, excludeSeedArtists: !settings.excludeSeedArtists })}
          label="Exclude seed artists"
        />
      </div>
    </section>
  );
}

function RangeControl({
  label,
  value,
  hint,
  left,
  right,
  onChange,
}: {
  label: string;
  value: number;
  hint: string;
  left: string;
  right: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-control">
      <span>
        <b>{label}</b>
        <em>{value}%</em>
      </span>
      <small><i>{left}</i><i>{right}</i></small>
      <input type="range" min="0" max="100" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <p>{hint}</p>
    </label>
  );
}

function MetricBar({ value, tone = "violet" }: { value: number; tone?: "violet" | "lime" | "cyan" }) {
  return (
    <span className="metric-bar">
      <i className={tone} style={{ width: `${value}%` }} />
    </span>
  );
}

function FeedbackButtons({
  id,
  value,
  update,
  compact = false,
}: {
  id: string;
  value?: Feedback[string];
  update: (id: string, value: NonNullable<Feedback[string]>) => void;
  compact?: boolean;
}) {
  return (
    <span className={`feedback-buttons ${compact ? "compact" : ""}`}>
      <button
        className={value === "like" ? "selected like" : ""}
        aria-label="Like recommendation"
        onClick={(event) => {
          event.stopPropagation();
          update(id, "like");
        }}
      >
        <Heart size={17} weight={value === "like" ? "fill" : "regular"} />
        {!compact && "Like"}
      </button>
      <button
        className={value === "dislike" ? "selected dislike" : ""}
        aria-label="Dislike recommendation"
        onClick={(event) => {
          event.stopPropagation();
          update(id, "dislike");
        }}
      >
        <ThumbsDown size={17} weight={value === "dislike" ? "fill" : "regular"} />
        {!compact && "Not for me"}
      </button>
      <button
        className={value === "saved" ? "selected saved" : ""}
        aria-label="Save recommendation"
        onClick={(event) => {
          event.stopPropagation();
          update(id, "saved");
        }}
      >
        <BookmarkSimple size={17} weight={value === "saved" ? "fill" : "regular"} />
        {!compact && "Save"}
      </button>
    </span>
  );
}

function ResultTable({
  results,
  selectedId,
  setSelectedId,
  feedback,
  updateFeedback,
}: {
  results: Recommendation[];
  selectedId?: string;
  setSelectedId: (id: string) => void;
  feedback: Feedback;
  updateFeedback: (id: string, value: NonNullable<Feedback[string]>) => void;
}) {
  return (
    <section className="panel result-panel">
      <div className="step-heading result-heading">
        <i>3</i>
        <div>
          <h2>Recommendations</h2>
          <p>Maximum one result per artist in this set; album duplication is also constrained.</p>
        </div>
        <span>{results.length} diversified results</span>
      </div>
      <div className="result-list">
        <div className="result-list-head">
          <span>#</span><span>Track</span><span>Evidence</span><span>Discovery</span><span>Fit</span><span />
        </div>
        {results.map((track, index) => (
          <button
            className={`result-row ${selectedId === track.id ? "selected" : ""}`}
            key={track.id}
            onClick={() => setSelectedId(track.id)}
          >
            <span className="rank">{index + 1}</span>
            <span className="track-cell">
              <TrackGlyph track={track} />
              <span>
                <strong>{track.title}</strong>
                <small>{track.artist} · {track.year} · {track.country}</small>
                <em>{track.tags.slice(0, 3).join(" · ")}</em>
              </span>
            </span>
            <span className="row-metrics">
              <span><small>Sonic</small><MetricBar value={track.metrics.sonic} /><b>{track.metrics.sonic}</b></span>
              <span><small>Evidence</small><MetricBar value={track.metrics.evidence} tone="cyan" /><b>{track.metrics.evidence}</b></span>
            </span>
            <span className="discovery-cell">
              <i className={track.audienceTier}>{track.audienceTier}</i>
              <small><TrendUp size={13} /> {track.momentum} momentum</small>
            </span>
            <span className="fit-score">
              <strong>{track.score}</strong>
              <small>index</small>
            </span>
            <FeedbackButtons id={track.id} value={feedback[track.id]} update={updateFeedback} compact />
          </button>
        ))}
      </div>
    </section>
  );
}

function DetailRail({
  track,
  feedback,
  updateFeedback,
}: {
  track?: Recommendation;
  feedback?: Feedback[string];
  updateFeedback: (id: string, value: NonNullable<Feedback[string]>) => void;
}) {
  if (!track) return null;
  const metricEntries = Object.entries(track.metrics) as Array<
    [keyof Recommendation["metrics"], number]
  >;
  return (
    <aside className="detail-rail">
      <section className="detail-card">
        <div className="detail-identity">
          <TrackGlyph track={track} size="large" />
          <div>
            <span>Selected recommendation</span>
            <h2>{track.title}</h2>
            <p>{track.artist} · {track.album}</p>
          </div>
          <strong>{track.score}<small>/100</small></strong>
        </div>
        <div className="tier-line">
          <span className={track.audienceTier}>{track.audienceTier}</span>
          <span>{track.country}</span>
          <span>{track.year}</span>
        </div>
        <h3>Why it appears</h3>
        <p className="explanation">{track.explanation}</p>
        <div className="metric-stack">
          {metricEntries.map(([metric, value], index) => (
            <div key={metric}>
              <span>{METRIC_LABELS[metric]}</span>
              <MetricBar value={value} tone={index === 4 ? "cyan" : index === 5 ? "lime" : "violet"} />
              <b>{value}</b>
            </div>
          ))}
        </div>
        <div className="tag-list">
          {track.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <FeedbackButtons id={track.id} value={feedback} update={updateFeedback} />
      </section>
      <section className="detail-card review-card">
        <div className="card-title">
          <div><h3>Review trail</h3><p>Open source pages to inspect the album yourself.</p></div>
          <BookOpenText size={19} />
        </div>
        <div className="critic-index">
          <strong>{track.criticIndex}</strong>
          <span>Curated evidence index</span>
          <small>Prototype feature, not a copied site rating.</small>
        </div>
        <div className="review-links">
          <a href={track.reviewLinks.rym} target="_blank" rel="noreferrer">Rate Your Music <ArrowSquareOut size={14} /></a>
          <a href={track.reviewLinks.aoty} target="_blank" rel="noreferrer">Album of the Year <ArrowSquareOut size={14} /></a>
          <a href={track.reviewLinks.pitchfork} target="_blank" rel="noreferrer">Pitchfork <ArrowSquareOut size={14} /></a>
        </div>
      </section>
    </aside>
  );
}

function DiscoverView({
  seedIds,
  setSeedIds,
  settings,
  setSettings,
  results,
  selectedId,
  setSelectedId,
  feedback,
  updateFeedback,
}: {
  seedIds: string[];
  setSeedIds: (ids: string[]) => void;
  settings: RecommendationSettings;
  setSettings: (settings: RecommendationSettings) => void;
  results: Recommendation[];
  selectedId?: string;
  setSelectedId: (id: string) => void;
  feedback: Feedback;
  updateFeedback: (id: string, value: NonNullable<Feedback[string]>) => void;
}) {
  return (
    <>
      <StatStrip />
      <SeedPicker seedIds={seedIds} setSeedIds={setSeedIds} />
      <DiscoveryBrief settings={settings} setSettings={setSettings} />
      {seedIds.length < 3 ? (
        <section className="panel empty-state">
          <MusicNotes size={38} />
          <h2>Add at least three seed tracks</h2>
          <p>The model needs several anchors to distinguish your stable taste from one-off preferences.</p>
        </section>
      ) : (
        <ResultTable
          results={results}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          feedback={feedback}
          updateFeedback={updateFeedback}
        />
      )}
    </>
  );
}

function ArtistRadarView({ results }: { results: Recommendation[] }) {
  const artists = artistRadar(results);
  return (
    <div className="view-stack">
      <section className="intro-panel">
        <div>
          <span className="eyebrow">Artist-level exploration</span>
          <h2>Move from a matching track to a growing catalogue.</h2>
          <p>
            This view deliberately aggregates recommendations by artist, then prioritises fit,
            momentum and long-tail status. It is the offline prototype counterpart to a
            Last.fm-style similar-artist workflow.
          </p>
        </div>
        <Target size={42} weight="duotone" />
      </section>
      <section className="artist-grid">
        {artists.map((artist, index) => (
          <article className="artist-card" key={artist.artist}>
            <div className="artist-rank">0{index + 1}</div>
            <div className="artist-card-head">
              <span className="artist-icon"><MusicNotes size={22} weight="duotone" /></span>
              <span className={`tier ${artist.tier}`}>{artist.tier}</span>
            </div>
            <h3>{artist.artist}</h3>
            <p>{artist.country} · Bridge from {artist.bridgeSeed}</p>
            <div className="artist-tags">{artist.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="artist-scores">
              <div><span>Personal fit</span><strong>{artist.fit}</strong><MetricBar value={artist.fit} /></div>
              <div><span>Momentum</span><strong>{artist.momentum}</strong><MetricBar value={artist.momentum} tone="lime" /></div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function TasteProfileView({ seedIds }: { seedIds: string[] }) {
  const profile = tasteProfile(seedIds);
  const seeds = TRACKS.filter((track) => seedIds.includes(track.id));
  return (
    <div className="view-stack">
      <section className="profile-overview">
        <div className="profile-copy">
          <span className="eyebrow">Model interpretation</span>
          <h2>Your taste is a vector, not a genre label.</h2>
          <p>
            The prototype combines tags, derived audio-style features, era and discovery
            behaviour. The result is descriptive evidence, not a fixed identity.
          </p>
          <div className="blind-spot"><Info size={18} /><span><strong>Controlled blind spot</strong>{profile.blindSpot}</span></div>
        </div>
        <div className="profile-numbers">
          <div><strong>{profile.eraCentre}</strong><span>era centre</span></div>
          <div><strong>{profile.experimental}%</strong><span>experimental</span></div>
          <div><strong>{profile.discoveryReadiness}%</strong><span>discovery readiness</span></div>
        </div>
      </section>
      <section className="profile-grid">
        <article className="panel profile-card">
          <h3>Dominant signals</h3>
          <div className="profile-bars">
            {profile.topTags.map((tag, index) => (
              <div key={tag.name}>
                <span><b>{tag.name}</b><small>{tag.value}%</small></span>
                <MetricBar value={tag.value} tone={index < 2 ? "lime" : "violet"} />
              </div>
            ))}
          </div>
        </article>
        <article className="panel profile-card">
          <h3>Feature centre</h3>
          <div className="feature-centre">
            <div><span>Energy</span><strong>{profile.energy}</strong><MetricBar value={profile.energy} /></div>
            <div><span>Experimental</span><strong>{profile.experimental}</strong><MetricBar value={profile.experimental} tone="cyan" /></div>
            <div><span>Acoustic</span><strong>{profile.acoustic}</strong><MetricBar value={profile.acoustic} tone="lime" /></div>
          </div>
        </article>
      </section>
      <section className="panel seed-table">
        <div className="card-title"><div><h3>Evidence shaping this profile</h3><p>Every summary above is derived from these selected tracks.</p></div><Database size={19} /></div>
        {seeds.map((track) => (
          <div key={track.id}>
            <TrackGlyph track={track} size="small" />
            <strong>{track.title}</strong>
            <span>{track.artist}</span>
            <small>{track.tags.join(" · ")}</small>
          </div>
        ))}
      </section>
    </div>
  );
}

function EvidenceView({ results }: { results: Recommendation[] }) {
  return (
    <div className="view-stack">
      <section className="evidence-banner">
        <BookOpenText size={32} weight="duotone" />
        <div>
          <h2>Evidence is separated from editorial opinion.</h2>
          <p>
            TasteTrace uses a transparent prototype index for ranking and provides outbound
            searches for RYM, AOTY and Pitchfork. No external score is scraped or presented as live.
          </p>
        </div>
      </section>
      <section className="panel evidence-table">
        <div className="evidence-head">
          <span>Recommendation</span><span>Bridge</span><span>Model evidence</span><span>External review trail</span>
        </div>
        {results.map((track) => (
          <div className="evidence-row" key={track.id}>
            <span className="track-cell">
              <TrackGlyph track={track} size="small" />
              <span><strong>{track.title}</strong><small>{track.artist}</small></span>
            </span>
            <span><b>{track.bridgeSeed}</b><small>{track.sharedTags.join(" · ") || "feature-space proximity"}</small></span>
            <span className="evidence-score"><strong>{track.criticIndex}</strong><small>curated index</small></span>
            <span className="mini-links">
              <a href={track.reviewLinks.rym} target="_blank" rel="noreferrer">RYM</a>
              <a href={track.reviewLinks.aoty} target="_blank" rel="noreferrer">AOTY</a>
              <a href={track.reviewLinks.pitchfork} target="_blank" rel="noreferrer">Pitchfork</a>
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

function ModelLabView({
  weights,
  setWeights,
  settings,
  setSettings,
  results,
}: {
  weights: ModelWeights;
  setWeights: (weights: ModelWeights) => void;
  settings: RecommendationSettings;
  setSettings: (settings: RecommendationSettings) => void;
  results: Recommendation[];
}) {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  const top = results[0];
  function updateWeight(key: keyof ModelWeights, value: number) {
    const next = { ...weights, [key]: value / 100 };
    const nextTotal = Object.values(next).reduce((sum, item) => sum + item, 0);
    setWeights(
      Object.fromEntries(
        Object.entries(next).map(([name, item]) => [name, item / nextTotal]),
      ) as unknown as ModelWeights,
    );
  }
  return (
    <div className="lab-layout">
      <section className="panel lab-controls">
        <div className="card-title">
          <div><h2>Ranking weights</h2><p>Adjust one signal; weights are automatically renormalised.</p></div>
          <SlidersHorizontal size={21} />
        </div>
        <div className="weight-controls">
          {(Object.entries(weights) as Array<[keyof ModelWeights, number]>).map(([key, value]) => (
            <label key={key}>
              <span><b>{METRIC_LABELS[key]}</b><em>{Math.round(value * 100)}%</em></span>
              <input type="range" min="1" max="55" value={Math.round(value * 100)} onChange={(event) => updateWeight(key, Number(event.target.value))} />
            </label>
          ))}
        </div>
        <div className="lab-toggles">
          <Toggle
            checked={settings.emergingFirst}
            onChange={() => setSettings({ ...settings, emergingFirst: !settings.emergingFirst })}
            label="Emerging-first boost"
          />
          <RangeControl
            label="Diversity reranking"
            value={settings.diversity}
            hint="Uses maximal marginal relevance plus hard artist and album penalties."
            left="Low"
            right="High"
            onChange={(value) => setSettings({ ...settings, diversity: value })}
          />
        </div>
        <button className="reset-button" onClick={() => setWeights(DEFAULT_WEIGHTS)}>
          <ArrowClockwise size={17} /> Reset model weights
        </button>
        <small className="weight-total">Normalised total: {Math.round(total * 100)}%</small>
      </section>
      <section className="panel lab-result">
        <span className="eyebrow">Current top result</span>
        {top ? (
          <>
            <TrackGlyph track={top} size="large" />
            <h2>{top.title}</h2>
            <p>{top.artist} · {top.audienceTier}</p>
            <strong>{top.score}<small>/100 fit index</small></strong>
            <div className="lab-metrics">
              {(Object.entries(top.metrics) as Array<[keyof Recommendation["metrics"], number]>).map(([key, value]) => (
                <div key={key}><span>{METRIC_LABELS[key]}</span><MetricBar value={value} /><b>{value}</b></div>
              ))}
            </div>
          </>
        ) : <p>Add at least three seeds to run the model.</p>}
      </section>
      <section className="panel method-card">
        <div className="card-title"><div><h2>Pipeline</h2><p>What happens after the user changes an input.</p></div><Brain size={21} /></div>
        {[
          ["1", "Taste vector", "Average seed features and tag distributions."],
          ["2", "Candidate scoring", "Combine sonic, scene, preference, evidence and discovery signals."],
          ["3", "Diversity reranking", "Apply MMR redundancy penalties and artist/album constraints."],
          ["4", "Evidence output", "Expose component scores, bridge seed and review links."],
        ].map(([number, title, text]) => (
          <div className="pipeline-step" key={number}>
            <span>{number}</span><div><strong>{title}</strong><small>{text}</small></div><Check size={17} />
          </div>
        ))}
      </section>
    </div>
  );
}

export function App() {
  const [view, setView] = useState<View>("discover");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [seedIds, setSeedIds] = useState(DEFAULT_SEEDS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [feedback, updateFeedback] = useStoredFeedback();
  const results = useMemo(
    () => seedIds.length >= 3 ? recommend({ seedIds, settings, weights, feedback }) : [],
    [seedIds, settings, weights, feedback],
  );
  const [selectedId, setSelectedId] = useState<string>();
  const selected = results.find((track) => track.id === selectedId) ?? results[0];

  useEffect(() => {
    if (results.length && !results.some((track) => track.id === selectedId)) {
      setSelectedId(results[0].id);
    }
  }, [results, selectedId]);

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        setView={setView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main className="main">
        <PageHeader view={view} setMobileOpen={setMobileOpen} />
        <div className="page-content">
          {view === "discover" && (
            <DiscoverView
              seedIds={seedIds}
              setSeedIds={setSeedIds}
              settings={settings}
              setSettings={setSettings}
              results={results}
              selectedId={selected?.id}
              setSelectedId={setSelectedId}
              feedback={feedback}
              updateFeedback={updateFeedback}
            />
          )}
          {view === "artists" && <ArtistRadarView results={results} />}
          {view === "profile" && <TasteProfileView seedIds={seedIds} />}
          {view === "evidence" && <EvidenceView results={results} />}
          {view === "lab" && (
            <ModelLabView
              weights={weights}
              setWeights={setWeights}
              settings={settings}
              setSettings={setSettings}
              results={results}
            />
          )}
        </div>
      </main>
      {view === "discover" && (
        <DetailRail
          track={selected}
          feedback={feedback[selected?.id ?? ""]}
          updateFeedback={updateFeedback}
        />
      )}
    </div>
  );
}
