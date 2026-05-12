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
    message: ""
  });
  const [applyStatus, setApplyStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [applyError, setApplyError] = useState("");

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyStatus("submitting");
    setApplyError("");

    try {
      await addDoc(collection(db, "applications"), {
        ...applyData,
        status: "pending",
        createdAt: serverTimestamp()
      });
      setApplyStatus("success");
      setApplyData({ fullName: "", email: "", phone: "", course: initialCourse, message: "" });
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
        <div className="space-y-2">
          <label className="text-xs font-bold text-accent uppercase tracking-wider">Full Name</label>
          <input 
            required
            type="text" 
            placeholder="John Doe" 
            disabled={applyStatus === "submitting"}
            value={applyData.fullName}
            onChange={(e) => setApplyData({...applyData, fullName: e.target.value})}
            className="w-full p-4 bg-soft-gray rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-accent uppercase tracking-wider">Email Address</label>
          <input 
            required
            type="email" 
            placeholder="john@example.com" 
            disabled={applyStatus === "submitting"}
            value={applyData.email}
            onChange={(e) => setApplyData({...applyData, email: e.target.value})}
            className="w-full p-4 bg-soft-gray rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all" 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-accent uppercase tracking-wider">Mobile Number</label>
          <input 
            required
            type="tel" 
            placeholder="+92 300 0000000" 
            disabled={applyStatus === "submitting"}
            value={applyData.phone}
            onChange={(e) => setApplyData({...applyData, phone: e.target.value})}
            className="w-full p-4 bg-soft-gray rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-accent uppercase tracking-wider">Interested Course</label>
          <select 
            required
            disabled={applyStatus === "submitting"}
            value={applyData.course}
            onChange={(e) => setApplyData({...applyData, course: e.target.value})}
            className="w-full p-4 bg-soft-gray rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
          >
            <option value="">Select a Course</option>
            {INTEREST_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-accent uppercase tracking-wider">Message (Optional)</label>
        <textarea 
          rows={4} 
          placeholder="Tell us about your goals..." 
          disabled={applyStatus === "submitting"}
          value={applyData.message}
          onChange={(e) => setApplyData({...applyData, message: e.target.value})}
          className="w-full p-4 bg-soft-gray rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all"
        ></textarea>
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
