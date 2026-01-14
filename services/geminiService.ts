import { GoogleGenAI } from "@google/genai";
import { ScraperConfig, SearchResult, Opportunity, Source } from "../types";

const createPrompt = (config: ScraperConfig): string => {
  const sectors = config.sectors.join(", ");
  const regions = config.geography.join(", ");
  const orgFocus = config.specificOrganization && config.specificOrganization.trim() !== ""
    ? `IMPORTANT: Focus your search primarily on active opportunities and official announcements from "${config.specificOrganization}".`
    : "Search across all major CSR portals (like CSRBox, NGOBox), NGO funding sites, corporate foundations, and government tender portals.";
  
  return `
    You are a CSR Research Assistant. Your task is to find REAL, ACTIVE RFP (Request for Proposal), RFQ (Request for Quotation), and EOI (Expression of Interest) opportunities in India.

    ${orgFocus}
    
    CRITICAL: Also search for recent LinkedIn posts and updates from corporate CSR heads, foundations, and aggregator accounts that mention new or upcoming RFPs/RFQs.
    
    Target Sectors: ${sectors}
    Target Regions: ${regions}
    Deadline Cutoff: ${config.deadline} (Include opportunities ending before this date, or 'Open' if ongoing)

    Use Google Search to find current listings and social media updates.
    
    EXTRACT specific opportunities found in the search results. Do not make up data. If exact details like budget are missing, use "Not specified".

    OBJECTIVE: Find up to 100 distinct active opportunities. Be as comprehensive and exhaustive as possible.

    Return the data as a JSON object with a single key "opportunities" which is an array of objects. Each object must have these fields:
    - title: Name of the RFP/RFQ/EOI
    - organization: Issuing Organization
    - focusArea: The specific sector (e.g., Education, Health)
    - region: Geographic eligibility (e.g., Pan-India, Uttarakhand)
    - budget: Budget amount if available, else "Not specified"
    - deadline: Submission deadline (YYYY-MM-DD or "Open")
    - type: "RFP", "RFQ", or "EOI"
    - link: The direct URL to the opportunity or social media post found
    - brief: A short 1-sentence description

    Ensure the response is valid JSON. Use your grounding capabilities to ensure the links are real and functional.
  `;
};

export const generateScraperScript = async (config: ScraperConfig): Promise<SearchResult> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing. Please set the 'API_KEY' environment variable in your Vercel project settings and redeploy.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: createPrompt(config),
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    
    let data: any = {};
    try {
        data = JSON.parse(text);
    } catch (e) {
        const cleanText = text.replace(/```json\n|\n```/g, '');
        data = JSON.parse(cleanText);
    }

    const opportunities: Opportunity[] = data.opportunities || [];

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

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "An unknown error occurred with the Gemini API");
  }
};