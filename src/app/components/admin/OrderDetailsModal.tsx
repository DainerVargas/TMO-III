import { X, Mail, Phone, MapPin, Calendar, CreditCard, Hash, Package, FileText, Download } from "lucide-react";
import { Order, OrderItem } from "./AdminContext";
import { formatPrice } from "../data";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const getStatusStyle = (status: string) => {
    const config = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      shipped: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return config[status as keyof typeof config] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-[#f8f9fb] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0a4d8c] text-white rounded-xl shadow-lg shadow-blue-500/20">
               <FileText className="w-5 h-5" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>
                 Detalles del Pedido
               </h3>
               <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">{order.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Status & Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#f8f9fb] border border-border">
               <p className="text-[11px] font-bold text-muted-foreground uppercase">Estado Actual</p>
               <div className={`inline-block px-3 py-1 rounded-full text-[12px] font-bold border ${getStatusStyle(order.status)}`}>
                  {order.status.toUpperCase()}
               </div>
            </div>
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#f8f9fb] border border-border">
               <p className="text-[11px] font-bold text-muted-foreground uppercase">Fecha de Solicitud</p>
               <div className="flex items-center gap-2 text-[14px] font-bold text-foreground">
                  <Calendar className="w-4 h-4 text-[#0a4d8c]" />
                  {new Date(order.date).toLocaleDateString("es-PE", { dateStyle: "long" })}
               </div>
            </div>
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#f8f9fb] border border-border">
               <p className="text-[11px] font-bold text-muted-foreground uppercase">Método de Pago</p>
               <div className="flex items-center gap-2 text-[14px] font-bold text-foreground">
                  <CreditCard className="w-4 h-4 text-[#0a4d8c]" />
                  Transferencia / Cotización
               </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-4">
             <h4 className="text-[13px] font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-[#0a4d8c]" /> Información del Cliente
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-border rounded-2xl p-6 shadow-sm">
                <div className="space-y-3">
                   <div>
                      <p className="text-[11px] font-bold text-muted-foreground">NOMBRE / EMPRESA</p>
                      <p className="text-[15px] font-bold text-foreground">{order.customerName}</p>
                   </div>
                   <div>
                      <p className="text-[11px] font-bold text-muted-foreground">RUC / DNI</p>
                      <p className="text-[14px] font-medium text-foreground">{order.customerDoc}</p>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-[#0a4d8c] rounded-lg">
                         <Mail className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-[11px] font-bold text-muted-foreground">EMAIL</p>
                         <p className="text-[14px] font-medium text-foreground">{order.customerEmail}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                         <Phone className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-[11px] font-bold text-muted-foreground">TELÉFONO</p>
                         <p className="text-[14px] font-medium text-foreground">{order.customerPhone}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
             <h4 className="text-[13px] font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#0a4d8c]" /> Suministros Solicitados
             </h4>
             <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                   <thead className="bg-[#f8f9fb] border-b border-border">
                      <tr className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                         <th className="px-6 py-3">Descripción</th>
                         <th className="px-6 py-3 text-center">Cant.</th>
                         <th className="px-6 py-3 text-right">Unitario</th>
                         <th className="px-6 py-3 text-right">Subtotal</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                      {order.items.map((item, idx) => (
                         <tr key={idx} className="text-[13px] hover:bg-[#f8f9fb]/50 transition-colors">
                            <td className="px-6 py-4">
                               <div className="flex flex-col">
                                  <span className="font-bold text-foreground">{(item as any).name || 'Producto'}</span>
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold">{(item as any).product?.sku || '-'}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-center font-bold">{item.quantity} <span className="text-[10px] text-muted-foreground font-normal">{(item as any).unit || 'u'}</span></td>
                            <td className="px-6 py-4 text-right text-muted-foreground">{formatPrice(item.price)}</td>
                            <td className="px-6 py-4 text-right font-bold text-[#0a4d8c]">{formatPrice(item.price * item.quantity)}</td>
                         </tr>
                      ))}
                   </tbody>
                   <tfoot className="bg-[#f0f7ff]/50">
                      <tr>
                         <td colSpan={3} className="px-6 py-4 text-right text-[14px] font-bold text-foreground">TOTAL DEL PEDIDO</td>
                         <td className="px-6 py-4 text-right text-[18px] font-bold text-[#0a4d8c]">{formatPrice(order.total)}</td>
                      </tr>
                   </tfoot>
                </table>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-border bg-[#f8f9fb] flex justify-between items-center shrink-0">
           <button className="flex items-center gap-2 text-[13px] font-bold text-[#0a4d8c] hover:underline">
              <Download className="w-4 h-4" /> Descargar PDF de Cotización
           </button>
           <button 
             onClick={onClose}
             className="bg-[#0a4d8c] text-white px-8 py-2.5 rounded-xl font-bold text-[14px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
           >
             Cerrar
           </button>
        </div>
      </div>
    </div>
  );
}
