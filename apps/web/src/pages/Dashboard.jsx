import Topbar from "@/components/layout/Topbar";
import KPICard from "@/components/shared/KPICard";
import StatusBadge from "@/components/shared/StatusBadge";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import {
  DollarSign, Users, CalendarDays, Package, Clock, TrendingUp,
  ArrowRight, AlertTriangle, CheckCircle2, Wand2, Eye
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

const revenueData = [
  { name: "Seg", value: 1200 }, { name: "Ter", value: 1800 },
  { name: "Qua", value: 2400 }, { name: "Qui", value: 1900 },
  { name: "Sex", value: 3200 }, { name: "Sáb", value: 4100 },
  { name: "Dom", value: 800 },
];

const todaySessions = [
  { id: 1, client: "Lucas Mendes", time: "09:00", duration: "3h", type: "Sleeve (cont.)", status: "Em andamento", deposit: "R$ 300" },
  { id: 2, client: "Ana Beatriz", time: "13:00", duration: "2h", type: "Fineline floral", status: "Confirmada", deposit: "R$ 200" },
  { id: 3, client: "Pedro Oliveira", time: "16:00", duration: "4h", type: "Blackwork geométrico", status: "Aguardando", deposit: "R$ 500" },
  { id: 4, client: "Marina Santos", time: "20:00", duration: "1.5h", type: "Lettering", status: "Confirmada", deposit: "R$ 150" },
];

const recentActivity = [
  { text: "Stencil aprovado por Ana Beatriz", time: "5 min atrás", icon: CheckCircle2 },
  { text: "Novo agendamento: Pedro Oliveira", time: "23 min atrás", icon: CalendarDays },
  { text: "Estoque baixo: Agulhas RL 3", time: "1h atrás", icon: AlertTriangle },
  { text: "Pagamento recebido: R$ 800", time: "2h atrás", icon: DollarSign },
  { text: "Novo stencil gerado", time: "3h atrás", icon: Wand2 },
];

const statusMap = {
  "Em andamento": "info",
  "Confirmada": "success",
  "Aguardando": "warning",
};

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <Topbar title="Dashboard" subtitle="Visão geral do seu estúdio" />

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">

        {/* KPIs — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <KPICard title="Faturamento Hoje" value="R$ 2.450" change="+18% vs ontem" trend="up" icon={DollarSign} />
          <KPICard title="Sessões Hoje" value="4" change="2 confirmadas" trend="up" icon={CalendarDays} />
          <KPICard title="Clientes Ativos" value="127" change="+5 esta semana" trend="up" icon={Users} />
          <KPICard title="Itens em Alerta" value="3" change="Reposição urgente" trend="down" icon={Package} />
        </div>

        {/* Chart + Activity — stacked on mobile, side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Revenue Chart */}
          <div className="md:col-span-2 bg-card border border-border/50 rounded-xl p-4 md:p-5">
            <SectionHeader title="Faturamento da Semana" description="Receita diária acumulada" />
            <div className="h-[200px] md:h-[240px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 16%)" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(220, 15%, 10%)', border: '1px solid hsl(220, 12%, 16%)', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: 'hsl(210, 20%, 95%)' }}
                    itemStyle={{ color: 'hsl(160, 84%, 39%)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(160, 84%, 39%)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border/50 rounded-xl p-4 md:p-5">
            <SectionHeader title="Atividade Recente" />
            <div className="space-y-2 mt-2">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border/15 last:border-0">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-foreground leading-relaxed">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Sessions */}
        <div className="bg-card border border-border/50 rounded-xl p-4 md:p-5">
          <SectionHeader
            title="Sessões de Hoje"
            description="4 sessões agendadas"
            action={
              <Link to="/calendar">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1">
                  Ver agenda <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            }
          />

          {/* Desktop table */}
          <div className="mt-3 hidden md:block overflow-hidden rounded-lg border border-border/30">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  {["Horário", "Cliente", "Tipo", "Duração", "Depósito", "Status", ""].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todaySessions.map((session) => (
                  <tr key={session.id} className="border-t border-border/20 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-mono font-medium">{session.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{session.client}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{session.type}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{session.duration}</td>
                    <td className="px-4 py-3 text-sm font-medium text-primary">{session.deposit}</td>
                    <td className="px-4 py-3"><StatusBadge label={session.status} variant={statusMap[session.status]} /></td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-3 md:hidden space-y-2">
            {todaySessions.map((session) => (
              <div key={session.id} className="bg-muted/20 rounded-xl p-3 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-mono font-semibold">{session.time}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{session.duration}</span>
                  </div>
                  <StatusBadge label={session.status} variant={statusMap[session.status]} />
                </div>
                <p className="text-sm font-semibold text-foreground">{session.client}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{session.type}</p>
                  <span className="text-xs font-semibold text-primary">{session.deposit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "Gerar Stencil", icon: Wand2, path: "/stencil", desc: "Criar novo stencil com IA" },
            { label: "Nova Sessão", icon: CalendarDays, path: "/calendar", desc: "Agendar sessão" },
            { label: "Novo Cliente", icon: Users, path: "/clients", desc: "Cadastrar cliente" },
            { label: "Ver Relatórios", icon: TrendingUp, path: "/analytics", desc: "Analytics do estúdio" },
          ].map((action) => (
            <Link key={action.path} to={action.path}>
              <div className="bg-card border border-border/50 rounded-xl p-4 hover:border-primary/30 hover:bg-card/80 transition-all active:scale-[0.98] cursor-pointer group">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <action.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}