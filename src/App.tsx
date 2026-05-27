import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./contexts/AuthContext";
import { ModalProvider } from "./components/ModalContext";

// Lazy load pages for bundle size optimization and faster initial load
const AboutPage = lazy(() => import("./pages/AboutPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const SuccessStoriesPage = lazy(() => import("./pages/SuccessStoriesPage"));
const GermanTutorPage = lazy(() => import("./pages/GermanTutorPage"));
const IeltsTestPage = lazy(() => import("./pages/IeltsTestPage"));
const PteTestPage = lazy(() => import("./pages/PteTestPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));

// Lazy load heavy admin pages
const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBlogEditor = lazy(() => import("./pages/admin/AdminBlogEditor"));

function SecurityProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    const isAdmin = location.pathname.startsWith("/admin");
    if (isAdmin) {
      document.body.classList.add("admin-session");
    } else {
      document.body.classList.remove("admin-session");
    }

    const handleContextMenu = (e: MouseEvent) => {
      if (location.pathname.startsWith("/admin")) return;
      e.preventDefault();
    };

    const handleCopyCut = (e: ClipboardEvent) => {
      if (location.pathname.startsWith("/admin")) return;
      e.preventDefault();
    };

    const handleDragStart = (e: DragEvent) => {
      if (location.pathname.startsWith("/admin")) return;
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (location.pathname.startsWith("/admin")) return;
      
      // F12 key
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        return;
      }
      
      // Ctrl+Shift+I or Cmd+Opt+I (Mac)
      const isInspect = (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.keyCode === 73)) || 
                        (e.metaKey && e.altKey && (e.key === "I" || e.key === "i" || e.keyCode === 73));
      
      // Ctrl+Shift+J or Cmd+Opt+J (Mac)
      const isConsole = (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j" || e.keyCode === 74)) || 
                        (e.metaKey && e.altKey && (e.key === "J" || e.key === "j" || e.keyCode === 74));

      // Ctrl+Shift+C or Cmd+Opt+C (Mac)
      const isInspectCursor = (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c" || e.keyCode === 67)) || 
                              (e.metaKey && e.altKey && (e.key === "C" || e.key === "c" || e.keyCode === 67));

      // Ctrl+U or Cmd+Opt+U (Mac) - View Source
      const isViewSource = (e.ctrlKey && (e.key === "U" || e.key === "u" || e.keyCode === 85)) || 
                           (e.metaKey && (e.altKey && (e.key === "U" || e.key === "u" || e.keyCode === 85)));

      // Ctrl+S or Cmd+S - Save Page
      const isSavePage = (e.ctrlKey && (e.key === "S" || e.key === "s" || e.keyCode === 83)) || 
                         (e.metaKey && (e.key === "S" || e.key === "s" || e.keyCode === 83));

      // Ctrl+C / Cmd+C (Copy keyboard shortcut)
      const isCopyShortcut = (e.ctrlKey && (e.key === "C" || e.key === "c" || e.keyCode === 67)) || 
                             (e.metaKey && (e.key === "C" || e.key === "c" || e.keyCode === 67));

      if (isInspect || isConsole || isInspectCursor || isViewSource || isSavePage || isCopyShortcut) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyCut);
    document.addEventListener("cut", handleCopyCut);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyCut);
      document.removeEventListener("cut", handleCopyCut);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [location.pathname]);

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {children}
      {!isAdmin && (
        <div 
          className="pointer-events-none fixed inset-0 z-[999999] select-none opacity-[0.03] dark:opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='240' viewBox='0 0 320 240'%3E%3Ctext x='50%25' y='45%25' fill='%23000000' font-family='sans-serif' font-weight='800' font-size='11' transform='rotate(-22 160 120)' text-anchor='middle'%3ELanguage World Karachi%3C/text%3E%3Ctext x='50%25' y='58%25' fill='%23FF0000' font-family='monospace' font-weight='700' font-size='7' transform='rotate(-22 160 120)' text-anchor='middle' letter-spacing='1'%3EPORTAL SECURITY - COPY PROHIBITED%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
      )}
    </>
  );
}

function PageLoader() {
  return (
    <div className="min-h-[50vh] w-full flex flex-col items-center justify-center p-6 select-none bg-transparent">
      <div className="relative flex flex-col items-center">
        <div className="absolute -inset-10 bg-[#FFCE00]/10 rounded-full blur-2xl animate-pulse" />
        <div className="relative mb-4">
          <Loader2 className="animate-spin text-primary" size={44} strokeWidth={2.5} />
        </div>
        <h3 className="font-sans font-black text-xs uppercase tracking-widest text-[#FFCE00] mb-1">
          Language World
        </h3>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">
          Initializing Classrooms...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ModalProvider>
          <Router>
            <SecurityProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/admin/login" element={<LoginPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/blogs/new" element={<AdminBlogEditor />} />
                  <Route path="/admin/blogs/edit/:id" element={<AdminBlogEditor />} />
                  
                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="german-tutor" element={<GermanTutorPage />} />
                    <Route path="ielts-test" element={<IeltsTestPage />} />
                    <Route path="pte-test" element={<PteTestPage />} />
                    <Route path="courses" element={<CoursesPage />} />
                    <Route path="courses/:id" element={<CourseDetailPage />} />
                    <Route path="success-stories" element={<SuccessStoriesPage />} />
                    <Route path="testimonials" element={<TestimonialsPage />} />
                    <Route path="blog" element={<BlogPage />} />
                    <Route path="blog/:id" element={<BlogDetailPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="privacy" element={<PrivacyPolicyPage />} />
                    <Route path="terms" element={<TermsOfServicePage />} />
                    {/* Fallback for all other pages */}
                    <Route path="*" element={<HomePage />} />
                  </Route>
                </Routes>
              </Suspense>
            </SecurityProvider>
          </Router>
        </ModalProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
