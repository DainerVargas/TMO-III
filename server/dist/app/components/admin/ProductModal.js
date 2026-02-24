import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { X, Save, Package, Image as ImageIcon, Tag, Hash, DollarSign, Layers, Eye, EyeOff, Upload, Loader2, AlertCircle, Truck, Plus, FileText, ShoppingBag, CheckCircle2, Info } from "lucide-react";
import { apiFetch } from "../../utils/api";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
export function ProductModal({ isOpen, onClose, onSave, product }) {
    const { categories } = useAdmin();
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [formData, setFormData] = useState({
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
        }
        else {
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
    if (!isOpen)
        return null;
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
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
        }
        catch (error) {
            toast.error("Error al subir imagen: " + error.message);
        }
        finally {
            setIsUploading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.sku) {
            return toast.error("Nombre y SKU son obligatorios");
        }
        try {
            setIsSaving(true);
            await onSave(formData);
            onClose();
        }
        catch (error) {
            toast.error("Error al guardar: " + error.message);
        }
        finally {
            setIsSaving(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300", children: _jsxs("div", { className: "bg-white rounded-[32px] w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]", children: [_jsxs("div", { className: "flex items-center justify-between px-8 py-6 border-b border-border bg-[#f8f9fb]", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-[#0a4d8c] text-white rounded-2xl shadow-lg shadow-[#0a4d8c]/20 flex items-center justify-center", children: _jsx(Package, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-foreground leading-tight", style: { fontFamily: "Montserrat, sans-serif" }, children: product ? "Editar Producto" : "Nuevo Producto" }), _jsx("p", { className: "text-[12px] text-muted-foreground uppercase font-black tracking-widest mt-0.5", children: "M\u00F3dulo de Suministros" })] })] }), _jsx("button", { onClick: onClose, className: "p-3 hover:bg-slate-200/50 rounded-full transition-all active:scale-90", children: _jsx(X, { className: "w-6 h-6 text-muted-foreground" }) })] }), _jsxs("div", { className: "flex px-8 border-b border-border bg-white", children: [_jsx("button", { onClick: () => setActiveTab("general"), className: `px-4 py-4 text-[13px] font-bold transition-all border-b-2 relative ${activeTab === "general" ? "border-[#0a4d8c] text-[#0a4d8c]" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: "Informaci\u00F3n General" }), _jsx("button", { onClick: () => setActiveTab("media"), className: `px-4 py-4 text-[13px] font-bold transition-all border-b-2 relative ${activeTab === "media" ? "border-[#0a4d8c] text-[#0a4d8c]" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: "Multimedia" }), _jsx("button", { onClick: () => setActiveTab("inventory"), className: `px-4 py-4 text-[13px] font-bold transition-all border-b-2 relative ${activeTab === "inventory" ? "border-[#0a4d8c] text-[#0a4d8c]" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: "Inventario y Env\u00EDo" })] }), _jsxs("form", { id: "product-form", onSubmit: handleSubmit, className: "flex-1 overflow-y-auto p-8 custom-scrollbar", children: [activeTab === "general" && (_jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[13px] font-bold text-foreground flex items-center gap-2 px-1", children: [_jsx(Tag, { className: "w-4 h-4 text-[#0a4d8c]" }), " Nombre del Producto"] }), _jsx("input", { type: "text", required: true, placeholder: "Ej. Papel Bond A4 80g", value: formData.name, onChange: e => setFormData({ ...formData, name: e.target.value }), className: "w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-3.5 text-[15px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-medium placeholder:text-slate-400" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[13px] font-bold text-foreground flex items-center gap-2 px-1", children: [_jsx(Layers, { className: "w-4 h-4 text-[#0a4d8c]" }), " Categor\u00EDa"] }), _jsx("select", { value: formData.category, onChange: e => setFormData({ ...formData, category: e.target.value }), className: "w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-3.5 text-[15px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium appearance-none cursor-pointer", children: categories.map(c => _jsx("option", { value: c.id, children: c.name }, c.id)) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[13px] font-bold text-foreground flex items-center gap-2 px-1", children: [_jsx(Hash, { className: "w-4 h-4 text-[#0a4d8c]" }), " SKU / C\u00F3digo"] }), _jsx("input", { type: "text", required: true, placeholder: "E-12345", value: formData.sku, onChange: e => setFormData({ ...formData, sku: e.target.value }), className: "w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-3.5 text-[15px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-mono" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[13px] font-bold text-foreground flex items-center gap-2 px-1", children: [_jsx(ShoppingBag, { className: "w-4 h-4 text-[#0a4d8c]" }), " Marca"] }), _jsx("input", { type: "text", placeholder: "Ej. HP, Xerox", value: formData.brand, onChange: e => setFormData({ ...formData, brand: e.target.value }), className: "w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-3.5 text-[15px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[13px] font-bold text-foreground flex items-center gap-2 px-1", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-[#0a4d8c]" }), " Unidad"] }), _jsx("input", { type: "text", placeholder: "Ej. Millares, Unidad", value: formData.unit, onChange: e => setFormData({ ...formData, unit: e.target.value }), className: "w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-3.5 text-[15px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[13px] font-bold text-foreground flex items-center gap-2 px-1", children: [_jsx(FileText, { className: "w-4 h-4 text-[#0a4d8c]" }), " Descripci\u00F3n Detallada"] }), _jsx("textarea", { value: formData.description, onChange: e => setFormData({ ...formData, description: e.target.value }), className: "w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-4 text-[15px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all min-h-[120px] resize-none font-medium text-slate-600", placeholder: "Escribe las caracter\u00EDsticas principales del producto..." })] }), _jsx("div", { className: "p-5 rounded-3xl bg-[#0a4d8c]/5 border border-[#0a4d8c]/10", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `p-3 rounded-2xl ${formData.isActive !== false ? 'bg-emerald-500' : 'bg-slate-400'} text-white shadow-lg`, children: formData.isActive !== false ? _jsx(Eye, { className: "w-5 h-5" }) : _jsx(EyeOff, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-[14px] font-bold text-foreground", children: "Visibilidad del Producto" }), _jsx("p", { className: "text-[12px] text-muted-foreground", children: formData.isActive !== false ? 'Público en el catálogo' : 'Oculto - Solo administración' })] }), _jsx("button", { type: "button", onClick: () => setFormData({ ...formData, isActive: !formData.isActive }), className: `w-14 h-8 rounded-full relative transition-all duration-300 ${formData.isActive !== false ? 'bg-emerald-500' : 'bg-slate-300'}`, children: _jsx("div", { className: `absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${formData.isActive !== false ? 'left-7' : 'left-1'}` }) })] }) })] })), activeTab === "media" && (_jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300", children: [_jsxs("div", { className: "relative group aspect-video rounded-[32px] bg-[#f8f9fb] border-4 border-dashed border-border flex items-center justify-center overflow-hidden transition-all hover:border-[#0a4d8c]/30", children: [formData.image && formData.image !== 'https://placehold.co/400x400?text=Suministro' ? (_jsx("img", { src: formData.image, className: "w-full h-full object-contain", alt: "Preview" })) : (_jsxs("div", { className: "text-center p-8", children: [_jsx("div", { className: "w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300", children: _jsx(ImageIcon, { className: "w-10 h-10" }) }), _jsx("h4", { className: "text-lg font-bold text-slate-400", children: "Sin imagen seleccionada" }), _jsx("p", { className: "text-sm text-slate-400", children: "Sube una fotograf\u00EDa real para mejorar las ventas." })] })), isUploading && (_jsxs("div", { className: "absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3", children: [_jsx(Loader2, { className: "w-10 h-10 animate-spin text-[#0a4d8c]" }), _jsx("p", { className: "font-bold text-[#0a4d8c]", children: "Procesando imagen..." })] })), _jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: _jsxs("button", { type: "button", onClick: () => fileInputRef.current?.click(), className: "bg-white text-[#0a4d8c] px-6 py-3 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 font-bold", children: [_jsx(Upload, { className: "w-5 h-5" }), "Cambiar Fotograf\u00EDa"] }) })] }), _jsx("input", { type: "file", ref: fileInputRef, onChange: handleImageUpload, accept: "image/*", className: "hidden" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[13px] font-bold text-foreground flex items-center gap-2 px-1", children: [_jsx(Info, { className: "w-4 h-4 text-[#0a4d8c]" }), " O usa una direcci\u00F3n web (URL)"] }), _jsx("input", { type: "url", placeholder: "https://ejemplo.com/mi-suministro.jpg", value: formData.image, onChange: e => setFormData({ ...formData, image: e.target.value }), className: "w-full bg-[#f5f7fa] border border-transparent rounded-2xl px-5 py-3.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all italic text-slate-500" })] })] })), activeTab === "inventory" && (_jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-right-4 duration-300", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-[#f8f9fb] p-6 rounded-3xl space-y-4", children: [_jsxs("h4", { className: "font-bold flex items-center gap-2 text-[#0a4d8c]", children: [_jsx(DollarSign, { className: "w-5 h-5" }), " Precios de Venta"] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[12px] font-black text-muted-foreground uppercase", children: "Precio Unitario (S/)" }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400", children: "S/" }), _jsx("input", { type: "number", step: "0.01", required: true, value: formData.price, onChange: e => setFormData({ ...formData, price: parseFloat(e.target.value) }), className: "w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-5 py-3.5 text-[20px] font-black focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all text-[#0a4d8c]" })] })] })] }), _jsxs("div", { className: "bg-[#f8f9fb] p-6 rounded-3xl space-y-4", children: [_jsxs("h4", { className: "font-bold flex items-center gap-2 text-[#0a4d8c]", children: [_jsx(Package, { className: "w-5 h-5" }), " Disponibilidad"] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-[12px] font-black text-muted-foreground uppercase", children: "Stock Inicial" }), _jsx("input", { type: "number", required: true, value: formData.stock, onChange: e => setFormData({ ...formData, stock: parseInt(e.target.value) }), className: "w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-[20px] font-black focus:border-[#0a4d8c] outline-none transition-all" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[13px] font-bold text-foreground flex items-center gap-2 px-1", children: [_jsx(Truck, { className: "w-4 h-4 text-[#0a4d8c]" }), " D\u00EDas para Entrega"] }), _jsxs("div", { className: "flex items-center gap-4 bg-[#f5f7fa] p-4 rounded-2xl border border-transparent focus-within:border-[#0a4d8c] focus-within:bg-white transition-all", children: [_jsx(Truck, { className: "w-8 h-8 text-[#0a4d8c] opacity-50" }), _jsxs("div", { className: "flex-1", children: [_jsx("input", { type: "number", value: formData.deliveryDays, onChange: e => setFormData({ ...formData, deliveryDays: parseInt(e.target.value) }), className: "w-full bg-transparent text-[18px] font-black outline-none" }), _jsx("p", { className: "text-[11px] font-bold text-muted-foreground", children: "TIEMPO ESTIMADO EN D\u00CDAS" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-[13px] font-bold text-foreground flex items-center gap-2 px-1", children: [_jsx(Plus, { className: "w-4 h-4 text-[#0a4d8c]" }), " Pedido M\u00EDnimo"] }), _jsxs("div", { className: "flex items-center gap-4 bg-[#f5f7fa] p-4 rounded-2xl border border-transparent focus-within:border-[#0a4d8c] focus-within:bg-white transition-all", children: [_jsx(ShoppingBag, { className: "w-8 h-8 text-[#0a4d8c] opacity-50" }), _jsxs("div", { className: "flex-1", children: [_jsx("input", { type: "number", value: formData.minOrder, onChange: e => setFormData({ ...formData, minOrder: parseInt(e.target.value) }), className: "w-full bg-transparent text-[18px] font-black outline-none" }), _jsx("p", { className: "text-[11px] font-bold text-muted-foreground", children: "UNIDADES M\u00CDNIMAS" })] })] })] })] }), _jsxs("div", { className: "flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 italic text-[11px]", children: [_jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }), "Estos datos son fundamentales para que el sistema calcule el stock autom\u00E1ticamente y proyecte las fechas de entrega a los clientes corporativos."] })] }))] }), _jsxs("div", { className: "px-8 py-6 border-t border-border bg-[#f8f9fb] flex justify-between items-center", children: [_jsx("button", { type: "button", onClick: onClose, className: "text-[14px] font-bold text-muted-foreground hover:text-foreground transition-all flex items-center gap-2", children: "Cerrar sin guardar" }), _jsxs("div", { className: "flex gap-4", children: [activeTab !== "general" && (_jsx("button", { type: "button", onClick: () => setActiveTab(activeTab === "inventory" ? "media" : "general"), className: "hidden sm:flex items-center px-6 py-3 rounded-2xl text-[14px] font-bold text-foreground bg-white border border-border shadow-sm hover:bg-slate-50 transition-all", children: "Regresar" })), _jsx("button", { onClick: handleSubmit, disabled: isSaving, className: `flex items-center gap-3 bg-[#0a4d8c] text-white px-10 py-3.5 rounded-2xl font-black text-[15px] shadow-xl shadow-[#0a4d8c]/20 hover:shadow-[#0a4d8c]/40 active:scale-95 transition-all outline-none disabled:opacity-50 disabled:grayscale`, style: { fontFamily: "Montserrat, sans-serif" }, children: isSaving ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "Guardando..."] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "w-5 h-5" }), "Finalizar y Guardar"] })) })] })] })] }) }));
}
