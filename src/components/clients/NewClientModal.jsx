import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewClientModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "", phone: "", ig: "", email: "", birthday: "",
    artist: "", notes: "", vip: false,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.name) return;
    onSave({
      ...form,
      id: Date.now(),
      sessions: 0,
      total: 0,
      lastSession: "—",
      nextSession: "—",
      healing: false,
      activeProject: false,
      noReturn: false,
      isNew: true,
      style: "",
      tags: ["Novo", ...(form.vip ? ["VIP"] : [])],
    });
    setForm({ name: "", phone: "", ig: "", email: "", birthday: "", artist: "", notes: "", vip: false });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Novo Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-1">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Nome completo *</Label>
            <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Nome do cliente" className="h-9 text-sm bg-secondary/50" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Telefone</Label>
              <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+55 11..." className="h-9 text-sm bg-secondary/50" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Instagram</Label>
              <Input value={form.ig} onChange={e => set("ig", e.target.value)} placeholder="@usuario" className="h-9 text-sm bg-secondary/50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Email</Label>
              <Input value={form.email} onChange={e => set("email", e.target.value)} placeholder="email@..." className="h-9 text-sm bg-secondary/50" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Nascimento</Label>
              <Input type="date" value={form.birthday} onChange={e => set("birthday", e.target.value)} className="h-9 text-sm bg-secondary/50" />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Artista principal</Label>
            <Input value={form.artist} onChange={e => set("artist", e.target.value)} placeholder="Nome do artista" className="h-9 text-sm bg-secondary/50" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Observações</Label>
            <textarea
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="Alergias, preferências, notas..."
              className="w-full h-20 bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          {/* VIP toggle */}
          <button
            onClick={() => set("vip", !form.vip)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all text-left",
              form.vip
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-border"
            )}
          >
            <Star className={cn("w-4 h-4", form.vip && "fill-amber-400")} />
            <span className="text-sm font-medium">{form.vip ? "Cliente VIP ativado" : "Marcar como VIP"}</span>
          </button>

          <div className="flex gap-2 justify-end pt-1">
            <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={!form.name} className="bg-primary text-primary-foreground">
              Criar Cliente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}