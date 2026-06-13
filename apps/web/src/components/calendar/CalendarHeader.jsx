import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Plus,
  Check,
} from "lucide-react";
import { format, addMonths, addWeeks, addDays, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { STATUS_COLORS, getArtists } from "@/data/calendarMock";

const VIEWS = [
  { id: "month", label: "Mês" },
  { id: "week", label: "Semana" },
  { id: "day", label: "Dia" },
];

const STATUS_OPTIONS = [
  { id: "confirmado", label: "Confirmado" },
  { id: "pendente", label: "Pendente" },
  { id: "cancelado", label: "Cancelado" },
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

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export default function CalendarHeader({
  cursor,
  view,
  onCursorChange,
  onViewChange,
  onToday,
  onNewSession,
  periodStats,
  filters,
  onFiltersChange,
}) {
  const isCurrentPeriod =
    format(cursor, "yyyy-MM") === format(new Date(), "yyyy-MM");
  const artists = getArtists();
  const activeFiltersCount =
    (filters?.statuses?.length ? 1 : 0) + (filters?.artists?.length ? 1 : 0);

  const toggle = (key, id) => {
    const current = new Set(filters?.[key] ?? []);
    if (current.has(id)) current.delete(id);
    else current.add(id);
    onFiltersChange({ ...filters, [key]: Array.from(current) });
  };

  const clearFilters = () =>
    onFiltersChange({ statuses: [], artists: [] });

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      {/* Period title + subtitle */}
      <div className="flex items-end gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCursorChange(step(cursor, view, -1))}
            className="grid h-9 w-9 place-items-center rounded-lg text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white"
            aria-label="Período anterior"
          >
            <ChevronLeft className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={() => onCursorChange(step(cursor, view, 1))}
            className="grid h-9 w-9 place-items-center rounded-lg text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white"
            aria-label="Próximo período"
          >
            <ChevronRight className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-bold capitalize tracking-tight text-white md:text-[22px]">
            {periodLabel(cursor, view)}
          </h2>
          {periodStats && (
            <p className="mt-0.5 text-[11px] text-white/40">
              <span className="font-medium text-white/65">
                {periodStats.active}
              </span>{" "}
              sessões ·{" "}
              <span className="font-medium text-[#1db884]">
                {brl.format(periodStats.revenue)}
              </span>
            </p>
          )}
        </div>

        {!isCurrentPeriod && (
          <button
            onClick={onToday}
            className="ml-1 rounded-lg border border-[#1db884]/25 bg-[#1db884]/[0.06] px-2.5 py-1 text-[11px] font-medium text-[#1db884] transition-colors hover:bg-[#1db884]/[0.12]"
          >
            Hoje
          </button>
        )}
      </div>

      {/* View toggle + filter + new session */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.06] bg-white/[0.025] p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => onViewChange(v.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                view === v.id
                  ? "bg-[#1db884]/[0.15] text-[#1db884] shadow-[inset_0_0_0_1px_rgba(29,184,132,0.25)]"
                  : "text-white/45 hover:text-white/85",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "relative grid h-9 w-9 place-items-center rounded-lg border transition-colors",
                activeFiltersCount > 0
                  ? "border-[#1db884]/30 bg-[#1db884]/[0.08] text-[#1db884] hover:bg-[#1db884]/[0.14]"
                  : "border-white/[0.06] text-white/45 hover:bg-white/[0.05] hover:text-white",
              )}
              aria-label="Filtros"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-[14px] min-w-[14px] place-items-center rounded-full bg-[#1db884] px-1 text-[9px] font-bold text-[#08090a]">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-white/[0.08] bg-[#0f1115]"
          >
            <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.1em] text-white/35">
              Status
            </DropdownMenuLabel>
            {STATUS_OPTIONS.map((opt) => {
              const color = STATUS_COLORS[opt.id];
              const checked = filters?.statuses?.includes(opt.id) ?? false;
              return (
                <DropdownMenuCheckboxItem
                  key={opt.id}
                  checked={checked}
                  onCheckedChange={() => toggle("statuses", opt.id)}
                  className="text-white/80 focus:bg-white/[0.05] focus:text-white"
                >
                  <span
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: color.dot }}
                  />
                  {opt.label}
                </DropdownMenuCheckboxItem>
              );
            })}
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.1em] text-white/35">
              Artista
            </DropdownMenuLabel>
            {artists.map((a) => {
              const checked = filters?.artists?.includes(a) ?? false;
              return (
                <DropdownMenuCheckboxItem
                  key={a}
                  checked={checked}
                  onCheckedChange={() => toggle("artists", a)}
                  className="text-white/80 focus:bg-white/[0.05] focus:text-white"
                >
                  {a}
                </DropdownMenuCheckboxItem>
              );
            })}
            {activeFiltersCount > 0 && (
              <>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <button
                  onClick={clearFilters}
                  className="flex w-full items-center gap-1.5 px-2 py-1.5 text-xs text-white/55 hover:text-white"
                >
                  <Check className="h-3 w-3" /> Limpar filtros
                </button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={onNewSession}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-[#1db884] px-3 text-xs font-semibold text-[#08090a] shadow-[0_0_0_1px_rgba(29,184,132,0.4),0_6px_18px_-4px_rgba(29,184,132,0.55)] transition-all hover:bg-[#26d39a]"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Nova sessão</span>
        </button>
      </div>
    </div>
  );
}
