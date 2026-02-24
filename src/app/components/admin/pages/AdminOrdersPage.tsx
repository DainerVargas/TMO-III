import { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Mail,
  Phone,
  FileText
} from "lucide-react";
import { useAdmin, Order } from "../AdminContext";
import { formatPrice } from "../../data";
import { OrderDetailsModal } from "../OrderDetailsModal";

export function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();
  
  // State for filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  
  // State for pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // State for Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter logic
  const filteredOrders = orders.filter(o => {
    const matchSearch = (o.name || o.customerName || '').toLowerCase().includes(search.toLowerCase()) || 
                        (o.id || '').toLowerCase().includes(search.toLowerCase()) ||
                        (o.customerDoc || '').includes(search);
    const matchStatus = status === "all" || o.status === status;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      shipped: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    const labels = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      shipped: "Enviado",
      cancelled: "Cancelado",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${config[status as keyof typeof config]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Facturación y Pedidos</h2>
          <p className="text-muted-foreground text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Gestiona las solicitudes de cotización y pedidos en curso.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-bold bg-white text-foreground border border-border hover:bg-[#f8f9fb] transition-all shadow-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            <Download className="w-4 h-4" />
            Reporte Mensual
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0a4d8c] transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por ID, Cliente o Documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white border border-border rounded-xl px-4 py-2.5 text-[14px] font-semibold outline-none focus:ring-2 focus:ring-[#0a4d8c]/10 cursor-pointer"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmados</option>
            <option value="shipped">Enviados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ fontFamily: "Inter, sans-serif" }}>
            <thead>
              <tr className="bg-[#f8f9fb] text-[12px] text-muted-foreground font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ID Pedido / Fecha</th>
                <th className="px-6 py-4">Cliente / Contacto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#f8f9fb]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#0a4d8c]">{order.id}</span>
                      <span className="text-[11px] text-muted-foreground">{new Date(order.date).toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-foreground">{order.name || order.customerName}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-bold">{order.customerDoc}</span>
                        <div className="flex gap-1.5 ml-1">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <Phone className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </div>
                      {order.productSummary && (
                        <p className="text-[11px] text-[#0a4d8c] font-medium truncate max-w-[200px] mt-1 italic">
                          {order.productSummary}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-foreground">{formatPrice(order.total)}</span>
                        <span className="text-[11px] text-muted-foreground">{order.items.length} ítems</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleOpenDetails(order)}
                        className="p-2 hover:bg-muted text-foreground rounded-lg transition-colors" 
                        title="Ver Detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="relative group/menu">
                        <button className="p-2 hover:bg-muted text-muted-foreground rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-xl shadow-xl hidden group-hover/menu:block z-10 animate-in fade-in zoom-in-95 duration-200">
                          <div className="p-1.5">
                            <button 
                              onClick={() => updateOrderStatus(order.id, "confirmed")}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-foreground hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Marcar Confirmado
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(order.id, "shipped")}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-foreground hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                            >
                              <Truck className="w-4 h-4" /> Marcar Enviado
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <XCircle className="w-4 h-4" /> Cancelar Pedido
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-[#f8f9fb] border-t border-border flex items-center justify-between">
            <p className="text-[13px] text-muted-foreground">
              Mostrando <span className="font-bold text-foreground">{currentOrders.length}</span> de <span className="font-bold text-foreground">{filteredOrders.length}</span> pedidos
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

      <OrderDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        order={selectedOrder}
      />

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border">
          <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>No se encontraron pedidos</h3>
          <p className="text-muted-foreground text-[14px] mt-1" style={{ fontFamily: "Inter, sans-serif" }}>Intenta ajustar los filtros o el término de búsqueda.</p>
        </div>
      )}
    </div>
  );
}
