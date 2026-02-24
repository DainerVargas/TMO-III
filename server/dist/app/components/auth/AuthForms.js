import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { User, Lock, Mail, Phone, Briefcase, FileText, ArrowRight, Sparkles, Eye, EyeOff, Home, ArrowLeft } from "lucide-react";
import { useUser } from "../UserContext";
export function AuthForms({ initialMode = "login" }) {
    const [mode, setMode] = useState(initialMode);
    // Update mode if prop changes
    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);
    const { user, login, register, isLoggedIn } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    // Form states
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        documentType: "DNI",
        documentNumber: "",
        companyName: "",
    });
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(loginData.email, loginData.password);
            // The login updates the global state. Redirection is handled by useEffect or here.
            // Since state update is async, we can check roles here if we had them or wait.
            // Actually, it's cleaner to let the global state change trigger the redirection 
            // but only in ONE place to avoid the "multiple redirections" issue.
        }
        catch (err) {
            // toast is handled in context
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(registerData);
        }
        catch (err) {
            // toast is handled in context
        }
        finally {
            setIsLoading(false);
        }
    };
    // Centralized redirection logic
    useEffect(() => {
        if (isLoggedIn && user) {
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard', { replace: true });
            }
            else {
                navigate('/mi-cuenta', { replace: true });
            }
        }
    }, [isLoggedIn, user, navigate]);
    const inputClass = "w-full pl-10 pr-4 py-3 bg-[#f5f7fa] border border-border rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all";
    const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 transition-colors group-focus-within:text-[#0a4d8c]";
    const labelClass = "block text-[13px] font-bold text-[#374151] mb-1.5 ml-1";
    return (_jsxs("div", { className: "max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700", children: [_jsxs("button", { onClick: () => navigate("/"), className: "mb-6 flex items-center gap-2 text-[#64748b] hover:text-[#0a4d8c] transition-colors font-medium text-sm group", style: { fontFamily: "Inter, sans-serif" }, children: [_jsx(ArrowLeft, { className: "w-4 h-4 group-hover:-translate-x-1 transition-transform" }), "Volver a la tienda"] }), _jsxs("div", { className: "flex bg-[#f5f7fa] p-1.5 rounded-2xl mb-8 border border-border", children: [_jsxs("button", { onClick: () => setMode("login"), className: `flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold transition-all ${mode === "login"
                            ? "bg-white text-[#0a4d8c] shadow-md"
                            : "text-[#64748b] hover:text-[#0a4d8c]"}`, style: { fontFamily: 'Montserrat, sans-serif' }, children: [_jsx(Lock, { className: "w-4 h-4" }), "Iniciar Sesi\u00F3n"] }), _jsxs("button", { onClick: () => setMode("register"), className: `flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold transition-all ${mode === "register"
                            ? "bg-white text-[#0a4d8c] shadow-md"
                            : "text-[#64748b] hover:text-[#0a4d8c]"}`, style: { fontFamily: 'Montserrat, sans-serif' }, children: [_jsx(User, { className: "w-4 h-4" }), "Crear Cuenta"] })] }), mode === "login" ? (_jsxs("form", { onSubmit: handleLogin, className: "space-y-5 animate-in fade-in duration-500", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("h2", { className: "text-2xl font-extrabold text-[#0a4d8c] mb-2", style: { fontFamily: 'Montserrat, sans-serif' }, children: "Bienvenido de nuevo" }), _jsx("p", { className: "text-muted-foreground text-sm", style: { fontFamily: 'Inter, sans-serif' }, children: "Ingresa tus credenciales para acceder a tu panel corporativo." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "group relative", children: [_jsx("label", { className: labelClass, children: "Correo Electr\u00F3nico" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: iconClass }), _jsx("input", { type: "email", required: true, value: loginData.email, onChange: (e) => setLoginData({ ...loginData, email: e.target.value }), className: inputClass, placeholder: "ejemplo@empresa.com" })] })] }), _jsxs("div", { className: "group relative", children: [_jsx("label", { className: labelClass, children: "Contrase\u00F1a" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: iconClass }), _jsx("input", { type: showPassword ? "text" : "password", required: true, value: loginData.password, onChange: (e) => setLoginData({ ...loginData, password: e.target.value }), className: inputClass, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/60 hover:text-[#0a4d8c] transition-colors", children: showPassword ? _jsx(EyeOff, { className: "w-4 h-4" }) : _jsx(Eye, { className: "w-4 h-4" }) })] })] })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-[#0a4d8c] hover:bg-[#083d6f] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0a4d8c]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group", style: { fontFamily: 'Montserrat, sans-serif' }, children: isLoading ? (_jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" })) : (_jsxs(_Fragment, { children: ["Acceder al Panel", _jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })] })) }), _jsx("div", { className: "pt-2 text-center", children: _jsxs("button", { type: "button", onClick: () => {
                                setMode("register");
                                navigate("/register");
                            }, className: "text-[13px] font-bold text-[#64748b] hover:text-[#0a4d8c] transition-colors", style: { fontFamily: 'Inter, sans-serif' }, children: ["\u00BFNo tienes cuenta? ", _jsx("span", { className: "text-[#0a4d8c] underline underline-offset-4", children: "Registrarme" })] }) })] })) : (_jsxs("form", { onSubmit: handleRegister, className: "space-y-5 animate-in fade-in duration-500", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("h2", { className: "text-2xl font-extrabold text-[#0a4d8c] mb-2", style: { fontFamily: 'Montserrat, sans-serif' }, children: "Registro Corporativo" }), _jsx("p", { className: "text-muted-foreground text-sm", style: { fontFamily: 'Inter, sans-serif' }, children: "\u00DAnete a nuestra red de clientes y accede a beneficios exclusivos." })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "group relative", children: [_jsx("label", { className: labelClass, children: "Nombres" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: iconClass }), _jsx("input", { type: "text", required: true, value: registerData.name, onChange: (e) => setRegisterData({ ...registerData, name: e.target.value }), className: inputClass, placeholder: "Juan" })] })] }), _jsxs("div", { className: "group relative", children: [_jsx("label", { className: labelClass, children: "Apellidos" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: iconClass }), _jsx("input", { type: "text", required: true, value: registerData.lastName, onChange: (e) => setRegisterData({ ...registerData, lastName: e.target.value }), className: inputClass, placeholder: "P\u00E9rez" })] })] })] }), _jsxs("div", { className: "group relative", children: [_jsx("label", { className: labelClass, children: "Correo Electr\u00F3nico" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: iconClass }), _jsx("input", { type: "email", required: true, value: registerData.email, onChange: (e) => setRegisterData({ ...registerData, email: e.target.value }), className: inputClass, placeholder: "juan.perez@empresa.com" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "group relative", children: [_jsx("label", { className: labelClass, children: "Tel\u00E9fono" }), _jsxs("div", { className: "relative", children: [_jsx(Phone, { className: iconClass }), _jsx("input", { type: "tel", required: true, value: registerData.phone, onChange: (e) => setRegisterData({ ...registerData, phone: e.target.value }), className: inputClass, placeholder: "987654321" })] })] }), _jsxs("div", { className: "group relative", children: [_jsx("label", { className: labelClass, children: "Tipo Documento" }), _jsxs("div", { className: "relative", children: [_jsx(FileText, { className: iconClass }), _jsxs("select", { value: registerData.documentType, onChange: (e) => setRegisterData({ ...registerData, documentType: e.target.value }), className: `${inputClass} appearance-none cursor-pointer`, children: [_jsx("option", { value: "DNI", children: "DNI" }), _jsx("option", { value: "RUC", children: "RUC" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "group relative", children: [_jsx("label", { className: labelClass, children: "N\u00FAmero Doc." }), _jsxs("div", { className: "relative", children: [_jsx(FileText, { className: iconClass }), _jsx("input", { type: "text", required: true, value: registerData.documentNumber, onChange: (e) => setRegisterData({ ...registerData, documentNumber: e.target.value }), className: inputClass, placeholder: "12345678" })] })] }), _jsxs("div", { className: "group relative", children: [_jsx("label", { className: labelClass, children: "Contrase\u00F1a" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: iconClass }), _jsx("input", { type: showPassword ? "text" : "password", required: true, value: registerData.password, onChange: (e) => setRegisterData({ ...registerData, password: e.target.value }), className: inputClass, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/60 hover:text-[#0a4d8c] transition-colors", children: showPassword ? _jsx(EyeOff, { className: "w-4 h-4" }) : _jsx(Eye, { className: "w-4 h-4" }) })] })] })] }), _jsxs("div", { className: "group relative", children: [_jsx("label", { className: labelClass, children: "Nombre de la Empresa (Opcional)" }), _jsxs("div", { className: "relative", children: [_jsx(Briefcase, { className: iconClass }), _jsx("input", { type: "text", value: registerData.companyName, onChange: (e) => setRegisterData({ ...registerData, companyName: e.target.value }), className: inputClass, placeholder: "Mi Empresa S.A.C." })] })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-gradient-to-r from-[#0a4d8c] to-[#0288d1] hover:from-[#083d6f] hover:to-[#0277bd] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0a4d8c]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group", style: { fontFamily: 'Montserrat, sans-serif' }, children: isLoading ? (_jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "w-4 h-4" }), "Crear Mi Cuenta"] })) }), _jsx("div", { className: "pt-2 text-center", children: _jsxs("button", { type: "button", onClick: () => {
                                setMode("login");
                                navigate("/login");
                            }, className: "text-[13px] font-bold text-[#64748b] hover:text-[#0a4d8c] transition-colors", style: { fontFamily: 'Inter, sans-serif' }, children: ["\u00BFYa tienes cuenta? ", _jsx("span", { className: "text-[#0a4d8c] underline underline-offset-4", children: "Iniciar Sesi\u00F3n" })] }) })] })), _jsx("div", { className: "mt-8 text-center", children: _jsxs("button", { onClick: () => navigate("/"), className: "inline-flex items-center gap-2 text-[#64748b] hover:text-[#0a4d8c] transition-colors text-[13px] font-medium group", style: { fontFamily: 'Inter, sans-serif' }, children: [_jsx(Home, { className: "w-4 h-4 group-hover:scale-110 transition-transform" }), "Volver a la p\u00E1gina principal"] }) })] }));
}
