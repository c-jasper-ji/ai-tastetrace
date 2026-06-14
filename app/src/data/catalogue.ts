import type { AudienceTier, Track } from "../types";

type RawTrack = [
  id: string,
  title: string,
  artist: string,
  album: string,
  year: number,
  country: string,
  tags: string,
  tier: AudienceTier,
  criticIndex: number,
  momentum: number,
  popularity: number,
];

const RAW_TRACKS: RawTrack[] = [
  ["radiohead-everything", "Everything in Its Right Place", "Radiohead", "Kid A", 2000, "UK", "art rock,electronic,atmospheric,melancholic", "mainstream", 97, 54, 94],
  ["radiohead-reckoner", "Reckoner", "Radiohead", "In Rainbows", 2007, "UK", "art rock,atmospheric,soulful,organic", "mainstream", 98, 56, 92],
  ["massive-teardrop", "Teardrop", "Massive Attack", "Mezzanine", 1998, "UK", "trip hop,electronic,dark,atmospheric", "mainstream", 96, 46, 91],
  ["james-retrograde", "Retrograde", "James Blake", "Overgrown", 2013, "UK", "electronic,art pop,soulful,melancholic", "crossover", 90, 59, 79],
  ["burial-archangel", "Archangel", "Burial", "Untrue", 2007, "UK", "future garage,electronic,dark,atmospheric", "crossover", 96, 58, 66],
  ["portishead-roads", "Roads", "Portishead", "Dummy", 1994, "UK", "trip hop,melancholic,dark,downtempo", "crossover", 96, 43, 72],
  ["fka-cellophane", "Cellophane", "FKA twigs", "MAGDALENE", 2019, "UK", "art pop,experimental,intimate,melancholic", "crossover", 94, 68, 67],
  ["bjork-joga", "Joga", "Björk", "Homogenic", 1997, "Iceland", "art pop,electronic,orchestral,dramatic", "mainstream", 97, 49, 83],
  ["arca-reverie", "Reverie", "Arca", "Arca", 2017, "Venezuela", "experimental,electronic,art pop,volatile", "niche", 89, 72, 40],
  ["tirzah-devotion", "Devotion", "Tirzah", "Devotion", 2018, "UK", "alternative r&b,minimal,intimate,electronic", "niche", 88, 69, 35],
  ["kelela-rewind", "Rewind", "Kelela", "Hallucinogen", 2015, "USA", "alternative r&b,electronic,club,sensual", "niche", 88, 66, 42],
  ["yves-gospel", "Gospel for a New Century", "Yves Tumor", "Heaven to a Tortured Mind", 2020, "USA", "art rock,psychedelic,soulful,experimental", "crossover", 92, 79, 58],
  ["perfume-queen", "Queen", "Perfume Genius", "Too Bright", 2014, "USA", "art pop,indie,dramatic,glam", "niche", 90, 62, 44],
  ["dean-100", "100", "Dean Blunt", "Black Metal", 2014, "UK", "hypnagogic pop,lo-fi,experimental,intimate", "niche", 87, 65, 31],
  ["king-biscuit", "Biscuit Town", "King Krule", "The Ooz", 2017, "UK", "indie rock,jazz,post punk,bleak", "crossover", 89, 70, 55],
  ["opn-lost", "Lost But Never Alone", "Oneohtrix Point Never", "Magic Oneohtrix Point Never", 2020, "USA", "experimental,electronic,ambient,nostalgic", "niche", 88, 72, 34],
  ["floating-silhouettes", "Silhouettes (I, II & III)", "Floating Points", "Elaenia", 2015, "UK", "electronic,jazz,progressive,atmospheric", "niche", 91, 64, 38],
  ["four-two", "Two Thousand and Seventeen", "Four Tet", "New Energy", 2017, "UK", "folktronica,electronic,organic,meditative", "crossover", 88, 63, 57],
  ["jon-open-eye", "Open Eye Signal", "Jon Hopkins", "Immunity", 2013, "UK", "techno,electronic,progressive,hypnotic", "crossover", 91, 64, 61],
  ["kelly-melt", "Melt!", "Kelly Lee Owens", "Inner Song", 2020, "Wales", "techno,dream pop,electronic,ethereal", "niche", 88, 76, 39],
  ["laurel-jelly", "Jelly", "Laurel Halo", "Dust", 2017, "USA", "experimental,electronic,abstract,art pop", "niche", 86, 68, 24],
  ["autechre-bike", "Bike", "Autechre", "Incunabula", 1993, "UK", "idm,electronic,abstract,mechanical", "niche", 90, 42, 38],
  ["boards-roygbiv", "Roygbiv", "Boards of Canada", "Music Has the Right to Children", 1998, "Scotland", "idm,ambient,nostalgic,electronic", "crossover", 96, 47, 66],
  ["aphex-alberto", "Alberto Balsalm", "Aphex Twin", "...I Care Because You Do", 1995, "UK", "idm,electronic,melancholic,playful", "crossover", 95, 50, 73],
  ["dj-midnight", "Midnight in a Perfect World", "DJ Shadow", "Endtroducing.....", 1996, "USA", "instrumental hip hop,trip hop,cinematic,downtempo", "crossover", 96, 45, 69],
  ["nujabes-aruarian", "Aruarian Dance", "Nujabes", "Metaphorical Music", 2003, "Japan", "jazz rap,instrumental hip hop,calm,organic", "crossover", 91, 63, 70],
  ["jdilla-time", "Time: The Donut of the Heart", "J Dilla", "Donuts", 2006, "USA", "instrumental hip hop,soulful,lo-fi,warm", "crossover", 96, 58, 67],
  ["simz-introvert", "Introvert", "Little Simz", "Sometimes I Might Be Introvert", 2021, "UK", "hip hop,orchestral,dramatic,conscious", "crossover", 95, 83, 70],
  ["sault-wildfires", "Wildfires", "SAULT", "Untitled (Black Is)", 2020, "UK", "neo soul,conscious,r&b,warm", "niche", 95, 80, 49],
  ["cleo-why", "Why Don't You", "Cleo Sol", "Rose in the Dark", 2020, "UK", "neo soul,intimate,warm,r&b", "crossover", 90, 84, 59],
  ["yaeji-passion", "Passionfruit", "Yaeji", "EP2", 2017, "USA", "house,indie pop,club,minimal", "niche", 85, 75, 43],
  ["jessie-spotlight", "Spotlight", "Jessie Ware", "What's Your Pleasure?", 2020, "UK", "disco,dance pop,sensual,polished", "mainstream", 94, 78, 76],
  ["roisin-murphys", "Murphy's Law", "Róisín Murphy", "Róisín Machine", 2020, "Ireland", "disco,art pop,club,playful", "crossover", 93, 74, 54],
  ["caroline-billions", "Billions", "Caroline Polachek", "Desire, I Want to Turn Into You", 2023, "USA", "art pop,electronic,ecstatic,experimental", "mainstream", 94, 88, 78],
  ["weyes-movies", "Movies", "Weyes Blood", "Titanic Rising", 2019, "USA", "baroque pop,cinematic,melancholic,orchestral", "crossover", 96, 74, 61],
  ["julia-sea", "Sea Calls Me Home", "Julia Holter", "Have You in My Wilderness", 2015, "USA", "art pop,chamber pop,ethereal,experimental", "niche", 94, 66, 31],
  ["aldous-horizon", "Horizon", "Aldous Harding", "Party", 2017, "New Zealand", "indie folk,art pop,intimate,unsettling", "niche", 90, 65, 33],
  ["ichiko-asleep", "Asleep Among Endives", "Ichiko Aoba", "Windswept Adan", 2020, "Japan", "ambient folk,acoustic,ethereal,meditative", "niche", 94, 85, 45],
  ["adrianne-anything", "anything", "Adrianne Lenker", "songs", 2020, "USA", "indie folk,acoustic,intimate,warm", "crossover", 94, 82, 62],
  ["bigthief-not", "Not", "Big Thief", "Two Hands", 2019, "USA", "indie rock,raw,intimate,folk rock", "crossover", 95, 77, 66],
  ["grouper-heavy", "Heavy Water / I'd Rather Be Sleeping", "Grouper", "Dragging a Dead Deer Up a Hill", 2008, "USA", "ambient,dream pop,lo-fi,melancholic", "niche", 94, 58, 39],
  ["beach-myth", "Myth", "Beach House", "Bloom", 2012, "USA", "dream pop,atmospheric,melancholic,indie", "mainstream", 93, 67, 82],
  ["cocteau-heaven", "Heaven or Las Vegas", "Cocteau Twins", "Heaven or Las Vegas", 1990, "Scotland", "dream pop,ethereal,shoegaze,ecstatic", "crossover", 98, 48, 77],
  ["slowdive-sugar", "Sugar for the Pill", "Slowdive", "Slowdive", 2017, "UK", "shoegaze,dream pop,melancholic,atmospheric", "crossover", 90, 73, 69],
  ["alvvays-dreams", "Dreams Tonite", "Alvvays", "Antisocialites", 2017, "Canada", "indie pop,dream pop,melancholic,jangle pop", "crossover", 91, 75, 67],
  ["jbrekkie-be", "Be Sweet", "Japanese Breakfast", "Jubilee", 2021, "USA", "indie pop,synthpop,bright,dance", "crossover", 91, 82, 70],
  ["bcnr-sunglasses", "Sunglasses", "Black Country, New Road", "For the first time", 2021, "UK", "post rock,art rock,dramatic,post punk", "crossover", 94, 85, 59],
  ["squid-narrator", "Narrator", "Squid", "Bright Green Field", 2021, "UK", "post punk,art rock,restless,experimental", "niche", 89, 81, 39],
  ["dry-strong", "Strong Feelings", "Dry Cleaning", "New Long Leg", 2021, "UK", "post punk,spoken word,indie rock,dry", "niche", 90, 77, 37],
  ["fontaines-i-love", "I Love You", "Fontaines D.C.", "Skinty Fia", 2022, "Ireland", "post punk,indie rock,dramatic,dark", "mainstream", 92, 90, 78],
  ["protomartyr-processed", "Processed by the Boys", "Protomartyr", "Ultimate Success Today", 2020, "USA", "post punk,art rock,bleak,political", "niche", 87, 69, 28],
  ["idles-colossus", "Colossus", "IDLES", "Joy as an Act of Resistance", 2018, "UK", "post punk,punk,aggressive,dramatic", "crossover", 88, 72, 62],
  ["mdou-chismiten", "Chismiten", "Mdou Moctar", "Afrique Victime", 2021, "Niger", "desert rock,psychedelic,guitar,energetic", "niche", 94, 87, 41],
  ["tinariwen-sastana", "Sastanàqqàm", "Tinariwen", "Elwan", 2017, "Mali", "desert blues,folk rock,hypnotic,organic", "niche", 89, 70, 34],
  ["altin-goca", "Goca Dünya", "Altın Gün", "On", 2018, "Netherlands", "anatolian rock,psychedelic,dance,folk", "niche", 88, 80, 46],
  ["lrain-two", "Two Face", "L'Rain", "Fatigue", 2021, "USA", "experimental,soul,collage,art pop", "emerging", 90, 88, 22],
  ["moses-cut", "Cut Me", "Moses Sumney", "græ", 2020, "USA", "art soul,experimental,intimate,dramatic", "niche", 92, 77, 44],
  ["sampha-plastic", "Plastic 100°C", "Sampha", "Process", 2017, "UK", "art soul,electronic,intimate,melancholic", "crossover", 94, 81, 64],
  ["mustafa-air", "Air Forces", "Mustafa", "When Smoke Rises", 2021, "Canada", "folk soul,intimate,acoustic,melancholic", "niche", 91, 87, 39],
  ["serpent-bless", "Bless Ur Heart", "serpentwithfeet", "soil", 2018, "USA", "art r&b,experimental,spiritual,intimate", "niche", 87, 66, 24],
  ["nilufer-midnight", "midnight sun", "Nilüfer Yanya", "PAINLESS", 2022, "UK", "indie rock,alternative,moody,guitar", "niche", 91, 88, 47],
  ["sudan-confessions", "Confessions", "Sudan Archives", "Athena", 2019, "USA", "art r&b,violin,experimental,rhythmic", "niche", 89, 78, 34],
  ["kokoroko-abusey", "Abusey Junction", "KOKOROKO", "We Out Here", 2018, "UK", "afrobeat,jazz,warm,meditative", "niche", 89, 84, 49],
  ["nubya-source", "The Source", "Nubya Garcia", "SOURCE", 2020, "UK", "jazz,dub,spiritual,groove", "niche", 91, 82, 37],
  ["sons-field", "My Queen Is Harriet Tubman", "Sons of Kemet", "Your Queen Is a Reptile", 2018, "UK", "jazz,afrobeat,political,energetic", "niche", 94, 75, 40],
  ["makaya-seventh", "Seventh String", "Makaya McCraven", "Universal Beings", 2018, "USA", "jazz,hip hop,improvised,groove", "niche", 90, 74, 32],
  ["arooz-mohabbat", "Mohabbat", "Arooj Aftab", "Vulture Prince", 2021, "Pakistan", "ambient folk,ghazal,meditative,melancholic", "niche", 96, 91, 46],
  ["hania-glass", "Glass", "Hania Rani", "Esja", 2019, "Poland", "modern classical,piano,minimal,meditative", "niche", 86, 83, 40],
  ["nala-space", "Space 1.8", "Nala Sinephro", "Space 1.8", 2021, "Belgium", "ambient jazz,spiritual,harp,meditative", "emerging", 95, 94, 29],
  ["julianna-nebula", "Nebula", "Julianna Barwick", "Nepenthe", 2013, "USA", "ambient,choral,ethereal,meditative", "niche", 88, 60, 30],
  ["tim-virginal", "Virginal II", "Tim Hecker", "Virgins", 2013, "Canada", "ambient,drone,experimental,dense", "niche", 94, 62, 35],
  ["stars-requiem", "Requiem for Dying Mothers, Pt. 2", "Stars of the Lid", "The Tired Sounds of Stars of the Lid", 2001, "USA", "ambient,drone,modern classical,slow", "niche", 94, 43, 27],
  ["low-days", "Days Like These", "Low", "HEY WHAT", 2021, "USA", "experimental rock,slowcore,noise,dramatic", "niche", 93, 80, 34],
  ["lingua-pennsylvania", "Pennsylvania Furnace", "Lingua Ignota", "SINNER GET READY", 2021, "USA", "experimental,neoclassical,harrowing,dramatic", "niche", 95, 82, 25],
  ["ethel-american", "American Teenager", "Ethel Cain", "Preacher's Daughter", 2022, "USA", "heartland rock,dream pop,dramatic,nostalgic", "crossover", 93, 95, 68],
  ["wednesday-chosen", "Chosen to Deserve", "Wednesday", "Rat Saw God", 2023, "USA", "indie rock,alt country,noise rock,raw", "niche", 94, 93, 48],
  ["feeble-sweet", "Sweet", "feeble little horse", "Girl with Fish", 2023, "USA", "noise pop,shoegaze,indie rock,playful", "emerging", 89, 96, 30],
  ["hotline-protocol", "Protocol", "Hotline TNT", "Cartwheel", 2023, "USA", "shoegaze,noise pop,guitar,melancholic", "emerging", 88, 92, 28],
  ["yeule-dazies", "dazies", "yeule", "softscars", 2023, "Singapore", "glitch pop,shoegaze,electronic,emotional", "emerging", 90, 94, 45],
  ["magdalena-image", "Image", "Magdalena Bay", "Imaginal Disk", 2024, "USA", "synthpop,art pop,psychedelic,ecstatic", "crossover", 95, 98, 70],
  ["erika-drama", "Drama", "Erika de Casier", "Essentials", 2019, "Denmark", "r&b,uk garage,minimal,intimate", "niche", 86, 82, 34],
  ["mlbuch-imperial", "I'm a Girl You Can Hold IRL", "ML Buch", "Suntub", 2023, "Denmark", "art pop,ambient pop,guitar,experimental", "emerging", 94, 97, 27],
  ["water-barley", "Barley", "Water From Your Eyes", "Everyone's Crushed", 2023, "USA", "indie rock,electronic,post punk,playful", "emerging", 91, 93, 31],
];

const TAG_FEATURES: Record<string, Partial<Track["features"]>> = {
  energetic: { energy: 0.88 },
  aggressive: { energy: 0.92, warmth: 0.28 },
  calm: { energy: 0.28, warmth: 0.68 },
  meditative: { energy: 0.24, acoustic: 0.64, warmth: 0.72 },
  acoustic: { acoustic: 0.88, warmth: 0.72 },
  ambient: { energy: 0.28, acoustic: 0.48, experimental: 0.62 },
  electronic: { acoustic: 0.12, dance: 0.61, experimental: 0.58 },
  club: { energy: 0.79, dance: 0.88, acoustic: 0.08 },
  dance: { energy: 0.76, dance: 0.84 },
  disco: { energy: 0.79, dance: 0.91, warmth: 0.70 },
  experimental: { experimental: 0.94, dance: 0.38 },
  "art pop": { experimental: 0.72, warmth: 0.54 },
  "post punk": { energy: 0.70, acoustic: 0.32, warmth: 0.34 },
  shoegaze: { energy: 0.64, acoustic: 0.30, warmth: 0.48 },
  "dream pop": { energy: 0.44, dance: 0.43, warmth: 0.68 },
  jazz: { acoustic: 0.66, warmth: 0.75, experimental: 0.60 },
  soulful: { warmth: 0.84 },
  intimate: { energy: 0.34, warmth: 0.82 },
  melancholic: { energy: 0.37, warmth: 0.43 },
  dark: { warmth: 0.24, experimental: 0.64 },
  playful: { energy: 0.68, dance: 0.69, warmth: 0.73 },
};

function hash(value: string) {
  return [...value].reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 2166136261);
}

function derivedFeatures(id: string, tags: string[]): Track["features"] {
  const seed = hash(id);
  const base = {
    energy: 0.35 + ((seed >> 1) % 42) / 100,
    dance: 0.30 + ((seed >> 4) % 45) / 100,
    acoustic: 0.18 + ((seed >> 7) % 52) / 100,
    warmth: 0.30 + ((seed >> 10) % 50) / 100,
    experimental: 0.25 + ((seed >> 13) % 55) / 100,
  };
  const totals = { ...base };
  const counts = { energy: 1, dance: 1, acoustic: 1, warmth: 1, experimental: 1 };
  tags.forEach((tag) => {
    const profile = TAG_FEATURES[tag];
    if (!profile) return;
    Object.entries(profile).forEach(([key, value]) => {
      const feature = key as keyof Track["features"];
      totals[feature] += value!;
      counts[feature] += 1;
    });
  });
  return {
    energy: totals.energy / counts.energy,
    dance: totals.dance / counts.dance,
    acoustic: totals.acoustic / counts.acoustic,
    warmth: totals.warmth / counts.warmth,
    experimental: totals.experimental / counts.experimental,
  };
}

export const TRACKS: Track[] = RAW_TRACKS.map((raw) => {
  const [id, title, artist, album, year, country, tagString, audienceTier, criticIndex, momentum, popularity] = raw;
  const tags = tagString.split(",");
  return {
    id,
    title,
    artist,
    album,
    year,
    country,
    tags,
    audienceTier,
    criticIndex,
    momentum,
    popularity,
    features: derivedFeatures(id, tags),
  };
});

export const DEFAULT_SEEDS = ["radiohead-everything", "massive-teardrop", "james-retrograde"];

export const CATALOGUE_STATS = {
  tracks: TRACKS.length,
  artists: new Set(TRACKS.map((track) => track.artist)).size,
  countries: new Set(TRACKS.map((track) => track.country)).size,
  nicheShare: Math.round(
    (TRACKS.filter((track) => ["niche", "emerging"].includes(track.audienceTier)).length / TRACKS.length) * 100,
  ),
};
