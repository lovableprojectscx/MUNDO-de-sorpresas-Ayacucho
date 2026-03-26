import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/store/useProducts";
import { MessageCircle } from "lucide-react";

const WHATSAPP_BASE = "https://wa.me/51931489389";

const CatalogPreview = () => {
  const { products } = useProducts();

  // Mostrar los primeros 3 productos de la BD, o nada si aún carga
  const previewProducts = products.slice(0, 3);

  return (
    <section id="catalogo" className="relative py-16 sm:py-24 px-4 bg-background z-10" style={{ clipPath: "polygon(0 4%, 100% 0, 100% 96%, 0 100%)", marginTop: "-6rem", paddingBottom: "6rem" }}>
      <div className="container max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-muted mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
            <span className="text-xs sm:text-sm font-body text-muted-foreground">Lo más pedido</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-2 sm:mb-3">
            Nuestras <span className="text-gradient">Sorpresas</span>
          </h2>
          <p className="font-body text-muted-foreground text-sm sm:text-lg px-2">
            Un adelanto de lo que tenemos para ti
          </p>
        </motion.div>

        {/* Preview cards - datos reales de Supabase */}
        {previewProducts.length === 0 ? (
          // Skeleton mientras carga
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl sm:rounded-2xl bg-muted animate-pulse overflow-hidden">
                <div className="w-full h-36 sm:h-48 bg-muted-foreground/10" />
                <div className="p-3 sm:p-4 space-y-2">
                  <div className="h-4 bg-muted-foreground/10 rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-muted-foreground/10 rounded w-1/2 mx-auto" />
                  <div className="h-8 bg-muted-foreground/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-10">
            {previewProducts.map((product, i) => (
              <motion.div
                key={product.id}
                className={`group rounded-xl sm:rounded-2xl bg-card shadow-card overflow-hidden hover-lift ${
                  i === 2 ? "col-span-2 sm:col-span-1" : ""
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-36 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    width={800}
                    height={800}
                    onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                  />
                  {product.offerPrice && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                      OFERTA
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <h3 className="font-display text-sm sm:text-lg font-bold text-foreground line-clamp-1">{product.title}</h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {product.offerPrice ? (
                      <>
                        <p className="font-body font-bold text-accent text-base sm:text-lg">S/{product.offerPrice}</p>
                        <p className="font-body text-muted-foreground text-sm line-through">S/{product.price}</p>
                      </>
                    ) : (
                      <p className="font-body font-bold text-accent text-base sm:text-lg">S/{product.price}</p>
                    )}
                  </div>
                  <a
                    href={`${WHATSAPP_BASE}?text=${encodeURIComponent(`¡Hola! Me interesa el producto: ${product.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-xl bg-primary/10 text-primary font-body font-bold text-xs sm:text-sm hover:bg-primary hover:text-white transition-all duration-300 border border-primary/20"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Pedir ahora
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA to full catalog */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-full gradient-cta text-accent-foreground font-body font-bold text-base sm:text-lg shadow-cta hover:scale-105 transition-transform"
          >
            Ver Todo el Catálogo
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CatalogPreview;
