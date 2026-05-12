import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, MapPin, Send, Globe, Languages } from "lucide-react";
import { CONTACT_INFO, COURSES, NAV_LINKS } from "../../constants/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-3 group">
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
          </Link>
          <p className="text-white/70 text-sm leading-relaxed">
            {CONTACT_INFO.tagline}. We empower students with language skills to succeed globally. The leading language institute in Karachi.
          </p>
          <div className="flex gap-4">
            <a href={CONTACT_INFO.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary transition-all duration-300">
              <Facebook size={20} />
            </a>
            <a href={CONTACT_INFO.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary transition-all duration-300">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6">
          <h4 className="font-display font-bold text-lg border-b border-primary/30 pb-2 w-fit">Quick Links</h4>
          <ul className="grid grid-cols-1 gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="text-white/70 hover:text-primary transition-colors text-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Courses */}
        <div className="flex flex-col gap-6">
          <h4 className="font-display font-bold text-lg border-b border-primary/30 pb-2 w-fit">Our Courses</h4>
          <ul className="grid grid-cols-1 gap-3">
            {COURSES.map((course) => (
              <li key={course.id}>
                <Link to={course.path} className="text-white/70 hover:text-primary transition-colors text-sm">
                  {course.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <h4 className="font-display font-bold text-lg border-b border-primary/30 pb-2 w-fit">Contact Info</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <MapPin className="text-primary mt-1" size={18} />
              <span className="text-white/70 text-sm">{CONTACT_INFO.address}</span>
            </li>
            <li>
              <div className="flex flex-col gap-2">
                <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors text-sm">
                  <Phone className="text-primary" size={18} />
                  {CONTACT_INFO.phone}
                </a>
                <a href={`tel:${CONTACT_INFO.mobile}`} className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors text-sm ml-[30px] md:ml-0 lg:ml-[30px]">
                  {CONTACT_INFO.mobile}
                </a>
              </div>
            </li>
            <li>
              <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors text-sm">
                <Mail className="text-primary" size={18} />
                {CONTACT_INFO.email}
              </a>
            </li>
          </ul>
          <div className="mt-4">
            <h5 className="font-semibold text-sm mb-2">Newsletter</h5>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full bg-white/10 border border-white/20 rounded-full py-2 px-4 text-sm focus:outline-none focus:border-primary"
              />
              <button className="absolute right-1 top-1 bottom-1 px-3 bg-primary rounded-full hover:bg-primary-dark transition-colors">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-white/50 text-xs">
          © {currentYear} Language World. All rights reserved. | <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
}
