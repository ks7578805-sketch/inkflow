import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ARTISTS } from "@/data/calendarMock";

const STYLES = ["Japanese", "Realismo", "Fineline", "Blackwork", "Geométrico", "Lettering", "Old School", "Neo Tradicional", "Aquarela", "Pontilhismo"];
const BODY_PARTS = ["Braço inteiro", "Antebraço", "Bíceps", "Ombro", "Costas", "Peito", "Costela", "Perna", "Coxa", "Pulso", "Panturrilha", "Pescoço"];
const STATUS_OPTS = ["Confirmada", "Aguardando depósito", "Reagendada"];

export default function NewSessionModal({ open, onClose, onSave, defaultDate }) {
  const [form, setForm] = useState({
    client: "", artist: "", style: "", placement: "",
    date: format(defaultDate || new Date(), "yyyy-MM-dd"),
    time: "09:00", endTime: "12:00",
    value: "", deposit: "",
    status: "Confirmada", notes: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.client || !form.artist) return;
    const start = parseInt(form.time.split(":")[0]);
    const end = parseInt(form.endTime.split(":")[0]);
    onSave({
      ...form,
      id: `s${Date.now()}`,
      artistName: ARTISTS.find(a => a.id === form.artist)?.name || form.artist,
      type: `${form.style || "Sessão"} – ${form.placement || ""}`,
      duration: Math.max(1, end - start),
      value: parseInt(form.value) || 0,
      deposit: parseInt(form.deposit) || 0,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Nova Sessão</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Cliente *</Label>
              <Input value={form.client} onChange={e => set("client", e.target.value)} placeholder="Nome do cliente" className="h-9 text-sm bg-secondary/50" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Artista *</Label>
              <Select value={form.artist} onValueChange={v => set("artist", v)}>
                <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{ARTISTS.filter(a => a.id !== "all").map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Estilo</Label>
              <Select value={form.style} onValueChange={v => set("style", v)}>
                <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Estilo" /></SelectTrigger>
                <SelectContent>{STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Placement</Label>
              <Select value={form.placement} onValueChange={v => set("placement", v)}>
                <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Área" /></SelectTrigger>
                <SelectContent>{BODY_PARTS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Data</Label>
              <Input type="date" value={form.date} onChange={e => set("date", e.target.value)} className="h-9 text-sm bg-secondary/50" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Início</Label>
              <Input type="time" value={form.time} onChange={e => set("time", e.target.value)} className="h-9 text-sm bg-secondary/50" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Término</Label>
              <Input type="time" value={form.endTime} onChange={e => set("endTime", e.target.value)} className="h-9 text-sm bg-secondary/50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Valor (R$)</Label>
              <Input type="number" value={form.value} onChange={e => set("value", e.target.value)} placeholder="0" className="h-9 text-sm bg-secondary/50" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Depósito (R$)</Label>
              <Input type="number" value={form.deposit} onChange={e => set("deposit", e.target.value)} placeholder="0" className="h-9 text-sm bg-secondary/50" />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Status</Label>
            <Select value={form.status} onValueChange={v => set("status", v)}>
              <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUS_OPTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Observações</Label>
            <textarea
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="Notas da sessão..."
              className="w-full h-20 bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={!form.client || !form.artist} className="bg-primary text-primary-foreground">
              Criar Sessão
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}