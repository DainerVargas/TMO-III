import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CuentaContent } from "../../AboutModal";
import { User } from "lucide-react";
export function AdminProfilePage() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-[#0a4d8c]", style: { fontFamily: "Montserrat, sans-serif" }, children: "Configuraci\u00F3n de Perfil" }), _jsx("p", { className: "text-muted-foreground text-sm", style: { fontFamily: "Inter, sans-serif" }, children: "Gestiona tu informaci\u00F3n personal y seguridad de la cuenta administrativa." })] }), _jsxs("div", { className: "flex items-center gap-2 bg-[#f0f7ff] px-4 py-2 rounded-xl text-[#0a4d8c] border border-[#0a4d8c]/10", children: [_jsx(User, { className: "w-5 h-5" }), _jsx("span", { className: "font-semibold text-sm", children: "Panel Admin" })] })] }), _jsx("div", { className: "bg-white rounded-2xl shadow-sm border border-border overflow-hidden", children: _jsx(CuentaContent, {}) })] }));
}
