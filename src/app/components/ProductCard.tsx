import { ShoppingCart, RefreshCw, Clock, Plus, Minus, Eye } from "lucide-react";
import { Product, formatPrice } from "./data";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { UnitToggle } from "./UnitToggle";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, selectedUnit: "box" | "unit") => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
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
    <div className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-[#0a4d8c]/20 transition-all duration-200 flex flex-col group">
      {/* Image */}
      <div className="relative aspect-square bg-[#f5f7fa] overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Stock badge */}
        <div className={`absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] border ${stockColor}`} style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
          {stockLabel}
        </div>
        {/* Recurring badge */}
        {product.isRecurring && (
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 sm:p-1.5 bg-[#0a4d8c]/90 rounded-md" title="Disponible para compra recurrente">
            <RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00bcd4]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 sm:p-3 flex flex-col flex-1">
        <p className="text-[9px] sm:text-[11px] text-muted-foreground mb-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
          {product.sku} · {product.brand}
        </p>
        <h3
          className="text-[11px] sm:text-[13.5px] text-foreground mb-1.5 sm:mb-2 line-clamp-2 cursor-pointer hover:text-[#0a4d8c] transition-colors"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, lineHeight: 1.35 }}
          onClick={() => onViewDetails(product)}
        >
          {product.name}
        </h3>

        <div className="mt-auto space-y-1.5 sm:space-y-2.5">
          {/* Delivery info */}
          <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            Entrega: {product.deliveryDays === 1 ? "Mañana" : `${product.deliveryDays} días`}
            {product.deliveryDays === 1 && (
              <span className="ml-1 text-emerald-600" style={{ fontWeight: 600 }}>Hoy mismo</span>
            )}
          </div>

          {/* Unit Toggle */}
          {hasUnitPrice && (
            <UnitToggle
              selectedUnit={selectedUnit}
              onUnitChange={setSelectedUnit}
              boxLabel={product.unit}
              unitLabel={product.unitPriceUnit!}
              size="sm"
            />
          )}

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <span
                className="text-[#0a4d8c]"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)" }}
              >
                {formatPrice(effectivePrice)}
              </span>
              <span className="text-[9px] sm:text-[11px] text-muted-foreground ml-0.5 sm:ml-1" style={{ fontFamily: "Inter, sans-serif" }}>
                /{effectiveUnitLabel}
              </span>
              {hasUnitPrice && (
                <div className="text-[8px] sm:text-[10px] text-muted-foreground mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                  {selectedUnit === "unit"
                    ? `Caja: ${formatPrice(product.price)} /${product.unit}`
                    : `Unidad: ${formatPrice(product.unitPrice!)} /${product.unitPriceUnit}`
                  }
                </div>
              )}
            </div>
            <span className="text-[9px] sm:text-[11px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
              {product.stock} disp.
            </span>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center border border-border rounded-md shrink-0">
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
              className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 text-white py-1.5 sm:py-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/25 whitespace-nowrap"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "clamp(10px, 2.5vw, 11px)",
                background: "linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%)",
              }}
            >
              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              Agregar
            </button>
          </div>

          {/* Ver más button */}
          <button
            onClick={() => onViewDetails(product)}
            className="w-full flex items-center justify-center gap-1 sm:gap-1.5 text-white py-1.5 sm:py-2 rounded-md transition-all hover:shadow-lg hover:shadow-cyan-500/25 hover:opacity-90"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "11px",
              background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 50%, #00bcd4 100%)",
            }}
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}