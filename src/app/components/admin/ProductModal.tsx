import { useState, useEffect, useRef } from "react";
import { 
  X, 
  Save, 
  Package, 
  Image as ImageIcon, 
  Tag, 
  Hash, 
  DollarSign, 
  Layers, 
  Eye, 
  EyeOff, 
  Upload, 
  Loader2,
  AlertCircle,
  Truck,
  Plus,
  Trash2,
  FileText,
  ShoppingBag,
  CheckCircle2,
  Info
} from "lucide-react";
import { Product } from "../data";
import { apiFetch } from "../../utils/api";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id"> | Product) => void;
  product?: Product | null;
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const { categories } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "media" | "inventory">("general");
  
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
    minOrder: 1,
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
        minOrder: 1,
        stockStatus: "in-stock",
        isActive: true
      });
    }
  }, [product, isOpen, categories]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      return toast.error("Nombre y SKU son obligatorios");
    }

    try {
      setIsSaving(true);
      await onSave(formData as Product);
      onClose();
    } catch (error: any) {
      toast.error("Error al guardar: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-[#f8f9fb]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#0a4d8c] text-white rounded-2xl shadow-lg shadow-[#0a4d8c]/20 flex items-center justify-center">
               <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground leading-tight" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {product ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <p className="text-[12px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">Módulo de Suministros</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-slate-200/50 rounded-full transition-all active:scale-90"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 border-b border-border bg-white">
          <button 
            onClick={() => setActiveTab("general")}
            className={`px-4 py-4 text-[13px] font-bold transition-all border-b-2 relative ${
              activeTab === "general" ? "border-[#0a4d8c] text-[#0a4d8c]" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Información General
          </button>
          <button 
            onClick={() => setActiveTab("media")}
            className={`px-4 py-4 text-[13px] font-bold transition-all border-b-2 relative ${
              activeTab === "media" ? "border-[#0a4d8c] text-[#0a4d8c]" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Multimedia
          </button>
          <button 
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-4 text-[13px] font-bold transition-all border-b-2 relative ${
              activeTab === "inventory" ? "border-[#0a4d8c] text-[#0a4d8c]" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Inventario y Envío
          </button>
        </div>

        <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2 px-1">
                    <Tag className="w-4 h-4 text-[#0a4d8c]" /> Nombre del Producto
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Papel Bond A4 80g"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-3.5 text-[15px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2 px-1">
                    <Layers className="w-4 h-4 text-[#0a4d8c]" /> Categoría
                  </label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value })}
                    className="w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-3.5 text-[15px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium appearance-none cursor-pointer"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2 px-1">
                    <Hash className="w-4 h-4 text-[#0a4d8c]" /> SKU / Código
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="E-12345"
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    className="w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-3.5 text-[15px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2 px-1">
                    <ShoppingBag className="w-4 h-4 text-[#0a4d8c]" /> Marca
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej. HP, Xerox"
                    value={formData.brand}
                    onChange={e => setFormData({...formData, brand: e.target.value})}
                    className="w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-3.5 text-[15px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2 px-1">
                    <CheckCircle2 className="w-4 h-4 text-[#0a4d8c]" /> Unidad
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej. Millares, Unidad"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                    className="w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-3.5 text-[15px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[13px] font-bold text-foreground flex items-center gap-2 px-1">
                   <FileText className="w-4 h-4 text-[#0a4d8c]" /> Descripción Detallada
                 </label>
                 <textarea 
                   value={formData.description}
                   onChange={e => setFormData({...formData, description: e.target.value})}
                   className="w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-4 text-[15px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all min-h-[120px] resize-none font-medium text-slate-600"
                   placeholder="Escribe las características principales del producto..."
                 ></textarea>
              </div>

              <div className="p-5 rounded-3xl bg-[#0a4d8c]/5 border border-[#0a4d8c]/10">
                 <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${formData.isActive !== false ? 'bg-emerald-500' : 'bg-slate-400'} text-white shadow-lg`}>
                       {formData.isActive !== false ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                       <h4 className="text-[14px] font-bold text-foreground">Visibilidad del Producto</h4>
                       <p className="text-[12px] text-muted-foreground">{formData.isActive !== false ? 'Público en el catálogo' : 'Oculto - Solo administración'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                      className={`w-14 h-8 rounded-full relative transition-all duration-300 ${formData.isActive !== false ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${formData.isActive !== false ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="relative group aspect-video rounded-[32px] bg-[#f8f9fb] border-4 border-dashed border-border flex items-center justify-center overflow-hidden transition-all hover:border-[#0a4d8c]/30">
                  {formData.image && formData.image !== 'https://placehold.co/400x400?text=Suministro' ? (
                     <img src={formData.image} className="w-full h-full object-contain" alt="Preview" />
                  ) : (
                     <div className="text-center p-8">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                           <ImageIcon className="w-10 h-10" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-400">Sin imagen seleccionada</h4>
                        <p className="text-sm text-slate-400">Sube una fotografía real para mejorar las ventas.</p>
                     </div>
                  )}
                  
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-10 h-10 animate-spin text-[#0a4d8c]" />
                      <p className="font-bold text-[#0a4d8c]">Procesando imagen...</p>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-[#0a4d8c] px-6 py-3 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 font-bold"
                     >
                        <Upload className="w-5 h-5" /> 
                        Cambiar Fotografía
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
               
               <div className="space-y-2">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2 px-1">
                    <Info className="w-4 h-4 text-[#0a4d8c]" /> O usa una dirección web (URL)
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://ejemplo.com/mi-suministro.jpg"
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-3.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all italic text-slate-500"
                  />
               </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-[#f8f9fb] p-6 rounded-3xl space-y-4">
                    <h4 className="font-bold flex items-center gap-2 text-[#0a4d8c]">
                       <DollarSign className="w-5 h-5" /> Precios de Venta
                    </h4>
                    <div className="space-y-2">
                      <label className="text-[12px] font-black text-muted-foreground uppercase">Precio Unitario (S/)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">S/</span>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-5 py-3.5 text-[20px] font-black focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all text-[#0a4d8c]"
                        />
                      </div>
                    </div>
                 </div>

                 <div className="bg-[#f8f9fb] p-6 rounded-3xl space-y-4">
                    <h4 className="font-bold flex items-center gap-2 text-[#0a4d8c]">
                       <Package className="w-5 h-5" /> Disponibilidad
                    </h4>
                    <div className="space-y-2">
                      <label className="text-[12px] font-black text-muted-foreground uppercase">Stock Inicial</label>
                      <input 
                        type="number" 
                        required
                        value={formData.stock}
                        onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-[20px] font-black focus:border-[#0a4d8c] outline-none transition-all"
                      />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2 px-1">
                    <Truck className="w-4 h-4 text-[#0a4d8c]" /> Días para Entrega
                  </label>
                  <div className="flex items-center gap-4 bg-[#f5f7fa] p-4 rounded-2xl border border-transparent focus-within:border-[#0a4d8c] focus-within:bg-white transition-all">
                     <Truck className="w-8 h-8 text-[#0a4d8c] opacity-50" />
                     <div className="flex-1">
                        <input 
                           type="number" 
                           value={formData.deliveryDays}
                           onChange={e => setFormData({...formData, deliveryDays: parseInt(e.target.value)})}
                           className="w-full bg-transparent text-[18px] font-black outline-none"
                        />
                        <p className="text-[11px] font-bold text-muted-foreground">TIEMPO ESTIMADO EN DÍAS</p>
                     </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-foreground flex items-center gap-2 px-1">
                    <Plus className="w-4 h-4 text-[#0a4d8c]" /> Pedido Mínimo
                  </label>
                  <div className="flex items-center gap-4 bg-[#f5f7fa] p-4 rounded-2xl border border-transparent focus-within:border-[#0a4d8c] focus-within:bg-white transition-all">
                     <ShoppingBag className="w-8 h-8 text-[#0a4d8c] opacity-50" />
                     <div className="flex-1">
                        <input 
                           type="number" 
                           value={formData.minOrder}
                           onChange={e => setFormData({...formData, minOrder: parseInt(e.target.value)})}
                           className="w-full bg-transparent text-[18px] font-black outline-none"
                        />
                        <p className="text-[11px] font-bold text-muted-foreground">UNIDADES MÍNIMAS</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 italic text-[11px]">
                 <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                 Estos datos son fundamentales para que el sistema calcule el stock automáticamente y proyecte las fechas de entrega a los clientes corporativos.
              </div>
            </div>
          )}
        </form>

        <div className="px-8 py-6 border-t border-border bg-[#f8f9fb] flex justify-between items-center">
            <button 
              type="button"
              onClick={onClose}
              className="text-[14px] font-bold text-muted-foreground hover:text-foreground transition-all flex items-center gap-2"
            >
              Cerrar sin guardar
            </button>
            <div className="flex gap-4">
               {activeTab !== "general" && (
                 <button 
                   type="button"
                   onClick={() => setActiveTab(activeTab === "inventory" ? "media" : "general")}
                   className="hidden sm:flex items-center px-6 py-3 rounded-2xl text-[14px] font-bold text-foreground bg-white border border-border shadow-sm hover:bg-slate-50 transition-all"
                 >
                   Regresar
                 </button>
               )}
               <button 
                 onClick={handleSubmit}
                 disabled={isSaving}
                 className={`flex items-center gap-3 bg-[#0a4d8c] text-white px-10 py-3.5 rounded-2xl font-black text-[15px] shadow-xl shadow-[#0a4d8c]/20 hover:shadow-[#0a4d8c]/40 active:scale-95 transition-all outline-none disabled:opacity-50 disabled:grayscale`}
                 style={{ fontFamily: "Montserrat, sans-serif" }}
               >
                 {isSaving ? (
                   <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     Guardando...
                   </>
                 ) : (
                   <>
                     <Save className="w-5 h-5" />
                     Finalizar y Guardar
                   </>
                 )}
               </button>
            </div>
        </div>
      </div>
    </div>
  );
}
