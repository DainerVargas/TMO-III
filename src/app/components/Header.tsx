import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Search, ShoppingCart, Menu, X, ChevronDown, User, ArrowRight } from "lucide-react";
import { searchSuggestions, type Product } from "./data";
import { useAdmin } from "./admin/AdminContext";
import { useUser } from "./UserContext";

interface HeaderProps {
  cartCount: number;
  onSearchChange: (query: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onCartClick: () => void;
  onViewProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number, selectedUnit: "box" | "unit") => void;
}

const navItems: { label: string; path: string }[] = [
  { label: "Inicio", path: "/" },
  { label: "Nuestra empresa", path: "/empresa" },
  { label: "Productos", path: "/productos" },
  { label: "Contáctanos", path: "/contactanos" },
];

export function Header({
  cartCount,
  onSearchChange,
  onCategorySelect,
  onCartClick,
}: HeaderProps) {
  const { user, isLoggedIn } = useUser();
  const { categories } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = searchSuggestions.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearchChange(query);
    setShowSuggestions(false);
  };

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.path === "/" && location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(item.path);
    }
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* ── Top bar: Logo + Search + Cart ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="http://imagenes.tmo.com.pe/imagenes/logotipo/SSI%20logo.png"
              alt="SSI Suministros"
              className="h-8 sm:h-10 w-auto object-contain cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative min-w-0" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(searchQuery);
                }}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-[#f5f7fa] border border-border rounded-lg text-[13px] sm:text-[14px] placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[#0a4d8c]/30 focus:border-[#0a4d8c] transition-all"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>
            {showSuggestions && searchQuery.length > 0 && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg py-1 z-50">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion)}
                    className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#f0f7ff] transition-colors flex items-center gap-2"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <Search className="w-3 h-3 text-muted-foreground" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart + Account + Mobile toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => navigate("/mi-cuenta")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-lg transition-all ${
                location.pathname === "/mi-cuenta" || location.pathname === "/login" || location.pathname === "/register"
                  ? "bg-[#0a4d8c]/10 text-[#0a4d8c]"
                  : "text-[#374151] hover:bg-[#f5f7fa]"
              }`}
            >
              <User className="w-4 h-4 sm:w-[1.1rem] sm:h-[1.1rem]" />
              <span
                className="hidden md:inline text-[13px]"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              >
                {isLoggedIn && user ? (
                  `${user.name.split(' ')[0]}${user.lastName ? ' ' + user.lastName.split(' ')[0] : ''}`
                ) : (
                  "Mi cuenta"
                )}
              </span>
            </button>

            <button
              onClick={onCartClick}
              className="relative flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#0a4d8c] text-white rounded-lg hover:bg-[#083d6f] transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span
                className="hidden md:inline text-[13px]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Carrito
              </span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#00bcd4] text-white text-[11px] rounded-full flex items-center justify-center"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Gradient Navbar - Desktop ── */}
      <nav
        className="hidden md:block"
        style={{
          background: "linear-gradient(90deg, #0a4d8c 0%, #0288d1 50%, #00bcd4 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`flex items-center gap-1.5 px-5 py-2.5 transition-all whitespace-nowrap ${
                isActive(item.path)
                  ? "text-white bg-white/15"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: isActive(item.path) ? 600 : 500,
                fontSize: "0.88rem",
              }}
            >
              {item.label}
              {item.label === "Productos" && <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-white/20 px-4 py-3 space-y-0.5"
          style={{
            background: "linear-gradient(180deg, #0a4d8c 0%, #0288d1 100%)",
          }}
        >
          {/* Mobile Profile Header */}
          <div className="px-4 py-4 mb-2 flex items-center gap-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {isLoggedIn && user ? (
                  `${user.name.split(' ')[0]}${user.lastName ? ' ' + user.lastName.split(' ')[0] : ''}`
                ) : (
                  "Mi Cuenta"
                )}
              </p>
              <button 
                onClick={() => { navigate("/mi-cuenta"); setMobileMenuOpen(false); }}
                className="text-white/70 text-xs hover:text-white transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {isLoggedIn ? "Gestionar perfil y seguridad" : "Inicia sesión o regístrate"}
              </button>
            </div>
          </div>

          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "text-white bg-white/15"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: isActive(item.path) ? 600 : 500,
                fontSize: "0.9rem",
              }}
            >
              {item.label}
              {item.label === "Productos" && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
            </button>
          ))}

          {/* Category sub-items */}
          <div className="border-t border-white/15 mt-2 pt-2">
            <p
              className="px-4 py-1.5 text-white/50"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Categorías
            </p>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onCategorySelect(cat.id);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem" }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}