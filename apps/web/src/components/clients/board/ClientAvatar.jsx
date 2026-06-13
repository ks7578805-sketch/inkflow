import { cn } from "@/lib/utils";
import { getInitials } from "@/data/clientsMock";

// Neutral avatar — graphite interior, monogram in soft white.
// We intentionally do NOT encode the stage color here; the stage is communicated
// by the small dot next to the client name (and, on Phase 2, by the drop zone).
export default function ClientAvatar({ name, size = 36, className }) {
  const initials = getInitials(name);
  const fontSize = size <= 28 ? 10 : size <= 36 ? 11 : 12;
  return (
    <div
      style={{ width: size, height: size, fontSize }}
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-white/[0.04] font-semibold text-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
        className,
      )}
    >
      <span className="leading-none">{initials}</span>
    </div>
  );
}
