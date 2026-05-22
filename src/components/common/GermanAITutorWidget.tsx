import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";

export default function GermanAITutorWidget() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  // Hide the floating widget on the tutor page itself or if dismissed
  const shouldShow = isVisible && !isDismissed && location.pathname !== "/german-tutor";

  useEffect(() => {
    // Stagger visibility so it gracefully rolls in after the page loads
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    // Show interactive speech bubble briefly after mounting
    const bubbleTimer = setTimeout(() => {
      setShowBubble(true);
    }, 4000);

    // Auto-dim/hide speech bubble after some seconds to prevent blocking content
    const bubbleHideTimer = setTimeout(() => {
      setShowBubble(false);
    }, 9000);

    return () => {
      clearTimeout(timer);
      clearTimeout(bubbleTimer);
      clearTimeout(bubbleHideTimer);
    };
  }, [location.pathname]);

  if (!shouldShow) return null;

  return (
    <div id="german-ai-tutor-widget" className="fixed bottom-6 left-6 z-50 flex items-end gap-3 pointer-events-none">
      {/* Speech bubble / Interactive promo badge */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -25 }}
            className="bg-white border border-slate-150 rounded-2xl p-3.5 shadow-2xl max-w-[210px] text-left relative z-10 pointer-events-auto"
          >
            {/* Closes bubble explicitly */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowBubble(false);
              }}
              className="absolute top-1.5 right-1.5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 cursor-pointer"
            >
              <X size={10} />
            </button>

            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={10} className="text-[#FFCE00] fill-[#FFCE00]" />
              Pakistan's First German AI Tutor
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1.5 leading-snug">
              "Hallo! Practice high-score speaking with me 24/7! 🤖🇩🇪"
            </p>
            <div className="mt-2.5 flex items-center justify-between">
              <Link
                to="/german-tutor"
                className="text-[10px] font-black text-[#FFCE00] bg-slate-900 border border-slate-950 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-wider"
              >
                Start Trial
              </Link>
              <span className="text-[9px] text-emerald-500 font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Online
              </span>
            </div>

            {/* Bubble arrow pointing right/down towards the robot */}
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-[#eceef1] rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating interactive Robot */}
      <motion.div
        initial={{ y: 80, scale: 0.5, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        whileHover={{
          scale: 1.08,
          rotate: -6,
          y: -4,
          transition: { type: "spring", stiffness: 400, damping: 15 }
        }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="relative group pointer-events-auto"
      >
        {/* Hover / Glow visual backlight */}
        <div className="absolute inset-x-2 -bottom-2 -top-1 bg-gradient-to-tr from-[#FFCE00]/30 to-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

        {/* Dismiss entire widget button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="absolute -top-2 -right-1 bg-white border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-all z-20 cursor-pointer"
          title="Dismiss tutor help"
        >
          <X size={10} />
        </button>

        {/* Floating Tag over Robot */}
        <div className="absolute -top-8 left-2 whitespace-nowrap bg-slate-900/95 text-[9px] font-black tracking-widest uppercase text-[#FFCE00] px-3 py-1.5 rounded-full border border-slate-950 shadow-md">
          Pakistan's First German AI Tutor 🤖
        </div>

        {/* Link packaging for Robot */}
        <Link
          to="/german-tutor"
          className="relative block w-20 h-20 sm:w-22 sm:h-22 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFCE00] rounded-full"
          title="Open Pakistan's First German AI Tutor"
          onMouseEnter={() => setShowBubble(true)}
        >
          {/* Animated SVG Robot conforming to the friendly, sleek visual style uploaded */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-2xl filter hover:drop-shadow-[0_15px_15px_rgba(255,206,0,0.3)] transition-all duration-300 animate-float"
            style={{ animationDuration: "3.5s" }}
          >
            {/* Gradients */}
            <defs>
              <radialGradient id="robotBodyGrad" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#f1f3f7" />
                <stop offset="100%" stopColor="#d5dae2" />
              </radialGradient>
              <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#151d30" />
                <stop offset="100%" stopColor="#0a0d14" />
              </linearGradient>
              <radialGradient id="eyeGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="germanFlagYellow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFCE00" />
                <stop offset="100%" stopColor="#D0A100" />
              </linearGradient>
            </defs>

            {/* BACKGROUND COMPLEMENT/SHADOW */}
            <ellipse cx="100" cy="180" rx="30" ry="6" fill="#000000" opacity="0.15" />

            {/* ROBOT TORSO/BODY */}
            <path
              d="M60 140 C60 110, 140 110, 140 140 C140 168, 60 168, 60 140 Z"
              fill="url(#robotBodyGrad)"
              stroke="#cbd1dc"
              strokeWidth="2.5"
            />
            {/* Robot chest panel (German Flag Heart-pin) */}
            <rect x="91" y="132" width="18" height="3" fill="#000000" />
            <rect x="91" y="135" width="18" height="3" fill="#DD0000" />
            <rect x="91" y="138" width="18" height="3" fill="#FFCE00" />

            {/* ROBOT LIMBS / ARM JOINTED ARCS */}
            {/* Left Arm */}
            <path
              d="M62 125 C45 130, 42 155, 52 165 C55 168, 59 160, 56 154"
              fill="none"
              stroke="#d5dae2"
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Right Arm */}
            <path
              d="M138 125 C155 130, 158 155, 148 165 C145 168, 141 160, 144 154"
              fill="none"
              stroke="#d5dae2"
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* ROBOT HEAD / HELMET */}
            <rect
              x="38"
              y="34"
              width="124"
              height="90"
              rx="42"
              fill="url(#robotBodyGrad)"
              stroke="#cbd1dc"
              strokeWidth="3"
            />

            {/* HEADPHONES / EAR CAPS (Matches uploaded picture) */}
            <rect x="25" y="60" width="14" height="38" rx="6" fill="#c3cad6" />
            <rect x="161" y="60" width="14" height="38" rx="6" fill="#c3cad6" />

            {/* ANTENNA TOP HIGHLIGHT */}
            <ellipse cx="100" cy="34" rx="20" ry="5" fill="#a4afbf" />
            <rect x="98" y="24" width="4" height="10" fill="#a4afbf" />
            <circle cx="100" cy="20" r="5" fill="#22d3ee" className="animate-pulse" />

            {/* ROBOT FACE SCREEN */}
            <rect
              x="48"
              y="44"
              width="104"
              height="70"
              rx="28"
              fill="url(#screenGrad)"
              stroke="#334155"
              strokeWidth="2"
            />

            {/* DIGITAL EMBELLISHED EYES (Happy curved status style from user's image) */}
            {/* Left Eye Goggles Glow background */}
            <ellipse cx="75" cy="76" rx="14" ry="14" fill="url(#eyeGlowGrad)" opacity="0.65" />
            {/* Curved Happy Left Eye */}
            <path
              d="M65 78 C65 67, 85 67, 85 78"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Right Eye Goggles Glow background */}
            <ellipse cx="125" cy="76" rx="14" ry="14" fill="url(#eyeGlowGrad)" opacity="0.65" />
            {/* Curved Happy Right Eye */}
            <path
              d="M115 78 C115 67, 135 67, 135 78"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* GLOWING DIGITAL SMILE (Matching the friendly cyber-robot tutor) */}
            <path
              d="M93 92 Q100 99 107 92"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          {/* Glowing Status Indicator to show active ready-to-chat status */}
          <div className="absolute bottom-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg z-10" title="German Tutor Online & Ready">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
