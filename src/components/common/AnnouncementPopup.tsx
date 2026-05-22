import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";
import { SpecialPopupSettings } from "../../services/settingsService";
import { useModals } from "../ModalContext";

interface AnnouncementPopupProps {
  popupSettings?: SpecialPopupSettings | null;
}

// Module-level variable to track if dismissed in current page load session
let hasDismissedThisLoad = false;

export default function AnnouncementPopup({ popupSettings }: AnnouncementPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { openApplyModal } = useModals();

  // Determine if explicitly disabled in settings
  const isDisabledBySettings = popupSettings && popupSettings.enabled === false;

  // Resolve active popup settings, defaulting to the gorgeous coded summer camp offer
  const activePopup: SpecialPopupSettings | null = isDisabledBySettings
    ? null
    : (popupSettings && popupSettings.image
      ? popupSettings
      : {
          enabled: true,
          image: "coded_summer_camp",
          title: "Summer Language Camp - Get 20% Off",
          link: "apply",
          buttonText: "Apply Online Now"
        });

  useEffect(() => {
    if (!activePopup || !activePopup.enabled) {
      setIsOpen(false);
      return;
    }

    // Use runtime module variable so that reloading the page resets the dismissal state
    if (!hasDismissedThisLoad) {
      // Snappy 800ms delay for maximum visibility when opening or reloading the website
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [popupSettings, activePopup]);

  if (!activePopup || !activePopup.enabled) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
    hasDismissedThisLoad = true;
  };

  const handleActionClick = (e: React.MouseEvent) => {
    const link = activePopup.link || "";
    const isModalTrigger = 
      !link || 
      link.startsWith("#") || 
      link.toLowerCase().includes("enroll") || 
      link.toLowerCase().includes("apply") ||
      link.toLowerCase().includes("online");

    if (isModalTrigger) {
      e.preventDefault();
      handleClose();
      // Smooth dynamic transitions
      setTimeout(() => {
        openApplyModal();
      }, 300);
    } else {
      // External/Internal link navigation
      handleClose();
    }
  };

  const isCodedBanner = activePopup.image === "coded_summer_camp";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Glass Overlay with dim effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-accent/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className={`relative w-full max-w-lg md:max-w-2xl rounded-[2.5rem] shadow-2xl shadow-black/80 overflow-hidden border z-10 flex flex-col ${isCodedBanner ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-white/10 text-white' : 'bg-white border-gray-100'}`}
          >
            {/* Round floating glass close button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-xl cursor-pointer hover:scale-110 active:scale-95 border border-white/20"
              aria-label="Close Announcement"
            >
              <X size={26} className="stroke-[2.5]" />
            </button>

            {/* Header Sparkle Stripe */}
            <div className={`px-6 py-4 text-center flex items-center justify-center gap-2 ${isCodedBanner ? 'bg-[#FFCE00] text-slate-950' : 'bg-gradient-to-r from-primary to-accent text-white'}`}>
              <Sparkles className="animate-pulse" size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest font-sans">
                {isCodedBanner ? 'LIMITED TIME EXCLUSIVE OFFER ☀️' : 'Latest Center Updates & Special Offers'}
              </span>
            </div>

            {/* Campaign Banner Render - Non-cropping adaptive aspect */}
            {isCodedBanner ? (
              /* High-impact coded promo layout designed meticulously for Summer Camp promotion */
              <div 
                onClick={handleActionClick}
                className="relative w-full px-6 py-12 md:py-16 flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer group select-none"
              >
                {/* Visual backdrops */}
                <div className="absolute top-0 left-0 right-0 h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,206,0,0.1)_0%,transparent_70%)] pointer-events-none" />
                
                {/* Summer Badge */}
                <div className="mb-6 bg-[#FFCE00]/15 border border-[#FFCE00]/30 text-[#FFCE00] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-lg shadow-[#FFCE00]/5 group-hover:scale-105 transition-transform duration-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFCE00] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFCE00]"></span>
                  </span>
                  Summer Language Camp 2026
                </div>

                {/* Big Bold Headline */}
                <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-none uppercase mb-2">
                  Summer Language <span className="text-[#FFCE00] block mt-1">Camp</span>
                </h2>

                <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-8">
                  Empower your future with confidence
                </p>

                {/* Offer Highlight Graphic */}
                <div className="relative w-full max-w-md py-6 px-1.5 rounded-3xl bg-white/[0.03] border border-white/5 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center mb-8 gap-1.5 hover:bg-white/[0.05] transition-colors duration-300">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#FFCE00] text-slate-950 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    Special Campaign Discount
                  </div>
                  <p className="text-[#FFCE00] text-3xl md:text-4xl font-black tracking-tight leading-none uppercase">
                    Avail 20% Discount
                  </p>
                  <p className="text-white/90 text-sm font-black tracking-widest uppercase">
                    On All Language Courses
                  </p>
                </div>

                {/* Deadline indicator styling */}
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-widest uppercase flex items-center gap-2 mb-8">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>Offer Deadline: 31st May 2026</span>
                </div>

                {/* Call-to-action button */}
                <button
                  onClick={handleActionClick}
                  className="w-full max-w-sm bg-[#FFCE00] hover:bg-white text-[#0f172a] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 font-black text-sm py-4 px-8 rounded-2xl shadow-xl shadow-[#FFCE00]/10 border-none uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer outline-none"
                >
                  {activePopup.buttonText || "Secure My Seat with 20% Off"}
                </button>
              </div>
            ) : (
              /* Custom uploaded Image Banner */
              <>
                <div 
                  onClick={handleActionClick}
                  className="relative w-full bg-slate-950 flex items-center justify-center overflow-hidden border-b border-gray-100 cursor-pointer group"
                >
                  <img
                    src={activePopup.image}
                    alt={activePopup.title || "Latest Update banner"}
                    className="w-full h-auto max-h-[500px] md:max-h-[580px] object-contain group-hover:scale-[1.02] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Body Info */}
                <div className="p-6 text-center bg-white flex flex-col items-center">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest mb-1.5 block">Language World</span>
                  <h3 className="font-display font-black text-lg text-accent uppercase tracking-wide max-w-sm leading-snug">
                    {activePopup.title || "Special Program Update!"}
                  </h3>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
