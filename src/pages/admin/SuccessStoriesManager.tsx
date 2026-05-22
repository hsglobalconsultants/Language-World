import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Plus, Trash2, Edit2, X, Upload, Loader2, Save, Image as ImageIcon, Search } from 'lucide-react';
import { successStoriesService, SuccessStory } from '../../services/successStoriesService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SuccessStoriesManager() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentName: "",
    course: "",
    certificateUrl: "",
    achievement: "",
    date: ""
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const unsubscribe = successStoriesService.getStories((data) => {
      setStories(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({
      studentName: "",
      course: "",
      certificateUrl: "",
      achievement: "",
      date: ""
    });
    setEditingStory(null);
    setFilePreview(null);
    setError(null);
  };

  const handleOpenModal = (story?: SuccessStory) => {
    resetForm();
    if (story) {
      setEditingStory(story);
      setFormData({
        studentName: story.studentName,
        course: story.course,
        certificateUrl: story.certificateUrl,
        achievement: story.achievement || "",
        date: story.date || ""
      });
      if (story.certificateUrl.startsWith('data:')) {
        setFilePreview(story.certificateUrl);
      }
    }
    setIsModalOpen(true);
  };

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
      const compressedDataUrl = await compressImage(file, 1200, 0.75);
      setFilePreview(compressedDataUrl);
      setFormData(prev => ({ ...prev, certificateUrl: compressedDataUrl }));
    } catch (err: any) {
      console.error("Certificate compression failed:", err);
      setError("Failed to process and compress certificate. Please try another file.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (!formData.certificateUrl) {
        throw new Error("Certificate image is required.");
      }
      if (editingStory) {
        await successStoriesService.updateStory(editingStory.id, formData);
      } else {
        await successStoriesService.addStory(formData);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error("Error saving story:", err);
      setError(err.message || "Failed to save achievement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await successStoriesService.deleteStory(id);
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const filteredStories = stories.filter(s => 
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-gray">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-soft-gray min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-accent uppercase tracking-tighter mb-2">
              Success Stories <span className="text-primary italic">Manager</span>
            </h1>
            <p className="text-gray-500 font-medium">Upload certificates and celebrate student achievements.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
            className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all"
          >
            <Plus size={18} />
            Add New Achievement
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-accent"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <motion.div 
              key={story.id}
              layout
              className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl group hover:border-primary/20 transition-all"
            >
              <div className="relative aspect-[3/4] bg-gray-100">
                <img 
                  src={story.certificateUrl} 
                  alt={story.studentName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 bg-accent/80 transition-all flex flex-col items-center justify-center p-4 gap-4 ${confirmDeleteId === story.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {confirmDeleteId === story.id ? (
                    <div className="text-center flex flex-col items-center gap-3">
                      <span className="text-xs text-white font-extrabold uppercase tracking-widest">Delete achievements story?</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDelete(story.id)}
                          className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black rounded-xl uppercase tracking-wider shadow-lg cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(null)}
                          className="py-2.5 px-4 bg-white/20 hover:bg-white/30 text-white text-[10px] font-black rounded-xl uppercase tracking-wider shadow-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleOpenModal(story)}
                        className="p-4 bg-white text-accent rounded-full hover:bg-primary hover:text-white transition-all transform hover:scale-110 cursor-pointer"
                      >
                        <Edit2 size={24} />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(story.id)}
                        className="p-4 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 cursor-pointer"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                <p className="text-primary font-black text-[10px] uppercase tracking-widest mb-1">{story.course}</p>
                <h3 className="text-lg font-bold text-accent">{story.studentName}</h3>
                {story.date && <p className="text-xs text-gray-400 font-medium mt-1">{story.date}</p>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStories.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <Trophy className="mx-auto text-gray-200 mb-4" size={64} />
            <h3 className="text-xl font-bold text-accent">No achievements found</h3>
            <p className="text-gray-400 mb-6">Start by adding your first student success story!</p>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-accent text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
            >
              Add Your First Record
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-accent/20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black text-accent uppercase tracking-tighter">
                    {editingStory ? "Edit" : "New"} <span className="text-primary italic border-b-4 border-primary/20">Achievement</span>
                  </h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-3 bg-soft-gray text-gray-400 hover:text-accent rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-100 border border-red-200 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
                      <X className="shrink-0" size={16} /> {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Student Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.studentName}
                        onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                        className="w-full px-6 py-4 bg-soft-gray border-none rounded-3xl focus:ring-2 focus:ring-primary/20 font-bold text-accent"
                        placeholder="e.g. Hammad Siddiqui"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Course / Test</label>
                      <input 
                        required
                        type="text" 
                        value={formData.course}
                        onChange={(e) => setFormData({...formData, course: e.target.value})}
                        className="w-full px-6 py-4 bg-soft-gray border-none rounded-3xl focus:ring-2 focus:ring-primary/20 font-bold text-accent"
                        placeholder="e.g. German A1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Option 1: Upload Certificate</label>
                      <div className="relative group/upload h-[120px]">
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-full border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-gray-50 group-hover/upload:border-primary/30 transition-colors">
                          <Upload className="text-gray-300 mb-2" size={24} />
                          <span className="text-[10px] font-black text-gray-400 uppercase">Click to browse</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 mt-2 italic ml-4">Max size: 1MB</p>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Option 2: Certificate URL</label>
                      <input 
                        type="url" 
                        value={filePreview && formData.certificateUrl.startsWith('data:') ? '' : formData.certificateUrl}
                        onChange={(e) => {
                          setFormData({...formData, certificateUrl: e.target.value});
                          setFilePreview(null);
                        }}
                        className="w-full px-6 py-4 bg-soft-gray border-none rounded-3xl focus:ring-2 focus:ring-primary/20 font-bold text-accent"
                        placeholder="https://..."
                      />
                      <p className="text-[10px] text-gray-400 mt-2 ml-4">Paste a direct image link</p>
                    </div>
                  </div>

                  {formData.certificateUrl && (
                    <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-primary/20 bg-gray-100">
                      <img 
                        src={formData.certificateUrl} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          setFormData({...formData, certificateUrl: ""});
                          setFilePreview(null);
                        }}
                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Achievement Date</label>
                      <input 
                        type="text" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-6 py-4 bg-soft-gray border-none rounded-3xl focus:ring-2 focus:ring-primary/20 font-bold text-accent"
                        placeholder="e.g. May 2026"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-2 ml-4">Quick Note / Score</label>
                      <input 
                        type="text" 
                        value={formData.achievement}
                        onChange={(e) => setFormData({...formData, achievement: e.target.value})}
                        className="w-full px-6 py-4 bg-soft-gray border-none rounded-3xl focus:ring-2 focus:ring-primary/20 font-bold text-accent"
                        placeholder="e.g. Scored 85/100"
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full bg-accent hover:bg-primary text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          {editingStory ? "Update Achievement" : "Publish Achievement"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
