import { motion } from "motion/react";
import { COURSES } from "../constants/data";
import CourseCard from "../components/common/CourseCard";
import SEO from "../components/common/SEO";

export default function CoursesPage() {
  return (
    <div className="flex flex-col">
      <SEO title="Our Courses" description="Explore our range of language courses including German (A1-B2), IELTS, PTE, and Business Communication in Karachi." />
      
      <section className="bg-accent py-24 text-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Explore <span className="text-primary italic">Our</span> Courses
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            Find the perfect course to advance your career and communication skills.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {COURSES.map((course, i) => (
            <CourseCard key={course.id} index={i} {...course} />
          ))}
        </div>
      </section>
    </div>
  );
}
