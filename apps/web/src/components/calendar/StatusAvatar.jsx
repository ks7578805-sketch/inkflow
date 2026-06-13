import { cn } from "@/lib/utils";
import { getSessionColor, getInitials } from "@/data/calendarMock";

// Single source of truth for the contact avatar across all calendar surfaces.
// Visual: dark graphite interior + status-colored ring (via inset box-shadow,
// which works with any hex/rgba — Tailwind's ring utility cannot).
export default function StatusAvatar({
  session,
  size = 32,
  single = false,
  muted = false,
  className,
  style,
}) {
  const color = getSessionColor(session);
  const initials = getInitials(session?.clienteNome || "");
  const label = single ? initials.slice(0, 1) : initials;

  const fontSize =
    size <= 16 ? 8 : size <= 22 ? 9 : size <= 28 ? 10 : size <= 36 ? 11 : 12;
  const ringWidth = size <= 18 ? 1.25 : size <= 28 ? 1.5 : 1.75;

  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-[#0e1014] font-bold text-white/85 transition-colors",
        muted && "opacity-55",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize,
        boxShadow: `inset 0 0 0 ${ringWidth}px ${color.bar}`,
        ...style,
      }}
    >
      <span className="leading-none">{label}</span>
    </div>
  );
}
