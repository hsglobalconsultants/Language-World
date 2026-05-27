import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, User, ArrowLeft, Share2, Loader2, Copy, Check, Facebook, Twitter, Linkedin } from "lucide-react";
import { BLOG_POSTS, BlogPost } from "../constants/blogs";
import SEO from "../components/common/SEO";
import { useEffect, useState } from "react";
import { blogService } from "../services/blogService";
import { generateMetaDescription, generateKeywords } from "../utils/seoGenerator";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [nativeShareSupported, setNativeShareSupported] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (navigator.share) {
      setNativeShareSupported(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress((window.scrollY / scrollHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [blog, loading]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareOnPlatform = (platform: string) => {
    if (!blog) return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog.title);
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
        break;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleNativeShare = async () => {
    if (!blog) return;
    try {
      await navigator.share({
        title: blog.title,
        text: blog.excerpt || blog.metaDescription,
        url: window.location.href,
      });
    } catch (err) {
      console.error("Failed to share", err);
    }
  };

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

  // Dynamically generate fallback SEO tags if they do not exist
  const cleanMetaDescription = blog.metaDescription && blog.metaDescription.trim()
    ? blog.metaDescription
    : generateMetaDescription(blog.title, blog.content, blog.excerpt);

  const cleanKeywords = blog.keywords && blog.keywords.trim()
    ? blog.keywords
    : generateKeywords(blog.title, blog.content, blog.tag);

  return (
    <div className="flex flex-col bg-white">
      <SEO 
        title={blog.title} 
        description={cleanMetaDescription} 
        keywords={cleanKeywords}
      />

      {/* Elegant Real-Time Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-[5px] z-[9999] pointer-events-none origin-left">
        <div 
          className="h-full bg-gradient-to-r from-primary via-accent-light to-accent transition-all duration-75 ease-out relative shadow-[0_1px_10px_rgba(75,63,191,0.4)]"
          style={{ width: `${scrollProgress}%` }}
        >
          {scrollProgress > 0 && (
            <span className="absolute right-0 top-0 bottom-0 w-6 bg-white/60 blur-[3px] animate-pulse" />
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-accent">
        <img 
          src={blog.image || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800"} 
          alt={blog.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800";
          }}
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
                
                <div className="p-8 bg-soft-gray rounded-[2rem] border border-gray-100 flex flex-col gap-6">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Share Article</p>
                    <p className="text-xs text-gray-500 font-medium">Spread the knowledge with your circle</p>
                  </div>
                  
                  {/* Share buttons grid */}
                  <div className="grid grid-cols-4 gap-3">
                    <button 
                      onClick={() => shareOnPlatform("facebook")} 
                      className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-blue-600 hover:text-white text-gray-400 transition-all duration-300 hover:shadow-lg hover:scale-105 group cursor-pointer"
                      title="Share to Facebook"
                    >
                      <Facebook size={18} className="group-hover:scale-110 transition-transform duration-300" />
                    </button>
                    
                    <button 
                      onClick={() => shareOnPlatform("twitter")} 
                      className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white text-gray-400 transition-all duration-300 hover:shadow-lg hover:scale-105 group cursor-pointer"
                      title="Share to Twitter / X"
                    >
                      <Twitter size={18} className="group-hover:scale-110 transition-transform duration-300" />
                    </button>

                    <button 
                      onClick={() => shareOnPlatform("linkedin")} 
                      className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-blue-700 hover:text-white text-gray-400 transition-all duration-300 hover:shadow-lg hover:scale-105 group cursor-pointer"
                      title="Share to LinkedIn"
                    >
                      <Linkedin size={18} className="group-hover:scale-110 transition-transform duration-300" />
                    </button>

                    <button 
                      onClick={() => shareOnPlatform("whatsapp")} 
                      className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-green-500 hover:text-white text-gray-400 transition-all duration-300 hover:shadow-lg hover:scale-105 group cursor-pointer"
                      title="Share to WhatsApp"
                    >
                      <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.003 2c-5.52 0-9.99 4.47-9.99 9.99 0 1.77.46 3.44 1.28 4.91L2 22l5.24-1.37c1.41.77 3 1.21 4.76 1.21 5.52 0 9.99-4.47 9.99-9.99 0-5.52-4.47-9.99-9.99-9.99zm5.32 14.17c-.24.67-1.19 1.23-1.63 1.27-.45.04-.97.06-2.58-.59-2.06-.85-3.38-2.93-3.49-3.07-.1-.13-.86-1.13-.86-2.15s.53-1.52.72-1.72c.19-.2.43-.25.57-.25h.41c.14 0 .33-.05.51.38.19.45.64 1.56.69 1.67.05.1.09.23.01.4-.08.16-.16.27-.27.4-.11.13-.24.23-.34.35-.11.11-.22.24-.09.46.13.22.58.95 1.24 1.54.85.76 1.57.99 1.79 1.11.22.11.35.09.48-.06.13-.15.55-.64.7-.86.15-.22.3-.19.51-.11.22.08 1.4.66 1.64.78.24.11.41.17.47.28.06.11.06.64-.18 1.31z"/>
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
                    {/* Copy Link button */}
                    <button 
                      onClick={handleCopyLink}
                      className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 border text-[11px] font-extrabold tracking-wider transition-all duration-300 shadow-sm cursor-pointer ${
                        copied 
                          ? 'bg-green-500 border-green-500 text-white shadow-green-100' 
                          : 'bg-white border-gray-100 text-accent hover:border-accent/20 hover:bg-gray-50'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="animate-bounce" /> LINK COPIED
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> COPY ARTICLE LINK
                        </>
                      )}
                    </button>

                    {/* Native Share button if supported */}
                    {nativeShareSupported && (
                      <button 
                        onClick={handleNativeShare}
                        className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/95 text-white text-[11px] font-extrabold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        <Share2 size={13} /> MORE OPTIONS
                      </button>
                    )}
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
                    src={relatedBlog.image || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800"} 
                    alt={relatedBlog.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800";
                    }}
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
