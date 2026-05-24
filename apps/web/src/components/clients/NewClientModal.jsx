import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  instagram: "",
  notes: "",
};

function toFormValues(initialValues) {
  return {
    firstName: initialValues?.firstName ?? "",
    lastName: initialValues?.lastName ?? "",
    phone: initialValues?.phone ?? "",
    email: initialValues?.email ?? "",
    instagram: initialValues?.instagram ?? "",
    notes: initialValues?.notes ?? "",
  };
}

export default function NewClientModal({
  open,
  onClose,
  onSubmit,
  initialValues = null,
  mode = "create",
  isPending = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      setForm(toFormValues(initialValues));
    }
  }, [open, initialValues]);

  const title = mode === "edit" ? "Editar Cliente" : "Novo Cliente";
  const actionLabel = mode === "edit" ? "Salvar alterações" : "Criar Cliente";
  const isValid = useMemo(() => form.firstName.trim() && form.lastName.trim(), [form.firstName, form.lastName]);

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async () => {
    if (!isValid || isPending) {
      return;
    }

    const normalizeOptional = (value) => {
      const trimmed = value.trim();
      return trimmed ? trimmed : undefined;
    };

    await onSubmit({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: normalizeOptional(form.phone),
      email: normalizeOptional(form.email),
      instagram: normalizeOptional(form.instagram),
      notes: normalizeOptional(form.notes),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Nome *</Label>
              <Input
                value={form.firstName}
                onChange={(event) => setValue("firstName", event.target.value)}
                placeholder="Nome"
                className="h-9 text-sm bg-secondary/50"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Sobrenome *</Label>
              <Input
                value={form.lastName}
                onChange={(event) => setValue("lastName", event.target.value)}
                placeholder="Sobrenome"
                className="h-9 text-sm bg-secondary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Telefone</Label>
              <Input
                value={form.phone}
                onChange={(event) => setValue("phone", event.target.value)}
                placeholder="+55 11..."
                className="h-9 text-sm bg-secondary/50"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Instagram</Label>
              <Input
                value={form.instagram}
                onChange={(event) => setValue("instagram", event.target.value)}
                placeholder="@usuario"
                className="h-9 text-sm bg-secondary/50"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Email</Label>
            <Input
              value={form.email}
              onChange={(event) => setValue("email", event.target.value)}
              placeholder="email@..."
              className="h-9 text-sm bg-secondary/50"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Observações</Label>
            <textarea
              value={form.notes}
              onChange={(event) => setValue("notes", event.target.value)}
              placeholder="Preferências, restrições, contexto..."
              className="w-full h-24 bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex gap-2 justify-end pt-1">
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
