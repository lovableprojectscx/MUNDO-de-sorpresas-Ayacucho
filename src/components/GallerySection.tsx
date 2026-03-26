import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Video } from "lucide-react";

// URLs subidas directamente por el administrador (Ej. Facebook Reels Canonicos)
const videoLinks = [
  "https://www.facebook.com/reel/2194530564370954",
  "https://www.facebook.com/reel/1244201394526343",
  "https://www.facebook.com/reel/1537008384327102",
  "https://www.facebook.com/reel/1302401237472976",
  "https://www.facebook.com/reel/1119060673522826",
];

// Identificador y constructor universal de iframes embebidos
const getVideoData = (url: string) => {
  if (url.includes("tiktok.com")) {
    const match = url.match(/video\/(\d+)/);
    return match ? { platform: "TikTok", embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}?lang=es-ES` } : null;
  }
  if (url.includes("youtube.com/shorts")) {
    const match = url.match(/shorts\/([-_a-zA-Z0-9]+)/);
    return match ? { platform: "YouTube", embedUrl: `https://www.youtube.com/embed/${match[1]}?autoplay=0&loop=1` } : null;
  }
  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    // Al usar los links canónicos originales (/reel/), el reproductor de video de FB funciona perfecto
    return { platform: "Facebook", embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&appId=` };
  }
  if (url.includes("instagram.com/reel")) {
    return { platform: "Instagram", embedUrl: `${url}embed` };
  }
  return null;
};

// Componente individual ultra-optimizado
const OptimizedVideoCard = ({ url }: { url: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  // Solo se renderiza el iframe cuando está a punto de entrar a la pantalla (margen 300px)
  const isInView = useInView(ref, { once: true, margin: "300px" });
  const data = getVideoData(url);

  if (!data) return null;

  return (
    <div ref={ref} className="relative w-full aspect-[9/16] bg-black/95 group overflow-hidden flex items-center justify-center">
      {isInView ? (
        <iframe
          src={data.embedUrl}
          className="w-full h-full border-none absolute inset-0 z-10"
          allowFullScreen
          scrolling="no"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          title={`Video de ${data.platform}`}
        />
      ) : (
        <div className="animate-pulse w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
          <Play className="w-8 h-8 opacity-20" />
          <span className="text-xs font-body font-medium opacity-50">Cargando {data.platform}...</span>
        </div>
      )}
      <div className="absolute top-3 left-3 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
          <Video className="w-3 h-3"/> {data.platform}
        </span>
      </div>
    </div>
  );
};

const GallerySection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section id="videos" className="py-12 sm:py-20 bg-muted/50 overflow-hidden relative">
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 mb-3 sm:mb-4">
            <Play className="w-3.5 h-3.5 text-secondary fill-secondary" />
            <span className="text-xs sm:text-sm font-body text-secondary font-medium">Videos destacados</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-2 sm:mb-3">
            Galería de <span className="text-gradient">Sorpresas</span>
          </h2>
          <p className="font-body text-muted-foreground text-sm sm:text-lg px-2">
            Momentos que quedan guardados para siempre
          </p>
        </motion.div>
      </div>

      <div className="relative group/nav z-10">
        <button
          onClick={() => scroll("left")}
          className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm shadow-hover items-center justify-center text-foreground hover:bg-card hover:scale-110 transition-all opacity-0 group-hover/nav:opacity-100"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm shadow-hover items-center justify-center text-foreground hover:bg-card hover:scale-110 transition-all opacity-0 group-hover/nav:opacity-100"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 sm:px-8 md:px-12 pb-8 pt-4 no-scrollbar items-center"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {videoLinks.map((link, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 snap-center w-[280px] sm:w-[320px] rounded-2xl overflow-hidden shadow-card hover-lift bg-card border border-border"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <OptimizedVideoCard url={link} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
