"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// PLACE YOUR API KEY HERE
const GEMINI_API_KEY = "AIzaSyDK4TxPrMRWFinfY5qiprgjVIcnqBP7yUU";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateLoveLetter(params: {
    partnerName: string;
    occasion: string;
    tone: string;
    memories: string;
}) {
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

export async function generateOurStory(params: {
    howMet: string;
    firstDate: string;
    memorableMoments: string;
    names: string;
    vibe: string;
}) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Request JSON output for structured pages
    const prompt = `Write a romantic short story about a couple named ${params.names}.
    Details:
    - How they met: ${params.howMet}
    - First date: ${params.firstDate}
    - Memorable moments: ${params.memorableMoments}
    - Vibe/Theme: ${params.vibe}

    Format the output as a JSON object with a "pages" array. 
    Each page object should have:
    - "text": A paragraph of the story (keep it concise, 2-3 sentences).
    - "imagePrompt": A detailed prompt to generate an illustration for this page in the style of ${params.vibe}.
    
    Create 5-7 pages.`;

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
    // Using Imagen 3 model from the list
    const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });

    try {
        // Imagen API via Gemini SDK might have different signature, 
        // but for now we'll try the standard generateContent with text prompt.
        // Note: As of now, image generation via this SDK might return base64 inline.
        const result = await model.generateContent(prompt);
        const response = await result.response;

        // Check if we have images in the response
        // This part depends heavily on the specific response format of the Imagen model in this SDK version.
        // Often it returns an inlineData part.
        // For safety, if this fails, we might need to return a placeholder or handle it differently.

        // Let's assume standard text response for now if image fails, or try to extract image.
        // Actually, for Imagen, we usually need to check `candidates[0].content.parts[0].inlineData`.

        // Since I can't easily debug the exact response shape without running it, 
        // I'll add a safe fallback to a placeholder service if SDK extraction fails,
        // but I'll try to return the raw response to see what happens first.

        return null; // Placeholder for now, will implement actual image extraction in next step after verifying response shape.
    } catch (error: any) {
        console.error("Error generating image:", error);
        return null;
    }
}
