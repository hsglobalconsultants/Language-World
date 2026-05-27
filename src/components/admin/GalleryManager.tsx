import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Plus, Trash2, Loader2, Sparkles, X } from 'lucide-react';
import { galleryService, GalleryItem } from '../../services/galleryService';

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ url: '', title: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = galleryService.getGallery((data) => {
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
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
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed data url
          // Preserve transparency for PNG and WebP files to prevent black backgrounds
          const isTransparent = file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/svg+xml' || file.name?.endsWith('.png') || file.name?.endsWith('.svg');
          const outputType = isTransparent ? 'image/png' : 'image/jpeg';
          
          const dataUrl = canvas.toDataURL(outputType, quality);
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
      setNewItem(prev => ({ ...prev, url: compressedDataUrl }));
    } catch (err: any) {
      console.error("Gallery photo compression failed:", err);
      setError("Failed to process and compress the photo. Please try another file.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newItem.url || !newItem.title) return;
    
    setIsSubmitting(true);
    try {
      await galleryService.addItem(newItem);
      setNewItem({ url: '', title: '' });
      setFilePreview(null);
      setIsAdding(false);
    } catch (err: any) {
      console.error("Error adding gallery item:", err);
      try {
        const errInfo = JSON.parse(err.message);
        setError(errInfo.error || "Permission denied or invalid data.");
      } catch {
        setError("Failed to add photo. Please check your connection and permissions.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await galleryService.deleteItem(id);
      setConfirmDeleteId(null);
    } catch (err: any) {
      console.error("Error deleting gallery item:", err);
      setError("Failed to delete photo. Check permissions.");
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
          <X className="shrink-0" size={16} /> {error}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-accent flex items-center gap-2">
          <ImageIcon className="text-primary" size={24} /> Gallery Management
        </h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary py-2 px-4 rounded-xl text-xs font-black flex items-center gap-2"
        >
          <Plus size={16} /> Add Photo
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-[2rem] border border-soft-gray shadow-xl relative"
          >
            <button 
              onClick={() => setIsAdding(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-accent"
            >
              <X size={20} />
            </button>
            <h4 className="font-black text-accent mb-6">Add New Campus Photo</h4>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Option 1: Upload from Computer</label>
                  <div className="relative group/upload">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 group-hover/upload:border-primary/30 transition-colors">
                      <ImageIcon className="text-gray-300 mb-2" size={32} />
                      <span className="text-[10px] font-black text-gray-400 uppercase">Click to browse</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 mt-2 italic">Max size: 1MB (Standard for web)</p>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Option 2: Photo URL</label>
                  <input 
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={filePreview && newItem.url.startsWith('data:') ? '' : newItem.url}
                    onChange={(e) => {
                      setNewItem({ ...newItem, url: e.target.value });
                      setFilePreview(null);
                    }}
                    className="w-full p-4 bg-soft-gray rounded-xl border-2 border-transparent focus:border-primary/20 outline-none font-bold text-accent"
                  />
                  {filePreview && (
                    <div className="mt-4 p-2 bg-primary/5 rounded-xl border border-primary/10">
                      <p className="text-[10px] font-black text-primary uppercase mb-2">File Selected:</p>
                      <img src={filePreview} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Caption / Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Student Discussion Group"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full p-4 bg-soft-gray rounded-xl border-2 border-transparent focus:border-primary/20 outline-none font-bold text-accent"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-accent w-full py-4 rounded-xl font-black flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Save Photo <Sparkles size={18} /></>}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-400 font-bold">No photos in the gallery yet.</p>
              <button onClick={() => setIsAdding(true)} className="text-primary font-black mt-2 underline">Add your first photo</button>
            </div>
          ) : (
            items.map((item) => (
              <motion.div 
                layout
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md border border-soft-gray group"
              >
                <div className="aspect-video relative">
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-black/60 transition-all flex flex-col items-center justify-center p-4 gap-2 ${confirmDeleteId === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {confirmDeleteId === item.id ? (
                      <>
                        <span className="text-[10px] text-white font-extrabold uppercase tracking-widest text-center mb-1">Delete permanently?</span>
                        <div className="flex gap-2 w-full max-w-[160px]">
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="flex-grow py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black rounded-xl transition-all shadow-md cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => setConfirmDeleteId(null)}
                            className="flex-grow py-2 px-3 bg-white/20 hover:bg-white/30 text-white text-[10px] font-black rounded-xl transition-all shadow-md cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <button 
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h5 className="font-black text-accent text-sm truncate">{item.title}</h5>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                    {item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
