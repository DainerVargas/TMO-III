import { useState, useEffect } from "react";
import { 
  Users, 
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
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

  if (!stats) return null;

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Dashboard</h2>
        <p className="text-muted-foreground text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>Bienvenido al panel central de TMO Suministros.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${kpi.color} text-white shadow-lg`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${
                kpi.trendUp ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"
              }`}>
                {kpi.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {kpi.trend}
              </div>
            </div>
            <div className="mt-5">
              <p className="text-muted-foreground text-[13px] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{kpi.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1" style={{ fontFamily: "Montserrat, sans-serif" }}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[16px] font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Resumen de Ventas</h3>
            <select className="bg-[#f5f7fa] border-none text-[12px] rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#0a4d8c]/10 outline-none">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesHistory || defaultSalesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0a4d8c" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0a4d8c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#94a3b8" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  tickFormatter={(val) => `S/${val/1000}k`}
                />
                <Tooltip 
                  formatter={(value: any) => [formatPrice(value), 'Ventas']}
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "none", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px"
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#0a4d8c" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-[16px] font-bold text-foreground mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>Alertas e Inventario</h3>
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
               <div className="p-2 bg-red-500 text-white rounded-lg">
                 <AlertTriangle className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[13px] font-bold text-red-900" style={{ fontFamily: "Inter, sans-serif" }}>Productos en Alerta</p>
                  <p className="text-[11px] text-red-700" style={{ fontFamily: "Inter, sans-serif" }}>{stats.lowStockProducts || 0} productos agotados o bajos</p>
               </div>
            </div>
            
            <div className="space-y-4 pt-2">
               <h4 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>Distribución de Catálogo</h4>
               {(stats.topCategories || []).map((cat, i) => (
                 <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[12px]">
                       <span className="font-medium text-foreground">{cat.label}</span>
                       <span className="text-muted-foreground">{cat.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                       <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percentage}%` }}></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Últimos Pedidos</h3>
          <button className="text-[13px] text-[#0a4d8c] font-semibold hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ fontFamily: "Inter, sans-serif" }}>
            <thead>
              <tr className="bg-[#f8f9fb] text-[12px] text-muted-foreground font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ID Pedido</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#f8f9fb] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-bold text-[#0a4d8c]">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-foreground">{order.name || order.customerName}</span>
                      <span className="text-[11px] text-muted-foreground">{order.customerDoc}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      order.status === "pending" ? "bg-amber-100 text-amber-700" :
                      order.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                      order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {order.status === "pending" ? "Pendiente" : 
                       order.status === "confirmed" ? "Confirmado" :
                       order.status === "shipped" ? "Enviado" : "Cancelado"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-bold text-foreground">{formatPrice(order.total)}</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-muted-foreground">
                    {new Date(order.date).toLocaleDateString("es-PE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
