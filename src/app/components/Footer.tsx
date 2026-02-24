import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-[#0a4d8c] text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div>
            <img 
              src="https://imagenes.tmo.com.pe/imagenes/logotipo/ssi%20logo%20blanco.png" 
              alt="TMO Suministros" 
              className="h-12 mb-3"
            />
            <p className="text-white/70 text-[13px] max-w-xs" style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
              Proveedor de productos de primera necesidad para empresas. Stock garantizado y despacho rápido.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[13px] mb-3 text-white/90" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
              Productos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/productos" className="text-white/60 text-[13px] hover:text-[#00bcd4] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                  Ver Catálogo Completo
                </Link>
              </li>
              {["Útiles de Oficina", "Empaque y Embalaje", "Limpieza e Higiene", "Sabanillas"].map((item) => (
                <li key={item}>
                  <Link to="/productos" className="text-white/60 text-[13px] hover:text-[#00bcd4] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[13px] mb-3 text-white/90" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
              Empresa
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/empresa" className="text-white/60 text-[13px] hover:text-[#00bcd4] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                  Sobre TMO
                </Link>
              </li>
              <li>
                <Link to="/contactanos" className="text-white/60 text-[13px] hover:text-[#00bcd4] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link to="/mi-cuenta" className="text-white/60 text-[13px] hover:text-[#00bcd4] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                  Mi Cuenta
                </Link>
              </li>
              {["Política de Entregas", "Términos y Condiciones"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 text-[13px] hover:text-[#00bcd4] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[13px] mb-3 text-white/90" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
              Contacto
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#00bcd4]" />
                <span className="text-white/70 text-[13px]" style={{ fontFamily: "Inter, sans-serif" }}>+51 976 222 970</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#00bcd4]" />
                <span className="text-white/70 text-[13px]" style={{ fontFamily: "Inter, sans-serif" }}>ventas@tmo.pe</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#00bcd4] mt-0.5" />
                <span className="text-white/70 text-[13px]" style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>
                  Lima Metropolitana y Callao,<br />Lima, Perú
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-6 sm:mt-8 pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-[12px]" style={{ fontFamily: "Inter, sans-serif" }}>
            © 2026 TMO Suministros Industriales. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/50 text-[12px] hover:text-white/70 transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
              Privacidad
            </a>
            <a href="#" className="text-white/50 text-[12px] hover:text-white/70 transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
              Términos
            </a>
          </div>
        </div>

        {/* Web Credits */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-white/40 text-[11px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Web realizada por{" "}
            <a 
              href="https://beitperu.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#00bcd4] hover:text-[#00e5ff] transition-colors"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
            >
              Beit Peru
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}