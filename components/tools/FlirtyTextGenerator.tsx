"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { generateFlirtyText } from "@/lib/gemini";
import { Loader2, MessageCircleHeart } from "lucide-react";

export function FlirtyTextGenerator({ onBack }: { onBack: () => void }) {
    const [formData, setFormData] = useState({
        context: "",
        tone: "Cheesy",
    });
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const texts = await generateFlirtyText(formData);
            setResult(texts);
        } catch (error) {
            console.error(error);
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
                <h2 className="text-3xl font-bold mb-2 text-rose-950">Flirty Text Generator</h2>
                <p className="text-rose-900/60">Spice up your conversation with AI-generated charm.</p>
            </div>

            {!result ? (
                <div className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-rose-100">
                    <div>
                        <label className="block text-sm font-medium text-rose-900 mb-2">What's the situation?</label>
                        <Textarea
                            className="w-full p-3 rounded-lg border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                            placeholder="e.g. Just matched on Tinder, want to ask them out, saying goodnight..."
                            value={formData.context}
                            onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-rose-900 mb-2">Tone</label>
                        <select
                            className="w-full p-3 rounded-lg border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-white"
                            value={formData.tone}
                            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                        >
                            <option>Cheesy</option>
                            <option>Bold</option>
                            <option>Witty</option>
                            <option>Cute</option>
                            <option>Mysterious</option>
                        </select>
                    </div>

                    <Button
                        className="w-full py-6 text-lg bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200 transition-all hover:scale-[1.02]"
                        onClick={handleGenerate}
                        disabled={loading || !formData.context}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" /> Cooking up Charm...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <MessageCircleHeart className="w-5 h-5 fill-current" /> Generate Flirty Texts
                            </span>
                        )}
                    </Button>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-rose-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-rose-500" />
                    <h3 className="text-xl font-semibold mb-6 text-rose-900">Pick Your Favorite</h3>
                    <div className="prose prose-rose max-w-none mb-8 whitespace-pre-wrap font-serif text-lg leading-relaxed text-rose-900/80">
                        {result}
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setResult("")}
                            className="flex-1 border-rose-200 text-rose-700 hover:bg-rose-50"
                        >
                            Try Different Tone
                        </Button>
                        <Button
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                            onClick={() => navigator.clipboard.writeText(result)}
                        >
                            Copy to Clipboard
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
