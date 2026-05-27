import { motion } from "motion/react";
import React from "react";
import { 
  Plus, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Trash2, 
  Edit3,
  ExternalLink,
  Loader2,
  Mail,
  UserCheck,
  Clock,
  LayoutDashboard,
  MessageSquare,
  RefreshCcw,
  Users,
  Video,
  Image as ImageIcon,
  Trophy,
  BarChart2,
  Gauge
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { logout, db } from "../../lib/firebase";
import { blogService } from "../../services/blogService";
import { leadService } from "../../services/leadService";
import { useEffect, useState } from "react";
import { BLOG_POSTS, BlogPost } from "../../constants/blogs";
import VeoStudio from "../../components/admin/VeoStudio";
import GalleryManager from "../../components/admin/GalleryManager";
import SuccessStoriesManager from "./SuccessStoriesManager";
import SiteSettingsManager from "../../components/admin/SiteSettingsManager";
import DashboardStats from "../../components/admin/DashboardStats";
import PerformanceMonitor from "../../components/admin/PerformanceMonitor";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch, getDocs, serverTimestamp } from "firebase/firestore";

type AdminTab = 'stats' | 'blogs' | 'contacts' | 'applications' | 'leads' | 'veo' | 'gallery' | 'stories' | 'settings' | 'performance';

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  const syncOldBlogs = async () => {
    if (!window.confirm("This will import all predefined blogs to the database and set authors to 'Admin'. Continue?")) return;
    
    setSyncing(true);
    try {
      const batch = writeBatch(db);
      
      // We only sync if the collection is potentially empty or user wants to re-sync
      // To keep it simple, we'll just add them as new docs with their original IDs (shipped as strings)
      for (const blog of BLOG_POSTS) {
        const blogRef = doc(collection(db, "blogs"));
        const { id, metaDescription, keywords, ...blogData } = blog;
        batch.set(blogRef, {
          ...blogData,
          author: "Admin",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      await batch.commit();
      alert("Old blogs synced successfully! All authors are set to 'Admin'.");
      window.location.reload();
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Failed to sync blogs.");
    } finally {
      setSyncing(false);
    }
  };

  const updateAllAuthorsToAdmin = async () => {
    if (!window.confirm("Change author name to 'Admin' for ALL currently listed blogs?")) return;
    
    setSyncing(true);
    try {
      const q = query(collection(db, "blogs"));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      snapshot.docs.forEach((d) => {
        batch.update(d.ref, { 
          author: "Admin",
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
      alert("All authors updated to 'Admin'.");
      window.location.reload();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update authors.");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    
    // Blogs fetch
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getAllBlogs();
        setBlogs(data);
      } catch (err) {
        console.error("Blogs Fetch Error:", err);
      } finally {
        if (activeTab === 'blogs') setLoading(false);
      }
    };

    // Contacts Listener
    const qContacts = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
    const unsubContacts = onSnapshot(qContacts, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContacts(data);
      if (activeTab === 'contacts') setLoading(false);
    }, (error) => {
      console.error("Contacts Listener Error:", error);
      if (activeTab === 'contacts') setLoading(false);
    });

    // Applications Listener
    const qApps = query(collection(db, "applications"), orderBy("createdAt", "desc"));
    const unsubApps = onSnapshot(qApps, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(data);
      if (activeTab === 'applications') setLoading(false);
    }, (error) => {
      console.error("Applications Listener Error:", error);
      if (activeTab === 'applications') setLoading(false);
    });

    // Leads Listener
    const qLeads = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsubLeads = onSnapshot(qLeads, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(data);
      if (activeTab === 'leads') setLoading(false);
    }, (error) => {
      console.error("Leads Listener Error:", error);
      if (activeTab === 'leads') setLoading(false);
    });

    if (activeTab === 'blogs') {
      fetchBlogs();
    } else if (activeTab === 'stats' || activeTab === 'veo' || activeTab === 'gallery' || activeTab === 'stories' || activeTab === 'settings') {
      setLoading(false);
    }

    return () => {
      unsubContacts();
      unsubApps();
      unsubLeads();
    };
  }, [activeTab]);

  const handleDeleteBlog = async (id: string) => {
    try {
      await blogService.deleteBlog(id);
      setBlogs(blogs.filter(b => b.id !== id as any));
      setConfirmDeleteId(null);
    } catch (error: any) {
      console.error("Failed to delete blog:", error);
      alert(`Failed to delete blog: ${error.message || "Unknown error"}`);
    }
  };

  const handleUpdateStatus = async (collectionName: string, id: string, newStatus: string) => {
    await updateDoc(doc(db, collectionName, id), { status: newStatus });
  };

  const handleDeleteItem = async (collectionName: string, id: string) => {
    console.log(`[Admin] Initiating direct delete for ${id} in ${collectionName}`);
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      console.log(`[Admin] Successfully deleted ${id}`);
      
      // Manually update states for immediate UI feedback if onSnapshot lags
      if (collectionName === 'leads') setLeads(prev => prev.filter(l => l.id !== id));
      if (collectionName === 'contacts') setContacts(prev => prev.filter(c => c.id !== id));
      if (collectionName === 'applications') setApplications(prev => prev.filter(a => a.id !== id));
      
      setConfirmDeleteId(null);
    } catch (error: any) {
      console.error(`[Admin] Delete failed for ${id}:`, error);
      alert(`Failed to delete: ${error.message || "Unknown error"}`);
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-soft-gray flex">
      {/* Sidebar */}
      <aside className="w-72 bg-accent text-white p-8 hidden lg:flex flex-col">
        <div className="mb-12">
          <Link to="/" className="text-2xl font-black text-white flex items-center gap-2">
            <span className="text-primary italic">L</span>W Admin
          </Link>
        </div>

        <nav className="flex-grow space-y-2">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'stats' ? 'bg-primary text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3"><BarChart2 size={20} /> Dashboard Stats</div>
            {activeTab === 'stats' && <div className="w-2 h-2 bg-white rounded-full" />}
          </button>

          <button 
            onClick={() => setActiveTab('blogs')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'blogs' ? 'bg-primary text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3"><FileText size={20} /> Blogs</div>
            {activeTab === 'blogs' && <div className="w-2 h-2 bg-white rounded-full" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'contacts' ? 'bg-primary text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3"><Mail size={20} /> Contacts</div>
            {contacts.filter(c => c.status === 'new').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{contacts.filter(c => c.status === 'new').length}</span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'applications' ? 'bg-primary text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3"><UserCheck size={20} /> Applications</div>
            {applications.filter(a => a.status === 'pending').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{applications.filter(a => a.status === 'pending').length}</span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'leads' ? 'bg-primary text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3"><Users size={20} /> Mock Test Leads</div>
            {leads.filter(l => l.status === 'new').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{leads.filter(l => l.status === 'new').length}</span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('veo')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'veo' ? 'bg-primary text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3"><Video size={20} /> Veo Studio</div>
            <span className="bg-white/10 text-[8px] px-1.5 py-0.5 rounded uppercase tracking-widest text-white/40 font-black">AI Beta</span>
          </button>

          <button 
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'gallery' ? 'bg-primary text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3"><ImageIcon size={20} /> Gallery</div>
            {activeTab === 'gallery' && <div className="w-2 h-2 bg-white rounded-full" />}
          </button>

          <button 
            onClick={() => setActiveTab('stories')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'stories' ? 'bg-primary text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3"><Trophy size={20} /> Success Stories</div>
            {activeTab === 'stories' && <div className="w-2 h-2 bg-white rounded-full" />}
          </button>

          <button 
            onClick={() => setActiveTab('performance')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'performance' ? 'bg-primary text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3"><Gauge size={20} /> Speed & Vitals</div>
            {activeTab === 'performance' && <div className="w-2 h-2 bg-white rounded-full" />}
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3"><Settings size={20} /> Settings</div>
            {activeTab === 'settings' && <div className="w-2 h-2 bg-white rounded-full" />}
          </button>
        </nav>

        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 p-4 text-red-400 hover:text-red-300 transition-all font-bold mt-auto"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-8 lg:p-12 overflow-y-auto max-h-screen">
        {/* Mobile Tab Row Navigation */}
        <div className="lg:hidden mb-8 border-b border-gray-200 pb-4">
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x select-none">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                activeTab === 'stats'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                activeTab === 'blogs'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Blogs
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all relative ${
                activeTab === 'contacts'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Contacts
              {contacts.filter(c => c.status === 'new').length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {contacts.filter(c => c.status === 'new').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all relative ${
                activeTab === 'applications'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Applications
              {applications.filter(a => a.status === 'pending').length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {applications.filter(a => a.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all relative ${
                activeTab === 'leads'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Mock Leadin
              {leads.filter(l => l.status === 'new').length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {leads.filter(l => l.status === 'new').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('veo')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                activeTab === 'veo'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Veo Studio <span className="text-[8px] bg-slate-100/80 text-primary rounded px-1 ml-1 font-black">AI</span>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                activeTab === 'gallery'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('stories')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                activeTab === 'stories'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Success Stories
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                activeTab === 'performance'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                activeTab === 'settings'
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => logout()}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all bg-red-50 hover:bg-red-100 text-red-650 border border-red-200"
            >
              Logout
            </button>
          </div>
        </div>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-accent capitalize">
              {activeTab === 'stats' ? 'Analytics Insights' :
               activeTab === 'blogs' ? 'Blog Management' : 
               activeTab === 'contacts' ? 'Course General Inquiries' : 
               activeTab === 'applications' ? 'Online Applications' : 
               activeTab === 'leads' ? 'Mock Test Leads' : 
               activeTab === 'veo' ? 'Veo Promo Studio' : 
               activeTab === 'gallery' ? 'Campus Gallery Manager' : 
               activeTab === 'stories' ? 'Success Stories Manager' :
               activeTab === 'performance' ? 'Vitals & Speed Audit' :
               'Global Site Settings'}
            </h1>
            <p className="text-gray-500 mt-2">
              {activeTab === 'stats' ? 'Track historical metrics, user conversions, and dynamic language evaluator traction.' :
               activeTab === 'blogs' ? 'Create, edit and manage your website articles.' : 
               activeTab === 'contacts' ? 'Manage questions from Contact Us form.' : 
               activeTab === 'applications' ? 'Review and process student school applications.' : 
               activeTab === 'leads' ? 'Students who completed language mock tests.' : 
               activeTab === 'veo' ? 'AI-powered video generation for promotional content.' : 
               activeTab === 'gallery' ? 'Add or remove photos from the "Life at Language World" section.' : 
               activeTab === 'stories' ? 'Manage student certificates and achievements.' :
               activeTab === 'performance' ? 'Monitor load speeds, asset size breakdowns, database health, and server latency.' :
               'Customize your branding, images, and global website content.'}
              <span className="block mt-1 text-[10px] opacity-50">Admin: {user?.email}</span>
            </p>
          </div>
          {activeTab === 'blogs' && (
            <div className="flex gap-4">
              <button 
                onClick={syncOldBlogs} 
                className="btn-outline flex items-center gap-2 border-primary text-primary hover:bg-primary/5"
                disabled={syncing}
              >
                {syncing ? <Loader2 className="animate-spin" size={20} /> : <RefreshCcw size={20} />} 
                Sync Old Blogs
              </button>
              <button 
                onClick={updateAllAuthorsToAdmin} 
                className="btn-outline flex items-center gap-2 border-accent text-accent hover:bg-accent/5"
                disabled={syncing}
              >
                Set All to Admin
              </button>
              <Link to="/admin/blogs/new" className="btn-primary flex items-center gap-2">
                <Plus size={20} /> Create New Post
              </Link>
            </div>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {activeTab === 'blogs' && (
              blogs.length === 0 ? (
                <EmptyState icon={<FileText size={60} />} title="No blogs yet" link="/admin/blogs/new" />
              ) : (
                blogs.map((blog) => (
                  <BlogRow 
                    key={blog.id} 
                    blog={blog} 
                    isConfirming={confirmDeleteId === String(blog.id)}
                    onDeleteClick={() => setConfirmDeleteId(String(blog.id))}
                    onCancelDelete={() => setConfirmDeleteId(null)}
                    onDelete={() => handleDeleteBlog(String(blog.id))} 
                  />
                ))
              )
            )}

            {activeTab === 'contacts' && (
              contacts.length === 0 ? (
                <EmptyState icon={<Mail size={60} />} title="No inquiries yet" />
              ) : (
                contacts.map((contact) => (
                  <ContactRow 
                    key={contact.id} 
                    contact={contact} 
                    isConfirming={confirmDeleteId === contact.id}
                    onDeleteClick={() => setConfirmDeleteId(contact.id)}
                    onCancelDelete={() => setConfirmDeleteId(null)}
                    onStatusUpdate={(s) => handleUpdateStatus('contacts', contact.id, s)}
                    onDelete={() => handleDeleteItem('contacts', contact.id)}
                  />
                ))
              )
            )}

            {activeTab === 'applications' && (
              applications.length === 0 ? (
                <EmptyState icon={<UserCheck size={60} />} title="No applications yet" />
              ) : (
                applications.map((app) => (
                  <AppRow 
                    key={app.id} 
                    app={app} 
                    isConfirming={confirmDeleteId === app.id}
                    onDeleteClick={() => setConfirmDeleteId(app.id)}
                    onCancelDelete={() => setConfirmDeleteId(null)}
                    onStatusUpdate={(s) => handleUpdateStatus('applications', app.id, s)}
                    onDelete={() => handleDeleteItem('applications', app.id)}
                  />
                ))
              )
            )}

            {activeTab === 'stats' && (
              <DashboardStats applications={applications} leads={leads} contacts={contacts} />
            )}

            {activeTab === 'leads' && (
              leads.length === 0 ? (
                <EmptyState icon={<Users size={60} />} title="No test leads yet" />
              ) : (
                leads.map((lead) => (
                  <LeadRow 
                    key={lead.id} 
                    lead={lead} 
                    isConfirming={confirmDeleteId === lead.id}
                    onDeleteClick={() => setConfirmDeleteId(lead.id)}
                    onCancelDelete={() => setConfirmDeleteId(null)}
                    onStatusUpdate={(s) => handleUpdateStatus('leads', lead.id, s)}
                    onDelete={() => handleDeleteItem('leads', lead.id)}
                  />
                ))
              )
            )}

            {activeTab === 'veo' && (
              <VeoStudio />
            )}

            {activeTab === 'gallery' && (
              <GalleryManager />
            )}

            {activeTab === 'stories' && (
              <SuccessStoriesManager />
            )}

            {activeTab === 'settings' && (
              <SiteSettingsManager />
            )}

            {activeTab === 'performance' && (
              <PerformanceMonitor />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function LeadRow({ lead, onStatusUpdate, onDelete, isConfirming, onDeleteClick, onCancelDelete }: any) {
  const date = lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString() : 'Just now';
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white p-8 rounded-[2rem] shadow-sm border-l-8 transition-all ${lead.status === 'new' ? 'border-primary' : 'border-gray-200'}`}
    >
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h3 className="text-2xl font-black text-accent">{lead.name}</h3>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black bg-accent text-white uppercase tracking-widest`}>
              {lead.testType}
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${lead.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
              {lead.status || 'new'}
            </span>
            <span className="text-xs text-gray-400 font-bold flex items-center gap-1"><Clock size={12} /> {date}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={16} className="text-primary" /> {lead.email}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">📞 {lead.phone}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600 font-black">Score: <span className="text-primary">{lead.score || 'N/A'}</span></div>
          </div>
        </div>
        <div className="flex flex-row lg:flex-col gap-3 min-w-[200px] justify-center">
          {isConfirming ? (
            <div className="flex flex-col gap-2 w-full p-3 bg-red-50 border border-red-200 rounded-3xl text-center self-center justify-center">
              <span className="text-[10px] text-red-600 font-black uppercase tracking-wider block">Delete permanently?</span>
              <div className="flex gap-2">
                <button 
                  onClick={onDelete} 
                  className="flex-grow py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black rounded-xl transition-all cursor-pointer"
                >
                  Confirm
                </button>
                <button 
                  onClick={onCancelDelete} 
                  className="py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-black rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => onStatusUpdate(lead.status === 'new' ? 'contacted' : 'new')}
                className="flex-grow btn-outline py-3 text-xs bg-white"
              >
                Mark as {lead.status === 'new' ? 'Contacted' : 'New'}
              </button>
              <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-grow btn-accent py-3 text-xs flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 border-none">
                WhatsApp <MessageSquare size={14} />
              </a>
              <button 
                type="button"
                onClick={onDeleteClick} 
                className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center cursor-pointer min-w-[60px] min-h-[60px] border border-red-200 relative z-20"
                title="Delete permanently"
              >
                <Trash2 size={24} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ icon, title, link }: any) {
  return (
    <div className="bg-white p-16 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
      <div className="mx-auto text-gray-200 mb-6 flex justify-center">{icon}</div>
      <h3 className="text-2xl font-bold text-accent mb-2">{title}</h3>
      {link && (
        <Link to={link} className="text-primary font-bold inline-flex items-center gap-2 mt-4">
          Get started <ChevronRight size={20} />
        </Link>
      )}
    </div>
  );
}

function BlogRow({ blog, onDelete, isConfirming, onDeleteClick, onCancelDelete }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-8 group"
    >
      <img 
        src={blog.image || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800"} 
        alt={blog.title} 
        className="w-full md:w-48 h-32 object-cover rounded-2xl" 
        referrerPolicy="no-referrer" 
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800";
        }}
      />
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-soft-gray px-2 py-1 rounded-md text-gray-500">{blog.tag}</span>
        </div>
        <h3 className="text-xl font-bold text-accent group-hover:text-primary transition-colors">{blog.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-1 mt-1">{blog.excerpt}</p>
      </div>
      <div className="flex gap-2 w-full md:w-auto items-center">
        {isConfirming ? (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-2xl">
            <span className="text-[10px] text-red-600 font-extrabold uppercase tracking-widest px-1">Delete permanently?</span>
            <button 
              onClick={() => onDelete(blog.id)} 
              className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black rounded-lg transition-all cursor-pointer"
            >
              Confirm
            </button>
            <button 
              onClick={onCancelDelete} 
              className="py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-black rounded-lg transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <Link to={`/blog/${blog.id}`} target="_blank" className="flex-grow md:flex-none p-3 bg-soft-gray text-gray-500 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
              <ExternalLink size={20} />
            </Link>
            <Link to={`/admin/blogs/edit/${blog.id}`} className="flex-grow md:flex-none p-3 bg-soft-gray text-gray-500 rounded-xl hover:bg-accent hover:text-white transition-all">
              <Edit3 size={20} />
            </Link>
            <button onClick={onDeleteClick} className="flex-grow md:flex-none p-3 bg-soft-gray text-gray-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
              <Trash2 size={20} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

function ContactRow({ contact, onStatusUpdate, onDelete, isConfirming, onDeleteClick, onCancelDelete }: any) {
  const date = contact.createdAt?.toDate ? contact.createdAt.toDate().toLocaleDateString() : 'Just now';
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white p-8 rounded-[2rem] shadow-sm border-l-8 transition-all ${contact.status === 'new' ? 'border-primary' : 'border-gray-200'}`}
    >
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h3 className="text-2xl font-black text-accent">{contact.name}</h3>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${contact.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
              {contact.status || 'new'}
            </span>
            <span className="text-xs text-gray-400 font-bold flex items-center gap-1"><Clock size={12} /> {date}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={16} className="text-primary" /> {contact.email}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">📞 {contact.phone}</div>
          </div>
          <div className="bg-soft-gray p-6 rounded-2xl italic text-accent border border-gray-100">
            <MessageSquare size={16} className="mb-2 text-primary" />
            "{contact.message}"
          </div>
        </div>
        <div className="flex flex-row lg:flex-col gap-3 min-w-[200px] justify-center">
          {isConfirming ? (
            <div className="flex flex-col gap-2 w-full p-3 bg-red-50 border border-red-200 rounded-3xl text-center self-center justify-center">
              <span className="text-[10px] text-red-600 font-black uppercase tracking-wider block">Delete inquiry?</span>
              <div className="flex gap-2">
                <button 
                  onClick={onDelete} 
                  className="flex-grow py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black rounded-xl transition-all cursor-pointer"
                >
                  Confirm
                </button>
                <button 
                  onClick={onCancelDelete} 
                  className="py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-black rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => onStatusUpdate(contact.status === 'new' ? 'read' : 'new')}
                className="flex-grow btn-outline py-3 text-xs bg-white"
              >
                Mark as {contact.status === 'new' ? 'Read' : 'New'}
              </button>
              <a href={`mailto:${contact.email}`} className="flex-grow btn-accent py-3 text-xs flex items-center justify-center gap-2">
                Reply Email <ArrowRight size={14} />
              </a>
              <button 
                type="button"
                onClick={onDeleteClick} 
                className="p-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center cursor-pointer relative z-20"
                title="Delete Inquiry"
              >
                <Trash2 size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AppRow({ app, onStatusUpdate, onDelete, isConfirming, onDeleteClick, onCancelDelete }: any) {
  const date = app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'Just now';
  
  const statusColors: any = {
    pending: 'bg-yellow-100 text-yellow-700',
    contacted: 'bg-blue-100 text-blue-700',
    enrolled: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:border-primary/30 transition-all"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h3 className="text-2xl font-black text-accent">{app.fullName}</h3>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[app.status || 'pending']}`}>
              {app.status || 'pending'}
            </span>
            <span className="text-xs text-gray-400 font-bold flex items-center gap-1"><Clock size={12} /> {date}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Target Course</p>
              <p className="font-bold text-primary">{app.course}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Preferred Schedule</p>
              <p className="font-bold text-amber-600">{app.preferredTime || 'Not specified'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Contact Email</p>
              <p className="font-bold text-accent">{app.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Phone</p>
              <p className="font-bold text-accent">{app.phone}</p>
            </div>
          </div>
          {app.message && (
            <div className="bg-primary/5 p-4 rounded-xl text-sm italic text-gray-600">
              "{app.message}"
            </div>
          )}
        </div>
        <div className="flex flex-wrap lg:grid lg:grid-cols-2 gap-3 min-w-[240px] items-center justify-center">
          {isConfirming ? (
            <div className="col-span-2 flex flex-col gap-2 w-full p-3 bg-red-50 border border-red-200 rounded-3xl text-center">
              <span className="text-[10px] text-red-600 font-black uppercase tracking-wider block">Delete Application?</span>
              <div className="flex gap-2">
                <button 
                  onClick={onDelete} 
                  className="flex-grow py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black rounded-xl transition-all cursor-pointer"
                >
                  Confirm
                </button>
                <button 
                  onClick={onCancelDelete} 
                  className="py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-black rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <button onClick={() => onStatusUpdate('contacted')} className="btn-outline py-3 text-[10px] bg-white">Contacted</button>
              <button onClick={() => onStatusUpdate('enrolled')} className="btn-accent py-3 text-[10px]">Enroll</button>
              <button onClick={() => onStatusUpdate('rejected')} className="btn-outline py-3 text-[10px] border-red-200 text-red-400 hover:bg-red-500">Reject</button>
              <button 
                type="button"
                onClick={onDeleteClick} 
                className="p-4 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center cursor-pointer relative z-20"
                title="Delete Application"
              >
                <Trash2 size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ArrowRight({ size, className }: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
