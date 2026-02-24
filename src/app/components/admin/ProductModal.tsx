import { useState, useEffect, useRef } from "react";
import { X, Save, Package, Image as ImageIcon, Tag, Hash, DollarSign, Layers, Eye, EyeOff, Upload, Loader2 } from "lucide-react";
import { Product, categories } from "../data";
import { apiFetch } from "../../utils/api";
import { toast } from "sonner";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id"> | Product) => void;
  product?: Product | null;
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    sku: "",
    price: 0,
    category: "all",
    stock: 0,
    brand: "",
    unit: "unidad",
    description: "",
    image: "https://placehold.co/400x400?text=Suministro",
    tags: [],
    deliveryDays: 1,
    stockStatus: "in-stock",
    isActive: true
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: "",
        sku: "",
        price: 0,
        category: categories[0]?.id || "oficina",
        stock: 0,
        brand: "",
        unit: "unidad",
        description: "",
        image: "https://placehold.co/400x400?text=Suministro",
        tags: [],
        deliveryDays: 1,
        stockStatus: "in-stock",
        isActive: true
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      setIsUploading(true);
      const res = await apiFetch('/products/admin/upload', {
        method: 'POST',
        body: formDataUpload
      });
      
      const fullImageUrl = `http://localhost:3001${res.imageUrl}`;
      setFormData({ ...formData, image: fullImageUrl });
      toast.success("Imagen subida con éxito");
    } catch (error: any) {
      toast.error("Error al subir imagen: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-[#f8f9fb]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0a4d8c] text-white rounded-xl shadow-lg shadow-blue-500/20">
               <Package className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {product ? "Editar Producto" : "Nuevo Producto"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Info */}
            <div className="order-2 md:order-1 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-foreground flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#0a4d8c]" /> Nombre
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-[#0a4d8c]" /> SKU
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    className="w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#0a4d8c]" /> Categoría
                  </label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value })}
                    className="w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-[#0a4d8c]" /> Precio (S/)
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-[#0a4d8c]" /> Stock
                  </label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                    className="w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Media & Others */}
            <div className="order-1 md:order-2 space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-foreground flex items-center justify-between">
                    <div className="flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5 text-[#0a4d8c]" /> Imagen del Producto</div>
                    {isUploading && <Loader2 className="w-3 h-3 animate-spin text-[#0a4d8c]" />}
                  </label>
                  
                  <div className="relative group aspect-video rounded-2xl bg-[#f8f9fb] border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all hover:border-[#0a4d8c]/30">
                     {formData.image && formData.image !== 'https://placehold.co/400x400?text=Suministro' ? (
                        <img src={formData.image} className="w-full h-full object-contain" alt="Preview" />
                     ) : (
                        <div className="text-center p-4">
                           <ImageIcon className="w-8 h-8 text-muted-foreground opacity-30 mx-auto mb-2" />
                           <p className="text-[11px] text-muted-foreground">Sube una imagen o usa una URL</p>
                        </div>
                     )}
                     
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                           type="button" 
                           onClick={() => fileInputRef.current?.click()}
                           className="bg-white text-foreground p-2 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center gap-2 text-[12px] font-bold"
                        >
                           <Upload className="w-3.5 h-3.5" /> Subir
                        </button>
                     </div>
                  </div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <input 
                    type="url" 
                    placeholder="O pega una URL de imagen..."
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-2 text-[12px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all mt-2"
                  />
               </div>

               <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-foreground">Marca</label>
                  <input 
                    type="text" 
                    value={formData.brand}
                    onChange={e => setFormData({...formData, brand: e.target.value})}
                    className="w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all"
                    placeholder="Ej. Faber-Castell"
                  />
               </div>

               <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      formData.isActive !== false 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                        : "bg-slate-50 border-slate-100 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${formData.isActive !== false ? "bg-emerald-500" : "bg-slate-400"} text-white`}>
                        {formData.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-[13px]">Estado del Producto</p>
                        <p className="text-[11px] opacity-80">{formData.isActive !== false ? "Visible en la tienda" : "Oculto para clientes"}</p>
                      </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.isActive !== false ? "bg-emerald-500" : "bg-slate-300"}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive !== false ? "left-5" : "left-1"}`} />
                    </div>
                  </button>
               </div>
            </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-[13px] font-bold text-foreground">Descripción</label>
             <textarea 
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
               className="w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-3 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all min-h-[100px] resize-none"
               placeholder="Detalles del suministro..."
             ></textarea>
          </div>
        </form>

        <div className="px-8 py-5 border-t border-border bg-[#f8f9fb] flex justify-end gap-3">
           <button 
             type="button"
             onClick={onClose}
             className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-muted-foreground hover:bg-muted transition-all"
             style={{ fontFamily: "Montserrat, sans-serif" }}
           >
             Cancelar
           </button>
           <button 
             onClick={handleSubmit}
             className="flex items-center gap-2 bg-[#0a4d8c] text-white px-8 py-2.5 rounded-xl font-bold text-[14px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
             style={{ fontFamily: "Montserrat, sans-serif" }}
           >
             <Save className="w-4 h-4" />
             Guardar Cambios
           </button>
        </div>
      </div>
    </div>
  );
}
