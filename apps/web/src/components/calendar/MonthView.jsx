import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  getSessionsByDate,
  getSessionColor,
  firstName,
  STATUS_COLORS,
} from "@/data/calendarMock";

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MAX_CHIPS = 3;

function SessionChip({ session }) {
  const color = getSessionColor(session);
  const muted = session.status === "cancelado";
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md px-1.5 py-[3px] text-[11px] leading-none transition-colors",
        muted && "opacity-50",
      )}
      style={{ backgroundColor: color.chipBg }}
    >
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: color.dot }}
      />
      <span className="shrink-0 tabular-nums text-white/45">
        {session.horarioInicio.slice(0, 5)}
      </span>
      <span className="truncate text-white/85">{firstName(session.clienteNome)}</span>
    </div>
  );
}

export default function MonthView({ cursor, selectedDay, onSelectDay }) {
  const today = new Date();

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [cursor]);

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-white/[0.06]">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div
        className="grid flex-1 grid-cols-7"
        style={{ gridTemplateRows: `repeat(${days.length / 7}, minmax(0, 1fr))` }}
      >
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const sessions = getSessionsByDate(dateStr);
          const inMonth = isSameMonth(day, cursor);
          const isToday = isSameDay(day, today);
          const isSelected = selectedDay && isSameDay(day, selectedDay);
          const visible = sessions.slice(0, MAX_CHIPS);
          const overflow = sessions.length - visible.length;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDay(day)}
              className={cn(
                "group relative flex flex-col gap-1 border-b border-r border-white/[0.06] p-1.5 text-left transition-colors",
                "hover:bg-white/[0.02] focus:outline-none",
                !inMonth && "opacity-35",
                isSelected && "bg-[#1db884]/[0.04]",
              )}
            >
              {/* Date number */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-full text-xs tabular-nums transition-colors",
                    isToday
                      ? "bg-[#1db884] font-semibold text-[#08090a] shadow-[0_0_12px_rgba(29,184,132,0.45)]"
                      : cn(
                          "font-medium text-white/55",
                          inMonth && "group-hover:text-white/80",
                        ),
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Session chips */}
              <div className="flex flex-col gap-[3px] overflow-hidden">
                {visible.map((s) => (
                  <SessionChip key={s.id} session={s} />
                ))}
                {overflow > 0 && (
                  <span className="px-1.5 text-[10px] font-medium text-white/35">
                    +{overflow}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-1 pt-3">
        {Object.values(STATUS_COLORS).map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: c.dot }}
            />
            <span className="text-[11px] text-white/40">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
