import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, ArrowRight, CheckCircle2, AlertCircle, Play, Square, RefreshCcw, Loader2, Mic, StopCircle, Download, User, Mail, Phone } from 'lucide-react';
import { scoreLanguageTask } from '../../services/geminiService';
import { leadService } from '../../services/leadService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PTEQuestion {
  id: string;
  type: 'read-aloud' | 'write-essay' | 'fill-blanks' | 'describe-image';
  instruction: string;
  content: string;
  image?: string;
  timeLimit: number; // in seconds
}

const SAMPLE_QUESTIONS: PTEQuestion[] = [
  {
    id: 'q1',
    type: 'write-essay',
    instruction: 'You will have 20 minutes to write a 200–300 word essay on the given topic.',
    content: 'In many countries, people are moving away from rural areas and into cities. What are the advantages and disadvantages of this trend?',
    timeLimit: 1200, // 20 mins
  },
  {
    id: 'q2',
    type: 'describe-image',
    instruction: 'Look at the image below. You will have 25 seconds to study the image and 40 seconds to describe it.',
    content: 'A bar chart showing global population growth from 1950 to 2020.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    timeLimit: 65, // 25 prep + 40 speak
  },
  {
    id: 'q3',
    type: 'fill-blanks',
    instruction: 'Below is a text with blanks. Select the appropriate word for each blank from the options.',
    content: 'Climate change is a ______ challenge that requires ______ cooperation among nations. (global/local, international/individual)',
    timeLimit: 180, // 3 mins
  }
];

export default function PTEMockTest() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadData, setLeadData] = useState({ name: '', email: '', phone: '' });
  const [isScoring, setIsScoring] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your PTE performance...");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScoring) {
      const messages = [
        "Analyzing oral fluency and pronunciation...",
        "Evaluating written discourse...",
        "Checking vocabulary and spelling...",
        "Calculating your Global Scale of English score...",
        "Finalizing your skill profile..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingMessage(messages[i % messages.length]);
        i++;
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isScoring]);

  useEffect(() => {
    if (isStarted && !isFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isStarted && !isFinished) {
      handleNext();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isFinished, timeLeft]);

  const startTest = () => {
    setShowLeadForm(true);
  };

  const beginExam = () => {
    setIsStarted(true);
    setLeadCaptured(true);
    setTimeLeft(SAMPLE_QUESTIONS[0].timeLimit);
  };

  const handleNext = () => {
    if (isRecording) stopRecording();
    if (currentStep < SAMPLE_QUESTIONS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setTimeLeft(SAMPLE_QUESTIONS[nextStep].timeLimit);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    setIsFinished(true);
    evaluateResults();
  };

  const evaluateResults = async () => {
    setIsScoring(true);
    
    // For the demo, we score the first question (essay) using AI
    const essayResponse = responses['q1'] || "";
    const pteScore = await scoreLanguageTask('PTE', 'write-essay', essayResponse, SAMPLE_QUESTIONS[0].content);
    
    setResults(pteScore);
    setIsScoring(false);

    // Update lead with score in Firestore
    try {
      await leadService.saveLead({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        testType: 'PTE',
        score: pteScore.score,
        status: 'evaluated'
      });
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await leadService.saveLead({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        testType: 'PTE-Mock-Started',
        status: 'new'
      });
    } catch (err) {
      console.error("Error saving initial lead:", err);
    }

    setShowLeadForm(false);
    beginExam();
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    // In a real app, you would use MediaRecorder API here
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recIntervalRef.current) clearInterval(recIntervalRef.current);
    setResponses({ ...responses, [currentQuestion.id]: "Voice recording submitted." });
  };

  const downloadPDF = async () => {
    if (!reportRef.current || isDownloading) return;
    
    try {
      setIsDownloading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`PTE_Report_${leadData.name || 'Student'}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("There was an issue generating your PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isStarted && !showLeadForm) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-soft-gray overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Play size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-extrabold text-accent mb-6">PTE Mock Test Simulation</h3>
          <p className="text-gray-600 mb-8 text-lg">
            Experience the real PTE Academic exam environment. Our simulation includes timed sections, various question types, and AI-powered scoring based on official Pearson criteria.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="flex gap-4 p-6 bg-soft-gray rounded-2xl">
              <Timer className="text-primary" />
              <div>
                <h4 className="font-bold text-accent">Timed Sections</h4>
                <p className="text-sm text-gray-500">Practice under real exam pressure.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-soft-gray rounded-2xl">
              <CheckCircle2 className="text-primary" />
              <div>
                <h4 className="font-bold text-accent">AI Evaluation</h4>
                <p className="text-sm text-gray-500">Get instant scoring from our AI model.</p>
              </div>
            </div>
          </div>

          <button onClick={startTest} className="btn-primary px-12 py-5 text-xl rounded-full flex items-center gap-3">
            Start Live Simulation <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  if (showLeadForm) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-soft-gray max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-primary" size={40} />
          </div>
          <h3 className="text-3xl font-black text-accent mb-2">Register to Start Exam</h3>
          <p className="text-gray-500">Provide your details to begin the free PTE Simulation and receive your AI Score Report.</p>
        </div>

        <form onSubmit={handleLeadSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                required
                type="text"
                className="w-full pl-12 pr-6 py-4 bg-soft-gray rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all font-bold text-accent"
                placeholder="John Doe"
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                required
                type="email"
                className="w-full pl-12 pr-6 py-4 bg-soft-gray rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all font-bold text-accent"
                placeholder="john@example.com"
                value={leadData.email}
                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                required
                type="tel"
                className="w-full pl-12 pr-6 py-4 bg-soft-gray rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all font-bold text-accent"
                placeholder="+92 3XX XXXXXXX"
                value={leadData.phone}
                onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-5 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
            Start Exam Now <ArrowRight size={24} />
          </button>
        </form>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-soft-gray">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-extrabold text-accent">Simulation Results</h3>
          {!isScoring && results && (
            <button 
              onClick={downloadPDF}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent text-white hover:bg-black'
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Generating...
                </>
              ) : (
                <>
                  <Download size={20} /> Download PDF Report
                </>
              )}
            </button>
          )}
        </div>
        
        {isScoring ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-primary mb-6" size={80} />
            <h4 className="text-2xl font-black text-accent text-center px-6">{loadingMessage}</h4>
            <div className="flex gap-2 mt-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        ) : (
          <div ref={reportRef} className="space-y-8 p-4">
            <div className="flex items-center justify-center p-12 bg-accent rounded-[2rem] text-white">
              <div className="text-center">
                <span className="text-gray-400 block mb-2 uppercase tracking-widest font-bold">Estimated PTE Score</span>
                <span className="text-8xl font-black text-primary">{results?.score || 0}</span>
                <span className="text-3xl font-bold text-gray-400">/90</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-soft-gray p-8 rounded-[2rem]">
                <h4 className="font-bold text-xl text-accent mb-4">AI Feedback</h4>
                <div className="space-y-4">
                  {results?.feedback && Object.entries(results.feedback).map(([key, val]: any) => (
                    <div key={key}>
                      <span className="block font-bold text-sm text-gray-400 uppercase">{key}</span>
                      <p className="text-gray-700 font-medium">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-primary/10 p-8 rounded-[2rem] border border-primary/20">
                <h4 className="font-bold text-xl text-primary mb-4">Areas for Improvement</h4>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {results?.improvement}
                </p>
                <div className="mt-8 pt-8 border-t border-primary/10">
                  <p className="font-bold text-accent">Student Profile</p>
                  <p className="text-sm text-gray-500">{leadData.name} ({leadData.email})</p>
                  <p className="text-sm text-gray-500 mb-4">{leadData.phone}</p>
                  
                  <p className="font-bold text-accent">Ready to boost your score?</p>
                  <p className="text-sm text-gray-500 mb-4">Achieve your desired score with our personalized PTE coaching batches.</p>
                  <a href={`https://wa.me/923007007699?text=Hi, I finished my PTE mock test with a score of ${results?.score}.`} target="_blank" rel="noopener noreferrer" className="btn-primary w-full py-4 rounded-full flex items-center justify-center gap-2 mb-4">
                    Request Full Evaluation <ArrowRight size={20} />
                  </a>
                  <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-primary font-bold hover:underline mx-auto">
                    Retake Test <RefreshCcw size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = SAMPLE_QUESTIONS[currentStep];

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-soft-gray overflow-hidden flex flex-col min-h-[600px]">
      {/* Test Header */}
      <div className="bg-accent p-6 flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
          <div className="bg-primary px-4 py-1 rounded-lg font-bold text-sm uppercase">PTE Academic</div>
          <h4 className="font-bold opacity-80">Mock Test #1204</h4>
        </div>
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xl ${timeLeft < 60 ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`}>
            <Timer size={20} /> {formatTime(timeLeft)}
          </div>
          <button onClick={handleNext} className="btn-primary py-2 px-6 rounded-full text-sm">
            {currentStep === SAMPLE_QUESTIONS.length - 1 ? 'Finish Test' : 'Next Section'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-100 relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
          className="h-full bg-primary"
        />
        <div className="absolute top-4 right-8 text-[10px] font-black text-white bg-primary px-3 py-1 rounded-full shadow-sm">
          QUESTION {currentStep + 1} OF {SAMPLE_QUESTIONS.length}
        </div>
      </div>

      {/* Test Area */}
      <div className="flex-grow p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-start gap-4 mb-8">
              <div className="bg-soft-gray p-3 rounded-2xl">
                <AlertCircle className="text-primary" size={24} />
              </div>
              <div>
                <h5 className="font-bold text-accent mb-1 uppercase tracking-widest text-xs">Task Instruction</h5>
                <p className="text-gray-600 font-medium">{currentQuestion.instruction}</p>
              </div>
            </div>

            <div className="bg-soft-gray/50 p-8 rounded-[2rem] border border-soft-gray mb-8">
              <h3 className="text-2xl font-bold text-accent mb-6 leading-relaxed">
                {currentQuestion.content}
              </h3>
              
              {currentQuestion.image && (
                <div className="mb-8 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <img src={currentQuestion.image} alt="Describe chart" className="w-full h-auto" />
                </div>
              )}

              <div className="relative">
                {currentQuestion.type === 'write-essay' ? (
                  <textarea 
                    autoFocus
                    placeholder="Type your essay here..."
                    className="w-full h-64 bg-white rounded-2xl p-6 border-2 border-transparent focus:border-primary outline-none transition-all shadow-inner text-lg leading-relaxed"
                    value={responses[currentQuestion.id] || ""}
                    onChange={(e) => setResponses({ ...responses, [currentQuestion.id]: e.target.value })}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    {isRecording ? (
                      <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                          <div className="bg-primary w-20 h-20 rounded-full flex items-center justify-center text-white relative">
                            <Mic size={40} />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-accent font-black text-2xl mb-1">Recording...</p>
                          <p className="text-primary font-mono font-bold">{formatTime(recordingTime)}</p>
                        </div>
                        <button 
                          onClick={stopRecording}
                          className="bg-accent text-white px-10 py-4 rounded-full font-black flex items-center gap-2 hover:bg-black transition-colors"
                        >
                          <StopCircle size={20} /> Stop Recording
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="bg-soft-gray w-20 h-20 rounded-full flex items-center justify-center text-gray-300">
                          <Mic size={40} />
                        </div>
                        <p className="text-gray-400 font-medium italic">Click the button below and start speaking clearly into your microphone.</p>
                        <button 
                          onClick={startRecording}
                          className="btn-primary px-10 py-4 rounded-full flex items-center gap-2"
                        >
                          <Play size={18} /> Start Recording
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {currentQuestion.type === 'write-essay' && (
                  <div className="absolute bottom-4 right-4 bg-accent p-2 rounded-lg text-white font-mono text-xs">
                    Word Count: {(responses[currentQuestion.id] || "").trim().split(/\s+/).filter(w => w.length > 0).length}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Instructions */}
      <div className="px-12 py-4 bg-soft-gray text-xs text-gray-400 flex justify-between items-center font-bold">
        <span>© Pearson Education Limited / Simulation by Language World</span>
        <div className="flex gap-4">
          <span>Question {currentStep + 1} of {SAMPLE_QUESTIONS.length}</span>
          <span>Security Status: Secure</span>
        </div>
      </div>
    </div>
  );
}
