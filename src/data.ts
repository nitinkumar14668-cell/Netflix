export const STREAMS = {
  Sintel: {
    "2160p": { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", size: "450 MB" },
    "1080p": { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", size: "120 MB" },
    "720p": { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", size: "48 MB" },
    "480p": { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", size: "15 MB" }
  },
  TearsOfSteel: {
    "2160p": { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", size: "510 MB" },
    "1080p": { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", size: "135 MB" },
    "720p": { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", size: "52 MB" },
    "480p": { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", size: "12 MB" }
  },
  BigBuckBunny: {
    "2160p": { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", size: "390 MB" },
    "1080p": { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", size: "110 MB" },
    "720p": { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", size: "62 MB" },
    "480p": { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", size: "14 MB" }
  }
};

export const POSTERS = {
  SciFi: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  Action: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80",
  Drama: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80",
  Thriller: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80",
  Comedy: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
  Fantasy: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
};

export const CURATED_CATALOG = [
  {
    id: "stellar-voyage",
    title: "The Stellar Voyage: Infinite Horizon",
    year: "2025",
    rating: "8.9",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    duration: "2h 45m",
    synopsis: "An astronaut embarks on an emotional cosmic mission to find a habitable exoplanet, facing gravitational anomalies and internal isolation.",
    synopsisHindi: "एक अंतरिक्ष यात्री रहने योग्य एक्सोप्लैनेट खोजने के लिए एक भावनात्मक ब्रह्मांडीय मिशन पर निकलता है, जिसमें गुरुत्वाकर्षण संबंधी असामान्यताओं और आंतरिक अलगाव का सामना करना पड़ता है।",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    tagline: "The end of Earth is not the end of us.",
    videoUrl: STREAMS.TearsOfSteel["1080p"].url,
    posterUrl: POSTERS.SciFi,
    qualityOptions: [
      { resolution: "2160p (4K Ultra HD)", fileUrl: STREAMS.TearsOfSteel["2160p"].url, size: STREAMS.TearsOfSteel["2160p"].size },
      { resolution: "1080p (Full HD)", fileUrl: STREAMS.TearsOfSteel["1080p"].url, size: STREAMS.TearsOfSteel["1080p"].size },
      { resolution: "720p (HD)", fileUrl: STREAMS.TearsOfSteel["720p"].url, size: STREAMS.TearsOfSteel["720p"].size },
      { resolution: "480p (SD)", fileUrl: STREAMS.TearsOfSteel["480p"].url, size: STREAMS.TearsOfSteel["480p"].size }
    ]
  },
  {
    id: "cyberpunk-neutral",
    title: "Neon Echoes: Tears of Steel",
    year: "2024",
    rating: "8.1",
    genre: ["Sci-Fi", "Action", "Thriller"],
    duration: "1h 52m",
    synopsis: "In a fully automated dystopian futurescape, a team of young hackers inadvertently activates a vintage warfare artificial intelligence.",
    synopsisHindi: "पूरी तरह से स्वचालित डायस्टोपियन भविष्य के परिदृश्य में, युवा हैकर्स की एक टीम अनजाने में एक विंटेज युद्ध कृत्रिम बुद्धिमत्ता को सक्रिय कर देती है।",
    director: "Lana Wachowski",
    cast: ["Keanu Reeves", "Carrie-Anne Moss", "Laurence Fishburne"],
    tagline: "Technology remembers. Artificial minds never forget.",
    videoUrl: STREAMS.Sintel["1080p"].url,
    posterUrl: POSTERS.Action,
    qualityOptions: [
      { resolution: "2160p (4K Ultra HD)", fileUrl: STREAMS.Sintel["2160p"].url, size: STREAMS.Sintel["2160p"].size },
      { resolution: "1080p (Full HD)", fileUrl: STREAMS.Sintel["1080p"].url, size: STREAMS.Sintel["1080p"].size },
      { resolution: "720p (HD)", fileUrl: STREAMS.Sintel["720p"].url, size: STREAMS.Sintel["720p"].size },
      { resolution: "480p (SD)", fileUrl: STREAMS.Sintel["480p"].url, size: STREAMS.Sintel["480p"].size }
    ]
  },
  {
    id: "valley-quest",
    title: "Sintel: Destiny of the Valley",
    year: "2023",
    rating: "8.5",
    genre: ["Fantasy", "Drama", "Animation"],
    duration: "1h 38m",
    synopsis: "A lonely female warrior forms an affectionate bond with a baby dragon. When it is abducted, she travels the globe in an epic path of redemption.",
    synopsisHindi: "एक अकेली महिला योद्धा एक छोटे अजगर के बच्चे के साथ एक स्नेही बंधन बनाती है। जब उसका अपहरण कर लिया जाता है, तो वह मुक्ति के महाकाव्य मार्ग पर दुनिया भर की यात्रा करती है।",
    director: "Colin Levy",
    cast: ["Halina Reijn", "Thom Hoffman", "Billie Eilish (Theme)"],
    tagline: "An unbreakable bond across the end of times.",
    videoUrl: STREAMS.Sintel["1080p"].url,
    posterUrl: POSTERS.Fantasy,
    qualityOptions: [
      { resolution: "2160p (4K Ultra HD)", fileUrl: STREAMS.Sintel["2160p"].url, size: STREAMS.Sintel["2160p"].size },
      { resolution: "1080p (Full HD)", fileUrl: STREAMS.Sintel["1080p"].url, size: STREAMS.Sintel["1080p"].size },
      { resolution: "720p (HD)", fileUrl: STREAMS.Sintel["720p"].url, size: STREAMS.Sintel["720p"].size },
      { resolution: "480p (SD)", fileUrl: STREAMS.Sintel["480p"].url, size: STREAMS.Sintel["480p"].size }
    ]
  },
  {
    id: "bunny-forest",
    title: "The Great Forest: Big Buck's Revenge",
    year: "2022",
    rating: "7.8",
    genre: ["Comedy", "Animation", "Family"],
    duration: "1h 15m",
    synopsis: "When three annoying woodland rodents torment a giant, good-natured rabbit, he devises a comical, complex plan of absolute retribution.",
    synopsisHindi: "जब तीन कष्टप्रद जंगली कृंतक एक विशाल, अच्छे स्वभाव वाले खरगोश को परेशान करते हैं, तो वह पूर्ण प्रतिशोध की एक हास्यास्पद, जटिल योजना तैयार करता है।",
    director: "Sacha Goedegebure",
    cast: ["John Cleese", "Steve Carell", "Jack Black"],
    tagline: "Big rabbit. Bigger traps.",
    videoUrl: STREAMS.BigBuckBunny["1080p"].url,
    posterUrl: POSTERS.Comedy,
    qualityOptions: [
      { resolution: "2160p (4K Ultra HD)", fileUrl: STREAMS.BigBuckBunny["2160p"].url, size: STREAMS.BigBuckBunny["2160p"].size },
      { resolution: "1080p (Full HD)", fileUrl: STREAMS.BigBuckBunny["1080p"].url, size: STREAMS.BigBuckBunny["1080p"].size },
      { resolution: "720p (HD)", fileUrl: STREAMS.BigBuckBunny["720p"].url, size: STREAMS.BigBuckBunny["720p"].size },
      { resolution: "480p (SD)", fileUrl: STREAMS.BigBuckBunny["480p"].url, size: STREAMS.BigBuckBunny["480p"].size }
    ]
  },
  {
    id: "elephants-dream",
    title: "The Machina: Elephant's Dream",
    year: "2024",
    rating: "8.3",
    genre: ["Mystery", "Thriller", "Drama"],
    duration: "2h 05m",
    synopsis: "Two men explore an infinite, logic-defying mechanic city governed by an unseen master designer that knows their deepest fears.",
    synopsisHindi: "दो व्यक्ति एक अनदेखे मास्टर डिजाइनर द्वारा शासित एक अनंत, तर्क-विहीन यांत्रिक शहर का पता लगाते हैं जो उनके सबसे गहरे डर को जानता है।",
    director: "Bassam Kurdali",
    cast: ["Tygo Gernandt", "Cas Jansen"],
    tagline: "Who dreams the machine?",
    videoUrl: STREAMS.BigBuckBunny["1080p"].url,
    posterUrl: POSTERS.Thriller,
    qualityOptions: [
      { resolution: "2160p (4K Ultra HD)", fileUrl: STREAMS.BigBuckBunny["2160p"].url, size: STREAMS.BigBuckBunny["2160p"].size },
      { resolution: "1080p (Full HD)", fileUrl: STREAMS.BigBuckBunny["1080p"].url, size: STREAMS.BigBuckBunny["1080p"].size },
      { resolution: "720p (HD)", fileUrl: STREAMS.BigBuckBunny["720p"].url, size: STREAMS.BigBuckBunny["720p"].size },
      { resolution: "480p (SD)", fileUrl: STREAMS.BigBuckBunny["480p"].url, size: STREAMS.BigBuckBunny["480p"].size }
    ]
  },
  {
    id: "gadar-blockbuster",
    title: "Gadar 2: The Katha Continues",
    year: "2023",
    rating: "8.0",
    genre: ["Action", "Drama", "Thriller"],
    duration: "2h 50m",
    synopsis: "During the Indo-Pakistani War of 1971, Tara Singh courageously returns to Pakistan to rescue his beloved son, Charanjeet, from capturing armies.",
    synopsisHindi: "1971 के भारत-पाकिस्तान युद्ध के दौरान, तारा सिंह अपने प्रिय पुत्र चरनजीत को बंदी बनाने वाली सेनाओं से बचाने के लिए साहसपूर्वक पाकिस्तान लौटते हैं।",
    director: "Anil Sharma",
    cast: ["Sunny Deol", "Ameesha Patel", "Utkarsh Sharma"],
    tagline: "The return of Hindustan's pride.",
    videoUrl: STREAMS.TearsOfSteel["1080p"].url,
    posterUrl: POSTERS.Action,
    qualityOptions: [
      { resolution: "2160p (4K Ultra HD)", fileUrl: STREAMS.TearsOfSteel["2160p"].url, size: STREAMS.TearsOfSteel["2160p"].size },
      { resolution: "1080p (Full HD)", fileUrl: STREAMS.TearsOfSteel["1080p"].url, size: STREAMS.TearsOfSteel["1080p"].size },
      { resolution: "720p (HD)", fileUrl: STREAMS.TearsOfSteel["720p"].url, size: STREAMS.TearsOfSteel["720p"].size },
      { resolution: "480p (SD)", fileUrl: STREAMS.TearsOfSteel["480p"].url, size: STREAMS.TearsOfSteel["480p"].size }
    ]
  }
];

export function getPosterForGenre(genres: string[]): string {
  const primary = (genres[0] || "Generic").toLowerCase();
  if (primary.includes("sci") || primary.includes("space")) return POSTERS.SciFi;
  if (primary.includes("action") || primary.includes("fight")) return POSTERS.Action;
  if (primary.includes("drama") || primary.includes("romance")) return POSTERS.Drama;
  if (primary.includes("thrill") || primary.includes("myst") || primary.includes("sus")) return POSTERS.Thriller;
  if (primary.includes("comedy") || primary.includes("fun")) return POSTERS.Comedy;
  if (primary.includes("fant") || primary.includes("anim")) return POSTERS.Fantasy;
  return POSTERS.Drama;
}
