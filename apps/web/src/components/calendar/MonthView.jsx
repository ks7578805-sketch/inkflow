import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";

const DAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function MonthView({ date, sessions, onDayClick, onSelect }) {
  const today = new Date();
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let cur = gridStart;
  while (cur <= gridEnd) {
    days.push(cur);
    cur = addDays(cur, 1);
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex-1 bg-card border border-border/50 rounded-xl overflow-auto">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-border/30">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-2.5 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="divide-y divide-border/20">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 divide-x divide-border/20" style={{ minHeight: "96px" }}>
            {week.map((day, di) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const daySessions = sessions.filter(s => s.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
              const inMonth = isSameMonth(day, date);
              const isToday = isSameDay(day, today);

              return (
                <button
                  key={di}
                  onClick={() => onDayClick(day)}
                  className={cn(
                    "p-1.5 text-left transition-colors hover:bg-muted/20 align-top",
                    !inMonth && "opacity-30",
                    isToday && "bg-primary/5"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1",
                    isToday ? "bg-primary text-primary-foreground" : "text-foreground/80"
                  )}>
                    {format(day, "d")}
                  </div>

                  <div className="space-y-0.5">
                    {daySessions.slice(0, 2).map((session) => {
                      return (
                        <div
                          key={session.id}
                          onClick={(e) => { e.stopPropagation(); onSelect(session); }}
                          className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded font-medium truncate w-full text-left transition-all hover:opacity-80",
                            session.status === "Concluída" ? "bg-muted/40 text-muted-foreground" :
                            session.status === "Aguardando depósito" ? "bg-amber-500/15 text-amber-400" :
                            session.status === "Cancelada" ? "bg-destructive/15 text-destructive" :
                            session.status === "Em andamento" ? "bg-blue-500/15 text-blue-400" :
                            "bg-primary/15 text-primary"
                          )}
                        >
                          {session.time} {session.client}
                        </div>
                      );
                    })}
                    {daySessions.length > 2 && (
                      <div className="text-[9px] text-muted-foreground px-1.5 py-0.5 bg-muted/20 rounded font-medium">
                        +{daySessions.length - 2} mais
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}