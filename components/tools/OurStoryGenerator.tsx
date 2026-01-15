"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { generateOurStory, generateStoryImage, analyzeImage } from "@/lib/gemini";
import { saveStory, Story } from "@/app/actions";
import { Loader2, Sparkles } from "lucide-react";
import { StoryBook } from "@/components/StoryBook";

export function OurStoryGenerator({ onBack }: { onBack: () => void }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        names: "",
        howMet: "",
        firstDate: "",
        memorableMoments: "",
        vibe: "Super Hero Comic",
    });
    const [images, setImages] = useState<{ p1: string | null, p2: string | null }>({ p1: null, p2: null });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [generatedStory, setGeneratedStory] = useState<Story | null>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: 'p1' | 'p2') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => ({ ...prev, [key]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setStatus("Analyzing your photos to create characters...");
        try {
            // 0. Analyze Images (if provided)
            let characterDescriptions = "";
            if (images.p1) {
                const desc1 = await analyzeImage(images.p1);
                characterDescriptions += `Partner 1: ${desc1}. `;
            }
            if (images.p2) {
                const desc2 = await analyzeImage(images.p2);
                characterDescriptions += `Partner 2: ${desc2}. `;
            }

            // 1. Generate Text (Comic Script)
            setStatus("Writing the comic script...");
            const storyData = await generateOurStory({ ...formData, characterDescriptions });

            // 2. Generate Images
            setStatus("Drawing the comic panels (this takes a moment)...");

            // Flatten all panels to process them in batches
            const allPanels: { pageIdx: number; panelIdx: number; panel: any }[] = [];
            storyData.pages.forEach((page: any, pageIdx: number) => {
                page.panels.forEach((panel: any, panelIdx: number) => {
                    allPanels.push({ pageIdx, panelIdx, panel });
                });
            });

            // Initialize processed pages structure
            const processedPages = JSON.parse(JSON.stringify(storyData.pages));

            // Process in batches to avoid server timeouts
            const BATCH_SIZE = 2;
            for (let i = 0; i < allPanels.length; i += BATCH_SIZE) {
                const batch = allPanels.slice(i, i + BATCH_SIZE);
                setStatus(`Drawing comic panels (${Math.min(i + BATCH_SIZE, allPanels.length)}/${allPanels.length})...`);

                await Promise.all(batch.map(async (item) => {
                    let imageUrl = null;
                    try {
                        const imagePrompt = `${item.panel.imagePrompt}, comic book style, vibrant colors, detailed, 4k`;
                        imageUrl = await generateStoryImage(imagePrompt);
                    } catch (e) {
                        console.error(`Failed to generate image for page ${item.pageIdx} panel ${item.panelIdx}`, e);
                    }

                    // Update the specific panel in the processedPages structure
                    processedPages[item.pageIdx].panels[item.panelIdx] = {
                        ...item.panel,
                        imageUrl: imageUrl || `https://placehold.co/600x400/ffe4e6/be123c?text=Comic+Panel`
                    };
                }));
            }

            const pagesWithImages = processedPages;

            // 3. Save Story
            const storyId = formData.names.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);
            const newStory: Story = {
                id: storyId,
                title: "Our Love Story",
                coupleNames: formData.names,
                pages: pagesWithImages, // Now contains panels
                createdAt: new Date().toISOString(),
            };

            const saveResult = await saveStory(newStory);

            if (saveResult.success) {
                router.push(`/story/${storyId}`);
            } else {
                console.warn("Save failed, showing story in-place:", saveResult.error);
                setGeneratedStory(newStory);
            }

        } catch (error) {
            console.error(error);
            setStatus("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (generatedStory) {
        return (
            <div className="w-full h-full">
                <div className="p-4 bg-yellow-400 border-b-4 border-black text-black text-center font-bold font-bangers tracking-wider flex justify-between items-center">
                    <span>⚠️ DEMO MODE: DOWNLOAD YOUR COMIC TO SAVE IT!</span>
                    <button onClick={() => setGeneratedStory(null)} className="underline hover:text-white">CREATE NEW</button>
                </div>
                <StoryBook story={generatedStory} />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 font-comic">
            <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-yellow-100 text-black font-bold">
                ← Back
            </Button>

            <div className="text-center mb-8">
                <h2 className="text-5xl font-bold mb-2 text-rose-600 font-bangers tracking-widest drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    COMIC CREATOR
                </h2>
                <p className="text-xl text-black font-bold">Turn your love story into a superhero saga!</p>
            </div>

            <div className="space-y-6 bg-white p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">

                {/* Image Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-black p-4 rounded-lg bg-yellow-50 text-center">
                        <label className="block text-lg font-bold font-bangers mb-2">Partner 1 Photo</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'p1')} className="w-full text-sm" />
                        {images.p1 && <img src={images.p1} alt="P1" className="mt-2 h-32 w-full object-cover rounded border-2 border-black" />}
                    </div>
                    <div className="border-2 border-dashed border-black p-4 rounded-lg bg-yellow-50 text-center">
                        <label className="block text-lg font-bold font-bangers mb-2">Partner 2 Photo</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'p2')} className="w-full text-sm" />
                        {images.p2 && <img src={images.p2} alt="P2" className="mt-2 h-32 w-full object-cover rounded border-2 border-black" />}
                    </div>
                </div>

                <div>
                    <label className="block text-lg font-bold font-bangers mb-2">HERO NAMES (Couple's Names)</label>
                    <input
                        type="text"
                        className="w-full p-3 rounded-lg border-2 border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all font-bold"
                        placeholder="e.g. Super Alex & Wonder Sam"
                        value={formData.names}
                        onChange={(e) => setFormData({ ...formData, names: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-lg font-bold font-bangers mb-2">ORIGIN STORY (How you met)</label>
                    <Textarea
                        className="w-full p-3 rounded-lg border-2 border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all font-bold"
                        placeholder="e.g. Crossed paths at the Daily Planet..."
                        value={formData.howMet}
                        onChange={(e) => setFormData({ ...formData, howMet: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-lg font-bold font-bangers mb-2">FIRST MISSION (First Date)</label>
                    <Textarea
                        className="w-full p-3 rounded-lg border-2 border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all font-bold"
                        placeholder="e.g. Defeated the villain of hunger at a pizza place..."
                        value={formData.firstDate}
                        onChange={(e) => setFormData({ ...formData, firstDate: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-lg font-bold font-bangers mb-2">EPIC MOMENTS</label>
                    <Textarea
                        className="w-full p-3 rounded-lg border-2 border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all min-h-[100px] font-bold"
                        placeholder="e.g. The proposal, saving the world together..."
                        value={formData.memorableMoments}
                        onChange={(e) => setFormData({ ...formData, memorableMoments: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-lg font-bold font-bangers mb-2">COMIC STYLE</label>
                    <select
                        className="w-full p-3 rounded-lg border-2 border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all bg-white font-bold"
                        value={formData.vibe}
                        onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
                    >
                        <option>Super Hero Comic</option>
                        <option>Manga / Anime</option>
                        <option>Vintage Romance Comic</option>
                        <option>Sci-Fi Space Opera</option>
                        <option>Fantasy Adventure</option>
                    </select>
                </div>

                <Button
                    className="w-full py-6 text-2xl font-bangers tracking-widest bg-rose-600 hover:bg-rose-700 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    onClick={handleGenerate}
                    disabled={loading || !formData.names || !formData.howMet}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin" /> {status.toUpperCase()}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 fill-current" /> GENERATE COMIC
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
}
