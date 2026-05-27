import { motion } from "motion/react";
import { 
  FileText, 
  UserCheck, 
  HelpCircle, 
  Cpu, 
  ShieldAlert, 
  AlertOctagon, 
  Scale, 
  MapPin, 
  Calendar,
  Lock,
  ArrowUpRight
} from "lucide-react";
import SEO from "../components/common/SEO";

export default function TermsOfServicePage() {
  const lastUpdated = "May 24, 2026";

  return (
    <div className="flex flex-col font-sans bg-gray-50 min-h-screen">
      <SEO 
        title="Terms of Service" 
        description="Official Terms of Service of Language World Karachi. Read our regulations on user conduct, intellectual property protection, and mock test scoring disclaimers." 
      />

      {/* 1. Header Banner */}
      <section className="relative bg-accent text-white py-20 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#3d2c8d,transparent)] opacity-60" />
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-4">
          <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 text-xs font-black uppercase tracking-widest rounded-md inline-flex items-center gap-1.5">
            <FileText size={14} /> Platform Agreement
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-black leading-tight tracking-tight">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-xs md:text-sm text-white/75 font-semibold uppercase tracking-wider">
            Language World Karachi • Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* 2. Main content area */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left panel - Highlights & Navigation summaries */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 text-amber-800 font-extrabold text-sm uppercase tracking-wider mb-4">
                <ShieldAlert size={20} className="shrink-0 text-amber-600" />
                <span>Quick Compliance Summary</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                By browsing Language World, taking any mock exams, or interacting with our automated AI tutors, you legally enter into this binding platform agreement. If you do not agree, please exit the site.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-accent text-sm uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-1.5">
                <Cpu size={16} className="text-primary" /> Key Bound Terms
              </h3>
              <ul className="space-y-3.5">
                <li className="flex gap-2.5 text-xs text-gray-600 font-semibold leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span><strong>Conduct Code:</strong> Users are strictly prohibited from utilizing bugs or reverse-engineering AI systems.</span>
                </li>
                <li className="flex gap-2.5 text-xs text-gray-600 font-semibold leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span><strong>Mock Performance:</strong> Generated scores and certificates are standardized indicators and have no legally binding embassy status.</span>
                </li>
                <li className="flex gap-2.5 text-xs text-gray-600 font-semibold leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span><strong>Content Protection:</strong> Intellectual property rights are rigorously protected against competitor duplicate cloning.</span>
                </li>
              </ul>
            </div>

            <div className="bg-accent text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 text-white/5 font-black text-9xl pointer-events-none select-none">
                T
              </div>
              <h4 className="font-display font-black text-sm uppercase tracking-widest text-primary mb-2">Legal Compliance</h4>
              <p className="text-xs text-white/80 leading-relaxed font-medium mb-4">
                Our operations comply fully with regional Pakistani laws and global internet practices. Need authorization for educational references? Email us.
              </p>
              <a 
                href="mailto:info@thelanguageworld.com" 
                className="inline-flex items-center gap-1.5 bg-white text-accent px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-accent transition-all duration-300"
              >
                info@thelanguageworld.com →
              </a>
            </div>
          </div>

          {/* Right panel - detailed Terms of Service clauses */}
          <div className="lg:col-span-8 space-y-12 bg-white border border-gray-100/80 rounded-3xl p-8 sm:p-12 shadow-sm text-left">
            
            {/* 1. ACCEPTANCE & ELIGIBILITY */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-accent border-b border-gray-100 pb-4">
                <Scale className="text-primary shrink-0" size={28} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black">1. Acceptance of terms</h2>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-black mt-0.5">Legally Binding Platform Framework</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-3 font-medium leading-relaxed">
                <p>
                  These Terms of Service govern your access to and use of all websites, portals, sub-components, and integrated systems hosted under the domain <strong className="text-accent font-bold">thelanguageworld.com</strong> ("the Website"), administered directly by <strong className="text-accent font-bold">Language World Karachi</strong>.
                </p>
                <p>
                  By creating an admin profile, typing messages to our digital tutor, sitting for a practice examination, or clicking "Send" on lead forms, you warrant that you are at least 13 years old and fully competent to consent to, comply with, and remain legally bound by these conditions.
                </p>
              </div>
            </div>

            {/* 2. USER CONDUCT GUIDELINES */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-accent border-b border-gray-100 pb-4">
                <UserCheck className="text-primary shrink-0" size={28} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black">2. Candidate & Visitor Conduct Code</h2>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-black mt-0.5">Ethical Interaction with AI & Exam Simulations</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-3 font-medium leading-relaxed">
                <p>
                  We aim to democratize access to prime prep resources. Therefore, all candidates agree to engage with Language World under professional standards of academic honesty and fair play. Specifically, you agree <strong>NOT</strong> to:
                </p>
                <ul className="space-y-2.5 pl-4 list-decimal">
                  <li>
                    Introduce harmful scripts, automated injection payloads, malware, spyware, cross-site scripting (XSS), or send robotic spam inquiries.
                  </li>
                  <li>
                    Submit false identity records, utilize invalid or un-owned phone numbers or emails, or populate form submissions with unscholarly or profane text details.
                  </li>
                  <li>
                    Circumvent security modules, brute-force admin portals, attempt credential guessing, or reverse-engineer the underlying scoring structures.
                  </li>
                  <li>
                    Exploit, extract, or reverse-engineer the automated IELTS, PTE, or German exam scoring platforms or our customized Gemini-powered AI German tutor.
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. INTELLECTUAL PROPERTY & SITE MATERIALS ACCEPTABLE USE */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-accent border-b border-gray-100 pb-4">
                <AlertOctagon className="text-primary shrink-0" size={28} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black">3. Acceptable Use of Site Content</h2>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-black mt-0.5">Strict Prohibition of Content Duplication</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-3 font-medium leading-relaxed">
                <p>
                  All visual branding assets, layouts, structural typography, exam question designs, templates, and specific assets listed on the Website are proprietary intellectual property. Competitors and related local educational institutes are explicitly prohibited from downloading, extracting, cloning, copying, or spinning any part of this Website.
                </p>
                <p>
                  Browsing the site does not transfer any license, trademark rights, or property ownership of elements. Our layout contains digital fingerprint markers to proactively detect duplicated code, asset piracy, or content theft. We reserve the absolute right to terminate access, take down plagiarized material through legal channels, and request direct compensation for brand replication.
                </p>
              </div>
            </div>

            {/* 4. LIABILITY DISCLAIMER FOR EXAM MOCK SCORES & CERTIFICATES */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-accent border-b border-gray-100 pb-4">
                <ShieldAlert className="text-primary shrink-0" size={28} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black">4. Mock Test & Certification Disclaimers</h2>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-black mt-0.5">Scope of Linguistic Evaluations</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-4 font-medium leading-relaxed">
                <p>
                  Language World offers modern interactive mock examinations as diagnostic pre-assessment tools to support educational preparation. By taking these tests, you explicitly acknowledge and agree to the following limitations of liability:
                </p>
                
                <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl space-y-3">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-blue-900">Important Notices:</h5>
                  <ul className="space-y-2 text-xs font-semibold text-blue-800 leading-relaxed list-disc pl-4">
                    <li>
                      <strong>No Official Equivalent:</strong> The diagnostic evaluation band, CEFR level, or point metrics provided by Language World mock systems are estimation summaries and are not legally recognized as official Goethe-Institut certificate score sheets, official British Council/IDP IELTS bands, or official Pearson PTE credentials.
                    </li>
                    <li>
                      <strong>Certification Purpose:</strong> The digital credentials of achievement compiled by this site are formal badges of mock achievement awarded by the private administration of Language World. They do not grant immigration, spousal visa approval, language student visa rights, university entry validation, or settlement rights to the Federal Republic of Germany or any international nation.
                    </li>
                    <li>
                      <strong>Academic Discretion:</strong> Language World makes no legally binding warranty concerning the 100% exact conformity of our artificial-intelligence evaluation with the official human examiners of international councils. We are not liable for any discrepancies or academic outcomes.
                    </li>
                  </ul>
                </div>

                <p>
                  Our mock portals are designed to nurture student skill progress and lower official assessment anxiety. Ultimately, you are responsible for fulfilling off-site registration, paying official terminal fees, and attending the mandatory testing sites dictated by registration councils.
                </p>
              </div>
            </div>

            {/* 5. INDEMNIFICATION & JURISDICTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-accent border-b border-gray-100 pb-4">
                <MapPin className="text-primary shrink-0" size={28} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black">5. Indemnification & Jurisdiction</h2>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-black mt-0.5">Governing Laws & Boundaries</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-3 font-medium leading-relaxed">
                <p>
                  You agree to defend, indemnify, and hold harmless <strong className="text-accent font-bold">Language World</strong>, its founder, staff, legal advisors, content writers, and standard contractors, against any losses, liabilities, fines, lawsuits, or expenses arising from your violation of these policies or unauthorized replication of platform elements.
                </p>
                <p>
                  Any legal actions, arbitration proceedings, or copyright contestations related to our platform will be governed entirely under the laws of the Islamic Republic of Pakistan, subject exclusively to the jurisdiction of localized courts operating in Karachi, Pakistan.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
