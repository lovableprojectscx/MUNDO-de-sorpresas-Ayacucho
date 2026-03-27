import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type Category = "Todo" | "Para Parejas" | "Cumpleaños" | "Aniversarios" | "Ofertas";

export interface Product {
  id: string; // uuid_now
  title: string;
  price: number;
  offerPrice?: number;
  category: Category[];
  stock: string;
  image: string;
  description: string;
  rating: number;
}

// Convertidor de Snake_case (DB) a CamelCase (Frontend)
const mapProductFromDB = (data: any): Product => {
  // INTECEPTOR DE OPTIMIZACIÓN LCP:
  // Si la BD devuelve un archivo pesado antiguo (.png/.jpg) local,
  // forzamos al frontend a solicitar la versión WebP optimizada.
  let optimizedImage = data.image;
  if (optimizedImage && optimizedImage.startsWith('/') && !optimizedImage.endsWith('.webp')) {
    optimizedImage = optimizedImage.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  }

  return {
    id: data.id,
    title: data.title,
    price: data.price,
    offerPrice: data.offer_price != null ? data.offer_price : undefined,
    category: data.category || [],
    stock: data.stock,
    image: optimizedImage,
    description: data.description || "",
    rating: data.rating,
  };
};

class ProductStore {
  private products: Product[] = [];
  private listeners: Set<() => void> = new Set();
  private isLoaded = false;

  constructor() {
    this.fetchProducts();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    // Si ya cargaron enviamos actualización inicial
    if (this.isLoaded) listener();
    return () => { 
      this.listeners.delete(listener); 
    };
  }

  getProducts() {
    return this.products;
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  // Cargar de BD
  async fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error cargando productos:", error);
      return;
    }

    if (data) {
      this.products = data.map(mapProductFromDB);
      this.isLoaded = true;
      this.emit();
    }
  }

  // Insertar a BD
  async addProduct(product: Omit<Product, "id">) {
    // Frontend prediction update
    const tempId = Date.now().toString();
    const tempProduct = { ...product, id: tempId };
    this.products = [tempProduct, ...this.products];
    this.emit();

    // Backend real update
    const { data, error } = await supabase
      .from('products')
      .insert([{
        title: product.title,
        price: product.price,
        offer_price: product.offerPrice || null,
        category: product.category,
        stock: product.stock,
        image: product.image,
        description: product.description,
        rating: product.rating || 5.0
      }])
      .select();

    if (!error && data) {
      // Reemplazamos ID temporal por real
      this.products = this.products.map(p => p.id === tempId ? mapProductFromDB(data[0]) : p);
      this.emit();
    } else {
      console.error(error);
      this.fetchProducts(); // rollback on error
    }
  }

  // Actualizar en BD
  async updateProduct(id: string, updatedFields: Partial<Product>) {
    // Prediction Update
    const oldProducts = [...this.products];
    this.products = this.products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    this.emit();

    // BD Mapper
    const payload: any = {};
    if (updatedFields.title !== undefined) payload.title = updatedFields.title;
    if (updatedFields.price !== undefined) payload.price = updatedFields.price;
    // IMPORTANTE: Usar 'in' en vez de '!== undefined'
    // para detectar cuando la oferta se desactiva (offerPrice === undefined)
    // y poder enviar offer_price: null a Supabase correctamente.
    if ('offerPrice' in updatedFields) payload.offer_price = updatedFields.offerPrice ?? null;
    if (updatedFields.category !== undefined) payload.category = updatedFields.category;
    if (updatedFields.stock !== undefined) payload.stock = updatedFields.stock;
    if (updatedFields.image !== undefined) payload.image = updatedFields.image;
    if (updatedFields.description !== undefined) payload.description = updatedFields.description;

    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id);

    if (error) {
       console.error(error);
       this.products = oldProducts;
       this.emit();
    }
  }

  // Eliminar en BD
  async deleteProduct(id: string) {
    // Prediction update
    const oldProducts = [...this.products];
    this.products = this.products.filter((p) => p.id !== id);
    this.emit();

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
       console.error(error);
       this.products = oldProducts;
       this.emit();
    }
  }
}

export const productStore = new ProductStore();

export const useProducts = () => {
  const [products, setProducts] = useState(productStore.getProducts());

  useEffect(() => {
    return productStore.subscribe(() => {
      setProducts(productStore.getProducts());
    });
  }, []);

  return {
    products,
    addProduct: (p: Omit<Product, "id">) => productStore.addProduct(p),
    updateProduct: (id: string, p: Partial<Product>) => productStore.updateProduct(id, p),
    deleteProduct: (id: string) => productStore.deleteProduct(id)
  };
};
