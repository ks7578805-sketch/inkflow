import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, addWeeks, addMonths, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ARTISTS } from "@/data/calendarMock";

const VIEWS = [
  { id: "day", label: "Dia" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mês" },
];

function formatDateLabel(date, view) {
  if (view === "day") return format(date, "d 'de' MMMM, yyyy", { locale: ptBR });
  if (view === "week") {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, "d")} – ${format(end, "d 'de' MMMM, yyyy", { locale: ptBR })}`;
    }
    return `${format(start, "d MMM", { locale: ptBR })} – ${format(end, "d MMM yyyy", { locale: ptBR })}`;
  }
  return format(date, "MMMM yyyy", { locale: ptBR });
}

function navigate(date, view, dir) {
  if (view === "day") return addDays(date, dir);
  if (view === "week") return addWeeks(date, dir);
  return addMonths(date, dir);
}

export default function CalendarHeader({ date, view, artist, onDateChange, onViewChange, onArtistChange, onNewSession }) {
  const label = formatDateLabel(date, view);
  const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Top row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Date nav */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline" size="icon"
            className="h-8 w-8 border-border/50 hover:bg-muted/50"
            onClick={() => onDateChange(navigate(date, view, -1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 px-1">
            <CalendarDays className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <h2 className="text-sm md:text-base font-semibold text-foreground capitalize min-w-[160px]">{label}</h2>
          </div>

          <Button
            variant="outline" size="icon"
            className="h-8 w-8 border-border/50 hover:bg-muted/50"
            onClick={() => onDateChange(navigate(date, view, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {!isToday && (
            <Button
              variant="ghost" size="sm"
              className="text-xs text-primary hover:text-primary/80 h-8 px-2.5"
              onClick={() => onDateChange(new Date())}
            >
              Hoje
            </Button>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Artist filter */}
          <Select value={artist} onValueChange={onArtistChange}>
            <SelectTrigger className="h-8 w-36 text-xs bg-secondary/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ARTISTS.map((a) => (
                <SelectItem key={a.id} value={a.id} className="text-xs">{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View switcher */}
          <div className="flex items-center bg-muted/30 border border-border/50 rounded-lg p-0.5 gap-0.5">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => onViewChange(v.id)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  view === v.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* New session */}
          <Button
            size="sm"
            onClick={onNewSession}
            className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nova Sessão</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </div>
      </div>
    </div>
  );
}