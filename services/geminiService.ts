import { GoogleGenAI } from "@google/genai";
import { ScraperConfig, SearchResult, Opportunity, Source } from "../types";

const createPrompt = (config: ScraperConfig): string => {
  const sectors = config.sectors.join(", ");
  const regions = config.geography.join(", ");
  
  return `
    You are a CSR Research Assistant. Your task is to find REAL, ACTIVE RFP (Request for Proposal), RFQ (Request for Quotation), and EOI (Expression of Interest) opportunities in India.

    Target Sectors: ${sectors}
    Target Regions: ${regions}
    Deadline Cutoff: ${config.deadline} (Include opportunities ending before this date, or 'Open' if ongoing)

    Use Google Search to find current listings from major CSR portals, NGO funding sites, and corporate foundations. 
    
    EXTRACT specific opportunities found in the search results. Do not make up data. If exact details like budget are missing, use "Not specified".

    Return the data as a JSON object with a single key "opportunities" which is an array of objects. Each object must have these fields:
    - title: Name of the RFP/RFQ/EOI
    - organization: Issuing Organization
    - focusArea: The specific sector (e.g., Education, Health)
    - region: Geographic eligibility (e.g., Pan-India, Uttarakhand)
    - budget: Budget amount if available, else "Not specified"
    - deadline: Submission deadline (YYYY-MM-DD or "Open")
    - type: "RFP", "RFQ", or "EOI"
    - link: The direct URL to the opportunity found in the search
    - brief: A short 1-sentence description

    Ensure the response is valid JSON. Do not include markdown formatting (like \`\`\`json) in the response if possible, or I will strip it.
  `;
};

export const generateScraperScript = async (config: ScraperConfig): Promise<SearchResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: createPrompt(config),
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    
    // Parse JSON
    let data: any = {};
    try {
        data = JSON.parse(text);
    } catch (e) {
        // Fallback cleanup if the model returned markdown
        const cleanText = text.replace(/```json\n|\n```/g, '');
        data = JSON.parse(cleanText);
    }

    const opportunities: Opportunity[] = data.opportunities || [];

    // Extract grounding sources
    const sources: Source[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach(chunk => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      opportunities,
      sources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
