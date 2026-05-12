import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, ArrowRight, CheckCircle2, AlertCircle, Play, RefreshCcw, Loader2, BookOpen, PenTool, Languages, Download, User, Mail, Phone } from 'lucide-react';
import { scoreLanguageTask } from '../../services/geminiService';
import { leadService } from '../../services/leadService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface GermanQuestion {
  id: string;
  type: 'reading' | 'writing' | 'grammar' | 'vocabulary' | 'speaking';
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;
  instruction: string;
  content: string;
  topic?: string;
  grammarRule?: string;
  exampleAnswer?: string;
  options?: string[];
  timeLimit: number; // in seconds
}

const GERMAN_QUESTIONS: GermanQuestion[] = [
  {
    id: 'g1',
    type: 'reading',
    level: 'A1',
    title: 'Leseverstehen (Reading)',
    topic: 'Sich vorstellen (Introducing oneself)',
    instruction: 'Lesen Sie den Text und verstehen Sie die Hauptpunkte. (Read the text and understand the main points.)',
    content: 'Hallo! Ich heiße Markus und ich komme aus Berlin. Ich bin 25 Jahre alt und arbeite als Lehrer. In meiner Freizeit spiele ich gerne Fußball und höre Musik.',
    grammarRule: 'Present tense (Präsens) of regular and irregular verbs.',
    exampleAnswer: 'Markus ist Lehrer und kommt aus Berlin.',
    timeLimit: 600,
  },
  {
    id: 'g2',
    type: 'grammar',
    level: 'A1',
    title: 'Grammatik (Grammar)',
    topic: 'Verben im Präsens (Verbs in present tense)',
    instruction: 'Wählen Sie die richtige Form von "sein". (Choose the correct form of "to be".)',
    content: 'Woher ______ du? - Ich komme aus Karachi.',
    grammarRule: 'Conjugation of the auxiliary verb "sein" (bist for 2nd person singular).',
    exampleAnswer: 'bist',
    options: ['bin', 'bist', 'ist', 'sind'],
    timeLimit: 60,
  },
  {
    id: 'g3',
    type: 'vocabulary',
    level: 'A2',
    title: 'Wortschatz (Vocabulary)',
    topic: 'Einkaufen und Essen (Shopping and Food)',
    instruction: 'Welches Wort passt in die Lücke? (Which word fits in the blank?)',
    content: 'Ich möchte ein ______ kaufen. Ich habe Hunger.',
    grammarRule: 'Noun gender (Das Brötchen) and accusative case usage.',
    exampleAnswer: 'Brötchen',
    options: ['Auto', 'Brötchen', 'Fahrrad', 'Buch'],
    timeLimit: 60,
  },
  {
    id: 'g4',
    type: 'writing',
    level: 'A2',
    title: 'Schriftlicher Ausdruck (Writing)',
    topic: 'Einladung (Invitation)',
    instruction: 'Schreiben Sie eine E-Mail an einen Freund (ca. 40-50 Wörter). (Write an email to a friend, approx. 40-50 words.)',
    content: 'Thema: Laden Sie Ihren Freund zu einer Geburtstagsparty am Samstagabend ein. Sagen Sie: Wann und wo ist die Party?',
    grammarRule: 'Sentence structure in emails, modal verbs for invitations, and prepositional phrases for time/location.',
    exampleAnswer: 'Lieber Max, ich lade dich herzlich zu meiner Geburtstagsparty ein! Die Party ist am Samstag um 20 Uhr bei mir zu Hause. Ich freue mich auf dein Kommen! Viele Grüße, [Dein Name]',
    timeLimit: 900,
  },
  {
    id: 'g5',
    type: 'speaking',
    level: 'B1',
    title: 'Mündlicher Ausdruck (Speaking Simulation)',
    topic: 'Wohnen und Träume (Housing and Dreams)',
    instruction: 'Beschreiben Sie Ihr Traumhaus. (Describe your dream house. Input your spoken response as text for evaluation.)',
    content: 'Wo möchten Sie wohnen? Wie sieht das Haus aus? Warum gefällt es Ihnen?',
    grammarRule: 'Subjunctive II (Konjunktiv II) for wishes ("Ich würde gerne..."), and descriptive adjectives with correct declension.',
    exampleAnswer: 'Mein Traumhaus stünde am Meer. Es hätte viele große Fenster und einen modernen Garten. Ich würde dort gerne mit meiner Familie leben, weil die Aussicht wunderschön ist.',
    timeLimit: 120,
  }
];

export default function GermanMockTest() {
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
  const [loadingMessage, setLoadingMessage] = useState("Auswertung wird durchgeführt...");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScoring) {
      const messages = [
        "Wortschatz wird analysiert...",
        "Grammatikprüfung wird durchgeführt...",
        "CEFR-Niveau wird ermittelt...",
        "Ergebnisse werden finalisiert...",
        "Gemini wendet offizielle Standards an..."
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
    setTimeLeft(GERMAN_QUESTIONS[0].timeLimit);
  };

  const handleNext = () => {
    if (currentStep < GERMAN_QUESTIONS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setTimeLeft(GERMAN_QUESTIONS[nextStep].timeLimit);
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
    
    // Aggregate responses for a holistic evaluation
    const summary = GERMAN_QUESTIONS.map(q => {
      return `Task: ${q.title} (${q.type})\nPrompt: ${q.content}\nStudent Response: ${responses[q.id] || "No response"}`;
    }).join('\n\n---\n\n');

    const germanResults = await scoreLanguageTask('GERMAN', 'holistic-placement', summary, "Evaluate the overall CEFR level based on these varied tasks.");
    
    setResults(germanResults);
    setIsScoring(false);

    // Update lead with score in Firestore
    try {
      await leadService.saveLead({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        testType: 'German',
        score: germanResults.score,
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
        testType: 'German-Mock-Started',
        status: 'new'
      });
    } catch (err) {
      console.error("Error saving initial lead:", err);
    }

    setShowLeadForm(false);
    beginExam();
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
      pdf.save(`German_Report_${leadData.name || 'Student'}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Es gab ein Problem beim Erstellen Ihres PDFs. Bitte versuchen Sie es erneut.");
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
      <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-soft-gray relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary p-2 rounded-lg">
              <Languages className="text-white" size={24} />
            </div>
            <h3 className="text-3xl font-extrabold text-accent">German Proficiency Diagnostic</h3>
          </div>
          
          <p className="text-gray-600 mb-8 text-lg">
            Not sure which level to join? Take our quick diagnostic test to evaluate your current German proficiency according to the CEFR (A1-C1) standards.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-soft-gray rounded-2xl flex flex-col gap-3">
              <BookOpen className="text-primary" />
              <h4 className="font-bold text-accent">Reading (A1/A2)</h4>
              <p className="text-sm text-gray-500">Test your comprehension of everyday German texts.</p>
            </div>
            <div className="p-6 bg-soft-gray rounded-2xl flex flex-col gap-3">
              <PenTool className="text-primary" />
              <h4 className="font-bold text-accent">Writing (A2/B1)</h4>
              <p className="text-sm text-gray-500">Compose a short text/email for AI evaluation.</p>
            </div>
            <div className="p-6 bg-soft-gray rounded-2xl flex flex-col gap-3">
              <CheckCircle2 className="text-primary" />
              <h4 className="font-bold text-accent">Instant Level</h4>
              <p className="text-sm text-gray-500">Receive an estimated CEFR level placement.</p>
            </div>
          </div>

          <button onClick={startTest} className="btn-primary w-full md:w-auto px-12 py-5 text-xl rounded-full flex items-center justify-center gap-3 hover:scale-105 transition-transform bg-[#FFCE00] hover:bg-[#FFCE00]/90 text-black border-none">
            Begin German Assessment <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  if (showLeadForm) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-soft-gray max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="bg-[#FFCE00]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-[#CC0000]" size={40} />
          </div>
          <h3 className="text-3xl font-black text-accent mb-2">Register to Start Assessment</h3>
          <p className="text-gray-500">Please provide your details to begin the free German Proficiency Diagnostic and receive your AI Report.</p>
        </div>

        <form onSubmit={handleLeadSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                required
                type="text"
                className="w-full pl-12 pr-6 py-4 bg-soft-gray rounded-2xl border-2 border-transparent focus:border-[#FFCE00] outline-none transition-all font-bold text-accent"
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
                className="w-full pl-12 pr-6 py-4 bg-soft-gray rounded-2xl border-2 border-transparent focus:border-[#FFCE00] outline-none transition-all font-bold text-accent"
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
                className="w-full pl-12 pr-6 py-4 bg-soft-gray rounded-2xl border-2 border-transparent focus:border-[#FFCE00] outline-none transition-all font-bold text-accent"
                placeholder="+92 3XX XXXXXXX"
                value={leadData.phone}
                onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="w-full py-5 rounded-2xl text-xl font-black shadow-xl bg-black text-white hover:bg-black/90 transition-all flex items-center justify-center gap-3">
            Start Assessment Now <ArrowRight size={24} />
          </button>
        </form>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-soft-gray">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-4xl font-black text-accent">Einstufungsergebnis</h3>
          {!isScoring && results && (
            <button 
              onClick={downloadPDF}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Wird erstellt...
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
              <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        ) : (
          <div ref={reportRef} className="space-y-10 p-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#FFCE00] blur-2xl opacity-10" />
              <div className="relative bg-accent rounded-[3rem] p-12 text-center text-white border-4 border-[#FFCE00]/30">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4 block">Recommended Level</span>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-32 h-1 bg-white/20 hidden md:block" />
                  <span className="text-9xl font-black text-[#FFCE00] leading-none">{results?.score || "..."}</span>
                  <div className="w-32 h-1 bg-white/20 hidden md:block" />
                </div>
                <p className="mt-6 text-xl font-medium text-gray-300">Target Level: {results?.score === 'A1' ? 'A2' : 'B1'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h4 className="text-2xl font-bold text-accent mb-6">Detailliertes Feedback</h4>
                <div className="space-y-6">
                  {results?.feedback && Object.entries(results.feedback).map(([key, val]: any) => (
                    <div key={key} className="p-4 bg-white rounded-2xl border-l-4 border-[#FFCE00] border border-gray-100">
                      <span className="font-black text-accent text-xs uppercase block mb-1">{key}</span>
                      <p className="text-gray-700 leading-relaxed font-medium">{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FFCE00]/5 p-10 rounded-[2.5rem] border border-[#FFCE00]/10">
                <h4 className="text-2xl font-bold text-accent mb-6">Verbesserungsvorschläge</h4>
                <div className="prose prose-primary mb-8">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    {results?.improvement}
                  </p>
                </div>
                <div className="p-6 bg-white rounded-3xl border-2 border-[#FFCE00]/20">
                  <p className="font-bold text-accent">Student Profile</p>
                  <p className="text-sm text-gray-500">{leadData.name} ({leadData.email})</p>
                  <p className="text-sm text-gray-500 mb-4">{leadData.phone}</p>
                  
                  <p className="font-bold text-accent mb-4 text-center">Ready to master German? 🇩🇪</p>
                  <a href={`https://wa.me/923007007699?text=Hi, I finished my German level test and got ${results?.score}. I'd like to book my seat in the next batch.`} target="_blank" rel="noopener noreferrer" className="btn-primary w-full py-4 rounded-full flex items-center justify-center gap-2 bg-black hover:bg-black/90 text-white border-none transition-all">
                    Talk to our German Expert <ArrowRight size={20} />
                  </a>
                  <button onClick={() => window.location.reload()} className="w-full mt-4 text-gray-400 font-bold hover:text-accent transition-colors text-sm">
                    Re-take Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = GERMAN_QUESTIONS[currentStep];

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-soft-gray overflow-hidden flex flex-col min-h-[700px]">
      {/* Header */}
      <div className="bg-accent p-8 flex flex-wrap justify-between items-center text-white gap-6">
        <div className="flex items-center gap-4">
          <div className="flex w-10 h-6 flex-col">
            <div className="bg-black h-1/3 w-full" />
            <div className="bg-red-500 h-1/3 w-full" />
            <div className="bg-yellow-400 h-1/3 w-full" />
          </div>
          <div>
            <h4 className="font-black text-xl leading-none">GERMAN DIAGNOSTIC</h4>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{currentQuestion.title}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full font-mono text-2xl transition-colors ${timeLeft < 120 ? 'bg-red-500' : 'bg-white/10'}`}>
            <Timer size={24} /> {formatTime(timeLeft)}
          </div>
          <button onClick={handleNext} className="bg-[#FFCE00] text-black px-8 py-3 rounded-full font-black text-sm uppercase tracking-wider transition-colors hover:scale-105 active:scale-95">
            {currentStep === GERMAN_QUESTIONS.length - 1 ? 'Beenden' : 'Weiter (Next)'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100 h-2 relative">
        <motion.div 
          className="h-full bg-[#FFCE00]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / GERMAN_QUESTIONS.length) * 100}%` }}
        />
        <div className="absolute top-4 right-8 text-[10px] font-black text-accent bg-yellow-400 px-3 py-1 rounded-full shadow-sm">
          AUFGABE {currentStep + 1} VON {GERMAN_QUESTIONS.length}
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <div className="p-6 bg-yellow-50 border-b border-yellow-100">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <AlertCircle className="text-[#CC0000] shrink-0" />
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
              className="max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-soft-gray/50 rounded-[2rem] p-8 border border-soft-gray shadow-inner flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <h5 className="text-gray-400 font-bold uppercase tracking-tighter text-xs">Text / Aufgabe (Prompt)</h5>
                    {currentQuestion.topic && (
                      <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase">
                        Thema: {currentQuestion.topic}
                      </span>
                    )}
                  </div>
                  <div className="prose prose-lg max-w-none flex-grow">
                    <p className="text-accent font-medium leading-relaxed whitespace-pre-wrap mb-8">
                      {currentQuestion.content}
                    </p>
                  </div>
                  
                  <div className="space-y-4 mt-auto">
                    {currentQuestion.grammarRule && (
                      <div className="p-4 bg-white/50 rounded-2xl border border-gray-200">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Grammatik-Schwerpunkt (Focus)</p>
                        <p className="text-xs text-gray-500">{currentQuestion.grammarRule}</p>
                      </div>
                    )}
                    
                    {currentQuestion.exampleAnswer && (
                      <div className="group">
                        <button 
                          className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:opacity-80 transition-opacity"
                          onClick={() => {
                            const el = document.getElementById(`example-${currentQuestion.id}`);
                            if (el) el.classList.toggle('hidden');
                          }}
                        >
                          Beispielantwort anzeigen (Show Example Answer) <Play size={10} className="rotate-90" />
                        </button>
                        <div id={`example-${currentQuestion.id}`} className="hidden mt-2 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                          <p className="text-xs text-primary italic font-medium">{currentQuestion.exampleAnswer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <h5 className="text-gray-400 font-bold uppercase tracking-tighter text-xs mb-4">Ihre Antwort (Your Answer)</h5>
                  {(currentQuestion.type === 'writing' || currentQuestion.type === 'speaking') ? (
                    <div className="flex-grow flex flex-col gap-4 min-h-[300px]">
                      <textarea 
                        autoFocus
                        placeholder={currentQuestion.type === 'speaking' ? "Type what you would say..." : "Schreiben Sie hier..."}
                        className="flex-grow bg-white border-2 border-transparent focus:border-[#FFCE00] rounded-[2rem] p-8 shadow-xl outline-none text-lg leading-relaxed resize-none transition-all"
                        value={responses[currentQuestion.id] || ""}
                        onChange={(e) => setResponses({ ...responses, [currentQuestion.id]: e.target.value })}
                      />
                      <div className="flex justify-between items-center text-xs font-bold text-gray-400 px-4">
                        <span>Anzahl der Wörter: {(responses[currentQuestion.id] || "").trim().split(/\s+/).filter(w => w.length > 0).length}</span>
                        <div className="bg-accent px-4 py-2 rounded-lg text-white uppercase">{currentQuestion.type} LEVEL: {currentQuestion.level}</div>
                      </div>
                    </div>
                  ) : currentQuestion.type === 'grammar' || currentQuestion.type === 'vocabulary' ? (
                    <div className="grid grid-cols-1 gap-4">
                      {currentQuestion.options?.map((option) => (
                        <button
                          key={option}
                          onClick={() => setResponses({ ...responses, [currentQuestion.id]: option })}
                          className={`p-6 rounded-2xl border-2 text-left font-bold transition-all ${
                            responses[currentQuestion.id] === option 
                            ? 'bg-[#FFCE00] border-[#FFCE00] text-black shadow-lg scale-[1.02]' 
                            : 'bg-white border-gray-100 text-accent hover:border-[#FFCE00]/50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center">
                      <BookOpen size={64} className="text-gray-200 mb-4" />
                      <p className="text-gray-500 font-medium mb-6">Für das Leseverstehen analysieren Sie bitte den Text links.</p>
                      <button onClick={handleNext} className="btn-outline px-8 py-3 rounded-full hover:bg-[#FFCE00] hover:text-black border-[#FFCE00] text-accent">
                        Nächste Aufgabe (Next Task)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 bg-accent text-[10px] text-gray-500 flex justify-between items-center font-bold tracking-widest uppercase">
        <span>© Language World Karachi - German Department</span>
        <div className="flex gap-4">
          <span>Stufe: {currentQuestion.level}</span>
          <span>Status: Aktiv</span>
        </div>
      </div>
    </div>
  );
}
