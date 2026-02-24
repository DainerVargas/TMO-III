import { PenLine, Package, Sparkles } from "lucide-react";
import { useAdmin } from "./admin/AdminContext";

const iconMap: Record<string, React.ReactNode> = {
  PenLine: <PenLine className="w-6 h-6" />,
  Package: <Package className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
};

interface CategorySectionProps {
  onCategorySelect: (categoryId: string) => void;
  onScrollToCatalog: () => void;
}

export function CategorySection({ onCategorySelect, onScrollToCatalog }: CategorySectionProps) {
  const { categories } = useAdmin();
  return (
    <section className="py-6 sm:py-10 px-3 sm:px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-5 sm:mb-8">
          <h2
            className="text-[#0a4d8c] mb-1"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(1.05rem, 3vw, 1.35rem)" }}
          >
            Categorías de Suministros Esenciales
          </h2>
          <p className="text-muted-foreground text-[12px] sm:text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Acceso rápido a los productos que tu operación necesita cada día
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onCategorySelect(cat.id);
                onScrollToCatalog();
              }}
              className="group flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 bg-[#f5f7fa] hover:bg-[#0a4d8c] rounded-xl transition-all duration-200 border border-transparent hover:border-[#0a4d8c] hover:shadow-lg hover:shadow-[#0a4d8c]/10"
            >
              <div className="text-[#0a4d8c] group-hover:text-[#00bcd4] transition-colors">
                {iconMap[cat.icon]}
              </div>
              <span
                className="text-[11px] sm:text-[13px] text-center text-foreground group-hover:text-white transition-colors"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}