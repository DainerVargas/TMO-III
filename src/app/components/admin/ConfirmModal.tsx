import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, X } from "lucide-react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "info" | "success";
}

let confirmPromise: { resolve: (value: boolean) => void } | null = null;

export function ConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const handleClose = useCallback((value: boolean) => {
    setIsOpen(false);
    if (confirmPromise) {
      confirmPromise.resolve(value);
      confirmPromise = null;
    }
  }, []);

  // Expose function globally to be called by the hook
  (window as any).__showConfirmModal = (opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      confirmPromise = { resolve };
    });
  };

  if (!isOpen || !options) return null;

  const {
    title = "Confirmar acción",
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    variant = "danger",
  } = options;

  const variantColors = {
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20",
    info: "bg-[#0a4d8c] hover:bg-[#0a4d8c]/90 text-white shadow-blue-500/20",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20",
  };

  const iconColors = {
    danger: "text-red-500 bg-red-50",
    info: "text-blue-500 bg-blue-50",
    success: "text-emerald-500 bg-emerald-50",
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${iconColors[variant]}`}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <button
              onClick={() => handleClose(false)}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <h3
            className="text-foreground mb-2"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}
          >
            {title}
          </h3>
          <p
            className="text-muted-foreground"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: 1.6 }}
          >
            {message}
          </p>
        </div>
        <div className="px-6 py-4 bg-muted/30 flex gap-3 border-t border-border">
          <button
            onClick={() => handleClose(false)}
            className="flex-1 py-2.5 rounded-xl text-[13px] border border-border bg-white text-foreground hover:bg-muted transition-all"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => handleClose(true)}
            className={`flex-1 py-2.5 rounded-xl text-[13px] shadow-lg transition-all active:scale-95 ${variantColors[variant]}`}
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function useConfirm() {
  const confirm = useCallback((options: ConfirmOptions) => {
    if ((window as any).__showConfirmModal) {
      return (window as any).__showConfirmModal(options);
    }
    return Promise.resolve(false);
  }, []);

  return { confirm };
}
