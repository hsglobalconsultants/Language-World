import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, MapPin, Send, Globe, Languages, ChevronUp } from "lucide-react";
import { CONTACT_INFO, COURSES, NAV_LINKS } from "../../constants/data";
import { settingsService, SiteSettings } from "../../services/settingsService";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterHoneypot, setNewsletterHoneypot] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [newsletterError, setNewsletterError] = useState("");

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterStatus("submitting");
    setNewsletterError("");

    // Anti-spam Honeypot protection
    if (newsletterHoneypot.trim()) {
      console.warn("Newsletter spam execution suspected & stopped silently via Honeypot check.");
      setTimeout(() => {
        setNewsletterStatus("success");
        setNewsletterEmail("");
        setNewsletterHoneypot("");
      }, 700);
      return;
    }

    try {
      const emailVal = newsletterEmail.trim();
      const payload = {
        name: "Newsletter Subscriber",
        email: emailVal,
        subject: "Newsletter Subscription Request",
        phone: "N/A",
        message: "Please subscribe me to the Language World newsletter for academic updates, German, IELTS, and PTE study resources."
      };

      await addDoc(collection(db, "contacts"), {
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        status: "new",
        createdAt: serverTimestamp()
      });

      // Background trigger for email notification (fire-and-forget for instant success)
      fetch("/api/notify/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", data: payload })
      }).catch((e) => {
        console.warn("Nodemailer newsletter alert trigger warning:", e);
      });

      setNewsletterStatus("success");
      setNewsletterEmail("");
    } catch (err: any) {
      console.error("Newsletter submission failed:", err);
      setNewsletterStatus("error");
      setNewsletterError("Failed to subscribe. Try again.");
    }
  };

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(() => {
    try {
      const cached = localStorage.getItem("siteSettings");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await settingsService.getSettings();
      if (data) {
        setSiteSettings(data);
      }
    };
    fetchSettings();

    const unsubSettings = settingsService.subscribeToSettings((data) => {
      setSiteSettings(data);
    });

    return () => unsubSettings();
  }, []);

  return (
    <footer className="bg-accent text-white pt-24 pb-12 font-sans border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12 xl:gap-16">
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="inline-flex items-center gap-3 group">
            {siteSettings?.logoImage ? (
              <div className="bg-white px-4 py-2 rounded-2xl flex items-center justify-center shadow-xl shadow-black/30 border border-white/15 transition-all duration-300 group-hover:scale-[1.03] h-14">
                <img 
                  src={siteSettings.logoImage} 
                  alt="Language World Logo" 
                  className="h-10 w-auto object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className="bg-accent p-2.5 rounded-xl shadow-lg shadow-black/20 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="text-white" size={28} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-lg shadow-md border-2 border-accent group-hover:rotate-12 transition-transform duration-300">
                    <Languages className="text-accent" size={14} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-xl text-white leading-tight tracking-tighter">LANGUAGE</span>
                  <span className="font-display font-black text-xl text-primary leading-tight tracking-tighter -mt-1">WORLD</span>
                </div>
              </>
            )}
          </Link>
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-semibold">
            {CONTACT_INFO.tagline}. Based in Karachi, Language World is Pakistan's premier language training institute. Empowered by Pakistan's first AI German Goethe Tutor, we provide gold-standard exam preparation for Goethe German A1-B2, high-band IELTS, PTE, and corporate Business Communication to secure your global visa and career success.
          </p>
          <div className="flex gap-4">
            <a href={CONTACT_INFO.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:text-accent hover:border-primary hover:scale-110 transition-all duration-300">
              <Facebook size={18} />
            </a>
            <a href={CONTACT_INFO.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:text-accent hover:border-primary hover:scale-110 transition-all duration-300">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6">
          <h4 className="font-display font-black text-xs uppercase tracking-widest text-primary border-b border-primary/20 pb-3">Quick Links</h4>
          <ul className="flex flex-col gap-3.5">
            {NAV_LINKS.map((link) => {
              if (link.dropdown && link.path === "#") {
                return (
                  <li key={link.label} className="mt-1">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-wider block mb-2">
                      {link.label}
                    </span>
                    <ul className="flex flex-col gap-2.5 pl-3 border-l border-white/10">
                      {link.dropdown.map((sublink) => (
                        <li key={sublink.path}>
                          <Link 
                            to={sublink.path} 
                            className="text-white/70 hover:text-primary hover:translate-x-1.5 transition-all duration-300 text-sm font-medium inline-flex items-center gap-1 group"
                          >
                            <span className="w-0 group-hover:w-1.5 h-[2px] bg-primary transition-all duration-300"></span>
                            {sublink.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              return (
                <li key={link.label}>
                  <Link 
                    to={link.path} 
                    className="text-white/70 hover:text-primary hover:translate-x-1.5 transition-all duration-300 text-sm font-medium inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-1.5 h-[2px] bg-primary transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Courses */}
        <div className="flex flex-col gap-6">
          <h4 className="font-display font-black text-xs uppercase tracking-widest text-primary border-b border-primary/20 pb-3">Our Courses</h4>
          <ul className="flex flex-col gap-3.5">
            {COURSES.map((course) => (
              <li key={course.id}>
                <Link 
                  to={course.path} 
                  className="text-white/70 hover:text-primary hover:translate-x-1.5 transition-all duration-300 text-sm font-medium inline-flex items-center gap-1 group"
                >
                  <span className="w-0 group-hover:w-1.5 h-[2px] bg-primary transition-all duration-300"></span>
                  {course.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <h4 className="font-display font-black text-xs uppercase tracking-widest text-primary border-b border-primary/20 pb-3">Contact Info</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <MapPin className="text-primary mt-1 shrink-0" size={18} />
              <span className="text-white/70 text-sm font-medium leading-relaxed">{CONTACT_INFO.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-primary shrink-0" size={18} />
              <a href={`tel:${CONTACT_INFO.phone}`} className="text-white/70 hover:text-primary transition-colors text-sm font-medium">
                {CONTACT_INFO.phone} (PTCL)
              </a>
            </li>
            <li className="flex items-center gap-3">
              {/* Phone or Whatsapp styled mobile */}
              <Phone className="text-primary shrink-0" size={18} />
              <a href={`tel:${CONTACT_INFO.mobile}`} className="text-white/70 hover:text-primary transition-colors text-sm font-medium">
                {CONTACT_INFO.mobile} (Mobile)
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-primary shrink-0" size={18} />
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-[#3b82f6] hover:underline hover:text-primary transition-colors text-sm font-medium break-all">
                {CONTACT_INFO.email}
              </a>
            </li>
          </ul>
          <div className="mt-2">
            <h5 className="font-bold text-xs uppercase tracking-wider text-white/50 mb-3">Newsletter</h5>
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <input 
                type="email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={newsletterStatus === "success" ? "Subscribed!" : "Your Email"} 
                disabled={newsletterStatus === "submitting" || newsletterStatus === "success"}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 pr-12 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-white font-medium disabled:opacity-70"
                required
              />
              {/* Invisible anti-spam honeypot input */}
              <div className="absolute opacity-0 w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <input 
                  type="text" 
                  value={newsletterHoneypot} 
                  onChange={(e) => setNewsletterHoneypot(e.target.value)} 
                  tabIndex={-1} 
                  autoComplete="new-password" 
                />
              </div>
              <button 
                type="submit"
                disabled={newsletterStatus === "submitting" || newsletterStatus === "success" || !newsletterEmail}
                className="absolute right-1 top-1 bottom-1 px-3 bg-primary text-accent rounded-xl hover:bg-yellow-400 disabled:bg-white/20 disabled:text-white/40 transition-colors flex items-center justify-center cursor-pointer"
              >
                <Send size={12} fill="currentColor" />
              </button>
            </form>
            {newsletterStatus === "success" && (
              <p className="text-emerald-400 text-[11px] font-bold mt-2">✓ Thank you for subscribing!</p>
            )}
            {newsletterStatus === "error" && (
              <p className="text-red-400 text-[11px] font-semibold mt-2">✗ {newsletterError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-white/40 text-xs font-semibold tracking-wide">
          © {currentYear} Language World. All rights reserved. | <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link> | <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </p>
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-[#ffe050] text-[#0f172a] hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl shadow-black/40 border border-white/10 group cursor-pointer"
        >
          <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform duration-300 font-black stroke-[3px]" />
        </button>
      </div>
    </footer>
  );
}
