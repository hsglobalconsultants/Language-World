import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User, Search } from "lucide-react";
import SEO from "../components/common/SEO";

import { blogService } from "../services/blogService";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { BLOG_POSTS, BlogPost } from "../constants/blogs";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const dbBlogs = await blogService.getAllBlogs();
        if (dbBlogs.length > 0) {
          // Merge or replace. Here I'll put DB blogs first as they are "new"/updated
          // We filter out duplicates if we ever migrate
          setBlogs([...dbBlogs, ...BLOG_POSTS.filter(sb => !dbBlogs.find(db => db.title === sb.title))]);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      <SEO title="Blog" description="Educational blog and resources for language learners, test takers, and corporate professionals in Karachi." />
      
      <section className="bg-soft-gray py-24 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-accent mb-6"
          >
            Insights & <span className="text-primary italic">Resources</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto mb-12"
          >
            Explore our latest articles, guides, and tips to help you master languages and excel in your exams.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input 
              type="text"
              placeholder="Search articles by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-transparent focus:border-primary px-16 py-5 rounded-full shadow-lg outline-none transition-all placeholder:text-gray-400 text-accent font-medium"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredBlogs.map((blog, i) => (
                <motion.article 
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={blog.image || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800"} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                    <div className="absolute top-6 left-6 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
                      {blog.tag}
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex gap-4 text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span>
                      <span className="flex items-center gap-1"><User size={14} /> {blog.author}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-accent mb-4 group-hover:text-primary transition-colors leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed flex-grow">
                      {blog.excerpt}
                    </p>
                    <Link to={`/blog/${blog.id}`} className="flex items-center gap-2 font-bold text-accent group-hover:text-primary transition-colors">
                      Read More <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-bold text-accent mb-2">No results found</h3>
              <p className="text-gray-500">We couldn't find any articles matching your search query.</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-6 text-primary font-bold hover:underline"
              >
                Clear search and view all posts
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
