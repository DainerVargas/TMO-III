import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router";
import { LayoutDashboard, Package, ClipboardList, Settings, LogOut, Menu, X, Bell, Search, ExternalLink, User, Tags, Users, Box, History } from "lucide-react";
import { useAdmin } from "./AdminContext";
import { useUser } from "../UserContext";
import { useMemo } from "react";
import { formatPrice } from "../data";
export function AdminLayout({ children }) {
    const { isLoggedIn, logout, stats, products, orders } = useAdmin();
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    // Constants & Perms
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';
    const userPermissions = user?.permissions || [];
    const hasPermission = (permission) => {
        if (user?.role === 'ADMIN')
            return true; // Super Admin has all
        return userPermissions.includes(permission);
    };
    const menuItems = useMemo(() => [
        { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", id: 'dashboard' },
        { label: "Categorías", icon: Tags, href: "/admin/categories", id: 'categories' },
        { label: "Productos", icon: Package, href: "/admin/products", id: 'products' },
        { label: "Pedidos", icon: ClipboardList, href: "/admin/orders", id: 'orders' },
        { label: "Usuarios", icon: Users, href: "/admin/users", id: 'users' },
        { label: "Inventario", icon: Box, href: "/admin/inventory", id: 'inventory' },
        { label: "Logs/Auditoría", icon: History, href: "/admin/audit", id: 'audit' },
        { label: "Configuración", icon: Settings, href: "/admin/settings", id: 'settings' },
        { label: "Mi Perfil", icon: User, href: "/admin/profile", id: 'profile' },
    ].filter(item => {
        if (item.id === 'profile')
            return true;
        return isAdmin && hasPermission(item.id);
    }), [isAdmin, userPermissions, user?.role]);
    const [readNotifIds, setReadNotifIds] = useState(() => {
        try {
            const saved = localStorage.getItem('tmo_read_notifs');
            return saved ? JSON.parse(saved) : [];
        }
        catch {
            return [];
        }
    });
    const [deletedNotifIds, setDeletedNotifIds] = useState(() => {
        try {
            const saved = localStorage.getItem('tmo_deleted_notifs');
            return saved ? JSON.parse(saved) : [];
        }
        catch {
            return [];
        }
    });
    useEffect(() => {
        localStorage.setItem('tmo_read_notifs', JSON.stringify(readNotifIds));
    }, [readNotifIds]);
    useEffect(() => {
        localStorage.setItem('tmo_deleted_notifs', JSON.stringify(deletedNotifIds));
    }, [deletedNotifIds]);
    // Search logic
    const searchResults = useMemo(() => {
        if (!searchTerm.trim())
            return { products: [], orders: [] };
        const term = searchTerm.toLowerCase();
        return {
            products: hasPermission('products') ? products.filter(p => p.name.toLowerCase().includes(term) ||
                p.sku.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term)).slice(0, 4) : [],
            orders: hasPermission('orders') ? orders.filter(o => o.id.toString().includes(term) ||
                (o.customerName || '').toLowerCase().includes(term) ||
                (o.customerDoc || '').includes(term)).slice(0, 4) : []
        };
    }, [searchTerm, products, orders, userPermissions, user?.role]);
    // Notifications logic
    const notifications = useMemo(() => {
        const items = [];
        // Solo mostrar si tiene permiso de productos o inventario
        if (hasPermission('products') || hasPermission('inventory')) {
            const lowStock = products.filter(p => p.stock <= 10 && p.isActive !== false);
            lowStock.forEach(p => items.push({
                id: `stock-${p.id}`,
                type: 'warning',
                title: 'Stock Bajo',
                message: `${p.name} tiene solo ${p.stock} unidades.`,
                time: 'Inventario',
                link: '/admin/products'
            }));
        }
        // Solo mostrar si tiene permiso de pedidos
        if (hasPermission('orders')) {
            const pending = orders.filter(o => o.status === 'pending');
            pending.forEach(o => items.push({
                id: `order-${o.id}`,
                type: 'info',
                title: 'Pedido Pendiente',
                message: `Nuevo pedido de ${o.customerName || 'Cliente'} por ${formatPrice(o.total)}`,
                time: o.date ? new Date(o.date).toLocaleDateString() : 'Reciente',
                link: '/admin/orders'
            }));
            const cancelled = orders.filter(o => o.status === 'cancelled');
            cancelled.forEach(o => items.push({
                id: `cancelled-${o.id}`,
                type: 'danger',
                title: 'Pedido Cancelado',
                message: `El pedido #${o.id} ha sido cancelado.`,
                time: 'Alerta',
                link: '/admin/orders'
            }));
        }
        return items
            .filter(item => !deletedNotifIds.includes(item.id))
            .sort((a, b) => b.id.localeCompare(a.id))
            .slice(0, 10);
    }, [products, orders, deletedNotifIds, userPermissions, user?.role]);
    const unreadCount = useMemo(() => {
        return notifications.filter(n => !readNotifIds.includes(n.id)).length;
    }, [notifications, readNotifIds]);
    const handleNotifClick = (notif) => {
        if (!readNotifIds.includes(notif.id)) {
            setReadNotifIds(prev => [...prev, notif.id]);
        }
        navigate(notif.link);
        setShowNotifications(false);
    };
    const deleteNotif = (e, id) => {
        e.stopPropagation();
        setDeletedNotifIds(prev => [...prev, id]);
    };
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login", { replace: true });
        }
    }, [isLoggedIn, navigate]);
    // Route protection
    useEffect(() => {
        if (!isLoggedIn || location.pathname === '/admin' || location.pathname === '/admin/profile')
            return;
        const currentItem = menuItems.find(item => location.pathname.startsWith(item.href));
        if (!currentItem && menuItems.length > 0) {
            navigate(menuItems[0].href, { replace: true });
        }
    }, [location.pathname, menuItems, isLoggedIn, navigate]);
    if (!isLoggedIn)
        return null;
    const isActive = (path) => location.pathname === path;
    return (_jsxs("div", { className: "flex h-screen bg-[#f8f9fb] overflow-hidden", children: [isSidebarOpen && (_jsx("div", { className: "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity", onClick: () => setIsSidebarOpen(false) })), _jsx("aside", { className: `fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`, children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "p-6 border-b border-border flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl flex items-center justify-center shadow-lg", style: { background: "linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%)" }, children: _jsx(Package, { className: "w-5 h-5 text-white" }) }), _jsx("h1", { className: "text-[#0a4d8c] font-bold text-lg", style: { fontFamily: "Montserrat, sans-serif" }, children: "Admin TMO" })] }), _jsx("button", { className: "lg:hidden p-1", onClick: () => setIsSidebarOpen(false), children: _jsx(X, { className: "w-5 h-5 text-muted-foreground" }) })] }), _jsx("nav", { className: "flex-1 px-4 py-6 space-y-1 overflow-y-auto", children: menuItems.map((item) => (_jsxs(Link, { to: item.href, className: `flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] transition-all group ${isActive(item.href)
                                    ? "bg-[#f0f7ff] text-[#0a4d8c] font-semibold"
                                    : "text-muted-foreground hover:bg-[#f8f9fb] hover:text-[#0a4d8c]"}`, style: { fontFamily: "Inter, sans-serif" }, onClick: () => setIsSidebarOpen(false), children: [_jsx(item.icon, { className: `w-5 h-5 ${isActive(item.href) ? "text-[#0a4d8c]" : "text-muted-foreground group-hover:text-[#0a4d8c]"}` }), item.label] }, item.href))) }), _jsxs("div", { className: "p-4 border-t border-border", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] text-muted-foreground hover:bg-[#f8f9fb] hover:text-[#0a4d8c] transition-all", style: { fontFamily: "Inter, sans-serif" }, children: [_jsx(ExternalLink, { className: "w-5 h-5" }), "Ver Tienda"] }), _jsxs("button", { onClick: logout, className: "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] text-red-500 hover:bg-red-50 transition-all text-left", style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: [_jsx(LogOut, { className: "w-5 h-5" }), "Cerrar Sesi\u00F3n"] })] })] }) }), _jsxs("div", { className: "flex-1 flex flex-col h-full overflow-hidden", children: [_jsxs("header", { className: "h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { className: "lg:hidden p-2 hover:bg-muted rounded-lg", onClick: () => setIsSidebarOpen(true), children: _jsx(Menu, { className: "w-5 h-5" }) }), _jsxs("div", { className: "hidden md:block relative", children: [_jsxs("div", { className: "flex items-center gap-3 bg-[#f5f7fa] px-3.5 py-1.5 rounded-full border border-border w-80 group focus-within:ring-2 focus-within:ring-[#0a4d8c]/10 transition-all", children: [_jsx(Search, { className: "w-4 h-4 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Buscar productos, pedidos, categor\u00EDas...", value: searchTerm, onChange: (e) => {
                                                            setSearchTerm(e.target.value);
                                                            setShowSearchResults(true);
                                                        }, onFocus: () => setShowSearchResults(true), className: "bg-transparent border-none outline-none text-[13px] w-full" })] }), showSearchResults && (searchTerm.trim() !== "") && (_jsxs("div", { className: "absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-border z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200", children: [_jsxs("div", { className: "p-2 border-b border-border bg-[#f8f9fb] flex justify-between items-center px-4", children: [_jsx("span", { className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wider", children: "Resultados de b\u00FAsqueda" }), _jsx("button", { onClick: () => setShowSearchResults(false), children: _jsx(X, { className: "w-3.5 h-3.5 text-muted-foreground" }) })] }), _jsxs("div", { className: "max-h-[400px] overflow-y-auto", children: [searchResults.products.length > 0 && (_jsxs("div", { className: "p-2 border-b border-border", children: [_jsx("p", { className: "text-[11px] font-bold text-[#0a4d8c] px-3 mb-1 uppercase", children: "Productos" }), searchResults.products.map(p => (_jsxs("button", { onClick: () => { navigate('/admin/products'); setShowSearchResults(false); }, className: "w-full flex items-center gap-3 p-2 hover:bg-[#f5f7fa] rounded-xl transition-colors text-left", children: [_jsx("img", { src: p.image, className: "w-8 h-8 rounded-lg object-contain bg-[#f8f9fb] border border-border", alt: "" }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-[13px] font-medium text-foreground truncate", children: p.name }), _jsxs("p", { className: "text-[11px] text-muted-foreground", children: [p.sku, " \u00B7 ", formatPrice(p.price)] })] })] }, p.id)))] })), searchResults.orders.length > 0 && (_jsxs("div", { className: "p-2", children: [_jsx("p", { className: "text-[11px] font-bold text-[#0a4d8c] px-3 mb-1 uppercase", children: "Pedidos" }), searchResults.orders.map(o => (_jsxs("button", { onClick: () => { navigate('/admin/orders'); setShowSearchResults(false); }, className: "w-full flex items-center gap-3 p-2 hover:bg-[#f5f7fa] rounded-xl transition-colors text-left", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-[#f0f7ff] flex items-center justify-center", children: _jsx(ClipboardList, { className: "w-4 h-4 text-[#0a4d8c]" }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "text-[13px] font-medium text-foreground truncate", children: ["Pedido #", o.id] }), _jsxs("p", { className: "text-[11px] text-muted-foreground", children: [o.customerName, " \u00B7 ", formatPrice(o.total)] })] })] }, o.id)))] }))] })] }))] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowNotifications(!showNotifications), className: `relative p-2 rounded-full transition-all ${showNotifications ? "bg-[#f0f7ff] text-[#0a4d8c]" : "hover:bg-[#f8f9fb] text-muted-foreground"}`, children: [_jsx(Bell, { className: "w-5 h-5" }), unreadCount > 0 && _jsx("span", { className: "absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-bold shadow-sm", children: unreadCount })] }), showNotifications && (_jsxs("div", { className: "absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-border z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200", children: [_jsx("div", { className: "p-4 border-b border-border flex items-center justify-between bg-[#f8f9fb]", children: _jsx("h3", { className: "text-[14px] font-bold text-foreground", children: "Notificaciones" }) }), _jsx("div", { className: "max-h-[350px] overflow-y-auto", children: notifications.length > 0 ? (_jsx("div", { className: "divide-y divide-border", children: notifications.map((notif) => (_jsxs("div", { className: `relative group/notif transition-colors ${readNotifIds.includes(notif.id) ? 'opacity-60 bg-white' : 'bg-[#0a4d8c]/[0.02]'}`, children: [_jsxs("button", { onClick: () => handleNotifClick(notif), className: "w-full p-4 pr-10 flex gap-3 text-left", children: [_jsx("div", { className: `mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'warning' ? 'bg-amber-100 text-amber-600' : notif.type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`, children: notif.type === 'warning' ? _jsx(Box, { className: "w-4 h-4" }) : notif.type === 'danger' ? _jsx(X, { className: "w-4 h-4" }) : _jsx(ClipboardList, { className: "w-4 h-4" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-[13px] font-bold text-foreground truncate", children: notif.title }), _jsx("p", { className: "text-[12px] text-muted-foreground leading-tight line-clamp-2", children: notif.message }), _jsx("span", { className: "text-[10px] text-muted-foreground font-medium", children: notif.time })] })] }), _jsx("button", { onClick: (e) => deleteNotif(e, notif.id), className: "absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover/notif:opacity-100 transition-all rounded-lg", children: _jsx(X, { className: "w-4 h-4" }) })] }, notif.id))) })) : (_jsx("div", { className: "p-10 text-center", children: _jsx("p", { className: "text-muted-foreground text-[13px]", children: "No hay notificaciones" }) })) })] }))] }), _jsxs(Link, { to: "/admin/profile", className: "flex items-center gap-3 pl-2 group", children: [_jsxs("div", { className: "text-right hidden sm:block", children: [_jsx("p", { className: "text-[13px] font-bold text-foreground group-hover:text-[#0a4d8c]", children: user?.name || 'Admin' }), _jsx("p", { className: "text-[11px] text-muted-foreground capitalize", children: user?.role?.toLowerCase() })] }), _jsx("div", { className: "w-9 h-9 rounded-full bg-[#0a4d8c] text-white flex items-center justify-center font-bold text-[14px] shadow-lg", children: user?.name?.[0] || 'A' })] })] })] }), _jsx("main", { className: "flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8", children: _jsx("div", { className: "max-w-7xl mx-auto", children: children || _jsx(Outlet, {}) }) })] })] }));
}
