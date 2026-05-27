import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { COURSES, CONTACT_INFO } from "../constants/data";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ArrowRight, BookOpen, Clock, Users, Award, MessageCircle, ChevronDown } from "lucide-react";
import GermanLearningTools from "../components/german/GermanLearningTools";
import GermanMockTest from "../components/german/GermanMockTest";
import PTEMockTest from "../components/pte/PTEMockTest";
import IELTSMockTest from "../components/ielts/IELTSMockTest";
import { useModals } from "../components/ModalContext";
import SEO from "../components/common/SEO";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const course = COURSES.find(c => c.id === id);
  const { openApplyModal } = useModals();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const germanFaqs = [
    { q: "What are the fees for German language courses in Karachi?", a: "The fees for German language courses in Karachi vary depending on the level and class type. Please contact Language World Institute for the latest course fee details and schedules." },
    { q: "Is German difficult for beginners?", a: "German is not difficult if you learn with proper guidance and regular practice. Beginners can easily start speaking basic German within a few weeks." },
    { q: "Can I study in Germany after learning German?", a: "Yes, learning German can help you study in Germany, especially for German-taught programs and daily life communication. Many universities also offer English-taught programs." },
    { q: "Which German level is required for Germany?", a: "Most German universities require B1 or B2 level German for German-taught programs. The required level may vary depending on the university and course." },
    { q: "Do you offer online German language classes?", a: "Yes, Language World Institute offers online German language classes with live sessions, interactive learning, and flexible timings for students across Pakistan." },
    { q: "How can I register for Goethe exams in Karachi?", a: "You can register for Goethe exams through the official Goethe-Institut website or by contacting an authorized exam center in Karachi." },
  ];

  if (!course) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-4xl font-bold text-accent mb-4">Course Not Found</h2>
        <Link to="/courses" className="btn-primary">View All Courses</Link>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi Language World, I'm interested in enrolling in the *${course.title}* course. I would like to consult with an expert regarding batch timings, fee structures, and course outlines. Could you please assist me?`
  );
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${whatsappMessage}`;

  const isGerman = id === "german-language";
  const isIelts = id === "ielts-preparation";
  const isPte = id === "pte-preparation";
  const isLanguageCert = id === "language-cert";
  const isBusinessCommunication = id === "business-communication";
  
  let seoTitle = `${course.title} Preparation Course`;
  let seoDescription = `Get high scores with our professional ${course.title} classes in Karachi. Interactive batches, practice mock tests, expert faculty and flexible timings.`;
  let seoKeywords = `Best ${course.title} preparation Karachi, ${course.title} course Karachi, study in Germany, Language World Karachi, German school Karachi`;

  if (isGerman) {
    seoTitle = "German Language Course in Karachi | Goethe & ÖSD Exam Prep | Language World";
    seoDescription = "Master German with Pakistan's first AI-powered German tutor and senior certified instructors. Comprehensive preparation for A1, A2, B1, and B2 Goethe, ÖSD & ECL exams in Karachi.";
    seoKeywords = "German language Pakistan, German A1 course Karachi, Goethe exam preparation Karachi, ÖSD preparation Karachi, learn German in Pakistan, best German language institute in Karachi, German translation, spouse visa German, Germany study visa";
  } else if (isIelts) {
    seoTitle = "Best IELTS Language Centre in Karachi | Top IELTS Preparation Center Pakistan";
    seoDescription = "Achieve your target 7.5+ band score with Language World, recognized as the best IELTS language centre in Karachi, Pakistan. High-scoring classes for Academic, General Training, and UKVI IELTS.";
    seoKeywords = "Best IELTS language centre in Karachi, IELTS preparation Pakistan, IELTS Academic vs General Training, IELTS UKVI Pakistan, IELTS coaching Karachi, British Council test prep, IELTS institute in Karachi, learn English Pakistan, study abroad guidance";
  } else if (isPte) {
    seoTitle = "Best PTE Preparation Course in Karachi | PTE Academic vs General";
    seoDescription = "Get high scores in Pearson Test of English (PTE) with Language World, the best PTE preparation institute in Karachi, Pakistan. Learn PTE Academic for visa & PTE General.";
    seoKeywords = "Best PTE coaching in Karachi, PTE Academic vs General, PTE preparation Pakistan, Pearson Test of English Karachi, Pearson test prep, study visa Australia PTE, PTE exam coaching Karachi, standard English center Gulshan-e-Iqbal";
  } else if (isLanguageCert) {
    seoTitle = "Best LanguageCert Preparation in Karachi | Official SELT Classes";
    seoDescription = "Achieve guaranteed success in LanguageCert SELT (A1, A1, B1, B2, C1, C2) exams with Language World, the best language certification institute in Karachi, Pakistan.";
    seoKeywords = "Best LanguageCert coaching in Karachi, LanguageCert Academic vs General, LanguageCert SELT Pakistan, LanguageCert preparation Karachi, UK spouse visa English test, learn English in Karachi, LanguageCert institute Pakistan";
  } else if (isBusinessCommunication) {
    seoTitle = "Best Business Communication Course in Karachi | Corporate English Training";
    seoDescription = "Elevate your professional career with the best Business Communication & corporate English training program in Karachi at Language World. Speak fluently, write perfect emails, and present with high confidence.";
    seoKeywords = "Best Business Communication course in Karachi, Corporate English training Karachi, professional English classes, public speaking course Karachi, email writing training Pakistan, business presentation skills, workplace language course Pakistan";
  }

  return (
    <div className="flex flex-col">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={course.image}
      />
      {/* Course Hero */}
      <section className="relative py-24 bg-accent text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover opacity-20 blur-sm"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary font-bold text-sm mb-6 border border-primary/20"
            >
              {course.subtitle}
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold mb-6"
            >
              {course.title.toLowerCase().endsWith("preparation") ? (
                <>
                  {course.title.substring(0, course.title.toLowerCase().lastIndexOf("preparation")).trim()} <br /> 
                  <span className="text-primary italic">Preparation</span>
                </>
              ) : (
                <>
                  {course.title} <br /> 
                  <span className="text-primary italic">Preparation</span>
                </>
              )}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/80 leading-relaxed mb-8"
            >
              {course.description} We provide comprehensive training to help you achieve your goals and excel in your {course.title} examination.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => openApplyModal(course.title)}
                className="btn-primary cursor-pointer"
              >
                Enroll Now
              </button>
              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noreferrer"
                className="btn-outline flex items-center justify-center gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white px-6 py-3 rounded-full font-bold transition-all"
              >
                <MessageCircle size={20} className="text-[#25D366] fill-[#25D366] shrink-0" /> Ask an Expert
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-extrabold text-accent mb-8">Course Curriculum & Details</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our {course.title} program is meticulously designed by experts with years of experience. We focus on practical application, vocabulary building, and intensive practice sessions to ensure high performance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {[
                  { icon: <BookOpen className="text-primary" />, title: "Study Material", desc: "Comprehensive up-to-date resources." },
                  { icon: <Clock className="text-primary" />, title: "Flexible Batches", desc: "Choose from morning or evening slots." },
                  { icon: <Users className="text-primary" />, title: "Live Prep", desc: "Interactive sessions with real-time feedback." },
                  { icon: <Award className="text-primary" />, title: "Certification", desc: "Course completion certificate provided." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 bg-soft-gray rounded-2xl border border-gray-100">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-accent">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold text-accent mb-6">Key Learning Outcomes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {course.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 border border-soft-gray rounded-xl">
                    <CheckCircle2 className="text-primary shrink-0" size={20} />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Learning tools for specific courses */}
              {id === "german-language" && (
                <div className="space-y-12">
                  <GermanMockTest />
                  <GermanLearningTools />

                  {/* German Language Preparation SEO Block */}
                  <div className="mt-16 bg-gradient-to-br from-accent/5 to-primary/5 rounded-[2.5rem] p-8 md:p-12 border border-primary/10 shadow-sm space-y-10 text-left">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest border border-primary/20">
                        Course Overview
                      </div>
                      <h3 className="text-3xl font-black text-accent tracking-tight">
                        German Language Course Preparation in Pakistan
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-base">
                        Welcome to <strong>Language World Karachi</strong>, Pakistan's leading standard language school for <strong>German Language preparation</strong>. 
                        Whether you are preparing for study visa requirements, spouse reunion visa integration, or moving ahead in international professional domains, 
                        our intensive courses are customized to help you secure passing grades in <strong>Goethe-Zertifikat</strong>, <strong>ÖSD (Austrian German Language Diploma)</strong>, 
                        and <strong>ECL exams</strong> on your first attempt.
                      </p>
                    </div>

                    {/* CEFR Grid */}
                    <div className="space-y-6">
                      <h4 className="text-xl font-extrabold text-accent flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        Our Comprehensive CEFR German Language Curriculum
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-transform duration-300">
                          <span className="text-xs font-black text-primary tracking-widest uppercase">Level A1 — Beginner</span>
                          <h5 className="font-bold text-accent text-lg mt-1 mb-2">German A1 Course in Karachi</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Excellent starting point for absolute beginners. Crucial for spouse reunion visa requirements (<strong>Start Deutsch 1</strong>). Learn everyday greetings, self-introductions, fundamental vocabulary, and basic question building blocks in German.
                          </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-transform duration-300">
                          <span className="text-xs font-black text-primary tracking-widest uppercase">Level A2 — Elementary</span>
                          <h5 className="font-bold text-accent text-lg mt-1 mb-2">German A2 Course in Karachi</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Take your German comprehension to the next level. Learn to hold full routine conversations, discuss personal background, express shopping preferences, tell comprehensive stories, and build a stronger grammatical foundation.
                          </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-transform duration-300">
                          <span className="text-xs font-black text-primary tracking-widest uppercase">Level B1 — Intermediate</span>
                          <h5 className="font-bold text-accent text-lg mt-1 mb-2">German B1 Exam Preparation Guide</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            The minimum level required to qualify for academic study at <strong>Studienkolleg</strong> in Germany. Gain ability to write cohesive texts, comprehend complex speech inputs, provide detailed opinions, and tackle challenging listening exercises.
                          </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-transform duration-300">
                          <span className="text-xs font-black text-primary tracking-widest uppercase">Level B2 — Upper-Intermediate</span>
                          <h5 className="font-bold text-accent text-lg mt-1 mb-2">German B2 Professional Training</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            A mandatory requirement for engineering careers, medical doctors, nursing professionals, and direct postgraduate degrees in German public universities. Attain fluent native interaction, read highly specialized papers, and speak spontaneously.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Why Choose Language World */}
                    <div className="space-y-6 pt-4">
                      <h4 className="text-xl font-extrabold text-accent flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        Why Choose Language World for German Language in Pakistan?
                      </h4>
                      <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                        <p className="leading-relaxed">
                          We stand out as Pakistan's first premium language preparation facility utilizing a mixed model of experienced bilingual human instructors coupled with <strong>Pakistan's First German AI Tutor</strong>. 
                          This powerful integration provides students with 24/7 continuous feedback, automated grading, customized grammar workbooks, and real-time interactive pronunciation simulation.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Goethe & ÖSD Exam Aligned Mock Tests</strong>: Practice real, simulated examination environments to boost your scores.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Interactive Audio Labs</strong>: Accent training and pronunciation corrections powered by advanced speech processing tools.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Tuition-Free University Guidance</strong>: Tailored counselling for students aiming to study in Germany's elite public education hubs.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Flexible Morning & Evening Batches</strong>: Convenient physical classes in Gulshan-e-Iqbal Karachi, alongside real-time live distance online classes.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick German Exam Preparation Tips */}
                    <div className="bg-white p-6 rounded-2xl border border-primary/10 mt-6 md:p-8">
                      <h5 className="font-bold text-accent text-base mb-2">🎯 Goethe, ÖSD, & ECL Exam Preparation Success Blueprint</h5>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Passing the official German certified exams from Pakistan requires a balanced focus on four modules: <strong>Hören (Listening)</strong>, <strong>Lesen (Reading)</strong>, <strong>Schreiben (Writing)</strong>, and <strong>Sprechen (Speaking)</strong>. 
                        With our <strong>best German language institute in Karachi</strong>, you gain access to thousands of vocabulary drill sheets, regular evaluation mock tests, model letters for the writing task, and continuous feedback. 
                        Use our active <strong>AI German Tutor App</strong> widget to test grammar rules, vocabulary conjugations, and prepare for Goethe exam registration rules effortlessly.
                      </p>
                    </div>
                  </div>

                  {/* German FAQs */}
                  <div className="mt-16">
                    <h3 className="text-2xl font-bold text-accent mb-8">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {germanFaqs.map((faq, i) => (
                        <div key={i} className="bg-soft-gray rounded-2xl border border-gray-100 overflow-hidden">
                          <button 
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full p-6 flex justify-between items-center text-left font-bold text-accent hover:bg-gray-100 transition-colors"
                          >
                            <span>{faq.q}</span>
                            <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-primary' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {openFaq === i && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-6 pb-6 text-sm text-gray-500 leading-relaxed"
                              >
                                {faq.a}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {id === "pte-preparation" && (
                <div className="mt-12 space-y-16">
                  <PTEMockTest />

                  {/* Enhanced PTE SEO Content Block */}
                  <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-[2.5rem] p-8 md:p-12 border border-primary/10 shadow-sm space-y-10 text-left">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest border border-primary/20">
                        Pakistan's Premier PTE Coaching Hub
                      </div>
                      <h3 className="text-3xl font-black text-accent tracking-tight">
                        PTE Preparation in Karachi — Pearson Test of English Guide
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-base">
                        The <strong>Pearson Test of English (PTE)</strong> is a computer-based English language test trusted by millions worldwide for study abroad and migration processes. 
                        As a recognized <strong>best PTE preparation institute in Karachi, Pakistan</strong>, Language World offers comprehensive strategic drills, real-time computerized mock simulations, and detailed grading reviews. 
                        Let our professional instructors help you master the speech-to-text algorithm and ace the test with confidence.
                      </p>
                    </div>

                    {/* PTE Academic vs PTE General */}
                    <div className="space-y-6">
                      <h4 className="text-xl font-extrabold text-accent flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        PTE Academic vs. PTE General Explained
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
                          <span className="text-xs font-black text-primary tracking-widest uppercase">For Elite Studies & Visas</span>
                          <h5 className="font-bold text-accent text-lg mt-1 mb-2">PTE Academic</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Specifically designed for university applications, academic programs, and migration pathways (approved 100% by Australian, New Zealand, & Irish colleges, and accepted by thousands of programs in the US, UK, and Canada). It tests real-world language skills under automated AI computerized evaluations, examining computer-integrated listening, writing, reading, and speaking skills.
                          </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
                          <span className="text-xs font-black text-[#FFCE00] tracking-widest uppercase mb-1 block">For General Communication & Settlement</span>
                          <h5 className="font-bold text-accent text-lg mb-2">PTE General</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Primarily recognized for international travel, employment goals, family reunion needs, or professional credentials. Unlike the academic version, PTE General focuses heavily on real-life, practical scenario scenarios to test a candidate's overall situational command rather than formal university classroom skills.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Why Choose Language World */}
                    <div className="space-y-6 pt-4">
                      <h4 className="text-xl font-extrabold text-accent flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        Why Choose Language World for Your PTE Journey?
                      </h4>
                      
                      <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                        <p className="leading-relaxed">
                          We run a purpose-built state-of-the-art computer testing lab designed specifically to mirror authentic Pearson examination centers. Our students in Karachi achieve high scores through special advantages we provide:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Algorithm-focused Training</strong>: Master specialized computer scoring strategies for Describe Image, Retell Lecture, and Write from Dictation tasks.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Realistic Dynamic Mock Tests</strong>: Authentic timed model exams simulating real Pearson constraints to calibrate your time management.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Microphone Calibration Labs</strong>: Ensure correct speaking speeds, accent moderation, and proper microphone placement.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Convenient Physical & Online Classes</strong>: High-tech physical classrooms in Gulshan-e-Iqbal near Nipa Karachi, alongside robust online formats across Pakistan.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Strategic Score Blueprint */}
                    <div className="bg-white p-6 rounded-2xl border border-primary/10 mt-6 md:p-8">
                      <h5 className="font-bold text-accent text-base mb-2">🎯 Achieve Your Target 79+ Score (Equivalent to IELTS Band 8)</h5>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Pearson’s automated AI grading engine prioritizes oral fluency, pronunciation clarity, and precise grammatical structures. Attempting the PTE exam without understanding template keys, oral flow metrics, and spelling guidelines is risky. At the <strong>best PTE coaching centre in Karachi</strong>, our specialized curriculum helps you master every section systematically. Start learning today with our practice mock app tools and secure your visa clearance effortlessly!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {id === "ielts-preparation" && (
                <div className="mt-12 space-y-16">
                  <IELTSMockTest />

                  {/* Enhanced IELTS SEO Content Block */}
                  <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-[2.5rem] p-8 md:p-12 border border-primary/10 shadow-sm space-y-10 text-left">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest border border-primary/20">
                        Pakistan's Best IELTS Language Centre
                      </div>
                      <h3 className="text-3xl font-black text-accent tracking-tight">
                        IELTS Preparation in Karachi — Master Academic, General Training & UKVI
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-base">
                        Securing a high band score is the ultimate gateway to study-abroad pathways and global relocation. 
                        As the <strong>best IELTS language centre in Karachi</strong>, Language World delivers a result-oriented curriculum aligned perfectly with official <strong>British Council</strong> and <strong>IDP IELTS</strong> assessment standards. 
                        Whether you need professional preparation for academic degrees, visa requirements, or permanent residency points, we offer custom coaching to build your confidence and pass successfully.
                      </p>
                    </div>

                    {/* Differentiating Academic vs General Training vs UKVI */}
                    <div className="space-y-6">
                      <h4 className="text-xl font-extrabold text-accent flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        IELTS Academic vs. IELTS General Training & UKVI Explained
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
                          <span className="text-xs font-black text-primary tracking-widest uppercase">For Higher Studies</span>
                          <h5 className="font-bold text-accent text-lg mt-1 mb-2">IELTS Academic</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Recommended for students intending to apply for undergraduate or postgraduate admissions in universities across Germany, UK, Canada, Australia, and USA. Tests your capability to understand and employ complex academic texts, formal writing tasks, and professional language structures.
                          </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
                          <span className="text-xs font-black text-primary tracking-widest uppercase">For Immigration & Work</span>
                          <h5 className="font-bold text-accent text-lg mt-1 mb-2">IELTS General Training</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Essential for migration applications (e.g., Canada Express Entry, Australia Skilled Independent visas) and secondary education or work training programs. Focuses on social English, letter-writing formats (formal, semi-formal, or informal), and everyday vocational context reading.
                          </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
                          <span className="text-xs font-black text-primary tracking-widest uppercase">UK Visa Requirement</span>
                          <h5 className="font-bold text-accent text-lg mt-1 mb-2">IELTS UKVI & SELT</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            A Secure English Language Test (SELT) approved strictly by the UK Home Office for spouse reunions, work permits, and study visas. It features the exact same difficulty and format as academic/general, but complies with specific auditing records to guarantee absolute verification.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Why Choose Language World */}
                    <div className="space-y-6 pt-4">
                      <h4 className="text-xl font-extrabold text-accent flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        Why Choose Language World for Your IELTS Journey?
                      </h4>
                      
                      <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                        <p className="leading-relaxed">
                          Language World Karachi is recognized as Pakistan's most trusted learning institute, delivering exceptional band improvements. Our classrooms are fully equipped with official exam templates, practice techniques, and resources. Our system sets us apart through custom learning enhancements:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Expert Certified Trainers</strong>: Guided by professional practitioners sharing exclusive high-band strategies, templates, and shortcuts.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Realistic Evaluation Mock Exams</strong>: Continuous full-length Listening, Reading, Writing, and Speaking simulations to track progress with diagnostic band metrics.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Individualized Writing Diagnostics</strong>: One-on-one evaluations for Task 1 and Task 2 essays to improve lexical resource, grammatical accuracy, and cohesion.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Flexible Class Models</strong>: Join physical classes in our state-of-the-art campus in Gulshan-e-Iqbal near Nipa, or interactive live online classes anywhere in Pakistan.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Strategic Band Blueprint */}
                    <div className="bg-white p-6 rounded-2xl border border-primary/10 mt-6 md:p-8">
                      <h5 className="font-bold text-accent text-base mb-2">🎯 Language World IELTS Success Masterclass Guidance</h5>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        To score a Band 7.5 or above in Pakistan, candidates must master the structural demands of each sub-test. From managing the 60-minute time limit in tough Reading tasks, handling diverse question formats (such as headings matching or true/false), to speaking fluidly without pauses, our classroom drills elevate your preparation. Join the <strong>best IELTS language centre in Karachi</strong>, and let our dedicated teachers guide you through registration, resources, and expert tips to excel.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {id === "language-cert" && (
                <div className="mt-12 space-y-16">
                  {/* Enhanced LanguageCert SEO Content Block */}
                  <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-[2.5rem] p-8 md:p-12 border border-primary/10 shadow-sm space-y-10 text-left">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest border border-primary/20">
                        Official LanguageCert Partner Success
                      </div>
                      <h3 className="text-3xl font-black text-accent tracking-tight">
                        LanguageCert Preparation in Karachi — Master SELT Academic & General Exams
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-base">
                        The <strong>LanguageCert</strong> international exams are modern, high-quality, and fast English language qualifications highly approved across the globe for university admissions and visa approvals. 
                        As a primary <strong>best LanguageCert coaching centre in Karachi, Pakistan</strong>, Language World provides comprehensive curriculum programs for <strong>LanguageCert SELT</strong> (Secure English Language Tests) and <strong>International ESOL</strong> exams. 
                        Whether you are aiming for family reunions, academic degrees in elite institutions, or permanent settlement Visas, our targeted classrooms ensure high performance.
                      </p>
                    </div>

                    {/* Differentiating LanguageCert Academic vs LanguageCert General/SELT */}
                    <div className="space-y-6">
                      <h4 className="text-xl font-extrabold text-accent flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        LanguageCert Academic vs. LanguageCert SELT (General/Spouse) Explained
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
                          <span className="text-xs font-black text-primary tracking-widest uppercase text-left block">For Academic Admissions</span>
                          <h5 className="font-bold text-accent text-lg mt-1 mb-2">LanguageCert Academic</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Engineered for candidates seeking enrollment in top international institutes (recognized by major UK universities). It evaluates advanced academic command, reading comprehension, contextual listening, and professional presentations under standard academic constraints. Excellent alternative to traditional computer-based assessments.
                          </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
                          <span className="text-xs font-black text-[#FFCE00] tracking-widest uppercase mb-1 block">For UK Visas (SELT)</span>
                          <h5 className="font-bold text-accent text-lg mb-2">LanguageCert SELT</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Approved by the UK Visas and Immigration (UKVI) office for spouse reunion visas, citizenship, and residency (Levels A1, A2, B1, B2). It is partitioned into listening & reading or exclusive speaking with a real online live examiner. Perfect option for stress-free rapid processing with guaranteed scores.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Why Choose Language World */}
                    <div className="space-y-6 pt-4">
                      <h4 className="text-xl font-extrabold text-accent flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        Why Choose Language World for Your LanguageCert Prep?
                      </h4>
                      
                      <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                        <p className="leading-relaxed">
                          We recognize that every student starts at a different skill baseline. Language World Karachi designs specialized, small-batch classrooms, making sure you receive continuous attention and complete material support:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Partner Exam Center Aligned Materials</strong>: Gain access to real-time official LanguageCert sample sets, tests, and actual simulation guides.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Interactive Live Speaking Clinics</strong>: Extensive preparation with native-like mock examiners to eradicate shyness and pass speaking sections on the first attempt.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Guaranteed Rapid Result Booking Guidance</strong>: Assist you throughout the registration, test booking, candidate profiling, and rapid results processing timeline.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Gulshan Karachi Campus or Real-Time Online</strong>: Take physical interactive classes at our central standard campus in Karachi or join real-time classes online.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Strategic Score Blueprint */}
                    <div className="bg-white p-6 rounded-2xl border border-primary/10 mt-6 md:p-8">
                      <h5 className="font-bold text-accent text-base mb-2">🎯 Step-by-Step LanguageCert Success Blueprint</h5>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        LanguageCert is loved by international applicants because it allows you to schedule tests with as little as 4 hours of advance notice, and provides certified results in just 3-5 business days. Success in LanguageCert SELT depends on utilizing appropriate speaking vocabulary templates and accurate spelling rules. At the <strong>best LanguageCert coaching centre in Karachi</strong>, our customized classrooms help you navigate these criteria seamlessly. Let us guide you to success!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {id === "business-communication" && (
                <div className="mt-12 space-y-16">
                  {/* Enhanced Business Communication SEO Block */}
                  <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-[2.5rem] p-8 md:p-12 border border-primary/10 shadow-sm space-y-10 text-left">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest border border-primary/20">
                        Corporate Excellence Program
                      </div>
                      <h3 className="text-3xl font-black text-accent tracking-tight">
                        Business Communication Course in Karachi — Unlock Professional Success
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-base">
                        Effective professional communication is the ultimate catalyst for career advancement. 
                        As the <strong>best Business Communication institute in Karachi, Pakistan</strong>, Language World delivers a comprehensive training program engineered specifically for corporate executives, job seekers, university graduates, and remote freelancers. 
                        Whether you are aiming to master corporate emails, excel in executive business meetings, lead global project negotiations, or build immense public speaking confidence, our senior consultants provide personalized guidance.
                      </p>
                    </div>

                    {/* Differentiating Written vs Spoken Business English */}
                    <div className="space-y-6">
                      <h4 className="text-xl font-extrabold text-accent flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        Key Pillars of Our Business Communication Dynamics
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
                          <span className="text-xs font-black text-primary tracking-widest uppercase text-left block">Written Authority & Correspondence</span>
                          <h5 className="font-bold text-accent text-lg mt-1 mb-2">Corporate Writing Mastery</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Acquire the secrets of impactful emails, executive-level documentation, professional proposals, and persuasive cover letters. Avoid common grammar traps, use precise corporate terminology, and draft professional messages that win responses instantly.
                          </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
                          <span className="text-xs font-black text-[#FFCE00] tracking-widest uppercase mb-1 block">Spoken Diplomacy & Public Speaking</span>
                          <h5 className="font-bold text-accent text-lg mb-2">Executive Spoken Fluency</h5>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Develop professional oral fluency for high-stakes presentations, team meetups, sales pitches, and corporate negotiations. Learn to manage stage fright, structure arguments gracefully, use executive body language, and speak with authentic confidence.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Why Choose Language World */}
                    <div className="space-y-6 pt-4">
                      <h4 className="text-xl font-extrabold text-accent flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        Why Choose Language World for Business English Training?
                      </h4>
                      
                      <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                        <p className="leading-relaxed">
                          Our curriculum is highly practical and scenario-based. You will participate in live roleplays, write authentic email reply sessions, and record video presentations with senior instructors:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Senior Executive Mentors</strong>: Classes are hosted by seasoned certified communication specialists with decades of corporate exposure.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Authentic Case Study Simulations</strong>: Real workplace problem-solving sessions, peer project mockups, and corporate negotiation activities.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Mock Corporate Interview Clinics</strong>: Personalized interview prep with tailored critiques to landing jobs in prestigious multinationals or foreign contracts.</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-primary font-bold">✓</span> <span><strong>Interactive Speaking Clubs</strong>: Access weekly high-impact speaking events to build real-time conversational courage.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Strategic Blueprint */}
                    <div className="bg-white p-6 rounded-2xl border border-primary/10 mt-6 md:p-8">
                      <h5 className="font-bold text-accent text-base mb-2">🎯 Language World Career Success Masterclass Blueprint</h5>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        To climb the corporate ladder quickly from Pakistan, mastering soft skills is just as critical as technical proficiency. Outstanding corporate conversation depends on strong structure, situational awareness, active listening, and precision vocabulary choice. At the <strong>best Business Communication coaching centre in Karachi</strong>, our professional batches help you bridge your communication gaps. Enroll today to accelerate your career!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-soft-gray">
                  <h4 className="text-xl font-bold text-accent mb-6">Enroll in this Course</h4>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-soft-gray">
                      <span className="text-gray-500">Duration</span>
                      <span className="font-bold">8-12 Weeks</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-soft-gray">
                      <span className="text-gray-500">Language</span>
                      <span className="font-bold">English/Urdu/German</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-soft-gray">
                      <span className="text-gray-500">Level</span>
                      <span className="font-bold">{course.subtitle}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => openApplyModal(course.title)}
                    className="btn-primary w-full py-4 mb-4 cursor-pointer"
                  >
                    Enroll Now
                  </button>
                  <a 
                    href={whatsappUrl}
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-outline w-full py-4 text-[#25D366] border-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center gap-2 font-bold"
                  >
                    <MessageCircle size={20} /> Ask an Expert
                  </a>
                </div>

                <div className="bg-accent rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-4">Need Help Choosing?</h4>
                    <p className="text-sm text-white/70 mb-6">Talk to our career counselors to find the best path for your future.</p>
                    <a href={`tel:${CONTACT_INFO.mobile}`} className="flex items-center gap-3 font-bold text-primary hover:text-white transition-colors">
                      Call: {CONTACT_INFO.mobile} <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
