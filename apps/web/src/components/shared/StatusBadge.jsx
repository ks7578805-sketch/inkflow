import { cn } from "@/lib/utils";
import { STATUS_TOKENS, statusClasses } from "@/lib/tokens";

export default function StatusBadge({ status, label, variant = "neutral" }) {
  const token = STATUS_TOKENS[variant] ?? STATUS_TOKENS.neutral;
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wider",
      statusClasses(variant)
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", token.dot)} />
      {label || status}
    </span>
  );
}