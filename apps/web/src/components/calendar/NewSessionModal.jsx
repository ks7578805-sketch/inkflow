import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CALENDAR_SESSION_STATUS_OPTIONS } from "@/lib/projects";
import { buildSessionPayload } from "@/lib/sessions";

const EMPTY_FORM = {
  projectId: "",
  date: format(new Date(), "yyyy-MM-dd"),
  time: "09:00",
  endTime: "12:00",
  status: "Confirmada",
  notes: "",
};

function buildInitialForm({ defaultDate, initialSession }) {
  if (initialSession) {
    return {
      projectId: initialSession.projectId,
      date: initialSession.date,
      time: initialSession.time,
      endTime: initialSession.endTime,
      status: initialSession.status || "Confirmada",
      notes: initialSession.notes || "",
    };
  }

  return {
    ...EMPTY_FORM,
    date: format(defaultDate || new Date(), "yyyy-MM-dd"),
  };
}

export default function NewSessionModal({
  open,
  onClose,
  onSave,
  defaultDate,
  projects,
  initialSession = null,
  isPending = false,
}) {
  const [form, setForm] = useState(() => buildInitialForm({ defaultDate, initialSession }));

  useEffect(() => {
    if (open) {
      setForm(buildInitialForm({ defaultDate, initialSession }));
    }
  }, [open, defaultDate, initialSession]);

  const availableProjects = useMemo(() => projects, [projects]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === form.projectId) ?? null,
    [projects, form.projectId],
  );

  const isValid = Boolean(form.projectId && form.date && form.time && form.endTime);
  const title = initialSession ? "Editar Sessão" : "Nova Sessão";
  const actionLabel = initialSession ? "Salvar alterações" : "Agendar sessão";

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    if (!isValid || isPending) {
      return;
    }

    await onSave({
      sessionId: initialSession?.id,
      payload: buildSessionPayload({
        projectId: form.projectId,
        date: form.date,
        time: form.time,
        endTime: form.endTime,
        status: form.status,
        notes: form.notes,
      }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-1">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Projeto *</Label>
            <Select value={form.projectId} onValueChange={(value) => setValue("projectId", value)} disabled={Boolean(initialSession)}>
              <SelectTrigger className="h-9 text-sm bg-secondary/50">
                <SelectValue placeholder={availableProjects.length === 0 ? "Nenhum projeto disponível" : "Selecionar projeto"} />
              </SelectTrigger>
              <SelectContent>
                {availableProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} — {project.clientName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProject && (
            <div className="rounded-xl border border-border/50 bg-secondary/30 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-foreground">{selectedProject.name}</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                <span>Cliente: {selectedProject.clientName}</span>
                <span>Artista: {selectedProject.artistName || "—"}</span>
                <span>Estilo: {selectedProject.style || "—"}</span>
                <span>Área: {selectedProject.bodyPart || "—"}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Data</Label>
              <Input type="date" value={form.date} onChange={(event) => setValue("date", event.target.value)} className="h-9 text-sm bg-secondary/50" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Início</Label>
              <Input type="time" value={form.time} onChange={(event) => setValue("time", event.target.value)} className="h-9 text-sm bg-secondary/50" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Término</Label>
              <Input type="time" value={form.endTime} onChange={(event) => setValue("endTime", event.target.value)} className="h-9 text-sm bg-secondary/50" />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Status</Label>
            <Select value={form.status} onValueChange={(value) => setValue("status", value)}>
              <SelectTrigger className="h-9 text-sm bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CALENDAR_SESSION_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Observações</Label>
            <textarea
              value={form.notes}
              onChange={(event) => setValue("notes", event.target.value)}
              placeholder="Notas da sessão..."
              className="w-full h-20 bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          {!initialSession && availableProjects.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Todos os projetos atuais já têm sessão agendada. Edite uma sessão existente para remarcar.
            </p>
          )}

          <div className="flex gap-2 justify-end pt-1">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isPending}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} disabled={!isValid || isPending || (!initialSession && availableProjects.length === 0)} className="bg-primary text-primary-foreground">
              {isPending ? "Salvando..." : actionLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
