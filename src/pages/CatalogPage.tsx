import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Tag, Sparkles, Heart, ArrowLeft, Star, Cake, Gem, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts, Product, Category } from "@/store/useProducts";
import OptimizedImage from "@/components/ui/OptimizedImage";

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

  const ObjectValuesToString = (categoryStr: any) => {
    if (!categoryStr) return "";
    return Array.isArray(categoryStr) ? categoryStr.join(",") : String(categoryStr);
  };

  const filtered = active === "Todo" 
    ? products 
    : products.filter(p => {
        const catStr = ObjectValuesToString(p.category);
        // Mostrar si pertenece a la categoría activa O si fue marcado como "Todo" (universal)
        return catStr.includes(active) || catStr.includes("Todo");
      });

  const getWhatsappLink = (name: string) =>
    `${WHATSAPP_BASE}?text=${encodeURIComponent(`Hola Mundo Sorpresas, quiero info sobre el producto: ${name}`)}`;

  const getStockColor = (stock: string) => {
    if (stock === "Disponible") return "text-accent";
    if (stock.includes("restantes") || stock.includes("Pocas")) return "text-secondary";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Ultra Minimalista y Elegante */}
      <div className="relative pt-6 pb-4 sm:pb-6 px-4 bg-background overflow-hidden">
        {/* Toques sutiles de color difuminado (Premium Aesthetic) */}
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-gold/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 container max-w-6xl mx-auto flex flex-col pt-2">
          {/* Botón Volver - Estilo Boutique */}
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground font-body transition-colors text-sm mb-6 sm:mb-8 w-fit group"
          >
            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center border border-border/50 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            Inicio
          </Link>

          {/* Título Directo y Conciso */}
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-gold hidden sm:block" />
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Catálogo <span className="text-primary italic">Exclusivo</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Filters - Sticky & Minimal */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border py-3 shadow-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 relative z-0">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-4 py-2 mt-1 rounded-full font-body font-medium text-sm flex items-center justify-center transition-all duration-200 ${
                    active === cat
                      ? "bg-foreground text-background shadow-md border-foreground"
                      : "bg-transparent text-muted-foreground hover:text-foreground border border-border hover:bg-muted/50"
                  }`}
                >
                  <Icon className={`mr-2 w-4 h-4 ${active === cat ? "text-gold" : "text-muted-foreground"}`} />
                  {cat}
                </button>
              );
            })}
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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
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
                <div className="relative overflow-hidden aspect-square sm:aspect-[4/3]">
                   <OptimizedImage
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    width={400}
                    height={400}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <span className="text-primary-foreground font-body text-sm font-medium flex items-center gap-1">
                      <Heart className="w-4 h-4" /> Ver detalle
                    </span>
                  </div>

                  {product.offerPrice && (
                    <motion.span
                      className="absolute top-2 right-2 flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-secondary/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-body font-bold shadow-sm"
                      initial={{ rotate: -12 }}
                      animate={{ rotate: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Tag className="w-3 h-3" />
                      OFERTA
                    </motion.span>
                  )}

                  {/* Rating */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-foreground/50 backdrop-blur-md shadow-sm border border-white/10">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span className="text-[10px] sm:text-xs font-body font-semibold text-white drop-shadow-sm">{product.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-display text-sm sm:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1 sm:line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2 hidden sm:block">
                      {product.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        {product.offerPrice ? (
                          <>
                            <span className="font-body font-bold text-lg sm:text-2xl text-accent leading-none">S/{product.offerPrice}</span>
                            <span className="font-body text-[10px] sm:text-sm text-muted-foreground line-through leading-none">S/{product.price}</span>
                          </>
                        ) : (
                          <span className="font-body font-bold text-lg sm:text-2xl text-foreground leading-none">S/{product.price}</span>
                        )}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-body font-semibold ${getStockColor(product.stock)}`}>
                        {product.stock}
                      </span>
                    </div>
                  </div>
                  <a
                    href={getWhatsappLink(product.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-full bg-primary/10 text-primary font-body font-bold text-xs sm:text-sm hover:bg-primary hover:text-white transition-all duration-300 border border-primary/20"
                  >
                    <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Pedir por WhatsApp</span>
                    <span className="sm:hidden">Pedir</span>
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
                <OptimizedImage
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-72 object-cover"
                  width={600}
                  height={600}
                  priority={true}
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
