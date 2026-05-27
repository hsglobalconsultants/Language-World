import { Volume2 } from "lucide-react";
import { PRONUNCIATION_PHRASES } from "../../constants/germanData";
import { motion } from "motion/react";

interface PronunciationGuideProps {
  level: "A1" | "A2" | "B1" | "B2";
}

export default function PronunciationGuide({ level }: PronunciationGuideProps) {
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      window.speechSynthesis.speak(utterance);
    }
  };

  const levelPhrases = PRONUNCIATION_PHRASES[level] || PRONUNCIATION_PHRASES["A1"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {levelPhrases.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-white p-6 rounded-2xl border border-soft-gray flex justify-between items-center group hover:shadow-lg hover:border-primary/20 transition-all duration-300"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black tracking-wider text-primary/70 bg-primary/10 px-2 py-0.5 rounded-md uppercase">
                {level} Focus
              </span>
            </div>
            <h4 className="text-xl font-bold text-accent mb-1 group-hover:text-primary transition-colors">{item.phrase}</h4>
            <p className="text-sm text-gray-500 mb-2">{item.translation}</p>
            <span className="text-xs font-mono text-primary bg-primary/5 px-2 py-0.5 rounded italic">
              Pronounced: {item.audioText}
            </span>
          </div>
          <button 
            onClick={() => speak(item.phrase)}
            className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center hover:bg-primary transition-colors shadow-md group-hover:scale-110 active:scale-95"
            title="Listen to German Pronunciation"
          >
            <Volume2 size={24} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
