import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Camera, Loader2 } from 'lucide-react';
import { galleryService, GalleryItem } from '../../services/galleryService';

const DEFAULT_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    title: "Language World Achievement",
  },
  {
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    title: "Interactive Classroom Session",
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    title: "Collaborative Learning",
  },
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    title: "Student Discussion",
  },
  {
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    title: "Modern Classrooms",
  },
  {
    url: "https://images.unsplash.com/photo-1577891729319-f69fb380d888?auto=format&fit=crop&q=80&w=800",
    title: "Expert Guidance",
  },
  {
    url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
    title: "Test Preparation",
  },
  {
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
    title: "Group Activities",
  }
];

export default function LifeAtLW() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = galleryService.getGallery((data) => {
      if (data.length > 0) {
        setImages(data);
      } else {
        setImages(DEFAULT_IMAGES);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="py-24 bg-white flex justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // Ensure we have at least some images to show the grid
  const displayImages = images.length >= 5 ? images : [...images, ...DEFAULT_IMAGES].slice(0, 5);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest mb-4 border border-primary/20"
          >
            <Camera size={14} />
            <span>Our Campus Life</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-accent mb-6 leading-tight uppercase tracking-tighter">
            Life at <span className="text-primary italic">Language World</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">
            Take a look inside our vibrant learning community where students grow, interact, and achieve their international dreams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[800px]">
          {/* Main Large Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="col-span-1 sm:col-span-2 md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-xl min-h-[300px] sm:min-h-[400px] md:min-h-0 aspect-[4/3] sm:aspect-video md:aspect-auto"
          >
            <img 
              src={displayImages[0]?.url} 
              alt={displayImages[0]?.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-accent/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
              <h4 className="text-white text-2xl font-black uppercase tracking-tighter">{displayImages[0]?.title}</h4>
              <p className="text-white/60 text-sm font-bold">Creating bright futures together</p>
            </div>
          </motion.div>

          {/* Medium Top */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="col-span-1 row-span-1 relative group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] shadow-lg aspect-square md:aspect-auto"
          >
            <img 
              src={displayImages[1]?.url} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="col-span-1 row-span-1 relative group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] shadow-lg aspect-square md:aspect-auto"
          >
            <img 
              src={displayImages[2]?.url} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Medium Bottom */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="col-span-1 row-span-1 relative group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] shadow-lg aspect-square md:aspect-auto"
          >
            <img 
              src={displayImages[3]?.url} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="col-span-1 row-span-1 relative group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] shadow-lg aspect-square md:aspect-auto"
          >
            <img 
              src={displayImages[4]?.url} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-soft-gray rounded-full text-xs font-black text-accent uppercase tracking-[0.2em]">
            <Sparkles className="text-primary" size={16} /> 
            Inspiring environments for inspired learners
          </div>
        </div>
      </div>
    </section>
  );
}
