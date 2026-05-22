import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Award, ArrowRight, Loader2, Star } from 'lucide-react';
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
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = successStoriesService.getStories((data) => {
      if (data.length > 0) {
        setStories(data.slice(0, 6)); // Show latest 6
      } else {
        setStories(DEFAULT_STORIES);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-[2rem] shadow-xl border border-white hover:border-primary/20 transition-all group"
            >
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
              {story.achievement && (
                <p className="text-gray-500 text-sm font-medium line-clamp-2 italic">
                  "{story.achievement}"
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
