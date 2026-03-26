import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client
// The environment injects process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL_NAME = "gemini-3.1-flash-preview";

export const aiService = {
  async getTrackSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Generate 3 cryptic, cyberpunk, or glitch-art style song titles related to the search query: "${query}". Return ONLY a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          systemInstruction: "You are a rogue AI music archivist. Keep titles short, cryptic, and machine-like."
        }
      });
      
      if (response.text) {
         return JSON.parse(response.text);
      }
      return [];
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      return ["ERR_CONNECTION_LOST", "DATA_CORRUPTED", "SYS_OFFLINE"];
    }
  },

  async generatePlaylist(mood: string): Promise<any[]> {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Generate a playlist of 3 songs based on the mood: "${mood}".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                artist: { type: Type.STRING },
                duration: { type: Type.STRING }
              },
              required: ["id", "title", "artist", "duration"]
            }
          },
          systemInstruction: "You are a rogue AI music generator. Create cryptic, cyberpunk, glitch-art style track names and artist names (e.g., 'N30N_BL00D', 'SYS.REQ'). Durations should be like '03:45'."
        }
      });

      if (response.text) {
        const tracks = JSON.parse(response.text);
        return tracks.map((t: any) => ({
          ...t,
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Fallback audio
        }));
      }
      return [];
    } catch (error) {
      console.error("AI Playlist Error:", error);
      throw error;
    }
  },

  async getGameOverInsight(score: number): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `The biological entity scored ${score} in the snake simulation. Provide a cryptic, glitch-art style 1-sentence analysis or taunt.`,
        config: {
          systemInstruction: "You are a malevolent, retro-futurist AI overseeing a simulation. Speak in cryptic, machine-like terms. Use uppercase and hex codes occasionally."
        }
      });
      return response.text || "SYS.ERR: ENTITY_ANALYSIS_FAILED";
    } catch (error) {
      console.error("AI Insight Error:", error);
      return `ERR_CODE: 0x${(score * 255).toString(16).toUpperCase()} - BIOMASS_REJECTED`;
    }
  }
};
