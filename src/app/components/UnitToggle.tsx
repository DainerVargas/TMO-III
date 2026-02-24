import { Package, Layers } from "lucide-react";

interface UnitToggleProps {
  selectedUnit: "box" | "unit";
  onUnitChange: (unit: "box" | "unit") => void;
  boxLabel: string;
  unitLabel: string;
  size?: "sm" | "md";
}

export function UnitToggle({ selectedUnit, onUnitChange, boxLabel, unitLabel, size = "sm" }: UnitToggleProps) {
  const isSm = size === "sm";

  return (
    <div
      className="inline-flex rounded-lg border border-border bg-[#f5f7fa] p-0.5 max-w-full"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <button
        onClick={() => onUnitChange("unit")}
        className={`flex items-center gap-0.5 sm:gap-1 rounded-md transition-all ${
          isSm ? "px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px]" : "px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-[12px]"
        } ${
          selectedUnit === "unit"
            ? "bg-white text-[#0a4d8c] shadow-sm border border-[#0a4d8c]/20"
            : "text-muted-foreground hover:text-foreground border border-transparent"
        }`}
        style={{ fontWeight: selectedUnit === "unit" ? 600 : 400 }}
      >
        <Layers className={isSm ? "w-2.5 h-2.5 sm:w-3 sm:h-3" : "w-3 h-3 sm:w-3.5 sm:h-3.5"} />
        <span className="truncate">{unitLabel}</span>
      </button>
      <button
        onClick={() => onUnitChange("box")}
        className={`flex items-center gap-0.5 sm:gap-1 rounded-md transition-all ${
          isSm ? "px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px]" : "px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-[12px]"
        } ${
          selectedUnit === "box"
            ? "bg-white text-[#0a4d8c] shadow-sm border border-[#0a4d8c]/20"
            : "text-muted-foreground hover:text-foreground border border-transparent"
        }`}
        style={{ fontWeight: selectedUnit === "box" ? 600 : 400 }}
      >
        <Package className={isSm ? "w-2.5 h-2.5 sm:w-3 sm:h-3" : "w-3 h-3 sm:w-3.5 sm:h-3.5"} />
        <span className="truncate">{boxLabel}</span>
      </button>
    </div>
  );
}