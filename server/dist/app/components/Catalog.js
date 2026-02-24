import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { LayoutGrid, List, Filter, Zap, SlidersHorizontal, ChevronDown } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductListItem } from "./ProductListItem";
import { useAdmin } from "./admin/AdminContext";
export function Catalog({ searchQuery, selectedCategory, onAddToCart, onViewDetails }) {
    const { products, categories, isLoading } = useAdmin();
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("name");
    const [todayOnly, setTodayOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [activeCategory, setActiveCategory] = useState(selectedCategory);
    // Sync external category changes
    useEffect(() => {
        setActiveCategory(selectedCategory);
    }, [selectedCategory]);
    const filteredProducts = useMemo(() => {
        let result = products.filter(p => p.isActive !== false);
        // Category filter
        if (activeCategory !== "all") {
            result = result.filter((p) => p.category === activeCategory);
        }
        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter((p) => p.name.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q))) ||
                p.category.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q));
        }
        // Today only filter
        if (todayOnly) {
            result = result.filter((p) => p.deliveryDays === 1);
        }
        // Sort
        switch (sortBy) {
            case "name":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "stock":
                result.sort((a, b) => b.stock - a.stock);
                break;
        }
        return result;
    }, [products, activeCategory, searchQuery, todayOnly, sortBy]);
    return (_jsx("section", { className: "py-6 sm:py-8 px-3 sm:px-4 bg-[#f8f9fb]", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-[#0a4d8c]", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(1.05rem, 3vw, 1.35rem)" }, children: "Cat\u00E1logo de Suministros" }), _jsxs("p", { className: "text-muted-foreground text-[12px] sm:text-[13px]", style: { fontFamily: "Inter, sans-serif" }, children: [filteredProducts.length, " productos disponibles", searchQuery && ` para "${searchQuery}"`] })] }), _jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2 flex-wrap", children: [_jsxs("button", { onClick: () => setTodayOnly(!todayOnly), className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all border ${todayOnly
                                        ? "bg-[#0a4d8c] text-white border-[#0a4d8c]"
                                        : "bg-white text-foreground border-border hover:border-[#0a4d8c]/30"}`, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: [_jsx(Zap, { className: "w-3.5 h-3.5" }), "Entrega Hoy mismo"] }), _jsxs("button", { onClick: () => setShowFilters(!showFilters), className: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] bg-white text-foreground border border-border hover:border-[#0a4d8c]/30 transition-all md:hidden", style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: [_jsx(SlidersHorizontal, { className: "w-3.5 h-3.5" }), "Filtros"] }), _jsxs("div", { className: "relative", children: [_jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "appearance-none bg-white border border-border rounded-lg px-3 py-2 pr-8 text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-[#0a4d8c]/20 cursor-pointer", style: { fontFamily: "Inter, sans-serif" }, children: [_jsx("option", { value: "name", children: "Nombre A-Z" }), _jsx("option", { value: "price-asc", children: "Precio: Menor a Mayor" }), _jsx("option", { value: "price-desc", children: "Precio: Mayor a Menor" }), _jsx("option", { value: "stock", children: "Mayor Stock" })] }), _jsx(ChevronDown, { className: "absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" })] }), _jsxs("div", { className: "flex items-center bg-white border border-border rounded-lg overflow-hidden", children: [_jsx("button", { onClick: () => setViewMode("grid"), className: `p-2 transition-colors ${viewMode === "grid" ? "bg-[#0a4d8c] text-white" : "text-muted-foreground hover:text-foreground"}`, children: _jsx(LayoutGrid, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => setViewMode("list"), className: `p-2 transition-colors ${viewMode === "list" ? "bg-[#0a4d8c] text-white" : "text-muted-foreground hover:text-foreground"}`, children: _jsx(List, { className: "w-4 h-4" }) })] })] })] }), _jsxs("div", { className: "flex items-center gap-2 mb-5 overflow-x-auto pb-1", children: [_jsx("button", { onClick: () => setActiveCategory("all"), className: `px-3 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-all border ${activeCategory === "all"
                                ? "bg-[#0a4d8c] text-white border-[#0a4d8c]"
                                : "bg-white text-foreground border-border hover:border-[#0a4d8c]/30"}`, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Todos" }), categories.map((cat) => (_jsx("button", { onClick: () => setActiveCategory(cat.id), className: `px-3 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-all border ${activeCategory === cat.id
                                ? "bg-[#0a4d8c] text-white border-[#0a4d8c]"
                                : "bg-white text-foreground border-border hover:border-[#0a4d8c]/30"}`, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: cat.name }, cat.id)))] }), isLoading && products.length === 0 ? (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4", children: Array.from({ length: 8 }).map((_, i) => (_jsxs("div", { className: "bg-white rounded-xl border border-border overflow-hidden animate-pulse", children: [_jsx("div", { className: "bg-gray-200 h-40 w-full" }), _jsxs("div", { className: "p-3 space-y-2", children: [_jsx("div", { className: "bg-gray-200 h-3 rounded w-3/4" }), _jsx("div", { className: "bg-gray-200 h-3 rounded w-1/2" }), _jsx("div", { className: "bg-gray-200 h-5 rounded w-1/3 mt-2" })] })] }, i))) })) : filteredProducts.length === 0 ? (_jsxs("div", { className: "text-center py-16", children: [_jsx(Filter, { className: "w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" }), _jsx("p", { className: "text-[14px] text-muted-foreground", style: { fontFamily: "Inter, sans-serif" }, children: "No se encontraron productos con los filtros seleccionados." }), _jsx("button", { onClick: () => {
                                setActiveCategory("all");
                                setTodayOnly(false);
                            }, className: "mt-3 text-[13px] text-[#0a4d8c] hover:underline", style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Limpiar filtros" })] })) : viewMode === "grid" ? (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4", children: filteredProducts.map((product) => (_jsx(ProductCard, { product: product, onAddToCart: onAddToCart, onViewDetails: onViewDetails }, product.id))) })) : (_jsx("div", { className: "space-y-2", children: filteredProducts.map((product) => (_jsx(ProductListItem, { product: product, onAddToCart: onAddToCart, onViewDetails: onViewDetails }, product.id))) }))] }) }));
}
