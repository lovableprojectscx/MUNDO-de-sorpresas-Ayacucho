import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import detallesImg from "@/assets/detalles-regalo.png";
import { MessageCircle, Heart, Wand2 } from "lucide-react";

const WHATSAPP_BASE = "https://wa.me/51931489389";

const services = [
  {
    title: "Show de Ositos Tunanteros",
    description: "La tradición y la alegría se unen. Nuestro Osito Tunantero llega bailando para entregar tu regalo y crear un recuerdo verdaderamente inolvidable.",
    image: "/show-ositos-tunanteros-ayacucho.png",
    cta: "Quiero el Show",
    link: `${WHATSAPP_BASE}?text=${encodeURIComponent("Hola Mundo Sorpresas, quiero contratar el show del Osito Tunantero")}`,
    icon: Heart,
    bgGradient: "bg-gradient-to-t from-gold/20 via-gold/5 to-transparent",
  },
  {
    title: "Detalles que Enamoran",
    description: "Ramos buchon, box de rosas, chocolates y globos burbuja. Diseñamos regalos premium personalizados para robar más de un suspiro.",
    image: detallesImg,
    cta: "Explorar Catálogo",
    link: "/catalogo",
    icon: MessageCircle,
    bgGradient: "bg-gradient-to-t from-primary/20 via-primary/5 to-transparent",
  },
];

const ServicesSection = () => {
  return (
    <section 
      id="servicios"
      className="relative py-12 md:py-16 px-4 bg-background z-10"
    >
      <div className="container max-w-5xl mx-auto">
        {/* Encabezado Compacto */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm mb-4">
            <Wand2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-body font-bold uppercase tracking-widest text-foreground/70">Experiencias Inolvidables</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            Sorpresas a Domicilio en <span className="text-gradient">Ayacucho</span>
          </h2>
        </motion.div>

        {/* Cajas Compactas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="group relative rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(236,72,153,0.12)] transition-all duration-500 overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
            >
              {/* Contenedor de Imagen Compacto */}
              <div className={`relative h-56 lg:h-64 w-full flex items-end justify-center pt-6 px-6 ${service.bgGradient} overflow-hidden`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/60 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                
                <img
                  src={service.image}
                  alt={service.title}
                  className="relative z-10 w-auto h-[95%] object-contain object-bottom drop-shadow-[0_20px_20px_rgba(0,0,0,0.12)] transition-all duration-700 ease-out group-hover:scale-[1.05] origin-bottom"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Contenedor de Texto Compacto */}
              <div className="relative z-20 p-6 lg:p-8 flex flex-col flex-grow bg-white rounded-t-[2.5rem] -mt-8 border-t border-white/40 shadow-[0_-10px_15px_-10px_rgba(0,0,0,0.03)]">
                <h3 className="font-display text-xl lg:text-2xl font-black text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="font-body text-sm lg:text-base text-muted-foreground mb-6 leading-relaxed flex-grow">
                  {service.description}
                </p>
                
                <div>
                  {service.link.startsWith("http") ? (
                    <a
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-body font-bold text-sm hover:bg-gold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group/btn"
                    >
                      {service.cta}
                      <service.icon className="w-4 h-4 group-hover/btn:scale-110 group-hover/btn:-rotate-12 transition-transform" />
                    </a>
                  ) : (
                    <Link
                      to={service.link}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-body font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 duration-300 group/btn"
                    >
                      {service.cta}
                      <service.icon className="w-4 h-4 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
