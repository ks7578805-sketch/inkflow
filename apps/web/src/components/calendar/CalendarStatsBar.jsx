import { useMemo } from "react";
import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarRange,
  DollarSign,
  Percent,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMonthStats, getNextSession, firstName } from "@/data/calendarMock";
import StatusAvatar from "./StatusAvatar";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function relativeDay(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (isToday(date)) return "Hoje";
  if (isTomorrow(date)) return "Amanhã";
  return format(date, "d 'de' MMM", { locale: ptBR });
}

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div
      className={cn(
        "group relative flex-1 min-w-[180px] overflow-hidden rounded-xl border bg-gradient-to-br p-4",
        accent
          ? "border-[#1db884]/25 from-[#1db884]/[0.08] via-[#0c0e12] to-[#0c0e12]"
          : "border-white/[0.06] from-white/[0.025] to-transparent",
      )}
    >
      <div className="absolute -right-2 -top-2 opacity-[0.06] transition-opacity group-hover:opacity-[0.10]">
        <Icon className="h-20 w-20" strokeWidth={1} />
      </div>
      <div className="relative">
        <div className="flex items-center gap-1.5">
          <Icon
            className={cn(
              "h-3 w-3",
              accent ? "text-[#1db884]" : "text-white/40",
            )}
          />
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/40">
            {label}
          </span>
        </div>
        <div
          className={cn(
            "mt-2 text-xl font-bold tabular-nums tracking-tight",
            accent ? "text-[#1db884]" : "text-white/95",
          )}
        >
          {value}
        </div>
        {sub && (
          <div className="mt-0.5 text-[11px] text-white/40">{sub}</div>
        )}
      </div>
    </div>
  );
}

function NextSessionCard({ session }) {
  if (!session) {
    return (
      <div className="group relative flex-1 min-w-[200px] overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.025] to-transparent p-4">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-white/40" />
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/40">
            Próxima sessão
          </span>
        </div>
        <div className="mt-2 text-sm font-medium text-white/55">
          Agenda livre
        </div>
        <div className="mt-0.5 text-[11px] text-white/30">
          Nenhuma sessão futura
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex-1 min-w-[200px] overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.025] to-transparent p-4 transition-colors hover:from-white/[0.04]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-white/40" />
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/40">
            Próxima sessão
          </span>
        </div>
        <ArrowRight className="h-3 w-3 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-white/55" />
      </div>
      <div className="mt-2.5 flex items-center gap-2.5">
        <StatusAvatar session={session} size={36} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white/95">
            {firstName(session.clienteNome)}
          </div>
          <div className="text-[11px] tabular-nums text-white/45">
            {relativeDay(session.data)} · {session.horarioInicio.slice(0, 5)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CalendarStatsBar({ cursor, overrides }) {
  const stats = useMemo(() => getMonthStats(cursor, overrides), [cursor, overrides]);
  const nextSession = useMemo(() => getNextSession(new Date()), []);
  const monthLabel = format(cursor, "MMMM", { locale: ptBR });

  return (
    <div className="flex flex-wrap gap-3">
      <StatCard
        icon={CalendarRange}
        label={`Sessões em ${monthLabel}`}
        value={stats.active}
        sub={
          stats.cancelled > 0
            ? `${stats.confirmed} confirmadas · ${stats.cancelled} canceladas`
            : `${stats.confirmed} confirmadas`
        }
      />
      <StatCard
        accent
        icon={DollarSign}
        label="Faturamento estimado"
        value={brl.format(stats.revenue)}
        sub={`${stats.busyHours.toFixed(0)}h agendadas`}
      />
      <StatCard
        icon={Percent}
        label="Taxa de ocupação"
        value={`${Math.round(stats.occupancy * 100)}%`}
        sub={`${stats.daysWithSessions} dias com sessões`}
      />
      <NextSessionCard session={nextSession} />
    </div>
  );
}
