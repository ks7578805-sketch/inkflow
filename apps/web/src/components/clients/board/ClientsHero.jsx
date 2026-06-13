import { useMemo } from "react";
import {
  TrendingUp,
  CalendarClock,
  Sparkles,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCrmKPIs } from "@/data/clientsMock";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const pct = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

function timeOfDayGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function todayLabel() {
  const date = new Date();
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function KPI({ icon: Icon, label, value, sub, accent }) {
  return (
    <div
      className={cn(
        "group relative flex-1 min-w-[150px] overflow-hidden rounded-xl border p-3.5",
        accent
          ? "border-[#1db884]/30 bg-gradient-to-br from-[#1db884]/[0.10] via-[#0d0f12] to-[#0d0f12] shadow-[0_0_0_1px_rgba(29,184,132,0.08)]"
          : "border-[#1db884]/15 bg-gradient-to-br from-white/[0.025] to-transparent",
      )}
    >
      <div className="absolute -right-3 -top-3 opacity-[0.07] transition-opacity group-hover:opacity-[0.12]">
        <Icon className="h-20 w-20" strokeWidth={1} />
      </div>
      <div className="relative">
        <div className="flex items-center gap-1.5">
          <Icon
            className={cn(
              "h-3 w-3",
              accent ? "text-[#1db884]" : "text-white/45",
            )}
          />
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">
            {label}
          </span>
        </div>
        <div
          className={cn(
            "mt-2 text-xl font-bold tabular-nums leading-none tracking-tight",
            accent ? "text-[#1db884]" : "text-white/95",
          )}
        >
          {value}
        </div>
        {sub && <div className="mt-1 text-[11px] text-white/45">{sub}</div>}
      </div>
    </div>
  );
}

export default function ClientsHero({ clients, ownerName = "Marcelo" }) {
  const kpis = useMemo(() => getCrmKPIs(clients), [clients]);
  const greeting = timeOfDayGreeting();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#1db884]/20 bg-gradient-to-br from-[#1db884]/[0.07] via-[#0c0e10] to-[#0c0e10] shadow-[0_0_0_1px_rgba(29,184,132,0.04)]">
      {/* Decorative orbit */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[#1db884]/[0.10] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1db884]/30 to-transparent" />

      <div className="relative grid grid-cols-1 gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#1db884]/65">
            {todayLabel()}
          </p>
          <h1 className="mt-2 text-[22px] font-bold tracking-tight text-white">
            {greeting}, <span className="text-[#1db884]">{ownerName}</span>
          </h1>
          <p className="mt-1 text-[12.5px] text-white/55">
            <span className="font-semibold text-white/85">{kpis.totalClients}</span>{" "}
            clientes no pipeline ·{" "}
            <span className="font-semibold text-[#1db884]">
              {brl.format(kpis.pipelineValue)}
            </span>{" "}
            em aberto
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <KPI
            accent
            icon={TrendingUp}
            label="Pipeline"
            value={brl.format(kpis.pipelineValue)}
            sub={`${kpis.totalClients - kpis.paid} em andamento`}
          />
          <KPI
            icon={CalendarClock}
            label="Próximos 7 dias"
            value={kpis.upcomingSessions}
            sub={kpis.upcomingSessions === 1 ? "sessão agendada" : "sessões agendadas"}
          />
          <KPI
            icon={Activity}
            label="Em execução"
            value={kpis.inProgress}
            sub={kpis.inProgress === 1 ? "projeto ativo" : "projetos ativos"}
          />
          <KPI
            icon={Sparkles}
            label="Conversão"
            value={pct.format(kpis.conversionRate)}
            sub={`${kpis.paid} fechados`}
          />
        </div>
      </div>
    </section>
  );
}
