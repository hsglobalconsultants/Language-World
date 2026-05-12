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
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { CONTACT_INFO, COURSES, TESTIMONIALS } from "../constants/data";
import { BLOG_POSTS, BlogPost } from "../constants/blogs";
import CourseCard from "../components/common/CourseCard";
import GoogleReviews from "../components/sections/GoogleReviews";
import LifeAtLW from "../components/sections/LifeAtLW";
import SEO from "../components/common/SEO";
import { useState, useEffect } from "react";
import React from "react";
import { blogService } from "../services/blogService";
import { useModals } from "../components/ModalContext";
import ApplyOnlineForm from "../components/common/ApplyOnlineForm";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const { openApplyModal } = useModals();

  useEffect(() => {
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
  }, []);

  const faqs = [
    { q: "What languages do you teach at Language World?", a: "We specialize in German Language (A1 to B2), IELTS, PTE, LanguageCert, and Business Communication courses." },
    { q: "Do you offer online classes?", a: "Yes, we offer both physical and online classes to cater to students worldwide." },
    { q: "What is your success rate for IELTS/PTE?", a: "Our students consistently achieve 7.0+ in IELTS and 65+ in PTE thanks to our result-oriented methodology." },
    { q: "Are the instructors certified?", a: "Absolutely! All our instructors are certified professionals with years of experience in language coaching." },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <SEO 
        title="Language World | Best Language Institute in Karachi" 
        description="Master German, IELTS, and PTE at Language World Karachi. Expert instructors, flexible timings, and certified success center for global opportunities."
      />
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
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 border border-primary/20">
              <Globe2 size={16} />
              <span>Leading Language Institute in Karachi</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-accent leading-tight mb-6">
              Master Languages. <span className="text-primary italic">Unlock</span> Global Opportunities.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              Join Language World and prepare for success in German language, IELTS, PTE, LanguageCert, and Business Communication with expert instructors.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => openApplyModal()}
                className="btn-accent w-full sm:w-auto px-6 py-4 text-base group shadow-xl shadow-accent/25"
              >
                Book a Free Consultation <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href={`https://wa.me/${CONTACT_INFO.whatsapp}`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-outline w-full sm:w-auto px-10 py-5 text-lg bg-white"
              >
                <MessageCircle fill="currentColor" /> Contact on WhatsApp
              </a>
            </div>

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
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white animate-float">
              <img 
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000" 
                alt="Happy Student" 
                className="w-full aspect-[4/5] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 z-20 glass-card p-6 rounded-2xl shadow-xl border border-primary/20 max-w-[200px]"
            >
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary mb-2">
                <Award size={24} />
              </div>
              <h4 className="font-bold text-accent">IELTS Award</h4>
              <p className="text-xs text-gray-500">Certified Success Center</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 z-20 glass-card p-6 rounded-2xl shadow-xl border border-accent/20 max-w-[200px]"
            >
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center text-accent mb-2">
                <Users2 size={24} />
              </div>
              <h4 className="font-bold text-accent">Expert Tutors</h4>
              <p className="text-xs text-gray-500">Learn from the best</p>
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
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
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
