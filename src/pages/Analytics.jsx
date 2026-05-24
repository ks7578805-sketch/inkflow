import Topbar from "@/components/layout/Topbar";
import KPICard from "@/components/shared/KPICard";
import SectionHeader from "@/components/shared/SectionHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, CalendarDays, Users, TrendingUp, BarChart3, Target, UserCheck, AlertTriangle } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const revenueByMonth = [
  { name: "Jan", value: 12000 }, { name: "Fev", value: 15000 },
  { name: "Mar", value: 13500 }, { name: "Abr", value: 18200 },
  { name: "Mai", value: 21000 },
];

const occupancyData = [
  { name: "Seg", occupancy: 85 }, { name: "Ter", occupancy: 70 },
  { name: "Qua", occupancy: 95 }, { name: "Qui", occupancy: 60 },
  { name: "Sex", occupancy: 100 }, { name: "Sáb", occupancy: 90 },
];

const artistRevenue = [
  { name: "Marcelo R.", receita: 14500 },
  { name: "Camila S.", receita: 6500 },
];

const styleDistribution = [
  { name: "Fine Line", value: 30 },
  { name: "Blackwork", value: 25 },
  { name: "Realismo", value: 18 },
  { name: "Japanese", value: 12 },
  { name: "Geométrico", value: 10 },
  { name: "Outros", value: 5 },
];

const COLORS = [
  "hsl(160, 84%, 39%)", "hsl(200, 70%, 50%)", "hsl(280, 65%, 60%)",
  "hsl(35, 90%, 55%)", "hsl(340, 75%, 55%)", "hsl(215, 15%, 45%)"
];

const chartTooltipStyle = {
  background: 'hsl(220, 15%, 10%)',
  border: '1px solid hsl(220, 12%, 16%)',
  borderRadius: '8px',
  fontSize: '12px'
};

const axisStyle = { fill: 'hsl(215, 15%, 55%)', fontSize: 11 };

export default function Analytics() {
  return (
    <div className="min-h-screen">
      <Topbar title="Analytics" subtitle="Métricas e insights do negócio" />

      <div className="p-6 space-y-6">
        {/* Period Filter */}
        <div className="flex justify-end">
          <Select defaultValue="month">
            <SelectTrigger className="h-9 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard title="Faturamento" value="R$ 21.000" change="+15% vs anterior" trend="up" icon={DollarSign} />
          <KPICard title="Ocupação" value="83%" change="+5% vs anterior" trend="up" icon={CalendarDays} />
          <KPICard title="Ticket Médio" value="R$ 720" change="+8% vs anterior" trend="up" icon={TrendingUp} />
          <KPICard title="No-Show" value="4.2%" change="-2% vs anterior" trend="up" icon={AlertTriangle} />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <KPICard title="Sessões Concluídas" value="29" change="Meta: 35" icon={Target} />
          <KPICard title="Clientes Recorrentes" value="68%" change="+3% vs anterior" trend="up" icon={UserCheck} />
          <KPICard title="Leads Convertidos" value="72%" change="18 de 25" trend="up" icon={Users} />
          <KPICard title="Consumo Estoque" value="R$ 1.680" change="8% do faturamento" icon={BarChart3} />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card border border-border/50 rounded-xl p-5">
            <SectionHeader title="Faturamento Mensal" description="Receita por mês" />
            <div className="h-[260px] mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueByMonth}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 16%)" />
                  <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area type="monotone" dataKey="value" stroke="hsl(160, 84%, 39%)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-5">
            <SectionHeader title="Ocupação da Agenda" description="Por dia da semana" />
            <div className="h-[260px] mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 16%)" />
                  <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="occupancy" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-card border border-border/50 rounded-xl p-5">
            <SectionHeader title="Receita por Artista" />
            <div className="h-[220px] mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={artistRevenue} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 16%)" />
                  <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={axisStyle} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="receita" fill="hsl(160, 84%, 39%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-2 bg-card border border-border/50 rounded-xl p-5">
            <SectionHeader title="Distribuição por Estilo" />
            <div className="h-[220px] mt-3 flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie data={styleDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                    {styleDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {styleDistribution.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
                    <span className="text-xs font-semibold text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}