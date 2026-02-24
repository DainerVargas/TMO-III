import { X, Plus, Minus, Trash2, ShoppingCart, Truck, ShieldCheck, ArrowRight, Package } from "lucide-react";
import { Product, formatPrice } from "./data";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUnit: "box" | "unit";
}

export function getCartKey(productId: string, selectedUnit: "box" | "unit") {
  return `${productId}-${selectedUnit}`;
}

export function getItemPrice(item: CartItem): number {
  if (item.selectedUnit === "unit" && item.product.unitPrice != null) {
    return item.product.unitPrice;
  }
  return item.product.price;
}

export function getItemUnitLabel(item: CartItem): string {
  if (item.selectedUnit === "unit" && item.product.unitPriceUnit) {
    return item.product.unitPriceUnit;
  }
  return item.product.unit;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartKey: string, quantity: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 border-b border-border bg-white">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%)" }}
            >
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2
                className="text-foreground"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(0.88rem, 2.5vw, 1rem)" }}
              >
                Mi Carrito
              </h2>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
                {totalItems} {totalItems === 1 ? "producto" : "productos"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-5"
              style={{ background: "linear-gradient(135deg, #0a4d8c10 0%, #00bcd415 100%)" }}
            >
              <ShoppingCart className="w-7 h-7 sm:w-9 sm:h-9 text-[#0a4d8c]/30" />
            </div>
            <h3
              className="text-foreground mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(0.95rem, 3vw, 1.1rem)" }}
            >
              Carrito vacío
            </h3>
            <p
              className="text-muted-foreground max-w-xs mb-5 sm:mb-6"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(12px, 2.5vw, 13px)", lineHeight: 1.6 }}
            >
              Agrega suministros esenciales a tu carrito para realizar tu pedido con despacho en 24h a Lima.
            </p>
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-white px-5 sm:px-6 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: "13px",
                background: "linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%)",
              }}
            >
              Explorar Catálogo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4 space-y-2 sm:space-y-3">
              {items.map((item) => {
                const key = getCartKey(item.product.id, item.selectedUnit);
                const effectivePrice = getItemPrice(item);
                const effectiveUnit = getItemUnitLabel(item);

                return (
                  <div
                    key={key}
                    className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-[#f5f7fa] rounded-xl border border-border hover:border-[#0a4d8c]/15 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white shrink-0">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-[11.5px] sm:text-[12.5px] text-foreground truncate"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                          >
                            {item.product.name}
                          </p>
                          <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 flex-wrap">
                            <p
                              className="text-[10px] sm:text-[11px] text-muted-foreground truncate"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              {item.product.sku} · {item.product.brand}
                            </p>
                            <span
                              className="px-1 sm:px-1.5 py-px rounded text-[9px] sm:text-[10px] bg-[#0a4d8c]/10 text-[#0a4d8c] shrink-0"
                              style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                            >
                              x {effectiveUnit}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveItem(key)}
                          className="p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded transition-colors sm:opacity-0 sm:group-hover:opacity-100 shrink-0"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-1.5 sm:mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-border rounded-md bg-white">
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                key,
                                Math.max(item.product.minOrder, item.quantity - 1)
                              )
                            }
                            className="px-1 sm:px-1.5 py-0.5 hover:bg-[#f0f7ff] transition-colors rounded-l-md"
                          >
                            <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
                          </button>
                          <span
                            className="w-7 sm:w-8 text-center text-[11px] sm:text-[12px] border-x border-border py-0.5"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(key, item.quantity + 1)
                            }
                            className="px-1 sm:px-1.5 py-0.5 hover:bg-[#f0f7ff] transition-colors rounded-r-md"
                          >
                            <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
                          </button>
                        </div>

                        {/* Line total */}
                        <div className="text-right">
                          <span
                            className="text-[#0a4d8c] text-[12px] sm:text-[13px]"
                            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                          >
                            {formatPrice(effectivePrice * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
                              {formatPrice(effectivePrice)} /{effectiveUnit}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer - Summary */}
            <div className="border-t border-border bg-white px-3 sm:px-5 py-3 sm:py-4 space-y-2.5 sm:space-y-3">
              {/* Delivery note */}
              <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <p className="text-[10.5px] sm:text-[11.5px] text-emerald-700" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                  <span className="hidden sm:inline">Envío gratis en pedidos mayores a S/ 200.00 en Lima</span>
                  <span className="sm:hidden">Envío gratis desde S/ 200 en Lima</span>
                </p>
              </div>

              {/* Price breakdown */}
              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] sm:text-[13px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
                    Subtotal ({totalItems} {totalItems === 1 ? "producto" : "productos"})
                  </span>
                  <span className="text-[12px] sm:text-[13px] text-foreground" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] sm:text-[13px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
                    IGV (18%)
                  </span>
                  <span className="text-[12px] sm:text-[13px] text-foreground" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                    {formatPrice(igv)}
                  </span>
                </div>
                {subtotal >= 200 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] sm:text-[13px] text-emerald-600" style={{ fontFamily: "Inter, sans-serif" }}>
                      Envío
                    </span>
                    <span className="text-[12px] sm:text-[13px] text-emerald-600" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                      Gratis
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span
                    className="text-foreground"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(13px, 2.5vw, 15px)" }}
                  >
                    Total
                  </span>
                  <span
                    className="text-[#0a4d8c]"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 3vw, 1.2rem)" }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={onCheckout}
                className="w-full flex items-center justify-center gap-2 text-white py-2.5 sm:py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(12px, 2.5vw, 14px)",
                  background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 50%, #00bcd4 100%)",
                }}
              >
                <ShieldCheck className="w-4 h-4" />
                Solicitar Cotización
              </button>
              <button
                onClick={onClearCart}
                className="w-full text-center text-[11px] sm:text-[12px] text-muted-foreground hover:text-red-500 py-1 sm:py-1.5 transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}