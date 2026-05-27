import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GERMAN_VOCAB } from "../../constants/germanData";

interface FlashcardsProps {
  level: "A1" | "A2" | "B1" | "B2";
}

export default function Flashcards({ level }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset active card index when study level changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [level]);

  const levelVocab = GERMAN_VOCAB[level] || GERMAN_VOCAB["A1"];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % levelVocab.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + levelVocab.length) % levelVocab.length);
    }, 150);
  };

  if (!levelVocab || levelVocab.length === 0) {
    return (
      <div className="text-center py-12 font-bold text-gray-400">
        No vocabulary cards available at this time.
      </div>
    );
  }

  const currentItem = levelVocab[currentIndex];

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      <div className="relative w-full h-80 perspective-1000">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full h-full relative cursor-pointer preserve-3d"
        >
          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-primary rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
            <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 bg-primary/10 px-3 py-1 rounded-full">
              {currentItem.category || "General"}
            </span>
            <span className="text-[10px] font-black tracking-widest text-[#FFCE00] uppercase mb-1">
              Goethe {level} Vocab
            </span>
            <h3 className="text-4xl font-extrabold text-accent">
              {currentItem.word}
            </h3>
            <p className="mt-8 text-gray-400 text-xs font-medium bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
              Click to reveal English translation
            </p>
          </div>

          {/* Back of card */}
          <div 
            className="absolute inset-0 backface-hidden bg-primary rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center"
            style={{ transform: "rotateY(180deg)" }}
          >
            <span className="text-white/60 font-bold text-xs uppercase tracking-widest mb-4">
              English Translation
            </span>
            <h3 className="text-4xl font-extrabold text-white">
              {currentItem.translation}
            </h3>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={prevCard}
          className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-accent hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-accent min-w-[70px] text-center bg-white/50 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-gray-100">
          {currentIndex + 1} / {levelVocab.length}
        </span>
        <button 
          onClick={nextCard}
          className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-accent hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      <p className="text-gray-400 text-xs italic text-center">
        Mastering essential {level} term definitions step-by-step.
      </p>
    </div>
  );
}
