import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface PageViewProps {
  children: React.ReactNode;
  onBack: () => void;
}

export function PageView({ children, onBack }: PageViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="flex-1 bg-white">
      {/* Breadcrumb / back bar */}
      <div className="bg-[#f5f7fa] border-b border-[#e5e7eb]">
        <div className="px-3 sm:px-4 py-2.5 sm:py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#0a4d8c] hover:text-[#083d6f] transition-colors group"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "0.88rem",
            }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Volver al Inicio
          </button>
        </div>
      </div>

      {/* Page content */}
      <div>
        {children}
      </div>
    </div>
  );
}