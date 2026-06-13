import { useEffect, useMemo, useRef, useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  isWeekend,
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  getSessionsByDate,
  getSessionColor,
  sessionDuration,
  shortTime,
  firstName,
  applyOverride,
} from "@/data/calendarMock";
import StatusAvatar from "./StatusAvatar";

const TIMELINE_START = 9;
const TIMELINE_END = 20;
const HOUR_HEIGHT = 56;
const TIMELINE_HOURS = TIMELINE_END - TIMELINE_START;
const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

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

function WeekBlock({ session }) {
  const color = getSessionColor(session);
  const [sh, sm] = session.horarioInicio.split(":").map(Number);
  const start = sh + sm / 60;
  const dur = sessionDuration(session);
  const visualStart = Math.max(start, TIMELINE_START);
  const visualEnd = Math.min(start + dur, TIMELINE_END);
  if (visualEnd <= visualStart) return null;

  const top = (visualStart - TIMELINE_START) * HOUR_HEIGHT;
  const height = Math.max(30, (visualEnd - visualStart) * HOUR_HEIGHT - 4);
  const muted = session.status === "cancelado";

  return (
    <div
      style={{
        top,
        height,
        borderLeftColor: color.bar,
      }}
      className={cn(
        "absolute inset-x-1 overflow-hidden rounded-md border border-white/[0.06] border-l-[3px] bg-white/[0.025] px-1.5 py-1 text-left transition-colors duration-150 hover:bg-white/[0.05]",
        muted && "opacity-55",
      )}
    >
      <div className="flex items-center gap-1.5 text-[10px] tabular-nums leading-none text-white/45">
        <span>{shortTime(session.horarioInicio)}</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <StatusAvatar session={session} size={16} single />
        <span className="truncate text-[11px] font-medium text-white/90">
          {firstName(session.clienteNome)}
        </span>
      </div>
      {height >= 56 && (
        <div className="mt-0.5 truncate text-[10px] text-white/45">
          {session.estilo}
        </div>
      )}
    </div>
  );
}

function NowLine({ minutes }) {
  if (minutes == null) return null;
  const startMinutes = TIMELINE_START * 60;
  const endMinutes = TIMELINE_END * 60;
  if (minutes < startMinutes || minutes > endMinutes) return null;
  const top = ((minutes - startMinutes) / 60) * HOUR_HEIGHT;
  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-10 flex items-center"
      style={{ top }}
    >
      <div className="relative -ml-1 h-2.5 w-2.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#1db884]/60" />
        <span className="absolute inset-[2px] rounded-full bg-[#1db884] shadow-[0_0_8px_rgba(29,184,132,0.7)]" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-[#1db884]/70 to-transparent" />
    </div>
  );
}

export default function WeekView({
  cursor,
  onSelectDay,
  filters,
  overrides,
}) {
  const today = new Date();
  const scrollRef = useRef(null);
  const [nowMinutes, setNowMinutes] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });

  const days = useMemo(() => {
    const start = startOfWeek(cursor, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [cursor]);

  const sessionsByDay = useMemo(() => {
    return days.map((d) => {
      const dateStr = format(d, "yyyy-MM-dd");
      const raw = getSessionsByDate(dateStr);
      const merged = overrides?.size
        ? raw.map((s) => applyOverride(s, overrides))
        : raw;
      return filters
        ? merged.filter((s) => matchesFilters(s, filters))
        : merged;
    });
  }, [days, filters, overrides]);

  // Auto-scroll on week change.
  useEffect(() => {
    if (!scrollRef.current) return;
    const isCurrentWeek = days.some((d) => isSameDay(d, today));
    const focusHour = isCurrentWeek
      ? Math.max(TIMELINE_START, nowMinutes / 60 - 1)
      : TIMELINE_START;
    const top = Math.max(0, (focusHour - TIMELINE_START) * HOUR_HEIGHT - 24);
    scrollRef.current.scrollTo({ top, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days[0].toDateString()]);

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setNowMinutes(n.getHours() * 60 + n.getMinutes());
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const hours = Array.from(
    { length: TIMELINE_HOURS + 1 },
    (_, i) => TIMELINE_START + i,
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.018] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
      {/* Day header row */}
      <div
        className="grid border-b border-white/[0.06] bg-white/[0.012]"
        style={{ gridTemplateColumns: "48px repeat(7, minmax(0, 1fr))" }}
      >
        <div />
        {days.map((day, idx) => {
          const isToday = isSameDay(day, today);
          const fds = isWeekend(day);
          const count = sessionsByDay[idx].length;
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDay?.(day)}
              className={cn(
                "group flex flex-col items-center gap-0.5 border-l border-white/[0.06] px-2 py-2.5 text-left transition-colors hover:bg-white/[0.03]",
                isToday && "bg-[#1db884]/[0.06]",
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-[0.1em]",
                  fds ? "text-[#1db884]/55" : "text-white/35",
                )}
              >
                {WEEKDAYS[idx]}
              </span>
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full text-sm font-bold tabular-nums transition-colors",
                  isToday
                    ? "bg-[#1db884] text-[#08090a] shadow-[0_0_14px_rgba(29,184,132,0.55)]"
                    : cn(
                        fds ? "text-[#1db884]/70" : "text-white/75",
                        "group-hover:text-white/95",
                      ),
                )}
              >
                {format(day, "d")}
              </span>
              {count > 0 ? (
                <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.08em] text-white/35">
                  {count} {count === 1 ? "sessão" : "sessões"}
                </span>
              ) : (
                <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.08em] text-white/20">
                  livre
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Timeline body */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto scroll-smooth">
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: "48px repeat(7, minmax(0, 1fr))",
            height: TIMELINE_HOURS * HOUR_HEIGHT,
          }}
        >
          {/* Hours column */}
          <div className="relative border-r border-white/[0.06]">
            {hours.map((h, idx) => (
              <div
                key={h}
                className="absolute right-1 -translate-y-1/2 text-[10px] tabular-nums text-white/30"
                style={{ top: idx * HOUR_HEIGHT }}
              >
                {String(h).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, dayIdx) => {
            const isToday = isSameDay(day, today);
            const sessions = sessionsByDay[dayIdx];
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "relative border-r border-white/[0.06] last:border-r-0",
                  isToday && "bg-[#1db884]/[0.02]",
                )}
              >
                {hours.slice(0, -1).map((h, idx) => (
                  <div
                    key={h}
                    className="absolute inset-x-0 border-t border-white/[0.04]"
                    style={{ top: idx * HOUR_HEIGHT }}
                  />
                ))}
                {isToday && <NowLine minutes={nowMinutes} />}
                {sessions.map((s) => (
                  <WeekBlock key={s.id} session={s} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
