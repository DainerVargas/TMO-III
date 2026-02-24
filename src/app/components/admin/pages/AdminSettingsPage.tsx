import { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  Webhook, 
  Globe, 
  BellRing, 
  ShieldCheck,
  Loader2,
  RefreshCw,
  Info
} from "lucide-react";
import { apiFetch } from "../../../utils/api";
import { toast } from "sonner";

interface Setting {
  key: string;
  value: string;
  description: string | null;
}

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/settings");
      setSettings(data);
    } catch (error: any) {
      toast.error("Error al cargar configuración: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async (key: string, value: string, description: string | null) => {
    setIsSaving(key);
    try {
      await apiFetch("/settings", {
        method: "POST",
        body: JSON.stringify({ key, value, description })
      });
      toast.success(`Configuración "${key}" actualizada`);
      fetchSettings();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(null);
    }
  };

  const getSettingValue = (key: string) => settings.find(s => s.key === key)?.value || "";
  const getSettingDescription = (key: string) => settings.find(s => s.key === key)?.description || "";

  const sections = [
    {
      title: "Integraciones Externas",
      icon: Webhook,
      settings: [
        { key: "N8N_WEBHOOK_URL", label: "n8n Webhook URL", placeholder: "https://n8n.tu-dominio.com/webhook/..." },
        { key: "CRM_API_KEY", label: "CRM API Key", placeholder: "Ingresa la clave de API del CRM" }
      ]
    },
    {
      title: "Parámetros del Sistema",
      icon: Globe,
      settings: [
        { key: "STORE_NAME", label: "Nombre de la Tienda", placeholder: "TMO Suministros Industriales" },
        { key: "SUPPORT_EMAIL", label: "Email de Soporte", placeholder: "soporte@tmo.com.pe" }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>Configuración del Sistema</h2>
          <p className="text-muted-foreground text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Administra los parámetros globales, integraciones y webhooks del e-commerce.
          </p>
        </div>
        <button 
          onClick={fetchSettings}
          className="flex items-center justify-center gap-2 bg-white text-foreground border border-border px-4 py-2 rounded-xl font-bold text-[13px] hover:bg-[#f8f9fb] transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Recargar
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-border">
          <Loader2 className="w-10 h-10 text-[#0a4d8c] animate-spin mb-4" />
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border bg-[#f8f9fb] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-[#0a4d8c] shadow-sm">
                  <section.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>{section.title}</h3>
              </div>
              
              <div className="p-6 space-y-6 flex-1">
                {section.settings.map((s) => (
                  <div key={s.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-bold text-muted-foreground ml-1">{s.label}</label>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{s.key}</span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        defaultValue={getSettingValue(s.key)}
                        placeholder={s.placeholder}
                        onBlur={(e) => {
                          if (e.target.value !== getSettingValue(s.key)) {
                            handleUpdateSetting(s.key, e.target.value, getSettingDescription(s.key));
                          }
                        }}
                        className="flex-1 px-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all"
                      />
                      <button 
                        className="p-2.5 rounded-xl bg-white border border-border text-[#0a4d8c] hover:bg-[#f0f7ff] transition-all disabled:opacity-50"
                        title="Guardar"
                        disabled={isSaving === s.key}
                      >
                        {isSaving === s.key ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-start gap-2 text-[11px] text-muted-foreground ml-1 pt-1 italic">
                      <Info className="w-3 h-3 mt-0.5 shrink-0" />
                      {getSettingDescription(s.key) || "Sin descripción proporcionada."}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Security Summary Panel */}
          <div className="bg-[#f0f7ff] rounded-2xl border border-[#0a4d8c]/10 p-6 flex flex-col md:flex-row items-center gap-6 lg:col-span-2">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#0a4d8c] shadow-lg shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-[#0a4d8c] text-lg mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>Auditoría Activa</h4>
              <p className="text-[#0a4d8c]/70 text-[14px]" style={{ fontFamily: "Inter, sans-serif" }}>
                Todos los cambios realizados en esta sección son registrados automáticamente en los <span className="font-bold">Logs de Auditoría</span> para garantizar la integridad del sistema.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
