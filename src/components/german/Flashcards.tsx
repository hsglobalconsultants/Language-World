import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { GERMAN_VOCAB } from "../../constants/germanData";

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % GERMAN_VOCAB.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + GERMAN_VOCAB.length) % GERMAN_VOCAB.length);
    }, 150);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      <div className="relative w-full h-80 perspective-1000">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full h-full relative cursor-pointer preserve-3d"
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-primary rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
            <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4">
              {GERMAN_VOCAB[currentIndex].category}
            </span>
            <h3 className="text-4xl font-extrabold text-accent">
              {GERMAN_VOCAB[currentIndex].word}
            </h3>
            <p className="mt-8 text-gray-400 text-xs font-medium">Click to see translation</p>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden bg-primary rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center"
            style={{ transform: "rotateY(180deg)" }}
          >
            <span className="text-white/60 font-bold text-xs uppercase tracking-widest mb-4">
              English Translation
            </span>
            <h3 className="text-4xl font-extrabold text-white">
              {GERMAN_VOCAB[currentIndex].translation}
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
        <span className="font-bold text-accent min-w-[60px] text-center">
          {currentIndex + 1} / {GERMAN_VOCAB.length}
        </span>
        <button 
          onClick={nextCard}
          className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-accent hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      <p className="text-gray-400 text-sm italic">Master common German words with interactive cards.</p>
    </div>
  );
}
