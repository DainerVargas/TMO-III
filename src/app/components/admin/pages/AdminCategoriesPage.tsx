import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Tags,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { useConfirm } from "../ConfirmModal";
import { toast } from "sonner";
import { useAdmin } from "../AdminContext";

interface Category {
  id: string;
  name: string;
  icon: string;
}

export function AdminCategoriesPage() {
  const { refreshCategories: refreshGlobalCategories } = useAdmin();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { confirm } = useConfirm();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ id: "", name: "", icon: "Package" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/categories");
      setCategories(data);
    } catch (error: any) {
      toast.error("Error al cargar categorías: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const ok = await confirm({
      title: "Eliminar Categoría",
      message: `¿Estás seguro que deseas eliminar la categoría "${category.name}"? Esto podría afectar a los productos asociados.`,
      confirmLabel: "Eliminar",
      variant: "danger"
    });

    if (ok) {
      try {
        await apiFetch(`/categories/admin/${category.id}`, { method: "DELETE" });
        toast.success("Categoría eliminada");
        fetchCategories();
        refreshGlobalCategories();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ id: "", name: "", icon: "Package" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ id: category.id, name: category.name, icon: category.icon });
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const newData: any = { ...formData, name };
    // Auto-generate slug only if we are creating and slug hasn't been manually touched or is empty
    if (!editingCategory) {
      const suggestedId = name.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      newData.id = suggestedId;
    }
    setFormData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final normalization
    const slug = formData.id.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    const name = formData.name.trim();

    if (!slug || !name) {
      toast.error("El ID (Slug) y el Nombre son obligatorios");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await apiFetch(`/categories/admin/${editingCategory.id}`, {
          method: "PATCH",
          body: JSON.stringify({ name, icon: formData.icon || "Package" })
        });
        toast.success("Categoría actualizada");
      } else {
        await apiFetch("/categories/admin", {
          method: "POST",
          body: JSON.stringify({
            id: slug,
            name: name,
            icon: "Package"
          })
        });
        toast.success("Categoría creada");
      }
      setIsModalOpen(false);
      fetchCategories();
      refreshGlobalCategories();
    } catch (error: any) {
      console.error("Error submitting category:", error);
      toast.error(error.message || "Error al procesar la categoría");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Gestión de Categorías</h2>
          <p className="text-muted-foreground text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Administra las categorías de productos para organizar tu catálogo.
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-[#0a4d8c] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#0a4d8c] transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-border">
          <Loader2 className="w-10 h-10 text-[#0a4d8c] animate-spin mb-4" />
          <p className="text-muted-foreground">Cargando categorías...</p>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#f0f7ff] flex items-center justify-center text-[#0a4d8c]">
                  <Tags className="w-6 h-6" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenEdit(category)}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category)}
                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">{category.name}</h3>
              <p className="text-xs font-mono text-muted-foreground bg-[#f8f9fb] px-2 py-1 rounded inline-block">
                ID: {category.id}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border">
          <Tags className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-bold">No se encontraron categorías</h3>
          <p className="text-muted-foreground text-sm mt-1">Intenta con otro término de búsqueda.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-border bg-[#f8f9fb]">
              <h3 className="text-xl font-bold text-[#0a4d8c]">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1.5 ml-1">Nombre</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="ej: Equipos de Protección"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-1.5 ml-1">ID (Slug)</label>
                <input 
                  type="text" 
                  value={formData.id}
                  onChange={(e) => setFormData({...formData, id: e.target.value})}
                  disabled={!!editingCategory}
                  placeholder="ej: equipos-proteccion"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all disabled:bg-slate-50"
                  required
                />
                {!editingCategory && (
                  <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                    Se genera automáticamente, pero puedes editarlo antes de guardar.
                  </p>
                )}
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold border border-border hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold bg-[#0a4d8c] text-white hover:bg-[#083d6f] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingCategory ? "Guardar Cambios" : "Crear Categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
