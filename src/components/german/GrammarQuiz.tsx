import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, RotateCcw, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { generateGermanGrammarQuiz } from "../../services/geminiService";
import { GERMAN_QUIZ } from "../../constants/germanData";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface GrammarQuizProps {
  level: "A1" | "A2" | "B1" | "B2";
}

export default function GrammarQuiz({ level }: GrammarQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setIsOfflineFallback(false);
    try {
      const newQuestions = await generateGermanGrammarQuiz(level, 5);
      if (newQuestions && newQuestions.length > 0) {
        setQuestions(newQuestions);
        setIsOfflineFallback(false);
      } else {
        // Fallback to high-quality local CEFR specific questions
        const localQuestions = GERMAN_QUIZ[level] || GERMAN_QUIZ["A1"];
        setQuestions(localQuestions);
        setIsOfflineFallback(true);
      }
    } catch (e) {
      console.warn("AI Quiz generation failed, falling back to local dataset:", e);
      const localQuestions = GERMAN_QUIZ[level] || GERMAN_QUIZ["A1"];
      setQuestions(localQuestions);
      setIsOfflineFallback(true);
    } finally {
      setCurrentStep(0);
      setSelectedOption(null);
      setIsFinished(false);
      setScore(0);
      setIsLoading(false);
    }
  };

  // Re-fetch or swap datasets when the study level changes
  useEffect(() => {
    fetchQuestions();
  }, [level]);

  const handleSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    if (option === questions[currentStep].answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
      }
    }, 2800); // Give plenty of time to read explanation carefully before auto-advancing
  };

  const restartQuiz = () => {
    fetchQuestions();
  };

  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-soft-gray flex flex-col items-center justify-center min-h-[400px] text-center">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <h3 className="text-xl font-bold text-accent">Crafting your {level} Quiz...</h3>
        <p className="text-gray-500 mt-2">Our AI is generating custom training questions focused on Goethe {level} Grammar.</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-soft-gray text-center min-h-[400px] flex flex-col items-center justify-center">
        <p className="text-red-500 font-bold mb-4">Could not load quiz questions at this time.</p>
        <button onClick={restartQuiz} className="btn-accent px-6 py-2.5 rounded-xl font-bold">Try Again</button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-soft-gray text-center shadow-sm">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} />
        </div>
        <h3 className="text-2xl font-bold text-accent mb-4">Goethe {level} Quiz Completed!</h3>
        <div className="text-5xl font-extrabold text-primary mb-6">{score} / {questions.length}</div>
        <p className="text-gray-500 mb-8">
          {score === questions.length 
            ? "Mustergültig! Flawless score! Ready to advance to the next level challenge." 
            : "Great training! Review the structural explanations and try again to refine your score."}
        </p>
        <button onClick={restartQuiz} className="bg-accent hover:bg-slate-900 text-white font-extrabold text-sm uppercase px-8 py-3.5 rounded-2xl mx-auto flex items-center gap-2 transition-all">
          <RotateCcw size={18} /> New AI Quiz ({level})
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="bg-soft-gray p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            {level} Question {currentStep + 1} of {questions.length}
          </span>
          {isOfflineFallback ? (
            <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider flex items-center gap-1 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
              <AlertCircle size={10} /> Local Practice Set
            </span>
          ) : (
            <span className="text-[10px] text-primary font-semibold uppercase tracking-wider flex items-center gap-1 bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles size={10} className="animate-pulse" /> AI Interactive Quiz
            </span>
          )}
        </div>
        <h3 className="text-2xl font-black text-accent leading-tight">
          {currentQuestion.question}
        </h3>
      </div>

      <div className="grid gap-4 flex-grow">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrect = isSelected && option === currentQuestion.answer;
          const isWrong = isSelected && option !== currentQuestion.answer;
          const wasCorrectButNotSelected = selectedOption && !isSelected && option === currentQuestion.answer;

          return (
            <motion.button
              key={option}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(option)}
              disabled={!!selectedOption}
              className={`p-5 rounded-2xl border-2 text-left font-semibold transition-all flex justify-between items-center ${
                isCorrect ? "bg-primary/20 border-primary text-primary" :
                isWrong ? "bg-red-50 border-red-500 text-red-500" :
                wasCorrectButNotSelected ? "border-primary/50 text-primary/70 bg-primary/5" :
                isSelected ? "border-accent bg-accent/10 text-accent" :
                "bg-white border-white hover:border-primary/30 text-gray-700 disabled:opacity-60 cursor-pointer"
              }`}
            >
              <span>{option}</span>
              {isCorrect && <Check size={20} />}
              {isWrong && <X size={20} />}
            </motion.button>
          );
        })}
      </div>
      
      <AnimatePresence>
        {selectedOption && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-xl border ${selectedOption === currentQuestion.answer ? 'bg-primary/5 border-primary/20' : 'bg-red-50/50 border-red-100'}`}
          >
            <p className={`font-bold text-sm mb-1 ${selectedOption === currentQuestion.answer ? 'text-primary' : 'text-red-500'}`}>
              {selectedOption === currentQuestion.answer ? 'Sehr gut! Richtig (Correct)' : 'Leider nicht! Falsch (Incorrect)'}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed italic">
              {currentQuestion.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
