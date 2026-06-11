import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { format, addMonths, addWeeks, addDays, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const VIEWS = [
  { id: "month", label: "Mês" },
  { id: "week", label: "Semana" },
  { id: "day", label: "Dia" },
];

function periodLabel(cursor, view) {
  if (view === "day") return format(cursor, "d 'de' MMMM, yyyy", { locale: ptBR });
  if (view === "week") {
    const s = startOfWeek(cursor, { weekStartsOn: 1 });
    const e = endOfWeek(cursor, { weekStartsOn: 1 });
    return s.getMonth() === e.getMonth()
      ? `${format(s, "d")}–${format(e, "d 'de' MMMM", { locale: ptBR })}`
      : `${format(s, "d MMM", { locale: ptBR })} – ${format(e, "d MMM", { locale: ptBR })}`;
  }
  return format(cursor, "MMMM yyyy", { locale: ptBR });
}

function step(cursor, view, dir) {
  if (view === "day") return addDays(cursor, dir);
  if (view === "week") return addWeeks(cursor, dir);
  return addMonths(cursor, dir);
}

export default function CalendarHeader({ cursor, view, onCursorChange, onViewChange, onToday }) {
  const isCurrentPeriod =
    format(cursor, "yyyy-MM") === format(new Date(), "yyyy-MM");

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Period navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onCursorChange(step(cursor, view, -1))}
          className="h-8 w-8 grid place-items-center rounded-lg text-white/45 hover:text-white hover:bg-white/[0.05] transition-colors"
          aria-label="Período anterior"
        >
          <ChevronLeft className="w-[18px] h-[18px]" />
        </button>

        <h2 className="text-[15px] font-semibold text-white capitalize tracking-tight min-w-[150px] text-center select-none">
          {periodLabel(cursor, view)}
        </h2>

        <button
          onClick={() => onCursorChange(step(cursor, view, 1))}
          className="h-8 w-8 grid place-items-center rounded-lg text-white/45 hover:text-white hover:bg-white/[0.05] transition-colors"
          aria-label="Próximo período"
        >
          <ChevronRight className="w-[18px] h-[18px]" />
        </button>

        {!isCurrentPeriod && (
          <button
            onClick={onToday}
            className="ml-1 h-8 px-2.5 rounded-lg text-xs font-medium text-[#1db884] hover:bg-[#1db884]/[0.08] transition-colors"
          >
            Hoje
          </button>
        )}
      </div>

      {/* View toggle + filter */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06] p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => onViewChange(v.id)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                view === v.id
                  ? "bg-white/[0.08] text-white"
                  : "text-white/45 hover:text-white/80",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        <button
          className="h-8 w-8 grid place-items-center rounded-lg text-white/45 hover:text-white hover:bg-white/[0.05] border border-white/[0.06] transition-colors"
          aria-label="Filtros"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
