import { motion } from "motion/react";
import { 
  Award, 
  Target, 
  Users, 
  Globe, 
  Sparkles, 
  CheckCircle, 
  BookOpen, 
  Laptop, 
  MessageSquare, 
  TrendingUp, 
  MapPin, 
  Phone,
  BookmarkCheck
} from "lucide-react";
import { CONTACT_INFO, ABOUT_STATS, MISSION_VISION } from "../constants/data";
import SEO from "../components/common/SEO";

export default function AboutPage() {
  const valuesIcons = [<Target size={32} className="text-primary font-bold" />, <Globe size={32} className="text-primary font-bold" />, <Award size={32} className="text-primary font-bold" />];

  return (
    <div className="flex flex-col font-sans bg-[#fafafa]">
      <SEO 
        title="About Language World | Best German, IELTS & PTE Institute in Karachi" 
        description="Language World Karachi is Pakistan's premier institute for Goethe German German A1-B2 preparation, IELTS 7.5+ Bands, PTE Academic, LanguageCert SELT, and Business English coaching." 
      />

      {/* 1. HERO HEADER SECTION */}
      <section className="relative bg-accent text-white py-24 sm:py-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#3d2c8d,transparent)] opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 text-xs font-black uppercase tracking-widest rounded-md inline-block">
              About Language World Karachi
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-black leading-tight tracking-tight">
              Bridging Karachi To The <br />
              <span className="text-primary">Global Career Landscape</span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl font-medium leading-relaxed">
              We are Pakistan's most innovative high-standard language preparation school. Based in Karachi, we empower dreamers, professionals, and students to pass Goethe German exams, high-band IELTS/PTE assessments, and secure international visas with confidence.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-wider pt-2">
              <span className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <MapPin size={14} className="text-primary" /> Gulshan-e-Iqbal, Karachi
              </span>
              <span className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <Award size={14} className="text-primary" /> High-Success Ratio
              </span>
              <span className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <Sparkles size={14} className="text-primary" /> AI-Powered Edge
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                alt="Language World Karachi Campus and Students Studying" 
                className="rounded-[2rem] w-full h-80 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-primary text-accent p-6 rounded-[2rem] shadow-xl text-left border-4 border-[#fafafa] hidden sm:block max-w-[240px]">
              <p className="text-2xl font-black tracking-tight leading-none">Pakistan's #1</p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80 decoration-accent">
                Language Academy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-3xl md:text-4xl font-display font-black text-accent mb-1">100%</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Goethe & IELTS Focus</p>
            </div>
            <div>
              <h4 className="text-3xl md:text-4xl font-display font-black text-accent mb-1">5,000+</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Successful Alumni</p>
            </div>
            <div>
              <h4 className="text-3xl md:text-4xl font-display font-black text-accent mb-1">10+ Years</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Training Experience</p>
            </div>
            <div>
              <h4 className="text-3xl md:text-4xl font-display font-black text-accent mb-1">Karachi</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Top Rated Institute</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PAKISTAN'S FIRST AI GERMAN LANGUAGE TUTOR SECTION */}
      <section id="ai-tutor-about" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left space-y-6">
            <span className="bg-accent/10 text-accent border border-accent/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md inline-flex items-center gap-1.5">
              <Sparkles size={12} className="text-primary" /> Exclusive Innovation
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-950 leading-tight tracking-tight">
              Pakistan's First & Only <br />
              <span className="text-primary italic">AI German Exam Tutor</span>
            </h2>
            <p className="text-gray-600 font-medium leading-relaxed text-base">
              At Language World, we combine elite human expertise with state-of-the-art Generative AI technology. To revolutionize your preparation, we’ve developed Pakistan's first fully-integrated **AI German Goethe-Zertifikat Prep Engine**.
            </p>
            <p className="text-gray-600 font-semibold leading-relaxed text-sm">
              Our advanced students in Karachi and beyond benefit from direct hybrid study modules, with real-time automated assessment of their exam paper drafts.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-primary/10 rounded-xl text-accent shrink-0">
                  <Laptop size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-accent mb-1">Goethe Writing Evaluator</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Write formal and informal German letters directly online. Receive custom scores out of 25, complete grammatical error breakdowns, and a perfect high-score model answer.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-primary/10 rounded-xl text-accent shrink-0">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-accent mb-1">Interactive Oral Speaking Partner</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Formulate spoken German questions using standard Goethe topics and cue cards. Our AI evaluates pronunciation, verb positioning, case alignment, and offers fluent model responses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-accent/95 p-8 sm:p-10 rounded-[3rem] text-white space-y-6 shadow-xl border border-white/10 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Mockup View</span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-primary text-accent px-2 py-0.5 rounded font-black uppercase">CEFR Level B1</span>
                  <span className="text-[9px] text-white/50 font-bold">Brief/E-Mail schreiben</span>
                </div>
                <div className="p-3 bg-white/10 rounded-xl">
                  <p className="text-[11px] italic font-medium text-white/90 leading-relaxed">
                    "Sehr geehrte Frau Becker, ich möchte am Samstag einen Termin für die Wohnungsbesichtigung vereinbaren..."
                  </p>
                </div>
                <div id="ai-demo-badge" className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] text-primary font-black uppercase">AI Evaluation Result:</span>
                  <span className="text-xs bg-emerald-500 text-white font-black px-2.5 py-0.5 rounded">23 / 25 Points</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-white/75 font-medium leading-relaxed">
                <p>✓ Instant detailed grammar feedback</p>
                <p>✓ Explanations in easy bilingual English and German</p>
                <p>✓ High-success strategy optimized for Goethe-Institut exams</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE LANGUAGE WORLD KARACHI */}
      <section className="py-24 bg-soft-gray border-t border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="bg-primary/20 text-accent font-black text-xs uppercase tracking-widest px-3 py-1 rounded-md">
              The Premier Choice In Sindh
            </span>
            <h3 className="text-3xl md:text-5xl font-display font-black text-accent leading-tight">
              Why Karachi's Ambitious Students <br />
              Choose <span className="text-primary italic">Language World</span>
            </h3>
            <p className="text-gray-500 font-bold leading-relaxed">
              We stand apart through our commitment to stellar teaching, individualized feedback structures, and immersive technologies customized for Pakistani learners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-left space-y-4 transition hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-accent">
                <CheckCircle size={24} />
              </div>
              <h4 className="text-lg font-black text-accent uppercase tracking-wide">Structured Curriculum</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Curriculum completely customized around current Goethe patterns (A1, A2, B1, B2) and updated British Council, IDP, and Pearson assessment templates.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-left space-y-4 transition hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-accent">
                <Users size={24} />
              </div>
              <h4 className="text-lg font-black text-accent uppercase tracking-wide">Certified Instructors</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Learn from international test-takers and certified language coaches who bring years of proven pedagogical techniques inside and outside Karachi.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-left space-y-4 transition hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-accent">
                <TrendingUp size={24} />
              </div>
              <h4 className="text-lg font-black text-accent uppercase tracking-wide">Elite Mock Test Setup</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Access physical and digital mock tests resembling actual exam formats, designed to track vocabulary gaps and optimize response speeds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EXPLORE OUR MAJOR PROGRAMS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-primary font-black uppercase text-xs tracking-widest block">Comprehensive Exam Prep Portfolio</span>
            <h3 className="text-4xl font-display font-black text-accent">
              Our Core Training Specializations
            </h3>
            <p className="text-gray-500 font-bold leading-relaxed">
              We deliver standard and intense preparation packages targeting high scores on the very first attempt. See what makes our programs the leading modules in Karachi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* IELTS Coaching Block */}
            <div className="bg-[#fcfcff] p-8 sm:p-10 rounded-[2.5rem] border border-blue-50 text-left space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest inline-block">
                  IELTS Academic & General Training
                </span>
                <h4 className="text-2xl font-display font-black text-accent leading-none">
                  Aim for 7.5+ Bands in Karachi
                </h4>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  Our core IELTS program addresses all 4 components: Listening, Reading, Writing, and Speaking. Master cohesive writing structures, formal transitions, academic speaking fluencies, and fast reading methods. Standard materials, real-time mock test logs, and personal feedback files are designed to eliminate performance bottlenecks.
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-150 space-y-2">
                <p className="text-[11px] text-gray-600 font-bold flex items-center gap-2">
                  <CheckCircle size={14} className="text-primary" /> Free continuous full-length computerized & paper mock exams
                </p>
                <p className="text-[11px] text-gray-600 font-bold flex items-center gap-2">
                  <CheckCircle size={14} className="text-primary" /> Personalized evaluation files detailing grammatical band errors
                </p>
              </div>
            </div>

            {/* PTE coaching Block */}
            <div className="bg-[#fafcfa] p-8 sm:p-10 rounded-[2.5rem] border border-emerald-50 text-left space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest inline-block">
                  PTE Academic Preparation
                </span>
                <h4 className="text-2xl font-display font-black text-accent leading-none">
                  Pearson Test of English Academic
                </h4>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  Perfect computerized scoring systems! We focus heavily on item types like Write From Dictation, Read Aloud, Describe Image, and Retell Lecture. In addition to expert physical tutoring, we teach elite temple scoring templates, spelling checking, and microphone speaking rhythm parameters.
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-150 space-y-2">
                <p className="text-[11px] text-gray-600 font-bold flex items-center gap-2">
                  <CheckCircle size={14} className="text-primary" /> Practice tools mirroring official Pearson Pearson interfaces
                </p>
                <p className="text-[11px] text-gray-600 font-bold flex items-center gap-2">
                  <CheckCircle size={14} className="text-primary" /> Individual coaching with customized strategy sheets
                </p>
              </div>
            </div>

            {/* LanguageCert UK VI Block */}
            <div className="bg-[#fff9f9] p-8 sm:p-10 rounded-[2.5rem] border border-red-50 text-left space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest inline-block">
                  LanguageCert SELT Program
                </span>
                <h4 className="text-2xl font-display font-black text-accent leading-none">
                  Fast & Approved UK Visa Pathway
                </h4>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  Need rapid English certification for UK student, spouse, work, or immigration visas? LanguageCert exams are flexible, fast to score, and accepted globally. Our trainers specialize in SELT A1, A2, B1, B2, and C1 modules. We provide specialized speaking simulation and audio training sheets to ensure success.
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-150 space-y-2">
                <p className="text-[11px] text-gray-600 font-bold flex items-center gap-2">
                  <CheckCircle size={14} className="text-primary" /> Focus on active, pragmatic listening and live speaking components
                </p>
                <p className="text-[11px] text-gray-600 font-bold flex items-center gap-2">
                  <CheckCircle size={14} className="text-primary" /> Complete structural layout guides and mock evaluations
                </p>
              </div>
            </div>

            {/* Business English Communication Block */}
            <div className="bg-[#fffdf7] p-8 sm:p-10 rounded-[2.5rem] border border-amber-50 text-left space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest inline-block">
                  Business Communication Skills
                </span>
                <h4 className="text-2xl font-display font-black text-accent leading-none">
                  Corporate English & Executive Leadership
                </h4>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  Excel inside the executive office place. This elite training module builds high-impact public speaking skills, clear presentation deliveries, diplomatic negotiation scripts, and structured formal letter writing. Tailored for corporate leads, engineers, and ambitious graduates in Pakistan entering global fields.
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-150 space-y-2">
                <p className="text-[11px] text-gray-600 font-bold flex items-center gap-2">
                  <CheckCircle size={14} className="text-primary" /> Mock office scenario simulations and professional presentation practice
                </p>
                <p className="text-[11px] text-gray-600 font-bold flex items-center gap-2">
                  <CheckCircle size={14} className="text-primary" /> Email drafting benchmarks and interactive group workshops
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR MISSION & VISION RE-STYLING */}
      <section className="py-24 bg-soft-gray border-t border-gray-150">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <span className="text-primary text-[10px] uppercase font-black tracking-widest">Our Founding Anchors</span>
            <h3 className="text-3xl md:text-4xl font-display font-black text-accent uppercase tracking-tight">Mission, Vision & Core Ethics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {MISSION_VISION.map((item, i) => (
              <div key={i} className="flex flex-col items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                  {valuesIcons[i]}
                </div>
                <h4 className="text-xl font-black text-accent mb-3 uppercase tracking-wide">{item.title}</h4>
                <p className="text-gray-500 text-xs font-semibold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ORGANIC SEO KEYWORDS & FAQ INDEX (EXCELLENT Google/Bing crawling layout) */}
      <section className="py-24 bg-white border-t border-gray-100 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* SEO Header */}
          <div className="border-l-4 border-primary pl-5 space-y-2">
            <h3 className="text-2xl font-display font-black text-accent uppercase tracking-tight">
              Leading Exam Preparation Center Karachi, Pakistan
            </h3>
          </div>

          {/* Keyword optimized copy */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs text-gray-500 font-medium leading-relaxed">
            <div className="space-y-3">
              <h5 className="font-black text-accent uppercase tracking-wider">Best German Language Institute in Karachi</h5>
              <p>
                Language World offers official syllabus resources for German language courses ranging from A1 and A2 to intermediate B1 and B2 levels in Karachi. Known as the leading German language institute in Gulshan-e-Iqbal, near NIPA Chorangi, our coaching tracks match the standardized levels of the Goethe-Institut and ÖSD exams, ensuring quick, high success.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-black text-accent uppercase tracking-wider">Top IELTS Coaching in Pakistan</h5>
              <p>
                As a premier exam center, Language World presents the most cohesive IELTS classes in Karachi. Our teachers hold years of experience helping students secure IELTS 7.5 bands and above for academic and general visas. Our structured modules are trusted across Sindh and customized to support immigration requirements seamlessly.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-black text-accent uppercase tracking-wider">PTE Academic & LanguageCert Center</h5>
              <p>
                Looking for Pearson Test of English Academic (PTE) or LanguageCert coaching in Karachi, Pakistan? Learn computer strategies, custom sentence templates, and focus techniques near Gulshan-E-Iqbal. Our modern facility provides high-speed mock terminals to replicate actual test settings with pristine feedback.
              </p>
            </div>
          </div>

          {/* Quick FAQ accordion panel */}
          <div className="pt-6 border-t border-gray-100">
            <h4 className="font-display font-black text-accent text-sm uppercase tracking-wider mb-6">Frequently Asked Questions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
              <div className="bg-[#fafafa] p-5 rounded-2xl border border-gray-150 space-y-1">
                <p className="text-accent font-black uppercase">Where is Language World located in Karachi?</p>
                <p className="text-gray-500 leading-relaxed font-semibold">
                  Our main campus is situated at Office 1, FL 4 / 14, Block 5, Gulshan-E-Iqbal, Karachi. This is highly accessible, located close to the central NIPA Chorangi intersection.
                </p>
              </div>

              <div className="bg-[#fafafa] p-5 rounded-2xl border border-gray-150 space-y-1">
                <p className="text-accent font-black uppercase">Does Language World provide physical and online classes?</p>
                <p className="text-gray-500 leading-relaxed font-semibold">
                  Yes, we offer flexible double-stream models. You can attend intensive physical classes at our Karachi campus or choose interactive online training with personal teacher monitoring.
                </p>
              </div>

              <div className="bg-[#fafafa] p-5 rounded-2xl border border-gray-150 space-y-1">
                <p className="text-accent font-black uppercase">How does Pakistan's First German AI Tutor work?</p>
                <p className="text-gray-500 leading-relaxed font-semibold">
                  Our students get exclusive access to our integrated web tool to type letters or transcribe audio speaking prompts. AI delivers instant grading matching Goethe criteria so you learn from mistake logs instantly.
                </p>
              </div>

              <div className="bg-[#fafafa] p-5 rounded-2xl border border-gray-150 space-y-1">
                <p className="text-accent font-black uppercase">How can we register for classes or get visa counseling?</p>
                <p className="text-gray-500 leading-relaxed font-semibold">
                  You can call us directly at 021 34155182, WhatsApp us at +923007007699, or drop by our office for free diagnostic registration assessments and student counselor orientation!
                </p>
              </div>
            </div>
          </div>

          {/* Key tags block */}
          <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
            {[
              "German Language Institute Karachi",
              "Goethe Exam Practice Gulshan e Iqbal",
              "best IELTS teacher in Karachi",
              "PTE Academic course fee Pakistan",
              "LanguageCert SELT preparation",
              "Business English corporate training Sindh",
              "AI German speaking evaluation online",
              "Language World Karachi NIPA Chorangi",
              "A1 A2 B1 B2 German visa certification"
            ].map((tag, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full border border-gray-150 uppercase tracking-tight">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
