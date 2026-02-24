import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, CheckCircle2, XCircle, Loader2, Plus, Edit2 } from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { toast } from "sonner";
import { AdminUserModal } from "../AdminUserModal";
export function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await apiFetch("/users/admin");
            setUsers(data.map((u) => ({
                ...u,
                permissions: typeof u.permissions === 'string'
                    ? u.permissions.split(',').map((p) => p.trim()).filter(Boolean)
                    : (Array.isArray(u.permissions) ? u.permissions : [])
            })));
        }
        catch (error) {
            toast.error("Error al cargar usuarios: " + error.message);
        }
        finally {
            setLoading(false);
        }
    };
    const handleRoleChange = async (userId, newRole) => {
        setUpdatingId(userId);
        try {
            await apiFetch(`/users/admin/${userId}/role`, {
                method: "PATCH",
                body: JSON.stringify({ role: newRole })
            });
            toast.success("Rol actualizado");
            fetchUsers();
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setUpdatingId(null);
        }
    };
    const handleStatusToggle = async (userId, currentStatus) => {
        setUpdatingId(userId);
        try {
            await apiFetch(`/users/admin/${userId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ isActive: !currentStatus })
            });
            toast.success(currentStatus ? "Usuario desactivado" : "Usuario activado");
            fetchUsers();
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setUpdatingId(null);
        }
    };
    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };
    const handleCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.companyName?.toLowerCase().includes(search.toLowerCase()));
    return (_jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-foreground", style: { fontFamily: "Montserrat, sans-serif" }, children: "Gesti\u00F3n de Usuarios" }), _jsx("p", { className: "text-muted-foreground text-[14px]", style: { fontFamily: "Inter, sans-serif" }, children: "Administra los roles, permisos y acceso de tus colaboradores." })] }), _jsxs("button", { onClick: handleCreate, className: "flex items-center justify-center gap-2 bg-[#0a4d8c] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all", children: [_jsx(Plus, { className: "w-5 h-5" }), "Nuevo Usuario"] })] }), _jsx("div", { className: "bg-white p-4 rounded-2xl border border-border shadow-sm", children: _jsxs("div", { className: "relative group", children: [_jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0a4d8c] transition-colors" }), _jsx("input", { type: "text", placeholder: "Buscar por nombre, email o empresa...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all" })] }) }), _jsx("div", { className: "bg-white rounded-2xl border border-border shadow-sm overflow-hidden", children: loading ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [_jsx(Loader2, { className: "w-10 h-10 text-[#0a4d8c] animate-spin mb-4" }), _jsx("p", { className: "text-muted-foreground", children: "Cargando usuarios..." })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left", style: { fontFamily: "Inter, sans-serif" }, children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-[#f8f9fb] text-[12px] text-muted-foreground font-bold uppercase tracking-wider", children: [_jsx("th", { className: "px-6 py-4", children: "Usuario" }), _jsx("th", { className: "px-6 py-4", children: "Rol" }), _jsx("th", { className: "px-6 py-4 text-center", children: "Estado" }), _jsx("th", { className: "px-6 py-4 text-right", children: "Acciones" })] }) }), _jsx("tbody", { className: "divide-y divide-border", children: filteredUsers.map((u) => (_jsxs("tr", { className: "hover:bg-[#f8f9fb]/50 transition-colors group", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "w-10 h-10 rounded-full bg-[#f0f7ff] text-[#0a4d8c] flex items-center justify-center font-bold text-sm", children: [u.name[0], u.lastName?.[0]] }), _jsxs("div", { children: [_jsxs("p", { className: "text-[14px] font-bold text-foreground", children: [u.name, " ", u.lastName] }), _jsx("p", { className: "text-[11px] text-muted-foreground", children: u.email })] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("select", { value: u.role, onChange: (e) => handleRoleChange(u.id, e.target.value), className: `border border-transparent rounded-lg px-2 py-1 text-[11px] font-black outline-none transition-all ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                    u.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`, children: [_jsx("option", { value: "USER", children: "USUARIO" }), _jsx("option", { value: "MANAGER", children: "GESTOR" }), _jsx("option", { value: "ADMIN", children: "ADMIN" })] }) }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsx("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`, children: u.isActive ? "Activo" : "Inactivo" }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-1", children: [_jsx("button", { onClick: () => handleEdit(u), className: "p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all", title: "Editar", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleStatusToggle(u.id, u.isActive), className: `p-2 rounded-lg transition-all ${u.isActive ? "hover:bg-red-50 text-red-600" : "hover:bg-emerald-50 text-emerald-600"}`, title: u.isActive ? "Desactivar" : "Activar", children: u.isActive ? _jsx(XCircle, { className: "w-4 h-4" }) : _jsx(CheckCircle2, { className: "w-4 h-4" }) })] }) })] }, u.id))) })] }) })) }), _jsx(AdminUserModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), onSave: fetchUsers, user: selectedUser })] }));
}
