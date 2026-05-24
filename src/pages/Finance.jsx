import Topbar from "@/components/layout/Topbar";
import KPICard from "@/components/shared/KPICard";
import SectionHeader from "@/components/shared/SectionHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, CreditCard, ArrowDownRight, Target, Download } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const monthlyData = [
  { name: "Jan", receita: 12000, despesa: 4200 },
  { name: "Fev", receita: 15000, despesa: 4800 },
  { name: "Mar", receita: 13500, despesa: 5100 },
  { name: "Abr", receita: 18200, despesa: 5400 },
  { name: "Mai", receita: 21000, despesa: 5800 },
];

const transactions = [
  { id: 1, desc: "Sessão – Lucas Mendes (Sleeve)", date: "24/05", amount: "R$ 800", type: "income", method: "PIX" },
  { id: 2, desc: "Depósito – Ana Beatriz", date: "23/05", amount: "R$ 200", type: "income", method: "PIX" },
  { id: 3, desc: "Agulhas RL 3 – Fornecedor X", date: "22/05", amount: "- R$ 180", type: "expense", method: "Cartão" },
  { id: 4, desc: "Sessão – Pedro Oliveira", date: "21/05", amount: "R$ 500", type: "income", method: "Dinheiro" },
  { id: 5, desc: "Tinta Intenze – Reposição", date: "20/05", amount: "- R$ 420", type: "expense", method: "Cartão" },
  { id: 6, desc: "Sessão – Ricardo Lima", date: "19/05", amount: "R$ 1.200", type: "income", method: "PIX" },
  { id: 7, desc: "Aluguel estúdio – Mai", date: "15/05", amount: "- R$ 3.500", type: "expense", method: "Transferência" },
];

export default function Finance() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen">
      <Topbar title="Financeiro" subtitle="Controle financeiro do estúdio" />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="bg-muted/30 h-9">
              <TabsTrigger value="overview" className="text-xs">Visão Geral</TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs">Transações</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-3">
            <Select defaultValue="month">
              <SelectTrigger className="h-9 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5">
              <Download className="w-3.5 h-3.5" /> Exportar
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-5 gap-4">
          <KPICard title="Faturamento" value="R$ 21.000" change="+15% vs mês anterior" trend="up" icon={DollarSign} />
          <KPICard title="Depósitos" value="R$ 3.200" change="8 recebidos" trend="up" icon={CreditCard} />
          <KPICard title="Despesas" value="R$ 5.800" change="+7% vs mês anterior" trend="down" icon={ArrowDownRight} />
          <KPICard title="Lucro Líquido" value="R$ 15.200" change="+22% vs mês anterior" trend="up" icon={TrendingUp} />
          <KPICard title="Meta Mensal" value="82%" change="R$ 25.000" trend="up" icon={Target} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card border border-border/50 rounded-xl p-5">
            <SectionHeader title="Receita vs Despesas" description="Últimos 5 meses" />
            <div className="h-[260px] mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 16%)" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(220, 15%, 10%)', border: '1px solid hsl(220, 12%, 16%)', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="receita" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="despesa" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-5">
            <SectionHeader title="Fluxo de Caixa" description="Acumulado do mês" />
            <div className="h-[260px] mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 16%)" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(220, 15%, 10%)', border: '1px solid hsl(220, 12%, 16%)', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="receita" stroke="hsl(160, 84%, 39%)" fillOpacity={1} fill="url(#colorCash)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <SectionHeader title="Transações Recentes" description="Últimas movimentações" />
          <div className="mt-3 overflow-hidden rounded-lg border border-border/30">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Descrição</th>
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Data</th>
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Método</th>
                  <th className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-t border-border/20 hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 text-sm">{t.desc}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{t.date}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={t.method} variant="neutral" />
                    </td>
                    <td className={`px-4 py-3 text-sm font-semibold text-right ${t.type === "income" ? "text-primary" : "text-destructive"}`}>
                      {t.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}