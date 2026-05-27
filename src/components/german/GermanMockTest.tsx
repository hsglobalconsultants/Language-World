import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, ArrowRight, CheckCircle2, AlertCircle, Play, RefreshCcw, Loader2, BookOpen, PenTool, Languages, Download, User, Mail, Phone, Award } from 'lucide-react';
import { scoreLanguageTask } from '../../services/geminiService';
import { leadService } from '../../services/leadService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateCertificatePDF } from '../../utils/certificateGenerator';

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
  // ==================== LEVEL A1 ====================
  {
    id: 'g1_reading',
    type: 'reading',
    level: 'A1',
    title: 'Leseverstehen (Reading)',
    topic: 'Sich vorstellen (Introducing oneself)',
    instruction: 'Lesen Sie den Text und verstehen Sie die Hauptpunkte. (Read the text and understand the main points.)',
    content: 'Hallo! Ich heiße Markus und ich komme aus Berlin. Ich bin 25 Jahre alt und arbeite als Lehrer. In meiner Freizeit spiele ich gerne Fußball und höre Musik.',
    grammarRule: 'Present tense (Präsens) of regular and irregular verbs.',
    exampleAnswer: 'Markus ist Lehrer und kommt aus Berlin. Er spielt gerne Fußball.',
    timeLimit: 600,
  },
  {
    id: 'g1_grammar',
    type: 'grammar',
    level: 'A1',
    title: 'Grammatik (Grammar)',
    topic: 'Verben im Präsens (Verbs in present tense)',
    instruction: 'Wählen Sie die richtige Form von "sein". (Choose the correct form of "to be".)',
    content: 'Woher ______ du? - Ich komme aus Karachi.',
    grammarRule: 'Conjugation of the auxiliary verb "sein" ("bist" for 2nd person singular).',
    exampleAnswer: 'bist',
    options: ['bin', 'bist', 'ist', 'sind'],
    timeLimit: 60,
  },
  {
    id: 'g1_vocabulary',
    type: 'vocabulary',
    level: 'A1',
    title: 'Wortschatz (Vocabulary)',
    topic: 'Begrüßung & Höflichkeit (Greetings & Politeness)',
    instruction: 'Welches Wort passt in die Lücke? (Which word fits in the blank?)',
    content: 'Guten Tag, wie geht es ______? - Danke, sehr gut!',
    grammarRule: 'Formal greeting and dative pronoun "Ihnen".',
    exampleAnswer: 'Ihnen',
    options: ['dir', 'Ihnen', 'euch', 'sie'],
    timeLimit: 60,
  },
  {
    id: 'g1_writing',
    type: 'writing',
    level: 'A1',
    title: 'Schriftlicher Ausdruck (Writing)',
    topic: 'E-Mail an den Lehrer (Email to the teacher)',
    instruction: 'Schreiben Sie eine kurze E-Mail (ca. 30 Wörter). Sie können am Samstag nicht zum Deutschkurs kommen. Schreiben Sie an Ihren Lehrer Herrn Wagner.',
    content: 'Schreiben Sie:\n1. Warum kommen Sie nicht?\n2. Entschuldigen Sie sich.\n3. Wann kommen Sie wieder?',
    grammarRule: 'Formal salutation, apologizing, subordinate clauses with "weil".',
    exampleAnswer: 'Sehr geehrter Herr Wagner, ich kann am Samstag leider nicht zum Deutschkurs kommen, weil ich krank bin. Bitte entschuldigen Sie mein Fehlen. Nächste Woche bin ich wieder im Kurs. Viele Grüße, [Ihr Name]',
    timeLimit: 900,
  },
  {
    id: 'g1_speaking',
    type: 'speaking',
    level: 'A1',
    title: 'Mündlicher Ausdruck (Speaking Simulation)',
    topic: 'Einkaufen im Supermarkt (Shopping)',
    instruction: 'Stellen Sie sich vor, Sie sind im Supermarkt. Fragen Sie nach dem Preis von Äpfeln. (Type what you would say to simulate a spoken answer.)',
    content: 'Fragen Sie nach dem Preis und kaufen Sie ein Kilo.',
    grammarRule: 'Interrogative sentence structure and using numbers/quantities.',
    exampleAnswer: 'Entschuldigung, wie viel kostet ein Kilo Äpfel? Ich möchte bitte ein Kilo kaufen. Danke!',
    timeLimit: 120,
  },

  // ==================== LEVEL A2 ====================
  {
    id: 'g2_reading',
    type: 'reading',
    level: 'A2',
    title: 'Leseverstehen (Reading)',
    topic: 'Ein Tag in München (A Day in Munich)',
    instruction: 'Lesen Sie den Text und verstehen Sie die Absicht. (Read the text and understand the meaning.)',
    content: 'Liebe Sarah, gestern war ich in München. Ich habe den Englischen Garten besucht und dort ein Eis gegessen. Danach war ich im Deutschen Museum. Das war sehr interessant! Am Abend haben wir in einem bayerischen Restaurant zu Abend gegessen. Morgen fahre ich zurück nach Berlin.',
    grammarRule: 'Past tense (Perfekt) of verbs with auxiliary verbs "haben" or "sein".',
    exampleAnswer: 'Der Absender war gestern in München, hat ein Museum besucht und im Restaurant gegessen.',
    timeLimit: 600,
  },
  {
    id: 'g2_grammar',
    type: 'grammar',
    level: 'A2',
    title: 'Grammatik (Grammar)',
    topic: 'Lokalpräpositionen (Local Prepositions)',
    instruction: 'Wählen Sie die richtige Präposition. (Choose the correct preposition.)',
    content: 'Am Wochenende gehen wir ______ Kino, um einen neuen Film zu sehen.',
    grammarRule: 'Accusative direction preposition "in" combined with "das" (= ins).',
    exampleAnswer: 'ins',
    options: ['im', 'ins', 'nach', 'zu'],
    timeLimit: 60,
  },
  {
    id: 'g2_vocabulary',
    type: 'vocabulary',
    level: 'A2',
    title: 'Wortschatz (Vocabulary)',
    topic: 'Einkaufen und Essen (Shopping and Food)',
    instruction: 'Welches Wort passt in die Lücke? (Which word fits in the blank?)',
    content: 'Ich möchte ein ______ kaufen, weil ich wirklich hungrig bin.',
    grammarRule: 'Noun gender and accusative case usage.',
    exampleAnswer: 'Brötchen',
    options: ['Auto', 'Brötchen', 'Fahrrad', 'Buch'],
    timeLimit: 60,
  },
  {
    id: 'g2_writing',
    type: 'writing',
    level: 'A2',
    title: 'Schriftlicher Ausdruck (Writing)',
    topic: 'Einladung zur Geburtstagsparty (Birthday Invitation)',
    instruction: 'Schreiben Sie eine E-Mail an einen Kollegen (ca. 40-50 Wörter). Laden Sie ihn zu Ihrer Party ein.',
    content: 'Sagen Sie:\n1. Wann und wo ist die Party?\n2. Warum feiern Sie?\n3. Was sollen die Gäste mitbringen?',
    grammarRule: 'Sentence structure in informal emails, prepositions of time ("an", "um").',
    exampleAnswer: 'Lieber Max, ich lade dich herzlich zu meiner Geburtstagsparty am Samstag um 20 Uhr bei mir zu Hause ein! Ich feiere meinen 30. Geburtstag. Bring bitte gute Laune und etwas Saft mit! Viele Grüße, [Dein Name]',
    timeLimit: 900,
  },
  {
    id: 'g2_speaking',
    type: 'speaking',
    level: 'A2',
    title: 'Mündlicher Ausdruck (Speaking Simulation)',
    topic: 'Wegbeschreibung (Giving Directions)',
    instruction: 'Erklären Sie einem Passanten auf der Straße den Weg zum Hauptbahnhof. (Type what you would say.)',
    content: 'Erklären Sie dem Touristen, er solle geradeaus gehen up to the traffic light, dann an der Ampel rechts abbiegen.',
    grammarRule: 'Imperative sentence structure: "Gehen Sie...", "Biegen Sie...".',
    exampleAnswer: 'Gehen Sie zuerst geradeaus bis zur Ampel. An der Ampel biegen Sie dann nach rechts ab. Der Hauptbahnhof ist direkt auf der linken Seite.',
    timeLimit: 120,
  },

  // ==================== LEVEL B1 ====================
  {
    id: 'g3_reading',
    type: 'reading',
    level: 'B1',
    title: 'Leseverstehen (Reading)',
    topic: 'Gesunde Ernährung im Alltag (Healthy Eating)',
    instruction: 'Lesen Sie den Zeitungsartikel und fassen Sie das Hauptargument zusammen. (Read the article and summarize the main argument.)',
    content: 'Gesunde Ernährung wird in unserer heutigen stressigen Gesellschaft immer wichtiger. Viele Menschen greifen aus Zeitmangel zu ungesunden Fertiggerichten, obwohl diese oft extrem viel Zucker, Salz und gesättigte Fette enthalten. Ernährungsexperten raten dringend dazu, am Wochenende frisch zu kochen und Portionen für die Arbeitswoche einzufrieren, was als "Meal Prepping" bekannt ist.',
    grammarRule: 'Relative clauses (Relativsätze) and causal clauses.',
    exampleAnswer: 'Fertiggerichte sind ungesund. Meal Prepping am Wochenende ist eine gesunde, zeitsparende Alternative für die Arbeitswoche.',
    timeLimit: 600,
  },
  {
    id: 'g3_grammar',
    type: 'grammar',
    level: 'B1',
    title: 'Grammatik (Grammar)',
    topic: 'Konjunktiv II (Subjunctive II)',
    instruction: 'Wählen Sie das passende konjugierte Verb im Konjunktiv II. (Choose the correct Subjunctive II verb.)',
    content: 'Wenn ich am Wochenende mehr Freizeit ______, würde ich ein neues Hobby lernen.',
    grammarRule: 'Hypothetical condition clauses using "hätte" (subjunctive II).',
    exampleAnswer: 'hätte',
    options: ['habe', 'hätte', 'hatte', 'hast'],
    timeLimit: 60,
  },
  {
    id: 'g3_vocabulary',
    type: 'vocabulary',
    level: 'B1',
    title: 'Wortschatz (Vocabulary)',
    topic: 'Gesundheit und Fitness (Health and Fitness)',
    instruction: 'Welches Reflexivverb passt am besten in den Kontext? (Which reflexive verb fits best?)',
    content: 'Der Arzt hat mir empfohlen, mich regelmäßig an der frischen Luft zu ______.',
    grammarRule: 'Reflexive verbs: "sich bewegen" (to move/exercise).',
    exampleAnswer: 'bewegen',
    options: ['schlafen', 'bewegen', 'entspannen', 'erholen'],
    timeLimit: 60,
  },
  {
    id: 'g3_writing',
    type: 'writing',
    level: 'B1',
    title: 'Schriftlicher Ausdruck (Writing)',
    topic: 'Meinung zu sozialen Medien (Opinion on Social Media)',
    instruction: 'Schreiben Sie einen Blogbeitrag (ca. 75-80 Wörter) über soziale Medien.',
    content: 'Geben Sie Ihre Meinung zu folgenden Punkten:\n1. Warum nutzen Sie soziale Netzwerke?\n2. Was sind die potenziellen Gefahren?\n3. Wie schätzen Sie die Relevanz im Alltag ein?',
    grammarRule: 'Connecting sentences: "...einerseits / andererseits...", "meiner Meinung nach...".',
    exampleAnswer: 'Meiner Meinung nach sind soziale Medien heute unverzichtbar, um mit Freunden leicht in Kontakt zu bleiben. Einerseits bieten sie unendliche Kommunikation. Andererseits besteht jedoch das Risiko einer Sucht oder des Datenmissbrauchs. Wir sollten sie also mit klarem Zeitlimit nutzen.',
    timeLimit: 900,
  },
  {
    id: 'g3_speaking',
    type: 'speaking',
    level: 'B1',
    title: 'Mündlicher Ausdruck (Speaking Simulation)',
    topic: 'Umweltschutz im Alltag (Environmental Protection)',
    instruction: 'Sprechen Sie kurz über Ihre Meinung zu Umweltschutz im Alltag. (Type what you would present.)',
    content: 'Erläutern Sie: Was tun Sie persönlich für den Umweltschutz? Warum ist das Thema wichtig?',
    grammarRule: 'Structure of a presentation, stating opinions, expressing importance.',
    exampleAnswer: 'Meiner Meinung nach ist Umweltschutz extrem wichtig für unsere Zukunft. Ich persönlich versuche, Plastikmüll zu vermeiden, trenne meinen Müll und fahre oft mit dem Fahrrad statt mit dem Auto. Jeder kleine Schritt hilft.',
    timeLimit: 120,
  },

  // ==================== LEVEL B2 ====================
  {
    id: 'g4_reading',
    type: 'reading',
    level: 'B2',
    title: 'Leseverstehen (Reading)',
    topic: 'Künstliche Intelligenz am Arbeitsplatz (AI at Work)',
    instruction: 'Lesen Sie den Text und analysieren Sie die Argumentation des Autors. (Read and analyze the argument.)',
    content: 'Die weitreichende Integration von Künstlicher Intelligenz (KI) in moderne Arbeitsprozesse revolutioniert gegenwärtig zahlreiche Wirtschaftszweige in rasantem Tempo. Während Optimisten hervorheben, dass repetitive Routineaufgaben effizient automatisiert werden und dadurch wertvolle Ressourcen für kreative Tätigkeiten entstehen, äußern Kritiker berechtigte Sorgen über den schleichenden Verlust qualifizierter Arbeitsplätze. Eine zukunftsorientierte Transformation verlangt deshalb kontinuierliche Umschulung.',
    grammarRule: 'Complex double-conjunctions ("während..."), nominal styles, and passive sentences.',
    exampleAnswer: 'Die Einführung von KI führt zu einer Rationalisierung und verlangt andauernde Bildungskonzepte für die Arbeitnehmer.',
    timeLimit: 600,
  },
  {
    id: 'g4_grammar',
    type: 'grammar',
    level: 'B2',
    title: 'Grammatik (Grammar)',
    topic: 'Genitivpräpositionen (Genitive Prepositions)',
    instruction: 'Wählen Sie den korrekten Artikel für die Präposition "trotz". (Choose the correct genitive article.)',
    content: 'Trotz ______ schlechten Wetters ließen sich die engagierten Wanderer nicht aufhalten.',
    grammarRule: 'Genitive case triggered by the preposition "trotz" for a masculine singular noun ("des Wetters").',
    exampleAnswer: 'des',
    options: ['dem', 'das', 'des', 'den'],
    timeLimit: 60,
  },
  {
    id: 'g4_vocabulary',
    type: 'vocabulary',
    level: 'B2',
    title: 'Wortschatz (Vocabulary)',
    topic: 'Herausforderungen & Erfolge (Challenges & Successes)',
    instruction: 'Welches gehobene Verb passt am besten in die Lücke? (Which advanced verb fits best?)',
    content: 'Der Projektleiter hat die äußerst anspruchsvolle Aufgabe mit Bravour ______.',
    grammarRule: 'Collocational usage: "eine Aufgabe bewältigen".',
    exampleAnswer: 'bewältigt',
    options: ['gelöst', 'bewältigt', 'abgebrochen', 'versagt'],
    timeLimit: 60,
  },
  {
    id: 'g4_writing',
    type: 'writing',
    level: 'B2',
    title: 'Schriftlicher Ausdruck (Writing)',
    topic: 'Bewerbung um ein Praktikum (Internship Application)',
    instruction: 'Verfassen Sie ein professionelles, formelles Bewerbungsschreiben (ca. 100-120 Wörter).',
    content: 'Schreiben Sie an die Marketing-Abteilung der Firma:\n1. Warum interessieren Sie sich für diese Firma?\n2. Welche Qualifikationen oder Vorkenntnisse bringen Sie mit?',
    grammarRule: 'Formal German business writing standards, correct address/greeting forms, and nominal-verbal structure.',
    exampleAnswer: 'Sehr geehrte Damen und Herren, mit großem Interesse bewerbe ich mich um ein Marketing-Praktikum. Da ich bereits praktische Vorkenntnisse im Kampagnenmanagement besitze, reizt mich Ihr Unternehmen sehr. Ich freue mich auf ein persönliches Gespräch. Mit freundlichen Grüßen.',
    timeLimit: 900,
  },
  {
    id: 'g4_speaking',
    type: 'speaking',
    level: 'B2',
    title: 'Mündlicher Ausdruck (Speaking Simulation)',
    topic: 'Pro & Kontra: Homeoffice (Working from Home)',
    instruction: 'Diskutieren Sie differenziert über das Thema Homeoffice. (Type what you would present as text.)',
    content: 'Wägen Sie Argumente ab wie: Produktivitätssteigerung versus soziale Isolation, und die Trennung von Berufs- und Privatleben.',
    grammarRule: 'Advanced argumentative structures: "Demgegenüber lässt sich einwenden...", "Ein wesentliches Argument dafür ist...".',
    exampleAnswer: 'Das Arbeiten im Homeoffice spart wertvolle Wegezeiten und verbessert oft die Balance, birgt jedoch das Risiko der Isolation und des Verschwimmens von Beruf und Freizeit.',
    timeLimit: 120,
  }
];

export default function GermanMockTest() {
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'B1' | 'B2'>('A1');
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadData, setLeadData] = useState({ name: '', email: '', phone: '' });
  const [honeypot, setHoneypot] = useState('');
  const [isScoring, setIsScoring] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState("Auswertung wird durchgeführt...");

  const activeQuestions = GERMAN_QUESTIONS.filter(q => q.level === selectedLevel);

  
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
    setTimeLeft(activeQuestions[0].timeLimit);
  };

  const handleNext = () => {
    if (currentStep < activeQuestions.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setTimeLeft(activeQuestions[nextStep].timeLimit);
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
    const summary = activeQuestions.map(q => {
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
    
    // Anti-spam Honeypot protection
    if (honeypot.trim()) {
      console.warn("Spam execution suspected & stopped silently via Honeypot check.");
      setShowLeadForm(false);
      beginExam();
      return;
    }
    
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
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      
      // Initialize a standard A4 portrait PDF (210mm x 297mm)
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth(); // 210
      const pageHeight = doc.internal.pageSize.getHeight(); // 297
      
      // Theme colors
      const colorDarkBlue = [15, 23, 42];  // #0f172a (sleek slate)
      const colorGold = [255, 206, 0];    // #FFCE00 (Language World Gold)
      const colorGray = [100, 116, 139];   // slate gray
      const colorLightGray = [248, 250, 252]; // fine off-white secondary panels
      
      // Helper to draw horizontal lines
      const drawLine = (y: number) => {
        doc.setDrawColor(226, 232, 240); // tailwind slate-200
        doc.setLineWidth(0.5);
        doc.line(15, y, pageWidth - 15, y);
      };

      // 1. BRANDING HEADER
      // Top luxury bar (Accent gold line)
      doc.setFillColor(colorGold[0], colorGold[1], colorGold[2]);
      doc.rect(0, 0, pageWidth, 6, 'F');
      
      // Main title "LANGUAGE WORLD"
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(colorDarkBlue[0], colorDarkBlue[1], colorDarkBlue[2]);
      doc.text("LANGUAGE WORLD", 15, 22);
      
      // Subtitle tagline
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
      doc.text("Pakistan's Premier German Language & Exam Preparation Institute", 15, 27);
      
      // Document identifier on right
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(colorDarkBlue[0], colorDarkBlue[1], colorDarkBlue[2]);
      doc.text("OFFICIAL REPORT", pageWidth - 15, 22, { align: 'right' });
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
      const todayDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      doc.text(`Date of Issue: ${todayDate}`, pageWidth - 15, 27, { align: 'right' });
      
      drawLine(33);
      
      // 2. CANDIDATE PROFILE & TEST OVERVIEW (Grid Layout)
      doc.setFillColor(colorLightGray[0], colorLightGray[1], colorLightGray[2]);
      doc.roundedRect(15, 38, pageWidth - 30, 32, 4, 4, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(colorDarkBlue[0], colorDarkBlue[1], colorDarkBlue[2]);
      doc.text("CANDIDATE DOSSIER", 20, 45);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Full Name:      ${leadData.name || 'Anonymous Learner'}`, 20, 52);
      doc.text(`Email Address:  ${leadData.email || 'N/A'}`, 20, 58);
      doc.text(`Contact Phone:  ${leadData.phone || 'N/A'}`, 20, 64);
      
      doc.setFont('Helvetica', 'bold');
      doc.text("TEST SPECIFICATIONS", 120, 45);
      doc.setFont('Helvetica', 'normal');
      doc.text("Subject:           German Language Evaluation", 120, 52);
      doc.text("Format:          Dynamic Placement Assessment", 120, 58);
      doc.text("Proctor:          Pakistan's First German AI Tutor", 120, 64);

      // 3. MAIN SCORE CIRCLE & CERTIFICATION DISPLAY
      const scoreY = 78;
      doc.setFillColor(colorDarkBlue[0], colorDarkBlue[1], colorDarkBlue[2]);
      doc.roundedRect(15, scoreY, pageWidth - 30, 40, 6, 6, 'F');
      
      // Gold accent block under total score badge
      doc.setFillColor(colorGold[0], colorGold[1], colorGold[2]);
      doc.rect(15, scoreY + 38, pageWidth - 30, 2, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text("EVALUATED CEFR LEVEL COMPETENCY", 25, scoreY + 15);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text("Your answers were run against complete lexical, grammar, reading,", 25, scoreY + 22);
      doc.text("and speaking templates according to standard Goethe-Zertifikat grading criteria.", 25, scoreY + 26);
      
      // Big bold CEFR Indicator badge
      doc.setFillColor(colorGold[0], colorGold[1], colorGold[2]);
      doc.circle(pageWidth - 35, scoreY + 20, 14, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(colorDarkBlue[0], colorDarkBlue[1], colorDarkBlue[2]);
      doc.text(results?.score || "A1", pageWidth - 35, scoreY + 22, { align: 'center' });
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(colorDarkBlue[0], colorDarkBlue[1], colorDarkBlue[2]);
      doc.text("CEFR", pageWidth - 35, scoreY + 12, { align: 'center' });

      // 4. MODULE FEEDBACK SECTION
      let currentY = 126;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(colorDarkBlue[0], colorDarkBlue[1], colorDarkBlue[2]);
      doc.text("MODULE-WISE PERFORMANCE ANALYSIS", 15, currentY);
      currentY += 6;
      
      if (results?.feedback) {
        Object.entries(results.feedback).forEach(([moduleName, notes]: [string, any]) => {
          // If the text overflows page height, insert new page
          if (currentY + 36 > pageHeight - 30) {
            doc.addPage();
            // Reprint thin top brand line on next page
            doc.setFillColor(colorGold[0], colorGold[1], colorGold[2]);
            doc.rect(0, 0, pageWidth, 4, 'F');
            currentY = 20;
          }
          
          doc.setFillColor(248, 250, 252); // Tailwind slate-50 background for feedback cards
          doc.roundedRect(15, currentY, pageWidth - 30, 26, 3, 3, 'F');
          
          // Draw thin left gold stripe on feedback card
          doc.setFillColor(colorGold[0], colorGold[1], colorGold[2]);
          doc.rect(15, currentY, 2.5, 26, 'F');
          
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(colorDarkBlue[0], colorDarkBlue[1], colorDarkBlue[2]);
          doc.text(moduleName.toUpperCase(), 21, currentY + 6);
          
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85); // dark charcoal text
          
          // Auto wrap feedback text
          const splitText = doc.splitTextToSize(String(notes), pageWidth - 42);
          doc.text(splitText, 21, currentY + 11.5);
          
          currentY += 30;
        });
      }

      // 5. IMPROVEMENT RECOMMENDATIONS SECTION
      if (results?.improvement) {
        if (currentY + 45 > pageHeight - 30) {
          doc.addPage();
          doc.setFillColor(colorGold[0], colorGold[1], colorGold[2]);
          doc.rect(0, 0, pageWidth, 4, 'F');
          currentY = 20;
        }
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(colorDarkBlue[0], colorDarkBlue[1], colorDarkBlue[2]);
        doc.text("EXPERT ROADMAP & SUGGESTED ACTION ITEMS", 15, currentY);
        currentY += 6;
        
        doc.setFillColor(254, 253, 246); // Tailwind yellow-50
        doc.setDrawColor(254, 240, 138); // Tailwind yellow-200
        doc.setLineWidth(0.5);
        
        // Auto wrap improvement text first to calculate card height
        const wrappedImprovement = doc.splitTextToSize(results.improvement, pageWidth - 40);
        const cardHeight = Math.max(wrappedImprovement.length * 4.2 + 10, 25);
        
        doc.roundedRect(15, currentY, pageWidth - 30, cardHeight, 4, 4, 'FD');
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(133, 77, 14); // Dark yellow label
        doc.text("AI TUTOR DEVELOPMENTAL ADVICE", 20, currentY + 6);
        
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(wrappedImprovement, 20, currentY + 12.5);
        
        currentY += cardHeight + 10;
      }

      // 6. OFFICIAL FOOTER / STAMP (Always visible at the bottom of the current page)
      const footerY = pageHeight - 25;
      drawLine(footerY - 2);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colorGray[0], colorGray[1], colorGray[2]);
      doc.text("Official evaluation copy generated by Language World Karachi. Broaden your global communication gates.", 15, footerY + 3);
      doc.text("To verify or check upcoming physical batches near NIPA, visit: thelanguageworld.com", 15, footerY + 7);
      
      // Stamp Badge on bottom right
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(colorDarkBlue[0], colorDarkBlue[1], colorDarkBlue[2]);
      doc.text("LANGUAGE WORLD CERTIFIED", pageWidth - 15, footerY + 3, { align: 'right' });
      doc.setFont('Helvetica', 'normal');
      doc.text("AUTHENTIC COPY", pageWidth - 15, footerY + 7, { align: 'right' });

      // Save document
      doc.save(`German_Placement_Report_${leadData.name || 'Student'}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      // Clean fallback: Try simple screenshotting with html2canvas as backup!
      try {
        if (reportRef.current) {
          const canvas = await html2canvas(reportRef.current, {
            scale: 1.5,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          });
          const imgData = canvas.toDataURL('image/png', 1.0);
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
          pdf.save(`German_Report_${leadData.name || 'Student'}.pdf`);
        }
      } catch (backupError) {
        console.error("Backup PDF generation failed:", backupError);
      }
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
        testType: 'German',
        score: results?.score || selectedLevel,
      });
      pdf.save(`German_Certificate_${(leadData.name || "Student").trim().replace(/\s+/g, '_')}.pdf`);
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

          {/* Level Selection Dropdown */}
          <div className="mb-10 max-w-md bg-soft-gray p-6 rounded-[2rem] border border-gray-100 flex flex-col gap-3">
            <label htmlFor="proficiency-level-select" className="block text-xs font-black text-accent uppercase tracking-widest pl-2">
              Select Your Proficiency Level (Ziel-Niveau)
            </label>
            <div className="relative">
              <select
                id="proficiency-level-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as 'A1' | 'A2' | 'B1' | 'B2')}
                className="w-full bg-white text-accent font-extrabold px-5 py-4 rounded-xl border-2 border-transparent focus:border-[#FFCE00] outline-none transition-all cursor-pointer appearance-none shadow-sm text-base pr-12"
              >
                <option value="A1">CEFR A1 (Anfänger / Beginner)</option>
                <option value="A2">CEFR A2 (Grundlegende Kenntnisse / Elementary)</option>
                <option value="B1">CEFR B1 (Fortgeschrittene Sprachverwendung / Intermediate)</option>
                <option value="B2">CEFR B2 (Selbstständige Sprachverwendung / Upper Intermediate)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-accent">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 font-bold leading-relaxed pl-2">
              All tasks, reading items, active spelling-checks, grammar prompts, and audio simulations will dynamically cater to CEFR {selectedLevel} standards.
            </p>
          </div>

          <button onClick={startTest} className="btn-primary w-full md:w-auto px-12 py-5 text-xl rounded-full flex items-center justify-center gap-3 hover:scale-105 transition-transform bg-[#FFCE00] hover:bg-[#FFCE00]/90 text-black border-none">
            Begin {selectedLevel} Assessment <ArrowRight size={24} />
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

          {/* Anti-spam visually hidden honeypot input */}
          <div className="absolute opacity-0 w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <label htmlFor="german_middle_name">Please leave this field empty</label>
            <input 
              type="text" 
              id="german_middle_name" 
              name="german_middle_name" 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="new-password"
            />
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h3 className="text-4xl font-black text-accent">Einstufungsergebnis</h3>
          {!isScoring && results && (
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={downloadPDF}
                disabled={isDownloading || isDownloadingCertificate}
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

  const currentQuestion = activeQuestions[currentStep];

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
            {currentStep === activeQuestions.length - 1 ? 'Beenden' : 'Weiter (Next)'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100 h-2 relative">
        <motion.div 
          className="h-full bg-[#FFCE00]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / activeQuestions.length) * 100}%` }}
        />
        <div className="absolute top-4 right-8 text-[10px] font-black text-accent bg-yellow-400 px-3 py-1 rounded-full shadow-sm">
          AUFGABE {currentStep + 1} VON {activeQuestions.length}
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
