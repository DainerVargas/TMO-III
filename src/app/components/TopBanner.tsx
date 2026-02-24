import { Truck, Clock, ShieldCheck } from "lucide-react";

export function TopBanner() {
  return (
    <div className="w-full bg-[#0a4d8c] text-white py-1.5 sm:py-2 px-3 sm:px-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-6 flex-wrap mx-auto md:mx-0">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00bcd4] shrink-0" />
            <span className="text-[11px] sm:text-[13px] tracking-wide">
              <span className="hidden sm:inline">Suministros Esenciales: Stock Garantizado y Despacho en 24h en Lima</span>
              <span className="sm:hidden">Stock Garantizado · Despacho 24h Lima</span>
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#00bcd4]" />
            <span className="text-[12px] opacity-90">Lun-Vie 8:00-18:00</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00bcd4]" />
            <span className="text-[12px] opacity-90">Garantía Total en Productos</span>
          </div>
        </div>
      </div>
    </div>
  );
}