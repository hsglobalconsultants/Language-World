import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, Phone, Mail, Globe, Languages, Copy, Check, MessageSquare } from "lucide-react";
import { NAV_LINKS, CONTACT_INFO, COURSES } from "../../constants/data";
import { useModals } from "../ModalContext";
import { settingsService, SiteSettings } from "../../services/settingsService";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [showSupportDesktop, setShowSupportDesktop] = useState(false);
  const [showSupportMobile, setShowSupportMobile] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const desktopSupportRef = useRef<HTMLDivElement>(null);

  const handleCopy = (text: string, label: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopSupportRef.current && !desktopSupportRef.current.contains(event.target as Node)) {
        setShowSupportDesktop(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(() => {
    try {
      const cached = localStorage.getItem("siteSettings");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await settingsService.getSettings();
      if (data) {
        setSiteSettings(data);
        try {
          localStorage.setItem("siteSettings", JSON.stringify(data));
        } catch (e) {
          console.warn("Could not cache settings in localStorage", e);
        }
      }
    };
    fetchSettings();

    const unsubSettings = settingsService.subscribeToSettings((data) => {
      setSiteSettings(data);
      if (data) {
        try {
          localStorage.setItem("siteSettings", JSON.stringify(data));
        } catch (e) {
          console.warn("Could not cache settings in localStorage", e);
        }
      }
    });

    return () => unsubSettings();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Main Nav */}
      <nav className={`w-full px-6 py-4 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white/90 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group h-12">
            {siteSettings?.logoImage ? (
              <img 
                src={siteSettings.logoImage} 
                alt="Language World Logo" 
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <>
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
              </>
            )}
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li 
                key={link.label} 
                className="relative group py-1.5" 
                onMouseEnter={() => { if (link.dropdown) setActiveDropdown(link.label); }}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.dropdown ? (
                  <button 
                    className="flex items-center gap-1 font-semibold text-gray-700 hover:text-primary transition-colors cursor-pointer"
                    onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
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
                        className="absolute top-full left-0 pt-2 w-64 z-50 animate-fade-in"
                      >
                        <div className="bg-white shadow-xl rounded-xl p-4 grid gap-1.5 border border-soft-gray">
                          {link.dropdown.map((sub) => (
                            <Link 
                              key={sub.path} 
                              to={sub.path}
                              onClick={() => {
                                setActiveDropdown(null);
                                setIsOpen(false);
                              }}
                              className="p-2 hover:bg-soft-gray/80 rounded-lg transition-colors text-gray-700 hover:text-primary font-medium block text-sm"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-4 relative" ref={desktopSupportRef}>
            <button 
              onClick={() => setShowSupportDesktop(!showSupportDesktop)}
              className="px-5 py-2.5 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Phone size={15} />
              <span>Call Support</span>
            </button>

            <AnimatePresence>
              {showSupportDesktop && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-3 w-72 bg-white shadow-xl rounded-2xl p-5 border border-slate-100 z-50 text-left space-y-4"
                >
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Language World Support</h4>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">Contact our counselors directly</p>
                  </div>

                  <hr className="border-slate-100" />

                  <div className="space-y-3">
                    {/* MOBILE CONNECTION */}
                    <div className="flex flex-col gap-1.5 p-2 bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-all border border-slate-100 relative">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Mobile Support</span>
                      <div className="flex items-center justify-between">
                        <a 
                          href={`tel:${CONTACT_INFO.mobile}`} 
                          target="_parent"
                          className="text-xs font-bold text-slate-900 hover:text-primary flex items-center gap-1"
                        >
                          <Phone size={11} className="text-slate-400" />
                          {CONTACT_INFO.mobile}
                        </a>
                        <button 
                          onClick={() => handleCopy(CONTACT_INFO.mobile, "mobile")}
                          className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer text-slate-400 hover:text-slate-800"
                          title="Copy number"
                        >
                          {copiedText === "mobile" ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                        </button>
                      </div>
                    </div>

                    {/* LANDLINE CONNECTION */}
                    <div className="flex flex-col gap-1.5 p-2 bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-all border border-slate-100 relative">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Landline</span>
                      <div className="flex items-center justify-between">
                        <a 
                          href={`tel:${CONTACT_INFO.phone}`} 
                          target="_parent"
                          className="text-xs font-bold text-slate-900 hover:text-primary flex items-center gap-1"
                        >
                          <Phone size={11} className="text-slate-400" />
                          {CONTACT_INFO.phone}
                        </a>
                        <button 
                          onClick={() => handleCopy(CONTACT_INFO.phone, "phone")}
                          className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer text-slate-400 hover:text-slate-800"
                          title="Copy number"
                        >
                          {copiedText === "phone" ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                        </button>
                      </div>
                    </div>

                    {/* WHATSAPP SUPPORT CHAT */}
                    <a 
                      href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 p-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-sm"
                    >
                      <MessageSquare size={13} />
                      Chat on WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
            className="fixed inset-0 bg-white z-[60] flex flex-col p-8 lg:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12 shrink-0">
              <Link to="/" className="flex items-center gap-3">
                {siteSettings?.logoImage ? (
                  <img 
                    src={siteSettings.logoImage} 
                    alt="Language World Logo" 
                    className="h-10 w-auto object-contain" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    <div className="bg-accent p-2 rounded-xl">
                      <Globe className="text-white" size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-accent font-display font-black text-lg leading-none tracking-tighter uppercase">Language</span>
                      <span className="text-primary font-display font-black text-lg leading-none tracking-tighter uppercase">World</span>
                    </div>
                  </>
                )}
              </Link>
              <button className="text-accent" onClick={() => setIsOpen(false)}>
                <X size={32} />
              </button>
            </div>

            <ul className="flex flex-col gap-6 text-2xl font-bold font-display select-none">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.path === "#" ? (
                    <span className="text-gray-900 block font-black">
                      {link.label}
                    </span>
                  ) : (
                    <Link 
                      to={link.path} 
                      className="text-gray-900 active:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                  {link.dropdown && (
                    <ul className="mt-4 ml-4 flex flex-col gap-4 text-lg font-medium text-gray-600 border-l-2 border-slate-100 pl-4">
                      {link.dropdown.map(sub => (
                        <li key={sub.path}>
                          <Link to={sub.path} onClick={() => setIsOpen(false)}>
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-10 pb-6 flex flex-col gap-4 shrink-0">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  openApplyModal();
                }} 
                className="btn-accent w-full py-4 text-lg shadow-xl shadow-accent/20 rounded-xl"
              >
                Book a Free Consultation
              </button>
              
              <button 
                onClick={() => setShowSupportMobile(!showSupportMobile)} 
                className="btn-outline w-full py-4 text-lg justify-center flex items-center gap-2 cursor-pointer"
              >
                <Phone size={18} /> 
                <span>{showSupportMobile ? "Hide Support Options" : "Call Support"}</span>
              </button>

              <AnimatePresence>
                {showSupportMobile && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-3"
                  >
                    {/* Mobile Call Row */}
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-black text-slate-400">Mobile Support</span>
                        <a href={`tel:${CONTACT_INFO.mobile}`} target="_parent" className="text-sm font-bold text-slate-900 hover:text-primary">
                          {CONTACT_INFO.mobile}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleCopy(CONTACT_INFO.mobile, "m_mobile")}
                          className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          {copiedText === "m_mobile" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                        <a 
                          href={`tel:${CONTACT_INFO.mobile}`} 
                          target="_parent"
                          className="p-2 px-3 bg-[#FFCE00] hover:bg-[#ffe04d] text-slate-950 font-black rounded-xl text-xs flex items-center justify-center transition-all"
                        >
                          Dial
                        </a>
                      </div>
                    </div>

                    {/* Landline Call Row */}
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-black text-slate-400">Landline Support</span>
                        <a href={`tel:${CONTACT_INFO.phone}`} target="_parent" className="text-sm font-bold text-slate-900 hover:text-primary">
                          {CONTACT_INFO.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleCopy(CONTACT_INFO.phone, "m_phone")}
                          className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          {copiedText === "m_phone" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                        <a 
                          href={`tel:${CONTACT_INFO.phone}`} 
                          target="_parent"
                          className="p-2 px-3 bg-[#FFCE00] hover:bg-[#ffe04d] text-slate-950 font-black rounded-xl text-xs flex items-center justify-center transition-all"
                        >
                          Dial
                        </a>
                      </div>
                    </div>

                    {/* WhatsApp Action Row */}
                    <a 
                      href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <MessageSquare size={14} />
                      WhatsApp Direct Chat
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
