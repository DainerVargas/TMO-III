import { CuentaContent } from "../../AboutModal";
import { User } from "lucide-react";

export function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0a4d8c]" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Configuración de Perfil
          </h2>
          <p className="text-muted-foreground text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Gestiona tu información personal y seguridad de la cuenta administrativa.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#f0f7ff] px-4 py-2 rounded-xl text-[#0a4d8c] border border-[#0a4d8c]/10">
          <User className="w-5 h-5" />
          <span className="font-semibold text-sm">Panel Admin</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <CuentaContent />
      </div>
    </div>
  );
}
