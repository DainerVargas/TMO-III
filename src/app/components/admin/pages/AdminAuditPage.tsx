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
  Clock
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
    const matchesSearch = 
      log.user.name.toLowerCase().includes(search.toLowerCase()) ||
      log.user.email.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entityId.toLowerCase().includes(search.toLowerCase());
    
    const matchesEntity = filterEntity === "all" || log.entity === filterEntity;
    
    return matchesSearch && matchesEntity;
  });

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-700';
      case 'UPDATE': return 'bg-blue-100 text-blue-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Logs de Auditoría</h2>
          <p className="text-muted-foreground text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Monitorea todas las acciones y cambios realizados por los administradores.
          </p>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-white text-foreground border border-border px-4 py-2 rounded-xl font-bold text-[13px] hover:bg-[#f8f9fb] transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
          Actualizar
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0a4d8c] transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por usuario, acción o ID de entidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all"
          />
        </div>
        <div className="w-full md:w-48">
          <select 
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="w-full bg-[#f5f7fa] border border-transparent rounded-xl px-4 py-2.5 text-[14px] font-medium outline-none focus:bg-white focus:border-[#0a4d8c] transition-all"
          >
            <option value="all">Todas las entidades</option>
            <option value="Product">Productos</option>
            <option value="Category">Categorías</option>
            <option value="User">Usuarios</option>
            <option value="Order">Pedidos</option>
            <option value="Settings">Configuración</option>
          </select>
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-border">
            <Loader2 className="w-10 h-10 text-[#0a4d8c] animate-spin mb-4" />
            <p className="text-muted-foreground">Cargando registros...</p>
          </div>
        ) : filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div key={log.id} className="bg-white p-5 rounded-2xl border border-border shadow-sm hover:border-[#0a4d8c]/30 transition-all flex flex-col md:flex-row gap-4">
              <div className="md:w-48 shrink-0">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#0a4d8c] mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(log.createdAt), "dd MMM, HH:mm", { locale: es })}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-foreground font-semibold">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate">{log.user.name}</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                  <div className="flex items-center gap-2 text-[14px] font-medium text-foreground">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span>{log.entity}</span>
                    <span className="text-muted-foreground font-mono text-[12px]">#{log.entityId}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 bg-[#f8f9fb] rounded-xl p-3 border border-border/50 text-[12px] font-mono text-muted-foreground overflow-hidden">
                  {log.newData ? (
                    <div className="truncate">
                      Cambio registrado: {log.newData.length > 100 ? log.newData.substring(0, 100) + "..." : log.newData}
                    </div>
                  ) : (
                    "Registro de actividad sin detalles de datos"
                  )}
                </div>
              </div>

              <button className="self-end md:self-center p-2 hover:bg-[#f0f7ff] rounded-lg text-[#0a4d8c] transition-colors opacity-0 group-hover:opacity-100">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-bold">No se encontraron registros</h3>
            <p className="text-muted-foreground text-sm mt-1">Intenta ajustar los filtros de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
