import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useProducts, Product, Category } from "@/store/useProducts";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, ArrowLeft, Image as ImageIcon, Sparkles, Tag, Upload, CalendarDays, Phone, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw, Package, LayoutList } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TENANT_ID = import.meta.env.VITE_TENANT_ID;

type ReservationStatus = "pendiente" | "confirmado" | "cancelado";

interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time_slot: string;
  message: string | null;
  status: ReservationStatus;
  created_at: string;
}

const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pendiente:  { label: "Pendiente",  color: "bg-amber-100 text-amber-700 border-amber-200",   icon: AlertCircle },
  confirmado: { label: "Confirmado", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  cancelado:  { label: "Cancelado",  color: "bg-rose-100 text-rose-700 border-rose-200",      icon: XCircle },
};

// Formatea fecha ISO a formato legible
const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

// Admin Page minimalista y premium
const AdminPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [hasOffer, setHasOffer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "reservations">("reservations");

  // --- Reservas ---
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("pendiente");

  const fetchReservations = useCallback(async () => {
    setReservationsLoading(true);
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("tenant_id", TENANT_ID)
      .order("date", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Error al cargar reservas.");
    } else {
      setReservations((data as Reservation[]) || []);
    }
    setReservationsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchReservations();
  }, [isAuthenticated, fetchReservations]);

  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    const { error } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("No se pudo actualizar el estado.");
    } else {
      setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      toast.success(`Reserva marcada como "${STATUS_CONFIG[status].label}"`);
    }
  };

  const deleteReservation = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reserva permanentemente?")) return;

    const { error } = await supabase
      .from("reservations")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("No se pudo eliminar la reserva.");
    } else {
      setReservations((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reserva eliminada permanentemente.");
    }
  };

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    price: 0,
    offerPrice: undefined,
    category: ["Todo"],
    stock: "Disponible",
    image: "",
    description: "",
    rating: 5,
  });

  const categories: Category[] = ["Todo", "Para Parejas", "Cumpleaños", "Aniversarios", "Ofertas"];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor ingresa tu correo y contraseña");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      toast.error("Credenciales incorrectas: " + error.message);
      return;
    }
    
    setIsAuthenticated(true);
    toast.success("Acceso concedido");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl text-center"
        >
          <div className="flex justify-center mb-6">
            <img 
              src="/logo-mundo-sorpresas.webp" 
              alt="Logo Mundo de Sorpresas" 
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
            />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Panel Administrativo</h1>
          <p className="text-white/60 mb-8">Ingresa tus credenciales de Mype para gestionar el catálogo</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white h-12 rounded-xl text-center text-base"
              autoFocus
            />
            <Input 
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white h-12 rounded-xl text-center text-lg tracking-widest"
            />
            <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] transition-transform">
              Entrar al Sistema
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  const openAddNew = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      price: 0,
      offerPrice: undefined,
      category: ["Todo"],
      stock: "Disponible",
      image: "",
      description: "",
      rating: 5,
    });
    setHasOffer(false);
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setHasOffer(!!product.offerPrice);
    setIsModalOpen(true);
  };

  // Convierte cualquier imagen (HEIC, JPG, PNG, etc.) a WebP usando Canvas API del navegador
  const convertToWebP = (file: File, maxPx = 800, quality = 0.82): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        // Calcular dimensiones respetando aspect ratio
        let { width, height } = img;
        if (width > maxPx || height > maxPx) {
          if (width > height) {
            height = Math.round((height / width) * maxPx);
            width = maxPx;
          } else {
            width = Math.round((width / height) * maxPx);
            height = maxPx;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas no disponible')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error('Error al convertir imagen'));
        }, 'image/webp', quality);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo cargar la imagen')); };
      img.src = url;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const originalKB = Math.round(file.size / 1024);
    const toastId = toast.loading(`Convirtiendo imagen a WebP (${originalKB}KB)...`);

    try {
      // Convertir a WebP automáticamente (funciona con HEIC, JPG, PNG, AVIF, etc.)
      const webpBlob = await convertToWebP(file, 800, 0.82);
      const convertedKB = Math.round(webpBlob.size / 1024);
      const saving = Math.round((1 - webpBlob.size / file.size) * 100);

      toast.loading(`Subiendo imagen optimizada (${convertedKB}KB, −${saving}%)...`, { id: toastId });

      // Nombre de archivo siempre con extensión .webp
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, webpBlob, { contentType: 'image/webp' });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      
      setFormData({ ...formData, image: data.publicUrl });
      toast.success(`✅ Imagen subida: ${originalKB}KB → ${convertedKB}KB (−${saving}% más ligera)`, { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error("Error al procesar imagen: " + error.message, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string | number) => {
    if (confirm("¿Estás segura de que deseas eliminar este producto?")) {
      deleteProduct(String(id));
      toast.success("Producto eliminado exitosamente.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.image) {
      toast.error("Por favor completa los campos obligatorios (título, precio, imagen).");
      return;
    }

    // Construir payload con offerPrice siempre incluido como key
    // Si no hay oferta, se envía undefined para que el store lo detecte y ponga null en supabase
    const payload = {
      ...formData,
      offerPrice: hasOffer ? (formData.offerPrice ?? undefined) : undefined,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      toast.success("Producto actualizado correctamente.");
    } else {
      addProduct(payload as Omit<Product, "id">);
      toast.success("¡Nuevo producto agregado al catálogo!");
    }
    setIsModalOpen(false);
  };

  const toggleCategory = (cat: Category) => {
    const currentCats = formData.category || [];
    if (currentCats.includes(cat)) {
      setFormData({ ...formData, category: currentCats.filter((c) => c !== cat) });
    } else {
      setFormData({ ...formData, category: [...currentCats, cat] });
    }
  };

  // Reservas filtradas
  const filteredReservations = statusFilter === "all"
    ? reservations
    : reservations.filter((r) => r.status === statusFilter);

  const countByStatus = (s: ReservationStatus) => reservations.filter((r) => r.status === s).length;

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8 font-body">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver a la Tienda
          </Link>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            Panel de Administración
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Gestiona tus sorpresas, ofertas y catálogo desde aquí.</p>
        </div>
        {activeTab === "products" && (
          <Button onClick={openAddNew} className="gradient-cta text-accent-foreground shadow-cta rounded-full shadow-lg transform transition hover:scale-105">
            <Plus className="w-4 h-4 mr-2" /> Agregar Nueva Sorpresa
          </Button>
        )}
        {activeTab === "reservations" && (
          <Button variant="outline" onClick={fetchReservations} className="rounded-full gap-2">
            <RefreshCw className="w-4 h-4" /> Actualizar
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="inline-flex bg-card border border-border rounded-full p-1 gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab("reservations")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-body font-semibold text-sm transition-all ${
              activeTab === "reservations"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Reservas
            {countByStatus("pendiente") > 0 && (
              <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                {countByStatus("pendiente")}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-body font-semibold text-sm transition-all ${
              activeTab === "products"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="w-4 h-4" />
            Catálogo
          </button>
        </div>
      </div>

      {/* ========== PANEL RESERVAS ========== */}
      {activeTab === "reservations" && (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Tarjetas resumen */}
          <div className="grid grid-cols-3 gap-4">
            {(["pendiente", "confirmado", "cancelado"] as ReservationStatus[]).map((s) => {
              const cfg = STATUS_CONFIG[s];
              const Icon = cfg.icon;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
                  className={`flex flex-col items-center gap-1 p-4 rounded-2xl border text-center transition-all hover:scale-[1.02] ${
                    statusFilter === s ? cfg.color + " shadow-sm" : "bg-card border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-bold text-2xl">{countByStatus(s)}</span>
                  <span className="font-body text-xs font-semibold">{cfg.label}</span>
                </button>
              );
            })}
          </div>

          {/* Lista de reservas */}
          {reservationsLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground font-body bg-card border border-border rounded-2xl">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No hay reservas {statusFilter !== "all" ? `con estado "${STATUS_CONFIG[statusFilter as ReservationStatus].label}"` : ""}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReservations.map((r) => {
                const cfg = STATUS_CONFIG[r.status];
                const StatusIcon = cfg.icon;
                return (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm"
                  >
                    {/* Cabecera */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-foreground font-body text-base leading-tight">{r.name}</p>
                        <p className="text-xs text-muted-foreground font-body mt-0.5">Reservado el {formatDate(r.created_at.split('T')[0])}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold font-body flex-shrink-0 ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteReservation(r.id)}
                          className="w-8 h-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                          title="Eliminar reserva"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-sm font-body">
                      <div className="flex items-center gap-2 text-foreground">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a href={`tel:+51${r.phone}`} className="hover:text-primary transition-colors">
                          +51 {r.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span>{formatDate(r.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span>{r.time_slot}</span>
                      </div>
                      {r.message && (
                        <div className="mt-2 flex gap-2 bg-muted/50 rounded-xl px-3 py-2 border border-border/60">
                          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {r.message}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    {r.status === "pendiente" && (
                      <div className="flex gap-2 pt-2 border-t border-border/40">
                        <Button
                          size="sm"
                          className="flex-1 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1"
                          onClick={() => updateReservationStatus(r.id, "confirmado")}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-9 rounded-full text-destructive border-destructive/30 hover:bg-destructive/10 text-xs font-semibold gap-1"
                          onClick={() => updateReservationStatus(r.id, "cancelado")}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancelar
                        </Button>
                      </div>
                    )}
                    {r.status === "confirmado" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 rounded-full text-destructive border-destructive/30 hover:bg-destructive/10 text-xs font-semibold gap-1"
                        onClick={() => updateReservationStatus(r.id, "cancelado")}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Marcar como Cancelado
                      </Button>
                    )}
                    {r.status === "cancelado" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 rounded-full text-amber-600 border-amber-300 hover:bg-amber-50 text-xs font-semibold gap-1"
                        onClick={() => updateReservationStatus(r.id, "pendiente")}
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> Restablecer
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========== PANEL CATÁLOGO ========== */}
      {activeTab === "products" && (
      <>
      {/* Vista Desktop (Tabla) */}
      <div className="hidden md:block max-w-6xl mx-auto bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase font-semibold text-xs border-b border-border">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Oferta</th>
                <th className="px-6 py-4">Estado/Stock</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover border border-border shadow-sm" />
                    <div>
                      <p className="font-bold text-foreground text-base">{product.title}</p>
                      <p className="text-xs text-muted-foreground truncate w-48">{product.category.join(", ")}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">S/ {product.price}</td>
                  <td className="px-6 py-4">
                    {product.offerPrice ? (
                      <span className="inline-flex items-center gap-1 bg-secondary/20 text-secondary px-2 py-1 rounded-md text-xs font-bold font-body">
                        <Tag className="w-3 h-3" /> S/ {product.offerPrice}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock.includes("Disponible") ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(product)} className="text-primary hover:text-primary hover:bg-primary/10 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    No hay productos en el catálogo. ¡Agrega tu primera sorpresa!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Mobile (Tarjetas Táctiles) */}
      <div className="md:hidden max-w-6xl mx-auto space-y-4 mt-4">
        {products.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-4 shadow-sm relative overflow-hidden">
            <div className="flex items-start gap-4">
               <img src={product.image} alt={product.title} className="w-20 h-20 rounded-xl object-cover border border-border shadow-sm" />
               <div className="flex-1 min-w-0">
                 <p className="font-bold text-foreground text-[15px] leading-tight mb-1">{product.title}</p>
                 <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider mb-2">{product.category.join(", ")}</p>
                 <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${product.stock.includes("Disponible") ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                    {product.stock}
                 </span>
               </div>
            </div>
            
            <div className="flex justify-between items-center bg-muted/40 p-3 rounded-lg border border-border/60">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Precio</span>
                <span className="font-bold text-foreground text-sm">S/ {product.price}</span>
              </div>
              
              {product.offerPrice && (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-secondary uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1"><Tag className="w-3 h-3"/> Oferta</span>
                  <span className="font-bold text-secondary text-base">S/ {product.offerPrice}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-2 border-t border-border/40 mt-1">
              <Button variant="outline" size="sm" onClick={() => openEdit(product)} className="flex-1 text-primary border-primary/20 hover:bg-primary/10 h-9 font-semibold text-xs">
                <Pencil className="w-3.5 h-3.5 mr-2" /> Editar
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)} className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/10 h-9 font-semibold text-xs">
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
      </>
      )}

      {/* Modal productos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end md:justify-center bg-background/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full h-full md:h-auto md:max-w-2xl md:rounded-3xl border md:border-border shadow-2xl flex flex-col md:max-h-[90vh] animate-in slide-in-from-right md:slide-in-from-bottom duration-300">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-display font-bold text-foreground">
                {editingProduct ? "Editar Sorpresa" : "Nueva Sorpresa"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-primary-foreground transition-all">
                ✕
              </button>
            </div>
            {/* Body Modal */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                {/* Image Input Virtual */}
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-muted-foreground"/>
                      URL de la Foto del Producto
                    </label>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      Recomendado: 800x800 px | Peso Max: ~300kb (JPG/WebP)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://ejemplo.com/o-sube-tu-foto.jpg"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="border-border bg-muted/50 focus-visible:ring-accent flex-1"
                      required
                    />
                    <div className="relative inline-block h-10">
                      <Button
                        type="button"
                        variant="default"
                        className={`h-full cursor-pointer px-4 ${isUploading ? 'opacity-70' : ''}`}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <span className="animate-pulse">Subiendo...</span>
                        ) : (
                          <><Upload className="w-4 h-4 mr-2" /> Subir Foto</>
                        )}
                      </Button>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Subir desde mi computadora"
                      />
                    </div>
                  </div>
                  {formData.image && (
                    <div className="mt-2 rounded-xl overflow-hidden h-40 border border-border w-full flex items-center justify-center bg-black/5 relative group">
                       <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Preview+No+Disponible')} />
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <p className="text-white text-sm font-bold">Vista Previa</p>
                       </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Título del Producto</label>
                    <Input
                      placeholder="Ej. Ramo de Girasoles"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Estado (Stock)</label>
                    <Input
                      placeholder="Ej. Disponible, Solo 2 restantes"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Precio Regular (S/)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.10"
                      placeholder="Ej. 120"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className={`space-y-2 p-3 rounded-xl border relative transition-all duration-300 ${hasOffer ? 'bg-secondary/10 border-secondary/20' : 'bg-muted/30 border-transparent opacity-80'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`text-sm font-bold flex items-center gap-1 ${hasOffer ? 'text-secondary' : 'text-muted-foreground'}`}>
                        <Tag className="w-4 h-4"/> Precio de OFERTA
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setHasOffer(!hasOffer);
                          if(hasOffer) setFormData({...formData, offerPrice: undefined});
                        }}
                        className={`w-10 h-5 rounded-full relative transition-colors ${hasOffer ? 'bg-secondary' : 'bg-muted-foreground/30'}`}
                      >
                         <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${hasOffer ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                    {hasOffer ? (
                      <Input
                        type="number"
                        min="0"
                        step="0.10"
                        placeholder="Ej. 85.00"
                        value={formData.offerPrice || ""}
                        onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value ? Number(e.target.value) : undefined })}
                        className="border-secondary/30 bg-background transition-all"
                        required
                        autoFocus
                      />
                    ) : (
                      <div className="text-xs text-muted-foreground py-2 text-center border border-dashed rounded bg-background/50">
                        Oferta Desactivada
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Descripción detallada</label>
                  <Textarea
                    placeholder="Describe los detalles de esta sorpresa..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Categorías (Múltiple)</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          formData.category?.includes(cat)
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-background text-muted-foreground border-border hover:border-accent"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            {/* Footer Modal */}
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-full">
                Cancelar
              </Button>
              <Button type="submit" form="productForm" className="gradient-cta text-accent-foreground shadow-cta rounded-full px-8">
                {editingProduct ? "Guardar Cambios" : "Crear Producto"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
