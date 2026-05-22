import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Type, 
  Tag as TagIcon,
  Calendar,
  User,
  Loader2,
  Eye,
  Sparkles
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { blogService } from "../../services/blogService";
import { generateMetaDescription, generateKeywords } from "../../utils/seoGenerator";

export default function AdminBlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: "Admin",
    tag: "IELTS",
    image: "",
    excerpt: "",
    content: "",
    metaDescription: "",
    keywords: ""
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        const blog = await blogService.getBlogById(id);
        if (blog) {
          setFormData({
            title: blog.title,
            date: blog.date,
            author: blog.author,
            tag: blog.tag,
            image: blog.image,
            excerpt: blog.excerpt,
            content: blog.content,
            metaDescription: blog.metaDescription || "",
            keywords: blog.keywords || ""
          });
        }
        setLoading(false);
      };
      fetchBlog();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id) {
        await blogService.updateBlog(id, formData);
      } else {
        await blogService.createBlog(formData);
      }
      navigate("/admin");
    } catch (error) {
      console.error("Failed to save blog", error);
      alert("Error saving blog. Check console.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-soft-gray p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-accent font-bold transition-all">
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold hover:shadow-md transition-all"
            >
              <Eye size={20} /> {isPreview ? "Edit Mode" : "Preview Mode"}
            </button>
            <button 
              form="blog-form"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {id ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </header>

        {isPreview ? (
          <div className="bg-white rounded-[2.5rem] p-12 shadow-sm min-h-[40vh]">
            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold mb-6 inline-block uppercase tracking-widest">{formData.tag}</span>
            <h1 className="text-4xl md:text-5xl font-black text-accent mb-8">{formData.title || "Untitled Post"}</h1>
            <div className="flex gap-6 text-gray-400 text-sm mb-12">
              <span className="flex items-center gap-2"><Calendar size={14} /> {formData.date}</span>
              <span className="flex items-center gap-2"><User size={14} />By {formData.author}</span>
            </div>
            {formData.image && (
              <img src={formData.image} alt="Preview" className="w-full h-80 object-cover rounded-3xl mb-12" referrerPolicy="no-referrer" />
            )}
            <div 
              className="blog-content-wrapper"
              dangerouslySetInnerHTML={{ __html: formData.content || "<p className='text-gray-400 italic'>No content yet...</p>" }}
            />
          </div>
        ) : (
          <form id="blog-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm space-y-8">
              {/* Title Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Type size={14} /> Title
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. How to master German A1 in 30 days"
                    className="w-full bg-soft-gray border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none font-bold text-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <TagIcon size={14} /> Category / Tag
                  </label>
                  <select 
                    value={formData.tag}
                    onChange={(e) => setFormData({...formData, tag: e.target.value})}
                    className="w-full bg-soft-gray border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none font-bold text-accent"
                  >
                    <option>IELTS</option>
                    <option>German</option>
                    <option>Visa</option>
                    <option>PTE</option>
                    <option>Study Abroad</option>
                    <option>Business</option>
                    <option>English</option>
                  </select>
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={14} /> Hero Image URL (Unsplash recommended)
                </label>
                <input 
                  required
                  type="url" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-soft-gray border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none font-medium text-gray-600"
                />
              </div>

              {/* Meta Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Publication Date
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-soft-gray border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none font-medium text-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} /> Author Name
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full bg-soft-gray border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none font-medium text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Excerpt (Brief Summary)</label>
                <textarea 
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full bg-soft-gray border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none font-medium text-gray-600 resize-none"
                  placeholder="Short one-sentence summary for the preview card..."
                />
              </div>

              {/* Dynamic Robust SEO Inputs */}
              <div className="border-t border-gray-100 pt-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-accent uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="text-primary animate-pulse w-4 h-4" /> SEO Optimization Core
                    </h3>
                    <p className="text-[11px] text-gray-400 font-bold">Auto-generate or handcraft meta descriptions and keywords based on content.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const computedDesc = generateMetaDescription(formData.title, formData.content, formData.excerpt);
                      const computedKeywords = generateKeywords(formData.title, formData.content, formData.tag);
                      setFormData(prev => ({
                        ...prev,
                        metaDescription: computedDesc,
                        keywords: computedKeywords
                      }));
                    }}
                    className="flex items-center gap-1.5 bg-primary/15 hover:bg-primary/25 text-[#4B3FBF] hover:text-black transition-all duration-300 font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl border border-primary/20 cursor-pointer"
                  >
                    🪄 Auto-Generate SEO Meta
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex justify-between items-center">
                      <span>Meta Description (120 - 160 Characters)</span>
                      <span className={`text-[10px] ${formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160 ? "text-[#7BC043] font-black" : "text-gray-400 font-bold"}`}>
                        {formData.metaDescription.length} chars
                      </span>
                    </label>
                    <textarea 
                      rows={3}
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                      className="w-full bg-soft-gray border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none font-medium text-gray-600 text-xs resize-none"
                      placeholder="Meta description displayed in search results..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      SEO Keywords (Comma Separated)
                    </label>
                    <textarea 
                      rows={3}
                      value={formData.keywords}
                      onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                      className="w-full bg-soft-gray border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none font-medium text-gray-600 text-xs resize-none"
                      placeholder="e.g. Learn German Karachi, best language center Pakistan..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Main Content (HTML Supported)</label>
                <span className="text-[10px] text-gray-400">Use &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt; tags</span>
              </div>
              <textarea 
                required
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full bg-soft-gray border-none rounded-2xl px-6 py-6 focus:ring-2 focus:ring-primary outline-none font-mono text-sm leading-relaxed"
                placeholder="Write your article here..."
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
