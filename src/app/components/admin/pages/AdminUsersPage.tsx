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
  X,
  Plus,
  Edit2
} from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { toast } from "sonner";
import { AdminUserModal } from "../AdminUserModal";

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

export function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleEdit = (user: ManagedUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
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
        <button 
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-[#0a4d8c] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </button>
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
                        className={`border border-transparent rounded-lg px-2 py-1 text-[11px] font-black outline-none transition-all ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                          u.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}
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
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleEdit(u)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusToggle(u.id, u.isActive)}
                          className={`p-2 rounded-lg transition-all ${
                            u.isActive ? "hover:bg-red-50 text-red-600" : "hover:bg-emerald-50 text-emerald-600"
                          }`}
                          title={u.isActive ? "Desactivar" : "Activar"}
                        >
                          {u.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
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

      <AdminUserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchUsers}
        user={selectedUser}
      />
    </div>
  );
}
