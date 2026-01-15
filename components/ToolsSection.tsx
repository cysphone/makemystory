"use client";

import { motion } from "framer-motion";
import { PenTool, BookHeart, MessageCircleHeart, Sparkles } from "lucide-react";
import { Card } from "./ui/Card";

export const tools = [
    {
        id: "love-letter",
        title: "Love Letter AI",
        description: "Generate a deeply emotional, personalized love letter.",
        icon: PenTool,
        color: "text-rose-500",
        bg: "bg-rose-50",
    },
    {
        id: "our-story",
        title: "Our Story AI",
        description: "Turn your journey into a beautiful romantic story.",
        icon: BookHeart,
        color: "text-pink-500",
        bg: "bg-pink-50",
    },
    {
        id: "flirty-text",
        title: "Flirty Text Generator",
        description: "Perfect texts for every mood and moment.",
        icon: MessageCircleHeart,
        color: "text-fuchsia-500",
        bg: "bg-fuchsia-50",
    },
    {
        id: "future-us",
        title: "Future Us AI",
        description: "Visualize your dream future together.",
        icon: Sparkles,
        color: "text-violet-500",
        bg: "bg-violet-50",
    },
];

export function ToolsSection({ onSelectTool }: { onSelectTool: (id: string) => void }) {
    return (
        <section id="tools" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your Magic</h2>
                    <p className="text-rose-900/60 text-lg">Select a tool to begin your creation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card
                                className="h-full cursor-pointer hover:-translate-y-2 group"
                                onClick={() => onSelectTool(tool.id)}
                            >
                                <div className={`w-12 h-12 rounded-2xl ${tool.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                                <p className="text-rose-900/60 text-sm leading-relaxed">
                                    {tool.description}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
