import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, MapPin, Music, Facebook, Instagram } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-12 sm:py-20 px-4 confetti-bg bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-2 sm:mb-3">
            Contáctanos
          </h2>
          <p className="font-body text-muted-foreground text-sm sm:text-lg px-2">
            Estamos listos para hacer tu sorpresa realidad
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          {/* Contact Info Compact */}
          <motion.div
            className="bg-white/80 backdrop-blur-xl border border-white/60 p-10 rounded-[2.5rem] shadow-xl space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground text-lg">Central de Pedidos</p>
                <div className="flex flex-wrap gap-x-4">
                  <a href="tel:+51931489389" className="font-body text-lg text-muted-foreground hover:text-primary transition-colors font-semibold">931 489 389</a>
                  <a href="tel:+51938573651" className="font-body text-lg text-muted-foreground hover:text-primary transition-colors font-semibold">938 573 651</a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Music className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground text-lg">Show en Vivo</p>
                <p className="font-body text-base text-muted-foreground">Matrimonios, Cumpleaños y eventos especiales en todo Ayacucho.</p>
              </div>
            </div>

            {/* Social Icons Compact */}
            <div className="flex justify-center gap-6 pt-6 border-t border-gray-100">
              {[
                { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/r/1ZjPxG3D27/" },
                { icon: Instagram, label: "Instagram", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-foreground hover:text-primary hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  aria-label={label}
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              ))}
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-foreground hover:text-primary hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                aria-label="TikTok"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.81.13v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.4a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.37a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.8z"/>
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-6 sm:pt-8 mt-6 sm:mt-8">
        <div className="container max-w-6xl mx-auto text-center">
          <p className="font-body text-muted-foreground text-xs sm:text-sm">
            © {new Date().getFullYear()} Mundo de Sorpresas Ayacucho. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
