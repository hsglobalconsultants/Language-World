import { useState } from "react";
import { Search, ArrowRightLeft, Loader2, Sparkles } from "lucide-react";
import { translateText } from "../../services/geminiService";

export default function AITranslator() {
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim() || isTranslating) return;
    
    setIsTranslating(true);
    try {
      const translation = await translateText(inputText);
      setResultText(translation);
    } catch (error) {
      console.error("Translator Component Error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-soft-gray shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <Sparkles size={20} />
        </div>
        <div>
          <h4 className="text-xl font-bold text-accent">AI Vocabulary Translator</h4>
          <p className="text-sm text-gray-500">Translate any German word or phrase to English instantly.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type German or English here..."
            className="w-full p-6 bg-soft-gray rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all resize-none h-32"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
            className="btn-primary px-10 py-4 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none min-w-[200px]"
          >
            {isTranslating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Translating...
              </>
            ) : (
              <>
                Translate <ArrowRightLeft size={20} />
              </>
            )}
          </button>
        </div>

        {resultText && (
          <div className="mt-6 p-6 bg-accent/5 border border-accent/10 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-2">Translation Result</span>
            <p className="text-2xl font-bold text-accent">{resultText}</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-soft-gray">
        <p className="text-xs text-center text-gray-400">
          Powered by Gemini AI for contextual language translation.
        </p>
      </div>
    </div>
  );
}
