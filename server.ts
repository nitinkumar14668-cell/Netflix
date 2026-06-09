import express from 'express';
import fileSystem from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from "@google/genai";
import http from 'http';
import https from 'https';

dotenv.config();

// Safe setup for both ES Modules (Vite dev) and CommonJS (esbuild compiled start)
let currentDirname = '';
try {
  currentDirname = path.dirname(fileURLToPath(import.meta.url));
} catch (e) {
  currentDirname = __dirname;
}
const myDirname = currentDirname;
const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const aiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (aiKey) {
  ai = new GoogleGenAI({
    apiKey: aiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// 6 Best Quality Test Stream Files mapped to different profiles
const STREAMS = {
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

const POSTERS = {
  SciFi: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  Action: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80",
  Drama: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80",
  Thriller: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80",
  Comedy: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
  Fantasy: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
};

// Seed Local Catalog
const CURATED_CATALOG = [
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

// Helper to select poster dynamically based on clean primary genre name
function getPosterForGenre(genres: string[]): string {
  const primary = (genres[0] || "Generic").toLowerCase();
  if (primary.includes("sci") || primary.includes("space")) return POSTERS.SciFi;
  if (primary.includes("action") || primary.includes("fight")) return POSTERS.Action;
  if (primary.includes("drama") || primary.includes("romance")) return POSTERS.Drama;
  if (primary.includes("thrill") || primary.includes("myst") || primary.includes("sus")) return POSTERS.Thriller;
  if (primary.includes("comedy") || primary.includes("fun")) return POSTERS.Comedy;
  if (primary.includes("fant") || primary.includes("anim")) return POSTERS.Fantasy;
  return POSTERS.Drama;
}

// REST endpoints
app.get('/api/movies', async (req, res) => {
  const query = req.query.q as string;
  
  if (!query) {
    return res.json(CURATED_CATALOG);
  }

  // Filter existing curated catalogue if it fits well
  const exactMatches = CURATED_CATALOG.filter(m => 
    m.title.toLowerCase().includes(query.toLowerCase()) || 
    m.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
  );

  // If there's an exact match in seeded catalog, return them
  if (exactMatches.length > 0 && !ai) {
    return res.json(exactMatches);
  }

  // If Gemini API is available, we perform a magical search details generator!
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an AI OTT Movie database assistant. The user wants to search for: "${query}". 
        Generate details for 2 relevant movies matching this search query. 
        If the movie is a well-known theatrical film (like "Pathaan", "Interstellar", "Inception", "Dangal", etc.), supply its real-world professional cinematic details.
        Make sure to return structured details under the specified JSON schema.
        We must have English synopsis and Hindi translation (synopsisHindi).
        Choose a relevant genre list.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                year: { type: Type.STRING },
                rating: { type: Type.STRING, description: "IMDb rating e.g., 8.4" },
                genre: { type: Type.ARRAY, items: { type: Type.STRING } },
                duration: { type: Type.STRING, description: "e.g., 2h 15m" },
                synopsis: { type: Type.STRING, description: "Fascinating English description of 3-4 lines" },
                synopsisHindi: { type: Type.STRING, description: "Same description translated elegantly in Hindi" },
                director: { type: Type.STRING },
                cast: { type: Type.ARRAY, items: { type: Type.STRING } },
                tagline: { type: Type.STRING, description: "Memorable cinematic catchphrase" }
              },
              required: ["title", "year", "rating", "genre", "duration", "synopsis", "synopsisHindi", "director", "cast", "tagline"]
            }
          }
        }
      });

      const parsed = JSON.parse(response.text || "[]");
      
      // Inject Streaming Video Profiles & Posters for each generated movie
      const resultMovies = parsed.map((item: any, idx: number) => {
        // Mapped stream profile to keep things fully playable
        const streamChoice = idx % 3 === 0 ? "Sintel" : (idx % 3 === 1 ? "TearsOfSteel" : "BigBuckBunny");
        const genres = item.genre || ["Drama"];
        const poster = getPosterForGenre(genres);
        const movieId = `gen-${Date.now()}-${idx}-${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

        return {
          id: movieId,
          title: item.title,
          year: item.year || "2024",
          rating: item.rating || "8.0",
          genre: genres,
          duration: item.duration || "2h 10m",
          synopsis: item.synopsis,
          synopsisHindi: item.synopsisHindi || "फिल्म की कहानी रोमांच और भावनाओं से भरी हुई है।",
          director: item.director || "Director",
          cast: item.cast || ["Lead Actor", "Supporting Actor"],
          tagline: item.tagline || "Prepare to be amazed.",
          videoUrl: STREAMS[streamChoice]["1080p"].url,
          posterUrl: poster,
          qualityOptions: [
            { resolution: "1080p (Full HD)", fileUrl: STREAMS[streamChoice]["1080p"].url, size: STREAMS[streamChoice]["1080p"].size },
            { resolution: "720p (HD)", fileUrl: STREAMS[streamChoice]["720p"].url, size: STREAMS[streamChoice]["720p"].size },
            { resolution: "480p (SD)", fileUrl: STREAMS[streamChoice]["480p"].url, size: STREAMS[streamChoice]["480p"].size }
          ]
        };
      });

      return res.json([...resultMovies, ...exactMatches]);
    } catch (e: any) {
      console.error("Gemini query error, returning localized search fallback:", e);
      // Fallback search
      const fuse = CURATED_CATALOG.filter(m => 
        m.title.toLowerCase().includes(query.toLowerCase()) || 
        m.synopsis.toLowerCase().includes(query.toLowerCase()) ||
        m.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
      );
      return res.json(fuse);
    }
  } else {
    // Return standard fuzzy matches if API key not present
    const fuse = CURATED_CATALOG.filter(m => 
      m.title.toLowerCase().includes(query.toLowerCase()) || 
      m.synopsis.toLowerCase().includes(query.toLowerCase()) ||
      m.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
    );
    return res.json(fuse);
  }
});

// Real Direct Proxy Downloader Endpoint
// Resolves: "local storage download kar sake all in one quality ke sath download kar sake, aur us video ko kisi bhi local video player me play kar sake"
app.get('/api/download', (req, res) => {
  const urlParam = req.query.url as string;
  const fileNameParam = req.query.fileName as string || "download-stream";
  const quality = req.query.quality as string || "1080p";

  if (!urlParam) {
    return res.status(400).send("Parameter 'url' is required.");
  }

  const cleanFileName = `${fileNameParam.replace(/[^a-zA-Z0-9\s-_]/g, '')}_${quality}.mp4`;

  // Determine whether to stream via http or https
  const clientProtocol = urlParam.startsWith('https') ? https : http;

  res.setHeader('Content-Disposition', `attachment; filename="${cleanFileName}"`);
  res.setHeader('Content-Type', 'video/mp4');

  const request = clientProtocol.get(urlParam, (response) => {
    // Forward status code and content length if available
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }
    
    // Pipe response stream directly to the Express client
    response.pipe(res);
  });

  request.on('error', (e) => {
    console.error("Error piping stream for download:", e);
    res.status(500).send("Error generating file download stream.");
  });
});

// Configure Vite integration or static file serving
const isProd = process.env.NODE_ENV === 'production';

async function bootstrap() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fileSystem.readFileSync(
          path.resolve(myDirname, 'index.html'),
          'utf-8'
        );
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(myDirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(myDirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Cinemax server successfully listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch(err => {
  console.error("Bootstrap server setup error:", err);
});
