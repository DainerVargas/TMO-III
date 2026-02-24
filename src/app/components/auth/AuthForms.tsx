import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { User, Lock, Mail, Phone, Briefcase, FileText, ArrowRight, Sparkles, Eye, EyeOff, Home, ArrowLeft } from "lucide-react";
import { useUser } from "../UserContext";

interface AuthFormsProps {
  initialMode?: "login" | "register";
}

export function AuthForms({ initialMode = "login" }: AuthFormsProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  
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
    documentType: "DNI" as "DNI" | "RUC",
    documentNumber: "",
    companyName: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginData.email, loginData.password);
      // The login updates the global state. Redirection is handled by useEffect or here.
      // Since state update is async, we can check roles here if we had them or wait.
      // Actually, it's cleaner to let the global state change trigger the redirection 
      // but only in ONE place to avoid the "multiple redirections" issue.
    } catch (err) {
      // toast is handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(registerData);
    } catch (err) {
      // toast is handled in context
    } finally {
      setIsLoading(false);
    }
  };

  // Centralized redirection logic
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/mi-cuenta', { replace: true });
      }
    }
  }, [isLoggedIn, user, navigate]);

  const inputClass = "w-full pl-10 pr-4 py-3 bg-[#f5f7fa] border border-border rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all";
  const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 transition-colors group-focus-within:text-[#0a4d8c]";
  const labelClass = "block text-[13px] font-bold text-[#374151] mb-1.5 ml-1";

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back to site button */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 text-[#64748b] hover:text-[#0a4d8c] transition-colors font-medium text-sm group"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver a la tienda
      </button>

      {/* Tabs */}
      <div className="flex bg-[#f5f7fa] p-1.5 rounded-2xl mb-8 border border-border">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold transition-all ${
            mode === "login"
              ? "bg-white text-[#0a4d8c] shadow-md"
              : "text-[#64748b] hover:text-[#0a4d8c]"
          }`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <Lock className="w-4 h-4" />
          Iniciar Sesión
        </button>
        <button
          onClick={() => setMode("register")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold transition-all ${
            mode === "register"
              ? "bg-white text-[#0a4d8c] shadow-md"
              : "text-[#64748b] hover:text-[#0a4d8c]"
          }`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <User className="w-4 h-4" />
          Crear Cuenta
        </button>
      </div>

      {mode === "login" ? (
        <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in duration-500">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-[#0a4d8c] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Bienvenido de nuevo
            </h2>
            <p className="text-muted-foreground text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Ingresa tus credenciales para acceder a tu panel corporativo.
            </p>
          </div>

          <div className="space-y-4">
            <div className="group relative">
              <label className={labelClass}>Correo Electrónico</label>
              <div className="relative">
                <Mail className={iconClass} />
                <input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className={inputClass}
                  placeholder="ejemplo@empresa.com"
                />
              </div>
            </div>

            <div className="group relative">
              <label className={labelClass}>Contraseña</label>
              <div className="relative">
                <Lock className={iconClass} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className={inputClass}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/60 hover:text-[#0a4d8c] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0a4d8c] hover:bg-[#083d6f] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0a4d8c]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Acceder al Panel
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setMode("register");
                navigate("/register");
              }}
              className="text-[13px] font-bold text-[#64748b] hover:text-[#0a4d8c] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              ¿No tienes cuenta? <span className="text-[#0a4d8c] underline underline-offset-4">Registrarme</span>
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in duration-500">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-[#0a4d8c] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Registro Corporativo
            </h2>
            <p className="text-muted-foreground text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Únete a nuestra red de clientes y accede a beneficios exclusivos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group relative">
              <label className={labelClass}>Nombres</label>
              <div className="relative">
                <User className={iconClass} />
                <input
                  type="text"
                  required
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className={inputClass}
                  placeholder="Juan"
                />
              </div>
            </div>
            <div className="group relative">
              <label className={labelClass}>Apellidos</label>
              <div className="relative">
                <User className={iconClass} />
                <input
                  type="text"
                  required
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                  className={inputClass}
                  placeholder="Pérez"
                />
              </div>
            </div>
          </div>

          <div className="group relative">
            <label className={labelClass}>Correo Electrónico</label>
            <div className="relative">
              <Mail className={iconClass} />
              <input
                type="email"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className={inputClass}
                placeholder="juan.perez@empresa.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group relative">
              <label className={labelClass}>Teléfono</label>
              <div className="relative">
                <Phone className={iconClass} />
                <input
                  type="tel"
                  required
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  className={inputClass}
                  placeholder="987654321"
                />
              </div>
            </div>
            <div className="group relative">
              <label className={labelClass}>Tipo Documento</label>
              <div className="relative">
                <FileText className={iconClass} />
                <select
                  value={registerData.documentType}
                  onChange={(e) => setRegisterData({ ...registerData, documentType: e.target.value as any })}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group relative">
              <label className={labelClass}>Número Doc.</label>
              <div className="relative">
                <FileText className={iconClass} />
                <input
                  type="text"
                  required
                  value={registerData.documentNumber}
                  onChange={(e) => setRegisterData({ ...registerData, documentNumber: e.target.value })}
                  className={inputClass}
                  placeholder="12345678"
                />
              </div>
            </div>
            <div className="group relative">
              <label className={labelClass}>Contraseña</label>
              <div className="relative">
                <Lock className={iconClass} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className={inputClass}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/60 hover:text-[#0a4d8c] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="group relative">
            <label className={labelClass}>Nombre de la Empresa (Opcional)</label>
            <div className="relative">
              <Briefcase className={iconClass} />
              <input
                type="text"
                value={registerData.companyName}
                onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                className={inputClass}
                placeholder="Mi Empresa S.A.C."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#0a4d8c] to-[#0288d1] hover:from-[#083d6f] hover:to-[#0277bd] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0a4d8c]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Crear Mi Cuenta
              </>
            )}
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                navigate("/login");
              }}
              className="text-[13px] font-bold text-[#64748b] hover:text-[#0a4d8c] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              ¿Ya tienes cuenta? <span className="text-[#0a4d8c] underline underline-offset-4">Iniciar Sesión</span>
            </button>
          </div>
        </form>
      )}

      {/* Back to Home Link */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#0a4d8c] transition-colors text-[13px] font-medium group"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Volver a la página principal
        </button>
      </div>
    </div>
  );
}
