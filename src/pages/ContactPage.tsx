import { motion } from "motion/react";
import { Mail, Phone, MapPin, MessageSquare, Facebook, Instagram, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { CONTACT_INFO } from "../constants/data";
import SEO from "../components/common/SEO";
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      console.log("Submitting contact query to Firebase...", formData);
      const path = "contacts";
      const docRef = await addDoc(collection(db, path), {
        ...formData,
        status: "new",
        createdAt: serverTimestamp()
      });
      console.log("Contact submitted successfully, ID:", docRef.id);
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      
      // Scroll to the top of the form so the success message is visible
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("Submission failed:", error);
      setStatus("error");
      
      let msg = "Something went wrong. Please try again later.";
      if (error?.message?.includes("insufficient permissions") || error?.code === "permission-denied") {
        msg = "Submission failed: Data validation error. Please check your inputs.";
      } else if (error?.code === "unavailable") {
        msg = "Service Unavailable: Please check your internet connection.";
      }
      
      setErrorMessage(msg);
      try {
        handleFirestoreError(error, OperationType.CREATE, "contacts");
      } catch (e) {
        // Suppress re-throw to allow component to stay mounted and show error state
        console.error("error logged and suppressed for component safety");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col">
      <SEO title="Contact Us" description="Get in touch with Language World Karachi for inquiries about German classes, IELTS, and PTE preparation." />
      
      <section className="bg-accent py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Get In <span className="text-primary italic">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            Have questions about our courses or seeking a free consultation? We're here to help you navigate your educational journey.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-3xl font-extrabold text-accent mb-8">Contact Information</h2>
            <p className="text-gray-500 mb-12">Visit us or reach out via any of the channels below. Our team is available to assist you Monday through Saturday.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-accent">Phone</h4>
                  <p className="text-sm text-gray-500">{CONTACT_INFO.phone}</p>
                  <p className="text-sm text-gray-500">{CONTACT_INFO.mobile}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-accent">Email</h4>
                  <p className="text-sm text-gray-500">{CONTACT_INFO.email}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-accent">Address</h4>
                  <p className="text-sm text-gray-500">{CONTACT_INFO.address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-accent">Working Hours</h4>
                  <p className="text-sm text-gray-500">Mon - Sat: 11AM - 8PM</p>
                  <p className="text-sm text-gray-500">Sunday: 1PM - 5PM</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-accent mb-6">Social Media</h3>
            <div className="flex flex-wrap gap-4">
              <a href={CONTACT_INFO.socials.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[#1877F2]/10 text-[#1877F2] rounded-full font-bold hover:bg-[#1877F2] hover:text-white transition-all">
                <Facebook size={20} /> Facebook
              </a>
              <a href={CONTACT_INFO.socials.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[#E4405F]/10 text-[#E4405F] rounded-full font-bold hover:bg-[#E4405F] hover:text-white transition-all">
                <Instagram size={20} /> Instagram
              </a>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-soft-gray p-10 lg:p-12 rounded-[3.5rem] border border-gray-100"
          >
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-extrabold text-accent mb-4">Message Sent!</h3>
                <p className="text-gray-500 mb-8">Thank you for reaching out. Our team will get back to you shortly.</p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="btn-accent px-10 py-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-extrabold text-accent mb-8">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-accent uppercase tracking-wider">Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none" 
                      required 
                      disabled={status === "submitting"}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-accent uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none" 
                        required 
                        disabled={status === "submitting"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-accent uppercase tracking-wider">Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none" 
                        required 
                        disabled={status === "submitting"}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-accent uppercase tracking-wider">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none" 
                      disabled={status === "submitting"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-accent uppercase tracking-wider">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5} 
                      className="w-full p-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none resize-none"
                      required
                      disabled={status === "submitting"}
                    ></textarea>
                  </div>
                  
                  {status === "error" && (
                    <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
                  )}

                  <button 
                    type="submit" 
                    className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-2"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="animate-spin" size={24} /> Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <section className="h-[500px]">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.3471211020546!2d67.0946261!3d24.920242100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f096ddcad41%3A0x1bb0e746b890e519!2sLanguage%20World!5e0!3m2!1sen!2s!4v1778409319978!5m2!1sen!2s" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Language World Map"
        ></iframe>
      </section>
    </div>
  );
}
