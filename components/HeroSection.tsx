"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "./ui/Button";

export function HeroSection({ onStart }: { onStart: () => void }) {
    const [hearts, setHearts] = useState<{ id: number; x: number; y: number; duration: number; delay: number; size: number }[]>([]);

    useEffect(() => {
        const newHearts = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 + 100,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5,
            size: Math.random() * 20 + 10,
        }));
        setHearts(newHearts);
    }, []);

    return (
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {hearts.map((heart) => (
                    <motion.div
                        key={heart.id}
                        initial={{
                            opacity: 0,
                            y: heart.y,
                            x: heart.x,
                        }}
                        animate={{
                            opacity: [0, 0.5, 0],
                            y: -100,
                            x: heart.x,
                        }}
                        transition={{
                            duration: heart.duration,
                            repeat: Infinity,
                            delay: heart.delay,
                        }}
                        className="absolute text-rose-200"
                        style={{
                            left: `${(heart.id * 5) % 100}%`, // Deterministic position base
                            top: `${(heart.id * 7) % 100}%`,
                            fontSize: `${heart.size}px`,
                        }}
                    >
                        <Heart fill="currentColor" />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-4xl mx-auto space-y-6"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-rose-200 text-rose-600 text-sm font-medium mb-4"
                >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>The #1 AI Valentine's Gift</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                    Turn Your Love Into <br />
                    <span className="gradient-text">Words, Stories & Magic.</span>
                </h1>

                <p className="text-xl md:text-2xl text-rose-900/80 max-w-2xl mx-auto">
                    Create deeply personal love letters, romantic stories, and future memories with the power of AI.
                </p>

                <div className="pt-8 flex justify-center">
                    <Button
                        size="lg"
                        onClick={onStart}
                        className="bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/40 shadow-2xl border-none"
                    >
                        Start Creating Now
                    </Button>
                </div>
            </motion.div>
        </section>
    );
}
