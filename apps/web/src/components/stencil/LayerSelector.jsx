import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";

const LEVELS = [
  { value: 1, label: "1", desc: "Simples", hint: "Apenas contorno — preto e branco puro" },
  { value: 2, label: "2", desc: "2 tons", hint: "Sombra + contorno" },
  { value: 3, label: "3", desc: "3 tons", hint: "Luz, sombra e contorno" },
  { value: 4, label: "4", desc: "4 tons", hint: "Gradação intermediária" },
  { value: 5, label: "5", desc: "Detalhado", hint: "Máxima profundidade — 5 camadas" },
];

// Simulated layer swatches per level (light → dark)
const SWATCHES = {
  1: ["#0a0a0a"],
  2: ["#0a0a0a", "#8a8a8a"],
  3: ["#0a0a0a", "#666666", "#c0c0c0"],
  4: ["#0a0a0a", "#505050", "#999999", "#d4d4d4"],
  5: ["#0a0a0a", "#3a3a3a", "#707070", "#adadad", "#e0e0e0"],
};

export default function LayerSelector({ value, onChange }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <Layers className="w-3 h-3 text-muted-foreground/60" />
        <span className="text-[11px] text-muted-foreground/80">Camadas de Profundidade</span>
        <span className="ml-auto text-[11px] font-mono text-primary/80 tabular-nums">{value}×</span>
      </div>

      {/* Level buttons */}
      <div className="flex gap-1.5 mb-3">
        {LEVELS.map((lvl) => (
          <button
            key={lvl.value}
            onClick={() => onChange(lvl.value)}
            className={cn(
              "flex-1 flex flex-col items-center py-2 rounded-lg border text-[10px] font-semibold transition-all",
              value === lvl.value
                ? "border-primary bg-primary/10 text-primary shadow-[0_0_8px_rgba(39,134,95,0.15)]"
                : "border-border/30 bg-muted/20 text-muted-foreground hover:border-border/60 hover:text-foreground"
            )}
          >
            <span className="text-sm font-bold leading-none mb-0.5">{lvl.label}</span>
            <span className="leading-none opacity-70">{lvl.desc}</span>
          </button>
        ))}
      </div>

      {/* Swatch preview */}
      <div className="flex items-center gap-1.5 mb-1.5">
        {SWATCHES[value].map((color, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full h-5 rounded border border-white/10"
              style={{ backgroundColor: color }}
            />
            <span className="text-[9px] text-muted-foreground/50 font-mono">C{i + 1}</span>
          </div>
        ))}
      </div>

      {/* Hint */}
      <p className="text-[10px] text-muted-foreground/50 mt-1.5">
        {LEVELS.find(l => l.value === value)?.hint}
      </p>
    </div>
  );
}