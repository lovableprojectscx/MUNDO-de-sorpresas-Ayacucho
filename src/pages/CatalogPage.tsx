import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Tag, ArrowLeft, Star, X, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts, Product, Category } from "@/store/useProducts";
import OptimizedImage from "@/components/ui/OptimizedImage";

const WHATSAPP_BASE = "https://wa.me/51931489389";

const categories: Category[] = ["Todo", "Para Parejas", "Cumpleaños", "Aniversarios", "Ofertas"];

const CatalogPage = () => {
  const { products } = useProducts();
  const [active, setActive] = useState<Category>("Todo");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered =
    active === "Todo"
      ? products
      : active === "Ofertas"
      ? products.filter((p) => p.offerPrice !== undefined && p.offerPrice !== null)
      : products.filter((p) => {
          const cats: string[] = Array.isArray(p.category) ? p.category : [String(p.category)];
          return cats.includes(active);
        });

  const getWhatsappLink = (name: string) =>
    `${WHATSAPP_BASE}?text=${encodeURIComponent(`Hola Mundo Sorpresas, quiero info sobre: ${name}`)}`;

  const getStockLabel = (stock: string) => {
    if (stock === "Disponible") return { text: "Disponible", color: "text-emerald-600" };
    if (stock.includes("restantes") || stock.includes("Pocas"))
      return { text: stock, color: "text-amber-500" };
    return { text: stock, color: "text-muted-foreground" };
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="bg-[#fafaf9] border-b border-neutral-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          {/* Top row */}
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Inicio
            </Link>

            <h1 className="font-display text-base sm:text-lg font-semibold text-neutral-900 tracking-tight">
              Catálogo
            </h1>

            <span className="text-sm text-neutral-400 font-body tabular-nums">
              {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
            </span>
          </div>

          {/* ── MOBILE: Dropdown ──────────────────────── */}
          <div className="sm:hidden py-3" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm font-medium text-neutral-800 shadow-sm"
            >
              <span>{active}</span>
              <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-5 right-5 mt-1 bg-white border border-neutral-100 rounded-2xl shadow-xl z-30 overflow-hidden"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setActive(cat); setDropdownOpen(false); }}
                      className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors ${
                        active === cat
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── DESKTOP: Underline tabs ───────────────── */}
          <nav className="hidden sm:flex items-center gap-0 border-t border-neutral-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`relative flex-shrink-0 px-5 py-3 text-sm font-medium font-body transition-colors ${
                  active === cat ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                {cat}
                {active === cat && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── GRID ──────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
            {filtered.map((product, i) => {
              const stock = getStockLabel(product.stock);
              return (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300"
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-neutral-50">
                    <OptimizedImage
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      width={400}
                      height={400}
                    />

                    {/* Rating pill */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-semibold text-neutral-700">
                        {product.rating}
                      </span>
                    </div>

                    {/* Offer badge */}
                    {product.offerPrice && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-rose-500 text-white text-[10px] font-bold tracking-wide">
                        OFERTA
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-neutral-900 text-sm sm:text-base leading-snug line-clamp-2 mb-2 group-hover:text-purple-700 transition-colors">
                      {product.title}
                    </h3>

                    <div className="flex items-end justify-between gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-bold text-neutral-900">
                          S/{product.offerPrice ?? product.price}
                        </span>
                        {product.offerPrice && (
                          <span className="text-xs text-neutral-400 line-through">
                            S/{product.price}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>

                    <p className={`text-[11px] font-medium mt-1.5 ${stock.color}`}>
                      {stock.text}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-neutral-400 font-body text-base">
              No hay productos en esta categoría por el momento.
            </p>
          </motion.div>
        )}
      </main>

      {/* ── PRODUCT DETAIL MODAL ──────────────────────────── */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />

            {/* Panel */}
            <motion.div
              className="relative z-10 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md max-h-[90svh] overflow-y-auto"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors shadow-sm border border-neutral-100"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl sm:rounded-t-3xl bg-neutral-50">
                <OptimizedImage
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                  width={600}
                  height={500}
                  priority={true}
                />
                {selectedProduct.offerPrice && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 text-white text-xs font-bold shadow">
                    <Tag className="w-3.5 h-3.5" />
                    OFERTA ESPECIAL
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(selectedProduct.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-200 fill-neutral-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-neutral-400 ml-1">({selectedProduct.rating})</span>
                </div>

                <h2 className="font-display text-xl font-bold text-neutral-900 mb-2 leading-snug">
                  {selectedProduct.title}
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed mb-5">
                  {selectedProduct.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-2xl font-bold text-neutral-900">
                    S/{selectedProduct.offerPrice ?? selectedProduct.price}
                  </span>
                  {selectedProduct.offerPrice && (
                    <>
                      <span className="text-base text-neutral-400 line-through">
                        S/{selectedProduct.price}
                      </span>
                      <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                        -{Math.round((1 - selectedProduct.offerPrice / selectedProduct.price) * 100)}%
                      </span>
                    </>
                  )}
                </div>
                <p className={`text-xs font-medium mb-6 ${getStockLabel(selectedProduct.stock).color}`}>
                  {getStockLabel(selectedProduct.stock).text}
                </p>

                {/* CTA */}
                <a
                  href={getWhatsappLink(selectedProduct.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
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
