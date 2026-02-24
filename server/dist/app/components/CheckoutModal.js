import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X, ArrowLeft, ArrowRight, User, MapPin, ClipboardList, Check, Building2, Phone, Mail, FileText, Truck, Clock, MessageCircle, Zap, } from "lucide-react";
import { formatPrice } from "./data";
import { getItemPrice, getItemUnitLabel } from "./CartDrawer";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { apiFetch } from "../utils/api";
import { useUser } from "./UserContext";
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
export function CheckoutModal({ isOpen, onClose, items, onOrderSent }) {
    const { user, isLoggedIn } = useUser();
    const [step, setStep] = useState(1);
    const [orderSent, setOrderSent] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [autoFilledBanner, setAutoFilledBanner] = useState(false);
    const buildCustomerFromUser = () => ({
        nombre: user?.name || "",
        apellido: user?.lastName || "",
        tipoDoc: user?.documentType || "RUC",
        numDoc: user?.documentNumber || "",
        razonSocial: user?.companyName || "",
        email: user?.email || "",
        telefono: user?.phone || "",
    });
    const buildShippingFromUser = () => ({
        direccion: user?.shippingAddress || "",
        distrito: user?.shippingDistrict || "",
        referencia: user?.shippingReference || "",
    });
    const [customer, setCustomer] = useState(() => {
        if (isLoggedIn && user)
            return buildCustomerFromUser();
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
    const [shipping, setShipping] = useState(() => {
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
    const [errors, setErrors] = useState({});
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
    const generateOrderId = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `PED-${year}${month}${day}-${random}`;
    };
    const validateStep1 = () => {
        const newErrors = {};
        if (!customer.nombre.trim())
            newErrors.nombre = "Ingresa tu nombre";
        if (!customer.apellido.trim())
            newErrors.apellido = "Ingresa tu apellido";
        if (!customer.numDoc.trim())
            newErrors.numDoc = "Ingresa número de documento";
        if (customer.tipoDoc === "DNI" && customer.numDoc.trim().length !== 8)
            newErrors.numDoc = "El DNI debe tener 8 dígitos";
        if (customer.tipoDoc === "RUC" && customer.numDoc.trim().length !== 11)
            newErrors.numDoc = "El RUC debe tener 11 dígitos";
        if (customer.tipoDoc === "RUC" && !customer.razonSocial.trim())
            newErrors.razonSocial = "Ingresa la razón social";
        if (!customer.email.trim())
            newErrors.email = "Ingresa tu email";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
            newErrors.email = "Email no válido";
        if (!customer.telefono.trim())
            newErrors.telefono = "Ingresa tu teléfono";
        else if (customer.telefono.replace(/\D/g, "").length < 9)
            newErrors.telefono = "Teléfono debe tener al menos 9 dígitos";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const validateStep2 = () => {
        const newErrors = {};
        if (!shipping.direccion.trim())
            newErrors.direccion = "Ingresa la dirección de envío";
        if (!shipping.distrito)
            newErrors.distrito = "Selecciona un distrito";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
            setErrors({});
        }
        else if (step === 2 && validateStep2()) {
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
            }
            catch (error) {
                console.error("Could not save order to DB", error);
            }
        }
        // Build message with the new order ID
        const lines = [
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
            lines.push(`${i + 1}. ${item.product.name} (${item.product.sku})`);
            lines.push(`   ${item.quantity} ${unitLabel}(s) × ${formatPrice(price)} = ${formatPrice(price * item.quantity)}`);
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
    if (!isOpen)
        return null;
    const inputClass = (field) => `w-full px-3.5 py-2.5 bg-[#f5f7fa] border rounded-lg text-[14px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[#0a4d8c]/25 focus:border-[#0a4d8c] transition-all ${errors[field] ? "border-red-300 bg-red-50/50" : "border-border"}`;
    const labelClass = "block text-[12.5px] text-foreground mb-1.5";
    // Step indicator
    const steps = [
        { num: 1, label: "Datos", icon: User },
        { num: 2, label: "Envío", icon: MapPin },
        { num: 3, label: "Confirmar", icon: ClipboardList },
    ];
    return (_jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "shrink-0 px-5 sm:px-6 pt-5 pb-4 border-b border-border", children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsx("h2", { className: "text-foreground", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.1rem" }, children: orderSent ? "Pedido Enviado" : "Completar Pedido" }), _jsx("button", { onClick: orderSent ? handleFinish : onClose, className: "p-1.5 hover:bg-muted rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-muted-foreground" }) })] }), !orderSent && (_jsx("div", { className: "flex items-center gap-1", children: steps.map((s, i) => (_jsxs("div", { className: "flex items-center flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 flex-1", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${step > s.num
                                                    ? "bg-emerald-500 text-white"
                                                    : step === s.num
                                                        ? "text-white"
                                                        : "bg-[#f5f7fa] text-muted-foreground"}`, style: step === s.num
                                                    ? { background: "linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%)" }
                                                    : undefined, children: step > s.num ? (_jsx(Check, { className: "w-4 h-4" })) : (_jsx(s.icon, { className: "w-4 h-4" })) }), _jsx("span", { className: `hidden sm:block text-[12px] ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`, style: { fontFamily: "Inter, sans-serif", fontWeight: step === s.num ? 600 : 400 }, children: s.label })] }), i < steps.length - 1 && (_jsx("div", { className: `h-[2px] flex-1 mx-2 rounded-full transition-colors ${step > s.num ? "bg-emerald-400" : "bg-[#e5e7eb]"}` }))] }, s.num))) }))] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-5 sm:px-6 py-5", children: [orderSent && (_jsxs("div", { className: "flex flex-col items-center text-center py-8", children: [_jsx("div", { className: "w-20 h-20 rounded-full flex items-center justify-center mb-5", style: { background: "linear-gradient(135deg, #059669 0%, #34d399 100%)" }, children: _jsx(Check, { className: "w-10 h-10 text-white" }) }), _jsx("h3", { className: "text-foreground mb-2", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.3rem" }, children: "Pedido enviado por WhatsApp" }), _jsxs("div", { className: "px-4 py-2 bg-[#f0f7ff] rounded-lg border border-[#0a4d8c]/20 mb-4", children: [_jsx("p", { className: "text-[11px] text-muted-foreground mb-1", style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "ID de Pedido" }), _jsx("p", { className: "text-[#0a4d8c]", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "15px" }, children: orderId })] }), _jsx("p", { className: "text-muted-foreground max-w-sm mb-6", style: { fontFamily: "Inter, sans-serif", fontSize: "13.5px", lineHeight: 1.7 }, children: "Tu pedido fue enviado al equipo de ventas de TMO Suministros. Te contactaremos en breve para confirmar disponibilidad y coordinar el pago." }), _jsx("div", { className: "flex flex-col sm:flex-row gap-3 w-full max-w-xs", children: _jsx("button", { onClick: handleFinish, className: "flex-1 flex items-center justify-center gap-2 text-white py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25", style: {
                                            fontFamily: "Montserrat, sans-serif",
                                            fontWeight: 600,
                                            fontSize: "13px",
                                            background: "linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%)",
                                        }, children: "Volver a la Tienda" }) })] })), !orderSent && step === 1 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(User, { className: "w-4 h-4 text-[#0a4d8c]" }), _jsx("h3", { className: "text-foreground", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.95rem" }, children: "Datos del Cliente" })] }), isLoggedIn && autoFilledBanner && (_jsxs("div", { className: "flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl", children: [_jsx(Zap, { className: "w-4 h-4 text-emerald-600 shrink-0 mt-0.5" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-[12px] text-emerald-800 font-semibold", style: { fontFamily: "Inter, sans-serif" }, children: "Datos completados autom\u00E1ticamente" }), _jsx("p", { className: "text-[11px] text-emerald-700 mt-0.5", style: { fontFamily: "Inter, sans-serif" }, children: "Revisa y ajusta si es necesario. Puedes guardar tu direcci\u00F3n en tu perfil para futuros pedidos." })] }), _jsx("button", { onClick: () => setAutoFilledBanner(false), className: "p-0.5 hover:bg-emerald-100 rounded transition-colors shrink-0", children: _jsx(X, { className: "w-3.5 h-3.5 text-emerald-600" }) })] })), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Nombre *" }), _jsx("input", { type: "text", value: customer.nombre, onChange: (e) => setCustomer({ ...customer, nombre: e.target.value }), placeholder: "Ej. Carlos", className: inputClass("nombre"), style: { fontFamily: "Inter, sans-serif" } }), errors.nombre && (_jsx("p", { className: "text-[11px] text-red-500 mt-1", style: { fontFamily: "Inter, sans-serif" }, children: errors.nombre }))] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Apellido *" }), _jsx("input", { type: "text", value: customer.apellido, onChange: (e) => setCustomer({ ...customer, apellido: e.target.value }), placeholder: "Ej. Rodr\u00EDguez", className: inputClass("apellido"), style: { fontFamily: "Inter, sans-serif" } }), errors.apellido && (_jsx("p", { className: "text-[11px] text-red-500 mt-1", style: { fontFamily: "Inter, sans-serif" }, children: errors.apellido }))] })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Tipo de Documento *" }), _jsx("div", { className: "flex gap-3 mb-3", children: ["RUC", "DNI"].map((tipo) => (_jsxs("button", { onClick: () => setCustomer({ ...customer, tipoDoc: tipo, numDoc: "" }), className: `flex items-center gap-2 px-4 py-2.5 rounded-lg border text-[13px] transition-all ${customer.tipoDoc === tipo
                                                    ? "border-[#0a4d8c] bg-[#f0f7ff] text-[#0a4d8c]"
                                                    : "border-border bg-white text-muted-foreground hover:border-[#0a4d8c]/30"}`, style: { fontFamily: "Inter, sans-serif", fontWeight: customer.tipoDoc === tipo ? 600 : 400 }, children: [tipo === "RUC" ? _jsx(Building2, { className: "w-4 h-4" }) : _jsx(FileText, { className: "w-4 h-4" }), tipo] }, tipo))) }), _jsx("input", { type: "text", value: customer.numDoc, onChange: (e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                const maxLen = customer.tipoDoc === "DNI" ? 8 : 11;
                                                setCustomer({ ...customer, numDoc: val.slice(0, maxLen) });
                                            }, placeholder: customer.tipoDoc === "DNI" ? "12345678" : "20123456789", className: inputClass("numDoc"), style: { fontFamily: "Inter, sans-serif" } }), errors.numDoc && (_jsx("p", { className: "text-[11px] text-red-500 mt-1", style: { fontFamily: "Inter, sans-serif" }, children: errors.numDoc }))] }), customer.tipoDoc === "RUC" && (_jsxs("div", { children: [_jsx("label", { className: labelClass, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Raz\u00F3n Social / Empresa *" }), _jsx("input", { type: "text", value: customer.razonSocial, onChange: (e) => setCustomer({ ...customer, razonSocial: e.target.value }), placeholder: "Ej. Industrias del Pac\u00EDfico S.A.C.", className: inputClass("razonSocial"), style: { fontFamily: "Inter, sans-serif" } }), errors.razonSocial && (_jsx("p", { className: "text-[11px] text-red-500 mt-1", style: { fontFamily: "Inter, sans-serif" }, children: errors.razonSocial }))] })), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Mail, { className: "w-3.5 h-3.5 text-muted-foreground" }), "Correo Electr\u00F3nico *"] }) }), _jsx("input", { type: "email", value: customer.email, onChange: (e) => setCustomer({ ...customer, email: e.target.value }), placeholder: "correo@empresa.com", className: inputClass("email"), style: { fontFamily: "Inter, sans-serif" } }), errors.email && (_jsx("p", { className: "text-[11px] text-red-500 mt-1", style: { fontFamily: "Inter, sans-serif" }, children: errors.email }))] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Phone, { className: "w-3.5 h-3.5 text-muted-foreground" }), "Tel\u00E9fono / Celular *"] }) }), _jsx("input", { type: "tel", value: customer.telefono, onChange: (e) => {
                                                        const val = e.target.value.replace(/[^\d+\- ]/g, "");
                                                        setCustomer({ ...customer, telefono: val });
                                                    }, placeholder: "987 654 321", className: inputClass("telefono"), style: { fontFamily: "Inter, sans-serif" } }), errors.telefono && (_jsx("p", { className: "text-[11px] text-red-500 mt-1", style: { fontFamily: "Inter, sans-serif" }, children: errors.telefono }))] })] })] })), !orderSent && step === 2 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(MapPin, { className: "w-4 h-4 text-[#0a4d8c]" }), _jsx("h3", { className: "text-foreground", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.95rem" }, children: "Direcci\u00F3n de Env\u00EDo" })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Direcci\u00F3n Completa *" }), _jsx("input", { type: "text", value: shipping.direccion, onChange: (e) => setShipping({ ...shipping, direccion: e.target.value }), placeholder: "Av. Industrial 1234, Piso 2, Oficina 201", className: inputClass("direccion"), style: { fontFamily: "Inter, sans-serif" } }), errors.direccion && (_jsx("p", { className: "text-[11px] text-red-500 mt-1", style: { fontFamily: "Inter, sans-serif" }, children: errors.direccion }))] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Distrito (Lima Metropolitana / Callao) *" }), _jsxs("select", { value: shipping.distrito, onChange: (e) => setShipping({ ...shipping, distrito: e.target.value }), className: `${inputClass("distrito")} appearance-none cursor-pointer`, style: { fontFamily: "Inter, sans-serif" }, children: [_jsx("option", { value: "", children: "Seleccionar distrito..." }), limaDistritos.map((d) => (_jsx("option", { value: d, children: d }, d)))] }), errors.distrito && (_jsx("p", { className: "text-[11px] text-red-500 mt-1", style: { fontFamily: "Inter, sans-serif" }, children: errors.distrito }))] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Referencia de Ubicaci\u00F3n" }), _jsx("input", { type: "text", value: shipping.referencia, onChange: (e) => setShipping({ ...shipping, referencia: e.target.value }), placeholder: "Ej. Frente a la Estaci\u00F3n del Tren, port\u00F3n azul", className: inputClass("referencia"), style: { fontFamily: "Inter, sans-serif" } })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Tipo de Entrega" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("button", { onClick: () => setShipping({ ...shipping, tipoEntrega: "standard" }), className: `flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${shipping.tipoEntrega === "standard"
                                                        ? "border-[#0a4d8c] bg-[#f0f7ff]"
                                                        : "border-border bg-white hover:border-[#0a4d8c]/30"}`, children: [_jsx(Truck, { className: `w-5 h-5 mt-0.5 shrink-0 ${shipping.tipoEntrega === "standard" ? "text-[#0a4d8c]" : "text-muted-foreground"}` }), _jsxs("div", { children: [_jsx("p", { className: `text-[13px] ${shipping.tipoEntrega === "standard" ? "text-[#0a4d8c]" : "text-foreground"}`, style: { fontFamily: "Inter, sans-serif", fontWeight: 600 }, children: "Est\u00E1ndar" }), _jsx("p", { className: "text-[11.5px] text-muted-foreground mt-0.5", style: { fontFamily: "Inter, sans-serif" }, children: "48 a 72 horas h\u00E1biles" }), _jsx("p", { className: "text-[12px] mt-1", style: {
                                                                        fontFamily: "Montserrat, sans-serif",
                                                                        fontWeight: 700,
                                                                        color: subtotal >= 150 ? "#059669" : "#0a4d8c",
                                                                    }, children: subtotal >= 150 ? "Gratis" : "S/ 50.00" })] })] }), _jsxs("button", { onClick: () => setShipping({ ...shipping, tipoEntrega: "express" }), className: `flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${shipping.tipoEntrega === "express"
                                                        ? "border-[#0a4d8c] bg-[#f0f7ff]"
                                                        : "border-border bg-white hover:border-[#0a4d8c]/30"}`, children: [_jsx(Clock, { className: `w-5 h-5 mt-0.5 shrink-0 ${shipping.tipoEntrega === "express" ? "text-[#0a4d8c]" : "text-muted-foreground"}` }), _jsxs("div", { children: [_jsx("p", { className: `text-[13px] ${shipping.tipoEntrega === "express" ? "text-[#0a4d8c]" : "text-foreground"}`, style: { fontFamily: "Inter, sans-serif", fontWeight: 600 }, children: "Express" }), _jsx("p", { className: "text-[11.5px] text-muted-foreground mt-0.5", style: { fontFamily: "Inter, sans-serif" }, children: "Dentro de 24 horas h\u00E1biles" }), _jsx("p", { className: "text-[12px] mt-1", style: {
                                                                        fontFamily: "Montserrat, sans-serif",
                                                                        fontWeight: 700,
                                                                        color: subtotal >= 150 ? "#059669" : "#0a4d8c",
                                                                    }, children: subtotal >= 150 ? "Gratis" : "S/ 50.00" })] })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Notas adicionales para el env\u00EDo" }), _jsx("textarea", { value: shipping.notas, onChange: (e) => setShipping({ ...shipping, notas: e.target.value }), placeholder: "Ej. Horario de recepci\u00F3n de 8am a 5pm, preguntar por almac\u00E9n...", rows: 2, className: `${inputClass("notas")} resize-none`, style: { fontFamily: "Inter, sans-serif" } })] })] })), !orderSent && step === 3 && (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "p-4 bg-[#f5f7fa] rounded-xl border border-border", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "w-4 h-4 text-[#0a4d8c]" }), _jsx("h4", { className: "text-foreground", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }, children: "Datos del Cliente" })] }), _jsx("button", { onClick: () => setStep(1), className: "text-[12px] text-[#0a4d8c] hover:underline", style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Editar" })] }), _jsxs("div", { className: "space-y-1 text-[13px]", style: { fontFamily: "Inter, sans-serif" }, children: [_jsxs("p", { className: "text-foreground", style: { fontWeight: 500 }, children: [customer.nombre, " ", customer.apellido] }), _jsxs("p", { className: "text-muted-foreground", children: [customer.tipoDoc, ": ", customer.numDoc, customer.tipoDoc === "RUC" && customer.razonSocial ? ` · ${customer.razonSocial}` : ""] }), _jsxs("p", { className: "text-muted-foreground", children: [customer.email, " \u00B7 ", customer.telefono] })] })] }), _jsxs("div", { className: "p-4 bg-[#f5f7fa] rounded-xl border border-border", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-4 h-4 text-[#0a4d8c]" }), _jsx("h4", { className: "text-foreground", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }, children: "Direcci\u00F3n de Env\u00EDo" })] }), _jsx("button", { onClick: () => setStep(2), className: "text-[12px] text-[#0a4d8c] hover:underline", style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Editar" })] }), _jsxs("div", { className: "space-y-1 text-[13px]", style: { fontFamily: "Inter, sans-serif" }, children: [_jsx("p", { className: "text-foreground", style: { fontWeight: 500 }, children: shipping.direccion }), _jsxs("p", { className: "text-muted-foreground", children: [shipping.distrito, ", Lima"] }), shipping.referencia && (_jsxs("p", { className: "text-muted-foreground", children: ["Ref: ", shipping.referencia] })), _jsx("p", { className: "text-[#0a4d8c]", style: { fontWeight: 500 }, children: shipping.tipoEntrega === "express"
                                                        ? "Entrega Express (24h)"
                                                        : "Entrega Estándar (48-72h)" }), shipping.notas && (_jsxs("p", { className: "text-muted-foreground italic", children: ["\"", shipping.notas, "\""] }))] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(ClipboardList, { className: "w-4 h-4 text-[#0a4d8c]" }), _jsxs("h4", { className: "text-foreground", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }, children: ["Productos (", totalItems, ")"] })] }), _jsx("div", { className: "space-y-2", children: items.map((item) => {
                                                const price = getItemPrice(item);
                                                const unitLabel = getItemUnitLabel(item);
                                                return (_jsxs("div", { className: "flex items-center gap-3 p-2.5 bg-[#f5f7fa] rounded-lg", children: [_jsx("div", { className: "w-10 h-10 rounded-md overflow-hidden bg-white shrink-0", children: _jsx(ImageWithFallback, { src: item.product.image, alt: item.product.name, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-[12px] text-foreground truncate", style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: item.product.name }), _jsxs("p", { className: "text-[11px] text-muted-foreground", style: { fontFamily: "Inter, sans-serif" }, children: [item.quantity, " ", unitLabel, "(s) \u00D7 ", formatPrice(price)] })] }), _jsx("span", { className: "text-[#0a4d8c] text-[12.5px] shrink-0", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 700 }, children: formatPrice(price * item.quantity) })] }, `${item.product.id}-${item.selectedUnit}`));
                                            }) })] }), _jsxs("div", { className: "p-4 bg-[#f0f7ff] rounded-xl border border-[#0a4d8c]/10 space-y-2", children: [_jsxs("div", { className: "flex justify-between text-[13px]", style: { fontFamily: "Inter, sans-serif" }, children: [_jsx("span", { className: "text-muted-foreground", children: "Subtotal" }), _jsx("span", { className: "text-foreground", style: { fontWeight: 500 }, children: formatPrice(subtotal) })] }), _jsxs("div", { className: "flex justify-between text-[13px]", style: { fontFamily: "Inter, sans-serif" }, children: [_jsx("span", { className: "text-muted-foreground", children: "IGV (18%)" }), _jsx("span", { className: "text-foreground", style: { fontWeight: 500 }, children: formatPrice(igv) })] }), _jsxs("div", { className: "flex justify-between text-[13px]", style: { fontFamily: "Inter, sans-serif" }, children: [_jsxs("span", { className: "text-muted-foreground", children: ["Env\u00EDo (", shipping.tipoEntrega === "express" ? "Express" : "Estándar", ")"] }), _jsx("span", { className: shippingCost === 0 ? "text-emerald-600" : "text-foreground", style: { fontFamily: "Inter, sans-serif", fontWeight: 600 }, children: shippingCost === 0 ? "Gratis" : formatPrice(shippingCost) })] }), _jsxs("div", { className: "flex justify-between pt-2.5 border-t border-[#0a4d8c]/10", children: [_jsx("span", { className: "text-foreground", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "15px" }, children: "Total a Pagar" }), _jsx("span", { className: "text-[#0a4d8c]", style: { fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "1.15rem" }, children: formatPrice(total) })] })] }), _jsxs("div", { className: "flex items-start gap-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-100", children: [_jsx(MessageCircle, { className: "w-5 h-5 text-emerald-600 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-[12.5px] text-emerald-800", style: { fontFamily: "Inter, sans-serif", fontWeight: 600 }, children: "El pedido se enviar\u00E1 por WhatsApp" }), _jsx("p", { className: "text-[11.5px] text-emerald-700 mt-1", style: { fontFamily: "Inter, sans-serif", lineHeight: 1.5 }, children: "Se abrir\u00E1 WhatsApp con el resumen completo de tu pedido. Nuestro equipo de ventas confirmar\u00E1 disponibilidad y te enviar\u00E1 los datos para realizar el pago." })] })] })] }))] }), !orderSent && (_jsxs("div", { className: "shrink-0 px-5 sm:px-6 py-4 border-t border-border bg-white flex items-center justify-between gap-3", children: [step > 1 ? (_jsxs("button", { onClick: handleBack, className: "flex items-center gap-2 px-4 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors", style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Atr\u00E1s"] })) : (_jsx("button", { onClick: onClose, className: "flex items-center gap-2 px-4 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors", style: { fontFamily: "Inter, sans-serif", fontWeight: 500 }, children: "Volver al Carrito" })), step < 3 ? (_jsxs("button", { onClick: handleNext, className: "flex items-center gap-2 text-white px-6 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25", style: {
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 700,
                                fontSize: "13.5px",
                                background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 50%, #00bcd4 100%)",
                            }, children: ["Continuar", _jsx(ArrowRight, { className: "w-4 h-4" })] })) : (_jsxs("button", { onClick: handleSendWhatsApp, className: "flex items-center gap-2 text-white px-6 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/30", style: {
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 700,
                                fontSize: "13.5px",
                                background: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
                            }, children: [_jsx(MessageCircle, { className: "w-4.5 h-4.5" }), "Enviar Pedido por WhatsApp"] }))] }))] }) }));
}
