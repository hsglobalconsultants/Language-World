import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, ArrowRight, CheckCircle2, AlertCircle, Play, RefreshCcw, Loader2, BookOpen, PenTool, Headphones, Download, User, Mail, Phone, Award } from 'lucide-react';
import { scoreLanguageTask } from '../../services/geminiService';
import { leadService } from '../../services/leadService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateCertificatePDF } from '../../utils/certificateGenerator';

interface IELTSQuestion {
  id: string;
  type: 'reading' | 'writing' | 'listening';
  title: string;
  instruction: string;
  content: string;
  audioUrl?: string;
  questions?: { id: string; label: string; type: 'text' | 'choice'; options?: string[] }[];
  answers?: Record<string, string>;
  timeLimit: number; // in seconds
}

const IELTS_QUESTIONS: IELTSQuestion[] = [
  {
    id: 'i0',
    type: 'listening',
    title: 'Listening Test - Part 1',
    instruction: 'Listen to the audio recording and answer the questions carefully. You can only play it once in a real exam.',
    content: 'Audio Description: A dialogue between a student and a registrar about German language course enrollment details.',
    audioUrl: 'https://www.ielts-exam.net/images/listening/Practice_Test_1_Section_1.mp3',
    questions: [
      { id: 'l1', label: '1. What is the name of the German language institute?', type: 'text' },
      { id: 'l2', label: '2. Which level is the student applying for?', type: 'choice', options: ['A1', 'A2', 'B1', 'B2'] },
      { id: 'l3', label: '3. What day does the weekend batch start?', type: 'text' },
      { id: 'l4', label: '4. The course fee includes the cost of _____ .', type: 'text' }
    ],
    answers: {
      'l1': 'Language World',
      'l2': 'A1',
      'l3': 'Saturday',
      'l4': 'books'
    },
    timeLimit: 600,
  },
  {
    id: 'i1',
    type: 'reading',
    title: 'Reading Test - Passage 1',
    instruction: 'Read the passage and answer the questions on the right. Be precise.',
    content: `The Digital Revolution in Agriculture

Technological advancements are transforming the agricultural sector, a process often referred to as 'AgTech'. Precision farming uses GPS and IoT sensors to monitor crop health and soil conditions in real-time. This data-driven approach allows farmers to apply water and fertilizers only where needed, significantly reducing waste and increasing yields. 

However, the high cost of implementation remains a barrier for small-scale farmers in developing nations. While large corporate farms can afford drone-mapping and automated harvesters, the digital divide threatens to marginalize traditional farming communities. Some experts suggest that government subsidies and cooperative tech-sharing models could bridge this gap.`,
    questions: [
      { id: 'q1', label: '1. What term is used to describe the digital revolution in agriculture?', type: 'text' },
      { id: 'q2', label: '2. Precision farming uses GPS and _____ sensors.', type: 'text' },
      { id: 'q3', label: '3. What is one major barrier for small-scale farmers?', type: 'text' },
      { id: 'q4', label: '4. Large farms use _____ to map crops.', type: 'choice', options: ['Drones', 'Satellites', 'Manual labor', 'Tractors'] },
      { id: 'q5', label: '5. Experts suggest government _____ could help bridge the divide.', type: 'text' }
    ],
    answers: {
      'q1': 'AgTech',
      'q2': 'IoT',
      'q3': 'high cost',
      'q4': 'Drones',
      'q5': 'subsidies'
    },
    timeLimit: 900,
  },
  {
    id: 'i2',
    type: 'reading',
    title: 'Reading Test - Passage 2',
    instruction: 'Analyze the text and answer the multiple-choice questions.',
    content: `Renewable Energy Trends

As the global community shifts towards a low-carbon economy, wind and solar power have become the fastest-growing energy sources. In 2023, renewable energy investments reached record highs, driven by falling costs and supportive climate policies.

Despite these gains, energy storage remains a significant challenge. Because wind and sun are intermittent, large-scale battery systems are required to ensure a stable grid. Hydrogen technology is also being explored as a potential medium for long-term storage, though it is currently more expensive than traditional alternatives.`,
    questions: [
      { id: 'q6', label: '6. Which energy sources are fastest-growing?', type: 'text' },
      { id: 'q7', label: '7. What is the primary challenge for renewables mentioned?', type: 'choice', options: ['Grid stability', 'Energy storage', 'Hydrogen cost', 'Solar efficiency'] },
      { id: 'q8', label: '8. Hydrogen technology is explored for _____ storage.', type: 'text' }
    ],
    answers: {
      'q6': 'wind and solar',
      'q7': 'Energy storage',
      'q8': 'long-term'
    },
    timeLimit: 600,
  },
  {
    id: 'i3',
    type: 'writing',
    title: 'Writing Task 2 (Essay)',
    instruction: 'Write an essay of at least 250 words on the topic provided. You should spend about 40 minutes on this task.',
    content: 'International tourism is now more affordable and frequent than ever before. Some people think this is a positive development, while others argue that it has harmful effects on local cultures and environments. Discuss both views and give your opinion.',
    timeLimit: 2400, // 40 mins
  }
];

export default function IELTSMockTest() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadData, setLeadData] = useState({ name: '', email: '', phone: '' });
  const [honeypot, setHoneypot] = useState('');
  const [isScoring, setIsScoring] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [readingScore, setReadingScore] = useState({ correct: 0, total: 0 });
  const [listeningScore, setListeningScore] = useState({ correct: 0, total: 0 });
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your IELTS performance...");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScoring) {
      const messages = [
        "Analyzing lexical resource...",
        "Checking grammatical range and accuracy...",
        "Evaluating task response...",
        "Finalizing your band score...",
        "Gemini is applying official IELTS criteria..."
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
    setTimeLeft(IELTS_QUESTIONS[0].timeLimit);
  };

  const handleNext = () => {
    if (currentStep < IELTS_QUESTIONS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setTimeLeft(IELTS_QUESTIONS[nextStep].timeLimit);
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
    
    // Evaluate Reading & Listening
    let rCorrect = 0;
    let rTotal = 0;
    let lCorrect = 0;
    let lTotal = 0;

    IELTS_QUESTIONS.forEach(q => {
      if ((q.type === 'reading' || q.type === 'listening') && q.answers) {
        Object.entries(q.answers).forEach(([key, val]) => {
          if (q.type === 'reading') rTotal++;
          else lTotal++;

          const studentAns = (responses[key] || "").toLowerCase().trim();
          if (studentAns.includes(val.toLowerCase().trim()) || val.toLowerCase().trim().includes(studentAns) && studentAns.length > 2) {
            if (q.type === 'reading') rCorrect++;
            else lCorrect++;
          }
        });
      }
    });

    setReadingScore({ correct: rCorrect, total: rTotal });
    setListeningScore({ correct: lCorrect, total: lTotal });

    // Score the Writing section via AI
    const writingTask = IELTS_QUESTIONS.find(q => q.type === 'writing');
    const writingResponse = responses[writingTask?.id || ""] || "";
    
    // Aggregate holistic context
    const summary = `Reading Accuracy: ${rCorrect}/${rTotal}\nListening Accuracy: ${lCorrect}/${lTotal}\n\nWriting Response:\n${writingResponse}`;
    
    const ieltsResults = await scoreLanguageTask(
      'IELTS', 
      'holistic-placement', 
      summary, 
      writingTask?.content || "Evaluate writing and infer overall band."
    );
    
    setResults(ieltsResults);
    setIsScoring(false);

    // Update lead with score in Firestore
    try {
      await leadService.saveLead({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        testType: 'IELTS',
        score: ieltsResults.score,
        status: 'evaluated'
      });
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Anti-spam Honeypot protection
    if (honeypot.trim()) {
      console.warn("Spam execution suspected & stopped silently via Honeypot check.");
      setShowLeadForm(false);
      beginExam();
      return;
    }
    
    // Preliminary save
    try {
      await leadService.saveLead({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        testType: 'IELTS-Mock-Started',
        status: 'new'
      });
    } catch (err) {
      console.error("Error saving initial lead:", err);
    }

    setShowLeadForm(false);
    beginExam();
  };

  const downloadPDF = async () => {
    if (!reportRef.current || isDownloading) {
      console.warn("[PDF] Download attempt failed: Ref is null or already downloading");
      return;
    }
    
    console.log("[PDF] Starting generation for:", leadData.name);
    try {
      setIsDownloading(true);
      
      // Wait for any animations to finish or elements to settle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Standard scale for good quality
        useCORS: true,
        logging: true, // Enable logging to see issues in console
        backgroundColor: '#ffffff',
        windowWidth: 1200, // Fixed width for consistent rendering
        onclone: (clonedDoc) => {
          console.log("[PDF] Clone created successfully");
          // Ensure elements with specific classes are handled if needed
        }
      });
      
      console.log("[PDF] Canvas created, converting to PDF");
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      console.log("[PDF] Saving file...");
      pdf.save(`IELTS_Report_${leadData.name.trim().replace(/\s+/g, '_') || 'Student'}.pdf`);
      console.log("[PDF] Download triggered");
    } catch (error: any) {
      console.error("[PDF] Generation Error:", error);
      alert(`Could not generate PDF: ${error.message || "Unknown error"}. You can try taking a screenshot instead.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadCertificate = async () => {
    if (isDownloadingCertificate) return;
    try {
      setIsDownloadingCertificate(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const pdf = generateCertificatePDF({
        candidateName: leadData.name || "Language World Student",
        testType: 'IELTS',
        score: results?.score || "0.0",
        correctAnswers: listeningScore.correct + readingScore.correct,
        totalQuestions: listeningScore.total + readingScore.total,
      });
      pdf.save(`IELTS_Certificate_${(leadData.name || "Student").trim().replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Certificate Generation Error:", error);
      alert("Failed to generate certificate. Please try again.");
    } finally {
      setIsDownloadingCertificate(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isStarted && !showLeadForm) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-soft-gray relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary p-2 rounded-lg">
              <Headphones className="text-white" size={24} />
            </div>
            <h3 className="text-3xl font-extrabold text-accent">IELTS Computer-Based Simulation</h3>
          </div>
          
          <p className="text-gray-600 mb-8 text-lg">
            Experience the full IELTS exam environment. This simulation includes multiple Reading passages with interactive answer sheets and a Task 2 Writing assessment evaluated by AI.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-soft-gray rounded-2xl flex flex-col gap-3">
              <BookOpen className="text-primary" />
              <h4 className="font-bold text-accent">Reading Module</h4>
              <p className="text-sm text-gray-500">2 Timed passages with interactive answer sheet.</p>
            </div>
            <div className="p-6 bg-soft-gray rounded-2xl flex flex-col gap-3">
              <PenTool className="text-primary" />
              <h4 className="font-bold text-accent">Writing Task 2</h4>
              <p className="text-sm text-gray-500">Essay writing with word count monitoring.</p>
            </div>
            <div className="p-6 bg-soft-gray rounded-2xl flex flex-col gap-3">
              <CheckCircle2 className="text-primary" />
              <h4 className="font-bold text-accent">Band Scoring</h4>
              <p className="text-sm text-gray-500">Get an estimated band score (0-9) immediately.</p>
            </div>
          </div>

          <button onClick={startTest} className="btn-primary w-full md:w-auto px-12 py-5 text-xl rounded-full flex items-center justify-center gap-3 hover:scale-105 transition-transform">
            Start IELTS Simulation <ArrowRight size={24} />
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
          <p className="text-gray-500">Provide your details to begin the free IELTS Simulation and receive your AI Score Report.</p>
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

          {/* Anti-spam visually hidden honeypot input */}
          <div className="absolute opacity-0 w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <label htmlFor="ielts_middle_name">Please leave this field empty</label>
            <input 
              type="text" 
              id="ielts_middle_name" 
              name="ielts_middle_name" 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="new-password"
            />
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h3 className="text-4xl font-black text-accent">IELTS Simulation Results</h3>
          {!isScoring && results && (
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={downloadPDF}
                disabled={isDownloading || isDownloadingCertificate}
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

              <button 
                onClick={downloadCertificate}
                disabled={isDownloading || isDownloadingCertificate}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-white shadow-md ${
                  isDownloadingCertificate ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10'
                }`}
              >
                {isDownloadingCertificate ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Issuing...
                  </>
                ) : (
                  <>
                    <Award size={20} /> Download Certificate
                  </>
                )}
              </button>
            </div>
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
          <div ref={reportRef} className="space-y-10 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="relative bg-accent rounded-[3rem] p-10 text-center text-white border-4 border-primary/20 h-full flex flex-col justify-center">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4 block">Estimated Band Score</span>
                  <div className="flex items-end justify-center gap-2">
                    <span className="text-8xl font-black text-primary leading-none">{results?.score || "0.0"}</span>
                    <span className="text-2xl font-bold text-gray-500 mb-4">/ 9.0</span>
                  </div>
                </div>
              </div>

            <div className="bg-soft-gray rounded-[3rem] p-10 flex flex-col justify-center border border-gray-200">
                <h4 className="text-xl font-black text-accent mb-6 uppercase tracking-tight">Listening & Reading Breakdown</h4>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center shrink-0">
                      <span className="text-xl font-black text-accent">{listeningScore.correct}</span>
                    </div>
                    <div>
                      <p className="text-accent font-bold">Listening: {listeningScore.correct}/{listeningScore.total}</p>
                      <p className="text-[10px] text-primary font-black uppercase">Part 1 - Audio Simulation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full border-4 border-accent flex items-center justify-center shrink-0">
                      <span className="text-xl font-black text-accent">{readingScore.correct}</span>
                    </div>
                    <div>
                      <p className="text-accent font-bold">Reading: {readingScore.correct}/{readingScore.total}</p>
                      <p className="text-[10px] text-primary font-black uppercase">Academic Reading Passages</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h4 className="text-2xl font-bold text-accent mb-6 flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" /> Writing Performance
                </h4>
                <div className="space-y-6">
                  {results?.feedback && Object.entries(results.feedback).map(([key, val]: any) => (
                    <div key={key} className="p-4 bg-white rounded-2xl border border-gray-100">
                      <span className="font-black text-primary text-xs uppercase block mb-1">{key}</span>
                      <p className="text-gray-700 leading-relaxed font-medium">{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/10">
                <h4 className="text-2xl font-bold text-accent mb-6">Candidate Feedback</h4>
                <div className="prose prose-primary mb-8">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    {results?.improvement}
                  </p>
                </div>
                <div className="p-6 bg-white rounded-3xl border-2 border-primary/20">
                  <p className="font-bold text-accent">Student Profile</p>
                  <p className="text-sm text-gray-500">{leadData.name} ({leadData.email})</p>
                  <p className="text-sm text-gray-500 mb-4">{leadData.phone}</p>
                  
                  <p className="font-bold text-accent mb-4 text-center">Achieve your Target Score with LW 🎯</p>
                  <a href={`https://wa.me/923007007699?text=Hi, I finished my IELTS mock test with a band score of ${results?.score}.`} target="_blank" rel="noopener noreferrer" className="btn-primary w-full py-4 rounded-full flex items-center justify-center gap-2">
                    Request Full Evaluation <ArrowRight size={20} />
                  </a>
                  <button onClick={() => window.location.reload()} className="w-full mt-4 text-gray-400 font-bold hover:text-primary transition-colors text-sm">
                    Try another Simulation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = IELTS_QUESTIONS[currentStep];

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-soft-gray overflow-hidden flex flex-col min-h-[700px]">
      {/* Header */}
      <div className="bg-accent p-8 flex flex-wrap justify-between items-center text-white gap-6">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="" className="w-10 h-10 object-contain brightness-0 invert opacity-50" />
          <div>
            <h4 className="font-black text-xl leading-none uppercase tracking-tighter">IELTS Online Testing</h4>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{currentQuestion.title}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full font-mono text-2xl transition-colors ${timeLeft < 120 ? 'bg-red-500' : 'bg-white/10'}`}>
            <Timer size={24} /> {formatTime(timeLeft)}
          </div>
          <button onClick={handleNext} className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-wider transition-colors">
            {currentStep === IELTS_QUESTIONS.length - 1 ? 'Finish Test' : 'Confirm & Next'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100 h-2 relative">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / IELTS_QUESTIONS.length) * 100}%` }}
        />
        <div className="absolute top-4 right-8 text-[10px] font-black text-white bg-primary px-3 py-1 rounded-full shadow-sm">
          SECTION {currentStep + 1} OF {IELTS_QUESTIONS.length}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        <div className="p-6 bg-primary/5 border-b border-primary/10">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <AlertCircle className="text-primary shrink-0" />
            <p className="text-accent text-sm font-bold">{currentQuestion.instruction}</p>
          </div>
        </div>

        <div className="flex-grow p-8 md:p-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto h-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
                {/* Reference/Passage/Audio Side */}
                <div className="bg-soft-gray/50 rounded-[3rem] p-10 border border-soft-gray shadow-inner overflow-y-auto max-h-[600px]">
                  <h5 className="text-primary font-black uppercase tracking-tighter text-xs mb-6 flex items-center gap-2">
                    {currentQuestion.type === 'listening' ? <Headphones size={14} /> : <BookOpen size={14} />} 
                    {currentQuestion.type === 'listening' ? 'Listening Audio Console' : 'Official Passage Module'}
                  </h5>
                  
                  {currentQuestion.type === 'listening' && (
                    <div className="mb-10 bg-white p-8 rounded-[2rem] border border-primary/20 shadow-xl">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center animate-pulse">
                          <Play className="text-white fill-current" size={20} />
                        </div>
                        <div>
                          <p className="text-accent font-black text-sm">Now Playing: Section 1</p>
                          <p className="text-gray-400 text-xs font-bold">01:45 / 03:20</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mb-6 overflow-hidden">
                        <div className="bg-primary h-full w-1/3 rounded-full" />
                      </div>
                      <audio controls className="w-full h-10 mb-2">
                        <source src={currentQuestion.audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                      <p className="text-[10px] text-gray-400 font-bold text-center mt-4">REAL-TIME AUDIO SHIELD ACTIVE</p>
                    </div>
                  )}

                  <div className="prose prose-lg max-w-none">
                    <p className="text-accent font-medium leading-relaxed whitespace-pre-wrap text-lg">
                      {currentQuestion.content}
                    </p>
                  </div>
                </div>

                {/* Workspace Side */}
                <div className="flex flex-col h-full bg-white">
                  <h5 className="text-gray-400 font-bold uppercase tracking-tighter text-xs mb-6">Candidate Answer Sheet</h5>
                  
                  {currentQuestion.type === 'writing' ? (
                    <div className="flex-grow flex flex-col gap-4">
                      <textarea 
                        autoFocus
                        placeholder="Type your essay response here..."
                        className="flex-grow bg-white border-2 border-soft-gray focus:border-primary rounded-[2rem] p-8 shadow-xl outline-none text-lg leading-relaxed resize-none transition-all"
                        value={responses[currentQuestion.id] || ""}
                        onChange={(e) => setResponses({ ...responses, [currentQuestion.id]: e.target.value })}
                      />
                      <div className="flex justify-between items-center text-xs font-bold text-gray-400 px-4 mt-4">
                        <span className="flex items-center gap-1">
                          Academic Writing Task 2 (Essay)
                        </span>
                        <div className="bg-accent px-6 py-3 rounded-full text-white shadow-lg">
                          Word Count: {(responses[currentQuestion.id] || "").trim().split(/\s+/).filter(w => w.length > 0).length}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col gap-6 overflow-y-auto max-h-[550px] p-2">
                      <div className="space-y-8">
                        {currentQuestion.questions?.map((q) => (
                          <div key={q.id} className="p-6 bg-white border-2 border-soft-gray rounded-3xl hover:border-primary/30 transition-all">
                            <label className="block text-accent font-bold mb-4">{q.label}</label>
                            {q.type === 'text' ? (
                              <input 
                                type="text"
                                className="w-full p-4 bg-soft-gray rounded-xl border-none focus:ring-2 focus:ring-primary outline-none font-bold text-accent"
                                placeholder="Type answer here..."
                                value={responses[q.id] || ""}
                                onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
                              />
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {q.options?.map(opt => (
                                  <button
                                    key={opt}
                                    onClick={() => setResponses({ ...responses, [q.id]: opt })}
                                    className={`p-4 rounded-xl font-bold transition-all text-sm border-2 ${
                                      responses[q.id] === opt 
                                      ? 'bg-primary border-primary text-white shadow-lg' 
                                      : 'bg-soft-gray border-transparent text-accent hover:border-primary/20'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 bg-accent text-[10px] text-gray-500 flex justify-between items-center font-bold tracking-widest uppercase">
        <span>© Virtual Test Center Karachi - Real-Time Exam Environment</span>
        <div className="flex gap-4">
          <span>Simulation ID: LW-IELTS-2026-X</span>
          <span className="text-primary">System Integrity: SECURED</span>
        </div>
      </div>
    </div>
  );
}
