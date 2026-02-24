import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router";
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search,
  ExternalLink,
  User,
  Tags,
  Users,
  Box,
  History
} from "lucide-react";
import { useAdmin } from "./AdminContext";
import { useUser } from "../UserContext";
import { useMemo } from "react";
import { formatPrice } from "../data";

interface AdminLayoutProps {
  children?: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
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

  const hasPermission = (permission: string) => {
    if (user?.role === 'ADMIN') return true; // Super Admin has all
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
    if (item.id === 'profile') return true;
    return isAdmin && hasPermission(item.id);
  }), [isAdmin, userPermissions, user?.role]);

  const [readNotifIds, setReadNotifIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tmo_read_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  const [deletedNotifIds, setDeletedNotifIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tmo_deleted_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('tmo_read_notifs', JSON.stringify(readNotifIds));
  }, [readNotifIds]);

  useEffect(() => {
    localStorage.setItem('tmo_deleted_notifs', JSON.stringify(deletedNotifIds));
  }, [deletedNotifIds]);

  // Search logic
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return { products: [], orders: [] };
    const term = searchTerm.toLowerCase();
    
    return {
      products: hasPermission('products') ? products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.sku.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      ).slice(0, 4) : [],
      orders: hasPermission('orders') ? orders.filter(o => 
        o.id.toString().includes(term) || 
        (o.customerName || '').toLowerCase().includes(term) ||
        (o.customerDoc || '').includes(term)
      ).slice(0, 4) : []
    };
  }, [searchTerm, products, orders, userPermissions, user?.role]);

  // Notifications logic
  const notifications = useMemo(() => {
    interface NotifItem {
      id: string;
      type: 'warning' | 'danger' | 'info';
      title: string;
      message: string;
      time: string;
      link: string;
    }
    const items: NotifItem[] = [];
    
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

  const handleNotifClick = (notif: any) => {
    if (!readNotifIds.includes(notif.id)) {
      setReadNotifIds(prev => [...prev, notif.id]);
    }
    navigate(notif.link);
    setShowNotifications(false);
  };

  const deleteNotif = (e: React.MouseEvent, id: string) => {
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
    if (!isLoggedIn || location.pathname === '/admin' || location.pathname === '/admin/profile') return;

    const currentItem = menuItems.find(item => location.pathname.startsWith(item.href));
    if (!currentItem && menuItems.length > 0) {
      navigate(menuItems[0].href, { replace: true });
    }
  }, [location.pathname, menuItems, isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#f8f9fb] overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%)" }}
              >
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-[#0a4d8c] font-bold text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Admin TMO
              </h1>
            </div>
            <button className="lg:hidden p-1" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] transition-all group ${
                  isActive(item.href)
                    ? "bg-[#f0f7ff] text-[#0a4d8c] font-semibold"
                    : "text-muted-foreground hover:bg-[#f8f9fb] hover:text-[#0a4d8c]"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-[#0a4d8c]" : "text-muted-foreground group-hover:text-[#0a4d8c]"}`} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <Link 
              to="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] text-muted-foreground hover:bg-[#f8f9fb] hover:text-[#0a4d8c] transition-all"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <ExternalLink className="w-5 h-5" />
              Ver Tienda
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] text-red-500 hover:bg-red-50 transition-all text-left"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-muted rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:block relative">
              <div className="flex items-center gap-3 bg-[#f5f7fa] px-3.5 py-1.5 rounded-full border border-border w-80 group focus-within:ring-2 focus-within:ring-[#0a4d8c]/10 transition-all">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar productos, pedidos, categorías..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="bg-transparent border-none outline-none text-[13px] w-full"
                />
              </div>

              {showSearchResults && (searchTerm.trim() !== "") && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-border z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 border-b border-border bg-[#f8f9fb] flex justify-between items-center px-4">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Resultados de búsqueda</span>
                    <button onClick={() => setShowSearchResults(false)}><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {searchResults.products.length > 0 && (
                      <div className="p-2 border-b border-border">
                        <p className="text-[11px] font-bold text-[#0a4d8c] px-3 mb-1 uppercase">Productos</p>
                        {searchResults.products.map(p => (
                          <button key={p.id} onClick={() => { navigate('/admin/products'); setShowSearchResults(false); }} className="w-full flex items-center gap-3 p-2 hover:bg-[#f5f7fa] rounded-xl transition-colors text-left" >
                            <img src={p.image} className="w-8 h-8 rounded-lg object-contain bg-[#f8f9fb] border border-border" alt="" />
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium text-foreground truncate">{p.name}</p>
                              <p className="text-[11px] text-muted-foreground">{p.sku} · {formatPrice(p.price)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchResults.orders.length > 0 && (
                      <div className="p-2">
                        <p className="text-[11px] font-bold text-[#0a4d8c] px-3 mb-1 uppercase">Pedidos</p>
                        {searchResults.orders.map(o => (
                          <button key={o.id} onClick={() => { navigate('/admin/orders'); setShowSearchResults(false); }} className="w-full flex items-center gap-3 p-2 hover:bg-[#f5f7fa] rounded-xl transition-colors text-left" >
                            <div className="w-8 h-8 rounded-lg bg-[#f0f7ff] flex items-center justify-center">
                              <ClipboardList className="w-4 h-4 text-[#0a4d8c]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium text-foreground truncate">Pedido #{o.id}</p>
                              <p className="text-[11px] text-muted-foreground">{o.customerName} · {formatPrice(o.total)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full transition-all ${
                  showNotifications ? "bg-[#f0f7ff] text-[#0a4d8c]" : "hover:bg-[#f8f9fb] text-muted-foreground"
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-bold shadow-sm">{unreadCount}</span>}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-border z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-border flex items-center justify-between bg-[#f8f9fb]">
                    <h3 className="text-[14px] font-bold text-foreground">Notificaciones</h3>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-border">
                        {notifications.map((notif) => (
                          <div key={notif.id} className={`relative group/notif transition-colors ${readNotifIds.includes(notif.id) ? 'opacity-60 bg-white' : 'bg-[#0a4d8c]/[0.02]'}`}>
                            <button onClick={() => handleNotifClick(notif)} className="w-full p-4 pr-10 flex gap-3 text-left">
                              <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'warning' ? 'bg-amber-100 text-amber-600' : notif.type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                {notif.type === 'warning' ? <Box className="w-4 h-4" /> : notif.type === 'danger' ? <X className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[13px] font-bold text-foreground truncate">{notif.title}</p>
                                <p className="text-[12px] text-muted-foreground leading-tight line-clamp-2">{notif.message}</p>
                                <span className="text-[10px] text-muted-foreground font-medium">{notif.time}</span>
                              </div>
                            </button>
                            <button onClick={(e) => deleteNotif(e, notif.id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover/notif:opacity-100 transition-all rounded-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center"><p className="text-muted-foreground text-[13px]">No hay notificaciones</p></div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/admin/profile" className="flex items-center gap-3 pl-2 group">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold text-foreground group-hover:text-[#0a4d8c]">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#0a4d8c] text-white flex items-center justify-center font-bold text-[14px] shadow-lg">
                {user?.name?.[0] || 'A'}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
