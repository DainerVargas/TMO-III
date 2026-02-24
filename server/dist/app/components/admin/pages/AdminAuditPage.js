import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { History, Search, Filter, Activity, Database, Loader2, Clock, X, Eye, ChevronDown } from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
export function AdminAuditPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterEntity, setFilterEntity] = useState("all");
    const [selectedLog, setSelectedLog] = useState(null);
    useEffect(() => {
        fetchLogs();
    }, []);
    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await apiFetch("/settings/audit");
            setLogs(data);
        }
        catch (error) {
            toast.error("Error al cargar logs: " + error.message);
        }
        finally {
            setLoading(false);
        }
    };
    const filteredLogs = logs.filter(log => {
        const userName = log.user?.name || "Usuario Desconocido";
        const userEmail = log.user?.email || "";
        const action = log.action || "";
        const entityId = log.entityId || "";
        const matchesSearch = userName.toLowerCase().includes(search.toLowerCase()) ||
            userEmail.toLowerCase().includes(search.toLowerCase()) ||
            action.toLowerCase().includes(search.toLowerCase()) ||
            entityId.toLowerCase().includes(search.toLowerCase());
        const matchesEntity = filterEntity === "all" || log.entity === filterEntity;
        return matchesSearch && matchesEntity;
    });
    const getActionColor = (action) => {
        switch (action.toUpperCase()) {
            case 'CREATE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'UPDATE': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'DELETE':
            case 'DELETE_HARD': return 'bg-red-100 text-red-700 border-red-200';
            case 'DELETE_SOFT': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'UPDATE_STOCK': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };
    const parseData = (data) => {
        if (!data)
            return null;
        try {
            return JSON.parse(data);
        }
        catch (e) {
            return data;
        }
    };
    const JsonView = ({ data }) => {
        if (!data)
            return _jsx("span", { className: "text-muted-foreground italic", children: "Sin datos" });
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                return _jsx("pre", { className: "text-[11px] overflow-auto max-h-60 p-2 bg-slate-50 rounded-lg", children: JSON.stringify(parsed, null, 2) });
            }
            catch {
                return _jsx("span", { className: "text-[12px]", children: data });
            }
        }
        return _jsx("pre", { className: "text-[11px] overflow-auto max-h-60 p-2 bg-slate-50 rounded-lg", children: JSON.stringify(data, null, 2) });
    };
    return (_jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-foreground", style: { fontFamily: "Montserrat, sans-serif" }, children: "Logs de Auditor\u00EDa" }), _jsx("p", { className: "text-muted-foreground text-[14px]", style: { fontFamily: "Inter, sans-serif" }, children: "Monitorea todas las acciones y cambios realizados en el sistema." })] }), _jsxs("button", { onClick: fetchLogs, disabled: loading, className: "flex items-center justify-center gap-2 bg-[#0a4d8c] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-[#083d6e] transition-all shadow-lg shadow-[#0a4d8c]/20 disabled:opacity-50", children: [loading ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : _jsx(Clock, { className: "w-4 h-4" }), "Actualizar Lista"] })] }), _jsxs("div", { className: "bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "flex-1 relative group", children: [_jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0a4d8c] transition-colors" }), _jsx("input", { type: "text", placeholder: "Buscar por usuario, acci\u00F3n o ID...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all" })] }), _jsx("div", { className: "w-full md:w-56", children: _jsxs("div", { className: "relative", children: [_jsx(Filter, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsxs("select", { value: filterEntity, onChange: (e) => setFilterEntity(e.target.value), className: "w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-[#0a4d8c] transition-all appearance-none", children: [_jsx("option", { value: "all", children: "Filtro: Entidad (Todas)" }), _jsx("option", { value: "Product", children: "Productos" }), _jsx("option", { value: "Category", children: "Categor\u00EDas" }), _jsx("option", { value: "User", children: "Usuarios" }), _jsx("option", { value: "Order", children: "Pedidos" }), _jsx("option", { value: "Settings", children: "Configuraci\u00F3n" })] }), _jsx(ChevronDown, { className: "absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" })] }) })] }), _jsx("div", { className: "bg-white rounded-2xl border border-border overflow-hidden shadow-sm", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-[#f8f9fb] border-b border-border", children: [_jsx("th", { className: "px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider", children: "Fecha y Hora" }), _jsx("th", { className: "px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider", children: "Usuario" }), _jsx("th", { className: "px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider", children: "Acci\u00F3n" }), _jsx("th", { className: "px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider", children: "Entidad" }), _jsx("th", { className: "px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider", children: "Detalles" }), _jsx("th", { className: "px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider w-10" })] }) }), _jsx("tbody", { className: "divide-y divide-border", children: loading ? (Array.from({ length: 5 }).map((_, i) => (_jsx("tr", { className: "animate-pulse", children: _jsx("td", { colSpan: 6, className: "px-6 py-8 text-center", children: _jsx("div", { className: "h-4 bg-slate-100 rounded w-full" }) }) }, i)))) : filteredLogs.length > 0 ? (filteredLogs.map((log) => (_jsxs("tr", { className: "hover:bg-[#f8f9fb] transition-colors group", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-[13px] font-bold text-foreground", children: format(new Date(log.createdAt), "dd/MM/yyyy", { locale: es }) }), _jsxs("span", { className: "text-[12px] text-muted-foreground flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), format(new Date(log.createdAt), "HH:mm:ss", { locale: es })] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-[#0a4d8c]/10 flex items-center justify-center text-[#0a4d8c] font-bold text-[12px]", children: log.user?.name?.charAt(0).toUpperCase() || "?" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-[13px] font-semibold text-foreground truncate max-w-[150px]", children: log.user?.name || "Desconocido" }), _jsx("span", { className: "text-[11px] text-muted-foreground truncate max-w-[150px]", children: log.user?.email || "" })] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getActionColor(log.action)}`, children: log.action }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2 text-[13px] font-medium text-foreground", children: [_jsx(Database, { className: "w-3.5 h-3.5 text-muted-foreground" }), _jsx("span", { children: log.entity }), _jsxs("span", { className: "text-muted-foreground font-mono text-[11px]", children: ["#", log.entityId] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "flex items-center gap-2 text-[12px] text-muted-foreground italic truncate max-w-[200px]", children: log.newData ? (_jsx("span", { children: "Vea los cambios detallados" })) : (_jsx("span", { children: "Sin detalles" })) }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx("button", { onClick: () => setSelectedLog(log), className: "p-2 hover:bg-[#0a4d8c]/10 rounded-lg text-[#0a4d8c] transition-all opacity-0 group-hover:opacity-100", children: _jsx(Eye, { className: "w-4 h-4" }) }) })] }, log.id)))) : (_jsx("tr", { children: _jsxs("td", { colSpan: 6, className: "px-6 py-20 text-center", children: [_jsx(History, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" }), _jsx("h3", { className: "text-lg font-bold", children: "No se encontraron registros" }), _jsx("p", { className: "text-muted-foreground text-sm mt-1", children: logs.length === 0 ? "Todavía no se ha generado actividad en el sistema." : "Intenta ajustar los filtros de búsqueda." })] }) })) })] }) }) }), selectedLog && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300", children: _jsxs("div", { className: "bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "p-6 border-b border-border flex items-center justify-between bg-[#f8f9fb]", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `p-2.5 rounded-xl border ${getActionColor(selectedLog.action)}`, children: _jsx(Activity, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-foreground", children: "Detalles de Auditor\u00EDa" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["ID del Registro: #", selectedLog.id] })] })] }), _jsx("button", { onClick: () => setSelectedLog(null), className: "p-2 hover:bg-slate-200 rounded-full transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "p-6 space-y-6 max-h-[70vh] overflow-y-auto", children: [_jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-[11px] font-black uppercase text-muted-foreground tracking-wider mb-2 block", children: "Usuario" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[12px]", children: selectedLog.user?.name?.charAt(0).toUpperCase() || "?" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-bold", children: selectedLog.user?.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: selectedLog.user?.email })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-[11px] font-black uppercase text-muted-foreground tracking-wider mb-2 block", children: "Fecha y Hora" }), _jsx("p", { className: "text-sm font-bold", children: format(new Date(selectedLog.createdAt), "PPPP, HH:mm:ss", { locale: es }) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-[11px] font-black uppercase text-muted-foreground tracking-wider mb-2 block", children: "Acci\u00F3n" }), _jsx("span", { className: `px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${getActionColor(selectedLog.action)}`, children: selectedLog.action })] }), _jsxs("div", { children: [_jsx("label", { className: "text-[11px] font-black uppercase text-muted-foreground tracking-wider mb-2 block", children: "Entidad" }), _jsxs("p", { className: "text-sm font-bold flex items-center gap-1.5", children: [_jsx(Database, { className: "w-4 h-4 text-[#0a4d8c]" }), selectedLog.entity, " ", _jsxs("span", { className: "font-mono text-muted-foreground text-[12px]", children: ["#", selectedLog.entityId] })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "rounded-2xl border border-border overflow-hidden", children: [_jsx("div", { className: "bg-slate-50 px-4 py-2 text-[11px] font-bold text-slate-500 border-b border-border uppercase tracking-widest", children: "Datos Anteriores" }), _jsx("div", { className: "p-4 bg-white", children: _jsx(JsonView, { data: selectedLog.oldData }) })] }), _jsxs("div", { className: "rounded-2xl border border-border overflow-hidden", children: [_jsx("div", { className: "bg-emerald-50 px-4 py-2 text-[11px] font-bold text-emerald-600 border-b border-border uppercase tracking-widest", children: "Datos Nuevos / Actualizados" }), _jsx("div", { className: "p-4 bg-white", children: _jsx(JsonView, { data: selectedLog.newData }) })] })] })] }), _jsx("div", { className: "p-6 bg-[#f8f9fb] border-t border-border flex justify-end", children: _jsx("button", { onClick: () => setSelectedLog(null), className: "px-6 py-2.5 bg-white border border-border rounded-xl font-bold text-[13px] hover:bg-slate-50 transition-all shadow-sm", children: "Cerrar" }) })] }) }))] }));
}
