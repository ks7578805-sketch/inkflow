import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROJECT_STATUS_OPTIONS } from "@/lib/projects";

function getClientLabel(client) {
  return `${client.firstName} ${client.lastName}`.trim();
}

const MODES = [
  { id: "quick", icon: Zap, label: "Projeto Rápido", desc: "Campos mínimos — adicione detalhes depois" },
  { id: "full", icon: FileText, label: "Projeto Completo", desc: "Preencha todos os dados de uma vez" },
];

const STYLES = ["Japanese", "Realismo", "Geométrico", "Lettering", "Blackwork", "Fineline", "Aquarela", "Old School", "New School", "Neo Tradicional", "Tribal", "Pontilhismo"];
const BODY_PARTS = ["Braço inteiro", "Antebraço", "Bíceps", "Ombro", "Costas", "Peito", "Costela", "Perna", "Panturrilha", "Coxa", "Pescoço", "Mão", "Pé"];
const ARTISTS = ["Rafael Ink", "Marta Velez", "Camila Torres"];

const EMPTY_FORM = {
  name: "",
  clientId: "",
  artist: "",
  style: "",
  bodyPart: "",
  valueEstimated: "",
  status: "Pendente",
  notes: "",
};

function toFormValues(initialValues) {
  return {
    name: initialValues?.name ?? "",
    clientId: initialValues?.clientId ?? "",
    artist: initialValues?.artist && initialValues.artist !== "—" ? initialValues.artist : "",
    style: initialValues?.style && initialValues.style !== "—" ? initialValues.style : "",
    bodyPart: initialValues?.bodyPart && initialValues.bodyPart !== "—" ? initialValues.bodyPart : "",
    valueEstimated: initialValues?.valueEstimated ? String(initialValues.valueEstimated) : "",
    status: initialValues?.status ?? "Pendente",
    notes: initialValues?.notes ?? "",
  };
}

export default function NewProjectModal({
  open,
  onClose,
  onSubmit,
  initialValues = null,
  mode = "create",
  isPending = false,
  clients = [],
}) {
  const [viewMode, setViewMode] = useState("quick");
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      setViewMode(mode === "edit" ? "full" : "quick");
      setForm(toFormValues(initialValues));
    }
  }, [open, initialValues, mode]);

  const title = mode === "edit" ? "Editar Projeto" : "Novo Projeto";
  const actionLabel = mode === "edit" ? "Salvar alterações" : "Criar Projeto";
  const isValid = useMemo(() => form.name.trim() && form.clientId, [form.name, form.clientId]);

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async () => {
    if (!isValid || isPending) {
      return;
    }

    const normalizeOptional = (value) => {
      const trimmed = value.trim();
      return trimmed ? trimmed : undefined;
    };

    const estimatedValue = Number.parseInt(form.valueEstimated, 10);

    await onSubmit({
      name: form.name.trim(),
      clientId: form.clientId,
      artistName: normalizeOptional(form.artist),
      style: normalizeOptional(form.style),
      bodyPart: normalizeOptional(form.bodyPart),
      valueEstimated: Number.isFinite(estimatedValue) ? estimatedValue : 0,
      status: form.status,
      notes: normalizeOptional(form.notes),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 mb-2">
          {MODES.map((option) => (
            <button
              key={option.id}
              onClick={() => setViewMode(option.id)}
              className={cn(
                "flex items-start gap-2 p-3 rounded-lg border text-left transition-all",
                viewMode === option.id ? "border-primary/40 bg-primary/5" : "border-border/50 hover:border-border",
              )}
            >
              <option.icon className={cn("w-4 h-4 mt-0.5 shrink-0", viewMode === option.id ? "text-primary" : "text-muted-foreground")} />
              <div>
                <p className="text-xs font-semibold text-foreground">{option.label}</p>
                <p className="text-[10px] text-muted-foreground">{option.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Nome do projeto *</Label>
              <Input value={form.name} onChange={(event) => setValue("name", event.target.value)} placeholder="ex: Sleeve Oriental" className="h-9 text-sm bg-secondary/50" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Cliente *</Label>
              <Select value={form.clientId} onValueChange={(value) => setValue("clientId", value)}>
                <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecionar cliente" /></SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>{getClientLabel(client)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Artista</Label>
              <Select value={form.artist} onValueChange={(value) => setValue("artist", value)}>
                <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{ARTISTS.map((artist) => <SelectItem key={artist} value={artist}>{artist}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Estilo</Label>
              <Select value={form.style} onValueChange={(value) => setValue("style", value)}>
                <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{STYLES.map((style) => <SelectItem key={style} value={style}>{style}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {(viewMode === "full" || mode === "edit") && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Área do corpo</Label>
                  <Select value={form.bodyPart} onValueChange={(value) => setValue("bodyPart", value)}>
                    <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>{BODY_PARTS.map((bodyPart) => <SelectItem key={bodyPart} value={bodyPart}>{bodyPart}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Valor estimado (R$)</Label>
                  <Input type="number" min="0" value={form.valueEstimated} onChange={(event) => setValue("valueEstimated", event.target.value)} placeholder="0,00" className="h-9 text-sm bg-secondary/50" />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Status</Label>
                <Select value={form.status} onValueChange={(value) => setValue("status", value)}>
                  <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                  <SelectContent>{PROJECT_STATUS_OPTIONS.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Notas</Label>
                <textarea
                  value={form.notes}
                  onChange={(event) => setValue("notes", event.target.value)}
                  placeholder="Observações do projeto, combinações e próximos passos..."
                  className="w-full h-24 bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                />
              </div>
            </>
          )}

          <div className="pt-1 flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isPending}>Cancelar</Button>
            <Button size="sm" onClick={handleSubmit} disabled={!isValid || isPending} className="bg-primary text-primary-foreground">
              {isPending ? "Salvando..." : actionLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
