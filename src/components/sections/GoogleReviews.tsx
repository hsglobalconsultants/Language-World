import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import { settingsService, GoogleReviewItem } from "../../services/settingsService";

export default function GoogleReviews() {
  const [siteReviews, setSiteReviews] = useState<GoogleReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultReviews: GoogleReviewItem[] = [
    {
      stars: 5,
      text: "I passed my German A1 exam in the first attempt with 89 marks! The faculty at Language World is outstanding. Special thanks to the teachers who support and guide everyone thoroughly. Best institute in Karachi for German language!",
      author: "Ayesha Khan",
      role: "German A1 Student",
      date: "3 days ago",
      initials: "AK",
      bgColor: "bg-emerald-600",
    },
    {
      stars: 5,
      text: "Highly recommended for IELTS academic preparation! I scored 7.5 bands in just 4 weeks of preparation. The daily mock tests and intensive feedback sessions were extremely helpful. Excellent environment and professional teachers.",
      author: "Muhammad Bilal",
      role: "IELTS Academic (7.5 Bands)",
      date: "1 week ago",
      initials: "MB",
      bgColor: "bg-blue-600",
    },
    {
      stars: 5,
      text: "I finished my German B1 and obtained visa support from them. Truly professional and reliable consultants. They handle everything from language classes to university admission guidance very smoothly.",
      author: "Sana Fatima",
      role: "German B1 Alumni & Visa Success",
      date: "2 weeks ago",
      initials: "SF",
      bgColor: "bg-fuchsia-600",
    },
    {
      stars: 5,
      text: "Best institute for PTE Academic classes in Karachi. The computer-based simulator they provide is exactly like the real Pearson exam. Teachers explain secret shortcuts and strategies. I got my 79+ score card! 100% recommended.",
      author: "Zeeshan Ahmed",
      role: "PTE Academic (79+ Score)",
      date: "1 month ago",
      initials: "ZA",
      bgColor: "bg-amber-600",
    },
    {
      stars: 5,
      text: "Extremely helpful administrative staff. I needed OET preparation for my UK residency visa, and their custom materials and individual speaking sessions helped me clear my exam on the first try. Thank you, Language World!",
      author: "Dr. Sarah Munir",
      role: "OET Preparation Student",
      date: "1 month ago",
      initials: "SM",
      bgColor: "bg-indigo-600",
    },
    {
      stars: 5,
      text: "I attended German classes in the evening batch due to my job. The class timings are super flexible, and the teaching quality is identical to Goethe-Institut Karachi standards but at a much more reasonable fee structure.",
      author: "Kamran Shah",
      role: "German A2 Student (Evening Batch)",
      date: "1 month ago",
      initials: "KS",
      bgColor: "bg-rose-600",
    },
  ];

  useEffect(() => {
    // Attempt local storage cache read for speed
    try {
      const cached = localStorage.getItem("siteSettings");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.reviews && Array.isArray(parsed.reviews) && parsed.reviews.length > 0) {
          setSiteReviews(parsed.reviews);
          setLoading(false);
        }
      }
    } catch (e) {
      console.warn("Error parsing settings cache", e);
    }

    const fetchReviews = async () => {
      const data = await settingsService.getSettings();
      if (data?.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
        setSiteReviews(data.reviews);
      } else {
        setSiteReviews(defaultReviews);
      }
      setLoading(false);
    };
    fetchReviews();

    const unsub = settingsService.subscribeToSettings((data) => {
      if (data?.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
        setSiteReviews(data.reviews);
      } else {
        setSiteReviews(defaultReviews);
      }
    });

    return () => unsub();
  }, []);

  const reviewsToRender = siteReviews.length > 0 ? siteReviews : defaultReviews;

  return (
    <section className="py-24 px-5 bg-gradient-to-b from-soft-gray to-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Summary */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-secondary font-display font-black tracking-widest uppercase text-xs flex items-center gap-2 mb-3">
              <Star size={14} fill="currentColor" className="text-yellow-500" /> STUDENT TESTIMONIALS
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-display font-black text-accent uppercase leading-none tracking-tight">
              Verified Google Reviews
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-medium mt-4 leading-relaxed">
              Read transparent, authentic stories of students who transformed their careers, cleared Goethe tests, and scored competitive bands in IELTS/PTE.
            </p>
          </div>

          {/* Google Ratings Stat Badge */}
          <div className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm shrink-0 w-full sm:w-auto">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="#ea4335"
                  d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-7.995 0-4.417 3.53-7.995 7.86-7.995 2.46 0 4.105 1.025 5.047 1.926l3.235-3.11C18.29 1.74 15.538 1 12.24 1 5.485 1 .012 6.474.012 13.226c0 6.753 5.473 12.227 12.228 12.227 7.055 0 11.75-4.942 11.75-11.944 0-.806-.089-1.424-.196-2.224h-11.554z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-display font-black text-accent">5.0</span>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 font-bold tracking-wider uppercase">VERIFIED REVIEWS ON GOOGLE</p>
            </div>
          </div>
        </div>

        {/* Native Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewsToRender.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full ${review.bgColor} text-white flex items-center justify-center font-bold text-sm select-none`}>
                      {review.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display font-black text-xs text-accent uppercase tracking-wide">{review.author}</h4>
                        <CheckCircle2 size={13} className="text-[#2563eb]" fill="#e0e7ff" />
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-0.5">{review.role}</p>
                    </div>
                  </div>
                  {/* Google Custom Tiny Badge */}
                  <div className="w-5 h-5 bg-gray-50 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285f4"
                        d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.56-1.56 2.95-3.18 3.5v2.88h5.13c3-2.77 4.73-6.85 4.73-11.64 0-.62-.06-1.21-.19-1.47z"
                      />
                      <path
                        fill="#34a853"
                        d="M12.18 20.45c2.7 0 4.96-.9 6.62-2.43l-5.13-2.88c-.83.65-2.03 1.05-3.41 1.05-2.6 0-4.81-1.75-5.6-4.1H1.4v2.98c1.72 3.42 5.27 5.77 9.38 5.77z"
                      />
                      <path
                        fill="#fbbc05"
                        d="M6.58 12.09c-.21-.63-.33-1.3-.33-1.99s.12-1.36.33-1.99V5.13H1.4c-.71 1.4-1.12 2.98-1.12 4.67 0 1.69.41 3.27 1.12 4.67l5.18-4.04z"
                      />
                      <path
                        fill="#ea4335"
                        d="M12.18 5.25c1.47 0 2.79.5 3.82 1.49l2.86-2.86C17.13 2.22 14.88 1.12 12.18 1.12c-4.11 0-7.66 2.35-9.38 5.77l5.18 4.04c.79-2.35 3-4.1 5.6-4.1z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                  <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase ml-2 select-none">Verified review</span>
                </div>

                {/* Text */}
                <p className="text-gray-500 text-sm font-medium leading-relaxed italic">
                  "{review.text}"
                </p>
              </div>

              {/* Date Column */}
              <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400 font-black tracking-widest uppercase ml-1">
                <span>{review.date}</span>
                <span className="text-[#3b82f6]">Posted via Google</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://share.google/bekctda1Wo4vch7dS"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2563eb] text-white px-8 py-5 rounded-2xl font-black tracking-wider text-xs uppercase hover:bg-[#1d4ed8] hover:shadow-xl hover:shadow-blue-100 transition-all duration-300"
          >
            Review Us on Google <ArrowRight size={16} />
          </a>
          <button
            onClick={() => {
              const contactElement = document.getElementById("contact");
              if (contactElement) {
                contactElement.scrollIntoView({ behavior: "smooth" });
              } else {
                window.location.href = "/contact";
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-accent border border-gray-100 px-8 py-5 rounded-2xl font-black tracking-wider text-xs uppercase hover:bg-gray-50 transition-all duration-300"
          >
            <MessageSquare size={16} /> Contact Support
          </button>
        </div>

      </div>
    </section>
  );
}
