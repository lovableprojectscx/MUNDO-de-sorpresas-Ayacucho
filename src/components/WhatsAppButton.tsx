import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/51931489389?text=Hola%20Mundo%20de%20Sorpresas%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n.";

const WhatsAppButton = () => {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[100] flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:bg-[#20ba59] transition-colors group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 1.5 // Esperar un poco después de cargar la página
      }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8 fill-current" />
      
      {/* Tooltip o Mensaje de Texto (opcional, aparece al hover) */}
      <span className="absolute right-full mr-4 px-4 py-2 rounded-xl bg-white text-foreground font-body font-bold text-sm shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-100 hidden md:block">
        ¡Hablemos por WhatsApp! 📲
      </span>

      {/* Onda de choque animada */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10" />
    </motion.a>
  );
};

export default WhatsAppButton;
