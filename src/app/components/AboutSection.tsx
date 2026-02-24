import { Target, Users, Truck, Award, ShieldCheck, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const stats = [
  { value: "+15", label: "Años de experiencia", icon: <Award className="w-5 h-5" /> },
  { value: "+2,000", label: "Productos en stock", icon: <ShieldCheck className="w-5 h-5" /> },
  { value: "24h", label: "Despacho garantizado", icon: <Truck className="w-5 h-5" /> },
  { value: "+500", label: "Clientes activos en Lima", icon: <Users className="w-5 h-5" /> },
];

const values = [
  {
    icon: <Target className="w-5 h-5" />,
    title: "Misión",
    description:
      "Ser el aliado confiable de la industria peruana, garantizando el abastecimiento continuo de suministros esenciales con la mejor relación calidad-precio y entregas inmediatas en Lima Metropolitana.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Compromiso de Calidad",
    description:
      "Trabajamos exclusivamente con marcas certificadas y productos que cumplen con las normativas peruanas e internacionales. Cada artículo pasa por nuestro control de calidad antes de llegar a tu operación.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Entrega Rápida",
    description:
      "Nuestro centro de distribución en Lima nos permite despachar pedidos en menos de 24 horas a toda Lima Metropolitana y Callao, asegurando que tu operación nunca se detenga.",
  },
];

export function AboutSection() {
  return (
    <section className="py-10 sm:py-16 px-3 sm:px-4 bg-white" id="about">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-[#f0f7ff] rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-[#00bcd4] rounded-full" />
            <span className="text-[#0a4d8c] text-[13px]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
              Conócenos
            </span>
          </div>
          <h2
            className="text-[#0a4d8c] mb-3"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "clamp(1.2rem, 4vw, 2rem)" }}
          >
            Sobre Nosotros
          </h2>
          <p
            className="text-muted-foreground max-w-2xl mx-auto"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(13px, 2vw, 15px)", lineHeight: 1.7 }}
          >
            Somos TMO Suministros, una empresa peruana con sede en Lima dedicada a proveer productos de primera necesidad
            esenciales como papel higiénico, artículos de limpieza y útiles de oficina para mantener la operación continua de tu empresa.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-10 items-center mb-10 sm:mb-14">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1762232621830-a96c14a5e19d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwc3VwcGx5JTIwY2hhaW4lMjBkZWxpdmVyeSUyMHRydWNrfGVufDF8fHx8MTc3MDY3NDg2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Centro de distribución TMO en Lima"
              className="w-full h-full object-cover aspect-[4/3]"
            />
            {/* Overlay badge */}
            <div
              className="absolute bottom-4 left-4 right-4 p-4 rounded-xl text-white backdrop-blur-md"
              style={{ background: "linear-gradient(135deg, rgba(10,77,140,0.9) 0%, rgba(0,188,212,0.85) 100%)" }}
            >
              <p className="text-[14px]" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
                Centro de Distribución Lima
              </p>
              <p className="text-white/80 text-[12px] mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                Av. Argentina, Cercado de Lima - Despacho a toda Lima Metropolitana y Callao
              </p>
            </div>
          </div>

          {/* Text content */}
          <div>
            <h3
              className="text-foreground mb-4"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.3rem", lineHeight: 1.3 }}
            >
              Más de 15 años abasteciendo a la industria peruana con productos esenciales
            </h3>
            <p
              className="text-muted-foreground mb-6"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: 1.75 }}
            >
              En TMO entendemos que la continuidad operativa de tu empresa depende de tener los suministros correctos en
              el momento exacto. Por eso mantenemos un inventario permanente de más de 2,000 productos esenciales —desde
              EPP y limpieza industrial hasta lubricantes y repuestos— listos para despacho inmediato desde nuestro
              almacén en Lima.
            </p>
            <p
              className="text-muted-foreground mb-8"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: 1.75 }}
            >
              Nos especializamos en atender a empresas de manufactura, minería, construcción, alimentos y servicios
              generales en toda Lima Metropolitana, con capacidad de envío a nivel nacional. Nuestro compromiso es que
              nunca te quedes sin los insumos que necesitas.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 p-3.5 bg-[#f5f7fa] rounded-xl border border-border hover:border-[#0a4d8c]/15 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%)" }}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <span
                      className="text-[#0a4d8c] block"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "1.15rem" }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-muted-foreground text-[11px]" style={{ fontFamily: "Inter, sans-serif" }}>
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {values.map((item) => (
            <div
              key={item.title}
              className="p-4 sm:p-6 rounded-xl border border-border bg-white hover:shadow-md hover:border-[#0a4d8c]/15 transition-all duration-200 group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-shadow"
                style={{ background: "linear-gradient(135deg, #0a4d8c 0%, #0288d1 50%, #00bcd4 100%)" }}
              >
                {item.icon}
              </div>
              <h4
                className="text-foreground mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1rem" }}
              >
                {item.title}
              </h4>
              <p
                className="text-muted-foreground"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: 1.7 }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}