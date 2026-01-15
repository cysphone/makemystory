"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { generateOurStory } from "@/lib/gemini";
import { saveStory, Story } from "@/app/actions";
import { Loader2, BookHeart, Sparkles } from "lucide-react";

export function OurStoryGenerator({ onBack }: { onBack: () => void }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        names: "",
        howMet: "",
        firstDate: "",
        memorableMoments: "",
        vibe: "Fairytale",
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const handleGenerate = async () => {
        setLoading(true);
        setStatus("Weaving your story...");
        try {
            // 1. Generate Text
            const storyData = await generateOurStory(formData);

            // 2. Generate Images (Mock/Placeholder for now as we integrate)
            // In a real flow, we'd call generateStoryImage for each page here.
            // For this demo, we'll use a placeholder or skip if API fails.
            setStatus("Illustrating your memories...");

            const pagesWithImages = storyData.pages.map((page: any) => ({
                ...page,
                // Using a placeholder service for reliable visuals in demo if real gen fails
                imageUrl: `https://placehold.co/600x400/ffe4e6/be123c?text=${encodeURIComponent(page.imagePrompt.slice(0, 20))}...`
            }));

            // 3. Save Story
            const storyId = formData.names.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);
            const newStory: Story = {
                id: storyId,
                title: "Our Love Story",
                coupleNames: formData.names,
                pages: pagesWithImages,
                createdAt: new Date().toISOString(),
            };

            await saveStory(newStory);

            // 4. Redirect
            router.push(`/story/${storyId}`);

        } catch (error) {
            console.error(error);
            setStatus("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-rose-50 text-rose-600">
                ← Back
            </Button>

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 text-rose-950">Our Story AI</h2>
                <p className="text-rose-900/60">Create a magical storybook of your journey.</p>
            </div>

            <div className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-rose-100">
                <div>
                    <label className="block text-sm font-medium text-rose-900 mb-2">Couple's Names</label>
                    <input
                        type="text"
                        className="w-full p-3 rounded-lg border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                        placeholder="e.g. Alex & Sam"
                        value={formData.names}
                        onChange={(e) => setFormData({ ...formData, names: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-rose-900 mb-2">How did you meet?</label>
                    <Textarea
                        className="w-full p-3 rounded-lg border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                        placeholder="e.g. At a coffee shop, through mutual friends..."
                        value={formData.howMet}
                        onChange={(e) => setFormData({ ...formData, howMet: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-rose-900 mb-2">First Date Details</label>
                    <Textarea
                        className="w-full p-3 rounded-lg border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                        placeholder="e.g. Went to the movies, had a picnic..."
                        value={formData.firstDate}
                        onChange={(e) => setFormData({ ...formData, firstDate: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-rose-900 mb-2">Memorable Moments</label>
                    <Textarea
                        className="w-full p-3 rounded-lg border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all min-h-[100px]"
                        placeholder="e.g. The proposal, our first trip together..."
                        value={formData.memorableMoments}
                        onChange={(e) => setFormData({ ...formData, memorableMoments: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-rose-900 mb-2">Story Vibe</label>
                    <select
                        className="w-full p-3 rounded-lg border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-white"
                        value={formData.vibe}
                        onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
                    >
                        <option>Fairytale</option>
                        <option>Modern Romance</option>
                        <option>Comic Book</option>
                        <option>Cinematic</option>
                        <option>Poetic</option>
                    </select>
                </div>

                <Button
                    className="w-full py-6 text-lg bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200 transition-all hover:scale-[1.02]"
                    onClick={handleGenerate}
                    disabled={loading || !formData.names || !formData.howMet}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin" /> {status}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 fill-current" /> Create Our Storybook
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
}
