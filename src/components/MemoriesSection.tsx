import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ZoomIn, X } from "lucide-react";

// Array de memorias optimizadas para SEO (Mundo de Sorpresas Ayacucho)
const memories = [
  { 
    id: 1, 
    src: "/recuerdos/sorpresas-ayacucho-entrega-especial.webp", 
    title: "Feliz 60 Cumpleaños!", 
    alt: "Entrega especial de cumpleaños número 60 en Ayacucho",
    span: "md:col-span-2 md:row-span-2" 
  },
  { 
    id: 2, 
    src: "/recuerdos/desayunos-sorpresa-ayacucho-cumpleanos.webp", 
    title: "Cumpleaños Feliz", 
    alt: "Desayunos sorpresa a domicilio para cumpleaños en Ayacucho",
    span: "md:col-span-1 md:row-span-1" 
  },
  { 
    id: 3, 
    src: "/recuerdos/mundo-de-sorpresas-ayacucho-arreglos-florales.webp", 
    title: "Detalle de Aniversario", 
    alt: "Mundo de Sorpresas Ayacucho: Arreglos florales exclusivos y detalles de aniversario",
    span: "md:col-span-1 md:row-span-1" 
  },
  { 
    id: 4, 
    src: "/recuerdos/detalles-romanticos-ayacucho.webp", 
    title: "Cumpleaños Especial", 
    alt: "Sorpresa de cumpleaños para adultos mayores en Ayacucho",
    span: "md:col-span-1 md:row-span-2" 
  },
  { 
    id: 5, 
    src: "/recuerdos/sorpresas-a-domicilio-ayacucho-peluches.webp", 
    title: "Entrega Sorpresa", 
    alt: "Peluches gigantes y sorpresas a domicilio en la ciudad de Ayacucho",
    span: "md:col-span-1 md:row-span-1" 
  },
  { 
    id: 6, 
    src: "/recuerdos/regalos-personalizados-ayacucho-aniversario.webp", 
    title: "Detalle Inolvidable", 
    alt: "Regalos personalizados y sorpresas de aniversario en Ayacucho",
    span: "md:col-span-1 md:row-span-1" 
  },
];

const MemoriesSection = () => {
  const [selectedImage, setSelectedImage] = useState<typeof memories[0] | null>(null);

  return (
    <section id="recuerdos" className="relative py-16 sm:py-24 px-4 bg-background z-10" style={{ clipPath: "polygon(0 0, 100% 4%, 100% 100%, 0 96%)", marginTop: "-4vh", paddingBottom: "8rem" }}>
      <div className="container max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-accent/10 border border-accent/20 mb-3 sm:mb-4">
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent fill-accent" />
            <span className="text-xs sm:text-sm font-body text-accent font-medium">Libro de Recuerdos</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-2 sm:mb-3">
            Entregas <span className="text-gradient">Inolvidables</span>
          </h2>
          <p className="font-body text-muted-foreground text-sm sm:text-lg px-2 max-w-2xl mx-auto">
            Sonrisas genuinas de clientes que confiaron en nosotros para sorprender a sus seres queridos.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-[140px] sm:auto-rows-[200px] md:auto-rows-[240px]">
          {memories.map((memory, i) => (
            <motion.div
              key={memory.id}
              className={`relative rounded-2xl overflow-hidden shadow-card hover-lift group cursor-pointer bg-muted ${memory.span}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedImage(memory)}
            >
              <img
                src={memory.src}
                alt={memory.alt || memory.title}
                title={memory.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                width={800}
                height={800}
              />
              
              {/* Overlay On Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
                <p className="text-white font-display font-bold text-lg sm:text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">
                  {memory.title}
                </p>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center border border-white/20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop oscuro con blur fuerte */}
            <div 
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setSelectedImage(null)}
            />
            
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-muted/20 border border-muted/30 text-foreground flex items-center justify-center hover:bg-muted/40 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              className="relative z-10 w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl bg-black border border-border flex flex-col items-center justify-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                className="w-auto h-auto max-w-full max-h-[85vh] object-contain"
              />
              <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-white font-display text-2xl font-bold text-center">
                  {selectedImage.title}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MemoriesSection;
