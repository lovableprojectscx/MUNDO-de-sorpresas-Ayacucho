import React, { useState } from "react";
import { motion } from "framer-motion";
import { useProducts, Product, Category } from "@/store/useProducts";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, ArrowLeft, Image as ImageIcon, Sparkles, Tag, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Admin Page minimalista y premium
const AdminPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [hasOffer, setHasOffer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "ayacucho2026") {
      setIsAuthenticated(true);
      toast.success("Acceso concedido");
    } else {
      toast.error("Contraseña incorrecta");
    }
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
              src="/logo-mundo-sorpresas.png" 
              alt="Logo Mundo de Sorpresas" 
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
            />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Panel Administrativo</h1>
          <p className="text-white/60 mb-8">Ingresa la clave maestra para gestionar el catálogo</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white h-12 rounded-xl text-center text-lg tracking-widest"
              autoFocus
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen es muy pesada (mayor a 2MB). Por favor, comprímela antes de subirla.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Subiendo imagen a la nube...");
    
    // Limpiar nombre de archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      
      setFormData({ ...formData, image: data.publicUrl });
      toast.success("¡Imagen subida y enlazada correctamente!", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error("Error al subir imagen: " + error.message, { id: toastId });
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
        <Button onClick={openAddNew} className="gradient-cta text-accent-foreground shadow-cta rounded-full shadow-lg transform transition hover:scale-105">
          <Plus className="w-4 h-4 mr-2" /> Agregar Nueva Sorpresa
        </Button>
      </div>

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
      <div className="md:hidden max-w-6xl mx-auto space-y-4">
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
        {products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-xl px-4">
            No hay productos en el catálogo. ¡Agrega tu primera sorpresa!
          </div>
        )}
      </div>

      {/* Modal / Dialog Custom Minimalista (No usando Shadcn estricto para tener control total de la animación de panel lateral o modal flotante grueso) */}
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
