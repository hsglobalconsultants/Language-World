import { motion, AnimatePresence } from "motion/react";
import { LogIn, ShieldAlert, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { loginWithGoogle } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      console.log("Admin verified, redirecting...");
      navigate("/admin");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogin = async () => {
    setError(null);
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError("Sign-in popup was blocked by your browser. Please allow popups and try again.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Login window was closed before completion.");
      } else {
        setError(err.message || "An unexpected error occurred during login.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-gray">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft-gray p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-12 text-center"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
          <LogIn size={40} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-accent mb-4">Admin Access</h1>
        <p className="text-gray-500 mb-8">Login with your official Google account to manage the website content and blogs.</p>

        <AnimatePresence mode="wait">
          {user && !isAdmin && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex flex-col items-center gap-2 text-sm"
            >
              <ShieldAlert size={24} />
              <p className="font-bold">Access Unauthorized</p>
              <p className="opacity-80">The account <strong>{user.email}</strong> is not authorized to manage this site.</p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-amber-50 text-amber-700 rounded-2xl flex items-center gap-3 text-sm text-left"
            >
              <AlertCircle size={20} className="shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-4 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoggingIn ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
          )}
          {isLoggingIn ? "Signing In..." : "Continue with Google"}
        </button>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <Link to="/" className="text-sm font-bold text-gray-400 hover:text-primary flex items-center justify-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Back to Public Site
          </Link>
        </div>

        <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          Authorized personnel only
        </p>
      </motion.div>
    </div>
  );
}
