import { cn } from "@/lib/utils";
import { CheckCircle2, Sparkles, Cpu } from "lucide-react";

const PROVIDERS = [
  {
    id: "google",
    label: "Nano Banana 2",
    badge: "Google",
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    desc: "Gemini 3.1 Flash Image",
    blurb: "Rápido, ótimo em preservar features. Bom padrão pra quase todos os casos.",
    Icon: Sparkles,
  },
  {
    id: "openai",
    label: "GPT Image 2",
    badge: "OpenAI",
    badgeColor: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    desc: "gpt-image-2",
    blurb: "Detalhe e composição fortes em retratos. Mais lento e mais caro por geração.",
    Icon: Cpu,
  },
];

export { PROVIDERS };

export default function ProviderCard({ selectedProvider, onSelect }) {
  const active = PROVIDERS.find((p) => p.id === selectedProvider);

  return (
    <div className="bg-card border border-[#27865f]/20 rounded-xl flex-shrink-0">
      <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-[#27865f]/[0.10]">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          IA
        </span>
        {active && (
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[9px] font-semibold border",
              active.badgeColor,
            )}
          >
            {active.badge}
          </span>
        )}
      </div>

      <div className="p-3 grid grid-cols-2 gap-2">
        {PROVIDERS.map((provider) => {
          const isActive = selectedProvider === provider.id;
          const Icon = provider.Icon;
          return (
            <button
              key={provider.id}
              onClick={() => onSelect(provider.id)}
              className={cn(
                "relative rounded-lg border transition-all duration-200 group overflow-hidden text-left px-3 py-2.5",
                isActive
                  ? "bg-primary/[0.08] border-primary/45 shadow-[0_0_18px_-6px_rgba(39,134,95,0.45)]"
                  : "bg-muted/15 border-border/40 hover:border-border/70 hover:bg-muted/30",
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon
                  className={cn(
                    "w-3.5 h-3.5",
                    isActive ? "text-primary" : "text-muted-foreground/70",
                  )}
                />
                {isActive && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                )}
              </div>
              <span
                className={cn(
                  "text-[12px] font-semibold leading-tight block",
                  isActive ? "text-primary" : "text-foreground/90",
                )}
              >
                {provider.label}
              </span>
              <span className="text-[10px] text-muted-foreground/70 leading-snug block mt-0.5">
                {provider.desc}
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="mx-3 mb-3 rounded-lg border border-[#27865f]/[0.15] bg-[#27865f]/[0.04] px-3 py-2.5">
          <p className="text-[10.5px] leading-snug text-foreground/70">
            {active.blurb}
          </p>
        </div>
      )}
    </div>
  );
}
