import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X, Save, User as UserIcon, Mail, Phone, Shield, Lock, Building2, FileCheck, Loader2, CheckCircle2 } from "lucide-react";
import { apiFetch } from "../../utils/api";
import { toast } from "sonner";
const AVAILABLE_PERMISSIONS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'categories', label: 'Categorías' },
    { id: 'products', label: 'Productos' },
    { id: 'orders', label: 'Pedidos' },
    { id: 'users', label: 'Usuarios' },
    { id: 'inventory', label: 'Inventario' },
    { id: 'audit', label: 'Auditoría' },
    { id: 'settings', label: 'Configuración' },
];
export function AdminUserModal({ isOpen, onClose, onSave, user }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
        role: "USER",
        phone: "",
        documentType: "DNI",
        documentNumber: "",
        companyName: "",
        permissions: []
    });
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                lastName: user.lastName || "",
                email: user.email || "",
                password: "", // Don't show password
                role: user.role || "USER",
                phone: user.phone || "",
                documentType: user.documentType || "DNI",
                documentNumber: user.documentNumber || "",
                companyName: user.companyName || "",
                permissions: user.permissions || []
            });
        }
        else {
            setFormData({
                name: "",
                lastName: "",
                email: "",
                password: "",
                role: "USER",
                phone: "",
                documentType: "DNI",
                documentNumber: "",
                companyName: "",
                permissions: []
            });
        }
    }, [user, isOpen]);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = user ? `/users/admin/${user.id}` : "/users/admin";
            const method = user ? "PUT" : "POST";
            await apiFetch(url, {
                method,
                body: JSON.stringify(formData)
            });
            toast.success(user ? "Usuario actualizado" : "Usuario creado exitosamente");
            onSave();
            onClose();
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    const togglePermission = (permId) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permId)
                ? prev.permissions.filter(p => p !== permId)
                : [...prev.permissions, permId]
        }));
    };
    return (_jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300", children: _jsxs("div", { className: "bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]", children: [_jsxs("div", { className: "flex items-center justify-between px-8 py-6 border-b border-border bg-[#f8f9fb]", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-[#0a4d8c] text-white rounded-2xl shadow-lg flex items-center justify-center", children: _jsx(UserIcon, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-foreground leading-tight", style: { fontFamily: "Montserrat, sans-serif" }, children: user ? "Editar Usuario" : "Nuevo Usuario" }), _jsx("p", { className: "text-[12px] text-muted-foreground uppercase font-black tracking-widest mt-0.5", children: "Gesti\u00F3n de Acceso" })] })] }), _jsx("button", { onClick: onClose, className: "p-3 hover:bg-slate-200/50 rounded-full transition-all", children: _jsx(X, { className: "w-6 h-6 text-muted-foreground" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("h4", { className: "text-[14px] font-black text-[#0a4d8c] uppercase tracking-wider flex items-center gap-2", children: [_jsx(UserIcon, { className: "w-4 h-4" }), " Informaci\u00F3n Personal"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[12px] font-bold text-muted-foreground ml-1", children: "Nombre" }), _jsx("input", { type: "text", required: true, value: formData.name, onChange: e => setFormData({ ...formData, name: e.target.value }), className: "w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-3 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[12px] font-bold text-muted-foreground ml-1", children: "Apellidos" }), _jsx("input", { type: "text", required: true, value: formData.lastName, onChange: e => setFormData({ ...formData, lastName: e.target.value }), className: "w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-3 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h4", { className: "text-[14px] font-black text-[#0a4d8c] uppercase tracking-wider flex items-center gap-2", children: [_jsx(Mail, { className: "w-4 h-4" }), " Contacto y Seguridad"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[12px] font-bold text-muted-foreground ml-1", children: "Correo Electr\u00F3nico" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }), _jsx("input", { type: "email", required: true, value: formData.email, onChange: e => setFormData({ ...formData, email: e.target.value }), className: "w-full pl-10 pr-4 py-3 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium" })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[12px] font-bold text-muted-foreground ml-1", children: user ? "Contraseña (dejar vacío para no cambiar)" : "Contraseña" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }), _jsx("input", { type: "password", required: !user, value: formData.password, onChange: e => setFormData({ ...formData, password: e.target.value }), className: "w-full pl-10 pr-4 py-3 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[12px] font-bold text-muted-foreground ml-1", children: "Tel\u00E9fono" }), _jsxs("div", { className: "relative", children: [_jsx(Phone, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }), _jsx("input", { type: "text", value: formData.phone, onChange: e => setFormData({ ...formData, phone: e.target.value }), className: "w-full pl-10 pr-4 py-3 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium" })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[12px] font-bold text-muted-foreground ml-1", children: "Rol en el Sistema" }), _jsxs("div", { className: "relative", children: [_jsx(Shield, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }), _jsxs("select", { value: formData.role, onChange: e => setFormData({ ...formData, role: e.target.value }), className: "w-full pl-10 pr-4 py-3 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-bold appearance-none cursor-pointer", children: [_jsx("option", { value: "USER", children: "Cliente (User)" }), _jsx("option", { value: "MANAGER", children: "Gestor (Manager)" }), _jsx("option", { value: "ADMIN", children: "Administrador (Admin)" })] })] })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h4", { className: "text-[14px] font-black text-[#0a4d8c] uppercase tracking-wider flex items-center gap-2", children: [_jsx(Building2, { className: "w-4 h-4" }), " Datos de Empresa / Documento"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[12px] font-bold text-muted-foreground ml-1", children: "Tipo Doc." }), _jsxs("select", { value: formData.documentType, onChange: e => setFormData({ ...formData, documentType: e.target.value }), className: "w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-3 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium", children: [_jsx("option", { value: "DNI", children: "DNI" }), _jsx("option", { value: "RUC", children: "RUC" }), _jsx("option", { value: "CE", children: "C.E." })] })] }), _jsxs("div", { className: "space-y-1.5 md:col-span-2", children: [_jsx("label", { className: "text-[12px] font-bold text-muted-foreground ml-1", children: "N\u00FAmero de Documento" }), _jsx("input", { type: "text", value: formData.documentNumber, onChange: e => setFormData({ ...formData, documentNumber: e.target.value }), className: "w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-3 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium" })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[12px] font-bold text-muted-foreground ml-1", children: "Nombre de Empresa / Raz\u00F3n Social" }), _jsxs("div", { className: "relative", children: [_jsx(Building2, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }), _jsx("input", { type: "text", value: formData.companyName, onChange: e => setFormData({ ...formData, companyName: e.target.value }), className: "w-full pl-10 pr-4 py-3 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-medium" })] })] })] }), (formData.role === 'ADMIN' || formData.role === 'MANAGER') && (_jsxs("div", { className: "space-y-4 animate-in slide-in-from-top-4 duration-300", children: [_jsxs("h4", { className: "text-[14px] font-black text-[#0a4d8c] uppercase tracking-wider flex items-center gap-2", children: [_jsx(FileCheck, { className: "w-4 h-4" }), " Permisos de Acceso Directo"] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: AVAILABLE_PERMISSIONS.map((perm) => (_jsxs("button", { type: "button", onClick: () => togglePermission(perm.id), className: `flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-2 ${formData.permissions.includes(perm.id)
                                            ? "bg-[#0a4d8c] border-[#0a4d8c] text-white shadow-lg shadow-[#0a4d8c]/20"
                                            : "bg-white border-border text-slate-600 hover:bg-[#f8f9fb]"}`, children: [_jsx("div", { className: `w-5 h-5 rounded-full flex items-center justify-center border ${formData.permissions.includes(perm.id) ? "bg-white border-white" : "border-slate-300"}`, children: formData.permissions.includes(perm.id) && _jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-[#0a4d8c]" }) }), _jsx("span", { className: "text-[11px] font-black uppercase tracking-tight", children: perm.label })] }, perm.id))) })] }))] }), _jsxs("div", { className: "px-8 py-6 border-t border-border bg-[#f8f9fb] flex justify-end gap-3", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-6 py-3 rounded-2xl text-[14px] font-bold text-muted-foreground hover:bg-slate-200/50 transition-all", children: "Cancelar" }), _jsxs("button", { onClick: handleSubmit, disabled: loading, className: "flex items-center gap-3 bg-[#0a4d8c] text-white px-10 py-3.5 rounded-2xl font-black text-[15px] shadow-xl shadow-[#0a4d8c]/20 hover:shadow-[#0a4d8c]/40 active:scale-95 transition-all disabled:opacity-50", style: { fontFamily: "Montserrat, sans-serif" }, children: [loading ? _jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : _jsx(Save, { className: "w-5 h-5" }), user ? "Guardar Cambios" : "Crear Usuario"] })] })] }) }));
}
