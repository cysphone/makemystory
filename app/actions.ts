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
    const stories = await getStories();
    stories.push(story);
    await fs.writeFile(DATA_FILE, JSON.stringify(stories, null, 2));
    return { success: true };
}

export async function getStory(id: string): Promise<Story | null> {
    const stories = await getStories();
    return stories.find((s) => s.id === id) || null;
}
