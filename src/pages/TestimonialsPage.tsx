import { motion } from "motion/react";
import { TESTIMONIALS } from "../constants/data";
import SEO from "../components/common/SEO";
import { Quote, ArrowRight } from "lucide-react";
import GoogleReviews from "../components/sections/GoogleReviews";

export default function TestimonialsPage() {
  return (
    <div className="flex flex-col">
      <SEO title="Testimonials" description="Hear from our successful students who mastered languages and achieved high scores in IELTS and PTE with Language World." />
      
      <section className="bg-accent py-24 text-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Student <span className="text-primary italic">Success</span> Stories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            Join more than 500 successful students who have achieved their dreams with Language World.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <GoogleReviews />
        </div>
      </section>
    </div>
  );
}
