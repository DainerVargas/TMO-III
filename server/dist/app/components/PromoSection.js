import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock, ShieldCheck, Truck, Zap, ShoppingCart, } from "lucide-react";
const stats = [
    { icon: ShieldCheck, value: "+2,000", label: "Productos" },
    { icon: Truck, value: "24h", label: "Despacho Lima" },
    { icon: Clock, value: "8+", label: "Años de experiencia" },
    { icon: Zap, value: "100%", label: "Stock garantizado" },
];
export function PromoSection({ onScrollToCatalog }) {
    return (_jsxs("section", { className: "bg-[#f5f7fa]", children: [_jsx("div", { className: "max-w-3xl mx-auto px-3 sm:px-6 pt-6 sm:pt-10", children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx("div", { className: "rounded-2xl overflow-hidden shadow-xl shadow-black/10 group", children: _jsx("img", { src: "http://imagenes.tmo.com.pe/imagenes/portada/descuento%202.png", alt: "Promociones en productos de limpieza e higiene", className: "w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]" }) }), _jsxs("button", { onClick: onScrollToCatalog, className: "flex items-center gap-2.5 sm:gap-3 bg-[#00bcd4] hover:bg-[#00a5bb] text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#00bcd4]/40 active:scale-[0.97]", style: {
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 700,
                                fontSize: "clamp(13px, 2.5vw, 18px)",
                            }, children: [_jsx(ShoppingCart, { className: "w-5 h-5 sm:w-6 sm:h-6" }), "Aprovechar Descuento"] })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8", children: _jsx("div", { className: "bg-white rounded-xl p-4 sm:p-5 shadow-md shadow-black/5 border border-[#e3f2fd]", children: _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6", children: stats.map((stat) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0a4d8c] to-[#0288d1] flex items-center justify-center shrink-0 shadow-md shadow-[#0a4d8c]/15", children: _jsx(stat.icon, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { children: [_jsx("span", { className: "block text-[#0a4d8c]", style: {
                                                fontFamily: "Montserrat, sans-serif",
                                                fontWeight: 800,
                                                fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                                            }, children: stat.value }), _jsx("span", { className: "text-[#64748b] text-[10px] sm:text-[12px]", style: { fontFamily: "Inter, sans-serif" }, children: stat.label })] })] }, stat.label))) }) }) })] }));
}
