import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PenLine, Package, Sparkles, ClipboardList, Coffee, Shield, Monitor, Wrench, Truck } from "lucide-react";
import { useAdmin } from "./admin/AdminContext";
const iconMap = {
    PenLine: _jsx(PenLine, { className: "w-6 h-6" }),
    Package: _jsx(Package, { className: "w-6 h-6" }),
    Sparkles: _jsx(Sparkles, { className: "w-6 h-6" }),
    ClipboardList: _jsx(ClipboardList, { className: "w-6 h-6" }),
    Coffee: _jsx(Coffee, { className: "w-6 h-6" }),
    Shield: _jsx(Shield, { className: "w-6 h-6" }),
    Monitor: _jsx(Monitor, { className: "w-6 h-6" }),
    Wrench: _jsx(Wrench, { className: "w-6 h-6" }),
    Truck: _jsx(Truck, { className: "w-6 h-6" }),
};
export function CategorySection({ onCategorySelect, onScrollToCatalog }) {
    const { categories } = useAdmin();
    return (_jsx("section", { className: "py-6 sm:py-10 px-3 sm:px-4 bg-white", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "text-center mb-5 sm:mb-8", children: [_jsx("h2", { className: "text-[#0a4d8c] mb-1", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(1.05rem, 3vw, 1.35rem)" }, children: "Categor\u00EDas de Suministros Esenciales" }), _jsx("p", { className: "text-muted-foreground text-[12px] sm:text-[14px]", style: { fontFamily: "Inter, sans-serif" }, children: "Acceso r\u00E1pido a los productos que tu operaci\u00F3n necesita cada d\u00EDa" })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4", children: categories.map((cat) => (_jsxs("button", { onClick: () => {
                            onCategorySelect(cat.id);
                            onScrollToCatalog();
                        }, className: "group flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 bg-[#f5f7fa] hover:bg-[#0a4d8c] rounded-xl transition-all duration-200 border border-transparent hover:border-[#0a4d8c] hover:shadow-lg hover:shadow-[#0a4d8c]/10", children: [_jsx("div", { className: "text-[#0a4d8c] group-hover:text-[#00bcd4] transition-colors", children: iconMap[cat.icon] }), _jsx("span", { className: "text-[11px] sm:text-[13px] text-center text-foreground group-hover:text-white transition-colors", style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: cat.name })] }, cat.id))) })] }) }));
}
