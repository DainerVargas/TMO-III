import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Save, Webhook, Globe, ShieldCheck, Loader2, RefreshCw, Info } from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { toast } from "sonner";
export function AdminSettingsPage() {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(null);
    useEffect(() => {
        fetchSettings();
    }, []);
    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await apiFetch("/settings");
            setSettings(data);
        }
        catch (error) {
            toast.error("Error al cargar configuración: " + error.message);
        }
        finally {
            setLoading(false);
        }
    };
    const handleUpdateSetting = async (key, value, description) => {
        setIsSaving(key);
        try {
            await apiFetch("/settings", {
                method: "POST",
                body: JSON.stringify({ key, value, description })
            });
            toast.success(`Configuración "${key}" actualizada`);
            fetchSettings();
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setIsSaving(null);
        }
    };
    const getSettingValue = (key) => settings.find(s => s.key === key)?.value || "";
    const getSettingDescription = (key) => settings.find(s => s.key === key)?.description || "";
    const sections = [
        {
            title: "Integraciones Externas",
            icon: Webhook,
            settings: [
                { key: "N8N_WEBHOOK_URL", label: "n8n Webhook URL", placeholder: "https://n8n.tu-dominio.com/webhook/..." },
                { key: "CRM_API_KEY", label: "CRM API Key", placeholder: "Ingresa la clave de API del CRM" }
            ]
        },
        {
            title: "Parámetros del Sistema",
            icon: Globe,
            settings: [
                { key: "STORE_NAME", label: "Nombre de la Tienda", placeholder: "TMO Suministros Industriales" },
                { key: "SUPPORT_EMAIL", label: "Email de Soporte", placeholder: "soporte@tmo.com.pe" }
            ]
        }
    ];
    return (_jsxs("div", { className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-foreground", style: { fontFamily: "Montserrat, sans-serif" }, children: "Configuraci\u00F3n del Sistema" }), _jsx("p", { className: "text-muted-foreground text-[14px]", style: { fontFamily: "Inter, sans-serif" }, children: "Administra los par\u00E1metros globales, integraciones y webhooks del e-commerce." })] }), _jsxs("button", { onClick: fetchSettings, className: "flex items-center justify-center gap-2 bg-white text-foreground border border-border px-4 py-2 rounded-xl font-bold text-[13px] hover:bg-[#f8f9fb] transition-all", children: [_jsx(RefreshCw, { className: `w-4 h-4 ${loading ? "animate-spin" : ""}` }), "Recargar"] })] }), loading ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-border", children: [_jsx(Loader2, { className: "w-10 h-10 text-[#0a4d8c] animate-spin mb-4" }), _jsx("p", { className: "text-muted-foreground", children: "Cargando configuraci\u00F3n..." })] })) : (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [sections.map((section) => (_jsxs("div", { className: "bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col", children: [_jsxs("div", { className: "p-6 border-b border-border bg-[#f8f9fb] flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-[#0a4d8c] shadow-sm", children: _jsx(section.icon, { className: "w-5 h-5" }) }), _jsx("h3", { className: "font-bold text-lg text-foreground", style: { fontFamily: "Montserrat, sans-serif" }, children: section.title })] }), _jsx("div", { className: "p-6 space-y-6 flex-1", children: section.settings.map((s) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-[13px] font-bold text-muted-foreground ml-1", children: s.label }), _jsx("span", { className: "text-[10px] font-mono text-slate-400 uppercase tracking-widest", children: s.key })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", defaultValue: getSettingValue(s.key), placeholder: s.placeholder, onBlur: (e) => {
                                                        if (e.target.value !== getSettingValue(s.key)) {
                                                            handleUpdateSetting(s.key, e.target.value, getSettingDescription(s.key));
                                                        }
                                                    }, className: "flex-1 px-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all" }), _jsx("button", { className: "p-2.5 rounded-xl bg-white border border-border text-[#0a4d8c] hover:bg-[#f0f7ff] transition-all disabled:opacity-50", title: "Guardar", disabled: isSaving === s.key, children: isSaving === s.key ? _jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : _jsx(Save, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex items-start gap-2 text-[11px] text-muted-foreground ml-1 pt-1 italic", children: [_jsx(Info, { className: "w-3 h-3 mt-0.5 shrink-0" }), getSettingDescription(s.key) || "Sin descripción proporcionada."] })] }, s.key))) })] }, section.title))), _jsxs("div", { className: "bg-[#f0f7ff] rounded-2xl border border-[#0a4d8c]/10 p-6 flex flex-col md:flex-row items-center gap-6 lg:col-span-2", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#0a4d8c] shadow-lg shrink-0", children: _jsx(ShieldCheck, { className: "w-8 h-8" }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-[#0a4d8c] text-lg mb-1", style: { fontFamily: "Montserrat, sans-serif" }, children: "Auditor\u00EDa Activa" }), _jsxs("p", { className: "text-[#0a4d8c]/70 text-[14px]", style: { fontFamily: "Inter, sans-serif" }, children: ["Todos los cambios realizados en esta secci\u00F3n son registrados autom\u00E1ticamente en los ", _jsx("span", { className: "font-bold", children: "Logs de Auditor\u00EDa" }), " para garantizar la integridad del sistema."] })] })] })] }))] }));
}
