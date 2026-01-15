"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { ToolsSection } from "@/components/ToolsSection";
import { LoveLetterGenerator } from "@/components/tools/LoveLetterGenerator";
import { OurStoryGenerator } from "@/components/tools/OurStoryGenerator";
import { FlirtyTextGenerator } from "@/components/tools/FlirtyTextGenerator";
import { FutureUsGenerator } from "@/components/tools/FutureUsGenerator";

type ViewState = "home" | "love-letter" | "our-story" | "flirty-text" | "future-us";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>("home");

  const scrollToTools = () => {
    document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
  };

  const renderTool = () => {
    switch (currentView) {
      case "love-letter":
        return <LoveLetterGenerator onBack={() => setCurrentView("home")} />;
      case "our-story":
        return <OurStoryGenerator onBack={() => setCurrentView("home")} />;
      case "flirty-text":
        return <FlirtyTextGenerator onBack={() => setCurrentView("home")} />;
      case "future-us":
        return <FutureUsGenerator onBack={() => setCurrentView("home")} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        {currentView === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection onStart={scrollToTools} />
            <ToolsSection onSelectTool={(id) => setCurrentView(id as ViewState)} />

            <footer className="py-8 text-center text-rose-900/40 text-sm">
              <p>© {new Date().getFullYear()} MyLoveStoryAI. Made with ❤️ for couples.</p>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="tool"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white/50 backdrop-blur-sm"
          >
            {renderTool()}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
