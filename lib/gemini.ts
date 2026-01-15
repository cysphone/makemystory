"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key is now loaded from environment variables for security
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

if (!GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY in environment variables");
}

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
    const prompt = `Write a deeply romantic, passionate, and slightly spicy short story about a couple named ${params.names}.
    Details:
    - How they met: ${params.howMet}
    - First date: ${params.firstDate}
    - Memorable moments: ${params.memorableMoments}
    - Vibe/Theme: ${params.vibe}

    Format the output as a JSON object with a "pages" array. 
    Each page object should have:
    - "text": A paragraph of the story (keep it concise, 2-3 sentences).
    - "imagePrompt": A detailed prompt to generate a Pixar-style 3D animated movie illustration for this page. It should be colorful, expressive, and match the story text exactly. The characters should look consistent.
    
    Create exactly 4 pages. The story should be wonderful, loving, and passionate.`;

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
    // Using Imagen 4.0 for high quality Pixar-style images
    const model = genAI.getGenerativeModel({ model: "imagen-4.0-generate-001" });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;

        // Extract image from response
        // The structure for Imagen responses usually contains inlineData in the candidates
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
