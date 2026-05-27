import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, HelpCircle, Volume2, Sparkles, GraduationCap } from "lucide-react";
import Flashcards from "./Flashcards";
import GrammarQuiz from "./GrammarQuiz";
import PronunciationGuide from "./PronunciationGuide";
import AITranslator from "./AITranslator";

export default function GermanLearningTools() {
  const [activeTab, setActiveTab] = useState<"vocab" | "translate" | "grammar" | "pronunciation">("vocab");
  const [selectedLevel, setSelectedLevel] = useState<"A1" | "A2" | "B1" | "B2">("A1");

  const tabs = [
    { id: "vocab", label: "Vocabulary Flashcards", icon: <BookOpen size={18} /> },
    { id: "grammar", label: "AI Grammar Quiz", icon: <HelpCircle size={18} /> },
    { id: "pronunciation", label: "Phonetic Pronunciation", icon: <Volume2 size={18} /> },
    { id: "translate", label: "AI Translator Proxy", icon: <Sparkles size={18} /> },
  ];

  const cefrLevels = [
    { id: "A1", title: "A1 Level", sub: "Complete Beginner" },
    { id: "A2", title: "A2 Level", sub: "Elementary Study" },
    { id: "B1", title: "B1 Level", sub: "Intermediate Goethe" },
    { id: "B2", title: "B2 Level", sub: "Upper Intermediate" },
  ];

  return (
    <div className="w-full mt-24">
      {/* Title Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-xs uppercase tracking-widest mb-4">
          <GraduationCap size={14} />
          <span>Interactive Language Lab</span>
        </div>
        <h3 className="text-4xl md:text-5xl font-black text-accent mb-6 leading-tight">
          Master German Faster & Smarter
        </h3>
        <p className="text-gray-650 max-w-2xl mx-auto text-base md:text-lg">
          Challenge your vocabulary, refine speech phonetics, and take custom Goethe quizes tailored to your dynamic proficiency goals.
        </p>
      </div>

      {/* Dynamic CEFR Level Selector (The requested feature addition) */}
      <div className="bg-soft-gray p-8 rounded-[2.5rem] border border-gray-150/70 shadow-sm max-w-4xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div>
            <h4 className="text-sm font-black text-accent uppercase tracking-widest mb-1">
              1. Choose Target CEFR Study Level
            </h4>
            <p className="text-xs text-gray-550">
              Content across flashcards, quizes, and audio phrases dynamically reloads matching your level choice.
            </p>
          </div>
          <span className="text-xs font-black text-white px-3 py-1.5 rounded-xl bg-primary shadow-xs uppercase tracking-wide shrink-0">
            Active Study Level: {selectedLevel}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cefrLevels.map((lvl) => {
            const isActive = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id as any)}
                className={`relative p-5 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between cursor-pointer border-3 ${
                  isActive
                    ? "bg-gradient-to-br from-accent to-[#1e1572] text-white border-primary shadow-lg scale-[1.03]"
                    : "bg-white text-gray-700 border-white hover:border-primary/40 shadow-xs"
                }`}
              >
                {isActive && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-ping" />
                )}
                <span className={`text-2xl font-black ${isActive ? "text-primary" : "text-accent"}`}>
                  {lvl.id}
                </span>
                <div className="mt-4">
                  <p className="text-xs font-black uppercase tracking-wider opacity-90">
                    {lvl.title}
                  </p>
                  <p className={`text-[10px] mt-0.5 font-semibold ${isActive ? "text-white/70" : "text-gray-400"}`}>
                    {lvl.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool Category Buttons */}
      <div className="mb-4 text-center">
        <h4 className="text-sm font-black text-accent uppercase tracking-widest">
          2. Select Learning Activity Tool
        </h4>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3.5 font-black text-xs uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                  : "bg-white text-gray-550 border border-gray-100 hover:border-primary/50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Interactive Activity Stage */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${selectedLevel}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {activeTab === "vocab" && <Flashcards level={selectedLevel} />}
            {activeTab === "grammar" && <GrammarQuiz level={selectedLevel} />}
            {activeTab === "pronunciation" && <PronunciationGuide level={selectedLevel} />}
            {activeTab === "translate" && <AITranslator />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
