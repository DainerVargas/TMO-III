import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useCallback, useEffect } from "react";
import { HeroSection } from "../HeroSection";
import { PromoSection } from "../PromoSection";
import { CategorySection } from "../CategorySection";
import { Catalog } from "../Catalog";
import { AboutSection } from "../AboutSection";
import { Footer } from "../Footer";
import { useOutletContext } from "react-router";
export function HomePage() {
    const { searchQuery, selectedCategory, setSelectedCategory, setSearchQuery, handleAddToCart, setSelectedProduct, scrollToCatalogFlag, clearScrollFlag, } = useOutletContext();
    const catalogRef = useRef(null);
    const scrollToCatalog = useCallback(() => {
        catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);
    const handleCategorySelect = useCallback((categoryId) => {
        setSelectedCategory(categoryId);
        setSearchQuery("");
        setTimeout(() => scrollToCatalog(), 100);
    }, [setSelectedCategory, setSearchQuery, scrollToCatalog]);
    // Scroll to catalog when triggered from Header on another page
    useEffect(() => {
        if (scrollToCatalogFlag) {
            setTimeout(() => scrollToCatalog(), 150);
            clearScrollFlag();
        }
    }, [scrollToCatalogFlag, clearScrollFlag, scrollToCatalog]);
    return (_jsxs(_Fragment, { children: [_jsxs("main", { className: "flex-1", children: [_jsx(HeroSection, { onScrollToCatalog: scrollToCatalog }), _jsx(PromoSection, { onScrollToCatalog: scrollToCatalog }), _jsx(CategorySection, { onCategorySelect: handleCategorySelect, onScrollToCatalog: scrollToCatalog }), _jsx("div", { ref: catalogRef, children: _jsx(Catalog, { searchQuery: searchQuery, selectedCategory: selectedCategory, onAddToCart: handleAddToCart, onViewDetails: setSelectedProduct }) }), _jsx(AboutSection, {})] }), _jsx(Footer, {})] }));
}
