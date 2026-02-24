import { ShoppingCart, RefreshCw, Clock, Plus, Minus, Eye } from "lucide-react";
import { Product, formatPrice } from "./data";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { UnitToggle } from "./UnitToggle";
import { useState } from "react";

interface ProductListItemProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, selectedUnit: "box" | "unit") => void;
  onViewDetails: (product: Product) => void;
}

export function ProductListItem({ product, onAddToCart, onViewDetails }: ProductListItemProps) {
  const [quantity, setQuantity] = useState(product.minOrder);
  const hasUnitPrice = product.unitPrice != null && product.unitPriceUnit;
  const [selectedUnit, setSelectedUnit] = useState<"box" | "unit">("box");

  const effectivePrice = selectedUnit === "unit" && product.unitPrice != null ? product.unitPrice : product.price;
  const effectiveUnitLabel = selectedUnit === "unit" && product.unitPriceUnit ? product.unitPriceUnit : product.unit;

  const stockColor =
    product.stockStatus === "in-stock"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : product.stockStatus === "low-stock"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-red-50 text-red-700 border-red-200";

  const stockLabel =
    product.stockStatus === "in-stock"
      ? "En Stock"
      : product.stockStatus === "low-stock"
      ? "Últimas Unidades"
      : "Agotado";

  return (
    <div className="bg-white border border-border rounded-lg hover:shadow-sm hover:border-[#0a4d8c]/20 transition-all duration-200 p-2 sm:p-3 flex items-center gap-2 sm:gap-4">
      {/* Image */}
      <div
        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg bg-[#f5f7fa] overflow-hidden shrink-0 cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-1"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
                {product.sku}
              </span>
              <span className={`px-1.5 py-0 rounded text-[10px] border ${stockColor}`} style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                {stockLabel}
              </span>
              {product.isRecurring && (
                <span className="flex items-center gap-1 text-[10px] text-[#0a4d8c]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                  <RefreshCw className="w-2.5 h-2.5" />
                  Recurrente
                </span>
              )}
            </div>
            <h3
              className="text-[13.5px] text-foreground truncate cursor-pointer hover:text-[#0a4d8c] transition-colors"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              onClick={() => onViewDetails(product)}
            >
              {product.name}
            </h3>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
                {product.brand}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
                <Clock className="w-2.5 h-2.5" />
                {product.deliveryDays === 1 ? "Entrega mañana" : `${product.deliveryDays} días`}
              </span>
              <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
                {product.stock} disponibles
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Price + Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Unit toggle + Price */}
        <div className="text-right hidden md:block space-y-1">
          {hasUnitPrice && (
            <UnitToggle
              selectedUnit={selectedUnit}
              onUnitChange={setSelectedUnit}
              boxLabel={product.unit}
              unitLabel={product.unitPriceUnit!}
              size="sm"
            />
          )}
          <div>
            <span
              className="text-[#0a4d8c] block"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1rem" }}
            >
              {formatPrice(effectivePrice)}
            </span>
            <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
              /{effectiveUnitLabel}
            </span>
          </div>
        </div>
        <div className="flex items-center border border-border rounded-md">
          <button
            onClick={() => setQuantity(Math.max(product.minOrder, quantity - 1))}
            className="px-1 sm:px-1.5 py-0.5 sm:py-1 hover:bg-[#f0f7ff] transition-colors rounded-l-md"
          >
            <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(product.minOrder, parseInt(e.target.value) || product.minOrder))}
            className="w-7 sm:w-10 text-center text-[11px] sm:text-[13px] border-x border-border py-0.5 sm:py-1 bg-transparent"
            style={{ fontFamily: "Inter, sans-serif" }}
            min={product.minOrder}
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-1 sm:px-1.5 py-0.5 sm:py-1 hover:bg-[#f0f7ff] transition-colors rounded-r-md"
          >
            <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
          </button>
        </div>
        <button
          onClick={() => onAddToCart(product, quantity, selectedUnit)}
          disabled={product.stockStatus === "out-of-stock"}
          className="flex items-center gap-1 sm:gap-1.5 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-cyan-500/25 whitespace-nowrap"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "clamp(10px, 2.5vw, 12px)",
            background: "linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%)",
          }}
        >
          <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span>Agregar</span>
        </button>
        <button
          onClick={() => onViewDetails(product)}
          className="flex items-center gap-1 sm:gap-1.5 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-all hover:shadow-lg hover:shadow-cyan-500/25 hover:opacity-90 whitespace-nowrap"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "clamp(10px, 2.5vw, 12px)",
            background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 50%, #00bcd4 100%)",
          }}
        >
          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span>Ver más</span>
        </button>
      </div>
    </div>
  );
}