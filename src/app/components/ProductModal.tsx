import { X, ShoppingCart, Clock, Package, RefreshCw, Truck, Plus, Minus, CheckCircle, ArrowRight } from "lucide-react";
import { Product, products, formatPrice, categories } from "./data";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { UnitToggle } from "./UnitToggle";
import { useState } from "react";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedUnit: "box" | "unit") => void;
  onViewProduct?: (product: Product) => void;
}

export function ProductModal({ product, onClose, onAddToCart, onViewProduct }: ProductModalProps) {
  const [quantity, setQuantity] = useState(product.minOrder);
  const [recurringEnabled, setRecurringEnabled] = useState(false);
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

  // Cross-selling: products from OTHER categories (stock básico cross-category)
  const crossSell = products
    .filter((p) => p.id !== product.id && p.category !== product.category)
    .slice(0, 3);

  const getCategoryName = (catId: string) =>
    categories.find((c) => c.id === catId)?.name || catId;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + product.deliveryDays);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-xl sm:rounded-2xl w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-border">
          <p className="text-[11px] sm:text-[12px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
            {product.sku}
          </p>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Image */}
            <div className="relative rounded-xl overflow-hidden bg-[#f5f7fa] aspect-square">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[12px] border ${stockColor}`} style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                {stockLabel}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <span className="text-[12px] text-[#0a4d8c] mb-1" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                {product.brand}
              </span>
              <h2
                className="text-foreground mb-3"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.3 }}
              >
                {product.name}
              </h2>
              <p className="text-[13px] text-muted-foreground mb-4" style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
                {product.description}
              </p>

              {/* Key info cards */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[#f0f7ff] rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Truck className="w-3.5 h-3.5 text-[#0a4d8c]" />
                    <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>Entrega estimada</span>
                  </div>
                  <span className="text-[13px] text-[#0a4d8c]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                    {deliveryDate.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                </div>
                <div className="bg-[#f0f7ff] rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Package className="w-3.5 h-3.5 text-[#0a4d8c]" />
                    <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>Disponible en almacén</span>
                  </div>
                  <span className="text-[13px] text-[#0a4d8c]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                    {product.stock} {product.unit}s
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {Array.isArray(product.tags) && product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-[#f5f7fa] text-muted-foreground text-[11px] rounded-md"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Unit Toggle */}
              {hasUnitPrice && (
                <div className="mb-3">
                  <p className="text-[11px] text-muted-foreground mb-1.5" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                    Comprar por:
                  </p>
                  <UnitToggle
                    selectedUnit={selectedUnit}
                    onUnitChange={setSelectedUnit}
                    boxLabel={product.unit}
                    unitLabel={product.unitPriceUnit!}
                    size="md"
                  />
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                <span
                  className="text-[#0a4d8c]"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "1.5rem" }}
                >
                  {formatPrice(effectivePrice)}
                </span>
                <span className="text-[13px] text-muted-foreground ml-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  /{effectiveUnitLabel}
                </span>
                {hasUnitPrice && (
                  <div className="text-[12px] text-muted-foreground mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    {selectedUnit === "unit"
                      ? `Precio por ${product.unit}: ${formatPrice(product.price)}`
                      : `Precio por ${product.unitPriceUnit}: ${formatPrice(product.unitPrice!)}`
                    }
                  </div>
                )}
              </div>

              {/* Recurring purchase option */}
              {product.isRecurring && (
                <label className="flex items-center gap-3 p-3 bg-[#f0f7ff] rounded-lg mb-4 cursor-pointer border border-[#0a4d8c]/10 hover:border-[#0a4d8c]/20 transition-colors">
                  <input
                    type="checkbox"
                    checked={recurringEnabled}
                    onChange={(e) => setRecurringEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#0a4d8c]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-[#0a4d8c]" />
                      <span className="text-[13px] text-[#0a4d8c]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                        Compra Recurrente
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      Programar pedido mensual automático
                    </p>
                  </div>
                </label>
              )}

              {/* Quantity + Add */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(product.minOrder, quantity - 1))}
                    className="px-2.5 py-2 hover:bg-[#f0f7ff] transition-colors rounded-l-lg"
                  >
                    <Minus className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(product.minOrder, parseInt(e.target.value) || product.minOrder))}
                    className="w-14 text-center text-[14px] border-x border-border py-2 bg-transparent"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    min={product.minOrder}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-2 hover:bg-[#f0f7ff] transition-colors rounded-r-lg"
                  >
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    onAddToCart(product, quantity, selectedUnit);
                    onClose();
                  }}
                  disabled={product.stockStatus === "out-of-stock"}
                  className="flex-1 flex items-center justify-center gap-2 text-white py-2.5 rounded-lg transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-cyan-500/25"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                    fontSize: "14px",
                    background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 50%, #00bcd4 100%)",
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>

          {/* Cross-selling */}
          {crossSell.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h3
                className="text-foreground mb-1"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.95rem" }}
              >
                Otros usuarios también compraron para su stock básico
              </h3>
              <p className="text-[12px] text-muted-foreground mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                Complementa tu pedido con productos de otras categorías
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {crossSell.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col gap-2 p-3 bg-[#f5f7fa] rounded-lg border border-transparent hover:border-[#0a4d8c]/15 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-border">
                        <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded bg-[#0a4d8c]/10 text-[#0a4d8c]"
                          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                        >
                          {getCategoryName(p.category)}
                        </span>
                        <p className="text-[12px] text-foreground truncate mt-1" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                          {p.name}
                        </p>
                        <p className="text-[13px] text-[#0a4d8c]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
                          {formatPrice(p.price)}
                          <span className="text-[10px] text-muted-foreground ml-0.5" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                            /{p.unit}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onViewProduct?.(p)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-md text-white text-[12px] transition-all hover:opacity-90"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 100%)",
                      }}
                    >
                      Ver producto
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}