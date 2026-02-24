import { useState, useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Toaster, toast } from "sonner";
import { TopBanner } from "./TopBanner";
import { Header } from "./Header";
import { ProductModal } from "./ProductModal";
import { CartDrawer, CartItem, getCartKey } from "./CartDrawer";
import { CheckoutModal } from "./CheckoutModal";
import { Product } from "./data";

export interface LayoutContextType {
  cartItems: CartItem[];
  cartCount: number;
  handleAddToCart: (product: Product, quantity: number, selectedUnit?: "box" | "unit") => void;
  setSelectedProduct: (product: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  scrollToCatalogFlag: boolean;
  clearScrollFlag: () => void;
}

export function Layout() {
  const navigate = useNavigate();

  // Set page title and favicon
  useEffect(() => {
    document.title = "SSI";
    
    // Remove ALL existing link tags with icon references
    const existingLinks = document.querySelectorAll("link[rel*='icon'], link[rel*='shortcut']");
    existingLinks.forEach(link => link.remove());
    
    const faviconUrl = "https://imagenes.tmo.com.pe/imagenes/logotipo/isotipo%20ssi.png";
    
    // Add favicon with different sizes and formats for maximum compatibility
    const sizes = ['16x16', '32x32', '96x96'];
    
    sizes.forEach(size => {
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.sizes = size;
      link.href = faviconUrl;
      document.head.appendChild(link);
    });
    
    // Add shortcut icon (fallback for older browsers)
    const shortcutLink = document.createElement("link");
    shortcutLink.rel = "shortcut icon";
    shortcutLink.href = faviconUrl;
    document.head.appendChild(shortcutLink);
    
    // Add apple-touch-icon for iOS
    const appleLink = document.createElement("link");
    appleLink.rel = "apple-touch-icon";
    appleLink.sizes = "180x180";
    appleLink.href = faviconUrl;
    document.head.appendChild(appleLink);
    
    // Force refresh by adding a timestamp query parameter
    const timestamp = new Date().getTime();
    const refreshLink = document.createElement("link");
    refreshLink.rel = "icon";
    refreshLink.type = "image/png";
    refreshLink.href = `${faviconUrl}?v=${timestamp}`;
    document.head.appendChild(refreshLink);
  }, []);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem("ssi_cart_persist");
    return saved ? JSON.parse(saved) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [scrollToCatalogFlag, setScrollToCatalogFlag] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = useCallback(
    (product: Product, quantity: number, selectedUnit: "box" | "unit" = "box") => {
      const key = getCartKey(product.id, selectedUnit);
      setCartItems((prev) => {
        const existing = prev.find(
          (item) => getCartKey(item.product.id, item.selectedUnit) === key
        );
        if (existing) {
          return prev.map((item) =>
            getCartKey(item.product.id, item.selectedUnit) === key
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity, selectedUnit }];
      });
      const unitLabel =
        selectedUnit === "unit" && product.unitPriceUnit
          ? product.unitPriceUnit
          : product.unit;
      toast.success("Agregado a tu lista de suministros", {
        description: `${quantity}x ${product.name} (${unitLabel})`,
        duration: 3000,
        style: { fontFamily: "Inter, sans-serif" },
      });
    },
    []
  );

  // Sync cart to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("ssi_cart_persist", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleUpdateQuantity = useCallback((cartKey: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        getCartKey(item.product.id, item.selectedUnit) === cartKey
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((cartKey: string) => {
    setCartItems((prev) => {
      const item = prev.find(
        (i) => getCartKey(i.product.id, i.selectedUnit) === cartKey
      );
      if (item) {
        toast("Producto eliminado", {
          description: item.product.name,
          duration: 2500,
          style: { fontFamily: "Inter, sans-serif" },
        });
      }
      return prev.filter(
        (i) => getCartKey(i.product.id, i.selectedUnit) !== cartKey
      );
    });
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
    toast("Carrito vaciado", {
      duration: 2000,
      style: { fontFamily: "Inter, sans-serif" },
    });
  }, []);

  const handleCheckout = useCallback(() => {
    setCartOpen(false);
    setTimeout(() => setCheckoutOpen(true), 200);
  }, []);

  const handleOrderSent = useCallback(() => {
    setCartItems([]);
    setCheckoutOpen(false);
    toast.success("Pedido enviado correctamente", {
      description: "Te contactaremos pronto para confirmar tu pedido.",
      duration: 5000,
      style: { fontFamily: "Inter, sans-serif" },
    });
  }, []);

  // Called from Header when user searches — navigate home & scroll
  const handleSearchFromHeader = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setSelectedCategory("all");
      setScrollToCatalogFlag(true);
      navigate("/");
    },
    [navigate]
  );

  // Called from Header when a category is selected
  const handleCategoryFromHeader = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      setSearchQuery("");
      setScrollToCatalogFlag(true);
      navigate("/");
    },
    [navigate]
  );

  const clearScrollFlag = useCallback(() => {
    setScrollToCatalogFlag(false);
  }, []);

  const context: LayoutContextType = {
    cartItems,
    cartCount,
    handleAddToCart,
    setSelectedProduct,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    scrollToCatalogFlag,
    clearScrollFlag,
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-white"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: "Inter, sans-serif", fontSize: "13px" },
        }}
      />

      <TopBanner />

      <Header
        cartCount={cartCount}
        onSearchChange={handleSearchFromHeader}
        onCategorySelect={handleCategoryFromHeader}
        onCartClick={() => setCartOpen(true)}
        onViewProduct={setSelectedProduct}
        onAddToCart={handleAddToCart}
      />

      <Outlet context={context} />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onViewProduct={setSelectedProduct}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        onOrderSent={handleOrderSent}
      />
    </div>
  );
}