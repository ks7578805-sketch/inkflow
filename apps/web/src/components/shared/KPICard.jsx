import { cn } from "@/lib/utils";

export default function KPICard({ title, value, change, icon: Icon, trend, accent, className }) {
  return (
    <div className={cn(
      "glass-card rounded-2xl p-4 md:p-5 group hover:border-white/[0.12] hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.99] cursor-default",
      accent && "ink-border-glow",
      className
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0 flex-1">
          <p className="text-[10px] md:text-[11px] font-semibold text-white/35 uppercase tracking-[0.12em] leading-tight">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-white tracking-tight">{value}</p>
          {change && (
            <p className={cn(
              "text-[10px] md:text-xs font-medium flex items-center gap-1",
              trend === "up" ? "text-primary" : trend === "down" ? "text-destructive" : "text-white/40"
            )}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
            accent
              ? "bg-primary/15 border border-primary/25 group-hover:bg-primary/20"
              : "bg-white/[0.05] border border-white/[0.07] group-hover:bg-white/[0.08]"
          )}>
            <Icon className={cn(
              "w-4 h-4 md:w-5 md:h-5",
              accent ? "text-primary" : "text-white/50"
            )} />
          </div>
        )}
      </div>
    </div>
  );
}
