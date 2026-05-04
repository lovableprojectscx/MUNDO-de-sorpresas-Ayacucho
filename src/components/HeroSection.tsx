import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gift, ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section 
      id="inicio"
      className="relative min-h-[90svh] sm:min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Image with Dark Professional Overlay */}
      <div className="absolute inset-0">
        <img
          src="/fondo-principal-ayacucho.webp"
          alt="Mundo de Sorpresas Ayacucho - Regalos Premium"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          fetchpriority="high"
          decoding="sync"
          loading="eager"
        />
        {/* Overlay premium, oscuro y sofisticado */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full flex flex-col items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center w-full"
        >
          {/* Tag superior minimalista */}
          <motion.div
            className="inline-flex items-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-px w-8 sm:w-16 bg-gold-light/60" />
            <span className="text-[10px] sm:text-xs font-body font-medium text-gold-light uppercase tracking-[0.25em]">
              Exclusividad en Ayacucho
            </span>
            <div className="h-px w-8 sm:w-16 bg-gold-light/60" />
          </motion.div>

          {/* Título Firme y Elegante */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-white font-bold leading-[1.1] mb-6 drop-shadow-2xl text-balance tracking-tight">
            Hay sorpresas que se <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text gradient-gold">guardan en el alma</span>
          </h1>

          {/* Subtítulo limpio y directo */}
          <p className="font-body text-base sm:text-xl text-white/80 font-light max-w-2xl mx-auto text-balance leading-relaxed mb-10">
            Creamos experiencias únicas para que tus momentos especiales duren para siempre.
          </p>

          {/* CTA Buttons: Estilo profesional y sólido (firmes) */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded bg-white text-black font-body font-semibold text-sm sm:text-base border border-white transition-all duration-300 hover:bg-gold hover:border-gold hover:text-black shadow-lg hover:shadow-xl"
            >
              <Gift className="w-5 h-5" />
              Ver Colección Premium
            </Link>
            <a
              href="https://wa.me/51931489389?text=Hola,%20deseo%20contactar%20a%20un%20asesor%20para%20una%20sorpresa."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded bg-transparent text-white font-body font-medium text-sm sm:text-base border border-white/30 transition-all duration-300 hover:bg-white/10"
            >
              Contactar Asesor
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Degradado inferior para transición suave hacia la otra sección minimalista */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
