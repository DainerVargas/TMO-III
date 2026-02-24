import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ProductosContent } from "../AboutModal";
import { Footer } from "../Footer";
import { useOutletContext } from "react-router";
export function ProductosPage() {
    const { handleAddToCart, setSelectedProduct } = useOutletContext();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex-1 bg-white", children: [_jsx("div", { className: "bg-[#f5f7fa] border-b border-[#e5e7eb]", children: _jsx("div", { className: "px-3 sm:px-4 py-2.5 sm:py-3", children: _jsxs(Link, { to: "/", className: "flex items-center gap-2 text-[#0a4d8c] hover:text-[#083d6f] transition-colors group", style: {
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 500,
                                    fontSize: "0.88rem",
                                }, children: [_jsx(ArrowLeft, { className: "w-4 h-4 group-hover:-translate-x-0.5 transition-transform" }), "Volver al Inicio"] }) }) }), _jsx(ProductosContent, { onViewProduct: setSelectedProduct, onAddToCart: handleAddToCart, onClose: () => { } })] }), _jsx(Footer, {})] }));
}
