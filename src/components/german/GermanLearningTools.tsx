import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, HelpCircle, Volume2, Sparkles } from "lucide-react";
import Flashcards from "./Flashcards";
import GrammarQuiz from "./GrammarQuiz";
import PronunciationGuide from "./PronunciationGuide";
import AITranslator from "./AITranslator";

export default function GermanLearningTools() {
  const [activeTab, setActiveTab] = useState<"vocab" | "translate" | "grammar" | "pronunciation">("vocab");

  const tabs = [
    { id: "vocab", label: "Vocabulary", icon: <BookOpen size={18} /> },
    { id: "translate", label: "AI Translator", icon: <Sparkles size={18} /> },
    { id: "grammar", label: "Grammar Quiz", icon: <HelpCircle size={18} /> },
    { id: "pronunciation", label: "Pronunciation", icon: <Volume2 size={18} /> },
  ];

  return (
    <div className="w-full mt-20">
      <div className="text-center mb-12">
        <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-4">Interactive Lab</h2>
        <h3 className="text-4xl font-extrabold text-accent mb-6">Master German Faster</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Try our interactive tools to practice your skills anytime, anywhere. These are just samples of what we offer in our full courses.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-bold rounded-full transition-all ${
              activeTab === tab.id 
                ? "bg-accent text-white shadow-lg shadow-accent/20 scale-105" 
                : "bg-white text-gray-500 border border-gray-100 hover:border-primary/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeTab === "vocab" && <Flashcards />}
            {activeTab === "translate" && <AITranslator />}
            {activeTab === "grammar" && <GrammarQuiz />}
            {activeTab === "pronunciation" && <PronunciationGuide />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
