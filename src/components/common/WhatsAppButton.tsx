import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";
import { CONTACT_INFO } from "../../constants/data";

export default function WhatsAppButton() {
  const handleClick = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, "_blank");
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      id="whatsapp-floating-btn"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
      title="Chat with us on WhatsApp"
    >
      <MessageSquare className="w-8 h-8" />
    </motion.button>
  );
}
