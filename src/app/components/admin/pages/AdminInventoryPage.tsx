import { useState, useEffect } from "react";
import { 
  Box, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  MinusCircle, 
  History,
  Loader2,
  AlertCircle,
  Package,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  RefreshCcw,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Info,
  Clock
} from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface StockMovement {
  id: number;
  productId: number;
  product: { name: string; sku: string };
  quantity: number;
  type: string;
  reason: string | null;
  createdAt: string;
}

interface InventoryProduct {
  id: number;
  name: string;
  sku: string;
  stock: number;
  stockStatus: string;
  category?: { name: string };
}

export function AdminInventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const [productsData, movementsData] = await Promise.all([
        apiFetch("/products/admin"),
        apiFetch("/products/admin/movements")
      ]);
      setProducts(productsData);
      setMovements(movementsData);
    } catch (error: any) {
      toast.error("Error al cargar inventario: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjust = async (productId: number, quantity: number, type: string, reason: string) => {
    try {
      setUpdatingId(productId);
      await apiFetch(`/products/admin/${productId}/stock`, {
        method: "PATCH",
        body: JSON.stringify({ quantity, type, reason })
      });
      toast.success("Stock actualizado correctamente");
      
      // Intensive refresh is not ideal, but keeping it simple for now
      const [productsData, movementsData] = await Promise.all([
        apiFetch("/products/admin"),
        apiFetch("/products/admin/movements")
      ]);
      setProducts(productsData);
      setMovements(movementsData);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || p.stockStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalItems: products.length,
    lowStock: products.filter(p => p.stockStatus === "low-stock").length,
    outOfStock: products.filter(p => p.stockStatus === "out-of-stock").length,
    movementsToday: movements.filter(m => {
      const today = new Date().setHours(0,0,0,0);
      const moveDate = new Date(m.createdAt).setHours(0,0,0,0);
      return today === moveDate;
    }).length
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Control de Inventario</h2>
          <p className="text-muted-foreground text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Gestión centralizada de stock, entradas y trazabilidad de productos.
          </p>
        </div>
        <button 
          onClick={fetchInventory}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#0a4d8c] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-[#083d6e] transition-all shadow-lg shadow-[#0a4d8c]/20 disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Sincronizar Datos
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-50 text-[#0a4d8c] rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Total Productos</p>
          <p className="text-2xl font-black text-foreground">{stats.totalItems}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Stock Bajo</p>
          <p className="text-2xl font-black text-amber-600">{stats.lowStock}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <MinusCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Sin Existencias</p>
          <p className="text-2xl font-black text-red-600">{stats.outOfStock}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Movimientos Hoy</p>
          <p className="text-2xl font-black text-emerald-600">{stats.movementsToday}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0a4d8c] transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all"
              />
            </div>
            <div className="w-full md:w-48 relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-[#0a4d8c] transition-all appearance-none"
              >
                <option value="all">Todos los estados</option>
                <option value="in-stock">En Stock</option>
                <option value="low-stock">Stock Bajo</option>
                <option value="out-of-stock">Sin Stock</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#0a4d8c] animate-spin mb-4" />
                <p className="text-muted-foreground">Cargando catálogo...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ fontFamily: "Inter, sans-serif" }}>
                  <thead>
                    <tr className="bg-[#f8f9fb] border-b border-border">
                      <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Producto Informativo</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider text-center">Nivel Stock</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider text-center">Estado</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider text-right">Ajuste Rápido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProducts.length > 0 ? filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#f8f9fb] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#0a4d8c]/5 transition-colors">
                              <Package className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[14px] font-bold text-foreground truncate max-w-[200px]">{p.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-muted-foreground font-mono bg-slate-50 px-1.5 py-0.5 rounded-md">{p.sku}</span>
                                {p.category && <span className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">{p.category.name}</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`text-[16px] font-black ${
                              p.stockStatus === "out-of-stock" ? "text-red-600" : 
                              p.stockStatus === "low-stock" ? "text-amber-600" : "text-[#0a4d8c]"
                            }`}>
                              {p.stock}
                            </span>
                            <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 rounded-full ${
                                  p.stockStatus === "out-of-stock" ? "bg-red-500 w-0" : 
                                  p.stockStatus === "low-stock" ? "bg-amber-500 w-1/3" : "bg-emerald-500 w-full"
                                }`} 
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                            p.stockStatus === "in-stock" ? "text-emerald-700 bg-emerald-50 border-emerald-100" :
                            p.stockStatus === "low-stock" ? "text-amber-700 bg-amber-50 border-amber-100" : "text-red-700 bg-red-50 border-red-100"
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              p.stockStatus === "in-stock" ? "bg-emerald-500" :
                              p.stockStatus === "low-stock" ? "bg-amber-500" : "bg-red-500"
                            }`} />
                            {p.stockStatus === 'in-stock' ? 'En Stock' : p.stockStatus === 'low-stock' ? 'Stock Bajo' : 'Agotado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleStockAdjust(p.id, 1, "PURCHASE", "Entrada manual rápida")}
                              disabled={updatingId === p.id}
                              className="w-8 h-8 flex items-center justify-center hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all border border-transparent hover:border-emerald-100 active:scale-90"
                              title="Aumentar Stock"
                            >
                              <PlusCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleStockAdjust(p.id, -1, "SALE", "Salida manual rápida")}
                              disabled={updatingId === p.id || p.stock <= 0}
                              className="w-8 h-8 flex items-center justify-center hover:bg-red-50 text-red-600 rounded-lg transition-all border border-transparent hover:border-red-100 active:scale-90 disabled:opacity-30"
                              title="Disminuir Stock"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-400 rounded-lg transition-all">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center">
                          <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-slate-400">No se encontraron productos</h3>
                          <p className="text-slate-400 text-sm italic">Prueba con otros términos de búsqueda.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Movement History Summary */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#0a4d8c] flex items-center justify-center border border-slate-100">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>Historial</h3>
                  <p className="text-[11px] text-muted-foreground uppercase font-black tracking-widest">Últimos movimientos</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-1">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : movements.length > 0 ? (
                movements.slice(0, 10).map((m) => (
                  <div key={m.id} className="relative pl-6 pb-4 last:pb-0 group">
                    {/* Timeline line */}
                    <div className="absolute left-[7px] top-6 bottom-0 w-[2px] bg-slate-100 group-last:hidden" />
                    
                    <div className="relative flex gap-4 p-4 rounded-2xl bg-white border border-border/60 hover:border-[#0a4d8c]/20 hover:shadow-md hover:shadow-[#0a4d8c]/5 transition-all">
                      <div className={`absolute -left-[23px] top-[22px] w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                        m.quantity > 0 ? "bg-emerald-500" : "bg-red-500"
                      }`}>
                        {m.quantity > 0 ? <PlusCircle className="w-2 h-2 text-white" /> : <MinusCircle className="w-2 h-2 text-white" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <p className="text-[13px] font-bold text-foreground truncate leading-tight">{m.product.name}</p>
                          <span className={`text-[14px] font-black shrink-0 ${m.quantity > 0 ? "text-emerald-600" : "text-red-600"}`}>
                            {m.quantity > 0 ? "+" : ""}{m.quantity}
                          </span>
                        </div>
                        <div className="flex items-center flex-wrap gap-2">
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${
                            m.type === 'SALE' ? 'bg-blue-50 text-blue-600' : 
                            m.type === 'PURCHASE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {m.type}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(m.createdAt), "HH:mm", { locale: es })}
                          </span>
                        </div>
                        {m.reason && (
                          <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg italic flex items-start gap-1.5">
                            <Info className="w-3 h-3 mt-0.5 shrink-0" />
                            {m.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-muted-foreground flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                    <RefreshCcw className="w-6 h-6 text-slate-200" />
                  </div>
                  <p className="text-sm font-medium">Sin actividad reciente</p>
                  <p className="text-[11px]">Los cambios de stock aparecerán aquí.</p>
                </div>
              )}
            </div>

            {movements.length > 10 && (
              <button className="w-full mt-6 py-3 border border-slate-200 text-[12px] font-bold text-[#0a4d8c] hover:bg-[#0a4d8c] hover:text-white hover:border-[#0a4d8c] rounded-2xl transition-all flex items-center justify-center gap-2 group">
                Ver historial completo
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
