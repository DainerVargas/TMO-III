import { useState, useEffect } from "react";
import { 
  Search, 
  Users, 
  Shield, 
  User as UserIcon, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Phone,
  Mail,
  FileText,
  Lock,
  X
} from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { toast } from "sonner";

interface ManagedUser {
  id: number;
  email: string;
  name: string;
  lastName: string;
  role: "USER" | "ADMIN" | "MANAGER";
  phone: string;
  documentType: string;
  documentNumber: string;
  companyName: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'categories', label: 'Categorías' },
  { id: 'products', label: 'Productos' },
  { id: 'orders', label: 'Pedidos' },
  { id: 'users', label: 'Usuarios' },
  { id: 'inventory', label: 'Inventario' },
  { id: 'audit', label: 'Auditoría' },
  { id: 'settings', label: 'Configuración' },
];

export function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/users/admin");
      setUsers(data.map((u: any) => ({
        ...u,
        permissions: typeof u.permissions === 'string' 
          ? u.permissions.split(',').map((p: string) => p.trim()).filter(Boolean)
          : (Array.isArray(u.permissions) ? u.permissions : [])
      })));
    } catch (error: any) {
      toast.error("Error al cargar usuarios: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    setUpdatingId(userId);
    try {
      await apiFetch(`/users/admin/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole })
      });
      toast.success("Rol actualizado");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusToggle = async (userId: number, currentStatus: boolean) => {
    setUpdatingId(userId);
    try {
      await apiFetch(`/users/admin/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !currentStatus })
      });
      toast.success(currentStatus ? "Usuario desactivado" : "Usuario activado");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdatePermissions = async () => {
    if (!selectedUser) return;
    setUpdatingId(selectedUser.id);
    try {
      await apiFetch(`/users/admin/${selectedUser.id}/permissions`, {
        method: "PATCH",
        body: JSON.stringify({ permissions: tempPermissions })
      });
      toast.success("Permisos actualizados");
      setIsPermissionModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const openPermissionModal = (user: ManagedUser) => {
    setSelectedUser(user);
    setTempPermissions(user.permissions);
    setIsPermissionModalOpen(true);
  };

  const togglePermission = (permId: string) => {
    setTempPermissions(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Gestión de Usuarios</h2>
          <p className="text-muted-foreground text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Administra los roles, permisos y acceso de tus colaboradores.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0a4d8c] transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, email o empresa..."
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
            <p className="text-muted-foreground">Cargando usuarios...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ fontFamily: "Inter, sans-serif" }}>
              <thead>
                <tr className="bg-[#f8f9fb] text-[12px] text-muted-foreground font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f8f9fb]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f0f7ff] text-[#0a4d8c] flex items-center justify-center font-bold text-sm">
                          {u.name[0]}{u.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-foreground">{u.name} {u.lastName}</p>
                          <p className="text-[11px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-[#f5f7fa] border border-transparent rounded-lg px-2 py-1 text-[12px] font-bold outline-none focus:bg-white focus:border-[#0a4d8c] transition-all"
                      >
                        <option value="USER">USUARIO</option>
                        <option value="MANAGER">GESTOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        {u.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(u.role === 'ADMIN' || u.role === 'MANAGER') && (
                          <button 
                            onClick={() => openPermissionModal(u)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#0a4d8c] hover:bg-[#0a4d8c]/5 transition-all"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            Permisos
                          </button>
                        )}
                        <button 
                          onClick={() => handleStatusToggle(u.id, u.isActive)}
                          className={`text-[12px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                            u.isActive ? "text-red-600 hover:bg-red-50" : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {u.isActive ? "Desactivar" : "Activar"}
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

      {/* Permissions Modal */}
      {isPermissionModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-[#f8f9fb]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0a4d8c]/10 text-[#0a4d8c] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Permisos de Acceso</h3>
                  <p className="text-[12px] text-muted-foreground font-medium">{selectedUser.name} {selectedUser.lastName}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPermissionModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-[13px] text-muted-foreground mb-2">
                Selecciona las áreas a las que este colaborador tendrá acceso total:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <button
                    key={perm.id}
                    onClick={() => togglePermission(perm.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                      tempPermissions.includes(perm.id)
                        ? "bg-[#f0f7ff] border-[#0a4d8c] ring-2 ring-[#0a4d8c]/10"
                        : "bg-white border-border hover:bg-[#f8f9fb]"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      tempPermissions.includes(perm.id)
                        ? "bg-[#0a4d8c] border-[#0a4d8c]"
                        : "bg-white border-muted-foreground/30"
                    }`}>
                      {tempPermissions.includes(perm.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-[13px] font-semibold ${
                      tempPermissions.includes(perm.id) ? "text-[#0a4d8c]" : "text-foreground"
                    }`}>
                      {perm.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-[#f8f9fb] border-t border-border flex gap-3">
              <button
                onClick={() => setIsPermissionModalOpen(false)}
                className="flex-1 py-3 rounded-xl text-[14px] font-bold text-foreground border border-border bg-white hover:bg-[#f5f7fa] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdatePermissions}
                disabled={updatingId === selectedUser.id}
                className="flex-1 py-3 rounded-xl text-[14px] font-bold text-white shadow-lg shadow-[#0a4d8c]/20 hover:shadow-[#0a4d8c]/40 active:scale-95 transition-all"
                style={{ background: "linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%)" }}
              >
                {updatingId === selectedUser.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
