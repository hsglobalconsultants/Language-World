import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Award, Search, Loader2, X, ZoomIn } from 'lucide-react';
import { successStoriesService, SuccessStory } from '../services/successStoriesService';
import SEO from '../components/common/SEO';

const DEFAULT_STORIES: SuccessStory[] = [
  {
    id: "default-1",
    studentName: "Muhammad Hammad",
    course: "German A1",
    certificateUrl: "https://images.unsplash.com/photo-1589330273594-fade1ee91647?auto=format&fit=crop&q=80&w=800",
    achievement: "Passed with 92% marks",
    createdAt: new Date(),
    date: "March 2026"
  },
  {
    id: "default-2",
    studentName: "Ayesha Ahmed",
    course: "German B1",
    certificateUrl: "https://images.unsplash.com/photo-1606326666490-4575799a442e?auto=format&fit=crop&q=80&w=800",
    achievement: "Successfully certified for Study in Germany",
    createdAt: new Date(),
    date: "April 2026"
  },
  {
    id: "default-3",
    studentName: "Zainab Malik",
    course: "IELTS Academic",
    certificateUrl: "https://images.unsplash.com/photo-1546410531-bb4caa18d035?auto=format&fit=crop&q=80&w=800",
    achievement: "Achieved 7.5 Band Score",
    createdAt: new Date(),
    date: "May 2026"
  }
];

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = successStoriesService.getStories((data) => {
      if (data.length > 0) {
        setStories(data);
      } else {
        setStories(DEFAULT_STORIES);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredStories = stories.filter(story => 
    story.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.achievement?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen pb-24">
      <SEO 
        title="Student Success Stories | Language World Certificates"
        description="View our student's international language proficiency certificates and success stories from Language World Karachi."
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-accent overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 mb-6"
          >
            <Trophy size={16} />
            <span className="text-xs font-black uppercase tracking-widest leading-none pt-0.5">Champions of Language World</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
            Wall of <span className="text-primary italic">Success</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg font-medium">
            Celebrating the hard work and international success of our brilliant students who achieved their dreams.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-20 z-30 bg-white py-6 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search by student name or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-soft-gray border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-accent transition-all"
            />
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-primary mb-4" size={48} />
            <span className="font-bold text-accent">Loading achievements...</span>
          </div>
        ) : filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <motion.div 
                key={story.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl group"
              >
                <div className="relative aspect-[3/4] overflow-hidden cursor-zoom-in" onClick={() => setSelectedImage(story.certificateUrl)}>
                  <img 
                    src={story.certificateUrl} 
                    alt={`${story.studentName}'s Certificate`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-accent/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 p-4 rounded-full text-accent scale-50 group-hover:scale-100 transition-transform">
                      <ZoomIn size={32} />
                    </div>
                  </div>
                  <div className="absolute top-6 left-6">
                    <div className="bg-primary text-white p-3 rounded-2xl shadow-lg transform -rotate-12">
                      <Award size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-accent mb-1">{story.studentName}</h3>
                      <p className="text-primary font-black text-xs uppercase tracking-widest">{story.course}</p>
                    </div>
                    {story.date && (
                      <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{story.date}</span>
                    )}
                  </div>
                  {story.achievement && (
                    <p className="text-gray-500 font-medium text-sm leading-relaxed mb-4 border-l-2 border-primary/20 pl-4">
                      "{story.achievement}"
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold text-accent mb-2">No success stories found</h3>
            <p className="text-gray-500">Try adjusting your search terms.</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-accent/95 flex items-center justify-center p-6 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={48} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage} 
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
