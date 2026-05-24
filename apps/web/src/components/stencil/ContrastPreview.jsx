import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

/**
 * Shows a real-time edge/contour preview of the image using CSS filters.
 * contrast + grayscale + invert simulates roughly what the AI will trace.
 */
export default function ContrastPreview({ image, value, onChange }) {
  const [showPreview, setShowPreview] = useState(true);

  // Map 0–100 slider to CSS filter values that simulate edge detection
  // High contrast + grayscale + slight invert gives a stencil-like preview
  const contrastVal = 0.8 + (value / 100) * 4.2;   // 0.8 → 5.0
  const brightnessVal = 1.0 - (value / 100) * 0.25; // 1.0 → 0.75

  const filterStyle = showPreview
    ? `grayscale(1) contrast(${contrastVal}) brightness(${brightnessVal})`
    : "none";

  return (
    <div className="space-y-2.5">
      {/* Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] text-muted-foreground/80">Intensidade do Contorno</span>
          <span className="text-[11px] font-mono text-foreground/60 tabular-nums w-8 text-right">{value}</span>
        </div>
        <Slider value={[value]} onValueChange={(v) => onChange(v[0])} max={100} step={1} className="w-full" />
      </div>

      {/* Preview toggle + thumbnail */}
      {image && (
        <div className="space-y-1.5">
          <button
            onClick={() => setShowPreview(p => !p)}
            className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 hover:text-primary transition-colors"
          >
            {showPreview
              ? <Eye className="w-3 h-3" />
              : <EyeOff className="w-3 h-3" />
            }
            {showPreview ? "Prévia do contorno ativa" : "Mostrar prévia do contorno"}
          </button>

          <div
            className={cn(
              "relative rounded-lg overflow-hidden border transition-all",
              showPreview ? "border-primary/30 shadow-[0_0_10px_rgba(52,211,153,0.1)]" : "border-border/20"
            )}
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src={image.url}
              alt="prévia do contorno"
              className="w-full h-full object-cover transition-none"
              style={{ filter: filterStyle }}
            />
            {showPreview && (
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white/80 font-medium">
                Prévia
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}