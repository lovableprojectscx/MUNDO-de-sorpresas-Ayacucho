import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Sparkles, PlaySquare, Camera, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Inicio", href: "#inicio", icon: Home },
  { name: "Servicios", href: "#servicios", icon: Sparkles },
  { name: "Videos", href: "#videos", icon: PlaySquare },
  { name: "Recuerdos", href: "#recuerdos", icon: Camera },
  { name: "Catálogo", href: "#catalogo", icon: ShoppingBag },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear scroll cuando el menu está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  // El menú móvil tiene fondo oscuro, pero el Hero ahora es luminoso (fondos claros)
  const isDarkContext = isOpen;
  const headerTextColor = isDarkContext ? "text-primary-foreground" : "text-foreground";
  const headerSubText = isDarkContext ? "text-primary-foreground/80" : "text-muted-foreground";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isOpen 
            ? "bg-transparent py-5" 
            : isScrolled 
              ? "bg-background/80 backdrop-blur-lg shadow-sm py-3 border-b border-border" 
              : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl flex items-center justify-between">
          <Link to="/" className="flex items-center relative z-50 group" onClick={() => setIsOpen(false)}>
            <img 
              src="/logo-mundo-sorpresas.png" 
              alt="Mundo de Sorpresas Ayacucho" 
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
              fetchPriority="high"
              decoding="async"
            />
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`font-body text-sm font-medium transition-colors hover:text-accent ${headerTextColor} hover:opacity-80`}
              >
                {link.name}
              </a>
            ))}
            <Link
              to="/catalogo"
              className={`px-6 py-2.5 rounded-full font-body text-sm font-bold transition-all duration-300 hover:scale-[1.03] ${
                isOpen
                  ? "bg-white/10 text-white border border-white/20 hover:bg-white/20" 
                  : "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90"
              }`}
            >
              Ver Catálogo
            </Link>
          </nav>

          {/* Toggle Menu Mobile */}
          <button
            className={`lg:hidden relative z-50 p-2 -mr-2 transition-colors ${headerTextColor}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      {/* Menu Overlay Mobile (Premium Dark Mode) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl flex flex-col justify-center px-8 lg:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-6 sm:gap-8 relative z-10 w-full max-w-sm mx-auto">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="group flex items-center gap-5 text-white/60 hover:text-white transition-colors"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/50 group-hover:text-gold transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-display text-4xl sm:text-5xl font-bold tracking-wide">
                      {link.name}
                    </span>
                  </motion.a>
                );
              })}
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 pt-8 border-t border-white/10"
              >
                <Link
                  to="/catalogo"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center gap-2 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-body text-lg font-bold shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:scale-105 transition-transform"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Ir al catálogo
                </Link>
              </motion.div>
            </div>
            
            {/* Elementos decorativos de fondo para el menú oscuro */}
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-20 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
