import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  Ear, 
  PenTool, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Play, 
  Pause, 
  Square, 
  Volume2, 
  RefreshCw,
  Info,
  ChevronRight,
  Shield, 
  Calendar,
  Layers,
  FileCheck,
  ArrowRight,
  Award as DiplomaIcon,
  HelpCircle as QuestionIcon,
  Mic,
  StopCircle
} from "lucide-react";
import Markdown from "react-markdown";

interface Question {
  id: number;
  type: "multiple-choice" | "fill-blank";
  question: string;
  options: string[] | null;
  answer: string;
  explanation: string;
}

interface TestData {
  title: string;
  theme: string;
  reading: {
    passage: string;
    questions: Question[];
  };
  listening: {
    scenario: string;
    transcript: string;
    questions: Question[];
  };
  writing: {
    task1Prompt: string;
    task1Advice: string;
    task2Prompt: string;
    task2Advice: string;
  };
  speaking?: {
    readAloudPrompt: string;
    describeImagePrompt: string;
  };
}

interface SpeakingEvaluation {
  overallScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  contentScore: number;
  feedback: string;
  tips: string;
  modelSpeech: string;
}

// Default Standard Practice Test
const DEFAULT_TEST: TestData = {
  title: "Global Eco-Infrastructure & Sustainable Transit",
  theme: "Technological systems engineering for carbon-neutral smart cities.",
  reading: {
    passage: "The rapid migration of global populations towards urban and suburban spaces has triggered novel inquiries in architectural frameworks. Historically, urban structures were devised with high centralization, causing severe traffic congestion, industrial heat traps, and dangerous atmospheric particulate buildup in valley areas. Today, modern structural planners prioritize decentralization and passive thermodynamics inside high-density residential towers. Innovations like passive vertical forestry and micro-textured solar canopy tiles serve not only as aesthetic enrichments but as active, functional thermo-insulating systems. For example, vertical gardens integrated directly into outer building envelopes play a key role in moderating localized microclimates, lowering internal apartment temperatures by up to five degrees Celsius. This structural buffer significantly reduces the seasonal dependencies on artificial carbon-heavy air-cooling appliances. In parallel, smart public transport corridors, such as high-efficiency electric light rails, are taking design precedence over expanding multi-lane private highways, establishing a standard centered strictly on mass public transit with zero localized emissions.",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "What is the primary thermodynamic benefit of localized vertical gardens stated in the passage?",
        options: [
          "They replace the need for sustainable solar canopy tiles.",
          "They moderate building temperatures, lowering air-cooling energy dependencies.",
          "They eliminate structural valley design constraints entirely.",
          "They decrease building construction materials and height boundaries."
        ],
        answer: "They moderate building temperatures, lowering air-cooling energy dependencies.",
        explanation: "The passage notes that integrated vertical gardens 'play a key role in moderating localized microclimates, lowering internal apartment temperatures by up to five degrees', thereby significantly reducing dependency on artificial cooling."
      },
      {
        id: 2,
        type: "multiple-choice",
        question: "According to paragraph 1, traditional highly centralized urban centers created:",
        options: [
          "Zero-emission micro-grids and modern forestry lines.",
          "Traffic congestion, localized heat traps, and toxic particulate buildup.",
          "Passive multi-lane highways for electric light rails.",
          "Enhanced microclimates within valley communities."
        ],
        answer: "Traffic congestion, localized heat traps, and toxic particulate buildup.",
        explanation: "The passage explicitly names 'severe traffic congestion, industrial heat traps, and dangerous atmospheric particulate buildup' as consequences of historical centralization."
      },
      {
        id: 3,
        type: "fill-blank",
        question: "Complete this statement (single word): Modern planners prioritize vertical gardens and high-efficiency electric light ________ rather than expanding multi-lane highways.",
        options: null,
        answer: "rails",
        explanation: "The passage mentions 'high-efficiency electric light rails' being prioritized over traditional private highways."
      }
    ]
  },
  listening: {
    scenario: "An IELTS Counselor at Language World Karachi describes writing guidelines and target scores.",
    transcript: "Advisor Sarah: Hello and welcome back to the Language World Karachi Success portal. Let's map your IELTS preparation. Ahmed: Hi Sarah, thank you for guiding me. I have a question regarding our weekly academic essay submissions. Advisor Sarah: Perfect. All practice essays must be submitted by Friday evening at exactly eight PM, PST. If you miss this frame, our AI evaluation dashboard won't process your grades in time for Saturday's module discussion. Ahmed: Got it. What are the word constraints for Task 1 and Task 2? Advisor Sarah: IELTS Task 1 requires a minimum of one hundred and fifty words, where you'll describe charts or systems. Task 2 requires a minimum of two hundred and fifty words. Submitting essays below these targets results in a direct penalty on your Lexical Resource evaluation score, which measures vocabulary diversity. Try to write clearly and logically.",
    questions: [
      {
        id: 4,
        type: "multiple-choice",
        question: "When is the weekly submission deadline for academic draft essays?",
        options: [
          "Friday at exactly 5:00 PM PST",
          "Friday at exactly 8:00 PM PST",
          "Saturday morning at 9:00 AM PST",
          "Sunday evening PST"
        ],
        answer: "Friday at exactly 8:00 PM PST",
        explanation: "Advisor Sarah states that essays 'must be submitted by Friday evening at exactly eight PM, PST'."
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "What minimum word counts does Advisor Sarah specify for IELTS Task 1 and Task 2?",
        options: [
          "120 words for Task 1, 200 words for Task 2",
          "150 words for Task 1, 220 words for Task 2",
          "150 words for Task 1, 250 words for Task 2",
          "200 words for Task 1, 300 words for Task 2"
        ],
        answer: "150 words for Task 1, 250 words for Task 2",
        explanation: "In the discussion, Task 1 requires 'a minimum of one hundred and fifty words' and Task 2 'a minimum of two hundred and fifty words'."
      },
      {
        id: 6,
        type: "fill-blank",
        question: "Complete the statement (single word): Writing below the prescribed target lengths results in a penalty on the ________ resource evaluation band standard.",
        options: null,
        answer: "lexical",
        explanation: "Sarah warns that dropping under word counts 'results in a direct penalty on your Lexical Resource evaluation score'."
      }
    ]
  },
  writing: {
    task1Prompt: "The provided academic layout describes changes in centralized transport networks spanning 2010 to 2026. Summarize the information by selecting and reporting the main features, comparing traditional road structures against high-speed rail lines.",
    task1Advice: "Start with an introduction paraphrasing the prompt. Write an overview paragraph outlining structural shifts from high-emission cars to light electric grid lines. Highlight key data groups cleanly.",
    task2Prompt: "To combat urban climate crises, some nations argue that personal combustion engine vehicles should be completely restricted in key metropolitan zones, prioritizing sustainable train systems. Do the advantages of this restriction outweigh the disadvantages?",
    task2Advice: "Structure your essay with four paragraphs: Introduction with a clear thesis, Body 1 discussing positive environmental impacts, Body 2 describing potential economic or logistical friction, and a concise logical Conclusion."
  },
  speaking: {
    readAloudPrompt: "Global logistics networks are undergoing a massive transformation as computerized transit hubs replace obsolete manual scheduling yards. By implementing autonomous terminal trailers and high-frequency smart tracking sensors, shipping operators can minimize idle vessel container times, reducing the carbon footprint of intercontinental shipping lanes and increasing total weekly freight volumes.",
    describeImagePrompt: "A horizontal bar chart comparing the primary transport emission sources in a developed metropolitan zone. Road transport contributes the largest share at forty-eight percent, accompanied by aviation at twenty-four percent, rail transit at eighteen percent, and ocean cargo freight comprising the final ten percent."
  }
};

interface WritingEvaluation {
  bandScore: number;
  criteriaScores: {
    taskAchievement: { score: number; feedback: string };
    coherenceCohesion: { score: number; feedback: string };
    lexicalResource: { score: number; feedback: string };
    grammaticalRange: { score: number; feedback: string };
  };
  overallFeedback: string;
  improvedEssay: string;
}

interface CueCard {
  id: string;
  topic: string;
  prompt: string;
  bulletPoints: string[];
  guide: string;
}

const IELTS_CUE_CARDS: CueCard[] = [
  {
    id: "website",
    topic: "A Useful Website",
    prompt: "Describe a website you use that helps you in your daily life or studies.",
    bulletPoints: [
      "What the website is and how you found out about it",
      "What kind of information or services it offers",
      "How often you visit it and what you use it for",
      "And explain why you find this website particularly helpful to you."
    ],
    guide: "Structure your response with smooth logical transitions. Use cohesive devices like 'Furthermore', 'As a consequence', 'In terms of content'. Try to use advanced vocabulary relating to technology, user interface, or efficiency."
  },
  {
    id: "person",
    topic: "An Interesting Person",
    prompt: "Describe an interesting person you know, study with, or work with.",
    bulletPoints: [
      "Who this person is and how you met them",
      "What you usually do or discuss together",
      "What character traits make them interesting to you",
      "And explain how this person has influenced or inspired your career or views."
    ],
    guide: "Focus on descriptive adjectives and phrases about personality and behavior (e.g., 'altruistic', 'intellectually stimulating', 'charismatic'). Discuss long-term traits and personal impact."
  },
  {
    id: "city",
    topic: "A Beautiful City",
    prompt: "Describe a beautiful city or historical town you have visited.",
    bulletPoints: [
      "Where it is located and when you went there",
      "What the main tourist attractions or architectural features are",
      "What you did during your stay there",
      "And explain what makes this city particularly beautiful or memorable."
    ],
    guide: "Use vivid sensory language and descriptive geographical terms (e.g., 'picturesque', 'hustle and bustle', 'architectural marvels', 'rich historical heritage'). Organize your description chronologically or spatially."
  },
  {
    id: "technology",
    topic: "A Crucial Device",
    prompt: "Describe an electronic device or piece of technology that is crucial to your daily routine.",
    bulletPoints: [
      "What device it is and how long you have owned it",
      "What key features or applications you use most often",
      "How it affects your daily productivity or leisure",
      "And explain why you can or cannot imagine living without it."
    ],
    guide: "Utilize precise terminology from computing or consumer technology. Express conditional structures (e.g., 'Were I to lose this device, I would encounter significant hurdles...')."
  },
  {
    id: "environment",
    topic: "An Environmental Project",
    prompt: "Describe an important environmental issue or local conservation project.",
    bulletPoints: [
      "What the issue or project is about",
      "How you first became aware of it",
      "What actions are being taken to address it",
      "And explain why you think it is important for your community."
    ],
    guide: "Deploy environment-related terminology (e.g., 'biodiversity', 'sustainable initiatives', 'ecological footprint', 'green spaces'). Discuss societal or collaborative responsibilities."
  }
];

export default function IeltsTestPage() {
  const [activeModule, setActiveModule] = useState<"overview" | "reading" | "listening" | "writing" | "speaking" | "report">("overview");
  
  // Custom test generator settings
  const [testType, setTestType] = useState<"Academic" | "General">("Academic");
  const [testTopic, setTestTopic] = useState("Technology & Automation");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Active Test Data
  const [currentTest, setCurrentTest] = useState<TestData>(DEFAULT_TEST);

  // USER ANSWERS
  const [readingAnswers, setReadingAnswers] = useState<Record<number, string>>({});
  const [readingChecked, setReadingChecked] = useState(false);
  
  const [listeningAnswers, setListeningAnswers] = useState<Record<number, string>>({});
  const [listeningChecked, setListeningChecked] = useState(false);

  // IELTS SPEAKING PRACTICE STATE
  const [activeSpeakingTask, setActiveSpeakingTask] = useState<"readAloud" | "describeImage" | "cueCard">("readAloud");
  const [selectedCueCardId, setSelectedCueCardId] = useState<string>("website");
  const [isRecording, setIsRecording] = useState(false);
  const [speakingError, setSpeakingError] = useState<string | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isSimulatedMic, setIsSimulatedMic] = useState(false);
  const [speakingDraftBypass, setSpeakingDraftBypass] = useState("");
  const [speakingEvaluations, setSpeakingEvaluations] = useState<Record<string, SpeakingEvaluation>>({});
  const [isEvaluatingSpeaking, setIsEvaluatingSpeaking] = useState(false);
  const [speakingEvalError, setSpeakingEvalError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // AUDIO SPEECH STATE
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // WRITING SUBMISSION FOR EVALUATION
  const [writingTask, setWritingTask] = useState<"task1" | "task2">("task2");
  const [essayContent, setEssayContent] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<WritingEvaluation | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  // Compute stats for the summary report card
  const getReadingScore = () => {
    let score = 0;
    currentTest.reading.questions.forEach((q) => {
      const userAns = (readingAnswers[q.id] || "").trim().toLowerCase();
      const correctAns = q.answer.trim().toLowerCase();
      if (userAns === correctAns) score++;
    });
    return score;
  };

  const getListeningScore = () => {
    let score = 0;
    currentTest.listening.questions.forEach((q) => {
      const userAns = (listeningAnswers[q.id] || "").trim().toLowerCase();
      const correctAns = q.answer.trim().toLowerCase();
      if (userAns === correctAns) score++;
    });
    return score;
  };

  // Maps MCQ correct count into standard expected IELTS bands
  const getBandFromScore = (score: number) => {
    if (score === 3) return 8.5;
    if (score === 2) return 6.5;
    if (score === 1) return 4.5;
    return 3.0;
  };

  const readingBand = getBandFromScore(getReadingScore());
  const listeningBand = getBandFromScore(getListeningScore());
  const writingBand = evaluationResult ? evaluationResult.bandScore : 6.0; // Defaults to 6.0 center band if not evaluated
  
  const getSpeakingScore = () => {
    const keys = Object.keys(speakingEvaluations);
    if (keys.length === 0) return 6.0; // default standard center band
    const sum = keys.reduce((acc, k) => acc + speakingEvaluations[k].overallScore, 0);
    return Math.round((sum / keys.length) * 2) / 2;
  };
  const speakingBand = getSpeakingScore();

  // IELTS Rounding: Average of modular bands (Reading, Listening, Writing, Speaking) rounded to nearest 0.5 points
  const computeOverallBand = () => {
    const rawAverage = (readingBand + listeningBand + writingBand + speakingBand) / 4;
    return Math.round(rawAverage * 2) / 2; // Standards compliance rounding
  };

  const triggerTTS = () => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    if (isSynthesizing) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    window.speechSynthesis.cancel(); // Stop anything active
    const cleanText = currentTest.listening.transcript.replace(/Sarah:|Ahmed:/gi, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = 0.95; // Slightly slower layout appropriate for IELTS

    utterance.onend = () => {
      setIsSynthesizing(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSynthesizing(false);
      setIsPaused(false);
    };

    synthRef.current = utterance;
    setIsSynthesizing(true);
    setIsPaused(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopTTS = () => {
    window.speechSynthesis?.cancel();
    setIsSynthesizing(false);
    setIsPaused(false);
  };

  // --- HTML5 Native Audio Recorder with Sandbox Bypass ---
  const startAudioRecording = async () => {
    setIsRecording(false);
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    setSpeakingError(null);
    setIsSimulatedMic(false);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Standard audio record APIs are not supported inside this frame or browser environment.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRecorderRef.current = rec;

      rec.ondataavailable = (ev) => {
        if (ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
        }
      };

      rec.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      rec.start();
      setIsRecording(true);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

    } catch (e: any) {
      console.warn("Audio permissions / device access blocked - activating simulated mic:", e);
      setIsSimulatedMic(true);
      setIsRecording(true);
      setSpeakingError(null);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopAudioRecording = () => {
    setIsRecording(false);
    if (isSimulatedMic) {
      // Generate standard minimal valid silent audio WAV in browser
      const createSilentAudioBlob = () => {
        const buffer = new ArrayBuffer(44 + 8000 * 2);
        const view = new DataView(buffer);
        view.setUint32(0, 0x52494646, false); // "RIFF"
        view.setUint32(4, 36 + 8000 * 2, true);
        view.setUint32(8, 0x57415645, false); // "WAVE"
        view.setUint32(12, 0x666d7420, false); // "fmt "
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, 8000, true);
        view.setUint32(28, 16000, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        view.setUint32(36, 0x64617461, false); // "data"
        view.setUint32(40, 8000 * 2, true);
        return new Blob([buffer], { type: "audio/wav" });
      };

      const mockBlob = createSilentAudioBlob();
      const mockUrl = URL.createObjectURL(mockBlob);
      setRecordedAudioUrl(mockUrl);
      setSpeakingError("Sandbox iframe microphone constraint bypass was activated. Standard silent audio has been recorded to let you proceed!");
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  const handleEvaluateSpeaking = async () => {
    if (!speakingDraftBypass.trim()) {
      setSpeakingEvalError("Please enter some text summary or draft notes reflecting what you spoke aloud, so the Language World IELTS evaluator can analyze pronunciation, fluency, coherence, and grammar patterns.");
      return;
    }

    setIsEvaluatingSpeaking(true);
    setSpeakingEvalError(null);

    try {
      let activePromptText = "";
      let taskType = "";

      if (activeSpeakingTask === "readAloud") {
        activePromptText = currentTest.speaking?.readAloudPrompt || DEFAULT_TEST.speaking?.readAloudPrompt || "";
        taskType = "Read Aloud";
      } else if (activeSpeakingTask === "describeImage") {
        activePromptText = currentTest.speaking?.describeImagePrompt || DEFAULT_TEST.speaking?.describeImagePrompt || "";
        taskType = "Describe Image";
      } else {
        const selectedCc = IELTS_CUE_CARDS.find(c => c.id === selectedCueCardId) || IELTS_CUE_CARDS[0];
        activePromptText = `IELTS speaking cue card topic: ${selectedCc.topic}. Instructions: Describe: ${selectedCc.prompt}. Bullet points to cover in detail: ${selectedCc.bulletPoints.join(" - ")}. Guide: ${selectedCc.guide}`;
        taskType = "Part 2: Cue Card (" + selectedCc.topic + ")";
      }

      const res = await fetch("/api/ielts/evaluate-speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType,
          originalPrompt: activePromptText,
          userTranscript: speakingDraftBypass
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || "Speaking score engine connection failed. Ensure GEMINI_API_KEY is active.");
      }

      const evaluation = await res.json();
      setSpeakingEvaluations((prev) => ({
        ...prev,
        [activeSpeakingTask]: evaluation
      }));
    } catch (err: any) {
      console.error(err);
      setSpeakingEvalError(err.message || "Failed to analyze Speaking task. Please try again later.");
    } finally {
      setIsEvaluatingSpeaking(false);
    }
  };

  // Generate Custom IELTS mock exam using the back-end AI models
  const handleGenerateCustomTest = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const res = await fetch("/api/ielts/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testType, topic: testTopic })
      });

      if (!res.ok) {
        throw new Error("Tutor backend was busy or returned an empty payload. Retrying with backup practice templates.");
      }

      const data = await res.json();
      if (!data.reading || !data.listening || !data.writing) {
        throw new Error("Invalid structure returned from IELTS planner. Please trigger again.");
      }

      setCurrentTest(data);
      // Reset scores and checked modes on loading a fresh sheet
      setReadingAnswers({});
      setReadingChecked(false);
      setListeningAnswers({});
      setListeningChecked(false);
      setEvaluationResult(null);
      setActiveModule("reading"); // Take user straight into simulation mode
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "Failed to contact IELTS dynamic core model.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Evaluate writing essay using backend British Council criteria models
  const handleEvaluateWriting = async () => {
    if (!essayContent.trim()) {
      setEvaluationError("Please provide some text paragraphs inside the IELTS essay layout block.");
      return;
    }

    setIsEvaluating(true);
    setEvaluationError(null);
    try {
      const essayPromptText = writingTask === "task1" ? currentTest.writing.task1Prompt : currentTest.writing.task2Prompt;
      const res = await fetch("/api/ielts/evaluate-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: writingTask,
          prompt: essayPromptText,
          essay: essayContent
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || "An error occurred evaluating your writing task. Ensure GEMINI_API_KEY is active.");
      }

      const evaluation = await res.json();
      setEvaluationResult(evaluation);
    } catch (err: any) {
      console.error(err);
      setEvaluationError(err.message || "Something went wrong evaluating writing task. Try again later.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP BRAND HERO BLOCK */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="space-y-3 max-w-2xl relative">
            <span className="bg-accent/10 text-accent text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles size={11} className="text-accent animate-pulse" />
              Language World SUCCESS Center Karachi
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-none">
              IELTS Mock Exam Simulator
            </h1>
            <p className="text-sm text-slate-500 font-bold leading-relaxed">
              Step into an authentic computer-delivered IELTS testing suite. Train your reading comprehension, listen to speech-synthesized advisor recordings, and submit argumentative writing formats for robust AI bands and corrections feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveModule("overview")}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeModule === "overview"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <Layers size={14} />
              Test Options
            </button>
            <button
              onClick={() => setActiveModule("report")}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeModule === "report"
                  ? "bg-accent text-white shadow-sm hover:opacity-90"
                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <Award size={14} />
              Overall Progress
            </button>
          </div>
        </div>

        {/* SIMULATOR CONTAINER - GRID FOR WORKSPACE AND PROGRESS TABS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT INTERACTIVE RAIL NAVIGATION */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/50 space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Testing Modules</h2>
              
              <div className="space-y-1">
                {/* 1. Overview */}
                <button
                  onClick={() => setActiveModule("overview")}
                  className={`w-full px-4 py-3.5 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                    activeModule === "overview"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-slate-600 hover:bg-slate-100 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <Layers size={14} />
                    </div>
                    <span>1. Exam Launcher</span>
                  </div>
                  <ChevronRight size={14} />
                </button>

                {/* 2. Reading */}
                <button
                  onClick={() => setActiveModule("reading")}
                  className={`w-full px-4 py-3.5 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                    activeModule === "reading"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-slate-600 hover:bg-slate-100 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <BookOpen size={14} />
                    </div>
                    <span>2. Reading Test</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {readingChecked && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 roundedbg bg-emerald-100 text-emerald-800">
                        {getReadingScore()}/3
                      </span>
                    )}
                    <ChevronRight size={14} />
                  </div>
                </button>

                {/* 3. Listening */}
                <button
                  onClick={() => setActiveModule("listening")}
                  className={`w-full px-4 py-3.5 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                    activeModule === "listening"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-slate-600 hover:bg-slate-100 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <Ear size={14} />
                    </div>
                    <span>3. Listening Test</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {listeningChecked && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 roundedbg bg-emerald-100 text-emerald-800">
                        {getListeningScore()}/3
                      </span>
                    )}
                    <ChevronRight size={14} />
                  </div>
                </button>

                {/* 4. Writing */}
                <button
                  onClick={() => setActiveModule("writing")}
                  className={`w-full px-4 py-3.5 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                    activeModule === "writing"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-slate-600 hover:bg-slate-100 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <PenTool size={14} />
                    </div>
                    <span>4. Essay Evaluator</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {evaluationResult && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Band {evaluationResult.bandScore}
                      </span>
                    )}
                    <ChevronRight size={14} />
                  </div>
                </button>

                {/* 5. Speaking */}
                <button
                  onClick={() => setActiveModule("speaking")}
                  className={`w-full px-4 py-3.5 rounded-2xl text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                    activeModule === "speaking"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-slate-600 hover:bg-slate-100 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <Mic size={14} />
                    </div>
                    <span>5. Speaking Practice</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {Object.keys(speakingEvaluations).length > 0 && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {Object.keys(speakingEvaluations).length} Evaluated
                      </span>
                    )}
                    <ChevronRight size={14} />
                  </div>
                </button>
              </div>

              <hr className="border-slate-100" />

              <button
                onClick={() => setActiveModule("report")}
                className={`w-full px-4 py-3 bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all hover:bg-slate-800 shadow-sm`}
              >
                <Award size={14} />
                Generate Score Report
              </button>
            </div>

            {/* QUICK INFO BRANDING PANEL */}
            <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm border border-slate-800 space-y-4 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/25 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="relative space-y-2">
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">Active</span>
                <h3 className="text-sm font-black uppercase tracking-wide">Language World Success Guarantee</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Karachi's center for international higher education preparation. Real time computer-based evaluations built directly with Google Gemini AI.
                </p>
              </div>
            </div>
          </div>

          {/* MAIN INTERACTIVE WORKSPACE */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              
              {/* MODULE 1: CUSTOM EXAM OPTIONS & DYNAMIC GENERATOR */}
              {activeModule === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/50 space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-lg font-black text-slate-900 border-b pb-3 border-slate-100 flex items-center gap-2">
                      <Layers className="text-accent" size={18} />
                      Practice Exam Options & Custom Generator
                    </h2>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">
                      Initialize our standard default IELTS prep packet, or construct an entirely new academic syllabus covering custom modern social or scientific themes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* OPTION A: STANDARD PRE-LOADED LAB */}
                    <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/50 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full">Package 1</span>
                        <h3 className="text-base font-black text-slate-950">{DEFAULT_TEST.title}</h3>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                          Includes fully detailed modules covering smart emissions, vertical gardens, public light railways, and administrative academic writing guidelines.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentTest(DEFAULT_TEST);
                          setActiveModule("reading");
                        }}
                        className="w-full py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center justify-center gap-2"
                      >
                        Launch Pre-Baked Exam
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    {/* OPTION B: DYNAMIC GEMINI EXAM BUILDER */}
                    <div className="bg-accent/5 rounded-2xl p-6 border border-accent/10 flex flex-col justify-between space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-xl pointer-events-none" />
                      <div className="space-y-3 relative">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-accent/20 text-accent px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                          <Sparkles size={10} className="text-accent" />
                          Generative AI Core
                        </span>
                        <h3 className="text-base font-black text-slate-950">Dynamic IELTS Exam Generator</h3>
                        
                        <div className="space-y-3 pt-1">
                          <div>
                            <label className="block text-[10px] uppercase text-slate-400 font-extrabold mb-1">Standard format</label>
                            <select
                              value={testType}
                              onChange={(e) => setTestType(e.target.value as any)}
                              className="w-full bg-white text-xs font-bold rounded-lg border border-slate-200 p-2 text-slate-700"
                            >
                              <option value="Academic">Academic Prep Standard</option>
                              <option value="General">General Training Version</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-slate-400 font-extrabold mb-1">Passage Topic / Theme Focus</label>
                            <select
                              value={testTopic}
                              onChange={(e) => setTestTopic(e.target.value)}
                              className="w-full bg-white text-xs font-bold rounded-lg border border-slate-200 p-2 text-slate-700"
                            >
                              <option value="Artificial Intelligence & Workforce">AI & Future Jobs</option>
                              <option value="Renewable Energy Tech & Carbon Targets">Clean Energy Shift</option>
                              <option value="Global Marine Ecology & Deep Oceans">Marine Biodiversity</option>
                              <option value="Space Exploration & Mars Settlement Architectures">Mars Architectures</option>
                              <option value="Modern Cognitive Psychology & Social Media">Social Psychology</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleGenerateCustomTest}
                        disabled={isGenerating}
                        className="w-full py-3 bg-accent text-white hover:opacity-90 disabled:opacity-50 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-xs mt-3"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="animate-spin" size={12} />
                            Drafting Custom Exam Passage...
                          </>
                        ) : (
                          <>
                            Generate Custom AI Mock Sheet
                            <Sparkles size={11} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {generationError && (
                    <div className="p-4 rounded-2xl bg-red-50 text-red-800 border border-red-200 text-xs font-semibold flex items-start gap-2">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold underline mb-1">Exam Planner Interruption</p>
                        <p>{generationError}</p>
                      </div>
                    </div>
                  )}

                  {/* CURRENT ACTIVE PRACTICE SESSION BANNER */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Activated Practice State
                      </span>
                      <h4 className="text-sm font-black">{currentTest.title}</h4>
                      <p className="text-[11px] text-slate-400 font-semibold italic">{currentTest.theme}</p>
                    </div>
                    <button
                      onClick={() => setActiveModule("reading")}
                      className="px-4 py-2 bg-accent text-white hover:opacity-90 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all"
                    >
                      Start Practicing
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* MODULE 2: READING PASSAGE & QUESTIONS */}
              {activeModule === "reading" && (
                <motion.div
                  key="reading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/50 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-100">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Module 2</span>
                        <h2 className="text-xl font-black text-slate-950">Academic Reading Practice Passage</h2>
                        <p className="text-xs text-slate-500 font-bold">Standard 3-question evaluation card. Read carefully before answering.</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setReadingAnswers({});
                          setReadingChecked(false);
                        }}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg"
                      >
                        <RefreshCw size={11} />
                        Reset Answers
                      </button>
                    </div>

                    {/* PASSAGE TEXT BLOCK WITH SOPHISTICATED BORDER AND COLUMN DISPLAY */}
                    <div className="p-6 sm:p-8 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 font-serif leading-relaxed text-sm sm:text-base max-w-none relative">
                      <div className="absolute top-2 right-2 bg-white/15 backdrop-blur-md text-[10px] text-white px-2.5 py-1 rounded font-sans font-bold uppercase tracking-wider">
                        Passage text
                      </div>
                      <p className="whitespace-pre-wrap leading-loose select-text selection:bg-accent/40 selection:text-white">
                        {currentTest.reading.passage}
                      </p>
                    </div>
                  </div>

                  {/* READING QUESTION WORKSPACE */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/50 space-y-6">
                    <h3 className="text-base font-black text-slate-950 uppercase tracking-wider border-b pb-3 border-slate-100 flex items-center gap-2">
                      <BookOpen className="text-accent" size={16} />
                      Interactive Questions
                    </h3>

                    <div className="space-y-6 divide-y divide-slate-100">
                      {currentTest.reading.questions.map((q, qIdx) => (
                        <div key={q.id} className={`pt-6 ${qIdx === 0 ? "pt-0" : ""}`}>
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-800 shrink-0 mt-0.5">
                              {q.id}
                            </span>
                            <div className="space-y-3 w-full">
                              <p className="text-sm font-bold text-slate-950">{q.question}</p>

                              {/* MCQ Options template */}
                              {q.type === "multiple-choice" && q.options && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {q.options.map((opt, optIdx) => {
                                    const optionChar = String.fromCharCode(65 + optIdx); // A, B, C, D
                                    const isSelected = readingAnswers[q.id] === opt;
                                    const isCorrect = q.answer === opt;
                                    
                                    return (
                                      <button
                                        key={optIdx}
                                        onClick={() => !readingChecked && setReadingAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                        disabled={readingChecked}
                                        className={`p-3.5 rounded-xl text-left text-xs font-semibold border transition-all flex items-start gap-2.5 ${
                                          isSelected
                                            ? readingChecked
                                              ? isCorrect
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs"
                                                : "bg-red-50 border-red-500 text-red-900 shadow-xs"
                                              : "bg-accent/10 border-accent text-accent shadow-xs"
                                            : readingChecked && isCorrect
                                            ? "bg-emerald-50/50 border-emerald-300 text-emerald-800"
                                            : "bg-white hover:bg-slate-50 border-slate-200/70 text-slate-700"
                                        }`}
                                      >
                                        <span className="text-[10px] uppercase font-bold bg-slate-100 p-1.5 rounded shrink-0 leading-none">
                                          {optionChar}
                                        </span>
                                        <span className="leading-normal">{opt}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Fill-blank inputs */}
                              {q.type === "fill-blank" && (
                                <div className="flex items-center gap-3">
                                  <input
                                    type="text"
                                    value={readingAnswers[q.id] || ""}
                                    onChange={(e) => !readingChecked && setReadingAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                    placeholder="Enter single exact word..."
                                    disabled={readingChecked}
                                    className={`p-3 rounded-xl text-xs font-bold border max-w-sm w-full shadow-xs ${
                                      readingChecked
                                        ? (readingAnswers[q.id] || "").trim().toLowerCase() === q.answer.trim().toLowerCase()
                                          ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                                          : "bg-red-50 border-red-500 text-red-900"
                                        : "bg-white border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent"
                                    }`}
                                  />
                                </div>
                              )}

                              {/* Inline check breakdown & explanation cards */}
                              {readingChecked && (
                                <div className={`p-4 rounded-xl text-xs text-left ${
                                  (readingAnswers[q.id] || "").trim().toLowerCase() === q.answer.trim().toLowerCase()
                                    ? "bg-emerald-50/40 border border-emerald-100 text-emerald-800"
                                    : "bg-red-50/40 border border-red-100 text-red-800"
                                }`}>
                                  <div className="flex items-center gap-1.5 font-black uppercase mb-1.5">
                                    {(readingAnswers[q.id] || "").trim().toLowerCase() === q.answer.trim().toLowerCase() ? "Correct Answer" : "Incorrect Answer"}
                                    <span className="bg-white/90 px-2 py-0.5 rounded border leading-none text-[9px]">
                                      Key: {q.answer}
                                    </span>
                                  </div>
                                  <p className="font-semibold leading-relaxed">{q.explanation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-400">
                        {readingChecked && (
                          <span className="text-accent uppercase font-black">
                            Score computed: {getReadingScore()} / 3 Standard Items
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setReadingChecked(true);
                        }}
                        className="px-6 py-3 bg-slate-950 text-white hover:bg-slate-800 rounded-xl text-xs font-extrabold shadow-sm transition-all"
                      >
                        Evaluate Reading Answers
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MODULE 3: LISTENING AUDIOS & TRANSCRIPTS */}
              {activeModule === "listening" && (
                <motion.div
                  key="listening"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/50 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-100">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-sky-100 text-sky-800 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Module 3</span>
                        <h2 className="text-xl font-black text-slate-950">IELTS Listening Simulation Audio</h2>
                        <p className="text-xs text-slate-500 font-bold">Listen carefully to the transcript audio dialog below before answering questions.</p>
                      </div>

                      <button
                        onClick={() => {
                          setListeningAnswers({});
                          setListeningChecked(false);
                        }}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg"
                      >
                        <RefreshCw size={11} />
                        Reset Answers
                      </button>
                    </div>

                    {/* AUDIO RECORDING TRIGGER BAR */}
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="space-y-2 relative">
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
                          <span className="w-2 h-2 rounded bg-emerald-400 animate-pulse inline-block" />
                          Synthetic Speech Engaged
                        </div>
                        <h4 className="text-sm font-black text-slate-50">{currentTest.listening.scenario}</h4>
                        <p className="text-[11px] text-slate-400 max-w-lg leading-relaxed font-semibold">
                          Click the synthesizer controller to read out standard dialogues. Perfect for training auditory comprehension. Alternatively, review the dialog text block.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-center">
                        <button
                          onClick={triggerTTS}
                          className="px-5 py-3 rounded-xl text-xs font-extrabold bg-accent text-white flex items-center gap-2 transition-all hover:opacity-95 shadow-sm"
                        >
                          {isSynthesizing ? (
                            isPaused ? (
                              <>
                                <Play size={14} /> Resume Broadcast
                              </>
                            ) : (
                              <>
                                <Pause size={14} /> Pause Audio
                              </>
                            )
                          ) : (
                            <>
                              <Volume2 size={14} /> Play Dialog Audio
                            </>
                          )}
                        </button>
                        
                        {isSynthesizing && (
                          <button
                            onClick={stopTTS}
                            className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
                          >
                            <Square size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* TRANSCRIPT TEXT AREA EXPANDER */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Dialog Transcript (English)</span>
                      </div>
                      <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200/60 rounded-xl leading-relaxed text-sm text-slate-700 font-mono">
                        <p className="whitespace-pre-line leading-loose">
                          {currentTest.listening.transcript}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LISTENING PRACTICAL WORKSPACE */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/50 space-y-6">
                    <h3 className="text-base font-black text-slate-950 uppercase tracking-wider border-b pb-3 border-slate-100 flex items-center gap-2">
                      <Ear className="text-accent" size={16} />
                      Interactive Questions
                    </h3>

                    <div className="space-y-6 divide-y divide-slate-100">
                      {currentTest.listening.questions.map((q, qIdx) => (
                        <div key={q.id} className={`pt-6 ${qIdx === 0 ? "pt-0" : ""}`}>
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-800 shrink-0 mt-0.5">
                              {q.id}
                            </span>
                            <div className="space-y-3 w-full">
                              <p className="text-sm font-bold text-slate-950">{q.question}</p>

                              {/* MCQ formats */}
                              {q.type === "multiple-choice" && q.options && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {q.options.map((opt, optIdx) => {
                                    const optionChar = String.fromCharCode(65 + optIdx);
                                    const isSelected = listeningAnswers[q.id] === opt;
                                    const isCorrect = q.answer === opt;
                                    
                                    return (
                                      <button
                                        key={optIdx}
                                        onClick={() => !listeningChecked && setListeningAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                        disabled={listeningChecked}
                                        className={`p-3.5 rounded-xl text-left text-xs font-semibold border transition-all flex items-start gap-2.5 ${
                                          isSelected
                                            ? listeningChecked
                                              ? isCorrect
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs"
                                                : "bg-red-50 border-red-500 text-red-900 shadow-xs"
                                              : "bg-accent/10 border-accent text-accent shadow-xs"
                                            : listeningChecked && isCorrect
                                            ? "bg-emerald-50/50 border-emerald-300 text-emerald-800"
                                            : "bg-white hover:bg-slate-50 border-slate-200/70 text-slate-700"
                                        }`}
                                      >
                                        <span className="text-[10px] uppercase font-bold bg-slate-100 p-1.5 rounded shrink-0 leading-none">
                                          {optionChar}
                                        </span>
                                        <span className="leading-normal">{opt}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Fill-blank formats */}
                              {q.type === "fill-blank" && (
                                <div className="flex items-center gap-3">
                                  <input
                                    type="text"
                                    value={listeningAnswers[q.id] || ""}
                                    onChange={(e) => !listeningChecked && setListeningAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                    placeholder="Enter single exact word..."
                                    disabled={listeningChecked}
                                    className={`p-3 rounded-xl text-xs font-bold border max-w-sm w-full shadow-xs ${
                                      listeningChecked
                                        ? (listeningAnswers[q.id] || "").trim().toLowerCase() === q.answer.trim().toLowerCase()
                                          ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                                          : "bg-red-50 border-red-500 text-red-900"
                                        : "bg-white border-slate-200 focus:border-accent"
                                    }`}
                                  />
                                </div>
                              )}

                              {/* Explanations */}
                              {listeningChecked && (
                                <div className={`p-4 rounded-xl text-xs text-left ${
                                  (listeningAnswers[q.id] || "").trim().toLowerCase() === q.answer.trim().toLowerCase()
                                    ? "bg-emerald-50/40 border border-emerald-100 text-emerald-800"
                                    : "bg-red-50/40 border border-red-100 text-red-800"
                                }`}>
                                  <div className="flex items-center gap-1.5 font-black uppercase mb-1.5">
                                    {(listeningAnswers[q.id] || "").trim().toLowerCase() === q.answer.trim().toLowerCase() ? "Correct Answer" : "Incorrect Answer"}
                                    <span className="bg-white/90 px-2 py-0.5 rounded border leading-none text-[9px]">
                                      Key: {q.answer}
                                    </span>
                                  </div>
                                  <p className="font-semibold leading-relaxed">{q.explanation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-400">
                        {listeningChecked && (
                          <span className="text-accent uppercase font-black">
                            Score computed: {getListeningScore()} / 3 Standard Items
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setListeningChecked(true);
                        }}
                        className="px-6 py-3 bg-slate-950 text-white hover:bg-slate-800 rounded-xl text-xs font-extrabold shadow-sm transition-all"
                      >
                        Evaluate Listening Answers
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MODULE 4: WRITING TASK EVALUATION */}
              {activeModule === "writing" && (
                <motion.div
                  key="writing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/50 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-100">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">Module 4</span>
                        <h2 className="text-xl font-black text-slate-950">IELTS Academic Writing AI Examiner</h2>
                        <p className="text-xs text-slate-500 font-bold">Select Task 1 or Task 2, enter your essay copy, and receive automated scoring metrics.</p>
                      </div>

                      <div className="bg-slate-100/80 p-1 rounded-xl flex items-center gap-1">
                        <button
                          onClick={() => {
                            setWritingTask("task1");
                            setEssayContent("");
                            setEvaluationResult(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            writingTask === "task1"
                              ? "bg-white text-slate-900 shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          IELTS Task 1
                        </button>
                        <button
                          onClick={() => {
                            setWritingTask("task2");
                            setEssayContent("");
                            setEvaluationResult(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            writingTask === "task2"
                              ? "bg-white text-slate-900 shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          IELTS Task 2
                        </button>
                      </div>
                    </div>

                    {/* DYNAMIC TASK PROMPT DISPLAY */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 workspace relative overflow-hidden">
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <span className="text-[9px] font-black uppercase bg-accent text-white px-2.5 py-1 rounded">
                          {writingTask === "task1" ? "Task 1: Chart / Layout" : "Task 2: Essay Prompt"}
                        </span>
                      </div>

                      <div className="space-y-2 mt-2 leading-relaxed">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Exam Prompt</h4>
                        <p className="text-sm font-bold text-slate-900">
                          {writingTask === "task1" ? currentTest.writing.task1Prompt : currentTest.writing.task2Prompt}
                        </p>
                      </div>

                      <hr className="my-4 border-slate-100" />

                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-accent">
                          <Info size={13} /> Advisor Guidelines
                        </div>
                        <p className="text-slate-500 font-medium whitespace-pre-line leading-relaxed">
                          {writingTask === "task1" ? currentTest.writing.task1Advice : currentTest.writing.task2Advice}
                        </p>
                      </div>
                    </div>

                    {/* ESSAY WORKSPACE INPUT BOX */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Write your essay response block</span>
                        <span className="bg-slate-100 px-2 py-1 rounded border">
                          Word count: {essayContent.trim().length === 0 ? 0 : essayContent.trim().split(/\s+/).length} words
                        </span>
                      </div>

                      <textarea
                        value={essayContent}
                        onChange={(e) => setEssayContent(e.target.value)}
                        placeholder="Write or paste your test essay drafts here (exceed 150 words for Task 1, or 250 words for Task 2 to prevent band scoring penalties)..."
                        rows={11}
                        className="w-full bg-white text-slate-900 rounded-2xl border border-slate-200 p-5 text-sm font-sans focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                      />

                      <p className="text-[10px] text-slate-400 font-semibold text-right italic">
                        *Note: Submitting evaluates vocabulary richness, cohesion, spelling metrics, and task-achievement parameters.
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={handleEvaluateWriting}
                        disabled={isEvaluating}
                        className="px-6 py-3.5 bg-accent text-white hover:opacity-95 disabled:opacity-50 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-sm"
                      >
                        {isEvaluating ? (
                          <>
                            <RefreshCw className="animate-spin" size={12} />
                            IELTS AI Evaluator analyzing paragraphs...
                          </>
                        ) : (
                          <>
                            Submit to IELTS AI Evaluator
                            <Sparkles size={11} />
                          </>
                        )}
                      </button>
                    </div>

                    {evaluationError && (
                      <div className="p-4 rounded-xl bg-red-50 text-red-800 font-semibold text-xs flex items-start gap-2 border border-red-200">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold underline mb-1">AI Evaluator Connection Error</p>
                          <p>{evaluationError}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ESSAY SCORING DASHBOARD */}
                  {evaluationResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/50 space-y-6"
                    >
                      <div className="flex items-center gap-3 border-b pb-4 border-slate-100">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                          <Award size={20} />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-950 uppercase tracking-widest leading-none">AI Examiner Band Results</h3>
                          <p className="text-xs text-slate-400 font-bold mt-1">Official IELTS four rubric standards assessment breakdown.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        
                        {/* OVERALL SCORE BIG BADGE */}
                        <div className="md:col-span-2 bg-slate-950 text-white rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-slate-800 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                          <span className="text-[10px] text-emerald-400 uppercase font-black tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/50">Overall Score</span>
                          <span className="text-6xl sm:text-7xl font-extrabold tracking-tight mt-3 text-white">
                            {evaluationResult.bandScore}
                          </span>
                          <span className="text-sm text-slate-400 font-extrabold mt-1">Expected Band Level</span>
                          <p className="text-[11px] text-slate-300 font-semibold text-center italic mt-3 border-t border-slate-800 pt-3 max-w-xs">
                            "Polished draft demonstrates core structured flow appropriate for universities."
                          </p>
                        </div>

                        {/* FOUR CRITERIA SCORE LISTINGS */}
                        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          {/* 1. Task Achievement */}
                          <div className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-xl space-y-1.5 leading-relaxed text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">Task Achievement</span>
                              <span className="bg-slate-200 text-slate-900 font-black text-[10px] px-2 py-0.5 rounded leading-none">
                                Band {evaluationResult.criteriaScores.taskAchievement.score}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-semibold">{evaluationResult.criteriaScores.taskAchievement.feedback}</p>
                          </div>

                          {/* 2. Coherence and Cohesion */}
                          <div className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-xl space-y-1.5 leading-relaxed text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">Coherence & Cohesion</span>
                              <span className="bg-slate-200 text-slate-900 font-black text-[10px] px-2 py-0.5 rounded leading-none">
                                Band {evaluationResult.criteriaScores.coherenceCohesion.score}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-semibold">{evaluationResult.criteriaScores.coherenceCohesion.feedback}</p>
                          </div>

                          {/* 3. Lexical Resource */}
                          <div className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-xl space-y-1.5 leading-relaxed text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">Lexical Resource</span>
                              <span className="bg-slate-200 text-slate-900 font-black text-[10px] px-2 py-0.5 rounded leading-none">
                                Band {evaluationResult.criteriaScores.lexicalResource.score}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-semibold">{evaluationResult.criteriaScores.lexicalResource.feedback}</p>
                          </div>

                          {/* 4. Grammatical Range */}
                          <div className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-xl space-y-1.5 leading-relaxed text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">Grammar Metric</span>
                              <span className="bg-slate-200 text-slate-900 font-black text-[10px] px-2 py-0.5 rounded leading-none">
                                Band {evaluationResult.criteriaScores.grammaticalRange.score}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-semibold">{evaluationResult.criteriaScores.grammaticalRange.feedback}</p>
                          </div>

                        </div>
                      </div>

                      {/* DETAILED OVERALL ACTIONABLE CRITIQUE */}
                      <div className="bg-amber-50/55 p-5 border border-amber-200/50 rounded-2xl relative space-y-2 text-left leading-relaxed">
                        <div className="flex items-center gap-1.5 text-amber-800 text-xs font-black uppercase">
                          <Info size={14} className="text-amber-700" />
                          Actionable Advisor Feedback & Corrective Steps
                        </div>
                        <p className="text-xs text-slate-700 font-semibold whitespace-pre-wrap leading-relaxed">
                          {evaluationResult.overallFeedback}
                        </p>
                      </div>

                      {/* HIGH GRADE ESSAY IMPROVED REWRITE */}
                      <div className="space-y-3 text-left">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Polished Rewrite Model (Band 8.5+ Standard)</h4>
                        <div className="p-6 bg-slate-50/90 border border-slate-200 rounded-xl font-sans tracking-wide leading-loose text-xs sm:text-sm text-slate-700 shadow-inner max-h-[350px] overflow-y-auto">
                          <p className="whitespace-pre-wrap select-text leading-relaxed">
                            {evaluationResult.improvedEssay}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* MODULE 5: SPEAKING WORKSPACE */}
              {activeModule === "speaking" && (
                <motion.div
                  key="speaking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/50 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                          <Mic size={20} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-base font-black text-slate-950 uppercase tracking-widest leading-none">IELTS Speaking Practice</h3>
                          <p className="text-xs text-slate-400 font-bold mt-1">Acquire real time band evaluations for custom phonetic tasks.</p>
                        </div>
                      </div>

                      {/* SPEAKING TASK SELECTOR */}
                      <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/45 gap-1">
                        <button
                          onClick={() => {
                            setActiveSpeakingTask("readAloud");
                            setSpeakingDraftBypass("");
                            setRecordedAudioUrl(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeSpeakingTask === "readAloud"
                              ? "bg-white text-slate-900 shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          IELTS Read Aloud
                        </button>
                        <button
                          onClick={() => {
                            setActiveSpeakingTask("describeImage");
                            setSpeakingDraftBypass("");
                            setRecordedAudioUrl(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeSpeakingTask === "describeImage"
                              ? "bg-white text-slate-900 shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          IELTS Describe Image
                        </button>
                        <button
                          onClick={() => {
                            setActiveSpeakingTask("cueCard");
                            setSpeakingDraftBypass("");
                            setRecordedAudioUrl(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeSpeakingTask === "cueCard"
                              ? "bg-white text-slate-900 shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Part 2 Cue Cards
                        </button>
                      </div>
                    </div>

                    {/* DYNAMIC TOPIC/CUE CARD SELECTOR GRID */}
                    {activeSpeakingTask === "cueCard" && (
                      <div className="space-y-3 text-left">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Cue Card Topic</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                          {IELTS_CUE_CARDS.map((card) => {
                            const isSel = card.id === selectedCueCardId;
                            return (
                              <button
                                key={card.id}
                                onClick={() => {
                                  setSelectedCueCardId(card.id);
                                  setRecordedAudioUrl(null);
                                }}
                                className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                                  isSel
                                    ? "bg-accent border-accent text-white shadow-xs"
                                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                              >
                                {card.topic}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* CORE IELTS TASK DESCRIPTION */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 workspace relative overflow-hidden text-left">
                      <div className="absolute top-2 right-2">
                        <span className="text-[9px] font-black uppercase bg-accent text-white px-2.5 py-1 rounded">
                          {activeSpeakingTask === "readAloud" 
                            ? "Part 1: Phonetical Read Aloud" 
                            : activeSpeakingTask === "describeImage" 
                            ? "Part 2: Visual Describe Image" 
                            : "Part 2: Interactive Cue Card"}
                        </span>
                      </div>

                      <div className="space-y-3 mt-2 leading-relaxed">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Oral Practice Task</h4>
                        
                        {activeSpeakingTask === "cueCard" ? (
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-extrabold uppercase text-purple-600 tracking-wide mb-1">Target Cue Card Topic</p>
                              <h3 className="text-sm font-black text-slate-900 border-l-4 border-purple-500 pl-3 py-1 bg-purple-50/40 rounded-r-lg">
                                {IELTS_CUE_CARDS.find(c => c.id === selectedCueCardId)?.prompt}
                              </h3>
                            </div>

                            <div className="p-4 bg-white rounded-xl border border-slate-200/85 space-y-2">
                              <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">You should speak about:</p>
                              <ul className="space-y-1.5 list-disc list-inside text-xs font-semibold text-slate-800">
                                {IELTS_CUE_CARDS.find(c => c.id === selectedCueCardId)?.bulletPoints.map((bp, bpIdx) => (
                                  <li key={bpIdx} className="leading-relaxed">{bp}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm font-bold text-slate-900">
                            {activeSpeakingTask === "readAloud"
                              ? (currentTest.speaking?.readAloudPrompt || DEFAULT_TEST.speaking?.readAloudPrompt)
                              : (currentTest.speaking?.describeImagePrompt || DEFAULT_TEST.speaking?.describeImagePrompt)}
                          </p>
                        )}
                      </div>

                      <hr className="my-4 border-slate-100" />

                      <div className="space-y-1 text-xs text-left">
                        <div className="flex items-center gap-1.5 font-bold text-accent">
                          <Info size={13} /> Speaking Guide
                        </div>
                        <p className="text-slate-500 font-medium leading-relaxed">
                          {activeSpeakingTask === "readAloud" && "Articulate every word cleanly. Maintain steady pacing and avoid rushing. Emphasize silent pauses on punctuation marks."}
                          {activeSpeakingTask === "describeImage" && "Analyze primary trends and compare peaks. Focus on reporting key proportions (e.g. highest vs lowest percentages) in under 40 seconds."}
                          {activeSpeakingTask === "cueCard" && IELTS_CUE_CARDS.find(c => c.id === selectedCueCardId)?.guide}
                        </p>
                      </div>
                    </div>

                    {/* INTERACTIVE RECORDER WIDGET */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 flex flex-col items-center justify-center text-center space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Oral Practice Recorder</h4>
                      
                      <div className="flex items-center gap-4">
                        {isRecording ? (
                          <button
                            onClick={stopAudioRecording}
                            className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center animate-pulse hover:bg-red-700 transition-all shadow-md shrink-0"
                          >
                            <StopCircle size={32} />
                          </button>
                        ) : (
                          <button
                            onClick={startAudioRecording}
                            className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition-all shadow-md shrink-0"
                          >
                            <Mic size={32} />
                          </button>
                        )}

                        <div className="text-left">
                          <span className="text-2xl font-mono font-black text-slate-950">
                            {Math.floor(recordingSeconds / 60).toString().padStart(2, "0")}:
                            {(recordingSeconds % 60).toString().padStart(2, "0")}
                          </span>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                            {isRecording ? "Recording Live..." : "Stopped / Idle"}
                          </p>
                        </div>
                      </div>

                      {speakingError && (
                        <div className="p-3.5 bg-amber-50 rounded-xl text-amber-800 text-xs font-semibold border border-amber-200 max-w-xl">
                          {speakingError}
                        </div>
                      )}

                      {recordedAudioUrl && (
                        <div className="space-y-2 w-full max-w-sm">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Review Recorded Audio</p>
                          <audio src={recordedAudioUrl} controls className="w-full h-8" />
                        </div>
                      )}
                    </div>

                    {/* RECONSTRUCTED TRANSCRIPT OR PRACTICE NOTES BYPASS */}
                    <div className="space-y-2.5 text-left">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Draft transcription or formulated speech notes</span>
                        <span className="text-[10px] bg-slate-100 border px-2 py-0.5 rounded text-slate-500">
                          AI analyzes speech properties through details below
                        </span>
                      </div>

                      <textarea
                        value={speakingDraftBypass}
                        onChange={(e) => setSpeakingDraftBypass(e.target.value)}
                        placeholder="Please write down a summary transcript, bullet notes, or a draft of what you articulated aloud, so the examiner AI can grade fluency, grammar, or word choices..."
                        rows={4}
                        className="w-full bg-white text-slate-900 rounded-2xl border border-slate-200 p-4 text-xs sm:text-sm font-sans focus:ring-1 focus:ring-accent focus:border-accent focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <button
                        onClick={handleEvaluateSpeaking}
                        disabled={isEvaluatingSpeaking}
                        className="px-6 py-3.5 bg-accent text-white hover:opacity-95 disabled:opacity-50 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-sm"
                      >
                        {isEvaluatingSpeaking ? (
                          <>
                            <RefreshCw className="animate-spin" size={12} />
                            IELTS Speaking Master AI scoring your response...
                          </>
                        ) : (
                          <>
                            Evaluate Speaking Response
                            <Sparkles size={11} />
                          </>
                        )}
                      </button>
                    </div>

                    {speakingEvalError && (
                      <div className="p-4 rounded-xl bg-red-50 text-red-800 font-semibold text-xs flex items-start gap-2 border border-red-200 text-left">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold underline mb-1">Evaluation Connection Limit</p>
                          <p>{speakingEvalError}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SPEAKING EVALUATION DETAILED REPORT */}
                  {speakingEvaluations[activeSpeakingTask === "cueCard" ? "cueCard_" + selectedCueCardId : activeSpeakingTask] && (() => {
                    const evalObj = speakingEvaluations[activeSpeakingTask === "cueCard" ? "cueCard_" + selectedCueCardId : activeSpeakingTask];
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/50 space-y-6 text-left"
                      >
                        <div className="flex items-center gap-3 border-b pb-4 border-slate-100">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                            <Award size={20} />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-950 uppercase tracking-widest leading-none">IELTS Speaking Score report</h3>
                            <p className="text-xs text-slate-400 font-bold mt-1">Detailed feedback generated by Language World IELTS oral evaluator.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                          
                          {/* OVERALL BAND HERO CARD */}
                          <div className="md:col-span-2 bg-slate-950 text-white rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-slate-800 relative overflow-hidden justify-items-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                            <span className="text-[10px] text-emerald-400 uppercase font-black tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/50">Estimated Band</span>
                            <span className="text-6xl sm:text-7xl font-extrabold tracking-tight mt-3 text-white">
                              {evalObj.overallScore}
                            </span>
                            <span className="text-sm text-slate-400 font-extrabold mt-1">Speaking Band Level</span>
                            <p className="text-[11px] text-slate-300 font-semibold text-center italic mt-3 border-t border-slate-800 pt-3 max-w-xs">
                              "Articulate performance. Consistent pronunciation parameters matched standard IELTS goals."
                            </p>
                          </div>

                          {/* DESCRIPTIVE INDIVIDUAL RATINGS */}
                          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            
                            {/* Pronunciation Progress */}
                            <div className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-xl space-y-1.5 leading-relaxed">
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Pronunciation</span>
                              <span className="text-2xl font-black text-slate-950 block">
                                Band {evalObj.pronunciationScore}
                              </span>
                              <p className="text-[10px] text-slate-500 font-semibold">Evaluates clarity, accent neutralization, and vowel sounds consistency.</p>
                            </div>

                            {/* Fluency Progress */}
                            <div className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-xl space-y-1.5 leading-relaxed">
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Fluency & Coherence</span>
                              <span className="text-2xl font-black text-slate-950 block">
                                Band {evalObj.fluencyScore}
                              </span>
                              <p className="text-[10px] text-slate-500 font-semibold">Measures speech flow duration, structural linkages, and pause density.</p>
                            </div>

                            {/* Lexical Range */}
                            <div className="p-4 bg-slate-50/70 border border-slate-200/60 rounded-xl space-y-1.5 leading-relaxed text-left">
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Lexical / Content</span>
                              <span className="text-2xl font-black text-slate-950 block text-left">
                                Band {evalObj.contentScore}
                              </span>
                              <p className="text-[10px] text-slate-500 font-semibold">Analyzes academic vocabulary items, variety, and semantic contextual fit.</p>
                            </div>

                          </div>
                        </div>

                        {/* CONSTRUCTIVE FEEDBACK ADVISORY BOX */}
                        <div className="bg-amber-50/55 p-5 border border-amber-200/50 rounded-2xl relative space-y-2 leading-relaxed text-left">
                          <div className="flex items-center gap-1.5 text-amber-800 text-xs font-black uppercase">
                            <Info size={14} className="text-amber-700" />
                            Diagnostic speaking Feedback
                          </div>
                          <p className="text-xs text-slate-700 font-semibold whitespace-pre-wrap leading-relaxed">
                            {evalObj.feedback}
                          </p>
                        </div>

                        {/* ACTIONABLE CORRECTIVE TUTORIAL TIPS */}
                        <div className="bg-emerald-50/50 p-5 border border-emerald-200/40 rounded-2xl relative space-y-2 leading-relaxed text-left">
                          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-black uppercase">
                            <CheckCircle2 size={14} className="text-emerald-700"/>
                            Actionable Corrective Strategies & Tips
                          </div>
                          <p className="text-xs text-slate-700 font-semibold whitespace-pre-wrap leading-relaxed">
                            {evalObj.tips}
                          </p>
                        </div>

                        {/* BAND 9 EXEMPLAR STANDARD AUDIO COMPARISON NARRATIVE */}
                        <div className="space-y-3 text-left">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Exemplary Model Speech (Band 9.0 Standard)</h4>
                          <div className="p-6 bg-slate-50/90 border border-slate-200 rounded-xl font-sans tracking-wide leading-loose text-xs sm:text-sm text-slate-700 shadow-inner max-h-[350px] overflow-y-auto">
                            <p className="whitespace-pre-wrap leading-relaxed text-left">
                              {evalObj.modelSpeech}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </motion.div>
              )}

              {/* MODULE 5: SCORE REPORT & CUMULATIVE STATS */}
              {activeModule === "report" && (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/50 space-y-8"
                >
                  <div className="flex items-center gap-3 border-b pb-4 border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                      <DiplomaIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-950 uppercase tracking-widest leading-none">Cumulative Practice Report</h3>
                      <p className="text-xs text-slate-400 font-bold mt-1">Summative report card displaying computed modular standards.</p>
                    </div>
                  </div>

                  {/* OVERALL BAND CALCULATOR HERO CARD */}
                  <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="space-y-2 relative max-w-xl text-center md:text-left">
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20 font-black">
                        IELTS Success Matrix
                      </span>
                      <h4 className="text-xl font-black text-white">Cumulative IELTS Estimated Band</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                        This overall band level is automatically rounded upward to the nearest half or whole score point (X.0 or X.5) strictly aligning with British Council assessment logic.
                      </p>

                      <div className="pt-2 text-[11px] text-slate-300 font-bold flex flex-wrap items-center gap-x-4 gap-y-1 justify-center md:justify-start">
                        <span>Reading score: {getReadingScore()}/3</span>
                        <span>•</span>
                        <span>Listening score: {getListeningScore()}/3</span>
                        <span>•</span>
                        <span>Essay status: {evaluationResult ? "Analysed" : "Draft (Default 6.0 center band)"}</span>
                        <span>•</span>
                        <span>Speaking: {Object.keys(speakingEvaluations).length > 0 ? `${Object.keys(speakingEvaluations).length} Tasks Analysed` : "Draft (Default 6.0)"}</span>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-6 rounded-2xl flex flex-col items-center justify-center text-center shrink-0 min-w-[200px]">
                      <span className="text-xs text-slate-300 font-extrabold uppercase">Band Est.</span>
                      <span className="text-5xl sm:text-6xl font-extrabold tracking-tight mt-1 text-white leading-none">
                        {computeOverallBand()}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-black mt-2 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-1 rounded">
                        PROVISIONAL GRADE
                      </span>
                    </div>
                  </div>

                  {/* MODULAR STATUS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                    
                    {/* Item A: Reading Module */}
                    <div className="p-5 bg-slate-50/80 border border-slate-200/50 rounded-xl space-y-3 relative text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Reading Comprehension</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded leading-none ${
                          readingChecked ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                        }`}>
                          {readingChecked ? "Completed" : "Draft State"}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-slate-950">Band {readingBand}</span>
                        <span className="text-xs text-slate-400 font-bold mb-0.5">({getReadingScore()}/3 correct items)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Based on academic reading responses. Practice multiple themes using our generative AI compiler tool.
                      </p>
                    </div>

                    {/* Item B: Listening Module */}
                    <div className="p-5 bg-slate-50/80 border border-slate-200/50 rounded-xl space-y-3 relative text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Listening Auditory</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded leading-none ${
                          listeningChecked ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                        }`}>
                          {listeningChecked ? "Completed" : "Draft State"}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-slate-950">Band {listeningBand}</span>
                        <span className="text-xs text-slate-400 font-bold mb-0.5">({getListeningScore()}/3 correct items)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Reflects audio dialog assessments. Keep on synthesizing advisor voices directly within the layout controls.
                      </p>
                    </div>

                    {/* Item C: Writing Module */}
                    <div className="p-5 bg-slate-50/80 border border-slate-200/50 rounded-xl space-y-3 relative text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Academic Essay Writing</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded leading-none ${
                          evaluationResult ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                        }`}>
                          {evaluationResult ? "Evaluated" : "Idle Status"}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-slate-950">Band {writingBand}</span>
                        <span className="text-xs text-slate-400 font-bold mb-0.5">
                          {evaluationResult ? "Evaluated by AI" : "(Default provisional)"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Evaluated directly over Task Achievement, structural coherence, grammar variation, and correct word-length limits.
                      </p>
                    </div>

                    {/* Item D: Speaking Module */}
                    <div className="p-5 bg-slate-50/80 border border-slate-200/50 rounded-xl space-y-3 relative text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Speaking Practice</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded leading-none ${
                          Object.keys(speakingEvaluations).length > 0 ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                        }`}>
                          {Object.keys(speakingEvaluations).length > 0 ? "Evaluated" : "Idle Status"}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-slate-950">Band {speakingBand}</span>
                        <span className="text-xs text-slate-400 font-bold mb-0.5">
                          {Object.keys(speakingEvaluations).length > 0 ? "Evaluated by AI" : "(Default provisional)"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Based on pronunciation clarity, coherence and oral consistency across task-types.
                      </p>
                    </div>

                  </div>

                  {/* ROADMAP ACTION GUIDANCE PORTAL */}
                  <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative border border-slate-800 overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-44 h-44 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="space-y-1 relative">
                      <h4 className="text-sm font-black text-slate-50 flex items-center gap-1.5 shadow-sm">
                        <Shield size={14} className="text-emerald-400" />
                        Next IELTS Milestone Setup
                      </h4>
                      <p className="text-xs text-slate-300 max-w-xl leading-relaxed font-semibold">
                        To consolidate your estimated band score, visit the Language World preparation office or connect with an administrator directly.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setReadingAnswers({});
                        setReadingChecked(false);
                        setListeningAnswers({});
                        setListeningChecked(false);
                        setEvaluationResult(null);
                        setEssayContent("");
                        setActiveModule("overview");
                      }}
                      className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all self-start md:self-center shrink-0 shadow-sm"
                    >
                      Launch A Fresh Mock Exam Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
