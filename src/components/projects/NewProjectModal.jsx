import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "quick", icon: Zap, label: "Projeto Rápido", desc: "Campos mínimos — adicione detalhes depois" },
  { id: "full", icon: FileText, label: "Projeto Completo", desc: "Preencha todos os dados de uma vez" },
];

const STYLES = ["Japanese", "Realismo", "Geométrico", "Lettering", "Blackwork", "Fineline", "Aquarela", "Old School", "New School", "Neo Tradicional", "Tribal", "Pontilhismo"];
const BODY_PARTS = ["Braço inteiro", "Antebraço", "Bíceps", "Ombro", "Costas", "Peito", "Costela", "Perna", "Panturrilha", "Coxa", "Pescoço", "Mão", "Pé"];
const ARTISTS = ["Rafael Ink", "Marta Velez", "Camila Torres"];

export default function NewProjectModal({ open, onClose, onSave }) {
  const [mode, setMode] = useState("quick");
  const [form, setForm] = useState({
    name: "", client: "", artist: "", style: "", bodyPart: "", valueEstimated: "", status: "Pendente", notes: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.client) return;
    onSave({
      ...form,
      id: `p${Date.now()}`,
      progress: 0,
      sessions: { done: 0, total: 3 },
      hoursEstimated: 6,
      hoursReal: 0,
      valueFinal: null,
      deposit: 0,
      totalPaid: 0,
      nextSession: "A definir",
      lastUpdate: "Agora",
      createdAt: new Date().toLocaleDateString("pt-BR"),
      badges: ["Falta stencil"],
      thumbnail: null,
      completeness: 5,
      completionItems: ["stencil", "confirmação de sessão"],
      tags: [],
      priority: "media",
      size: "",
      valueEstimated: parseInt(form.valueEstimated) || 0,
    });
    setForm({ name: "", client: "", artist: "", style: "", bodyPart: "", valueEstimated: "", status: "Pendente", notes: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Novo Projeto</DialogTitle>
        </DialogHeader>

        {/* Mode selector */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "flex items-start gap-2 p-3 rounded-lg border text-left transition-all",
                mode === m.id ? "border-primary/40 bg-primary/5" : "border-border/50 hover:border-border"
              )}
            >
              <m.icon className={cn("w-4 h-4 mt-0.5 shrink-0", mode === m.id ? "text-primary" : "text-muted-foreground")} />
              <div>
                <p className="text-xs font-semibold text-foreground">{m.label}</p>
                <p className="text-[10px] text-muted-foreground">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Nome do projeto *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="ex: Sleeve Oriental" className="h-9 text-sm bg-secondary/50" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Cliente *</Label>
              <Input value={form.client} onChange={(e) => set("client", e.target.value)} placeholder="Nome do cliente" className="h-9 text-sm bg-secondary/50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Artista</Label>
              <Select value={form.artist} onValueChange={(v) => set("artist", v)}>
                <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{ARTISTS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Estilo</Label>
              <Select value={form.style} onValueChange={(v) => set("style", v)}>
                <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{STYLES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {mode === "full" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Área do corpo</Label>
                <Select value={form.bodyPart} onValueChange={(v) => set("bodyPart", v)}>
                  <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                  <SelectContent>{BODY_PARTS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Valor estimado (R$)</Label>
                <Input type="number" value={form.valueEstimated} onChange={(e) => set("valueEstimated", e.target.value)} placeholder="0,00" className="h-9 text-sm bg-secondary/50" />
              </div>
            </div>
          )}

          <div className="pt-1 flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={!form.name || !form.client} className="bg-primary text-primary-foreground">
              Criar Projeto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}