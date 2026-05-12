import { createContext, useContext, useState, ReactNode } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ApplyOnlineForm from "./common/ApplyOnlineForm";

interface ModalContextType {
  openApplyModal: (courseName?: string) => void;
  closeApplyModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  const openApplyModal = (courseName: string = "") => {
    setSelectedCourse(courseName);
    setIsOpen(true);
  };

  const closeApplyModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ openApplyModal, closeApplyModal }}>
      {children}
      
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeApplyModal}
              className="absolute inset-0 bg-accent/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={closeApplyModal}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-accent transition-colors"
                title="Close"
              >
                <X size={28} />
              </button>
              
              <div className="mb-8">
                <h3 className="text-3xl font-extrabold text-accent mb-2">Apply Online</h3>
                <p className="text-gray-500">Start your global journey today. Fill out the form below and we'll contact you within 24 hours.</p>
              </div>

              <ApplyOnlineForm initialCourse={selectedCourse} onSuccess={() => {
                // We keep it open to show success state in the form
              }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}

export function useModals() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalProvider");
  }
  return context;
}
