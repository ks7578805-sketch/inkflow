import Topbar from "@/components/layout/Topbar";
import KPICard from "@/components/shared/KPICard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DollarSign, Users, CalendarDays, Clock, Wand2, ArrowRight,
  CheckCircle2, TrendingUp, Zap, ChevronRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const revenueData = [
  { day: "Seg", value: 1200 },
  { day: "Ter", value: 1800 },
  { day: "Qua", value: 2400 },
  { day: "Qui", value: 1900 },
  { day: "Sex", value: 3200 },
  { day: "Sáb", value: 4100 },
  { day: "Dom", value: 800 },
];

const todaySessions = [
  { id: 1, client: "Lucas Mendes", initials: "LM", time: "09:00", duration: "3h", type: "Sleeve (continuação)", status: "Em andamento", value: "R$ 600" },
  { id: 2, client: "Ana Beatriz", initials: "AB", time: "13:00", duration: "2h", type: "Fineline floral", status: "Confirmada", value: "R$ 400" },
  { id: 3, client: "Pedro Oliveira", initials: "PO", time: "16:00", duration: "4h", type: "Blackwork geométrico", status: "Aguardando", value: "R$ 800" },
  { id: 4, client: "Marina Santos", initials: "MS", time: "20:00", duration: "1.5h", type: "Lettering", status: "Confirmada", value: "R$ 300" },
];

const activity = [
  { text: "Stencil aprovado por Ana Beatriz", time: "5 min", icon: CheckCircle2, color: "text-primary" },
  { text: "Novo agendamento: Pedro Oliveira", time: "23 min", icon: CalendarDays, color: "text-blue-400" },
  { text: "Pagamento recebido: R$ 800", time: "2h", icon: DollarSign, color: "text-primary" },
  { text: "Novo stencil gerado", time: "3h", icon: Wand2, color: "text-purple-400" },
];

const statusMap = {
  "Em andamento": "info",
  "Confirmada": "success",
  "Aguardando": "warning",
};

const weekTotal = revenueData.reduce((a, b) => a + b.value, 0);

export default function Dashboard() {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long"
  });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="min-h-screen">
      <Topbar title="Painel" subtitle="Visão geral do seu estúdio" />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/[0.06] bg-gradient-to-br from-primary/[0.08] via-[#0c0e12] to-[#0c0e12]">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="px-5 md:px-8 py-7 md:py-8">
          <p className="text-[10px] font-mono text-primary/50 uppercase tracking-[0.2em] mb-2">{todayCapitalized}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Bom dia, <span className="text-primary">Marcelo</span> 👋
          </h2>
          <p className="text-white/40 text-sm">
            Você tem <span className="text-white/80 font-semibold">4 sessões</span> hoje ·{" "}
            <span className="text-primary font-semibold">R$ 2.100</span> estimado
          </p>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4 md:space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KPICard accent title="Faturamento Hoje" value="R$ 2.450" change="+18% vs ontem" trend="up" icon={DollarSign} />
          <KPICard title="Sessões Hoje" value="4" change="2 confirmadas" trend="up" icon={CalendarDays} />
          <KPICard title="Clientes Ativos" value="127" change="+5 esta semana" trend="up" icon={Users} />
          <KPICard title="Próxima Sessão" value="13:00" change="Ana Beatriz · 2h" icon={Clock} />
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Revenue Chart */}
          <div className="md:col-span-2 glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] text-white/30 font-semibold uppercase tracking-[0.12em]">Faturamento</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  R$ {weekTotal.toLocaleString("pt-BR")}
                  <span className="text-xs font-normal text-white/30 ml-2">esta semana</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                +24%
              </div>
            </div>
            <div className="h-[180px] md:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(160,84%,39%)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(160,84%,39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.20)', fontSize: 10 }}
                    axisLine={false} tickLine={false} width={38}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0f1115',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#fff'
                    }}
                    itemStyle={{ color: 'hsl(160,84%,39%)' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}
                    formatter={(v) => [`R$ ${v.toLocaleString("pt-BR")}`, "Receita"]}
                  />
                  <Area
                    type="monotone" dataKey="value"
                    stroke="hsl(160,84%,39%)" strokeWidth={2}
                    fill="url(#grad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card rounded-2xl p-5">
            <p className="text-[11px] text-white/30 font-semibold uppercase tracking-[0.12em] mb-4">Atividade Recente</p>
            <div className="space-y-1">
              {activity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                  <div className={cn("mt-0.5 flex-shrink-0", item.color)}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/70 leading-relaxed">{item.text}</p>
                    <p className="text-[10px] text-white/25 mt-0.5">{item.time} atrás</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Sessions */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-white/30 font-semibold uppercase tracking-[0.12em]">Sessões de Hoje</p>
              <p className="text-base font-bold text-white mt-0.5">{todaySessions.length} sessões agendadas</p>
            </div>
            <Link to="/calendar">
              <Button variant="ghost" size="sm" className="text-xs text-white/30 hover:text-white gap-1 h-8 px-3">
                Ver agenda <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          {/* Session rows */}
          <div className="space-y-2">
            {todaySessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.07] transition-all group cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary">{s.initials}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">{s.client}</p>
                    <StatusBadge label={s.status} variant={statusMap[s.status]} />
                  </div>
                  <p className="text-xs text-white/35 truncate mt-0.5">{s.type}</p>
                </div>

                {/* Time + value */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Clock className="w-3 h-3 text-white/25" />
                    <span className="text-sm font-mono font-semibold text-white">{s.time}</span>
                  </div>
                  <p className="text-xs text-primary font-semibold mt-0.5">{s.value}</p>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 flex-shrink-0 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Gerar Stencil", icon: Wand2, path: "/stencil", desc: "Criar com IA", accent: true },
            { label: "Nova Sessão", icon: Zap, path: "/calendar", desc: "Agendar" },
            { label: "Novo Cliente", icon: Users, path: "/clients", desc: "Cadastrar" },
          ].map((action) => (
            <Link key={action.path} to={action.path}>
              <div className={cn(
                "glass-card rounded-2xl p-4 hover:border-white/[0.12] hover:bg-white/[0.06] transition-all active:scale-[0.97] cursor-pointer group",
                action.accent && "ink-border-glow"
              )}>
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-all",
                  action.accent
                    ? "bg-primary/15 border border-primary/25 group-hover:bg-primary/20"
                    : "bg-white/[0.05] border border-white/[0.07] group-hover:bg-white/[0.08]"
                )}>
                  <action.icon className={cn("w-4 h-4", action.accent ? "text-primary" : "text-white/50")} />
                </div>
                <p className="text-sm font-semibold text-white">{action.label}</p>
                <p className="text-[11px] text-white/30 mt-0.5">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
