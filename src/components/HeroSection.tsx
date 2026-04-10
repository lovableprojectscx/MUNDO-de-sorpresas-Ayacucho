import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gift } from "lucide-react";

const HeroSection = () => {
  return (
    <section 
      id="inicio"
      className="relative min-h-[90svh] sm:min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with Dark Professional Overlay */}
      <div className="absolute inset-0">
        <img
          src="/fondo-principal-ayacucho.webp"
          alt="Mundo de Sorpresas Ayacucho - Regalos Premium"
          className="w-full h-full object-cover opacity-80"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="sync"
          loading="eager"
        />
        {/* Gradiente oscuro para dar firmeza y legibilidad premium */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full flex flex-col items-center justify-center pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center w-full"
        >
          {/* Pequeño tag superior elegante */}
          <motion.div
            className="inline-flex items-center gap-2 mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="h-[1px] w-8 sm:w-12 bg-primary/80" />
            <span className="text-[10px] sm:text-xs font-display font-medium text-white/90 uppercase tracking-[0.3em]">
              Sorpresas Inolvidables
            </span>
            <div className="h-[1px] w-8 sm:w-12 bg-primary/80" />
          </motion.div>

          {/* Logo principal */}
          <div className="mb-8 w-full flex justify-center">
            <span className="sr-only">Sorpresas Ayacucho</span>
            <img 
              src="/logo-mundo-sorpresas.webp" 
              alt="Mundo de Sorpresas Ayacucho Logo" 
              className="w-[85%] sm:w-auto h-auto sm:h-36 md:h-44 lg:h-52 object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              fetchPriority="high"
              loading="eager"
              width={600}
              height={256}
            />
          </div>

          {/* Texto de propuesta de valor Firme y Elegante */}
          <div className="max-w-3xl mx-auto mb-10 sm:mb-12">
            <h1 className="font-display text-2xl sm:text-3xl md:text-5xl text-white font-bold leading-tight mb-4 drop-shadow-xl text-balance">
              Expertos en <span className="text-primary">Regalos a Domicilio</span> en Ayacucho
            </h1>
            <p className="font-body text-base sm:text-lg text-gray-300 font-light max-w-2xl mx-auto text-balance leading-relaxed">
              Expresa tus sentimientos con calidad. Entregamos detalles exclusivos y el reconocido show del Osito Tunantero directo a su puerta.
            </p>
          </div>

          {/* CTA Botón sólido y profesional */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-primary text-white font-body font-semibold text-sm sm:text-base border border-primary/50 shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:bg-primary/90 transition-all duration-300"
            >
              <Gift className="w-5 h-5" />
              Ver Catálogo Completo
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Wave at the bottom to transition cleanly */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden flex items-end">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-[calc(100%+2px)] h-[40px] sm:h-[60px] md:h-[80px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,120.4,192.8,107.5,236.4,98.54,281.39,70.56,321.39,56.44Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
