import { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertTriangle,
  Package,
  Layers,
  Tag,
  DollarSign,
  Eye,
  EyeOff
} from "lucide-react";
import { useAdmin } from "../AdminContext";
import { useConfirm } from "../ConfirmModal";
import { categories, formatPrice, Product } from "../../data";
import { ProductModal } from "../ProductModal";

export function AdminProductsPage() {
  const { products, deleteProduct, updateProduct, addProduct } = useAdmin();
  const { confirm } = useConfirm();
  
  // State for filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockStatus, setStockStatus] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "active", "inactive"
  const [showFilters, setShowFilters] = useState(false);
  
  // State for pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || p.category === category;
      const matchStock = stockStatus === "all" || p.stockStatus === stockStatus;
      const matchActive = activeFilter === "all" || 
                        (activeFilter === "active" && p.isActive !== false) || 
                        (activeFilter === "inactive" && p.isActive === false);
      
      return matchSearch && matchCategory && matchStock && matchActive;
    });
  }, [products, search, category, stockStatus, activeFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm({
      title: "Eliminar Producto",
      message: `¿Estás seguro que deseas eliminar "${name}"? Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      variant: "danger"
    });
    
    if (ok) {
      deleteProduct(id);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = (productData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Gestión de Productos</h2>
          <p className="text-muted-foreground text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Administra el catálogo, stock y precios de tus suministros.
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-[#0a4d8c] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Filters & Tools */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm space-y-4">
        {/* ... (existing filters code) */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0a4d8c] transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold border transition-all ${
                showFilters ? "bg-[#0a4d8c] text-white border-[#0a4d8c]" : "bg-white text-foreground border-border hover:bg-[#f8f9fb]"
              }`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold bg-white text-foreground border border-border hover:bg-[#f8f9fb] transition-all" style={{ fontFamily: "Inter, sans-serif" }}>
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#f8f9fb] rounded-xl border border-border animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-muted-foreground ml-1">Categoría</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#0a4d8c]/20"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-muted-foreground ml-1">Estado de Stock</label>
              <select 
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                className="w-full bg-white border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#0a4d8c]/20"
              >
                <option value="all">Cualquier estado</option>
                <option value="in-stock">En Stock</option>
                <option value="low-stock">Bajo Stock</option>
                <option value="out-of-stock">Agotado</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-muted-foreground ml-1">Visibilidad</label>
              <select 
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full bg-white border border-border rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#0a4d8c]/20"
              >
                <option value="all">Todos</option>
                <option value="active">Solo Activos</option>
                <option value="inactive">Solo Desactivados</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ fontFamily: "Inter, sans-serif" }}>
            <thead>
              <tr className="bg-[#f8f9fb] text-[12px] text-muted-foreground font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#f8f9fb]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#f8f9fb] border border-border p-1 overflow-hidden shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-foreground truncate max-w-[200px]">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground font-medium">{p.sku} · {p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-foreground font-medium capitalize">{p.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-[#0a4d8c]">{formatPrice(p.price)}</span>
                      <span className="text-[11px] text-muted-foreground">x {p.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${
                         p.stockStatus === "in-stock" ? "bg-emerald-500" :
                         p.stockStatus === "low-stock" ? "bg-amber-500" : "bg-red-500"
                       }`} />
                       <span className="text-[13px] font-bold text-foreground">{p.stock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      p.isActive !== false ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {p.isActive !== false ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Activo
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Oculto
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => updateProduct(p.id, { isActive: !p.isActive })}
                        className={`p-2 rounded-lg transition-colors ${
                          p.isActive !== false ? "hover:bg-amber-50 text-amber-600" : "hover:bg-emerald-50 text-emerald-600"
                        }`}
                        title={p.isActive !== false ? "Desactivar" : "Activar"}
                      >
                        {p.isActive !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" 
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors" 
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination logic ... */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-[#f8f9fb] border-t border-border flex items-center justify-between">
            <p className="text-[13px] text-muted-foreground">
              Mostrando <span className="font-bold text-foreground">{currentProducts.length}</span> de <span className="font-bold text-foreground">{filteredProducts.length}</span> productos
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="p-2 border border-border rounded-lg bg-white disabled:opacity-50 hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg text-[13px] font-bold transition-all ${
                      page === n ? "bg-[#0a4d8c] text-white shadow-lg shadow-blue-500/20" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="p-2 border border-border rounded-lg bg-white disabled:opacity-50 hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={editingProduct}
      />

      {/* Empty State ... */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>No se encontraron productos</h3>
          <p className="text-muted-foreground text-[14px] mt-1" style={{ fontFamily: "Inter, sans-serif" }}>Intenta ajustar los filtros o términos de búsqueda.</p>
          <button 
            onClick={() => {setSearch(""); setCategory("all"); setStockStatus("all");}}
            className="mt-4 text-[13px] text-[#0a4d8c] font-bold hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
