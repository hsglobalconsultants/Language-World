import React, { useState, useEffect } from "react";
import { Save, Upload, X, Loader2, Image as ImageIcon, Plus, Trash2, Star, CheckCircle2, Edit2, Megaphone, Bell } from "lucide-react";
import { settingsService, SiteSettings, GoogleReviewItem } from "../../services/settingsService";

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Custom reviews editor states
  const [newAuthor, setNewAuthor] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newStars, setNewStars] = useState(5);
  const [newText, setNewText] = useState("");
  const [newDate, setNewDate] = useState("Just now");
  const [newBgColor, setNewBgColor] = useState("bg-[#2563eb]");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await settingsService.getSettings();
      if (data) {
        setSettings(data);
      } else {
        // Initialize with default if not exists
        setSettings({
          heroImage: "https://images.unsplash.com/photo-1622675363211-6e7ad0d6c760?auto=format&fit=crop&q=80&w=1000",
        });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const compressImage = (file: File, maxDimension: number = 1200, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Could not get 2D context from canvas"));
            return;
          }

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed data url
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Failed to load image object"));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsSubmitting(true);
    
    try {
      // Compress the image down to standard optimized web resolution & size
      const compressedDataUrl = await compressImage(file, 1400, 0.75);
      setSettings(prev => prev ? ({ ...prev, heroImage: compressedDataUrl }) : null);
    } catch (err: any) {
      console.error("Image compression failed:", err);
      setError("Failed to process and compress your image. Please try another file.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsSubmitting(true);
    
    try {
      // Compress the logo down to optimized dimensions for fast header loads
      const compressedDataUrl = await compressImage(file, 600, 0.85);
      setSettings(prev => prev ? ({ ...prev, logoImage: compressedDataUrl }) : null);
    } catch (err: any) {
      console.error("Logo compression failed:", err);
      setError("Failed to process and compress website logo. Please try another file.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePopupFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsSubmitting(true);
    
    try {
      // Compress the announcement / update image down to fast web size (around 1000px max dimension)
      const compressedDataUrl = await compressImage(file, 1000, 0.8);
      setSettings(prev => {
        if (!prev) return null;
        return {
          ...prev,
          popup: {
            ...(prev.popup || { enabled: false, image: "", title: "", link: "", buttonText: "Learn More" }),
            image: compressedDataUrl
          }
        };
      });
    } catch (err: any) {
      console.error("Popup banner compression failed:", err);
      setError("Failed to process and compress updating image banner. Please try another file.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await settingsService.updateSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error updating settings:", err);
      setError(err.message || "Failed to update settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReview = () => {
    if (!newAuthor.trim() || !newText.trim()) {
      setError("Please fill out both the Student Name and Review Text fields.");
      return;
    }

    const initials = newAuthor
      .split(" ")
      .map(n => n[0])
      .join("")
      .trim()
      .substring(0, 3)
      .toUpperCase() || "LW";

    const newReview: GoogleReviewItem = {
      author: newAuthor,
      role: newRole || "Student",
      stars: newStars,
      text: newText,
      date: newDate || "Just now",
      initials,
      bgColor: newBgColor,
    };

    setSettings(prev => {
      if (!prev) return null;
      const currentReviews = prev.reviews || [];
      if (editingIndex !== null) {
        const updated = [...currentReviews];
        updated[editingIndex] = newReview;
        return {
          ...prev,
          reviews: updated
        };
      } else {
        return {
          ...prev,
          reviews: [...currentReviews, newReview]
        };
      }
    });

    // Reset inputs
    setNewAuthor("");
    setNewRole("");
    setNewStars(5);
    setNewText("");
    setNewDate("Just now");
    setNewBgColor("bg-[#2563eb]");
    setEditingIndex(null);
    setError(null);
  };

  const handleStartEditReview = (index: number) => {
    if (!settings?.reviews?.[index]) return;
    const review = settings.reviews[index];
    setNewAuthor(review.author);
    setNewRole(review.role);
    setNewStars(review.stars);
    setNewText(review.text);
    setNewDate(review.date);
    setNewBgColor(review.bgColor || "bg-[#2563eb]");
    setEditingIndex(index);
    setError(null);
  };

  const handleCancelEditReview = () => {
    setNewAuthor("");
    setNewRole("");
    setNewStars(5);
    setNewText("");
    setNewDate("Just now");
    setNewBgColor("bg-[#2563eb]");
    setEditingIndex(null);
    setError(null);
  };

  const handleDeleteReview = (index: number) => {
    setSettings(prev => {
      if (!prev) return null;
      const currentReviews = prev.reviews || [];
      const updated = currentReviews.filter((_, i) => i !== index);
      return {
        ...prev,
        reviews: updated
      };
    });
    // If the review we were editing got deleted, cancel edit mode
    if (editingIndex === index) {
      handleCancelEditReview();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleLoadDefaultReviews = () => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        reviews: [...defaultReviews]
      };
    });
    handleCancelEditReview();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-100 border border-red-200 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
            <X size={16} /> {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-100 border border-green-200 text-green-600 rounded-2xl text-sm font-bold flex items-center gap-2">
            <Save size={16} /> All settings saved successfully!
          </div>
        )}

        {/* SECTION 1: Brand Logo Settings */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
              <Upload size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-accent uppercase tracking-tight">Website Logo Settings</h2>
              <p className="text-sm text-gray-500 font-medium font-sans">Upload your custom center/header logo. Replaces the default text brand.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Upload Logo (PNG, SVG, JPG)</label>
                <div className="relative group/logo-upload h-[140px]">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-full border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center bg-soft-gray group-hover/logo-upload:border-accent/30 transition-colors">
                    <Upload className="text-gray-300 mb-2" size={24} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to upload logo</span>
                    <span className="text-[10px] font-bold text-gray-300 italic mt-1">Supports transparent backgrounds</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Or use Logo URL</label>
                <input 
                  type="url" 
                  value={settings?.logoImage?.startsWith('data:') ? '' : (settings?.logoImage || '')}
                  onChange={(e) => setSettings(prev => prev ? ({ ...prev, logoImage: e.target.value }) : null)}
                  className="w-full px-6 py-4 bg-soft-gray border-none rounded-2xl focus:ring-2 focus:ring-accent/20 font-bold text-accent"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              {settings?.logoImage && (
                <button
                  type="button"
                  onClick={() => setSettings(prev => prev ? ({ ...prev, logoImage: "" }) : null)}
                  className="text-xs text-red-500 hover:text-red-700 font-black tracking-wider uppercase ml-4 flex items-center gap-1 cursor-pointer"
                >
                  <X size={12} /> Reset to Default Text Logo
                </button>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Logo Preview (Dark/Light Canvas)</label>
              <div className="grid grid-cols-2 gap-3">
                {/* On Light BG */}
                <div className="p-6 rounded-2xl border border-gray-100 bg-white flex flex-col items-center justify-center min-h-[140px] text-center shadow-inner">
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">On Light Layout</span>
                  {settings?.logoImage ? (
                    <img 
                      src={settings.logoImage} 
                      alt="Logo Preview Light" 
                      className="max-h-12 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-xs text-gray-400 italic">Default Text Accent Brand</span>
                  )}
                </div>

                {/* On Dark BG */}
                <div className="p-6 rounded-2xl bg-accent flex flex-col items-center justify-center min-h-[140px] text-center shadow-inner">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">On Dark Layout</span>
                  {settings?.logoImage ? (
                    <img 
                      src={settings.logoImage} 
                      alt="Logo Preview Dark" 
                      className="max-h-12 w-auto object-contain brightness-0 invert"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-xs text-white/40 italic">Default Text Light Brand</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Hero Section Settings */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <ImageIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-accent uppercase tracking-tight">Hero Section Settings</h2>
              <p className="text-sm text-gray-500 font-medium">Manage the main image on your homepage.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Replace Group Image (Hero)</label>
                <div className="relative group/upload h-[200px]">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-full border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center bg-soft-gray group-hover/upload:border-primary/30 transition-colors">
                    <Upload className="text-gray-300 mb-2" size={32} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to upload new image</span>
                    <span className="text-[10px] font-bold text-gray-300 italic mt-1">Recommended: Portrait/Square, Max 800KB</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Or use Image URL</label>
                <input 
                  type="url" 
                  value={settings?.heroImage?.startsWith('data:') ? '' : (settings?.heroImage || '')}
                  onChange={(e) => setSettings(prev => prev ? ({ ...prev, heroImage: e.target.value }) : null)}
                  className="w-full px-6 py-4 bg-soft-gray border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-accent"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Live Preview</label>
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                <img 
                  src={settings?.heroImage || ""} 
                  alt="Hero Preview" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Real Google Reviews Manager */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                <Star size={24} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-xl font-black text-accent uppercase tracking-tight">Google Reviews Manager</h2>
                <p className="text-sm text-gray-500 font-medium">Add, manage and feature your REAL Google Maps reviews on the homepage.</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleLoadDefaultReviews}
              className="text-xs shrink-0 bg-gray-100 text-gray-600 hover:bg-gray-200 font-black tracking-wider uppercase px-4 py-3 rounded-xl transition duration-300 flex items-center gap-1.5 self-start sm:self-center"
            >
              <Plus size={14} /> Import Default Reviews
            </button>
          </div>

          {/* Add Review Panel Form */}
          <div className="bg-soft-gray p-6 rounded-3xl border border-gray-100 mb-8">
            <h3 className="text-xs font-black text-accent uppercase tracking-wider mb-4 flex items-center gap-1.5">
              {editingIndex !== null ? (
                <span className="text-[#2563eb]">✏️ Editing Review Card #{editingIndex + 1}</span>
              ) : (
                <>Add New Google Review Card</>
              )}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Student Name</label>
                <input 
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-accent/10 font-bold text-accent text-sm"
                  placeholder="e.g. Hammad Siddiqui"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Role / Achievement / Exam Score</label>
                <input 
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-accent/10 font-bold text-accent text-sm"
                  placeholder="e.g. German B1 (Passed with 85 marks)"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Publish Date / Relative Time</label>
                <input 
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-accent/10 font-bold text-accent text-sm"
                  placeholder="e.g. 5 days ago"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Star Rating</label>
                <select
                  value={newStars}
                  onChange={(e) => setNewStars(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-accent/10 font-bold text-accent text-sm"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">UI Avatar Accent Color</label>
                <select
                  value={newBgColor}
                  onChange={(e) => setNewBgColor(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-accent/10 font-bold text-accent text-sm"
                >
                  <option value="bg-blue-600">Blue (Google Standard)</option>
                  <option value="bg-emerald-600">Emerald Green (German)</option>
                  <option value="bg-amber-600">Amber Orange (PTE)</option>
                  <option value="bg-fuchsia-600">Fuchsia (Consultancy)</option>
                  <option value="bg-indigo-600">Indigo (OET)</option>
                  <option value="bg-rose-600">Rose Red</option>
                  <option value="bg-accent">Navy Black</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Review Text Content</label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-accent/10 font-bold text-accent text-sm"
                placeholder="Paste the student's real Google Maps review text here..."
              />
            </div>

            <div className="flex justify-end gap-3">
              {editingIndex !== null && (
                <button
                  type="button"
                  onClick={handleCancelEditReview}
                  className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-xs uppercase hover:bg-gray-300 transition-all font-sans"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="button"
                onClick={handleAddReview}
                className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-bold text-xs uppercase hover:bg-black transition-all font-sans"
              >
                {editingIndex !== null ? (
                  <>Update Review Card</>
                ) : (
                  <>
                    <Plus size={14} /> Add Review Card to List
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Current Featured Reviews Listing */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-4 ml-4">
              Featured Reviews List ({settings?.reviews?.length || 0} active)
            </label>

            {!settings?.reviews || settings.reviews.length === 0 ? (
              <div className="text-center py-12 bg-soft-gray rounded-[2rem] border border-gray-100">
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wide">No custom reviews are set yet.</p>
                <p className="text-xs text-gray-400 mt-1">Click "Import Default Reviews" or add customized student success stories above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {settings.reviews.map((review, index) => (
                  <div key={index} className={`bg-white p-5 rounded-2xl border relative group flex gap-3 items-start justify-between transition-all duration-300 ${editingIndex === index ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' : 'border-gray-100'}`}>
                    <div className="flex gap-3 items-start">
                      <div className={`w-9 h-9 rounded-full ${review.bgColor || "bg-blue-600"} text-white flex items-center justify-center font-bold text-xs shrink-0 select-none`}>
                        {review.initials || "LW"}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <h4 className="font-display font-black text-xs text-accent uppercase tracking-wide">{review.author}</h4>
                          <CheckCircle2 size={12} className="text-[#2563eb]" fill="#e0e7ff" />
                        </div>
                        <p className="text-[9px] text-gray-400 font-bold tracking-wider uppercase">{review.role} • {review.date}</p>
                        <div className="flex text-yellow-500 gap-0.5 py-0.5">
                          {[...Array(review.stars || 5)].map((_, i) => (
                            <Star key={i} size={10} fill="currentColor" />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed italic line-clamp-2">
                          "{review.text}"
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditReview(index)}
                        className={`p-2 rounded-xl transition duration-200 ${editingIndex === index ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100'}`}
                        title="Edit Review Content"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(index)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-xl transition duration-200"
                        title="Delete Review"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: Update Announcement Popup Settings */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                <Megaphone size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-accent uppercase tracking-tight">Announcement Popup Settings</h2>
                <p className="text-sm text-gray-500 font-medium">Show a special offer, discount banner, or summer camp update modal to visitors.</p>
              </div>
            </div>

            {/* Turn ON/OFF Toggle switch */}
            <div className="flex items-center gap-3 bg-soft-gray px-5 py-3 rounded-2xl border border-gray-100 self-start sm:self-center">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500">Popup Display:</span>
              <button
                type="button"
                onClick={() => {
                  setSettings(prev => {
                    if (!prev) return null;
                    const curPopup = prev.popup || { enabled: false, image: "", title: "", link: "", buttonText: "Learn More" };
                    return {
                      ...prev,
                      popup: {
                        ...curPopup,
                        enabled: !curPopup.enabled
                      }
                    };
                  });
                }}
                className={`w-14 h-8 rounded-full transition-all duration-300 relative focus:outline-none ${settings?.popup?.enabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-1 left-1 bottom-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 ${settings?.popup?.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Upload Popup Banner Image</label>
                <div className="relative group/popup-upload h-[180px]">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handlePopupFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-full border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center bg-soft-gray group-hover/popup-upload:border-red-500/30 transition-colors">
                    <Upload className="text-gray-300 mb-2" size={28} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to upload banner</span>
                    <span className="text-[10px] font-bold text-gray-300 italic mt-1 font-sans">Accepts PNG, JPG, WebP formats</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Or use Image URL</label>
                <input 
                  type="url" 
                  value={settings?.popup?.image?.startsWith('data:') ? '' : (settings?.popup?.image || '')}
                  onChange={(e) => setSettings(prev => {
                    if (!prev) return null;
                    const curPopup = prev.popup || { enabled: false, image: "", title: "", link: "", buttonText: "Learn More" };
                    return {
                      ...prev,
                      popup: { ...curPopup, image: e.target.value }
                    };
                  })}
                  className="w-full px-6 py-4 bg-soft-gray border-none rounded-2xl focus:ring-2 focus:ring-red-500/20 font-bold text-accent"
                  placeholder="https://example.com/some-camp-image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Camp / Discount Title</label>
                  <input 
                    type="text" 
                    value={settings?.popup?.title || ""}
                    onChange={(e) => setSettings(prev => {
                      if (!prev) return null;
                      const curPopup = prev.popup || { enabled: false, image: "", title: "", link: "", buttonText: "Learn More" };
                      return {
                        ...prev,
                        popup: { ...curPopup, title: e.target.value }
                      };
                    })}
                    className="w-full px-5 py-3 bg-soft-gray border-none rounded-2xl focus:ring-2 focus:ring-red-500/10 font-bold text-accent"
                    placeholder="e.g. Summer Camp Admission Open!"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Button Text CTA</label>
                  <input 
                    type="text" 
                    value={settings?.popup?.buttonText || "Learn More"}
                    onChange={(e) => setSettings(prev => {
                      if (!prev) return null;
                      const curPopup = prev.popup || { enabled: false, image: "", title: "", link: "", buttonText: "Learn More" };
                      return {
                        ...prev,
                        popup: { ...curPopup, buttonText: e.target.value }
                      };
                    })}
                    className="w-full px-5 py-3 bg-soft-gray border-none rounded-2xl focus:ring-2 focus:ring-red-500/10 font-bold text-accent"
                    placeholder="e.g. Enroll Now"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Action Link / Redirect URL (Optional)</label>
                <input 
                  type="text" 
                  value={settings?.popup?.link || ""}
                  onChange={(e) => setSettings(prev => {
                    if (!prev) return null;
                    const curPopup = prev.popup || { enabled: false, image: "", title: "", link: "", buttonText: "Learn More" };
                    return {
                      ...prev,
                      popup: { ...curPopup, link: e.target.value }
                    };
                  })}
                  className="w-full px-6 py-4 bg-soft-gray border-none rounded-2xl focus:ring-2 focus:ring-red-500/10 font-bold text-accent"
                  placeholder="e.g. /courses or https://wa.me/..."
                />
              </div>
            </div>

            {/* Live mockup presentation block of the modal right in the settings */}
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4 flex items-center gap-1.5">Live Mockup Preview {settings?.popup?.enabled ? <span className="text-emerald-500">(Active Popup)</span> : <span className="text-red-500">(Disabled)</span>}</label>
              
              <div className="bg-slate-900/5 p-6 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[300px] relative select-none">
                {/* Simulated popup container inside preview */}
                <div className={`w-full max-w-[280px] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 ${settings?.popup?.enabled ? 'opacity-100 scale-100' : 'opacity-40 scale-95 filters grayscale'}`}>
                  {/* Close button */}
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-50 bg-gray-50">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Bell size={10} className="text-red-500" /> Site Update</span>
                    <button type="button" className="text-gray-400 hover:text-accent"><X size={14} /></button>
                  </div>
                  
                  {/* Banner Image */}
                  <div className="aspect-[16/10] bg-slate-100 relative">
                    {settings?.popup?.image ? (
                      <img src={settings.popup.image} alt="Popup Mockup" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-400 italic font-bold">
                        <ImageIcon size={24} className="mb-1 text-gray-300" />
                        No image uploaded
                      </div>
                    )}
                  </div>

                  <div className="p-4 text-center">
                    <h4 className="font-display font-black text-xs text-accent uppercase tracking-wide mb-1 truncate">
                      {settings?.popup?.title || "Special Summer Camp Open!"}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-3">LANGUAGE WORLD EXCLUSIVE</p>
                    
                    <button type="button" className="w-full bg-accent text-white py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {settings?.popup?.buttonText || "Learn More"}
                    </button>
                  </div>
                </div>
                
                {!settings?.popup?.enabled && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-[2.5rem]">
                    <span className="bg-accent text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg font-sans">Popup is Hidden</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-10 py-5 flex items-center gap-2 text-lg shadow-xl shadow-primary/20"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Site Settings
          </button>
        </div>
      </form>
    </div>
  );
}
