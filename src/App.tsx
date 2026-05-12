import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/admin/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlogEditor from "./pages/admin/AdminBlogEditor";
import { AuthProvider } from "./contexts/AuthContext";
import { ModalProvider } from "./components/ModalContext";

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ModalProvider>
          <Router>
            <Routes>
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/blogs/new" element={<AdminBlogEditor />} />
            <Route path="/admin/blogs/edit/:id" element={<AdminBlogEditor />} />
            
            <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:id" element={<CourseDetailPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:id" element={<BlogDetailPage />} />
            <Route path="contact" element={<ContactPage />} />
            {/* Fallback for all other pages */}
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </Router>
        </ModalProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
