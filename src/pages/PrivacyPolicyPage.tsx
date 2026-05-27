import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Copyright, 
  FileText, 
  AlertTriangle, 
  Scale, 
  EyeOff, 
  Globe2, 
  Database,
  Lock,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import SEO from "../components/common/SEO";

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 24, 2026";

  return (
    <div className="flex flex-col font-sans bg-gray-50 min-h-screen">
      <SEO 
        title="Privacy Policy & Intellectual Property Protection" 
        description="Official privacy policy, copyright warnings, and intellectual property statements of Language World Karachi. Protect your data and understand our strictly enforced anti-copying policies." 
      />

      {/* 1. Header Banner */}
      <section className="relative bg-accent text-white py-20 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#3d2c8d,transparent)] opacity-60" />
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-4">
          <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 text-xs font-black uppercase tracking-widest rounded-md inline-flex items-center gap-1.5">
            <ShieldCheck size={14} /> Legal & Security Portal
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-black leading-tight tracking-tight">
            Privacy Policy & <br className="sm:hidden" />
            <span className="text-primary">Intellectual Property Rights</span>
          </h1>
          <p className="text-xs md:text-sm text-white/75 font-semibold uppercase tracking-wider">
            Language World Karachi • Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Quick Legal Warnings / Left Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 text-red-700 font-extrabold text-sm uppercase tracking-wider mb-4">
                <AlertTriangle size={20} className="shrink-0 text-red-600" />
                <span>Strict Copyright Notice</span>
              </div>
              <p className="text-xs text-red-800 leading-relaxed font-medium">
                Our proprietary core algorithms, custom-branded CEFR German, IELTS, and PTE mock exam simulations, digitized curriculums, layout graphics, custom typography, site layout styles, and AI tutoring systems are actively monitored. 
              </p>
              <div className="mt-4 pt-4 border-t border-red-200/50 flex items-center justify-between text-[11px] text-red-700 font-black tracking-widest uppercase">
                <span>Violators Prosecuted</span>
                <span>DMCA Protected</span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-accent text-sm uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-1.5">
                <Scale size={16} className="text-primary" /> Key Legal Pillars
              </h3>
              <ul className="space-y-3.5">
                <li className="flex gap-2.5 text-xs text-gray-600 font-semibold leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>No parts of this site may be mirrored, copied, scraped, or plagiarized under any conditions.</span>
                </li>
                <li className="flex gap-2.5 text-xs text-gray-600 font-semibold leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Interactive web components and backend APIs are intellectual property of Language World.</span>
                </li>
                <li className="flex gap-2.5 text-xs text-gray-600 font-semibold leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Student personal lead records are locked securely inside encrypted secure servers with firewalls.</span>
                </li>
                <li className="flex gap-2.5 text-xs text-gray-600 font-semibold leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>We offer complete right to data deletion on custom request submitted via official email.</span>
                </li>
              </ul>
            </div>

            <div className="bg-accent text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 text-white/5 font-black text-9xl pointer-events-none select-none">
                C
              </div>
              <h4 className="font-display font-black text-sm uppercase tracking-widest text-primary mb-2">Legal Counselor</h4>
              <p className="text-xs text-white/80 leading-relaxed font-medium mb-4">
                Have questions regarding legal permissions or intellectual property authorization? Contact our administration panel.
              </p>
              <a 
                href="mailto:info@thelanguageworld.com" 
                className="inline-flex items-center gap-1.5 bg-white text-accent px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-accent transition-all duration-300"
              >
                info@thelanguageworld.com
              </a>
            </div>
          </div>

          {/* Detailed Legal Content / Right Panel */}
          <div className="lg:col-span-8 space-y-12 bg-white border border-gray-100/80 rounded-3xl p-8 sm:p-12 shadow-sm text-left">
            
            {/* 1. COPYRIGHT PROTECTION & INTELLECTUAL PROPERTY */}
            <div className="space-y-6" id="copyright">
              <div className="flex items-center gap-3 text-accent border-b border-gray-100 pb-4">
                <Copyright className="text-primary shrink-0" size={28} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black">1. Intellectual Property & Copyright Protection</h2>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-black mt-0.5">Strict Prohibition Against Duplication</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-4 font-medium leading-relaxed">
                <p>
                  All content included on this website, such as text, custom graphic assets, logos, button icons, digital software code, stylesheets, structured layouts, automated custom interactive mock tests (Goethe German Einstufungstest, IELTS, and PTE simulations and their underlying logic/flow), custom visual graphics, and the semantic structured JSON-LD schema layouts, are the exclusive property of <strong className="text-accent font-bold">Language World Karachi</strong> and are fully protected by Pakistan copyright laws and international intellectual property treaties.
                </p>
                
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/60 my-6">
                  <p className="text-xs font-bold text-amber-900 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-amber-600" /> Automated Scraper & Clone Warning
                  </p>
                  <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                    We strictly forbid the copy, redistribution, mirroring, republishing, framing, automated web scraping, content spinning, copying of code, or cloning of the user experience interface of Language World. Competitors or other institutes who copy our website elements, course titles, descriptors, structural CSS styles, or AI components will be met with immediate legal cease-and-desist mandates, DMCA takedown requests, and direct prosecution through relevant judicial, cybercrime, and intellectual property bodies in Karachi and internationally.
                  </p>
                </div>

                <p>
                  Any unauthorized use, redistribution, modification, replication, or extraction of content, graphics, and interactive code from this portal without written prior authorization signed by the Founder and Academic Director of Language World, is strictly illegal and subject to civil and criminal liability.
                </p>
              </div>
            </div>

            {/* 2. COLLECTION OF PERSONAL INFORMATION */}
            <div className="space-y-6" id="privacy-data">
              <div className="flex items-center gap-3 text-accent border-b border-gray-100 pb-4">
                <EyeOff className="text-primary shrink-0" size={28} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black">2. Privacy & Personal Data We Collect</h2>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-black mt-0.5">Student Info & Communication Safety</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-4 font-medium leading-relaxed">
                <p>
                  Language World appreciates your trust and respects your secure data privacy rights. We strictly limit personal processing to essential student communication and registration purposes:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="border border-gray-100 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wide">
                      <Database size={16} className="text-primary" /> Active Submissions
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                      When you submit our <strong>Apply Online Form</strong>, <strong>Contact Us Form</strong>, or subscribe to our <strong>Newsletter</strong>, we collect your Full Name, Email, Phone Number, Course Interests, and relative messages.
                    </p>
                  </div>
                  <div className="border border-gray-100 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wide">
                      <Lock size={16} className="text-primary" /> Security Encryption
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                      Your submitted records are stored securely in Google Firebase Firestore and processed via Nodemailer. We enforce strict data firewalls to ensure third parties never access your phone number or study information.
                    </p>
                  </div>
                </div>

                <p>
                  Furthermore, when sitting for our complimentary German Placement, IELTS, or PTE Mock tests, your name and score coordinates are locked into your mock-test system so we can generate your secure, formal PDF Certificate and offer accurate academic advice on Goethe or British Council exams.
                </p>
              </div>
            </div>

            {/* 3. DISCLOSURES & THIRD-PARTY TRACKING */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-accent border-b border-gray-100 pb-4">
                <Globe2 className="text-primary shrink-0" size={28} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black">3. Web Cookies & Analytics Reporting</h2>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-black mt-0.5">Improving Navigation Mechanics</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-4 font-medium leading-relaxed">
                <p>
                  The Language World website employs safe cookies, local client-side memory states, and Google Analytics tracking cookies (G-N5SSGK9DXS) to record clean anonymous browsing sessions, analyze our site performance speed when someone views our pages, and study traffic patterns. No personal identifying configurations are leaked to Google Analytics. You can turn off cookie permissions in your browser settings at any point.
                </p>
                <p>
                  Our site maintains external social connections to <strong>Facebook</strong>, <strong>Instagram</strong>, and <strong>WhatsApp Business (+92-300-7007699)</strong>. Please review their distinct privacy notices when interacting with those external communication tools.
                </p>
              </div>
            </div>

            {/* 4. TERMS OF MOCK TEST ASSESSMENTS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-accent border-b border-gray-100 pb-4">
                <FileText className="text-primary shrink-0" size={28} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black">4. Testing Platform Disclaimers</h2>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-black mt-0.5">Intellectual Integrity Policy</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-4 font-medium leading-relaxed">
                <p>
                  Language World provides online German, IELTS, and PTE Academic mock tests as preliminary diagnostic tools. While they serve as superb indicators of current language aptitude and CEFR levels, they do not serve as legally binding replacements for certified Goethe-Institut certificates, IELTS results delivered by British Council/IDP, or official Pearson PTE sheets.
                </p>
                <p>
                  Certificate creation is provided free as a token of achievement and linguistic determination. Language World reserves the right to terminate, rewrite, or reset mock testing platforms, rules, and questions without prior notice to promote pedagogical standards.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
