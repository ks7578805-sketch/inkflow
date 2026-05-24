import { cn } from "@/lib/utils";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { SESSION_STATUS } from "@/data/calendarMock";

const DAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function WeekView({ date, sessions, onSelect, onDayClick }) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  return (
    <div className="flex-1 bg-card border border-border/50 rounded-xl overflow-auto">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border/30 sticky top-0 bg-card z-10">
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          const daySessions = sessions.filter(s => s.date === format(day, "yyyy-MM-dd"));
          return (
            <button
              key={i}
              onClick={() => onDayClick && onDayClick(day)}
              className={cn(
                "flex flex-col items-center py-2.5 px-1 transition-colors hover:bg-muted/20",
                isToday && "bg-primary/5"
              )}
            >
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{DAY_LABELS[i]}</span>
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center mt-0.5 text-sm font-bold",
                isToday ? "bg-primary text-primary-foreground" : "text-foreground"
              )}>
                {format(day, "d")}
              </div>
              {daySessions.length > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {daySessions.slice(0, 3).map((s, j) => {
                    const st = SESSION_STATUS[s.status] || SESSION_STATUS["Confirmada"];
                    return <div key={j} className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />;
                  })}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Sessions per day */}
      <div className="grid grid-cols-7 divide-x divide-border/20 min-h-[400px]">
        {days.map((day, i) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const daySessions = sessions.filter(s => s.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
          const isToday = isSameDay(day, today);

          return (
            <div key={i} className={cn("p-1.5 space-y-1.5 min-h-[300px]", isToday && "bg-primary/3")}>
              {daySessions.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-border/40" />
                </div>
              ) : daySessions.map((session) => {
                return (
                  <button
                    key={session.id}
                    onClick={() => onSelect(session)}
                    className={cn(
                      "w-full text-left rounded-lg p-2 border-l-2 transition-all hover:scale-[1.02]",
                      session.status === "Concluída"
                        ? "bg-muted/20 border-l-muted-foreground/30 opacity-60"
                        : session.status === "Aguardando depósito"
                          ? "bg-amber-500/8 border-l-amber-500"
                          : session.status === "Cancelada"
                            ? "bg-destructive/8 border-l-destructive opacity-50"
                            : session.status === "Em andamento"
                              ? "bg-blue-500/8 border-l-blue-500"
                              : "bg-primary/8 border-l-primary"
                    )}
                  >
                    <p className="text-[10px] font-bold text-foreground truncate">{session.client}</p>
                    <p className="text-[9px] text-muted-foreground truncate mt-0.5">{session.time}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{session.style}</p>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}