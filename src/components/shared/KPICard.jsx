import { cn } from "@/lib/utils";

export default function KPICard({ title, value, change, icon: Icon, trend, className }) {
  return (
    <div className={cn(
      "bg-card border border-border/50 rounded-xl p-4 md:p-5 group hover:border-primary/20 transition-all duration-300 active:scale-[0.99]",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 md:space-y-2 min-w-0 flex-1">
          <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider leading-tight">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{value}</p>
          {change && (
            <p className={cn(
              "text-[10px] md:text-xs font-medium flex items-center gap-1",
              trend === "up" ? "text-primary" : trend === "down" ? "text-destructive" : "text-muted-foreground"
            )}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0 ml-2">
            <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}