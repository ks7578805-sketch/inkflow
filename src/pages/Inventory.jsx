import Topbar from "@/components/layout/Topbar";
import StatusBadge from "@/components/shared/StatusBadge";
import KPICard from "@/components/shared/KPICard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, Search, Plus, AlertTriangle, Box, DollarSign } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const stockItems = [
  { id: 1, name: "Agulhas RL 3", category: "Agulhas", qty: 5, min: 20, unit: "un", supplier: "TattooSupply BR", lot: "AG-2024-042", expiry: "2027-03", alert: true },
  { id: 2, name: "Agulhas RS 7", category: "Agulhas", qty: 35, min: 20, unit: "un", supplier: "TattooSupply BR", lot: "AG-2024-043", expiry: "2027-03", alert: false },
  { id: 3, name: "Tinta Intenze – Black", category: "Tintas", qty: 8, min: 5, unit: "ml", supplier: "Intenze BR", lot: "TI-2024-089", expiry: "2026-08", alert: false },
  { id: 4, name: "Tinta Fusion – White", category: "Tintas", qty: 3, min: 5, unit: "ml", supplier: "Fusion Ink", lot: "FU-2024-015", expiry: "2026-06", alert: true },
  { id: 5, name: "Filme PU (rolo)", category: "Proteção", qty: 12, min: 5, unit: "rolos", supplier: "MedSupply", lot: "PR-2024-022", expiry: "2028-01", alert: false },
  { id: 6, name: "Luvas Nitrilo M", category: "EPIs", qty: 200, min: 100, unit: "pares", supplier: "MedSupply", lot: "LU-2024-105", expiry: "2027-12", alert: false },
  { id: 7, name: "Copos de Tinta (desc.)", category: "Descartáveis", qty: 8, min: 50, unit: "un", supplier: "TattooSupply BR", lot: "DC-2024-033", expiry: "—", alert: true },
];

const kits = [
  { id: 1, name: "Kit Fine Line", items: 6, cost: "R$ 45", sessions: 12 },
  { id: 2, name: "Kit Blackwork", items: 8, cost: "R$ 62", sessions: 8 },
  { id: 3, name: "Kit Colorido Grande", items: 12, cost: "R$ 95", sessions: 5 },
  { id: 4, name: "Kit Realismo", items: 10, cost: "R$ 78", sessions: 6 },
];

export default function Inventory() {
  const [tab, setTab] = useState("stock");

  return (
    <div className="min-h-screen">
      <Topbar title="Estoque" subtitle="Controle de materiais e custos" />

      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard title="Total de Itens" value="271" change="7 categorias" icon={Package} />
          <KPICard title="Itens em Alerta" value="3" change="Reposição urgente" trend="down" icon={AlertTriangle} />
          <KPICard title="Custo Médio/Sessão" value="R$ 58" change="-5% vs mês anterior" trend="up" icon={DollarSign} />
          <KPICard title="Kits Cadastrados" value="4" change="Mais usado: Fine Line" icon={Box} />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted/30 h-9">
              <TabsTrigger value="stock" className="text-xs">Estoque</TabsTrigger>
              <TabsTrigger value="kits" className="text-xs">Kits</TabsTrigger>
              <TabsTrigger value="costs" className="text-xs">Custos por Sessão</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-9 h-9 w-56 bg-secondary/50 text-sm" />
              </div>
              <Button size="sm" className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
                <Plus className="w-4 h-4" /> Adicionar
              </Button>
            </div>
          </div>

          <TabsContent value="stock" className="mt-4">
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Item</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Categoria</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Qtd</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Mín</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Lote</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Validade</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Fornecedor</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stockItems.map((item) => (
                    <tr key={item.id} className="border-t border-border/20 hover:bg-muted/10 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{item.category}</td>
                      <td className={cn("px-4 py-3 text-sm font-semibold", item.alert ? "text-destructive" : "text-foreground")}>
                        {item.qty} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{item.min} {item.unit}</td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{item.lot}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{item.expiry}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{item.supplier}</td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          label={item.alert ? "Repor" : "OK"}
                          variant={item.alert ? "error" : "success"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="kits" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {kits.map((kit) => (
                <div key={kit.id} className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/20 cursor-pointer transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{kit.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{kit.items} itens no kit</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Box className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-lg font-bold text-primary">{kit.cost}</p>
                      <p className="text-[10px] text-muted-foreground">Custo por kit</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{kit.sessions}</p>
                      <p className="text-[10px] text-muted-foreground">Sessões usadas</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="costs" className="mt-4">
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: "Fine Line", cost: "R$ 45", pct: "5.6%" },
                  { label: "Blackwork", cost: "R$ 62", pct: "7.8%" },
                  { label: "Colorido", cost: "R$ 95", pct: "11.9%" },
                  { label: "Realismo", cost: "R$ 78", pct: "9.8%" },
                  { label: "Japanese", cost: "R$ 85", pct: "10.6%" },
                  { label: "Dotwork", cost: "R$ 52", pct: "6.5%" },
                ].map((item) => (
                  <div key={item.label} className="bg-muted/20 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-xl font-bold text-foreground">{item.cost}</p>
                    <p className="text-xs text-muted-foreground">{item.pct} do valor da sessão</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}