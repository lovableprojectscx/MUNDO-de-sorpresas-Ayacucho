import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Phone, User, MessageSquare, Clock, CheckCircle2, Heart, PhoneCall, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  "09:00 am - 10:00 am",
  "10:00 am - 11:00 am",
  "11:00 am - 12:00 pm",
  "03:00 pm - 04:00 pm",
  "04:00 pm - 05:00 pm",
  "05:00 pm - 06:00 pm",
  "06:00 pm - 07:00 pm",
  "07:00 pm - 08:00 pm",
];

const TENANT_ID = import.meta.env.VITE_TENANT_ID;
const WHATSAPP_URL = "https://wa.me/51931489389?text=Hola%20Mundo%20de%20Sorpresas%2C%20quisiera%20reservar%20el%20Show%20del%20Osito%20Tunantero.";

const ReservationModal = ({ isOpen, onClose }: ReservationModalProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time_slot: "",
    message: "",
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time_slot) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("reservations").insert([
        {
          tenant_id: TENANT_ID,
          name: form.name.trim(),
          phone: form.phone.trim(),
          date: form.date,
          time_slot: form.time_slot,
          message: form.message.trim() || null,
          status: "pendiente",
        },
      ]);

      if (error) throw error;
      setStep("success");
    } catch (err: any) {
      console.error(err);
      toast.error("Ocurrió un error al enviar tu reserva. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep("form");
      setForm({ name: "", phone: "", date: "", time_slot: "", message: "" });
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-[500px] z-[210]"
          >
            <div className="bg-white rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden max-h-[92svh] sm:max-h-[90vh] flex flex-col border border-white/20">
                <div className="relative bg-gradient-to-br from-[hsl(280,60%,45%)] via-[hsl(310,60%,50%)] to-[hsl(330,70%,55%)] px-6 sm:px-8 pt-6 sm:pt-8 pb-7 sm:pb-9 text-white flex-shrink-0">
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs font-body font-medium uppercase tracking-widest">
                      Agenda tu sorpresa
                    </p>
                    <h2 className="font-display text-lg sm:text-2xl font-bold leading-tight">
                      Show del Osito Tunantero
                    </h2>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 px-5 sm:px-8 py-4 sm:py-6">
                <AnimatePresence mode="wait">
                  {step === "form" ? (
                    <div className="space-y-5">
                      <div className="bg-gradient-to-r from-[#25D366]/10 to-primary/5 rounded-xl p-3 sm:p-4 border border-[#25D366]/20 relative overflow-hidden group">
                        <div className="relative z-10 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20 flex-shrink-0">
                              <MessageSquare className="w-4 h-4 fill-current" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-bold text-foreground truncate">Atención por WhatsApp</p>
                              <p className="text-[10px] text-muted-foreground leading-tight">
                                <span className="text-[#25D366] font-bold">6am - 9pm</span>
                              </p>
                            </div>
                          </div>
                          <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-full bg-[#25D366] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#20ba59] transition-all shadow-md active:scale-95 whitespace-nowrap"
                          >
                            Escríbenos YA
                          </a>
                        </div>
                      </div>

                      <div className="relative py-1">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                          <span className="bg-white px-3 text-muted-foreground font-medium tracking-widest">O reserva aquí</span>
                        </div>
                      </div>

                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                      >
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground font-body">
                          <User className="w-4 h-4 text-primary" />
                          Nombre completo <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. María García"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                          className="w-full h-10 px-4 rounded-xl border border-border bg-muted/40 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground font-body">
                          <Phone className="w-4 h-4 text-primary" />
                          Número de celular <span className="text-destructive">*</span>
                        </label>
                        <div className="flex gap-2">
                          <span className="flex items-center px-4 h-10 rounded-xl border border-border bg-muted/60 text-muted-foreground text-sm font-body font-semibold">
                            +51
                          </span>
                          <input
                            type="tel"
                            placeholder="987 654 321"
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            maxLength={9}
                            required
                            className="flex-1 h-10 px-4 rounded-xl border border-border bg-muted/40 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground font-body">
                            <CalendarDays className="w-3.5 h-3.5 text-primary" />
                            Fecha <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="date"
                            min={minDate}
                            value={form.date}
                            onChange={(e) => handleChange("date", e.target.value)}
                            required
                            className="w-full h-10 px-3 rounded-xl border border-border bg-muted/40 font-body text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground font-body">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            Turno <span className="text-destructive">*</span>
                          </label>
                          <select
                            value={form.time_slot}
                            onChange={(e) => handleChange("time_slot", e.target.value)}
                            required
                            className="w-full h-10 px-3 rounded-xl border border-border bg-muted/40 font-body text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition appearance-none"
                          >
                            <option value="">Elegir</option>
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground font-body">
                          <MessageSquare className="w-4 h-4 text-primary" />
                          Mensaje adicional
                        </label>
                        <textarea
                          placeholder="¿Tienes alguna indicación especial?"
                          value={form.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-muted/40 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-none"
                        />
                      </div>

                      <div className="flex items-start gap-2.5 bg-muted/50 rounded-xl px-4 py-3 border border-border/60">
                        <PhoneCall className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-muted-foreground font-body leading-snug">
                          Confirmaremos disponibilidad por teléfono.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-full bg-gradient-to-r from-[hsl(280,60%,45%)] to-[hsl(330,70%,55%)] text-white font-body font-bold text-base shadow-lg hover:shadow-xl hover:opacity-95 transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <CalendarDays className="w-5 h-5" />
                            Confirmar Reserva
                          </>
                        )}
                      </button>
                      </motion.form>
                    </div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center py-8 gap-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 rounded-3xl bg-accent/10 flex items-center justify-center text-accent"
                      >
                        <Sparkles className="w-12 h-12" />
                      </motion.div>
                      <CheckCircle2 className="w-12 h-12 text-accent -mt-4 bg-white rounded-full p-1 border-4 border-white shadow-sm" />
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        ¡Reserva enviada!
                      </h3>
                      <p className="font-body text-muted-foreground text-sm max-w-xs leading-relaxed">
                        Hemos recibido tu solicitud para el <strong>{formatDate(form.date)}</strong>. Pronto nos comunicaremos al <strong>+51 {form.phone}</strong>.
                      </p>
                      <button
                        onClick={handleClose}
                        className="mt-2 px-8 py-3 rounded-full bg-foreground text-background font-body font-bold text-sm"
                      >
                        Cerrar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReservationModal;
