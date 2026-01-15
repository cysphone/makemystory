"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Story } from "@/app/actions";

export function StoryBook({ story }: { story: Story }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [copied, setCopied] = useState(false);

    const nextPage = () => {
        if (currentPage < story.pages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const shareStory = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            alert("Could not copy link automatically. Please copy the URL from the address bar.");
        }
    };

    return (
        <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="max-w-4xl w-full aspect-[3/2] relative perspective-1000">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, rotateY: 90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: -90 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full bg-white rounded-r-2xl shadow-2xl flex overflow-hidden border-l-8 border-rose-900/20"
                    >
                        {/* Left Side: Image */}
                        <div className="w-1/2 h-full bg-rose-100 relative overflow-hidden">
                            {story.pages[currentPage].imageUrl ? (
                                <img
                                    src={story.pages[currentPage].imageUrl}
                                    alt="Story illustration"
                                    className="w-full h-full object-cover animate-ken-burns"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-rose-200 text-rose-400">
                                    <span className="text-4xl">✨</span>
                                </div>
                            )}
                        </div>

                        {/* Right Side: Text */}
                        <div className="w-1/2 h-full p-8 md:p-12 flex flex-col justify-center items-center text-center bg-[#fffbf7]">
                            <div className="prose prose-rose prose-lg font-serif">
                                <p className="text-xl md:text-2xl leading-relaxed text-rose-900">
                                    {story.pages[currentPage].text}
                                </p>
                            </div>
                            <div className="mt-8 text-sm text-rose-400 font-mono">
                                Page {currentPage + 1} of {story.pages.length}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="absolute top-1/2 -left-16 -translate-y-1/2">
                    <Button
                        variant="ghost"
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className="bg-white/80 hover:bg-white rounded-full p-4 shadow-lg disabled:opacity-0 transition-all"
                    >
                        <ChevronLeft className="w-8 h-8 text-rose-600" />
                    </Button>
                </div>

                <div className="absolute top-1/2 -right-16 -translate-y-1/2">
                    <Button
                        variant="ghost"
                        onClick={nextPage}
                        disabled={currentPage === story.pages.length - 1}
                        className="bg-white/80 hover:bg-white rounded-full p-4 shadow-lg disabled:opacity-0 transition-all"
                    >
                        <ChevronRight className="w-8 h-8 text-rose-600" />
                    </Button>
                </div>
            </div>

            {/* Footer Controls */}
            <div className="mt-12 flex gap-4">
                <Button
                    onClick={shareStory}
                    className="bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/30 min-w-[200px]"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 mr-2" /> Link Copied!
                        </>
                    ) : (
                        <>
                            <Share2 className="w-4 h-4 mr-2" /> Share Our Story
                        </>
                    )}
                </Button>
            </div>

            <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes ken-burns {
          0% { transform: scale(1); }
          50% { transform: scale(1.1) translate(-2%, -2%); }
          100% { transform: scale(1); }
        }
        .animate-ken-burns {
          animation: ken-burns 20s infinite ease-in-out alternate;
        }
      `}</style>
        </div>
    );
}
