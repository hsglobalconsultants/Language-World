import { Volume2, Play } from "lucide-react";
import { PRONUNCIATION_PHRASES } from "../../constants/germanData";
import { motion } from "motion/react";

export default function PronunciationGuide() {
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {PRONUNCIATION_PHRASES.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-2xl border border-soft-gray flex justify-between items-center group hover:shadow-lg transition-all"
        >
          <div>
            <h4 className="text-xl font-bold text-accent mb-1">{item.phrase}</h4>
            <p className="text-sm text-gray-500 mb-2">{item.translation}</p>
            <span className="text-xs font-mono text-primary bg-primary/5 px-2 py-0.5 rounded italic">
              / {item.audioText} /
            </span>
          </div>
          <button 
            onClick={() => speak(item.phrase)}
            className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center hover:bg-primary transition-colors shadow-md group-hover:scale-110 active:scale-95"
          >
            <Volume2 size={24} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
