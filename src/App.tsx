import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

// Lazy load heavy admin pages
const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBlogEditor = lazy(() => import("./pages/admin/AdminBlogEditor"));

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
                  {/* Fallback for all other pages */}
                  <Route path="*" element={<HomePage />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </ModalProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
