import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { apiFetch } from "../../utils/api";
import { useUser } from "../UserContext";
const AdminContext = createContext(undefined);
export function AdminProvider({ children }) {
    const { user, login: userLoginFn, logout: userLogout } = useUser();
    const isLoggedIn = user?.role === 'ADMIN' || user?.role === 'MANAGER';
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    // Products and categories will be loaded via refreshPublicProducts on mount
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const normalizeProducts = (data) => data.map((p) => ({
        ...p,
        id: p.id.toString(),
        category: p.categoryId,
        price: parseFloat(p.price),
        unitPrice: p.unitPrice ? parseFloat(p.unitPrice) : undefined,
        tags: typeof p.tags === 'string'
            ? p.tags.split(',').map((t) => t.trim()).filter(Boolean)
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
        }
        catch (error) {
            console.error("Error fetching public data, falling back to mock data", error);
            // Fallback to mock data if API fails
            try {
                const module = await import("../data");
                if (products.length === 0)
                    setProducts(module.products);
                if (categories.length === 0)
                    setCategories(module.categories);
            }
            catch (mockError) {
                console.error("Critical: Even mock data failed to load", mockError);
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const refreshCategories = async () => {
        try {
            const data = await apiFetch('/categories');
            if (data && data.length > 0) {
                setCategories(data);
            }
        }
        catch (error) {
            console.error("Error fetching categories", error);
        }
    };
    const refreshProducts = async () => {
        setIsLoading(true);
        try {
            // Admin endpoint includes inactive products — used only for admin/manager users
            const data = await apiFetch('/products/admin');
            setProducts(normalizeProducts(data));
        }
        catch (error) {
            console.error("Error fetching admin products", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const refreshOrders = async () => {
        try {
            const data = await apiFetch('/orders/admin');
            // Normalize DB orders to match the frontend Order interface
            const normalized = data.map((o) => ({
                ...o,
                id: o.id.toString(),
                total: parseFloat(o.total),
                date: o.createdAt,
                status: o.status.toLowerCase(),
                // Map user info for display
                name: o.user ? `${o.user.name}${o.user.lastName ? ' ' + o.user.lastName : ''}` : 'Cliente',
                customerName: o.user ? `${o.user.name}${o.user.lastName ? ' ' + o.user.lastName : ''}` : 'Cliente',
                customerDoc: o.user?.documentNumber || '-',
                customerEmail: o.user?.email || '-',
                customerPhone: o.user?.phone || '-',
                // Map items with product names
                items: (o.orderItems || []).map((item) => ({
                    ...item,
                    name: item.product?.name || 'Producto Eliminado',
                    unit: item.product?.unit || 'u',
                    price: parseFloat(item.price)
                })),
                productSummary: (o.orderItems || []).map((i) => i.product?.name).filter(Boolean).join(', ')
            }));
            setOrders(normalized);
        }
        catch (error) {
            console.error("Error fetching orders", error);
        }
    };
    const refreshStats = async () => {
        try {
            const data = await apiFetch('/settings/stats');
            setStats(data);
        }
        catch (error) {
            console.error("Error fetching stats", error);
        }
    };
    // On mount: always load public products so the storefront works for guests/regular users.
    useEffect(() => {
        refreshPublicProducts();
        refreshCategories();
    }, []);
    // Re-fetch admin data whenever the user session changes (login/logout/role update).
    // For admins this upgrades the product list to include inactive products too.
    useEffect(() => {
        if (isLoggedIn) {
            refreshProducts();
            refreshOrders();
            refreshStats();
            refreshCategories();
        }
    }, [user?.id, user?.role]);
    const login = async (email, pass) => {
        try {
            await userLoginFn(email, pass);
            return true;
        }
        catch (error) {
            return false;
        }
    };
    const logout = () => {
        userLogout();
    };
    const addProduct = async (productData) => {
        try {
            setIsLoading(true);
            // Normalize for Backend
            const normalizedData = {
                ...productData,
                categoryId: productData.category,
                tags: Array.isArray(productData.tags) ? productData.tags.join(',') : productData.tags
            };
            delete normalizedData.category;
            await apiFetch('/products/admin', {
                method: 'POST',
                body: JSON.stringify(normalizedData),
            });
            toast.success("Producto creado exitosamente");
            await refreshProducts();
        }
        catch (error) {
            toast.error(`Error al crear producto: ${error.message}`);
        }
        finally {
            setIsLoading(false);
        }
    };
    const updateProduct = async (id, updatedFields) => {
        try {
            setIsLoading(true);
            // Normalize for Backend
            const normalizedData = { ...updatedFields };
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
        }
        catch (error) {
            toast.error(`Error al actualizar producto: ${error.message}`);
        }
        finally {
            setIsLoading(false);
        }
    };
    const deleteProduct = async (id) => {
        try {
            setIsLoading(true);
            await apiFetch(`/products/admin/${id}`, {
                method: 'DELETE',
            });
            toast.success("Producto eliminado exitosamente");
            await refreshProducts();
        }
        catch (error) {
            toast.error(`Error al eliminar producto: ${error.message}`);
        }
        finally {
            setIsLoading(false);
        }
    };
    const updateOrderStatus = async (id, status) => {
        try {
            await apiFetch(`/orders/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: status.toUpperCase() }),
            });
            setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
            toast.success(`Pedido marcado como ${status}`);
        }
        catch (error) {
            console.error("Error updating order status", error);
        }
    };
    return (_jsx(AdminContext.Provider, { value: {
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
            refreshCategories,
            refreshStats,
            stats,
        }, children: children }));
}
export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}
