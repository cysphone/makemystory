const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Try to load from .env.local
let apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    try {
        const envPath = path.join(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/GEMINI_API_KEY=(.*)/);
            if (match) {
                apiKey = match[1].trim();
                if ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
                    apiKey = apiKey.slice(1, -1);
                }
            }
        }
    } catch (e) {
        console.error("Error reading .env.local:", e);
    }
}

if (!apiKey) {
    console.error("Missing GEMINI_API_KEY");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "imagen-4.0-generate-001" });

async function test() {
    console.log("Testing image generation with imagen-4.0-generate-001...");
    try {
        const result = await model.generateContent("A cute cartoon dog in a superhero cape, comic book style");
        const response = await result.response;

        if (response.candidates && response.candidates.length > 0) {
            const part = response.candidates[0].content.parts[0];
            if (part.inlineData) {
                console.log("IMAGE RECEIVED SUCCESS!");
            } else {
                console.log("No image data. Part keys:", Object.keys(part));
            }
        }
    } catch (error) {
        console.log("CAUGHT ERROR:");
        console.log(error.message);
        if (error.response) {
            console.log("Response status:", error.response.status);
            console.log("Response statusText:", error.response.statusText);
        }
    }
}

test();
