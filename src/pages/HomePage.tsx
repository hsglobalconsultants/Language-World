import { 
  ArrowRight, 
  MessageCircle, 
  Globe2, 
  Award, 
  Users2, 
  Target, 
  CheckCircle2,
  Facebook,
  ChevronDown,
  Calendar,
  Sparkles,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { CONTACT_INFO, COURSES, TESTIMONIALS } from "../constants/data";
import { BLOG_POSTS, BlogPost } from "../constants/blogs";
import CourseCard from "../components/common/CourseCard";
import SuccessStoriesPreview from "../components/sections/SuccessStoriesPreview";
import GoogleReviews from "../components/sections/GoogleReviews";
import LifeAtLW from "../components/sections/LifeAtLW";
import SEO from "../components/common/SEO";
import { useState, useEffect } from "react";
import React from "react";
import { blogService } from "../services/blogService";
import { settingsService, SiteSettings } from "../services/settingsService";
import { useModals } from "../components/ModalContext";
import ApplyOnlineForm from "../components/common/ApplyOnlineForm";
import AnnouncementPopup from "../components/common/AnnouncementPopup";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(() => {
    try {
      const cached = localStorage.getItem("siteSettings");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [imgLoaded, setImgLoaded] = useState(false);
  const { openApplyModal } = useModals();

  useEffect(() => {
    // Fetch Settings
    const fetchSettings = async () => {
      const data = await settingsService.getSettings();
      if (data) {
        setSiteSettings(data);
        try {
          localStorage.setItem("siteSettings", JSON.stringify(data));
        } catch (e) {
          console.warn("Could not cache settings in localStorage", e);
        }
      }
    };
    fetchSettings();

    // Subscribe to settings for real-time updates
    const unsubSettings = settingsService.subscribeToSettings((data) => {
      setSiteSettings(data);
      if (data) {
        try {
          localStorage.setItem("siteSettings", JSON.stringify(data));
        } catch (e) {
          console.warn("Could not cache settings in localStorage", e);
        }
      }
    });

    const fetchBlogs = async () => {
      try {
        const dbBlogs = await blogService.getAllBlogs();
        if (dbBlogs.length > 0) {
          setBlogs([...dbBlogs, ...BLOG_POSTS.filter(sb => !dbBlogs.find(db => db.title === sb.title))]);
        }
      } catch (err) {
        console.error("Home blog fetch error:", err);
      }
    };
    fetchBlogs();

    return () => unsubSettings();
  }, []);

  const faqs = [
    { q: "What languages do you teach at Language World?", a: "We specialize in German Language (A1 to B2), IELTS, PTE, LanguageCert, and Business Communication courses." },
    { q: "Do you offer online classes?", a: "Yes, we offer both physical and online classes to cater to students worldwide." },
    { q: "What are the fees for German language courses in Karachi?", a: "The fees for German language courses in Karachi vary depending on the level and class type. Please contact Language World Institute for the latest course fee details and schedules." },
    { q: "Is German difficult for beginners?", a: "German is not difficult if you learn with proper guidance and regular practice. Beginners can easily start speaking basic German within a few weeks." },
    { q: "Can I study in Germany after learning German?", a: "Yes, learning German can help you study in Germany, especially for German-taught programs and daily life communication. Many universities also offer English-taught programs." },
    { q: "Which German level is required for Germany?", a: "Most German universities require B1 or B2 level German for German-taught programs. The required level may vary depending on the university and course." },
    { q: "Do you offer online German language classes?", a: "Yes, Language World Institute offers online German language classes with live sessions, interactive learning, and flexible timings for students across Pakistan." },
    { q: "How can I register for Goethe exams in Karachi?", a: "You can register for Goethe exams through the official Goethe-Institut website or by contacting an authorized exam center in Karachi." },
    { q: "What is your success rate for IELTS/PTE?", a: "Our students consistently achieve 7.0+ in IELTS and 65+ in PTE thanks to our result-oriented methodology." },
    { q: "Are the instructors certified?", a: "Absolutely! All our instructors are certified professionals with years of experience in language coaching." },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <SEO 
        title="Language World | Best German Language Institute & IELTS Prep in Karachi | Pakistan's First German AI Tutor" 
        description="Learn with expert instructors and Pakistan's first AI-powered German tutor. Prepare for IELTS, PTE, LanguageCert, and professional communication — online and in-person across Pakistan."
      />
      <AnnouncementPopup popupSettings={siteSettings?.popup} />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920" 
            alt="Students Learning" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white/80 to-primary/10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs sm:text-sm mb-6 border border-primary/20">
              <Globe2 size={16} className="text-primary animate-pulse" />
              <span>Pakistan's First AI German Tutor — Now at Language World</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-accent leading-tight mb-4">
              Master German, IELTS, PTE & Business English.
            </h1>
            <h2 className="text-lg sm:text-xl font-bold text-primary mb-6">
              From Pakistan's Most Trusted Language Institute
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              Learn with expert instructors and Pakistan's first AI-powered German tutor. Prepare for IELTS, PTE, LanguageCert, and professional communication — online and in-person across Pakistan.
            </p>

            {/* Campaign conversion booster badge */}
            <div className="mb-6 inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-primary/15 animate-pulse">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>Enrollment Open for New Batches This Week!</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative group/btn cursor-pointer">
                {/* Visual pulsing aura beneath the primary button */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-30 group-hover/btn:opacity-60 transition duration-1000 group-hover/btn:duration-200 animate-pulse"></div>
                <button 
                  onClick={() => openApplyModal()}
                  className="relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-accent hover:bg-black text-white font-sans font-black tracking-wider text-xs uppercase px-8 py-5 rounded-2xl transition duration-300 shadow-xl group"
                >
                  Book a Free Consultation 
                  <ArrowRight className="group-hover:translate-x-1.5 transition-transform text-primary" size={16} />
                </button>
              </div>

              <a 
                href={`https://wa.me/${CONTACT_INFO.whatsapp}`} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-accent font-sans font-black tracking-wider text-xs uppercase px-8 py-5 rounded-2xl border border-gray-100 shadow-sm transition duration-300 group/wa"
              >
                {/* Instant Online Glow Indicator */}
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <MessageCircle fill="#25d366" stroke="none" size={18} className="group-hover/wa:scale-110 transition-transform" /> 
                Contact on WhatsApp
              </a>
            </div>

            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-4 pl-1">
              ⚡ Response Time under 10 minutes • Offline & Online Batches Available
            </p>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-soft-gray overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white text-xs font-bold">
                  500+
                </div>
              </div>
              <div>
                <p className="text-accent font-bold">500+ Happy Students</p>
                <div className="flex text-yellow-400">
                  {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "backOut" }}
            className="relative w-full max-w-lg mx-auto lg:max-w-none mt-16 lg:mt-0"
          >
            <div className={`relative z-10 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white animate-float bg-slate-100 ${!imgLoaded ? "animate-pulse" : ""}`}>
              <img 
                src={siteSettings?.heroImage || "https://images.unsplash.com/photo-1622675363211-6e7ad0d6c760?auto=format&fit=crop&q=80&w=1000"} 
                alt="Language World Students Group" 
                className={`w-full aspect-[4/5] object-cover transition-opacity duration-700 ease-in-out ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                referrerPolicy="no-referrer"
                onLoad={() => setImgLoaded(true)}
              />
            </div>
            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-4 sm:-top-10 sm:-right-10 z-20 glass-card p-4 sm:p-6 rounded-2xl shadow-xl border border-primary/20 max-w-[150px] sm:max-w-[200px]"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary mb-2">
                <Award size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-bold text-accent text-xs sm:text-sm">IELTS Award</h4>
              <p className="text-[10px] sm:text-xs text-gray-500">Certified Success Center</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-4 sm:-bottom-10 sm:-left-10 z-20 glass-card p-4 sm:p-6 rounded-2xl shadow-xl border border-accent/20 max-w-[150px] sm:max-w-[200px]"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/20 rounded-lg flex items-center justify-center text-accent mb-2">
                <Users2 size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-bold text-accent text-xs sm:text-sm">Expert Tutors</h4>
              <p className="text-[10px] sm:text-xs text-gray-500">Learn from the best</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-soft-gray">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-4">Core Values</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-accent mb-6 leading-tight">
              Why Language World is Your <br className="hidden md:block" /> Best Choice?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We don't just teach languages; we open doors to your global future with personalized attention and proven methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Target className="text-white" />, title: "Focus on Results", desc: "Our curriculum is strictly aligned with international testing standards.", color: "bg-primary" },
              { icon: <Users2 className="text-white" />, title: "Individual Attention", desc: "Small batch sizes ensure every student gets the guidance they need.", color: "bg-accent" },
              { icon: <CheckCircle2 className="text-white" />, title: "Flexible Timings", desc: "Morning, afternoon, and evening slots to suit your schedule.", color: "bg-primary" },
              { icon: <Award className="text-white" />, title: "Premium Facilities", desc: "State-of-the-art classrooms and AI-powered practice tools.", color: "bg-accent" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-accent mb-4">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* German AI Tutor Promo Section */}
      <section className="py-24 bg-gradient-to-br from-[#0c0f1d] via-[#12162a] to-[#080a14] text-white relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,206,0,0.1),transparent_50%)]"></div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl z-0"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Promo Text */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFCE00]/20 text-[#FFCE00] border border-[#FFCE00]/30 font-bold text-xs uppercase tracking-widest leading-none">
                <Sparkles size={12} className="animate-pulse" />
                <span>Pakistan's First German AI Tutor Live</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Meet Your 24/7 Interactive <span className="text-[#FFCE00]">Pakistan's First German AI Tutor</span>
              </h2>
              
              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
                Ready to ace your Goethe Certified A1, A2, B1 or B2 exams? Practice speaking, perfect your grammar, and receive instant native feedback anytime, anywhere. Guided by our advanced AI conversation model.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFCE00] flex-shrink-0">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Instant Evaluation</h4>
                    <p className="text-slate-400 text-sm mt-1">Get instant metrics on pronunciation, word correctness, and grammar delivery.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFCE00] flex-shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Custom Syllabus Gen</h4>
                    <p className="text-slate-400 text-sm mt-1">Generate Goethe vocabulary lists and custom training worksheets in 1-click.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link 
                  to="/german-tutor"
                  id="home-ai-tutor-cta"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFCE00] hover:bg-[#ffe04d] text-slate-950 px-8 py-4.5 rounded-2xl font-sans font-black tracking-wider text-xs uppercase shadow-xl hover:shadow-[#FFCE00]/20 transition duration-300 cursor-pointer"
                >
                  Start Learning German Free
                  <ArrowRight size={15} />
                </Link>
                <Link 
                  to="/courses"
                  className="w-full sm:w-auto text-center py-4 px-8 text-slate-300 hover:text-white text-xs uppercase tracking-wider font-black transition-colors"
                >
                  Explore Standard Batches
                </Link>
              </div>
            </div>

            {/* AI Robot illustration with decorative widgets */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#FFCE00] to-primary rounded-[3rem] blur-xl opacity-30 animate-pulse"></div>
              
              <div className="relative bg-slate-900/60 backdrop-blur-md rounded-[3rem] p-8 border border-white/10 overflow-visible shadow-2xl flex flex-col items-center">
                {/* Image overlay */}
                <div className="w-full rounded-2xl overflow-hidden aspect-square relative bg-slate-950 border border-white/5">
                  <img 
                    id="german-ai-tutor-promo-img"
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600"
                    alt="Pakistan's First German AI Tutor Robot" 
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Digital interface scanline */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"></div>
                </div>

                {/* Speech bubbles */}
                <div className="absolute -top-3 md:-left-3 left-2 z-10 animate-bounce shadow-xl" style={{ animationDuration: "3.5s" }}>
                  <div className="bg-[#FFCE00] text-slate-950 text-xs font-black px-4 py-2 rounded-2xl rounded-bl-sm border border-[#ffe04d]">
                    Guten Tag! Wie geht's? 🤖
                  </div>
                </div>



                {/* Tech label badge */}
                <div className="mt-6 flex flex-col items-center text-center">
                  <span className="text-[10px] font-black text-[#FFCE00] tracking-widest uppercase">Autonomous Teaching System</span>
                  <span className="text-xl font-black text-white mt-1">Pakistan's First German AI Tutor v2.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-4 text-left">Our Expertise</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-accent leading-tight">
                Empower Your Future with <br className="hidden md:block" /> Our Featured Courses
              </h3>
            </div>
            <Link to="/courses" className="btn-outline">
              View All Courses <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COURSES.slice(0, 3).map((course, i) => (
              <CourseCard key={course.id} index={i} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Student Success Stories Section */}
      <SuccessStoriesPreview />

      {/* Life at Language World Gallery */}
      <LifeAtLW />

      {/* Latest Blog Posts Section */}
      <section className="py-24 bg-soft-gray">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-4 text-left">Academic Insights</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-accent leading-tight">
                Latest from <br className="hidden md:block" /> Our Blog
              </h3>
            </div>
            <Link to="/blog" className="btn-accent">
              Explore All Articles <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog, i) => (
              <motion.article 
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={blog.image || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800"} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <div className="absolute top-6 left-6 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    {blog.tag}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex gap-4 text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-accent mb-4 group-hover:text-primary transition-colors leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed flex-grow">
                    {blog.excerpt}
                  </p>
                  <Link to={`/blog/${blog.id}`} className="flex items-center gap-2 font-bold text-accent group-hover:text-primary transition-colors">
                    Read More <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="pt-24 pb-0 bg-accent relative overflow-hidden">
        <GoogleReviews />
      </section>

      {/* FAQ & Inquiry Form */}
      <section className="pt-0 pb-24 bg-soft-gray relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-4">Have Questions?</h2>
            <h3 className="text-4xl font-extrabold text-accent mb-12">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-6 flex justify-between items-center text-left font-bold text-accent hover:bg-gray-50 transition-colors"
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

          <div id="inquiry-form" className="bg-white p-10 lg:p-12 rounded-[3.5rem] shadow-2xl relative">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
            <h3 className="text-3xl font-extrabold text-accent mb-2">Apply Online</h3>
            <p className="text-gray-500 mb-10">Start your global journey today. Fill out the form and we'll contact you within 24 hours.</p>
            
            <ApplyOnlineForm />
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="h-[450px] w-full grayscale-[0.5] hover:grayscale-0 transition-all duration-700 overflow-hidden">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.3471211020546!2d67.0946261!3d24.920242100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f096ddcad41%3A0x1bb0e746b890e519!2sLanguage%20World!5e0!3m2!1sen!2s!4v1778409319978!5m2!1sen!2s" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Language World Location"
        ></iframe>
      </section>
    </div>
  );
}
