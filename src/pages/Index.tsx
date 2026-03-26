import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import CatalogPreview from "@/components/CatalogPreview";
import MemoriesSection from "@/components/MemoriesSection";
import ContactSection from "@/components/ContactSection";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <GallerySection />
      <MemoriesSection />
      <CatalogPreview />
      <ContactSection />
    </main>
  );
};

export default Index;
