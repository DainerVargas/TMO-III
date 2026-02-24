import { ArrowRight, Download, CheckCircle } from "lucide-react";

interface HeroSectionProps {
  onScrollToCatalog: () => void;
}

export function HeroSection({ onScrollToCatalog }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-[#0a4d8c] via-[#0d5ea8] to-[#0288d1] overflow-hidden">
      {/* Background cover image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1606824722920-4c652a70f348?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBlcm1hcmtldCUyMGFpc2xlJTIwcHJvZHVjdHMlMjBzaGVsdmVzfGVufDF8fHx8MTc3MTU0MjE0N3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="TMO Suministros - Productos de Primera Necesidad"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a4d8c]/85 via-[#0a4d8c]/60 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-16 md:py-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6">
            <span className="w-2 h-2 bg-[#00bcd4] rounded-full animate-pulse" />
            <span className="text-white/90 text-[11px] sm:text-[13px]" style={{ fontFamily: "Inter, sans-serif" }}>
              Stock disponible ahora mismo
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-white mb-4"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(22px, 5vw, 42px)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            PRODUCTOS DE PRIMERA NECESIDAD PARA TU EMPRESA
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/85 mb-5 sm:mb-8 max-w-xl"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(0.8rem, 2vw, 1.05rem)",
              lineHeight: 1.6,
            }}
          >
            TMO: Garantizando que el flujo de tu empresa nunca se detenga con productos esenciales siempre en stock. Despacho en 24h en Lima Metropolitana.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-10">
            <button
              onClick={onScrollToCatalog}
              className="flex items-center gap-2 bg-[#00bcd4] hover:bg-[#00a5bb] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-[#00bcd4]/25"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(12px, 2vw, 14px)" }}
            >
              <span className="hidden sm:inline">Abastecimiento Inmediato</span>
              <span className="sm:hidden">Ver Productos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-white/30 transition-all backdrop-blur-sm"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "clamp(12px, 2vw, 14px)" }}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Descargar Catálogo de Esenciales</span>
              <span className="sm:hidden">Catálogo</span>
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
            {[
              "Despacho en 24h en Lima",
              "+2,000 productos en stock",
              "Atención personalizada",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#00bcd4]" />
                <span
                  className="text-white/80 text-[13px]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}