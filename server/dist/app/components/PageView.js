import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
export function PageView({ children, onBack }) {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);
    return (_jsxs("div", { className: "flex-1 bg-white", children: [_jsx("div", { className: "bg-[#f5f7fa] border-b border-[#e5e7eb]", children: _jsx("div", { className: "px-3 sm:px-4 py-2.5 sm:py-3", children: _jsxs("button", { onClick: onBack, className: "flex items-center gap-2 text-[#0a4d8c] hover:text-[#083d6f] transition-colors group", style: {
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 500,
                            fontSize: "0.88rem",
                        }, children: [_jsx(ArrowLeft, { className: "w-4 h-4 group-hover:-translate-x-0.5 transition-transform" }), "Volver al Inicio"] }) }) }), _jsx("div", { children: children })] }));
}
