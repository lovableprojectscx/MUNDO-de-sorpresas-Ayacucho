import { lazy, Suspense, useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

// Lazy load below-the-fold components para reducir el Main JS Bundle Size
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const GallerySection = lazy(() => import("@/components/GallerySection"));
const CatalogPreview = lazy(() => import("@/components/CatalogPreview"));
const MemoriesSection = lazy(() => import("@/components/MemoriesSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

const Index = () => {
  // SPA Performance Hack: Retrasamos el montaje del 80% de la web 
  // hasta DESPUÉS del primer render. Esto garantiza que el navegador 
  // dedique el 100% del CPU/Red inicial a dibujar el Hero (LCP) y Navbar.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Se ejecuta inmediatamente después de que React dibuja el DOM por 1ra vez
    setIsMounted(true);
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      {/* El contenido secundario solo se descubre en el Render 2 */}
      {isMounted && (
        <Suspense fallback={<div className="h-[30vh] flex flex-col items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"/><p className="text-muted-foreground font-body text-sm animate-pulse">Cargando magia...</p></div>}>
          <ServicesSection />
          <GallerySection />
          <MemoriesSection />
          <CatalogPreview />
          <ContactSection />
        </Suspense>
      )}
    </main>
  );
};

export default Index;
