import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, RotateCcw, Loader2, Sparkles } from "lucide-react";
import { generateGermanGrammarQuiz } from "../../services/geminiService";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function GrammarQuiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = async () => {
    setIsLoading(true);
    const newQuestions = await generateGermanGrammarQuiz(5);
    if (newQuestions && newQuestions.length > 0) {
      setQuestions(newQuestions);
      setCurrentStep(0);
      setSelectedOption(null);
      setIsFinished(false);
      setScore(0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

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
    }, 2000);
  };

  const restart = () => {
    fetchQuestions();
  };

  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-soft-gray flex flex-col items-center justify-center min-h-[400px] text-center">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <h3 className="text-xl font-bold text-accent">Generating Fresh Questions...</h3>
        <p className="text-gray-500 mt-2">Our AI is crafting a unique grammar quiz for you.</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-soft-gray text-center min-h-[400px] flex flex-col items-center justify-center">
        <p className="text-red-500 font-bold mb-4">Could not load quiz questions.</p>
        <button onClick={restart} className="btn-accent">Try Again</button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-soft-gray text-center shadow-sm">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} />
        </div>
        <h3 className="text-2xl font-bold text-accent mb-4">Quiz Finished!</h3>
        <div className="text-5xl font-extrabold text-primary mb-6">{score} / {questions.length}</div>
        <p className="text-gray-500 mb-8">Excellent effort! Ready for another unique challenge?</p>
        <button onClick={restart} className="btn-accent mx-auto flex items-center gap-2">
          <RotateCcw size={18} /> New AI Quiz
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
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter flex items-center gap-1">
            <Sparkles size={10} /> AI Dynamic Quiz
          </span>
        </div>
        <h3 className="text-2xl font-bold text-accent leading-tight">
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
                wasCorrectButNotSelected ? "border-primary/50 text-primary/70" :
                isSelected ? "border-accent bg-accent/10 text-accent" :
                "bg-white border-white hover:border-primary/30 text-gray-700 disabled:opacity-60"
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
            className={`mt-6 p-4 rounded-xl border ${selectedOption === currentQuestion.answer ? 'bg-primary/5 border-primary/20' : 'bg-red-50 border-red-100'}`}
          >
            <p className={`font-bold text-sm mb-1 ${selectedOption === currentQuestion.answer ? 'text-primary' : 'text-red-500'}`}>
              {selectedOption === currentQuestion.answer ? 'Richtig! (Correct)' : 'Falsch! (Incorrect)'}
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
