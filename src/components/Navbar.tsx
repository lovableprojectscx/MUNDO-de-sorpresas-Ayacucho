import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Sparkles, PlaySquare, Camera, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { name: "Inicio", href: "#inicio", icon: Home },
  { name: "Servicios", href: "#servicios", icon: Sparkles },
  { name: "Videos", href: "#videos", icon: PlaySquare },
  { name: "Recuerdos", href: "#recuerdos", icon: Camera },
  { name: "Catálogo", href: "/catalogo", icon: ShoppingBag, isLink: true },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit:   { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.25, ease: "easeOut" },
  }),
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsOpen(false);
      const el = document.querySelector(href);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-300 ${
          isScrolled && !isOpen
            ? "bg-background/90 backdrop-blur-md shadow-sm py-3 border-b border-border"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl flex items-center justify-between">
          <Link to="/" className="flex items-center relative z-[110] group" onClick={() => setIsOpen(false)}>
            <img
              src="/logo-mundo-sorpresas.webp"
              alt="Mundo de Sorpresas Ayacucho"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              fetchpriority="high"
              decoding="async"
              width={300}
              height={100}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isLink ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`font-body text-sm font-medium transition-colors hover:text-gold ${
                    isScrolled ? "text-foreground" : "text-white drop-shadow-md"
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`font-body text-sm font-medium transition-colors hover:text-gold ${
                    isScrolled ? "text-foreground" : "text-white drop-shadow-md"
                  }`}
                >
                  {link.name}
                </a>
              )
            ))}
            <Link
              to="/catalogo"
              className={`px-6 py-2.5 rounded font-body text-sm font-bold shadow-md transition-colors ${
                isScrolled
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Ver Catálogo
            </Link>
          </nav>

          <button
            className={`lg:hidden relative z-[120] p-2 -mr-2 outline-none transition-colors ${
              isOpen || !isScrolled ? "text-white drop-shadow-md" : "text-foreground"
            }`}
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-sm flex flex-col justify-center px-8 lg:hidden"
          >
            <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-sm mx-auto">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.name}
                    variants={itemVariants}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                  >
                    {link.isLink ? (
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-5 text-white/60 hover:text-white"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/50 group-hover:text-gold transition-colors duration-200">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-display text-4xl sm:text-5xl font-bold tracking-wide">
                          {link.name}
                        </span>
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={(e) => scrollToSection(e, link.href)}
                        className="group flex items-center gap-5 text-white/60 hover:text-white"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/50 group-hover:text-gold transition-colors duration-200">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-display text-4xl sm:text-5xl font-bold tracking-wide">
                          {link.name}
                        </span>
                      </a>
                    )}
                  </motion.div>
                );
              })}

              <motion.div
                variants={itemVariants}
                custom={navLinks.length}
                initial="hidden"
                animate="visible"
                className="mt-8 pt-8 border-t border-white/10"
              >
                <Link
                  to="/catalogo"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center gap-2 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-body text-lg font-bold hover:opacity-90 transition-opacity"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Ir al catálogo
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
