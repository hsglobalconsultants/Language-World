import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, User, ArrowLeft, Share2, Loader2 } from "lucide-react";
import { BLOG_POSTS, BlogPost } from "../constants/blogs";
import SEO from "../components/common/SEO";
import { useEffect, useState } from "react";
import { blogService } from "../services/blogService";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      // Try static first if it's a number
      const staticBlog = BLOG_POSTS.find(b => b.id.toString() === id);
      if (staticBlog) {
        setBlog(staticBlog);
        setLoading(false);
        return;
      }

      // Try Firestore
      try {
        const dbBlog = await blogService.getBlogById(id);
        if (dbBlog) {
          setBlog(dbBlog);
        }
      } catch (err) {
        console.error("Error fetching blog from DB", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold mb-4">Blog Post Not Found</h2>
        <Link to="/blog" className="text-primary font-bold flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      <SEO 
        title={blog.title} 
        description={blog.metaDescription || blog.excerpt} 
        keywords={blog.keywords}
      />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-accent">
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-accent via-accent/50 to-transparent" />
        
        <div className="relative z-10 h-full max-w-4xl mx-auto px-6 flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-4 text-white/80 text-sm font-bold uppercase tracking-widest mb-6"
          >
            <span className="bg-primary px-3 py-1 rounded-full text-white">{blog.tag}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span>
            <span className="flex items-center gap-1"><User size={14} /> {blog.author}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
          >
            {blog.title}
          </motion.h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16">
            {/* Sidebar info */}
            <div className="md:w-1/4 order-2 md:order-1">
              <div className="sticky top-24">
                <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-bold transition-colors mb-12">
                  <ArrowLeft size={20} /> BACK TO BLOG
                </Link>
                
                <div className="p-8 bg-soft-gray rounded-[2rem] border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Share Article</p>
                  <div className="flex gap-4">
                    <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:w-3/4 order-1 md:order-2">
              <div 
                className="blog-content-wrapper"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              <div className="mt-16 pt-16 border-t border-gray-100 italic text-gray-400">
                Disclaimer: The information provided in this blog is for educational and informational purposes only. For official academic or visa advice, please contact our career counselors directly.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-24 bg-soft-gray">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-accent mb-12">More from <span className="text-primary italic">our blog</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.filter(b => b.id !== blog.id).slice(0, 3).map((relatedBlog) => (
              <Link 
                key={relatedBlog.id}
                to={`/blog/${relatedBlog.id}`}
                className="group bg-white p-6 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={relatedBlog.image} 
                    alt={relatedBlog.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="font-bold text-accent group-hover:text-primary transition-colors leading-tight mb-2">
                  {relatedBlog.title}
                </h3>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{relatedBlog.date}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
