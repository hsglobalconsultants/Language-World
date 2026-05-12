export const CONTACT_INFO = {
  name: "Language World",
  tagline: "Your Gateway to Global Communication",
  domain: "thelanguageworld.com",
  email: "info@thelanguageworld.com",
  phone: "021 34155182",
  mobile: "03007007699",
  whatsapp: "03007007699",
  address: "Office 1 FL 4 / 14 Block 5 Gulshan E Iqbal Karachi (near nipa chorangI)",
  socials: {
    facebook: "https://www.facebook.com/thelanguageworldPakistan",
    instagram: "https://www.instagram.com/thelanguageworldpakistan/",
  },
};

export const COURSES = [
  {
    id: "german-language",
    title: "German Language",
    subtitle: "A1 to B2 Levels",
    description: "Comprehensive German language courses from beginner to intermediate levels, following CEF standards.",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=800",
    features: ["Expert Instructors", "Daily Practice Sessions", "Exam Preparation", "Interactive Classes"],
    path: "/courses/german-language",
  },
  {
    id: "ielts-preparation",
    title: "IELTS Preparation",
    subtitle: "Score 7.0+ Guaranteed",
    description: "Master the International English Language Testing System with our specialized coaching.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
    features: ["Mock Tests", "Individual Feedback", "Vocabulary Building", "Time Management Tips"],
    path: "/courses/ielts-preparation",
  },
  {
    id: "pte-preparation",
    title: "PTE Preparation",
    subtitle: "Fast-track Your Success",
    description: "Comprehensive training for the Pearson Test of English Academic with latest material.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    features: ["Computer-based Practice", "AI Evaluation", "Scoring Strategies", "Limited Batch Size"],
    path: "/courses/pte-preparation",
  },
  {
    id: "language-cert",
    title: "LanguageCert",
    subtitle: "Global Certification",
    description: "Official preparation for LanguageCert international exams for study and immigration.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    features: ["Flexible Exam Dates", "Targeted Training", "Listening & Speaking Focus", "SELT Experts"],
    path: "/courses/language-cert",
  },
  {
    id: "business-communication",
    title: "Business Communication",
    subtitle: "Corporate Excellence",
    description: "Professional communication skills for the modern workplace and corporate success.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800",
    features: ["Professional Writing", "Presentation Skills", "Email Etiquette", "Public Speaking"],
    path: "/courses/business-communication",
  },
];

export const INTEREST_OPTIONS = [
  "German Language",
  "German Language A1",
  "German Language A2",
  "German Language B1",
  "German Language B2",
  "IELTS Preparation",
  "IELTS Academic",
  "IELTS General",
  "PTE Preparation",
  "PTE Academic",
  "LanguageCert",
  "Business Communication",
  "Spoken English",
  "Duolingo English Test",
  "Study Visa Consultation"
];

export const ABOUT_STATS = [
  { label: "Expert Instructors", value: "10+" },
  { label: "Successful Students", value: "500+" },
];

export const MISSION_VISION = [
  { 
    title: "Our Mission", 
    desc: "To provide high-quality language education that transforms lives and creates global citizens." 
  },
  { 
    title: "Our Vision", 
    desc: "To be the most trusted and innovative language institute recognized across Pakistan." 
  },
  { 
    title: "Our Values", 
    desc: "Excellence, Integrity, Student-Centricity, and Continuous Improvement in all we do." 
  },
];

export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { 
    label: "Courses", 
    path: "/courses",
    dropdown: COURSES.map(c => ({ label: c.title, path: c.path }))
  },
  { label: "Testimonials", path: "/testimonials" },
  { label: "Blog", path: "/blog" },
  { label: "Contact Us", path: "/contact" },
];

export const TESTIMONIALS = [
  {
    name: "Ahmed Khan",
    course: "German A1-B2",
    text: "The instructors at Language World are world-class. I passed my B1 exam in one go thanks to their guidance.",
    rating: 5,
  },
  {
    name: "Sara Siddiqui",
    course: "IELTS Preparation",
    text: "I achieved an 8.0 band score! The mock tests were incredibly helpful in building my confidence.",
    rating: 5,
  },
  {
    name: "Mustafa Ali",
    course: "PTE Preparation",
    text: "Brilliant atmosphere and very supportive staff. The AI tools they use for PTE prep are amazing.",
    rating: 4,
  },
];
