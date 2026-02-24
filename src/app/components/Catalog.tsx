import { useState, useMemo, useEffect } from "react";
import { LayoutGrid, List, Filter, Zap, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Product } from "./data";
import { ProductCard } from "./ProductCard";
import { ProductListItem } from "./ProductListItem";
import { useAdmin } from "./admin/AdminContext";

type ViewMode = "grid" | "list";
type SortOption = "name" | "price-asc" | "price-desc" | "stock";

interface CatalogProps {
  searchQuery: string;
  selectedCategory: string;
  onAddToCart: (product: Product, quantity: number, selectedUnit: "box" | "unit") => void;
  onViewDetails: (product: Product) => void;
}

export function Catalog({ searchQuery, selectedCategory, onAddToCart, onViewDetails }: CatalogProps) {
  const { products, categories, isLoading } = useAdmin();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name");
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
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q))) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
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

  return (
    <section className="py-6 sm:py-8 px-3 sm:px-4 bg-[#f8f9fb]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div>
            <h2
              className="text-[#0a4d8c]"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(1.05rem, 3vw, 1.35rem)" }}
            >
              Catálogo de Suministros
            </h2>
            <p className="text-muted-foreground text-[12px] sm:text-[13px]" style={{ fontFamily: "Inter, sans-serif" }}>
              {filteredProducts.length} productos disponibles
              {searchQuery && ` para "${searchQuery}"`}
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Urgency filter */}
            <button
              onClick={() => setTodayOnly(!todayOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all border ${
                todayOnly
                  ? "bg-[#0a4d8c] text-white border-[#0a4d8c]"
                  : "bg-white text-foreground border-border hover:border-[#0a4d8c]/30"
              }`}
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              <Zap className="w-3.5 h-3.5" />
              Entrega Hoy mismo
            </button>

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] bg-white text-foreground border border-border hover:border-[#0a4d8c]/30 transition-all md:hidden"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtros
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-border rounded-lg px-3 py-2 pr-8 text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-[#0a4d8c]/20 cursor-pointer"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <option value="name">Nombre A-Z</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="stock">Mayor Stock</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            {/* View mode toggle */}
            <div className="flex items-center bg-white border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid" ? "bg-[#0a4d8c] text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${
                  viewMode === "list" ? "bg-[#0a4d8c] text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-all border ${
              activeCategory === "all"
                ? "bg-[#0a4d8c] text-white border-[#0a4d8c]"
                : "bg-white text-foreground border-border hover:border-[#0a4d8c]/30"
            }`}
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? "bg-[#0a4d8c] text-white border-[#0a4d8c]"
                  : "bg-white text-foreground border-border hover:border-[#0a4d8c]/30"
              }`}
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products */}
        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-40 w-full" />
                <div className="p-3 space-y-2">
                  <div className="bg-gray-200 h-3 rounded w-3/4" />
                  <div className="bg-gray-200 h-3 rounded w-1/2" />
                  <div className="bg-gray-200 h-5 rounded w-1/3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-[14px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
              No se encontraron productos con los filtros seleccionados.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setTodayOnly(false);
              }}
              className="mt-3 text-[13px] text-[#0a4d8c] hover:underline"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}