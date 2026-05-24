import { cn } from "@/lib/utils";

const variants = {
  success: "bg-primary/10 text-primary border-primary/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  neutral: "bg-muted text-muted-foreground border-border",
  pending: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

export default function StatusBadge({ status, label, variant = "neutral" }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wider",
      variants[variant]
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        variant === "success" ? "bg-primary" :
        variant === "warning" ? "bg-amber-400" :
        variant === "error" ? "bg-destructive" :
        variant === "info" ? "bg-blue-400" :
        variant === "pending" ? "bg-violet-400" :
        "bg-muted-foreground"
      )} />
      {label || status}
    </span>
  );
}