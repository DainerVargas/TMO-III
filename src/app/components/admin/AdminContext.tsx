import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../data";
import { toast } from "sonner";
import { apiFetch } from "../../utils/api";
import { useUser } from "../UserContext";

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: { name: string; sku: string; unit: string };
}

export interface Order {
  id: string;
  userId: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "cancelled";
  createdAt: string;
  date: string;
  items: OrderItem[];
  // legacy compatibility fields
  name?: string;
  customerName?: string;
  customerDoc?: string;
  customerEmail?: string;
  customerPhone?: string;
  productSummary?: string;
  user?: { name: string; lastName?: string; email: string; documentNumber?: string; phone?: string };
}

interface AdminContextType {
  products: Product[];
  categories: { id: string; name: string; icon: string }[];
  orders: Order[];
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalCategories: number;
    totalUsers: number;
    pendingOrders: number;
    totalOrders: number;
    lowStockProducts: number;
    totalStockValue: number;
    salesHistory?: { name: string; sales: number; orders: number }[];
    topCategories?: { label: string; percentage: number; color: string }[];
    salesGrowth: string;
    orderGrowth: string;
  } | null;
  refreshStats: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, login: userLoginFn, logout: userLogout } = useUser();
  const isLoggedIn = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([]);
  
  // Products and categories will be loaded via refreshPublicProducts on mount

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminContextType["stats"]>(null);
  const [isLoading, setIsLoading] = useState(false);

  const normalizeProducts = (data: any[]) =>
    data.map((p: any) => ({
      ...p,
      id: p.id.toString(),
      category: p.categoryId,
      price: parseFloat(p.price),
      unitPrice: p.unitPrice ? parseFloat(p.unitPrice) : undefined,
      tags: typeof p.tags === 'string'
        ? p.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : (Array.isArray(p.tags) ? p.tags : []),
    }));

  // Load public products — no auth required, works for all users/guests
  const refreshPublicProducts = async () => {
    setIsLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        apiFetch('/products'),
        apiFetch('/categories')
      ]);
      setProducts(normalizeProducts(productsData));
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error fetching public data, falling back to mock data", error);
      // Fallback to mock data if API fails
      try {
        const module = await import("../data");
        if (products.length === 0) setProducts(module.products);
        if (categories.length === 0) setCategories(module.categories);
      } catch (mockError) {
        console.error("Critical: Even mock data failed to load", mockError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      // Admin endpoint includes inactive products — used only for admin/manager users
      const data = await apiFetch('/products/admin');
      setProducts(normalizeProducts(data));
    } catch (error) {
      console.error("Error fetching admin products", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrders = async () => {
    try {
      const data = await apiFetch('/orders/admin');
      // Normalize DB orders to match the frontend Order interface
      const normalized = data.map((o: any) => ({
        ...o,
        id: o.id.toString(),
        total: parseFloat(o.total),
        date: o.createdAt,
        status: o.status.toLowerCase() as Order["status"],
        // Map user info for display
        name: o.user ? `${o.user.name}${o.user.lastName ? ' ' + o.user.lastName : ''}` : 'Cliente',
        customerName: o.user ? `${o.user.name}${o.user.lastName ? ' ' + o.user.lastName : ''}` : 'Cliente',
        customerDoc: o.user?.documentNumber || '-',
        customerEmail: o.user?.email || '-',
        customerPhone: o.user?.phone || '-',
        // Map items with product names
        items: (o.orderItems || []).map((item: any) => ({
          ...item,
          name: item.product?.name || 'Producto Eliminado',
          unit: item.product?.unit || 'u',
          price: parseFloat(item.price)
        })),
        productSummary: (o.orderItems || []).map((i: any) => i.product?.name).filter(Boolean).join(', ')
      }));
      setOrders(normalized);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const refreshStats = async () => {
    try {
      const data = await apiFetch('/settings/stats');
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  // On mount: always load public products so the storefront works for guests/regular users.
  useEffect(() => {
    refreshPublicProducts();
  }, []);

  // Re-fetch admin data whenever the user session changes (login/logout/role update).
  // For admins this upgrades the product list to include inactive products too.
  useEffect(() => {
    if (isLoggedIn) {
      refreshProducts();
      refreshOrders();
      refreshStats();
    }
  }, [user?.id, user?.role]);


  const login = async (email: string, pass: string) => {
    try {
      await userLoginFn(email, pass);
      return true;
    } catch (error: any) {
      return false;
    }
  };

  const logout = () => {
    userLogout();
  };

  const addProduct = async (productData: Omit<Product, "id">) => {
    try {
      setIsLoading(true);
      // Normalize for Backend
      const normalizedData = {
        ...productData,
        categoryId: (productData as any).category,
        tags: Array.isArray(productData.tags) ? productData.tags.join(',') : productData.tags
      };
      delete (normalizedData as any).category;

      await apiFetch('/products/admin', {
        method: 'POST',
        body: JSON.stringify(normalizedData),
      });
      
      toast.success("Producto creado exitosamente");
      await refreshProducts();
    } catch (error: any) {
      toast.error(`Error al crear producto: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      setIsLoading(true);
      // Normalize for Backend
      const normalizedData: any = { ...updatedFields };
      if (normalizedData.category) {
        normalizedData.categoryId = normalizedData.category;
        delete normalizedData.category;
      }
      if (Array.isArray(normalizedData.tags)) {
        normalizedData.tags = normalizedData.tags.join(',');
      }

      await apiFetch(`/products/admin/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(normalizedData),
      });
      
      toast.success("Producto actualizado exitosamente");
      await refreshProducts();
    } catch (error: any) {
      toast.error(`Error al actualizar producto: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      await apiFetch(`/products/admin/${id}`, {
        method: 'DELETE',
      });
      toast.success("Producto eliminado exitosamente");
      await refreshProducts();
    } catch (error: any) {
      toast.error(`Error al eliminar producto: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    try {
      await apiFetch(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: status.toUpperCase() }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
      toast.success(`Pedido marcado como ${status}`);
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        categories,
        orders,
        isLoggedIn,
        isLoading,
        login,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        refreshProducts,
        refreshOrders,
        refreshStats,
        stats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
