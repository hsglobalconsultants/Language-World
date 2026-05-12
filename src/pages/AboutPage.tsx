import { motion } from "motion/react";
import { Award, Target, Users, Globe } from "lucide-react";
import { CONTACT_INFO, ABOUT_STATS, MISSION_VISION } from "../constants/data";
import SEO from "../components/common/SEO";

export default function AboutPage() {
  const valuesIcons = [<Target size={32} />, <Globe size={32} />, <Award size={32} />];
  return (
    <div className="flex flex-col">
      <SEO title="About Us" description="Learn more about Language World, the premier institute for language proficiency and international exam preparation in Karachi." />
      
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-4">Who We Are</h2>
            <h1 className="text-4xl md:text-6xl font-extrabold text-accent mb-8 leading-tight">
              Your Gateway to <br /> Global Communication
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded with the vision to bridge communication gaps, Language World has emerged as Karachi's leading institute for language learning and international exam coaching.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We specialize in preparing students for global success through intensive language training in German and comprehensive preparation for IELTS, PTE, and LanguageCert examinations. Our methodology combines traditional teaching with modern technology to deliver unparalleled results.
            </p>
            <div className="grid grid-cols-2 gap-8">
              {ABOUT_STATS.map((stat, i) => (
                <div key={i}>
                  <h4 className="text-4xl font-extrabold text-primary mb-1">{stat.value}</h4>
                  <p className="text-sm font-bold text-accent uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-soft-gray">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                alt="Our Team" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-accent text-white p-10 rounded-[2.5rem] hidden md:block">
              <p className="text-3xl font-extrabold mb-1">Success</p>
              <p className="text-sm opacity-70">Starts with Language World</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-soft-gray">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold text-accent mb-6">Our Mission & Vision</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Empowering individuals through language proficiency to unlock international academic and professional opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {MISSION_VISION.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-primary mb-8 shadow-sm border border-gray-100">
                  {valuesIcons[i]}
                </div>
                <h4 className="text-2xl font-bold text-accent mb-4">{item.title}</h4>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
