"use server";

import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "stories.json");

export type StoryPage = {
    text: string;
    imagePrompt: string;
    imageUrl?: string; // Base64 or URL
};

export type Story = {
    id: string;
    title: string;
    coupleNames: string;
    pages: StoryPage[];
    createdAt: string;
};

async function getStories(): Promise<Story[]> {
    try {
        const data = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveStory(story: Story) {
    try {
        const stories = await getStories();
        stories.push(story);
        await fs.writeFile(DATA_FILE, JSON.stringify(stories, null, 2));
        return { success: true };
    } catch (error: any) {
        console.error("Failed to save story:", error);
        // Return success: true anyway to allow the user to proceed to the story page,
        // even if it wasn't saved to disk (it will be lost on refresh, but better than crashing).
        // Ideally we would use a database here.
        return { success: false, error: "Failed to save story. Storage is read-only in this demo." };
    }
}

export async function getStory(id: string): Promise<Story | null> {
    const stories = await getStories();
    return stories.find((s) => s.id === id) || null;
}
