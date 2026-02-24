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
  AlertCircle
} from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { toast } from "sonner";

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
}

export function AdminInventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

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
      await apiFetch(`/products/admin/${productId}/stock`, {
        method: "PATCH",
        body: JSON.stringify({ quantity, type, reason })
      });
      toast.success("Stock actualizado correctamente");
      fetchInventory();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Control de Inventario</h2>
          <p className="text-muted-foreground text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Gestiona entradas, salidas y ajustes de stock en tiempo real.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-border shadow-sm">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0a4d8c] transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all"
              />
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
                    <tr className="bg-[#f8f9fb] text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Producto</th>
                      <th className="px-6 py-4 text-center">Stock Actual</th>
                      <th className="px-6 py-4 text-center">Estado</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className={`hover:bg-[#f0f7ff]/30 transition-colors ${selectedProduct === p.id ? "bg-[#f0f7ff]/50" : ""}`}>
                        <td className="px-6 py-4">
                          <div className="min-w-0">
                            <p className="text-[14px] font-bold text-foreground truncate max-w-[250px]">{p.name}</p>
                            <p className="text-[11px] text-muted-foreground font-mono">{p.sku}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-[15px] font-black text-[#0a4d8c]">{p.stock}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            p.stockStatus === "in-stock" ? "text-emerald-600 bg-emerald-50" :
                            p.stockStatus === "low-stock" ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50"
                          }`}>
                            {p.stockStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleStockAdjust(p.id, 1, "PURCHASE", "Entrada manual")}
                              className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                              title="Añadir 1"
                            >
                              <PlusCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleStockAdjust(p.id, -1, "SALE", "Salida manual")}
                              className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100"
                              title="Quitar 1"
                              disabled={p.stock <= 0}
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Movement History Summary */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#0a4d8c] text-white flex items-center justify-center shadow-lg shadow-[#0a4d8c]/20">
                <History className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>Movimientos Recientes</h3>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="py-10 text-center text-muted-foreground text-sm">Cargando...</div>
              ) : movements.length > 0 ? (
                movements.slice(0, 8).map((m) => (
                  <div key={m.id} className="flex gap-4 p-3 rounded-xl border border-border/50 hover:border-border transition-colors group">
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                      m.quantity > 0 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                    }`}>
                      {m.quantity > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-foreground truncate">{m.product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[12px] font-black ${m.quantity > 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {m.quantity > 0 ? "+" : ""}{m.quantity}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{m.type}</span>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-slate-400 mt-1">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground text-sm border-2 border-dashed border-border rounded-xl">
                  Sin movimientos registrados
                </div>
              )}
            </div>

            {movements.length > 8 && (
              <button className="w-full mt-6 py-2.5 text-[12px] font-bold text-[#0a4d8c] hover:bg-[#f0f7ff] rounded-xl transition-all">
                Ver todo el historial
              </button>
            )}
          </div>

          <div className="bg-[#fff9eb] p-6 rounded-2xl border border-amber-200">
             <div className="flex items-center gap-2 text-amber-800 font-bold text-[14px] mb-2">
               <AlertCircle className="w-4 h-4" />
               Aviso de Stock Bajo
             </div>
             <p className="text-[12px] text-amber-700 leading-relaxed">
               {products.filter(p => p.stockStatus === 'low-stock').length} productos están en stock bajo y requieren atención.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
