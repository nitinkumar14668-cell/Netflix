import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { CURATED_CATALOG, STREAMS, getPosterForGenre } from "../../../data";

// Initialize Gemini client lazily
const aiKey = process.env.GEMINI_API_KEY;
const ai = aiKey
  ? new GoogleGenAI({
      apiKey: aiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json(CURATED_CATALOG);
    }

    const exactMatches = CURATED_CATALOG.filter(m =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
    );

    if (exactMatches.length > 0 && !ai) {
      return NextResponse.json(exactMatches);
    }

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
          const keys = ["Sintel", "TearsOfSteel", "BigBuckBunny"] as const;
          const streamChoice = keys[idx % 3];
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

        return NextResponse.json([...resultMovies, ...exactMatches]);
      } catch (gemIniErr) {
        console.error("Gemini content generation failed, returning fallback filters", gemIniErr);
        const fuse = CURATED_CATALOG.filter(m => 
          m.title.toLowerCase().includes(query.toLowerCase()) || 
          m.synopsis.toLowerCase().includes(query.toLowerCase()) ||
          m.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
        );
        return NextResponse.json(fuse);
      }
    } else {
      const fuse = CURATED_CATALOG.filter(m => 
        m.title.toLowerCase().includes(query.toLowerCase()) || 
        m.synopsis.toLowerCase().includes(query.toLowerCase()) ||
        m.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
      );
      return NextResponse.json(fuse);
    }
  } catch (error) {
    console.error("API error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
