import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { X, Handshake, ShieldCheck, Lightbulb, Clock, Target, Eye, Truck, Phone, Mail, MapPin, Award, HeartHandshake, MessageCircle, User, ClipboardList, Package, ArrowRight, Sparkles, PenLine, Lock, Save, Building2, LogOut } from "lucide-react";
import { formatPrice } from "./data";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductCard } from "./ProductCard";
import { useAdmin } from "./admin/AdminContext";
import { useUser } from "./UserContext";
// ─── Values data ────────────────────────────────────────
const values = [
    {
        icon: Handshake,
        title: "Compromiso",
        description: "Nos comprometemos con cada cliente, cumpliendo lo que prometemos y superando expectativas.",
        color: "from-[#0a4d8c] to-[#0288d1]",
    },
    {
        icon: ShieldCheck,
        title: "Confianza",
        description: "Construimos relaciones duraderas basadas en la transparencia y la honestidad.",
        color: "from-[#0288d1] to-[#00bcd4]",
    },
    {
        icon: HeartHandshake,
        title: "Responsabilidad",
        description: "Cada pedido es importante. Cuidamos cada detalle para garantizar tu satisfacción.",
        color: "from-[#00bcd4] to-[#0288d1]",
    },
    {
        icon: Lightbulb,
        title: "Innovación",
        description: "Incorporamos soluciones modernas para optimizar el abastecimiento de tu empresa.",
        color: "from-[#0288d1] to-[#0a4d8c]",
    },
    {
        icon: Clock,
        title: "Puntualidad",
        description: "Entregamos a tiempo, porque sabemos que tu operación no puede detenerse.",
        color: "from-[#0a4d8c] to-[#00bcd4]",
    },
];
// ─── Modal Shell ────────────────────────────────────────
function ModalShell({ onClose, children, }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);
    return (_jsxs("div", { className: "fixed inset-0 z-[100] flex items-start justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl mx-4 my-[4vh]", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105", "aria-label": "Cerrar", children: _jsx(X, { className: "w-5 h-5 text-[#0a4d8c]" }) }), children] })] }));
}
// ─── Nuestra Empresa ────────────────────────────────────
export function EmpresaContent() {
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1740914994154-c3273e113336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwd2FyZWhvdXNlJTIwbG9naXN0aWNzJTIwc3VwcGxpZXN8ZW58MXx8fHwxNzcwNzQyMjk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", alt: "Almac\u00E9n industrial", className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0", style: {
                                    background: "linear-gradient(135deg, rgba(10,77,140,0.92) 0%, rgba(2,136,209,0.85) 50%, rgba(0,188,212,0.78) 100%)",
                                } })] }), _jsxs("div", { className: "relative px-6 md:px-12 pt-12 pb-14 text-white text-center", children: [_jsx("div", { className: "flex justify-center mb-5", children: _jsx("img", { src: "http://imagenes.tmo.com.pe/imagenes/logotipo/ssi%20logo%20blanco.png", alt: "TMO Suministros", className: "h-16 md:h-20 w-auto object-contain" }) }), _jsxs("h1", { className: "text-white mb-3", style: {
                                    fontFamily: "Montserrat, sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
                                    lineHeight: 1.15,
                                }, children: ["Somos TMO ", _jsx("br", { className: "sm:hidden" }), "Suministros Industriales"] }), _jsx("p", { className: "max-w-xl mx-auto text-white/90", style: {
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
                                    lineHeight: 1.6,
                                }, children: "Tu aliado estrat\u00E9gico en suministros esenciales para empresas en Lima Metropolitana y Callao. Abastecemos tu operaci\u00F3n con calidad, rapidez y los mejores precios." })] })] }), _jsx("div", { className: "px-6 md:px-12 py-10", children: _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "relative overflow-hidden rounded-xl border border-[#0a4d8c]/10 bg-gradient-to-br from-[#f0f7ff] to-white p-6 md:p-7", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-gradient-to-br from-[#0a4d8c] to-[#0288d1] flex items-center justify-center shrink-0", children: _jsx(Target, { className: "w-5 h-5 text-white" }) }), _jsx("h2", { className: "text-[#0a4d8c]", style: {
                                                fontFamily: "Montserrat, sans-serif",
                                                fontWeight: 700,
                                                fontSize: "1.25rem",
                                            }, children: "Misi\u00F3n" })] }), _jsx("p", { className: "text-[#374151]", style: {
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: "0.9rem",
                                        lineHeight: 1.7,
                                    }, children: "Proveer suministros industriales y de oficina de alta calidad a empresas de Lima Metropolitana y Callao, garantizando entregas r\u00E1pidas, precios competitivos y un servicio personalizado que impulse la productividad de nuestros clientes." })] }), _jsxs("div", { className: "relative overflow-hidden rounded-xl p-6 md:p-7 text-white", style: {
                                background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 60%, #00bcd4 100%)",
                            }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0", children: _jsx(Eye, { className: "w-5 h-5 text-white" }) }), _jsx("h2", { style: {
                                                fontFamily: "Montserrat, sans-serif",
                                                fontWeight: 700,
                                                fontSize: "1.25rem",
                                                color: "white",
                                            }, children: "Visi\u00F3n" })] }), _jsx("p", { className: "text-white/90", style: {
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: "0.9rem",
                                        lineHeight: 1.7,
                                    }, children: "Ser reconocidos como el proveedor l\u00EDder en soluciones de abastecimiento empresarial en Lima, destac\u00E1ndonos por nuestra rapidez, eficiencia y compromiso con la calidad. Convertirnos en un ecosistema integral que facilite la gesti\u00F3n y optimizaci\u00F3n de los recursos corporativos." })] })] }) }), _jsxs("div", { className: "px-6 md:px-12 pb-10", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-[#0a4d8c] mb-2", style: {
                                    fontFamily: "Montserrat, sans-serif",
                                    fontWeight: 700,
                                    fontSize: "1.35rem",
                                }, children: "Nuestros Valores" }), _jsx("p", { className: "text-[#6b7280]", style: { fontFamily: "Inter, sans-serif", fontSize: "0.88rem" }, children: "Los pilares que gu\u00EDan cada entrega y cada relaci\u00F3n con nuestros clientes" })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: values.map((value) => (_jsxs("div", { className: "group relative rounded-xl overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-lg", children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${value.color} opacity-90` }), _jsxs("div", { className: "relative p-5 md:p-6 text-center flex flex-col items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300", children: _jsx(value.icon, { className: "w-6 h-6 text-white" }) }), _jsx("h3", { className: "text-white", style: {
                                                fontFamily: "Montserrat, sans-serif",
                                                fontWeight: 700,
                                                fontSize: "0.85rem",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.05em",
                                            }, children: value.title }), _jsx("p", { className: "text-white/85 hidden sm:block", style: {
                                                fontFamily: "Inter, sans-serif",
                                                fontSize: "0.78rem",
                                                lineHeight: 1.5,
                                            }, children: value.description })] })] }, value.title))) })] }), _jsx("div", { className: "px-6 md:px-12 pb-10", children: _jsxs("div", { className: "bg-[#f8fafc] rounded-xl p-6 md:p-8 border border-[#e5e7eb]", children: [_jsx("h2", { className: "text-[#0a4d8c] text-center mb-6", style: {
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 700,
                                fontSize: "1.25rem",
                            }, children: "\u00BFPor qu\u00E9 elegirnos?" }), _jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                                {
                                    icon: Truck,
                                    title: "Entrega Rápida",
                                    desc: "Despacho en 24-48h en Lima Metropolitana y Callao. Opción express disponible.",
                                },
                                {
                                    icon: Award,
                                    title: "Productos de Calidad",
                                    desc: "Trabajamos con marcas reconocidas: Faber-Castell, Report, Millennium y más.",
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Precios Competitivos",
                                    desc: "Precios mayoristas accesibles con opción de compra por unidad o por caja.",
                                },
                                {
                                    icon: HeartHandshake,
                                    title: "Atención Personalizada",
                                    desc: "Pedidos por WhatsApp con asesoría directa. Tu pedido, a un mensaje de distancia.",
                                },
                            ].map((item) => (_jsxs("div", { className: "flex gap-3 items-start", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-[#0a4d8c]/10 flex items-center justify-center shrink-0 mt-0.5", children: _jsx(item.icon, { className: "w-4.5 h-4.5 text-[#0a4d8c]" }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-[#1f2937] mb-1", style: {
                                                    fontFamily: "Inter, sans-serif",
                                                    fontWeight: 600,
                                                    fontSize: "0.88rem",
                                                }, children: item.title }), _jsx("p", { className: "text-[#6b7280]", style: {
                                                    fontFamily: "Inter, sans-serif",
                                                    fontSize: "0.82rem",
                                                    lineHeight: 1.5,
                                                }, children: item.desc })] })] }, item.title))) })] }) }), _jsx("div", { className: "px-6 md:px-12 py-6", style: {
                    background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 60%, #00bcd4 100%)",
                }, children: _jsx("p", { className: "text-center text-white/70", style: { fontFamily: "Inter, sans-serif", fontSize: "0.78rem" }, children: "TMO Suministros Industriales. Todos los derechos reservados." }) })] }));
}
// ─── Contáctanos ────────────────────────────────────────
export function ContactoContent() {
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative overflow-hidden px-6 md:px-12 pt-12 pb-14 text-center", style: {
                    background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 60%, #00bcd4 100%)",
                }, children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsx("div", { className: "w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center", children: _jsx(MessageCircle, { className: "w-8 h-8 text-white" }) }) }), _jsx("h1", { className: "text-white mb-2", style: {
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 700,
                            fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                        }, children: "Cont\u00E1ctanos" }), _jsx("p", { className: "max-w-md mx-auto text-white/85", style: {
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.9rem",
                            lineHeight: 1.6,
                        }, children: "Estamos listos para atender tu pedido. Comun\u00EDcate con nosotros por el canal que prefieras." })] }), _jsxs("div", { className: "px-6 md:px-12 py-10 space-y-6", children: [_jsxs("a", { href: "https://wa.me/51976222970", target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-4 p-5 rounded-xl border-2 border-[#25D366]/30 bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors group", children: [_jsx("div", { className: "w-14 h-14 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: _jsx(MessageCircle, { className: "w-7 h-7 text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-[#1f2937] mb-0.5", style: {
                                            fontFamily: "Montserrat, sans-serif",
                                            fontWeight: 700,
                                            fontSize: "1rem",
                                        }, children: "WhatsApp - Canal principal" }), _jsx("p", { className: "text-[#6b7280]", style: {
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: "0.85rem",
                                        }, children: "+51 976 222 970 \u2014 Respuesta inmediata en horario laboral" })] })] }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [_jsxs("a", { href: "tel:+51976222970", className: "flex items-center gap-3 p-4 rounded-xl bg-[#f5f7fa] hover:bg-[#e8f0fe] border border-transparent hover:border-[#0a4d8c]/15 transition-all", children: [_jsx("div", { className: "w-11 h-11 rounded-lg bg-[#0a4d8c]/10 flex items-center justify-center shrink-0", children: _jsx(Phone, { className: "w-5 h-5 text-[#0a4d8c]" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[#6b7280]", style: {
                                                    fontFamily: "Inter, sans-serif",
                                                    fontSize: "0.78rem",
                                                }, children: "Tel\u00E9fono" }), _jsx("p", { className: "text-[#1f2937]", style: {
                                                    fontFamily: "Inter, sans-serif",
                                                    fontWeight: 600,
                                                    fontSize: "0.9rem",
                                                }, children: "+51 976 222 970" })] })] }), _jsxs("a", { href: "mailto:ventas@tmo.pe", className: "flex items-center gap-3 p-4 rounded-xl bg-[#f5f7fa] hover:bg-[#e8f0fe] border border-transparent hover:border-[#0a4d8c]/15 transition-all", children: [_jsx("div", { className: "w-11 h-11 rounded-lg bg-[#0a4d8c]/10 flex items-center justify-center shrink-0", children: _jsx(Mail, { className: "w-5 h-5 text-[#0a4d8c]" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[#6b7280]", style: {
                                                    fontFamily: "Inter, sans-serif",
                                                    fontSize: "0.78rem",
                                                }, children: "Correo electr\u00F3nico" }), _jsx("p", { className: "text-[#1f2937]", style: {
                                                    fontFamily: "Inter, sans-serif",
                                                    fontWeight: 600,
                                                    fontSize: "0.9rem",
                                                }, children: "ventas@tmo.pe" })] })] }), _jsxs("div", { className: "flex items-center gap-3 p-4 rounded-xl bg-[#f5f7fa] border border-transparent", children: [_jsx("div", { className: "w-11 h-11 rounded-lg bg-[#0a4d8c]/10 flex items-center justify-center shrink-0", children: _jsx(MapPin, { className: "w-5 h-5 text-[#0a4d8c]" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[#6b7280]", style: {
                                                    fontFamily: "Inter, sans-serif",
                                                    fontSize: "0.78rem",
                                                }, children: "Ubicaci\u00F3n" }), _jsx("p", { className: "text-[#1f2937]", style: {
                                                    fontFamily: "Inter, sans-serif",
                                                    fontWeight: 600,
                                                    fontSize: "0.9rem",
                                                }, children: "Lima Metropolitana y Callao" })] })] }), _jsxs("div", { className: "flex items-center gap-3 p-4 rounded-xl bg-[#f5f7fa] border border-transparent", children: [_jsx("div", { className: "w-11 h-11 rounded-lg bg-[#0a4d8c]/10 flex items-center justify-center shrink-0", children: _jsx(Clock, { className: "w-5 h-5 text-[#0a4d8c]" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[#6b7280]", style: {
                                                    fontFamily: "Inter, sans-serif",
                                                    fontSize: "0.78rem",
                                                }, children: "Horario de atenci\u00F3n" }), _jsx("p", { className: "text-[#1f2937]", style: {
                                                    fontFamily: "Inter, sans-serif",
                                                    fontWeight: 600,
                                                    fontSize: "0.9rem",
                                                }, children: "Lun \u2013 S\u00E1b: 8:00 AM \u2013 6:00 PM" })] })] })] }), _jsx("div", { className: "bg-[#f0f7ff] rounded-xl p-5 border border-[#0a4d8c]/10", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Truck, { className: "w-5 h-5 text-[#0a4d8c] mt-0.5 shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "text-[#0a4d8c] mb-1", style: {
                                                fontFamily: "Inter, sans-serif",
                                                fontWeight: 600,
                                                fontSize: "0.88rem",
                                            }, children: "Zona de cobertura" }), _jsx("p", { className: "text-[#6b7280]", style: {
                                                fontFamily: "Inter, sans-serif",
                                                fontSize: "0.82rem",
                                                lineHeight: 1.6,
                                            }, children: "Realizamos entregas en los 44 distritos de Lima Metropolitana y Callao. Entrega est\u00E1ndar en 24-48 horas y opci\u00F3n express disponible." })] })] }) })] })] }));
}
// ─── Mi Cuenta ──────────────────────────────────────────
export function CuentaContent() {
    const { user, isLoggedIn, logout, updateProfile, updatePassword } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);
    const isAdminPath = location.pathname.startsWith('/admin');
    // Redirect admin users to dashboard if they land on public profile
    useEffect(() => {
        if (isLoggedIn && (user?.role === 'ADMIN' || user?.role === 'MANAGER') && !isAdminPath) {
            navigate('/admin/dashboard');
        }
    }, [isLoggedIn, user, navigate, isAdminPath]);
    // Profile Form State
    const [profileData, setProfileData] = useState(user);
    // Password Form State
    const [passForm, setPassForm] = useState({
        current: "",
        new: "",
        confirm: ""
    });
    useEffect(() => {
        if (user && (!profileData || profileData.id !== user.id)) {
            setProfileData(user);
        }
    }, [user]);
    if (!isLoggedIn)
        return null;
    if (!user || !profileData)
        return null;
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        await updateProfile(profileData);
        setIsSaving(false);
    };
    const handlePassSubmit = async (e) => {
        e.preventDefault();
        if (passForm.new !== passForm.confirm) {
            return;
        }
        setIsSaving(true);
        const success = await updatePassword(passForm.current, passForm.new);
        if (success) {
            setPassForm({ current: "", new: "", confirm: "" });
        }
        setIsSaving(false);
    };
    const inputClass = "w-full px-4 py-2.5 bg-[#f5f7fa] border border-border rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all";
    const labelClass = "block text-[13px] font-bold text-[#374151] mb-1.5 ml-1";
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative overflow-hidden px-6 md:px-12 pt-12 pb-14 text-center", style: {
                    background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 60%, #00bcd4 100%)",
                }, children: [_jsxs("button", { onClick: logout, className: "absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all border border-white/20 backdrop-blur-md", style: { fontFamily: "Inter, sans-serif" }, children: [_jsx(LogOut, { className: "w-4 h-4" }), _jsx("span", { className: "hidden sm:inline", children: "Cerrar Sesi\u00F3n" })] }), (user?.role === 'ADMIN' || user?.role === 'MANAGER') && (_jsxs("button", { onClick: () => navigate('/admin/dashboard'), className: "absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 bg-white text-[#0a4d8c] hover:bg-[#f0f7ff] rounded-lg text-xs font-bold transition-all shadow-lg border border-white", style: { fontFamily: "Inter, sans-serif" }, children: [_jsx(ShieldCheck, { className: "w-4 h-4" }), _jsx("span", { className: "hidden sm:inline", children: "Panel Administrador" })] })), _jsx("div", { className: "flex justify-center mb-4", children: _jsx("div", { className: "w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl", children: _jsx(User, { className: "w-10 h-10 text-white" }) }) }), _jsxs("h1", { className: "text-white mb-2", style: {
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 800,
                            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                        }, children: [user.name, " ", user.lastName || ""] }), _jsx("p", { className: "max-w-md mx-auto text-white/80", style: {
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.95rem",
                        }, children: "Gestiona tu perfil corporativo y seguridad" })] }), _jsxs("div", { className: "max-w-4xl mx-auto px-4 md:px-8 py-10", children: [_jsxs("div", { className: "flex bg-[#f5f7fa] p-1.5 rounded-2xl mb-8 border border-border max-w-sm mx-auto sm:mx-0", children: [_jsxs("button", { onClick: () => setActiveTab("profile"), className: `flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all ${activeTab === "profile"
                                    ? "bg-white text-[#0a4d8c] shadow-md"
                                    : "text-[#64748b] hover:text-[#0a4d8c]"}`, style: { fontFamily: "Inter, sans-serif" }, children: [_jsx(User, { className: "w-4 h-4" }), "Perfil"] }), _jsxs("button", { onClick: () => setActiveTab("security"), className: `flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all ${activeTab === "security"
                                    ? "bg-white text-[#0a4d8c] shadow-md"
                                    : "text-[#64748b] hover:text-[#0a4d8c]"}`, style: { fontFamily: "Inter, sans-serif" }, children: [_jsx(Lock, { className: "w-4 h-4" }), "Seguridad"] })] }), activeTab === "profile" ? (_jsxs("form", { onSubmit: handleProfileSubmit, className: "space-y-8 animate-in fade-in duration-500", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "space-y-5", children: [_jsxs("h3", { className: "text-[#0a4d8c] font-bold text-[15px] flex items-center gap-2 border-b border-border pb-2", style: { fontFamily: "Montserrat, sans-serif" }, children: [_jsx(User, { className: "w-4 h-4" }), " Datos Personales"] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Nombre" }), _jsx("input", { type: "text", value: profileData.name, onChange: e => setProfileData({ ...profileData, name: e.target.value }), className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Apellido" }), _jsx("input", { type: "text", value: profileData.lastName, onChange: e => setProfileData({ ...profileData, lastName: e.target.value }), className: inputClass })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Correo Electr\u00F3nico" }), _jsx("input", { type: "email", value: profileData.email, onChange: e => setProfileData({ ...profileData, email: e.target.value }), className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Tel\u00E9fono / Celular" }), _jsx("input", { type: "tel", value: profileData.phone, onChange: e => setProfileData({ ...profileData, phone: e.target.value }), className: inputClass })] })] }), _jsxs("div", { className: "space-y-5", children: [_jsxs("h3", { className: "text-[#0a4d8c] font-bold text-[15px] flex items-center gap-2 border-b border-border pb-2", style: { fontFamily: "Montserrat, sans-serif" }, children: [_jsx(Building2, { className: "w-4 h-4" }), " Informaci\u00F3n Corporativa"] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Tipo Doc." }), _jsxs("select", { value: profileData.documentType, onChange: e => setProfileData({ ...profileData, documentType: e.target.value }), className: inputClass, children: [_jsx("option", { value: "DNI", children: "DNI" }), _jsx("option", { value: "RUC", children: "RUC" })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "N\u00B0 Documento" }), _jsx("input", { type: "text", value: profileData.documentNumber, onChange: e => setProfileData({ ...profileData, documentNumber: e.target.value }), className: inputClass })] })] }), profileData.documentType === "RUC" && (_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Raz\u00F3n Social" }), _jsx("input", { type: "text", value: profileData.companyName || "", onChange: e => setProfileData({ ...profileData, companyName: e.target.value }), className: inputClass, placeholder: "Nombre de la empresa" })] }))] })] }), _jsxs("div", { className: "p-5 bg-[#f0f7ff] rounded-2xl border border-[#0a4d8c]/15 space-y-5", children: [_jsxs("h3", { className: "text-[#0a4d8c] font-bold text-[15px] flex items-center gap-2", style: { fontFamily: "Montserrat, sans-serif" }, children: [_jsx(MapPin, { className: "w-4 h-4" }), " Direcci\u00F3n de Env\u00EDo Predeterminada", _jsx("span", { className: "ml-auto text-[11px] font-normal text-[#0a4d8c]/60 bg-[#0a4d8c]/10 px-2 py-0.5 rounded-full", children: "Se usar\u00E1 para completar tus pedidos autom\u00E1ticamente" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: labelClass, children: "Direcci\u00F3n Completa" }), _jsx("input", { type: "text", value: profileData.shippingAddress || "", onChange: e => setProfileData({ ...profileData, shippingAddress: e.target.value }), className: inputClass, placeholder: "Av. Industrial 1234, Piso 2, Oficina 201" })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Distrito (Lima / Callao)" }), _jsxs("select", { value: profileData.shippingDistrict || "", onChange: e => setProfileData({ ...profileData, shippingDistrict: e.target.value }), className: inputClass, children: [_jsx("option", { value: "", children: "Seleccionar distrito..." }), ["Ate", "Barranco", "Breña", "Callao", "Carabayllo", "Cercado de Lima", "Chaclacayo", "Chorrillos", "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María", "La Molina", "La Victoria", "Lince", "Los Olivos", "Lurigancho", "Lurín", "Magdalena del Mar", "Miraflores", "Pachacámac", "Pucusana", "Pueblo Libre", "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo", "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores", "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita", "Santa María del Mar", "Santa Rosa", "Santiago de Surco", "Surquillo", "Ventanilla", "Villa El Salvador", "Villa María del Triunfo"].map(d => (_jsx("option", { value: d, children: d }, d)))] })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Referencia de Ubicaci\u00F3n" }), _jsx("input", { type: "text", value: profileData.shippingReference || "", onChange: e => setProfileData({ ...profileData, shippingReference: e.target.value }), className: inputClass, placeholder: "Ej. Frente al grifo, port\u00F3n azul" })] })] })] }), _jsx("div", { className: "pt-6 border-t border-border flex justify-end", children: _jsxs("button", { type: "submit", disabled: isSaving, className: "flex items-center justify-center gap-2 bg-[#0a4d8c] text-white px-8 py-3 rounded-xl font-bold text-[14px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50", style: { fontFamily: "Montserrat, sans-serif" }, children: [isSaving ? (_jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" })) : (_jsx(Save, { className: "w-4 h-4" })), "Actualizar Perfil"] }) })] })) : (_jsxs("form", { onSubmit: handlePassSubmit, className: "max-w-md mx-auto space-y-6 animate-in fade-in duration-500", children: [_jsxs("div", { className: "bg-[#fff9eb] border border-amber-200 p-4 rounded-xl flex items-start gap-3", children: [_jsx(Lock, { className: "w-5 h-5 text-amber-600 mt-0.5 shrink-0" }), _jsx("p", { className: "text-[12.5px] text-amber-800 leading-relaxed", style: { fontFamily: "Inter, sans-serif" }, children: "Mant\u00E9n tu cuenta segura usando una contrase\u00F1a robusta de al menos 8 caracteres, combinando letras, n\u00FAmeros y s\u00EDmbolos." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Contrase\u00F1a Actual" }), _jsx("input", { type: "password", required: true, value: passForm.current, onChange: e => setPassForm({ ...passForm, current: e.target.value }), className: inputClass, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), _jsx("div", { className: "pt-2 border-t border-border" }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Nueva Contrase\u00F1a" }), _jsx("input", { type: "password", required: true, value: passForm.new, onChange: e => setPassForm({ ...passForm, new: e.target.value }), className: inputClass, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), _jsxs("div", { children: [_jsx("label", { className: labelClass, children: "Confirmar Nueva Contrase\u00F1a" }), _jsx("input", { type: "password", required: true, value: passForm.confirm, onChange: e => setPassForm({ ...passForm, confirm: e.target.value }), className: `${inputClass} ${passForm.confirm && passForm.new !== passForm.confirm ? "border-red-300 bg-red-50" : ""}`, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), passForm.confirm && passForm.new !== passForm.confirm && (_jsx("p", { className: "text-[11px] text-red-500 mt-1 ml-1", style: { fontFamily: "Inter, sans-serif" }, children: "Las contrase\u00F1as no coinciden" }))] })] }), _jsx("div", { className: "pt-4 flex justify-end", children: _jsxs("button", { type: "submit", disabled: isSaving || !passForm.current || !passForm.new || passForm.new !== passForm.confirm, className: "w-full flex items-center justify-center gap-2 bg-[#333] text-white px-8 py-3 rounded-xl font-bold text-[14px] shadow-lg active:scale-95 transition-all disabled:opacity-50", style: { fontFamily: "Montserrat, sans-serif" }, children: [isSaving ? (_jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" })) : (_jsx(Lock, { className: "w-4 h-4" })), "Cambiar Contrase\u00F1a"] }) })] }))] })] }));
}
// ─── Productos ──────────────────────────────────────────
const catIcons = {
    oficina: PenLine,
    empaque: Package,
    limpieza: Sparkles,
    sabanillas: ClipboardList,
};
export function ProductosContent({ onViewProduct, onAddToCart, onClose, }) {
    const { products, categories } = useAdmin();
    const [activeCategory, setActiveCategory] = useState("all");
    const filteredProducts = products.filter(p => p.isActive !== false && (activeCategory === "all" || p.category === activeCategory));
    // Cross-sell: one product from each category that is NOT the active category
    const activeProducts = products.filter(p => p.isActive !== false);
    const crossSellCategories = categories.filter((c) => c.id !== activeCategory);
    const crossSellProducts = crossSellCategories
        .map((cat) => activeProducts.find((p) => p.category === cat.id))
        .filter(Boolean);
    const handleViewProduct = (p) => {
        onClose();
        setTimeout(() => onViewProduct?.(p), 200);
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative overflow-hidden pt-16 pb-16 text-center", children: [_jsxs("div", { className: "absolute inset-0", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1631856956423-2b95dae0ba74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwd2FyZWhvdXNlJTIwc3VwcGxpZXMlMjBzaGVsdmVzfGVufDF8fHx8MTc3MDc2NTQ0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", alt: "Almac\u00E9n de suministros", className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0", style: {
                                    background: "linear-gradient(135deg, rgba(10,77,140,0.92) 0%, rgba(2,136,209,0.85) 50%, rgba(0,188,212,0.78) 100%)",
                                } })] }), _jsxs("div", { className: "relative z-10 px-6 md:px-12", children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsx("div", { className: "w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center", children: _jsx(Package, { className: "w-8 h-8 text-white" }) }) }), _jsx("h1", { className: "text-white mb-2", style: {
                                    fontFamily: "Montserrat, sans-serif",
                                    fontWeight: 700,
                                    fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                                }, children: "Nuestros Productos" }), _jsx("p", { className: "max-w-md mx-auto text-white/85", style: {
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "0.9rem",
                                    lineHeight: 1.6,
                                }, children: "Explora nuestro cat\u00E1logo de suministros industriales y de oficina para Lima Metropolitana y Callao" })] })] }), _jsx("div", { className: "px-4 md:px-8 lg:px-10 py-8", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-6 max-w-[1400px] mx-auto", children: [_jsxs("div", { className: "md:w-60 shrink-0", children: [_jsx("h3", { className: "text-[#0a4d8c] mb-3 hidden md:block", style: {
                                        fontFamily: "Montserrat, sans-serif",
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                    }, children: "Categor\u00EDas" }), _jsxs("div", { className: "flex flex-row md:flex-col flex-wrap gap-2", children: [_jsxs("button", { onClick: () => setActiveCategory("all"), className: `flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] transition-all w-full text-left ${activeCategory === "all"
                                                ? "text-white shadow-md"
                                                : "bg-[#f5f7fa] text-[#374151] hover:bg-[#e8f0fe]"}`, style: {
                                                fontFamily: "Inter, sans-serif",
                                                fontWeight: activeCategory === "all" ? 600 : 400,
                                                ...(activeCategory === "all"
                                                    ? {
                                                        background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 100%)",
                                                    }
                                                    : {}),
                                            }, children: [_jsx(Package, { className: "w-3.5 h-3.5 shrink-0" }), "Todos (", activeProducts.length, ")"] }), categories.map((cat) => {
                                            const CatIcon = catIcons[cat.id] || Package;
                                            const count = activeProducts.filter((p) => p.category === cat.id).length;
                                            return (_jsxs("button", { onClick: () => setActiveCategory(cat.id), className: `flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] transition-all w-full text-left ${activeCategory === cat.id
                                                    ? "text-white shadow-md"
                                                    : "bg-[#f5f7fa] text-[#374151] hover:bg-[#e8f0fe]"}`, style: {
                                                    fontFamily: "Inter, sans-serif",
                                                    fontWeight: activeCategory === cat.id ? 600 : 400,
                                                    ...(activeCategory === cat.id
                                                        ? {
                                                            background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 100%)",
                                                        }
                                                        : {}),
                                                }, children: [_jsx(CatIcon, { className: "w-3.5 h-3.5 shrink-0" }), cat.name, " (", count, ")"] }, cat.id));
                                        })] })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8", children: filteredProducts.map((p) => (_jsx(ProductCard, { product: p, onAddToCart: (product, quantity, selectedUnit) => onAddToCart?.(product, quantity, selectedUnit), onViewDetails: handleViewProduct }, p.id))) }), activeCategory !== "all" && crossSellProducts.length > 0 && (_jsxs("div", { className: "bg-[#f8fafc] rounded-xl p-5 md:p-6 border border-[#e5e7eb]", children: [_jsx("h3", { className: "text-[#0a4d8c] mb-1", style: {
                                                fontFamily: "Montserrat, sans-serif",
                                                fontWeight: 700,
                                                fontSize: "0.95rem",
                                            }, children: "Otros usuarios tambi\u00E9n compraron para su stock b\u00E1sico" }), _jsx("p", { className: "text-[12px] text-muted-foreground mb-4", style: { fontFamily: "Inter, sans-serif" }, children: "Complementa tu pedido con productos de otras categor\u00EDas" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: crossSellProducts.map((p) => {
                                                const catName = categories.find((c) => c.id === p.category)?.name || "";
                                                return (_jsxs("div", { className: "flex items-center gap-3 p-3 bg-white rounded-lg border border-[#e5e7eb] hover:border-[#0a4d8c]/20 transition-all", children: [_jsx("div", { className: "w-14 h-14 rounded-lg overflow-hidden bg-[#f5f7fa] shrink-0 border border-border", children: _jsx(ImageWithFallback, { src: p.image, alt: p.name, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-[#0a4d8c]/10 text-[#0a4d8c]", style: {
                                                                        fontFamily: "Inter, sans-serif",
                                                                        fontWeight: 500,
                                                                    }, children: catName }), _jsx("p", { className: "text-[12px] text-foreground truncate mt-1", style: {
                                                                        fontFamily: "Inter, sans-serif",
                                                                        fontWeight: 500,
                                                                    }, children: p.name }), _jsxs("p", { className: "text-[13px] text-[#0a4d8c]", style: {
                                                                        fontFamily: "Montserrat, sans-serif",
                                                                        fontWeight: 700,
                                                                    }, children: [formatPrice(p.price), _jsxs("span", { className: "text-[10px] text-muted-foreground ml-0.5", style: {
                                                                                fontFamily: "Inter, sans-serif",
                                                                                fontWeight: 400,
                                                                            }, children: ["/", p.unit] })] })] }), _jsxs("button", { onClick: () => handleViewProduct(p), className: "shrink-0 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-white text-[11px] transition-all hover:opacity-90", style: {
                                                                fontFamily: "Inter, sans-serif",
                                                                fontWeight: 600,
                                                                background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 100%)",
                                                            }, children: ["Ver", _jsx(ArrowRight, { className: "w-3 h-3" })] })] }, p.id));
                                            }) })] }))] })] }) })] }));
}
// ─── Main Export ─────────────────────────────────────────
export function AboutModal({ section, onClose, onViewProduct, onAddToCart }) {
    if (!section)
        return null;
    const contentMap = {
        empresa: _jsx(EmpresaContent, {}),
        contacto: _jsx(ContactoContent, {}),
        cuenta: _jsx(CuentaContent, {}),
        productos: (_jsx(ProductosContent, { onViewProduct: onViewProduct, onAddToCart: onAddToCart, onClose: onClose })),
    };
    return (_jsx(ModalShell, { onClose: onClose, children: contentMap[section] }));
}
