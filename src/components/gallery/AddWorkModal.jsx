import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { STYLES, BODY_PARTS, ARTISTS_GALLERY, MOCK_CONCLUDED_PROJECTS } from "@/data/galleryMock";
import { FolderOpen, PenLine, Star, RefreshCw } from "lucide-react";

const COLORS = [
  "from-red-900/60 to-orange-900/40",
  "from-rose-900/50 to-pink-900/40",
  "from-violet-900/50 to-purple-900/40",
  "from-blue-900/60 to-indigo-900/50",
  "from-slate-800/80 to-gray-900/60",
  "from-amber-900/50 to-yellow-900/40",
  "from-emerald-900/50 to-teal-900/40",
  "from-zinc-800/70 to-neutral-900/50",
];

export default function AddWorkModal({ open, onClose, onSave }) {
  const [mode, setMode] = useState("manual"); // "manual" | "project"
  const [selectedProject, setSelectedProject] = useState(null);
  const [form, setForm] = useState({
    title: "", artist: "", style: "", placement: "",
    description: "", duration: "", sessions: "1", value: "",
    exclusive: false, repeatable: true, featured: false,
    tags: "",
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSelectProject = (proj) => {
    setSelectedProject(proj);
    setForm(p => ({
      ...p,
      title: proj.title,
      artist: proj.artist,
      style: proj.style,
      placement: proj.placement,
      duration: String(proj.duration),
      sessions: String(proj.sessions),
      value: String(proj.value),
      description: `Trabalho realizado no projeto "${proj.title}" com ${proj.client}.`,
    }));
  };

  const handleSave = () => {
    if (!form.title) return;
    onSave({
      id: Date.now(),
      ...form,
      duration: parseFloat(form.duration) || 0,
      sessions: parseInt(form.sessions) || 1,
      value: parseInt(form.value) || 0,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      fromProject: selectedProject ? `Projeto ${selectedProject.title} — ${selectedProject.client}` : null,
      isNew: true, featured: form.featured, exclusive: form.exclusive, repeatable: form.repeatable,
      colors: COLORS[Math.floor(Math.random() * COLORS.length)],
      views: 0, likes: 0,
    });
    setForm({ title: "", artist: "", style: "", placement: "", description: "", duration: "", sessions: "1", value: "", exclusive: false, repeatable: true, featured: false, tags: "" });
    setSelectedProject(null);
    setMode("manual");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Adicionar Trabalho</DialogTitle>
        </DialogHeader>

        {/* Mode selector */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => { setMode("manual"); setSelectedProject(null); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium transition-all",
              mode === "manual" ? "bg-primary/15 border-primary/30 text-primary" : "border-border/50 text-muted-foreground hover:border-border"
            )}
          >
            <PenLine className="w-3.5 h-3.5" /> Adicionar manualmente
          </button>
          <button
            onClick={() => setMode("project")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium transition-all",
              mode === "project" ? "bg-primary/15 border-primary/30 text-primary" : "border-border/50 text-muted-foreground hover:border-border"
            )}
          >
            <FolderOpen className="w-3.5 h-3.5" /> A partir de projeto
          </button>
        </div>

        {/* Project selection mode */}
        {mode === "project" && !selectedProject && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-1">Selecione um projeto concluído:</p>
            {MOCK_CONCLUDED_PROJECTS.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectProject(p)}
                className="w-full flex items-center justify-between gap-3 bg-muted/20 hover:bg-muted/40 border border-border/50 rounded-xl p-3.5 text-left transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.client} · {p.style} · {p.placement}</p>
                </div>
                <span className="text-xs font-bold text-primary shrink-0">R$ {p.value.toLocaleString("pt-BR")}</span>
              </button>
            ))}
          </div>
        )}

        {mode === "project" && selectedProject && (
          <div className="bg-primary/8 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-primary">Projeto selecionado</p>
              <p className="text-xs text-foreground mt-0.5">{selectedProject.title} — {selectedProject.client}</p>
            </div>
            <button onClick={() => { setSelectedProject(null); setForm(p => ({ ...p, title: "", artist: "", style: "", placement: "", duration: "", sessions: "1", value: "", description: "" })); }} className="text-muted-foreground hover:text-foreground">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Form fields */}
        {(mode === "manual" || selectedProject) && (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Título do trabalho *</Label>
              <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Nome do trabalho" className="h-9 text-sm bg-secondary/50" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Artista</Label>
                <Select value={form.artist} onValueChange={v => set("artist", v)}>
                  <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                  <SelectContent>{ARTISTS_GALLERY.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Estilo</Label>
                <Select value={form.style} onValueChange={v => set("style", v)}>
                  <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Estilo" /></SelectTrigger>
                  <SelectContent>{STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Placement / Área</Label>
              <Select value={form.placement} onValueChange={v => set("placement", v)}>
                <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Área do corpo" /></SelectTrigger>
                <SelectContent>{BODY_PARTS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Descrição</Label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Descreva o trabalho..." className="w-full h-16 bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Horas totais</Label>
                <Input type="number" value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="0" className="h-9 text-sm bg-secondary/50" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Sessões</Label>
                <Input type="number" value={form.sessions} onChange={e => set("sessions", e.target.value)} placeholder="1" className="h-9 text-sm bg-secondary/50" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Valor (R$)</Label>
                <Input type="number" value={form.value} onChange={e => set("value", e.target.value)} placeholder="0" className="h-9 text-sm bg-secondary/50" />
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Tags <span className="text-muted-foreground/50">(separadas por vírgula)</span></Label>
              <Input value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="Floral, Colorido, Grande..." className="h-9 text-sm bg-secondary/50" />
            </div>

            {/* Toggles */}
            <div className="flex gap-2">
              {[
                { key: "repeatable", icon: RefreshCw, labelOn: "Repetível", labelOff: "Repetível" },
                { key: "exclusive", icon: Star, labelOn: "Exclusivo", labelOff: "Exclusivo" },
                { key: "featured", icon: Star, labelOn: "Destaque", labelOff: "Destaque" },
              ].map(({ key, labelOn }) => (
                <button
                  key={key}
                  onClick={() => set(key, !form[key])}
                  className={cn(
                    "flex-1 py-2 rounded-lg border text-xs font-medium transition-all",
                    form[key] ? "bg-primary/15 border-primary/30 text-primary" : "border-border/50 text-muted-foreground hover:border-border"
                  )}
                >
                  {labelOn}
                </button>
              ))}
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
              <Button size="sm" onClick={handleSave} disabled={!form.title} className="bg-primary text-primary-foreground">
                Salvar Trabalho
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}