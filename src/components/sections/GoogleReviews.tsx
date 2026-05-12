import { motion } from "motion/react";
import { Star, ArrowRight } from "lucide-react";

export default function GoogleReviews() {
  const reviews = [
    {
      stars: 5,
      text: "Excellent institute for IELTS and German language preparation. Highly recommended!",
      author: "Ayesha Khan"
    },
    {
      stars: 5,
      text: "Very professional staff and supportive teachers. Great experience.",
      author: "Muhammad Bilal"
    },
    {
      stars: 5,
      text: "Best study abroad guidance in Karachi. Extremely satisfied.",
      author: "Sana Fatima"
    }
  ];

  return (
    <section className="py-20 px-5 bg-[#f5f7fb] font-sans">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-[50px]">
          <span className="text-[#2563eb] font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2">
            <Star size={16} fill="currentColor" className="text-yellow-500" /> GOOGLE REVIEWS
          </span>
          <h2 className="text-[38px] md:text-[52px] font-bold my-5 text-[#0f172a] leading-tight">
            What Our Students Say
          </h2>
          <p className="text-[#64748b] text-lg max-w-2xl mx-auto">
            Real experiences from our students at Language World Pakistan.
          </p>
        </div>

        {/* Reviews Widget Section */}
        <div className="bg-white p-4 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] min-h-[400px]">
          {/* Elfsight Google Reviews | Untitled Google Reviews */}
          <div className="elfsight-app-6f353761-5c98-48b5-ba48-88adc235a6fc" data-elfsight-app-lazy></div>
        </div>

        {/* Review Button */}
        <div className="text-center mt-[50px]">
          <a 
            href="https://share.google/2Ptq4VR4RGGFzESPf" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white px-[35px] py-[18px] rounded-[14px] font-bold no-underline transition-colors duration-300 hover:bg-[#1d4ed8]"
          >
            Review Us on Google <ArrowRight size={20} />
          </a>
        </div>

      </div>
    </section>
  );
}
