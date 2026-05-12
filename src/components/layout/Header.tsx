import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, Phone, Mail, Globe, Languages } from "lucide-react";
import { NAV_LINKS, CONTACT_INFO, COURSES } from "../../constants/data";
import { useModals } from "../ModalContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { openApplyModal } = useModals();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Main Nav */}
      <nav className={`w-full px-6 py-4 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white/90 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="bg-accent p-2.5 rounded-xl shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform duration-300">
                <Globe className="text-white" size={28} />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-lg shadow-md border-2 border-white group-hover:rotate-12 transition-transform duration-300">
                <Languages className="text-accent" size={14} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-accent font-display font-black text-xl leading-tight tracking-tighter">LANGUAGE</span>
              <span className="text-primary font-display font-black text-xl leading-tight tracking-tighter -mt-1">WORLD</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.path} className="relative group">
                {link.dropdown ? (
                  <button 
                    className="flex items-center gap-1 font-semibold text-gray-700 hover:text-primary transition-colors"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                  >
                    {link.label} <ChevronDown size={16} />
                  </button>
                ) : (
                  <Link 
                    to={link.path} 
                    className={`font-semibold transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                  >
                    {link.label}
                  </Link>
                )}

                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onMouseLeave={() => setActiveDropdown(null)}
                        className="absolute top-full left-0 mt-2 w-64 bg-white shadow-xl rounded-xl p-4 grid gap-2 border border-soft-gray"
                      >
                        {link.dropdown.map((sub) => (
                          <Link 
                            key={sub.path} 
                            to={sub.path}
                            className="p-2 hover:bg-soft-gray rounded-lg transition-colors text-gray-700 hover:text-primary font-medium"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => openApplyModal()}
              className="px-8 py-2.5 bg-accent text-white font-bold rounded-full hover:bg-accent-light transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-accent/40 flex items-center justify-center gap-2 text-sm relative overflow-hidden group cursor-pointer"
            >
              <span className="relative z-10 text-white">Book a Free Consultation</span>
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-accent" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col p-8 lg:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-accent p-2 rounded-xl">
                  <Globe className="text-white" size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-accent font-display font-black text-lg leading-none tracking-tighter uppercase">Language</span>
                  <span className="text-primary font-display font-black text-lg leading-none tracking-tighter uppercase">World</span>
                </div>
              </Link>
              <button className="text-accent" onClick={() => setIsOpen(false)}>
                <X size={32} />
              </button>
            </div>

            <ul className="flex flex-col gap-6 text-2xl font-bold font-display">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-900 active:text-primary">
                    {link.label}
                  </Link>
                  {link.dropdown && (
                    <ul className="mt-4 ml-4 flex flex-col gap-4 text-lg font-medium text-gray-600">
                      {link.dropdown.map(sub => (
                        <li key={sub.path}>
                          <Link to={sub.path}>{sub.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-col gap-4">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  openApplyModal();
                }} 
                className="btn-accent w-full py-4 text-lg shadow-xl shadow-accent/20 rounded-xl"
              >
                Book a Free Consultation
              </button>
              <a href={`tel:${CONTACT_INFO.mobile}`} className="btn-outline w-full py-4 text-lg">
                <Phone /> Call Support
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
