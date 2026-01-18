"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key is now loaded from environment variables for security
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY in environment variables");
}

// Helper to get the model, ensuring API key is present
const getGenAI = () => {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set. Please add it to your environment variables.");
    }
    return new GoogleGenerativeAI(GEMINI_API_KEY);
};

export async function generateLoveLetter(params: {
    partnerName: string;
    occasion: string;
    tone: string;
    memories: string;
}) {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Write a ${params.tone} love letter to ${params.partnerName} for ${params.occasion}. Include these memories: ${params.memories}. Keep it heartfelt and personal.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Error generating love letter:", error);
        return `Error: ${error.message || "Unknown error"}. Please check your API key and try again.`;
    }
}

export async function generateFutureUs(params: {
    names: string;
    stage: string;
    dreams: string;
}) {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Write a creative and romantic "Future Us" scenario for a couple named ${params.names}. They are currently in the "${params.stage}" stage of their relationship. Their dreams include: ${params.dreams}. Describe a day in their life 5 years from now.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Error generating future scenario:", error);
        return `Error: ${error.message || "Unknown error"}. Please check your API key and try again.`;
    }
}

export async function generateFlirtyText(params: {
    context: string;
    tone: string;
}) {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Generate 5 distinct ${params.tone} flirty text messages for a situation where: ${params.context}. Format them as a numbered list.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Error generating flirty texts:", error);
        return `Error: ${error.message || "Unknown error"}. Please check your API key and try again.`;
    }
}

export async function analyzeImage(base64Image: string) {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    try {
        const result = await model.generateContent([
            "Describe the person in this image in detail for a character description in a comic book. Focus on hair color/style, eye color, skin tone, distinctive features, and clothing style. Keep it concise (e.g., 'A young woman with wavy red hair, green eyes, fair skin, wearing a blue sundress').",
            { inlineData: { data: base64Image.split(",")[1], mimeType: "image/jpeg" } }
        ]);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Error analyzing image:", error);
        return "A generic character";
    }
}

export async function generateOurStory(params: {
    howMet: string;
    firstDate: string;
    memorableMoments: string;
    names: string;
    vibe: string;
    characterDescriptions?: string; // New param
}) {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Request JSON output for structured pages
    const prompt = `Create a 4-page COMIC BOOK script about a couple named ${params.names}.
    
    Context:
    - How they met: ${params.howMet}
    - First date: ${params.firstDate}
    - Memorable moments: ${params.memorableMoments}
    - Vibe/Theme: ${params.vibe}
    - Character Descriptions: ${params.characterDescriptions || "Create suitable appearances based on the story."}

    Format the output as a JSON object with a "pages" array. 
    Each page object should have:
    - "panels": An array of 1-2 panels per page.
      Each panel object should have:
      - "description": A visual description of the scene for the artist.
      - "imagePrompt": A detailed prompt to generate a comic-book style image (e.g., "Marvel style", "Webtoon style", or "Pixar comic style" based on vibe: ${params.vibe}). Include the character descriptions to ensure consistency.
      - "caption": A narration box text (optional).
      - "speechBubbles": An array of objects { "character": "Name", "text": "Dialogue" }.
    
    The story should be emotional, engaging, and visually striking.`;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });
        const response = await result.response;
        return JSON.parse(response.text());
    } catch (error: any) {
        console.error("Error generating story:", error);
        throw new Error(`Failed to generate story: ${error.message}`);
    }
}

export async function generateStoryImage(prompt: string) {
    const genAI = getGenAI();
    // Using Imagen 4.0 for high quality image generation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;

        // Extract image from response
        if (response.candidates && response.candidates[0].content.parts[0].inlineData) {
            const image = response.candidates[0].content.parts[0].inlineData;
            return `data:${image.mimeType};base64,${image.data}`;
        }

        return null;
    } catch (error: any) {
        console.error("Error generating image:", error);
        return null;
    }
}
