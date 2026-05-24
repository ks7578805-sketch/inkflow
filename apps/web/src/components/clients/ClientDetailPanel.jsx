import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Mail, Pencil, Phone, User, X, Instagram, CalendarDays, Trash2 } from "lucide-react";

function formatDate(value) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function ClientDetailPanel({ client, onClose, onEdit, onDelete, isDeleting = false }) {
  if (!client) return null;

  const fullName = `${client.firstName} ${client.lastName}`.trim();
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const createdAt = formatDate(client.createdAt);
  const updatedAt = formatDate(client.updatedAt);

  const items = [
    client.phone ? { icon: Phone, label: "Telefone", value: client.phone } : null,
    client.email ? { icon: Mail, label: "Email", value: client.email } : null,
    client.instagram ? { icon: Instagram, label: "Instagram", value: client.instagram } : null,
    createdAt ? { icon: CalendarDays, label: "Criado em", value: createdAt } : null,
    updatedAt ? { icon: Pencil, label: "Atualizado em", value: updatedAt } : null,
  ].filter(Boolean);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Perfil do Cliente</span>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center mb-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto">
          <span className="text-xl font-bold text-primary">{initials}</span>
        </div>
        <p className="text-base font-bold text-foreground mt-2.5">{fullName}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{client.email || client.phone || "Sem contato principal"}</p>
      </div>

      <div className="space-y-0 mb-4 flex-1 overflow-y-auto">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 py-2 border-b border-border/15 last:border-0">
            <div className="w-7 h-7 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
              <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
              <span className="text-[11px] text-muted-foreground shrink-0">{item.label}</span>
              <span className="text-xs font-medium text-foreground truncate text-right">{item.value}</span>
            </div>
          </div>
        ))}

        {client.notes && (
          <div className="pt-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Observações</p>
            <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{client.notes}</p>
          </div>
        )}

        {!items.length && !client.notes && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <User className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum detalhe adicional cadastrado</p>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border/20 space-y-2">
        <Button size="sm" onClick={() => onEdit(client)} className="w-full text-xs h-8 gap-1.5 bg-primary text-primary-foreground">
          <Pencil className="w-3 h-3" /> Editar cliente
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs h-8 gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={isDeleting}
            >
              <Trash2 className="w-3 h-3" /> {isDeleting ? "Excluindo..." : "Excluir cliente"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação removerá {fullName} da base do estúdio e não poderá ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(client)}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
