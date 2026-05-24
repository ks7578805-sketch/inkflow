import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { SESSION_STATUS } from "@/data/calendarMock";
import { Clock, MapPin, DollarSign } from "lucide-react";

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 – 21:00
const CELL_HEIGHT = 64; // px per hour

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default function DayView({ date, sessions, selectedId, onSelect }) {
  const dateStr = format(date, "yyyy-MM-dd");
  const daySessions = sessions.filter(s => s.date === dateStr);
  const isEmpty = daySessions.length === 0;

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const nowTop = isToday ? ((nowMinutes - 7 * 60) / 60) * CELL_HEIGHT : null;

  return (
    <div className="flex-1 bg-card border border-border/50 rounded-xl overflow-y-auto">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-medium text-foreground">Nenhuma sessão neste dia</p>
          <p className="text-xs text-muted-foreground mt-1">Clique em "Nova Sessão" para agendar</p>
        </div>
      ) : (
        <div className="relative" style={{ minHeight: `${HOURS.length * CELL_HEIGHT}px` }}>
          {/* Hour grid */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 right-0 flex border-t border-border/15"
              style={{ top: `${(hour - 7) * CELL_HEIGHT}px`, height: `${CELL_HEIGHT}px` }}
            >
              <div className="w-14 md:w-16 flex-shrink-0 text-[10px] font-mono text-muted-foreground/60 pr-3 text-right -mt-2.5 select-none">
                {String(hour).padStart(2, "0")}:00
              </div>
              <div className="flex-1 relative">
                {/* Half-hour line */}
                <div className="absolute left-0 right-0 top-1/2 border-t border-border/8" />
              </div>
            </div>
          ))}

          {/* Now indicator */}
          {nowTop !== null && nowTop > 0 && (
            <div
              className="absolute left-14 md:left-16 right-2 z-20 flex items-center gap-1 pointer-events-none"
              style={{ top: `${nowTop}px` }}
            >
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary))]" />
              <div className="flex-1 h-px bg-primary/60" />
            </div>
          )}

          {/* Sessions */}
          {daySessions.map((session) => {
            const startMin = timeToMinutes(session.time);
            const endMin = timeToMinutes(session.endTime);
            const top = ((startMin - 7 * 60) / 60) * CELL_HEIGHT + 1;
            const height = ((endMin - startMin) / 60) * CELL_HEIGHT - 4;
            const st = SESSION_STATUS[session.status] || SESSION_STATUS["Confirmada"];
            const isSelected = selectedId === session.id;

            return (
              <div
                key={session.id}
                onClick={() => onSelect(session)}
                className={cn(
                  "absolute left-14 md:left-16 right-3 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden",
                  "border border-l-[3px]",
                  isSelected
                    ? "ring-1 ring-primary shadow-[0_0_0_2px_hsl(var(--primary)/0.2)] scale-[1.01]"
                    : "hover:scale-[1.01] hover:shadow-md",
                  session.status === "Concluída"
                    ? "bg-muted/20 border-border/30 border-l-muted-foreground/30 opacity-60"
                    : session.status === "Em andamento"
                      ? "bg-blue-500/8 border-border/30 border-l-blue-500"
                      : session.status === "Aguardando depósito"
                        ? "bg-amber-500/8 border-border/30 border-l-amber-500"
                        : session.status === "Cancelada"
                          ? "bg-destructive/8 border-border/30 border-l-destructive opacity-50"
                          : "bg-primary/8 border-border/30 border-l-primary"
                )}
                style={{ top: `${top}px`, height: `${Math.max(height, 40)}px` }}
              >
                <div className="p-2.5 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="text-xs font-bold text-foreground leading-tight truncate">{session.client}</p>
                    <span className={cn("shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full", st.color)}>
                      {session.status}
                    </span>
                  </div>
                  {height > 50 && (
                    <p className="text-[10px] text-muted-foreground truncate mb-1">{session.type}</p>
                  )}
                  {height > 80 && (
                    <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground mt-auto flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{session.time}–{session.endTime}
                      </span>
                      {session.placement && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{session.placement}
                        </span>
                      )}
                    </div>
                  )}
                  {height > 120 && session.value > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-primary/80 mt-1">
                      <DollarSign className="w-3 h-3" />
                      R$ {session.value.toLocaleString("pt-BR")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}