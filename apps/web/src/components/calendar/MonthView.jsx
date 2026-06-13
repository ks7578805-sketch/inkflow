import { memo, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  isWeekend,
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  getSessionsByDate,
  getSessionColor,
  firstName,
  applyOverride,
  STATUS_COLORS,
} from "@/data/calendarMock";
import StatusAvatar from "./StatusAvatar";

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MAX_CHIPS = 3;
const MONTH_TRANSITION = { duration: 0.16, ease: [0.4, 0, 0.2, 1] };

// Maps a session-count to a subtle background tint (emerald heatmap).
function heatBg(count) {
  if (count === 0) return null;
  if (count <= 2) return "rgba(29,184,132,0.04)";
  if (count <= 4) return "rgba(29,184,132,0.085)";
  return "rgba(29,184,132,0.13)";
}

function matchesFilters(session, filters) {
  if (!filters) return true;
  if (filters.statuses?.length && !filters.statuses.includes(session.status)) {
    return false;
  }
  if (filters.artists?.length && !filters.artists.includes(session.artistaNome)) {
    return false;
  }
  return true;
}

const SessionChip = memo(function SessionChip({ session }) {
  const color = getSessionColor(session);
  const muted = session.status === "cancelado";
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md border-l-[2px] bg-white/[0.025] py-[3px] pl-1 pr-1.5 text-[11px] leading-none transition-colors duration-150",
        muted && "opacity-50",
      )}
      style={{ borderLeftColor: color.bar }}
    >
      <StatusAvatar session={session} size={14} single />
      <span className="shrink-0 tabular-nums text-white/45">
        {session.horarioInicio.slice(0, 5)}
      </span>
      <span className="truncate text-white/85">{firstName(session.clienteNome)}</span>
    </div>
  );
});

export default function MonthView({ cursor, selectedDay, onSelectDay, filters, overrides }) {
  const today = new Date();

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [cursor]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.018] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-white/[0.06] bg-white/[0.012]">
        {WEEKDAYS.map((wd, idx) => {
          const isFds = idx >= 5;
          return (
            <div
              key={wd}
              className={cn(
                "px-2.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em]",
                isFds ? "text-[#1db884]/55" : "text-white/35",
              )}
            >
              {wd}
            </div>
          );
        })}
      </div>

      {/* Day grid — keyed by month for crossfade on navigation */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={format(cursor, "yyyy-MM")}
          initial={{ opacity: 0, scale: 0.995 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.005 }}
          transition={MONTH_TRANSITION}
          className="grid flex-1 grid-cols-7"
          style={{ gridTemplateRows: `repeat(${days.length / 7}, minmax(0, 1fr))` }}
        >
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const rawSessions = getSessionsByDate(dateStr);
            const allSessions = overrides?.size
              ? rawSessions.map((s) => applyOverride(s, overrides))
              : rawSessions;
            const sessions = filters
              ? allSessions.filter((s) => matchesFilters(s, filters))
              : allSessions;
            const inMonth = isSameMonth(day, cursor);
            const isToday = isSameDay(day, today);
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            const isFds = isWeekend(day);
            const visible = sessions.slice(0, MAX_CHIPS);
            const overflow = sessions.length - visible.length;
            const heat = heatBg(sessions.length);

            return (
              <button
                key={dateStr}
                onClick={() => onSelectDay(day)}
                style={heat && inMonth ? { backgroundColor: heat } : undefined}
                className={cn(
                  "group relative flex flex-col gap-1 border-b border-r border-white/[0.06] p-1.5 text-left",
                  "transition-[background-color,box-shadow] duration-150 ease-out",
                  "hover:bg-white/[0.035] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1db884]/40 focus-visible:ring-inset",
                  !inMonth && "opacity-30",
                  isFds && inMonth && !heat && "bg-white/[0.008]",
                  isToday &&
                    "shadow-[inset_0_0_0_1px_rgba(29,184,132,0.35)]",
                  isSelected &&
                    "bg-[#1db884]/[0.08] shadow-[inset_0_0_0_1px_rgba(29,184,132,0.45)]",
                )}
              >
                {/* Date number */}
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "relative grid h-6 w-6 place-items-center rounded-full text-xs tabular-nums transition-colors duration-150",
                      isToday
                        ? "bg-[#1db884] font-semibold text-[#08090a] shadow-[0_0_14px_rgba(29,184,132,0.55)]"
                        : cn(
                            "font-medium",
                            isFds ? "text-[#1db884]/55" : "text-white/55",
                            inMonth && "group-hover:text-white/90",
                          ),
                    )}
                  >
                    {format(day, "d")}
                    {isToday && (
                      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#1db884]/40 opacity-60" />
                    )}
                  </span>
                  {sessions.length > 0 && inMonth && !isToday && (
                    <span className="text-[9px] font-medium tabular-nums text-white/30">
                      {sessions.length}
                    </span>
                  )}
                </div>

                {/* Session chips */}
                <div className="flex flex-col gap-[3px] overflow-hidden">
                  {visible.map((s) => (
                    <SessionChip key={s.id} session={s} />
                  ))}
                  {overflow > 0 && (
                    <span className="inline-flex w-fit items-center rounded-full bg-[#1db884]/[0.12] px-1.5 py-[1px] text-[9px] font-semibold text-[#1db884] transition-colors group-hover:bg-[#1db884]/[0.18]">
                      +{overflow}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center gap-4 border-t border-white/[0.06] bg-white/[0.012] px-3 py-2">
        {Object.values(STATUS_COLORS).map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: c.dot }}
            />
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/40">
              {c.label}
            </span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1db884]/40" />
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/40">
            Heatmap de ocupação
          </span>
        </div>
      </div>
    </div>
  );
}
