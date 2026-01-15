const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const GEMINI_API_KEY = "AIzaSyDK4TxPrMRWFinfY5qiprgjVIcnqBP7yUU";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
        const data = await response.json();

        if (data.models) {
            const names = data.models.map(m => m.name).join('\n');
            fs.writeFileSync('model_list.txt', names);
            console.log("Models written to model_list.txt");
        } else {
            fs.writeFileSync('model_list.txt', JSON.stringify(data, null, 2));
            console.log("Error or no models, details written to model_list.txt");
        }
    } catch (error) {
        fs.writeFileSync('model_list.txt', "Error: " + error.message);
    }
}

listModels();
