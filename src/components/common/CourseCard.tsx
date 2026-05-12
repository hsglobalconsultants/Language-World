import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  path: string;
  index: number;
  [key: string]: any;
}

export default function CourseCard({ title, subtitle, description, image, features, path, index }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-soft-gray flex flex-col h-full"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-accent/60 to-transparent flex items-bottom p-6 overflow-hidden">
          <span className="mt-auto bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{subtitle}</span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-accent mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">{description}</p>
        
        <div className="space-y-2 mb-8">
          {features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle2 size={14} className="text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <Link 
          to={path} 
          className="flex items-center justify-between w-full p-2 pl-4 bg-soft-gray rounded-full group/btn hover:bg-primary transition-all duration-300"
        >
          <span className="font-bold text-accent group-hover/btn:text-white transition-colors">Course Details</span>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-accent group-hover/btn:text-primary shadow-sm">
            <ArrowRight size={20} />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
