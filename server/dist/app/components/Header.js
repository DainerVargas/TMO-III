import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Search, ShoppingCart, Menu, X, ChevronDown, User } from "lucide-react";
import { searchSuggestions } from "./data";
import { useAdmin } from "./admin/AdminContext";
import { useUser } from "./UserContext";
const navItems = [
    { label: "Inicio", path: "/" },
    { label: "Nuestra empresa", path: "/empresa" },
    { label: "Productos", path: "/productos" },
    { label: "Contáctanos", path: "/contactanos" },
];
export function Header({ cartCount, onSearchChange, onCategorySelect, onCartClick, }) {
    const { user, isLoggedIn } = useUser();
    const { categories } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const searchRef = useRef(null);
    const filteredSuggestions = searchSuggestions.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleSearch = (query) => {
        setSearchQuery(query);
        onSearchChange(query);
        setShowSuggestions(false);
    };
    const handleNavClick = (item) => {
        if (item.path === "/" && location.pathname === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        else {
            navigate(item.path);
        }
        setMobileMenuOpen(false);
    };
    const isActive = (path) => {
        if (path === "/")
            return location.pathname === "/";
        return location.pathname.startsWith(path);
    };
    return (_jsxs("header", { className: "sticky top-0 z-40 bg-white shadow-sm", children: [_jsx("div", { className: "max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3", children: _jsxs("div", { className: "flex items-center justify-center gap-2 sm:gap-4 md:gap-8", children: [_jsx("div", { className: "flex items-center gap-2 shrink-0", children: _jsx("img", { src: "http://imagenes.tmo.com.pe/imagenes/logotipo/SSI%20logo.png", alt: "SSI Suministros", className: "h-8 sm:h-10 w-auto object-contain cursor-pointer", onClick: () => navigate("/") }) }), _jsxs("div", { className: "flex-1 max-w-2xl relative min-w-0", ref: searchRef, children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Buscar productos...", value: searchQuery, onChange: (e) => {
                                                setSearchQuery(e.target.value);
                                                setShowSuggestions(true);
                                            }, onFocus: () => setShowSuggestions(true), onKeyDown: (e) => {
                                                if (e.key === "Enter")
                                                    handleSearch(searchQuery);
                                            }, className: "w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-[#f5f7fa] border border-border rounded-lg text-[13px] sm:text-[14px] placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[#0a4d8c]/30 focus:border-[#0a4d8c] transition-all", style: { fontFamily: "Inter, sans-serif" } })] }), showSuggestions && searchQuery.length > 0 && filteredSuggestions.length > 0 && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg py-1 z-50", children: filteredSuggestions.map((suggestion) => (_jsxs("button", { onClick: () => handleSearch(suggestion), className: "w-full px-4 py-2 text-left text-[13px] hover:bg-[#f0f7ff] transition-colors flex items-center gap-2", style: { fontFamily: "Inter, sans-serif" }, children: [_jsx(Search, { className: "w-3 h-3 text-muted-foreground" }), suggestion] }, suggestion))) }))] }), _jsxs("div", { className: "flex items-center gap-1.5 sm:gap-3", children: [_jsxs("button", { onClick: () => navigate("/mi-cuenta"), className: `flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-lg transition-all ${location.pathname === "/mi-cuenta" || location.pathname === "/login" || location.pathname === "/register"
                                        ? "bg-[#0a4d8c]/10 text-[#0a4d8c]"
                                        : "text-[#374151] hover:bg-[#f5f7fa]"}`, children: [_jsx(User, { className: "w-4 h-4 sm:w-[1.1rem] sm:h-[1.1rem]" }), _jsx("span", { className: "hidden md:inline text-[13px]", style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: isLoggedIn && user ? (`${user.name.split(' ')[0]}${user.lastName ? ' ' + user.lastName.split(' ')[0] : ''}`) : ("Mi cuenta") })] }), _jsxs("button", { onClick: onCartClick, className: "relative flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#0a4d8c] text-white rounded-lg hover:bg-[#083d6f] transition-colors", children: [_jsx(ShoppingCart, { className: "w-4 h-4" }), _jsx("span", { className: "hidden md:inline text-[13px]", style: { fontFamily: "Inter, sans-serif" }, children: "Carrito" }), cartCount > 0 && (_jsx("span", { className: "absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#00bcd4] text-white text-[11px] rounded-full flex items-center justify-center", style: { fontFamily: "Inter, sans-serif", fontWeight: 600 }, children: cartCount }))] }), _jsx("button", { className: "md:hidden p-2 text-foreground", onClick: () => setMobileMenuOpen(!mobileMenuOpen), children: mobileMenuOpen ? _jsx(X, { className: "w-5 h-5" }) : _jsx(Menu, { className: "w-5 h-5" }) })] })] }) }), _jsx("nav", { className: "hidden md:block", style: {
                    background: "linear-gradient(90deg, #0a4d8c 0%, #0288d1 50%, #00bcd4 100%)",
                }, children: _jsx("div", { className: "max-w-7xl mx-auto px-4 flex items-center justify-center", children: navItems.map((item) => (_jsxs("button", { onClick: () => handleNavClick(item), className: `flex items-center gap-1.5 px-5 py-2.5 transition-all whitespace-nowrap ${isActive(item.path)
                            ? "text-white bg-white/15"
                            : "text-white/90 hover:text-white hover:bg-white/10"}`, style: {
                            fontFamily: "Inter, sans-serif",
                            fontWeight: isActive(item.path) ? 600 : 500,
                            fontSize: "0.88rem",
                        }, children: [item.label, item.label === "Productos" && _jsx(ChevronDown, { className: "w-3.5 h-3.5 opacity-70" })] }, item.label))) }) }), mobileMenuOpen && (_jsxs("div", { className: "md:hidden border-t border-white/20 px-4 py-3 space-y-0.5", style: {
                    background: "linear-gradient(180deg, #0a4d8c 0%, #0288d1 100%)",
                }, children: [_jsxs("div", { className: "px-4 py-4 mb-2 flex items-center gap-3 border-b border-white/10", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-white/20 flex items-center justify-center", children: _jsx(User, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white font-semibold text-sm", style: { fontFamily: "Montserrat, sans-serif" }, children: isLoggedIn && user ? (`${user.name.split(' ')[0]}${user.lastName ? ' ' + user.lastName.split(' ')[0] : ''}`) : ("Mi Cuenta") }), _jsx("button", { onClick: () => { navigate("/mi-cuenta"); setMobileMenuOpen(false); }, className: "text-white/70 text-xs hover:text-white transition-colors", style: { fontFamily: "Inter, sans-serif" }, children: isLoggedIn ? "Gestionar perfil y seguridad" : "Inicia sesión o regístrate" })] })] }), navItems.map((item) => (_jsxs("button", { onClick: () => handleNavClick(item), className: `w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                            ? "text-white bg-white/15"
                            : "text-white/90 hover:text-white hover:bg-white/10"}`, style: {
                            fontFamily: "Inter, sans-serif",
                            fontWeight: isActive(item.path) ? 600 : 500,
                            fontSize: "0.9rem",
                        }, children: [item.label, item.label === "Productos" && _jsx(ChevronDown, { className: "w-3.5 h-3.5 opacity-60" })] }, item.label))), _jsxs("div", { className: "border-t border-white/15 mt-2 pt-2", children: [_jsx("p", { className: "px-4 py-1.5 text-white/50", style: {
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                }, children: "Categor\u00EDas" }), categories.map((cat) => (_jsx("button", { onClick: () => {
                                    onCategorySelect(cat.id);
                                    setMobileMenuOpen(false);
                                }, className: "w-full px-4 py-2.5 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors", style: { fontFamily: "Inter, sans-serif", fontSize: "0.85rem" }, children: cat.name }, cat.id)))] })] }))] }));
}
