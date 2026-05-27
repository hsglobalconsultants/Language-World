import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { COURSES, INTEREST_OPTIONS } from "../../constants/data";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ApplyOnlineFormProps {
  initialCourse?: string;
  onSuccess?: () => void;
}

export default function ApplyOnlineForm({ initialCourse = "", onSuccess }: ApplyOnlineFormProps) {
  const [applyData, setApplyData] = useState({
    fullName: "",
    email: "",
    phone: "",
    course: initialCourse,
    preferredTime: "",
    message: ""
  });
  const [honeypot, setHoneypot] = useState("");
  const [applyStatus, setApplyStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [applyError, setApplyError] = useState("");

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyStatus("submitting");
    setApplyError("");

    // Anti-spam Honeypot protection
    if (honeypot.trim()) {
      console.warn("Spam execution suspected & stopped silently via Honeypot check.");
      // Pretend it succeeded to fool the bot!
      setTimeout(() => {
        setApplyStatus("success");
        setApplyData({ fullName: "", email: "", phone: "", course: initialCourse, preferredTime: "", message: "" });
        setHoneypot("");
        if (onSuccess) onSuccess();
      }, 700);
      return;
    }

    try {
      await addDoc(collection(db, "applications"), {
        ...applyData,
        status: "pending",
        createdAt: serverTimestamp()
      });

      // Background trigger for email notification (fire-and-forget for instant success)
      fetch("/api/notify/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "application", data: applyData })
      }).catch((e) => {
        console.warn("Nodemailer system alert triggered warning (ignored for client continuity):", e);
      });

      setApplyStatus("success");
      setApplyData({ fullName: "", email: "", phone: "", course: initialCourse, preferredTime: "", message: "" });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Application failed:", error);
      setApplyStatus("error");
      
      let msg = "Something went wrong. Please try again.";
      if (error?.message?.includes("permission") || error?.code === "permission-denied") {
        msg = "Validation failed. Please ensure all fields are correct.";
      }
      setApplyError(msg);
      
      try {
        handleFirestoreError(error, OperationType.CREATE, "applications");
      } catch (e) {
        // Log handled error
      }
    }
  };

  if (applyStatus === "success") {
    return (
      <div className="text-center py-10">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h4 className="text-2xl font-bold text-accent mb-2">Application Received!</h4>
        <p className="text-gray-500 mb-8">We'll get in touch with you very soon.</p>
        <button onClick={() => setApplyStatus("idle")} className="btn-accent px-8 py-3 rounded-xl">Submit another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApplySubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 flex flex-col">
          <label 
            htmlFor="fullName" 
            className="text-xs font-bold text-accent uppercase tracking-wider"
          >
            Full Name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input 
            required
            id="fullName"
            name="fullName"
            type="text" 
            placeholder="John Doe" 
            disabled={applyStatus === "submitting"}
            value={applyData.fullName}
            onChange={(e) => setApplyData({...applyData, fullName: e.target.value})}
            aria-required="true"
            aria-label="Your Full Name"
            className="w-full p-4 bg-soft-gray rounded-2xl border border-slate-200/50 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all text-accent placeholder-gray-400" 
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <label 
            htmlFor="email" 
            className="text-xs font-bold text-accent uppercase tracking-wider"
          >
            Email Address <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input 
            required
            id="email"
            name="email"
            type="email" 
            placeholder="john@example.com" 
            disabled={applyStatus === "submitting"}
            value={applyData.email}
            onChange={(e) => setApplyData({...applyData, email: e.target.value})}
            aria-required="true"
            aria-label="Your Email Address"
            className="w-full p-4 bg-soft-gray rounded-2xl border border-slate-200/50 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all text-accent placeholder-gray-400" 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 flex flex-col">
          <label 
            htmlFor="phone" 
            className="text-xs font-bold text-accent uppercase tracking-wider"
          >
            Mobile Number <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input 
            required
            id="phone"
            name="phone"
            type="tel" 
            placeholder="+92 300 0000000" 
            disabled={applyStatus === "submitting"}
            value={applyData.phone}
            onChange={(e) => setApplyData({...applyData, phone: e.target.value})}
            aria-required="true"
            aria-label="Your Mobile Number"
            className="w-full p-4 bg-soft-gray rounded-2xl border border-slate-200/50 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all text-accent placeholder-gray-400" 
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <label 
            htmlFor="course" 
            className="text-xs font-bold text-accent uppercase tracking-wider"
          >
            Interested Course <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select 
            required
            id="course"
            name="course"
            disabled={applyStatus === "submitting"}
            value={applyData.course}
            onChange={(e) => setApplyData({...applyData, course: e.target.value})}
            aria-required="true"
            aria-label="Choose Interested Course"
            className="w-full p-4 bg-soft-gray rounded-2xl border border-slate-200/50 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all text-accent appearance-none"
          >
            <option value="">Select a Course</option>
            {INTEREST_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2 flex flex-col">
        <label 
          htmlFor="preferredTime" 
          className="text-xs font-bold text-accent uppercase tracking-wider"
        >
          Preferred Class Schedule / Time <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <select 
          required
          id="preferredTime"
          name="preferredTime"
          disabled={applyStatus === "submitting"}
          value={applyData.preferredTime}
          onChange={(e) => setApplyData({...applyData, preferredTime: e.target.value})}
          aria-required="true"
          aria-label="Choose Preferred Schedule/Time"
          className="w-full p-4 bg-soft-gray rounded-2xl border border-slate-200/50 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all text-accent appearance-none"
        >
          <option value="">Select Preferred Class Schedule</option>
          <option value="Weekdays - Morning">Weekdays (Morning)</option>
          <option value="Weekdays - Afternoon">Weekdays (Afternoon)</option>
          <option value="Weekdays - Evening">Weekdays (Evening)</option>
          <option value="Weekends - Morning">Weekends (Morning)</option>
          <option value="Weekends - Afternoon">Weekends (Afternoon)</option>
          <option value="Weekends - Evening">Weekends (Evening)</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="space-y-2 flex flex-col">
        <label 
          htmlFor="message" 
          className="text-xs font-bold text-accent uppercase tracking-wider"
        >
          Message (Optional)
        </label>
        <textarea 
          id="message"
          name="message"
          rows={4} 
          placeholder="Tell us about your goals..." 
          disabled={applyStatus === "submitting"}
          value={applyData.message}
          onChange={(e) => setApplyData({...applyData, message: e.target.value})}
          aria-label="Your message or goals"
          className="w-full p-4 bg-soft-gray rounded-2xl border border-slate-200/50 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all text-accent placeholder-gray-400"
        ></textarea>
      </div>

      {/* Visually hidden anti-spam honeypot field */}
      <div className="absolute opacity-0 w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <label htmlFor="user_middle_name">Do not fill this field if you are human</label>
        <input 
          type="text" 
          id="user_middle_name" 
          name="user_middle_name" 
          value={honeypot} 
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="new-password"
        />
      </div>

      {applyStatus === "error" && <p className="text-red-500 text-sm font-medium">{applyError}</p>}

      <button 
        type="submit" 
        disabled={applyStatus === "submitting"}
        className="btn-primary w-full py-5 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
      >
        {applyStatus === "submitting" ? (
          <>
            <Loader2 className="animate-spin" size={24} /> Submitting...
          </>
        ) : "Submit Application"}
      </button>
    </form>
  );
}
