import { cn } from "@/lib/utils";

// Minimalist editorial section header. Step number is rendered inline next to
// the title in tiny mono — no giant display character, no "ETAPA" label. The
// only visual flourish is the primary-emerald hairline running along the top
// edge of the card. Clean, architectural, low-noise.
export default function SectionBadge({ step, title, hint, className }) {
  return (
    <div className={cn("relative", className)}>
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="px-4 pt-3.5 pb-3 border-b border-foreground/[0.06]">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-primary font-mono font-semibold">
            {String(step).padStart(2, "0")}
          </span>
          <span className="text-[12px] uppercase tracking-[0.16em] text-foreground/90 font-bold">
            {title}
          </span>
        </div>
        {hint && (
          <span className="text-[10px] text-foreground/40 mt-1 block leading-snug">
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}
