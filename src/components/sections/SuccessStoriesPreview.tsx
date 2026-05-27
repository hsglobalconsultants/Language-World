import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Award, ArrowRight, Loader2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { successStoriesService, SuccessStory } from '../../services/successStoriesService';

const DEFAULT_STORIES: SuccessStory[] = [
  {
    id: "default-1",
    studentName: "Muhammad Hammad",
    course: "German A1",
    certificateUrl: "https://images.unsplash.com/photo-1589330273594-fade1ee91647?auto=format&fit=crop&q=80&w=800",
    achievement: "Passed with 92% marks",
    createdAt: new Date()
  },
  {
    id: "default-2",
    studentName: "Ayesha Ahmed",
    course: "German B1",
    certificateUrl: "https://images.unsplash.com/photo-1606326666490-4575799a442e?auto=format&fit=crop&q=80&w=800",
    achievement: "Successfully certified for Study in Germany",
    createdAt: new Date()
  },
  {
    id: "default-3",
    studentName: "Zainab Malik",
    course: "IELTS Academic",
    certificateUrl: "https://images.unsplash.com/photo-1546410531-bb4caa18d035?auto=format&fit=crop&q=80&w=800",
    achievement: "Achieved 7.5 Band Score",
    createdAt: new Date()
  }
];

export default function SuccessStoriesPreview() {
  const [stories, setStories] = useState<SuccessStory[]>(DEFAULT_STORIES);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = successStoriesService.getStories((data) => {
      if (data.length > 0) {
        setStories(data.slice(0, 12)); // Include more stories for full-featured sliding interaction
      } else {
        setStories(DEFAULT_STORIES);
      }
    });
    return () => unsubscribe();
  }, []);

  const maxIndex = Math.max(0, stories.length - itemsPerView);

  // Auto-sliding interval logic
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 4200); // Move every 4.2s for slow and premium pacing

    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    setIsPaused(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    setIsPaused(true);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
  };

  // Removed stories.length === 0 check to show defaults

  return (
    <section className="py-24 bg-soft-gray overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest mb-4 border border-primary/20"
            >
              <Trophy size={14} />
              <span>Wall of Success</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-accent mb-6 leading-tight uppercase tracking-tighter">
              Wall of <span className="text-primary italic text-shadow-sm">Success</span>
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Real results for real students. Our success stories speak louder than words. Join thousands of students who have proven their language skills globally.
            </p>
          </div>
          <Link 
            to="/success-stories"
            className="group inline-flex items-center gap-3 bg-white hover:bg-accent text-accent hover:text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-accent/10 transition-all duration-300 shadow-xl"
          >
            <span>View All Stories</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Carousel Viewport Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Back/Next Hovering Arrows on Tablet/Desktop viewports */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-20 pointer-events-none hidden md:block">
            <button
              onClick={handlePrev}
              className="pointer-events-auto w-12 h-12 bg-white text-accent hover:bg-slate-900 hover:text-white rounded-full flex items-center justify-center border border-gray-100 shadow-md hover:shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Previous Story"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-20 pointer-events-none hidden md:block">
            <button
              onClick={handleNext}
              className="pointer-events-auto w-12 h-12 bg-white text-accent hover:bg-slate-900 hover:text-white rounded-full flex items-center justify-center border border-gray-100 shadow-md hover:shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Next Story"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Slider track viewport */}
          <div className="overflow-hidden py-4 px-1 rounded-[2.5rem]">
            <div 
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                width: `${(stories.length / itemsPerView) * 100}%`
              }}
            >
              {stories.map((story, i) => {
                const widthPercent = (100 / stories.length);
                return (
                  <div 
                    key={story.id}
                    className="px-4 shrink-0"
                    style={{ width: `${widthPercent}%` }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                      className="bg-white p-6 rounded-[2rem] shadow-xl border border-white hover:border-primary/20 transition-all group h-full flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                          <img 
                            src={story.certificateUrl} 
                            alt={story.studentName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-4 right-4 h-10 w-10 bg-primary text-white flex items-center justify-center rounded-xl shadow-lg transform rotate-12">
                            <Award size={20} />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-primary font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                            {story.course}
                          </span>
                          <div className="flex gap-0.5 text-yellow-400">
                            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-accent mb-2">{story.studentName}</h3>
                      </div>
                      
                      {story.achievement && (
                        <p className="text-gray-500 text-sm font-medium line-clamp-2 italic mt-2 border-t border-slate-50 pt-3">
                          "{story.achievement}"
                        </p>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Nav View Indicator */}
        <div className="flex justify-center mt-8 px-4">
          {/* Indicators for user view */}
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-gray-100 py-2.5 px-4 rounded-xl shadow-sm">
            Story {currentIndex + 1} of {maxIndex + 1}
          </div>
        </div>
      </div>
    </section>
  );
}
