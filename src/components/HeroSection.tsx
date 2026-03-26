import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gift } from "lucide-react";

const HeroSection = () => {
  return (
    <section 
      id="inicio"
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-background"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)", paddingBottom: "10vh" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/premium-gift-bg.webp"
          alt="Mundo de Sorpresas Ayacucho - Regalos y Detalles Personalizados Premium"
          className="w-full h-full object-cover scale-105"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="sync"
          loading="eager"
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-white/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-5 sm:px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_4px_15px_rgba(0,0,0,0.05)] mb-6 sm:mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-body font-bold text-foreground/90 uppercase tracking-[0.15em]">Sorpresas que llegan al corazón</span>
          </motion.div>

          <h1 className="mb-6 md:mb-10 w-full flex justify-center">
            <span className="sr-only">Sorpresas Ayacucho - Regalos a Domicilio y Osito Tunantero</span>
            <img 
              src="/logo-mundo-sorpresas.png" 
              alt="Mundo de Sorpresas Ayacucho Logo Principal - Envíos a Domicilio" 
              className="w-[85%] sm:w-auto h-auto sm:h-40 md:h-56 lg:h-64 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:scale-[1.02] transition-transform duration-500"
              fetchPriority="high"
              loading="eager"
              width={600}
              height={256}
            />
          </h1>

          <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-6 md:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.05)] mb-8 sm:mb-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent pointer-events-none" />
            <h2 className="font-body text-lg sm:text-xl md:text-2xl text-slate-800 font-bold leading-relaxed relative z-10">
              Las mejores <strong className="text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">Sorpresas y Regalos en Ayacucho</strong> a domicilio. Haz que su día sea inolvidable con el exclusivo show del <strong className="text-amber-600 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] break-words">Osito Tunantero</strong>.
            </h2>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full gradient-cta text-accent-foreground font-body font-semibold text-base sm:text-lg shadow-cta hover:scale-105 transition-transform duration-300"
            >
              <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
              Descubre Nuestras Sorpresas
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
