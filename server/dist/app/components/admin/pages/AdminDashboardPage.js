import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Users, ShoppingBag, Clock, TrendingUp, AlertTriangle, ArrowUpRight } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useAdmin } from "../AdminContext";
import { formatPrice } from "../../data";
// Fallback data if API is empty
const defaultSalesData = [
    { name: "Lun", sales: 0, orders: 0 },
    { name: "Mar", sales: 0, orders: 0 },
    { name: "Mie", sales: 0, orders: 0 },
    { name: "Jue", sales: 0, orders: 0 },
    { name: "Vie", sales: 0, orders: 0 },
    { name: "Sab", sales: 0, orders: 0 },
    { name: "Dom", sales: 0, orders: 0 },
];
export function AdminDashboardPage() {
    const { stats, orders } = useAdmin();
    const [activeVisitors, setActiveVisitors] = useState(12);
    // Real-time counter effect
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveVisitors(prev => {
                const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                return Math.max(5, Math.min(45, prev + change));
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);
    if (!stats)
        return null;
    const kpis = [
        {
            label: "Productos",
            value: stats.totalProducts || 0,
            icon: ShoppingBag,
            color: "bg-blue-500",
            trend: `${stats.activeProducts || 0} activos`,
            trendUp: true
        },
        {
            label: "Pedidos Pendientes",
            value: stats.pendingOrders || 0,
            icon: Clock,
            color: "bg-amber-500",
            trend: "Requieren atención",
            trendUp: false
        },
        {
            label: "Valor del Inventario",
            value: formatPrice(stats.totalStockValue || 0),
            icon: TrendingUp,
            color: "bg-emerald-500",
            trend: stats.salesGrowth || "+0%",
            trendUp: true
        },
        {
            label: "Usuarios Totales",
            value: stats.totalUsers || 0,
            icon: Users,
            color: "bg-indigo-500",
            trend: "Registrados",
            trendUp: true
        },
    ];
    return (_jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-foreground", style: { fontFamily: "Montserrat, sans-serif" }, children: "Dashboard" }), _jsx("p", { className: "text-muted-foreground text-[14px]", style: { fontFamily: "Inter, sans-serif" }, children: "Bienvenido al panel central de TMO Suministros." })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: kpis.map((kpi, i) => (_jsxs("div", { className: "bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("div", { className: `p-3 rounded-xl ${kpi.color} text-white shadow-lg`, children: _jsx(kpi.icon, { className: "w-6 h-6" }) }), _jsxs("div", { className: `flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${kpi.trendUp ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"}`, children: [kpi.trendUp ? _jsx(ArrowUpRight, { className: "w-3 h-3" }) : _jsx(Clock, { className: "w-3 h-3" }), kpi.trend] })] }), _jsxs("div", { className: "mt-5", children: [_jsx("p", { className: "text-muted-foreground text-[13px] font-medium", style: { fontFamily: "Inter, sans-serif" }, children: kpi.label }), _jsx("p", { className: "text-2xl font-bold text-foreground mt-1", style: { fontFamily: "Montserrat, sans-serif" }, children: kpi.value })] })] }, i))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 bg-white p-6 rounded-2xl border border-border shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h3", { className: "text-[16px] font-bold text-foreground", style: { fontFamily: "Montserrat, sans-serif" }, children: "Resumen de Ventas" }), _jsxs("select", { className: "bg-[#f5f7fa] border-none text-[12px] rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#0a4d8c]/10 outline-none", children: [_jsx("option", { children: "\u00DAltimos 7 d\u00EDas" }), _jsx("option", { children: "\u00DAltimos 30 d\u00EDas" })] })] }), _jsx("div", { className: "h-[300px] w-full", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: stats.salesHistory || defaultSalesData, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "colorSales", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#0a4d8c", stopOpacity: 0.1 }), _jsx("stop", { offset: "95%", stopColor: "#0a4d8c", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }), _jsx(XAxis, { dataKey: "name", axisLine: false, tickLine: false, tick: { fontSize: 12, fill: "#94a3b8" }, dy: 10 }), _jsx(YAxis, { axisLine: false, tickLine: false, tick: { fontSize: 12, fill: "#94a3b8" }, tickFormatter: (val) => `S/${val / 1000}k` }), _jsx(Tooltip, { formatter: (value) => [formatPrice(value), 'Ventas'], contentStyle: {
                                                    borderRadius: "12px",
                                                    border: "none",
                                                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                                    fontFamily: "Inter, sans-serif",
                                                    fontSize: "12px"
                                                } }), _jsx(Area, { type: "monotone", dataKey: "sales", stroke: "#0a4d8c", strokeWidth: 3, fillOpacity: 1, fill: "url(#colorSales)" })] }) }) })] }), _jsxs("div", { className: "bg-white p-6 rounded-2xl border border-border shadow-sm", children: [_jsx("h3", { className: "text-[16px] font-bold text-foreground mb-6", style: { fontFamily: "Montserrat, sans-serif" }, children: "Alertas e Inventario" }), _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-100", children: [_jsx("div", { className: "p-2 bg-red-500 text-white rounded-lg", children: _jsx(AlertTriangle, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[13px] font-bold text-red-900", style: { fontFamily: "Inter, sans-serif" }, children: "Productos en Alerta" }), _jsxs("p", { className: "text-[11px] text-red-700", style: { fontFamily: "Inter, sans-serif" }, children: [stats.lowStockProducts || 0, " productos agotados o bajos"] })] })] }), _jsxs("div", { className: "space-y-4 pt-2", children: [_jsx("h4", { className: "text-[12px] font-bold text-muted-foreground uppercase tracking-wider", style: { fontFamily: "Inter, sans-serif" }, children: "Distribuci\u00F3n de Cat\u00E1logo" }), (stats.topCategories || []).map((cat, i) => (_jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "flex items-center justify-between text-[12px]", children: [_jsx("span", { className: "font-medium text-foreground", children: cat.label }), _jsxs("span", { className: "text-muted-foreground", children: [cat.percentage, "%"] })] }), _jsx("div", { className: "h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden", children: _jsx("div", { className: `h-full ${cat.color} rounded-full`, style: { width: `${cat.percentage}%` } }) })] }, i)))] })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-border shadow-sm overflow-hidden", children: [_jsxs("div", { className: "p-6 border-b border-border flex items-center justify-between", children: [_jsx("h3", { className: "text-[16px] font-bold text-foreground", style: { fontFamily: "Montserrat, sans-serif" }, children: "\u00DAltimos Pedidos" }), _jsx("button", { className: "text-[13px] text-[#0a4d8c] font-semibold hover:underline", style: { fontFamily: "Inter, sans-serif" }, children: "Ver todos" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left", style: { fontFamily: "Inter, sans-serif" }, children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-[#f8f9fb] text-[12px] text-muted-foreground font-bold uppercase tracking-wider", children: [_jsx("th", { className: "px-6 py-4", children: "ID Pedido" }), _jsx("th", { className: "px-6 py-4", children: "Cliente" }), _jsx("th", { className: "px-6 py-4", children: "Estado" }), _jsx("th", { className: "px-6 py-4", children: "Total" }), _jsx("th", { className: "px-6 py-4", children: "Fecha" })] }) }), _jsx("tbody", { className: "divide-y divide-border", children: orders.slice(0, 5).map((order) => (_jsxs("tr", { className: "hover:bg-[#f8f9fb] transition-colors group", children: [_jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "text-[13px] font-bold text-[#0a4d8c]", children: order.id }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-[13px] font-bold text-foreground", children: order.name || order.customerName }), _jsx("span", { className: "text-[11px] text-muted-foreground", children: order.customerDoc })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-2.5 py-1 rounded-full text-[11px] font-bold ${order.status === "pending" ? "bg-amber-100 text-amber-700" :
                                                        order.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                                                            order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                                                                "bg-slate-100 text-slate-700"}`, children: order.status === "pending" ? "Pendiente" :
                                                        order.status === "confirmed" ? "Confirmado" :
                                                            order.status === "shipped" ? "Enviado" : "Cancelado" }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "text-[13px] font-bold text-foreground", children: formatPrice(order.total) }) }), _jsx("td", { className: "px-6 py-4 text-[13px] text-muted-foreground", children: new Date(order.date).toLocaleDateString("es-PE") })] }, order.id))) })] }) })] })] }));
}
