import { useState, useEffect } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  ClipboardList,
  Check,
  Building2,
  Phone,
  Mail,
  FileText,
  Truck,
  Clock,
  ShieldCheck,
  MessageCircle,
  Zap,
} from "lucide-react";
import { CartItem } from "./CartDrawer";
import { formatPrice } from "./data";
import { getItemPrice, getItemUnitLabel } from "./CartDrawer";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { apiFetch } from "../utils/api";
import { useUser } from "./UserContext";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSent: () => void;
}

interface CustomerData {
  nombre: string;
  apellido: string;
  tipoDoc: "DNI" | "RUC";
  numDoc: string;
  razonSocial: string;
  email: string;
  telefono: string;
}

interface ShippingData {
  direccion: string;
  distrito: string;
  referencia: string;
  tipoEntrega: "standard" | "express";
  notas: string;
}

const limaDistritos = [
  "Ate",
  "Barranco",
  "Breña",
  "Callao",
  "Carabayllo",
  "Cercado de Lima",
  "Chaclacayo",
  "Chorrillos",
  "Cieneguilla",
  "Comas",
  "El Agustino",
  "Independencia",
  "Jesús María",
  "La Molina",
  "La Victoria",
  "Lince",
  "Los Olivos",
  "Lurigancho",
  "Lurín",
  "Magdalena del Mar",
  "Miraflores",
  "Pachacámac",
  "Pucusana",
  "Pueblo Libre",
  "Puente Piedra",
  "Punta Hermosa",
  "Punta Negra",
  "Rímac",
  "San Bartolo",
  "San Borja",
  "San Isidro",
  "San Juan de Lurigancho",
  "San Juan de Miraflores",
  "San Luis",
  "San Martín de Porres",
  "San Miguel",
  "Santa Anita",
  "Santa María del Mar",
  "Santa Rosa",
  "Santiago de Surco",
  "Surquillo",
  "Ventanilla",
  "Villa El Salvador",
  "Villa María del Triunfo",
];

const WHATSAPP_NUMBER = "51976222970"; // Número de ventas de TMO Suministros

export function CheckoutModal({ isOpen, onClose, items, onOrderSent }: CheckoutModalProps) {
  const { user, isLoggedIn } = useUser();
  const [step, setStep] = useState(1);
  const [orderSent, setOrderSent] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [autoFilledBanner, setAutoFilledBanner] = useState(false);

  const buildCustomerFromUser = (): CustomerData => ({
    nombre: user?.name || "",
    apellido: user?.lastName || "",
    tipoDoc: (user?.documentType as "DNI" | "RUC") || "RUC",
    numDoc: user?.documentNumber || "",
    razonSocial: user?.companyName || "",
    email: user?.email || "",
    telefono: user?.phone || "",
  });

  const buildShippingFromUser = (): Partial<ShippingData> => ({
    direccion: user?.shippingAddress || "",
    distrito: user?.shippingDistrict || "",
    referencia: user?.shippingReference || "",
  });

  const [customer, setCustomer] = useState<CustomerData>(() => {
    if (isLoggedIn && user) return buildCustomerFromUser();
    const saved = sessionStorage.getItem("ssi_checkout_customer");
    return saved ? JSON.parse(saved) : {
      nombre: "",
      apellido: "",
      tipoDoc: "RUC",
      numDoc: "",
      razonSocial: "",
      email: "",
      telefono: "",
    };
  });

  const [shipping, setShipping] = useState<ShippingData>(() => {
    if (isLoggedIn && user) {
      const fromUser = buildShippingFromUser();
      return {
        direccion: fromUser.direccion || "",
        distrito: fromUser.distrito || "",
        referencia: fromUser.referencia || "",
        tipoEntrega: "standard",
        notas: "",
      };
    }
    const saved = sessionStorage.getItem("ssi_checkout_shipping");
    return saved ? JSON.parse(saved) : {
      direccion: "",
      distrito: "",
      referencia: "",
      tipoEntrega: "standard",
      notas: "",
    };
  });

  // Re-fill when modal opens (in case user just logged in)
  useEffect(() => {
    if (isOpen && isLoggedIn && user) {
      setCustomer(buildCustomerFromUser());
      setShipping(prev => ({
        ...prev,
        direccion: user.shippingAddress || prev.direccion,
        distrito: user.shippingDistrict || prev.distrito,
        referencia: user.shippingReference || prev.referencia,
      }));
      setAutoFilledBanner(true);
    }
  }, [isOpen]);


  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync checkout data to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("ssi_checkout_customer", JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    sessionStorage.setItem("ssi_checkout_shipping", JSON.stringify(shipping));
  }, [shipping]);

  const subtotal = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const igv = subtotal * 0.18;
  const shippingCost = subtotal >= 150 ? 0 : 50;
  const total = subtotal + igv + shippingCost;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Generate unique order ID
  const generateOrderId = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `PED-${year}${month}${day}-${random}`;
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!customer.nombre.trim()) newErrors.nombre = "Ingresa tu nombre";
    if (!customer.apellido.trim()) newErrors.apellido = "Ingresa tu apellido";
    if (!customer.numDoc.trim()) newErrors.numDoc = "Ingresa número de documento";
    if (customer.tipoDoc === "DNI" && customer.numDoc.trim().length !== 8)
      newErrors.numDoc = "El DNI debe tener 8 dígitos";
    if (customer.tipoDoc === "RUC" && customer.numDoc.trim().length !== 11)
      newErrors.numDoc = "El RUC debe tener 11 dígitos";
    if (customer.tipoDoc === "RUC" && !customer.razonSocial.trim())
      newErrors.razonSocial = "Ingresa la razón social";
    if (!customer.email.trim()) newErrors.email = "Ingresa tu email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) newErrors.email = "Email no válido";
    if (!customer.telefono.trim()) newErrors.telefono = "Ingresa tu teléfono";
    else if (customer.telefono.replace(/\D/g, "").length < 9) newErrors.telefono = "Teléfono debe tener al menos 9 dígitos";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!shipping.direccion.trim()) newErrors.direccion = "Ingresa la dirección de envío";
    if (!shipping.distrito) newErrors.distrito = "Selecciona un distrito";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setErrors({});
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      setErrors({});
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSendWhatsApp = async () => {
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    // Save to database if user is logged in
    const userData = localStorage.getItem('tmo_user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        await apiFetch('/orders', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.id,
            total,
            items: items.map(item => ({
              productId: parseInt(item.product.id),
              quantity: item.quantity,
              price: getItemPrice(item)
            }))
          })
        });
        console.log("Order saved to DB");
      } catch (error) {
        console.error("Could not save order to DB", error);
      }
    }
    
    // Build message with the new order ID
    const lines: string[] = [
      "🏭 *NUEVO PEDIDO - TMO Suministros*",
      "",
      `📦 *ID de Pedido: ${newOrderId}*`,
      "",
      "━━━━━━━━━━━━━━━━━━━━",
      "📋 *DATOS DEL CLIENTE*",
      "━━━━━━━━━━━━━━━━━━━━",
      `👤 ${customer.nombre} ${customer.apellido}`,
      `📄 ${customer.tipoDoc}: ${customer.numDoc}`,
    ];
    if (customer.tipoDoc === "RUC" && customer.razonSocial) {
      lines.push(`🏢 ${customer.razonSocial}`);
    }
    lines.push(`📧 ${customer.email}`);
    lines.push(`📱 ${customer.telefono}`);
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push("📍 *DIRECCIÓN DE ENVÍO*");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push(`📌 ${shipping.direccion}`);
    lines.push(`🗺️ ${shipping.distrito}, Lima`);
    if (shipping.referencia) {
      lines.push(`🔎 Ref: ${shipping.referencia}`);
    }
    lines.push(`🚚 Entrega: ${shipping.tipoEntrega === "express" ? "Express (24h)" : "Estándar (48-72h)"}`);
    if (shipping.notas) {
      lines.push(`📝 Notas: ${shipping.notas}`);
    }
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push("🛒 *DETALLE DEL PEDIDO*");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    items.forEach((item, i) => {
      const price = getItemPrice(item);
      const unitLabel = getItemUnitLabel(item);
      lines.push(
        `${i + 1}. ${item.product.name} (${item.product.sku})`
      );
      lines.push(
        `   ${item.quantity} ${unitLabel}(s) × ${formatPrice(price)} = ${formatPrice(price * item.quantity)}`
      );
    });
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push("💰 *RESUMEN DE PRECIOS*");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push(`Subtotal: ${formatPrice(subtotal)}`);
    lines.push(`IGV (18%): ${formatPrice(igv)}`);
    lines.push(`Envío: ${shippingCost === 0 ? "GRATIS" : formatPrice(shippingCost)}`);
    lines.push(`*TOTAL: ${formatPrice(total)}*`);
    lines.push("");
    lines.push("_Pedido generado desde tmosuministros.pe_");
    
    const message = lines.join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setOrderSent(true);
  };

  const handleFinish = () => {
    onOrderSent();
    setStep(1);
    setOrderSent(false);
    setCustomer({
      nombre: "",
      apellido: "",
      tipoDoc: "RUC",
      numDoc: "",
      razonSocial: "",
      email: "",
      telefono: "",
    });
    setShipping({
      direccion: "",
      distrito: "",
      referencia: "",
      tipoEntrega: "standard",
      notas: "",
    });
    sessionStorage.removeItem("ssi_checkout_customer");
    sessionStorage.removeItem("ssi_checkout_shipping");
    onClose();
  };

  if (!isOpen) return null;

  const inputClass = (field: string) =>
    `w-full px-3.5 py-2.5 bg-[#f5f7fa] border rounded-lg text-[14px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[#0a4d8c]/25 focus:border-[#0a4d8c] transition-all ${
      errors[field] ? "border-red-300 bg-red-50/50" : "border-border"
    }`;

  const labelClass = "block text-[12.5px] text-foreground mb-1.5";

  // Step indicator
  const steps = [
    { num: 1, label: "Datos", icon: User },
    { num: 2, label: "Envío", icon: MapPin },
    { num: 3, label: "Confirmar", icon: ClipboardList },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-5 sm:px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-foreground"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}
            >
              {orderSent ? "Pedido Enviado" : "Completar Pedido"}
            </h2>
            <button onClick={orderSent ? handleFinish : onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Step indicator */}
          {!orderSent && (
            <div className="flex items-center gap-1">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        step > s.num
                          ? "bg-emerald-500 text-white"
                          : step === s.num
                          ? "text-white"
                          : "bg-[#f5f7fa] text-muted-foreground"
                      }`}
                      style={
                        step === s.num
                          ? { background: "linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%)" }
                          : undefined
                      }
                    >
                      {step > s.num ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <s.icon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={`hidden sm:block text-[12px] ${
                        step >= s.num ? "text-foreground" : "text-muted-foreground"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: step === s.num ? 600 : 400 }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-[2px] flex-1 mx-2 rounded-full transition-colors ${
                        step > s.num ? "bg-emerald-400" : "bg-[#e5e7eb]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {/* ---- ORDER SENT SUCCESS ---- */}
          {orderSent && (
            <div className="flex flex-col items-center text-center py-8">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, #059669 0%, #34d399 100%)" }}
              >
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3
                className="text-foreground mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.3rem" }}
              >
                Pedido enviado por WhatsApp
              </h3>
              <div className="px-4 py-2 bg-[#f0f7ff] rounded-lg border border-[#0a4d8c]/20 mb-4">
                <p
                  className="text-[11px] text-muted-foreground mb-1"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                >
                  ID de Pedido
                </p>
                <p
                  className="text-[#0a4d8c]"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "15px" }}
                >
                  {orderId}
                </p>
              </div>
              <p
                className="text-muted-foreground max-w-sm mb-6"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "13.5px", lineHeight: 1.7 }}
              >
                Tu pedido fue enviado al equipo de ventas de TMO Suministros. Te contactaremos en breve
                para confirmar disponibilidad y coordinar el pago.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <button
                  onClick={handleFinish}
                  className="flex-1 flex items-center justify-center gap-2 text-white py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: "13px",
                    background: "linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%)",
                  }}
                >
                  Volver a la Tienda
                </button>
              </div>
            </div>
          )}

          {/* ---- STEP 1: DATOS DEL CLIENTE ---- */}
          {!orderSent && step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-[#0a4d8c]" />
                <h3
                  className="text-foreground"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.95rem" }}
                >
                  Datos del Cliente
                </h3>
              </div>

              {/* Auto-fill banner */}
              {isLoggedIn && autoFilledBanner && (
                <div className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-emerald-800 font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
                      Datos completados automáticamente
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                      Revisa y ajusta si es necesario. Puedes guardar tu dirección en tu perfil para futuros pedidos.
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoFilledBanner(false)}
                    className="p-0.5 hover:bg-emerald-100 rounded transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={customer.nombre}
                    onChange={(e) => setCustomer({ ...customer, nombre: e.target.value })}
                    placeholder="Ej. Carlos"
                    className={inputClass("nombre")}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                  {errors.nombre && (
                    <p className="text-[11px] text-red-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      {errors.nombre}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={customer.apellido}
                    onChange={(e) => setCustomer({ ...customer, apellido: e.target.value })}
                    placeholder="Ej. Rodríguez"
                    className={inputClass("apellido")}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                  {errors.apellido && (
                    <p className="text-[11px] text-red-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      {errors.apellido}
                    </p>
                  )}
                </div>
              </div>

              {/* Documento */}
              <div>
                <label className={labelClass} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                  Tipo de Documento *
                </label>
                <div className="flex gap-3 mb-3">
                  {(["RUC", "DNI"] as const).map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => setCustomer({ ...customer, tipoDoc: tipo, numDoc: "" })}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-[13px] transition-all ${
                        customer.tipoDoc === tipo
                          ? "border-[#0a4d8c] bg-[#f0f7ff] text-[#0a4d8c]"
                          : "border-border bg-white text-muted-foreground hover:border-[#0a4d8c]/30"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: customer.tipoDoc === tipo ? 600 : 400 }}
                    >
                      {tipo === "RUC" ? <Building2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      {tipo}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={customer.numDoc}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    const maxLen = customer.tipoDoc === "DNI" ? 8 : 11;
                    setCustomer({ ...customer, numDoc: val.slice(0, maxLen) });
                  }}
                  placeholder={customer.tipoDoc === "DNI" ? "12345678" : "20123456789"}
                  className={inputClass("numDoc")}
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
                {errors.numDoc && (
                  <p className="text-[11px] text-red-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    {errors.numDoc}
                  </p>
                )}
              </div>

              {/* Razón Social - solo RUC */}
              {customer.tipoDoc === "RUC" && (
                <div>
                  <label className={labelClass} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                    Razón Social / Empresa *
                  </label>
                  <input
                    type="text"
                    value={customer.razonSocial}
                    onChange={(e) => setCustomer({ ...customer, razonSocial: e.target.value })}
                    placeholder="Ej. Industrias del Pacífico S.A.C."
                    className={inputClass("razonSocial")}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                  {errors.razonSocial && (
                    <p className="text-[11px] text-red-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      {errors.razonSocial}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      Correo Electrónico *
                    </span>
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="correo@empresa.com"
                    className={inputClass("email")}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      Teléfono / Celular *
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={customer.telefono}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d+\- ]/g, "");
                      setCustomer({ ...customer, telefono: val });
                    }}
                    placeholder="987 654 321"
                    className={inputClass("telefono")}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                  {errors.telefono && (
                    <p className="text-[11px] text-red-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      {errors.telefono}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ---- STEP 2: DIRECCIÓN DE ENVÍO ---- */}
          {!orderSent && step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-[#0a4d8c]" />
                <h3
                  className="text-foreground"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.95rem" }}
                >
                  Dirección de Envío
                </h3>
              </div>

              <div>
                <label className={labelClass} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                  Dirección Completa *
                </label>
                <input
                  type="text"
                  value={shipping.direccion}
                  onChange={(e) => setShipping({ ...shipping, direccion: e.target.value })}
                  placeholder="Av. Industrial 1234, Piso 2, Oficina 201"
                  className={inputClass("direccion")}
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
                {errors.direccion && (
                  <p className="text-[11px] text-red-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    {errors.direccion}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                  Distrito (Lima Metropolitana / Callao) *
                </label>
                <select
                  value={shipping.distrito}
                  onChange={(e) => setShipping({ ...shipping, distrito: e.target.value })}
                  className={`${inputClass("distrito")} appearance-none cursor-pointer`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <option value="">Seleccionar distrito...</option>
                  {limaDistritos.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.distrito && (
                  <p className="text-[11px] text-red-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    {errors.distrito}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                  Referencia de Ubicación
                </label>
                <input
                  type="text"
                  value={shipping.referencia}
                  onChange={(e) => setShipping({ ...shipping, referencia: e.target.value })}
                  placeholder="Ej. Frente a la Estación del Tren, portón azul"
                  className={inputClass("referencia")}
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              </div>

              {/* Tipo de entrega */}
              <div>
                <label className={labelClass} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                  Tipo de Entrega
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setShipping({ ...shipping, tipoEntrega: "standard" })}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      shipping.tipoEntrega === "standard"
                        ? "border-[#0a4d8c] bg-[#f0f7ff]"
                        : "border-border bg-white hover:border-[#0a4d8c]/30"
                    }`}
                  >
                    <Truck
                      className={`w-5 h-5 mt-0.5 shrink-0 ${
                        shipping.tipoEntrega === "standard" ? "text-[#0a4d8c]" : "text-muted-foreground"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-[13px] ${
                          shipping.tipoEntrega === "standard" ? "text-[#0a4d8c]" : "text-foreground"
                        }`}
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                      >
                        Estándar
                      </p>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                        48 a 72 horas hábiles
                      </p>
                      <p
                        className="text-[12px] mt-1"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 700,
                          color: subtotal >= 150 ? "#059669" : "#0a4d8c",
                        }}
                      >
                        {subtotal >= 150 ? "Gratis" : "S/ 50.00"}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShipping({ ...shipping, tipoEntrega: "express" })}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      shipping.tipoEntrega === "express"
                        ? "border-[#0a4d8c] bg-[#f0f7ff]"
                        : "border-border bg-white hover:border-[#0a4d8c]/30"
                    }`}
                  >
                    <Clock
                      className={`w-5 h-5 mt-0.5 shrink-0 ${
                        shipping.tipoEntrega === "express" ? "text-[#0a4d8c]" : "text-muted-foreground"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-[13px] ${
                          shipping.tipoEntrega === "express" ? "text-[#0a4d8c]" : "text-foreground"
                        }`}
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                      >
                        Express
                      </p>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                        Dentro de 24 horas hábiles
                      </p>
                      <p
                        className="text-[12px] mt-1"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 700,
                          color: subtotal >= 150 ? "#059669" : "#0a4d8c",
                        }}
                      >
                        {subtotal >= 150 ? "Gratis" : "S/ 50.00"}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                  Notas adicionales para el envío
                </label>
                <textarea
                  value={shipping.notas}
                  onChange={(e) => setShipping({ ...shipping, notas: e.target.value })}
                  placeholder="Ej. Horario de recepción de 8am a 5pm, preguntar por almacén..."
                  rows={2}
                  className={`${inputClass("notas")} resize-none`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              </div>
            </div>
          )}

          {/* ---- STEP 3: RESUMEN Y CONFIRMAR ---- */}
          {!orderSent && step === 3 && (
            <div className="space-y-5">
              {/* Customer Summary */}
              <div className="p-4 bg-[#f5f7fa] rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0a4d8c]" />
                    <h4
                      className="text-foreground"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                    >
                      Datos del Cliente
                    </h4>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-[12px] text-[#0a4d8c] hover:underline"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                  >
                    Editar
                  </button>
                </div>
                <div className="space-y-1 text-[13px]" style={{ fontFamily: "Inter, sans-serif" }}>
                  <p className="text-foreground" style={{ fontWeight: 500 }}>
                    {customer.nombre} {customer.apellido}
                  </p>
                  <p className="text-muted-foreground">
                    {customer.tipoDoc}: {customer.numDoc}
                    {customer.tipoDoc === "RUC" && customer.razonSocial ? ` · ${customer.razonSocial}` : ""}
                  </p>
                  <p className="text-muted-foreground">
                    {customer.email} · {customer.telefono}
                  </p>
                </div>
              </div>

              {/* Shipping Summary */}
              <div className="p-4 bg-[#f5f7fa] rounded-xl border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0a4d8c]" />
                    <h4
                      className="text-foreground"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                    >
                      Dirección de Envío
                    </h4>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="text-[12px] text-[#0a4d8c] hover:underline"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                  >
                    Editar
                  </button>
                </div>
                <div className="space-y-1 text-[13px]" style={{ fontFamily: "Inter, sans-serif" }}>
                  <p className="text-foreground" style={{ fontWeight: 500 }}>
                    {shipping.direccion}
                  </p>
                  <p className="text-muted-foreground">{shipping.distrito}, Lima</p>
                  {shipping.referencia && (
                    <p className="text-muted-foreground">Ref: {shipping.referencia}</p>
                  )}
                  <p className="text-[#0a4d8c]" style={{ fontWeight: 500 }}>
                    {shipping.tipoEntrega === "express"
                      ? "Entrega Express (24h)"
                      : "Entrega Estándar (48-72h)"}
                  </p>
                  {shipping.notas && (
                    <p className="text-muted-foreground italic">"{shipping.notas}"</p>
                  )}
                </div>
              </div>

              {/* Products Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList className="w-4 h-4 text-[#0a4d8c]" />
                  <h4
                    className="text-foreground"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
                  >
                    Productos ({totalItems})
                  </h4>
                </div>
                <div className="space-y-2">
                  {items.map((item) => {
                    const price = getItemPrice(item);
                    const unitLabel = getItemUnitLabel(item);
                    return (
                      <div
                        key={`${item.product.id}-${item.selectedUnit}`}
                        className="flex items-center gap-3 p-2.5 bg-[#f5f7fa] rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-white shrink-0">
                          <ImageWithFallback
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[12px] text-foreground truncate"
                            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                          >
                            {item.product.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
                            {item.quantity} {unitLabel}(s) × {formatPrice(price)}
                          </p>
                        </div>
                        <span
                          className="text-[#0a4d8c] text-[12.5px] shrink-0"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                        >
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="p-4 bg-[#f0f7ff] rounded-xl border border-[#0a4d8c]/10 space-y-2">
                <div className="flex justify-between text-[13px]" style={{ fontFamily: "Inter, sans-serif" }}>
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground" style={{ fontWeight: 500 }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]" style={{ fontFamily: "Inter, sans-serif" }}>
                  <span className="text-muted-foreground">IGV (18%)</span>
                  <span className="text-foreground" style={{ fontWeight: 500 }}>
                    {formatPrice(igv)}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]" style={{ fontFamily: "Inter, sans-serif" }}>
                  <span className="text-muted-foreground">
                    Envío ({shipping.tipoEntrega === "express" ? "Express" : "Estándar"})
                  </span>
                  <span
                    className={shippingCost === 0 ? "text-emerald-600" : "text-foreground"}
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between pt-2.5 border-t border-[#0a4d8c]/10">
                  <span
                    className="text-foreground"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "15px" }}
                  >
                    Total a Pagar
                  </span>
                  <span
                    className="text-[#0a4d8c]"
                    style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "1.15rem" }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* WhatsApp notice */}
              <div className="flex items-start gap-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p
                    className="text-[12.5px] text-emerald-800"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    El pedido se enviará por WhatsApp
                  </p>
                  <p
                    className="text-[11.5px] text-emerald-700 mt-1"
                    style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}
                  >
                    Se abrirá WhatsApp con el resumen completo de tu pedido. Nuestro equipo de ventas
                    confirmará disponibilidad y te enviará los datos para realizar el pago.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!orderSent && (
          <div className="shrink-0 px-5 sm:px-6 py-4 border-t border-border bg-white flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              >
                Volver al Carrito
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 text-white px-6 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "13.5px",
                  background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 50%, #00bcd4 100%)",
                }}
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSendWhatsApp}
                className="flex items-center gap-2 text-white px-6 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/30"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "13.5px",
                  background: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
                }}
              >
                <MessageCircle className="w-4.5 h-4.5" />
                Enviar Pedido por WhatsApp
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}