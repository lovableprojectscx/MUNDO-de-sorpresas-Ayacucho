import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Tag, Sparkles, Heart, ArrowLeft, Star, Cake, Gem, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts, Product, Category } from "@/store/useProducts";

const WHATSAPP_BASE = "https://wa.me/51931489389";

const categories: Category[] = ["Todo", "Para Parejas", "Cumpleaños", "Aniversarios", "Ofertas"];

const categoryIcons: Record<Category, React.ElementType> = {
  "Todo": Sparkles,
  "Para Parejas": Heart,
  "Cumpleaños": Cake,
  "Aniversarios": Gem,
  "Ofertas": Flame,
};

const CatalogPage = () => {
  const { products } = useProducts();
  const [active, setActive] = useState<Category>("Todo");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = active === "Todo" ? products : products.filter(p => p.category.includes(active));

  const getWhatsappLink = (name: string) =>
    `${WHATSAPP_BASE}?text=${encodeURIComponent(`Hola Mundo Sorpresas, quiero info sobre el producto: ${name}`)}`;

  const getStockColor = (stock: string) => {
    if (stock === "Disponible") return "text-accent";
    if (stock.includes("restantes") || stock.includes("Pocas")) return "text-secondary";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Epic Header - Clean & Immersive Version */}
      <div className="relative overflow-hidden flex flex-col items-center justify-center pt-20 pb-16 sm:pt-24 sm:pb-24 px-4 bg-zinc-950">
        {/* Background Image - High Impact & Visibility */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/portada-catalogo-ayacucho.png" 
            alt="Mundo de Sorpresas Ayacucho" 
            className="w-full h-full object-cover opacity-90"
            fetchPriority="high"
            decoding="sync"
          />
          {/* Overlay oscuro sutil (elimina la molesta niebla blanca de 'to-background') */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent" />
        </div>

        {/* Floating particles - subtle accent */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{ left: `${20 + i * 15}%`, top: `${30 + (i % 2) * 20}%` }}
            animate={{ y: [-15, 15, -15], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + i, repeat: Infinity }}
          />
        ))}

        {/* Content - Centered & Clean */}
        <div className="relative z-10 container max-w-4xl mx-auto text-center pt-2 sm:pt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 sm:mb-10 font-body transition-all group text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20 shadow-lg hover:-translate-y-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
            Volver a la tienda
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md border border-white/80 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/80 border border-white shadow-sm mb-3 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold" />
                <span className="text-[9px] sm:text-xs font-body text-slate-800 font-bold uppercase tracking-[0.2em]">Sorpresas para cada momento</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-2 sm:mb-6 drop-shadow-sm leading-tight">
                Regalos a Domicilio en <span className="text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">Ayacucho</span>
              </h1>
              <h2 className="font-body text-sm sm:text-lg md:text-xl text-slate-700 font-medium max-w-2xl mx-auto leading-snug sm:leading-relaxed px-2">
                Explora el catálogo exclusivo de ramos, chocolates y desayunos sorpresa. ¡Haz su día inolvidable!
              </h2>
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden flex items-end translate-y-[1px]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-[calc(100%+2px)] h-[40px] sm:h-[60px] md:h-[80px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,120.4,192.8,107.5,236.4,98.54,281.39,70.56,321.39,56.44Z" className="fill-background/90" />
          </svg>
        </div>
      </div>

      {/* Filters - Sticky */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border py-4 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat, i) => {
              const Icon = categoryIcons[cat];
              return (
              <motion.button
                key={cat}
                onClick={() => setActive(cat)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`px-5 py-2.5 rounded-full font-body font-medium text-sm flex items-center justify-center transition-all duration-300 ${
                  active === cat
                    ? "gradient-cta text-accent-foreground shadow-cta scale-105"
                    : "bg-muted text-muted-foreground hover:bg-accent/10 hover:scale-105 border border-border"
                }`}
              >
                <Icon className={`mr-2 w-4 h-4 ${active === cat ? "text-accent-foreground" : "text-muted-foreground"}`} />
                {cat}
              </motion.button>
            )})}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <motion.p
          className="text-center font-body text-muted-foreground mb-8"
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Mostrando <span className="font-semibold text-foreground">{filtered.length}</span> sorpresas
          {active !== "Todo" && <> en <span className="font-semibold text-accent">{active}</span></>}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group rounded-2xl bg-card shadow-card hover-lift overflow-hidden border border-border cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <motion.img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={800}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <span className="text-primary-foreground font-body text-sm font-medium flex items-center gap-1">
                      <Heart className="w-4 h-4" /> Ver detalle
                    </span>
                  </div>

                  {product.offerPrice && (
                    <motion.span
                      className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-body font-bold"
                      initial={{ rotate: -12 }}
                      animate={{ rotate: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Tag className="w-3 h-3" />
                      OFERTA
                    </motion.span>
                  )}

                  {/* Rating */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground/70 backdrop-blur-sm">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span className="text-xs font-body font-semibold text-primary-foreground">{product.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {product.offerPrice ? (
                        <>
                          <span className="font-body font-bold text-2xl text-accent">S/{product.offerPrice}</span>
                          <span className="font-body text-sm text-muted-foreground line-through">S/{product.price}</span>
                        </>
                      ) : (
                        <span className="font-body font-bold text-2xl text-foreground">S/{product.price}</span>
                      )}
                    </div>
                    <span className={`text-xs font-body font-semibold ${getStockColor(product.stock)}`}>
                      {product.stock}
                    </span>
                  </div>
                  <a
                    href={getWhatsappLink(product.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full gradient-cta text-accent-foreground font-body font-semibold text-sm shadow-cta hover:scale-105 transition-transform"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Pedir por WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative z-10 bg-card rounded-3xl shadow-card-hover overflow-hidden max-w-lg w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-72 object-cover"
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={800}
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/50 backdrop-blur-sm text-primary-foreground flex items-center justify-center hover:bg-foreground/70 transition-colors"
                >
                  ✕
                </button>
                {selectedProduct.offerPrice && (
                  <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-body font-bold text-sm flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    ¡OFERTA ESPECIAL!
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? "fill-gold text-gold" : "text-muted"}`}
                    />
                  ))}
                  <span className="text-sm font-body text-muted-foreground">({selectedProduct.rating})</span>
                </div>

                <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                  {selectedProduct.title}
                </h2>
                <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="flex items-center gap-3 mb-2">
                  {selectedProduct.offerPrice ? (
                    <>
                      <span className="font-body font-bold text-3xl text-accent">S/{selectedProduct.offerPrice}</span>
                      <span className="font-body text-lg text-muted-foreground line-through">S/{selectedProduct.price}</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-xs font-bold font-body">
                        -{Math.round((1 - selectedProduct.offerPrice / selectedProduct.price) * 100)}%
                      </span>
                    </>
                  ) : (
                    <span className="font-body font-bold text-3xl text-foreground">S/{selectedProduct.price}</span>
                  )}
                </div>
                <p className={`text-sm font-body font-semibold mb-6 ${getStockColor(selectedProduct.stock)}`}>
                  {selectedProduct.stock}
                </p>

                <a
                  href={getWhatsappLink(selectedProduct.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full gradient-cta text-accent-foreground font-body font-bold text-base shadow-cta hover:scale-105 transition-transform"
                >
                  <MessageCircle className="w-5 h-5" />
                  Pedir por WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatalogPage;
