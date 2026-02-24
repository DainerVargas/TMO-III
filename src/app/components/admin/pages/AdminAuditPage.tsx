import { useState, useEffect } from "react";
import { 
  History, 
  Search, 
  Filter, 
  User, 
  Calendar,
  Activity,
  Database,
  ArrowRight,
  Loader2,
  Clock,
  X,
  Eye,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AuditLog {
  id: number;
  userId: number;
  user: {
    name: string;
    email: string;
  };
  action: string;
  entity: string;
  entityId: string;
  oldData: string | null;
  newData: string | null;
  createdAt: string;
}

export function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterEntity, setFilterEntity] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/settings/audit");
      setLogs(data);
    } catch (error: any) {
      toast.error("Error al cargar logs: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const userName = log.user?.name || "Usuario Desconocido";
    const userEmail = log.user?.email || "";
    const action = log.action || "";
    const entityId = log.entityId || "";

    const matchesSearch = 
      userName.toLowerCase().includes(search.toLowerCase()) ||
      userEmail.toLowerCase().includes(search.toLowerCase()) ||
      action.toLowerCase().includes(search.toLowerCase()) ||
      entityId.toLowerCase().includes(search.toLowerCase());
    
    const matchesEntity = filterEntity === "all" || log.entity === filterEntity;
    
    return matchesSearch && matchesEntity;
  });

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DELETE': 
      case 'DELETE_HARD': return 'bg-red-100 text-red-700 border-red-200';
      case 'DELETE_SOFT': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'UPDATE_STOCK': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const parseData = (data: string | null) => {
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  };

  const JsonView = ({ data }: { data: any }) => {
    if (!data) return <span className="text-muted-foreground italic">Sin datos</span>;
    
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return <pre className="text-[11px] overflow-auto max-h-60 p-2 bg-slate-50 rounded-lg">{JSON.stringify(parsed, null, 2)}</pre>;
      } catch {
        return <span className="text-[12px]">{data}</span>;
      }
    }

    return <pre className="text-[11px] overflow-auto max-h-60 p-2 bg-slate-50 rounded-lg">{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Logs de Auditoría</h2>
          <p className="text-muted-foreground text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Monitorea todas las acciones y cambios realizados en el sistema.
          </p>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#0a4d8c] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-[#083d6e] transition-all shadow-lg shadow-[#0a4d8c]/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
          Actualizar Lista
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0a4d8c] transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por usuario, acción o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all"
          />
        </div>
        <div className="w-full md:w-56">
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-[#0a4d8c] transition-all appearance-none"
            >
              <option value="all">Filtro: Entidad (Todas)</option>
              <option value="Product">Productos</option>
              <option value="Category">Categorías</option>
              <option value="User">Usuarios</option>
              <option value="Order">Pedidos</option>
              <option value="Settings">Configuración</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fb] border-b border-border">
                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Fecha y Hora</th>
                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Acción</th>
                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Entidad</th>
                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Detalles</th>
                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f8f9fb] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-foreground">
                          {format(new Date(log.createdAt), "dd/MM/yyyy", { locale: es })}
                        </span>
                        <span className="text-[12px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(log.createdAt), "HH:mm:ss", { locale: es })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#0a4d8c]/10 flex items-center justify-center text-[#0a4d8c] font-bold text-[12px]">
                          {log.user?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold text-foreground truncate max-w-[150px]">
                            {log.user?.name || "Desconocido"}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                            {log.user?.email || ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
                        <Database className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{log.entity}</span>
                        <span className="text-muted-foreground font-mono text-[11px]">#{log.entityId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground italic truncate max-w-[200px]">
                        {log.newData ? (
                          <span>Vea los cambios detallados</span>
                        ) : (
                          <span>Sin detalles</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="p-2 hover:bg-[#0a4d8c]/10 rounded-lg text-[#0a4d8c] transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-bold">No se encontraron registros</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {logs.length === 0 ? "Todavía no se ha generado actividad en el sistema." : "Intenta ajustar los filtros de búsqueda."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-[#f8f9fb]">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${getActionColor(selectedLog.action)}`}>
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Detalles de Auditoría</h3>
                  <p className="text-xs text-muted-foreground">ID del Registro: #{selectedLog.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-black uppercase text-muted-foreground tracking-wider mb-2 block">Usuario</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[12px]">
                      {selectedLog.user?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{selectedLog.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedLog.user?.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-muted-foreground tracking-wider mb-2 block">Fecha y Hora</label>
                  <p className="text-sm font-bold">{format(new Date(selectedLog.createdAt), "PPPP, HH:mm:ss", { locale: es })}</p>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-muted-foreground tracking-wider mb-2 block">Acción</label>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${getActionColor(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase text-muted-foreground tracking-wider mb-2 block">Entidad</label>
                  <p className="text-sm font-bold flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-[#0a4d8c]" />
                    {selectedLog.entity} <span className="font-mono text-muted-foreground text-[12px]">#{selectedLog.entityId}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-border overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 text-[11px] font-bold text-slate-500 border-b border-border uppercase tracking-widest">
                    Datos Anteriores
                  </div>
                  <div className="p-4 bg-white">
                    <JsonView data={selectedLog.oldData} />
                  </div>
                </div>

                <div className="rounded-2xl border border-border overflow-hidden">
                  <div className="bg-emerald-50 px-4 py-2 text-[11px] font-bold text-emerald-600 border-b border-border uppercase tracking-widest">
                    Datos Nuevos / Actualizados
                  </div>
                  <div className="p-4 bg-white">
                    <JsonView data={selectedLog.newData} />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-[#f8f9fb] border-t border-border flex justify-end">
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2.5 bg-white border border-border rounded-xl font-bold text-[13px] hover:bg-slate-50 transition-all shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
