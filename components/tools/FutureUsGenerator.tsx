"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { generateFutureUs } from "@/lib/gemini";
import { Loader2, Sparkles } from "lucide-react";

export function FutureUsGenerator({ onBack }: { onBack: () => void }) {
    const [formData, setFormData] = useState({
        names: "",
        stage: "Dating",
        dreams: "",
    });
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const story = await generateFutureUs(formData);
            setResult(story);
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
                <h2 className="text-3xl font-bold mb-2 text-rose-950">Future Us AI</h2>
                <p className="text-rose-900/60">Peek into your beautiful future together.</p>
            </div>

            {!result ? (
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
                        <label className="block text-sm font-medium text-rose-900 mb-2">Current Relationship Stage</label>
                        <select
                            className="w-full p-3 rounded-lg border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-white"
                            value={formData.stage}
                            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                        >
                            <option>Just Met</option>
                            <option>Dating</option>
                            <option>Engaged</option>
                            <option>Married</option>
                            <option>Long Distance</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-rose-900 mb-2">Shared Dreams & Goals</label>
                        <Textarea
                            className="w-full p-3 rounded-lg border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all min-h-[100px]"
                            placeholder="e.g. Traveling the world, buying a house, starting a family, retiring by the beach..."
                            value={formData.dreams}
                            onChange={(e) => setFormData({ ...formData, dreams: e.target.value })}
                        />
                    </div>

                    <Button
                        className="w-full py-6 text-lg bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200 transition-all hover:scale-[1.02]"
                        onClick={handleGenerate}
                        disabled={loading || !formData.names}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" /> Gazing into Crystal Ball...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 fill-current" /> See Our Future
                            </span>
                        )}
                    </Button>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-rose-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-rose-500" />
                    <h3 className="text-xl font-semibold mb-6 text-rose-900">5 Years From Now...</h3>
                    <div className="prose prose-rose max-w-none mb-8 whitespace-pre-wrap font-serif text-lg leading-relaxed text-rose-900/80">
                        {result}
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setResult("")}
                            className="flex-1 border-rose-200 text-rose-700 hover:bg-rose-50"
                        >
                            Try Another Scenario
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
