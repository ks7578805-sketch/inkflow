import Topbar from "@/components/layout/Topbar";
import StatusBadge from "@/components/shared/StatusBadge";
import KPICard from "@/components/shared/KPICard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Plus, AlertTriangle, Box, DollarSign, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const INITIAL_STOCK = [
  { id: 1, name: "Agulhas RL 3", category: "Agulhas", qty: 5, min: 20, unit: "un", supplier: "TattooSupply BR", lot: "AG-2024-042", expiry: "2027-03" },
  { id: 2, name: "Agulhas RS 7", category: "Agulhas", qty: 35, min: 20, unit: "un", supplier: "TattooSupply BR", lot: "AG-2024-043", expiry: "2027-03" },
  { id: 3, name: "Tinta Intenze – Black", category: "Tintas", qty: 8, min: 5, unit: "ml", supplier: "Intenze BR", lot: "TI-2024-089", expiry: "2026-08" },
  { id: 4, name: "Tinta Fusion – White", category: "Tintas", qty: 3, min: 5, unit: "ml", supplier: "Fusion Ink", lot: "FU-2024-015", expiry: "2026-06" },
  { id: 5, name: "Filme PU (rolo)", category: "Proteção", qty: 12, min: 5, unit: "rolos", supplier: "MedSupply", lot: "PR-2024-022", expiry: "2028-01" },
  { id: 6, name: "Luvas Nitrilo M", category: "EPIs", qty: 200, min: 100, unit: "pares", supplier: "MedSupply", lot: "LU-2024-105", expiry: "2027-12" },
  { id: 7, name: "Copos de Tinta (desc.)", category: "Descartáveis", qty: 8, min: 50, unit: "un", supplier: "TattooSupply BR", lot: "DC-2024-033", expiry: "—" },
];

const INITIAL_KITS = [
  { id: 1, name: "Kit Fine Line", items: 6, cost: 45, sessions: 12 },
  { id: 2, name: "Kit Blackwork", items: 8, cost: 62, sessions: 8 },
  { id: 3, name: "Kit Colorido Grande", items: 12, cost: 95, sessions: 5 },
  { id: 4, name: "Kit Realismo", items: 10, cost: 78, sessions: 6 },
];

const CATEGORIES = ["Agulhas", "Tintas", "Proteção", "EPIs", "Descartáveis", "Outros"];

const EMPTY_FORM = { name: "", category: "", qty: "", min: "", unit: "un", supplier: "", lot: "", expiry: "" };

export default function Inventory() {
  const [tab, setTab] = useState("stock");
  const [stock, setStock] = useState(INITIAL_STOCK);
  const [kits, setKits] = useState(INITIAL_KITS);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = novo, item = editar
  const [form, setForm] = useState(EMPTY_FORM);

  // Kit modal
  const [kitModalOpen, setKitModalOpen] = useState(false);
  const [kitForm, setKitForm] = useState({ name: "", items: "", cost: "", sessions: "" });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, category: item.category, qty: String(item.qty), min: String(item.min), unit: item.unit, supplier: item.supplier, lot: item.lot, expiry: item.expiry });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.category) return;
    const item = {
      ...form,
      qty: parseInt(form.qty) || 0,
      min: parseInt(form.min) || 0,
    };
    if (editing) {
      setStock(prev => prev.map(s => s.id === editing.id ? { ...s, ...item } : s));
    } else {
      setStock(prev => [...prev, { id: Date.now(), ...item }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => setStock(prev => prev.filter(s => s.id !== id));

  const handleSaveKit = () => {
    if (!kitForm.name) return;
    setKits(prev => [...prev, { id: Date.now(), name: kitForm.name, items: parseInt(kitForm.items) || 0, cost: parseInt(kitForm.cost) || 0, sessions: parseInt(kitForm.sessions) || 0 }]);
    setKitForm({ name: "", items: "", cost: "", sessions: "" });
    setKitModalOpen(false);
  };

  const filtered = stock.filter(i => !search.trim() || i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()));
  const alerts = stock.filter(i => i.qty < i.min).length;

  return (
    <div className="min-h-screen">
      <Topbar title="Estoque" subtitle="Controle de materiais e custos" />

      <div className="p-4 md:p-6 space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <KPICard title="Total de Itens" value={stock.length} change="itens cadastrados" icon={Package} />
          <KPICard title="Itens em Alerta" value={alerts} change="Reposição necessária" trend={alerts > 0 ? "down" : "up"} icon={AlertTriangle} />
          <KPICard title="Custo Médio/Sessão" value="R$ 58" change="-5% vs mês anterior" trend="up" icon={DollarSign} />
          <KPICard title="Kits Cadastrados" value={kits.length} change="kits ativos" icon={Box} />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <TabsList className="bg-muted/30 h-9 self-start">
              <TabsTrigger value="stock" className="text-xs">Estoque</TabsTrigger>
              <TabsTrigger value="kits" className="text-xs">Kits</TabsTrigger>
              <TabsTrigger value="costs" className="text-xs">Custos por Sessão</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 h-9 w-44 bg-secondary/50 text-sm" />
              </div>
              <Button size="sm" onClick={tab === "kits" ? () => setKitModalOpen(true) : openAdd} className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shrink-0">
                <Plus className="w-4 h-4" />
                {tab === "kits" ? "Novo Kit" : "Adicionar"}
              </Button>
            </div>
          </div>

          {/* Stock tab */}
          <TabsContent value="stock" className="mt-4">
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30">
                      {["Item", "Categoria", "Qtd", "Mín", "Fornecedor", "Validade", "Status", ""].map(h => (
                        <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-12 text-sm text-muted-foreground">Nenhum item encontrado</td></tr>
                    ) : filtered.map((item) => {
                      const alert = item.qty < item.min;
                      return (
                        <tr key={item.id} className="border-t border-border/20 hover:bg-muted/10 transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-foreground whitespace-nowrap">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{item.lot}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{item.category}</td>
                          <td className={cn("px-4 py-3 text-sm font-bold whitespace-nowrap", alert ? "text-destructive" : "text-foreground")}>
                            {item.qty} <span className="text-muted-foreground font-normal text-xs">{item.unit}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{item.min} {item.unit}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{item.supplier}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{item.expiry}</td>
                          <td className="px-4 py-3">
                            <StatusBadge label={alert ? "Repor" : "OK"} variant={alert ? "error" : "success"} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => openEdit(item)} className="w-7 h-7 rounded-lg hover:bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDelete(item.id)} className="w-7 h-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Kits tab */}
          <TabsContent value="kits" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kits.map((kit) => (
                <div key={kit.id} className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/20 transition-all">
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
                      <p className="text-lg font-bold text-primary">R$ {kit.cost}</p>
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

          {/* Costs tab */}
          <TabsContent value="costs" className="mt-4">
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

      {/* Add/Edit Stock Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Item" : "Adicionar Item ao Estoque"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Nome do item *</Label>
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ex: Agulhas RL 3" className="h-9 bg-secondary/50 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Categoria *</Label>
                <Select value={form.category} onValueChange={v => set("category", v)}>
                  <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Categoria" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Unidade</Label>
                <Input value={form.unit} onChange={e => set("unit", e.target.value)} placeholder="un" className="h-9 bg-secondary/50 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Quantidade atual</Label>
                <Input type="number" value={form.qty} onChange={e => set("qty", e.target.value)} placeholder="0" className="h-9 bg-secondary/50 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Qtd mínima</Label>
                <Input type="number" value={form.min} onChange={e => set("min", e.target.value)} placeholder="0" className="h-9 bg-secondary/50 text-sm" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Fornecedor</Label>
              <Input value={form.supplier} onChange={e => set("supplier", e.target.value)} placeholder="Nome do fornecedor" className="h-9 bg-secondary/50 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Lote</Label>
                <Input value={form.lot} onChange={e => set("lot", e.target.value)} placeholder="Ex: AG-2024-042" className="h-9 bg-secondary/50 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Validade</Label>
                <Input value={form.expiry} onChange={e => set("expiry", e.target.value)} placeholder="AAAA-MM" className="h-9 bg-secondary/50 text-sm" />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleSave} disabled={!form.name || !form.category} className="bg-primary text-primary-foreground">
                {editing ? "Salvar alterações" : "Adicionar item"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Kit Modal */}
      <Dialog open={kitModalOpen} onOpenChange={setKitModalOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle>Novo Kit</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Nome do kit *</Label>
              <Input value={kitForm.name} onChange={e => setKitForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Kit Fine Line" className="h-9 bg-secondary/50 text-sm" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Itens</Label>
                <Input type="number" value={kitForm.items} onChange={e => setKitForm(p => ({ ...p, items: e.target.value }))} placeholder="0" className="h-9 bg-secondary/50 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Custo (R$)</Label>
                <Input type="number" value={kitForm.cost} onChange={e => setKitForm(p => ({ ...p, cost: e.target.value }))} placeholder="0" className="h-9 bg-secondary/50 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Sessões</Label>
                <Input type="number" value={kitForm.sessions} onChange={e => setKitForm(p => ({ ...p, sessions: e.target.value }))} placeholder="0" className="h-9 bg-secondary/50 text-sm" />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" size="sm" onClick={() => setKitModalOpen(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleSaveKit} disabled={!kitForm.name} className="bg-primary text-primary-foreground">Criar Kit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}