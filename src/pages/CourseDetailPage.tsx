import { useParams, Link } from "react-router-dom";
import { COURSES, CONTACT_INFO } from "../constants/data";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, BookOpen, Clock, Users, Award, MessageCircle } from "lucide-react";
import GermanLearningTools from "../components/german/GermanLearningTools";
import GermanMockTest from "../components/german/GermanMockTest";
import PTEMockTest from "../components/pte/PTEMockTest";
import IELTSMockTest from "../components/ielts/IELTSMockTest";
import { useModals } from "../components/ModalContext";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const course = COURSES.find(c => c.id === id);
  const { openApplyModal } = useModals();

  if (!course) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-4xl font-bold text-accent mb-4">Course Not Found</h2>
        <Link to="/courses" className="btn-primary">View All Courses</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
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
              {course.title} <br /> 
              <span className="text-primary italic">Preparation</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/80 leading-relaxed mb-8"
            >
              {course.description} We provide comprehensive training to help you achieve your goals and excel in your {course.title} examination.
            </motion.p>
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
                </div>
              )}
              {id === "pte-preparation" && (
                <div className="mt-12">
                  <PTEMockTest />
                </div>
              )}
              {id === "ielts-preparation" && (
                <div className="mt-12">
                  <IELTSMockTest />
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
                    className="btn-primary w-full py-4 mb-4"
                  >
                    Enroll Now
                  </button>
                  <a 
                    href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=I am interested in the ${course.title} course`}
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-outline w-full py-4 text-[#25D366] border-[#25D366] hover:bg-[#25D366] hover:text-white"
                  >
                    <MessageCircle size={20} /> Chat on WhatsApp
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
