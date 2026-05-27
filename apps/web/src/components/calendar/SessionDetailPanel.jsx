import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SESSION_STATUS } from "@/data/calendarMock";
import { X, Clock, MapPin, DollarSign, User, Palette, Pencil, CalendarRange, CheckCircle, XCircle, ExternalLink, CalendarX } from "lucide-react";

export default function SessionDetailPanel({ session, onClose, onStatusChange, onEdit, onOpenProject, onUnschedule, isSaving = false }) {
  if (!session) return null;
  const st = SESSION_STATUS[session.status] || SESSION_STATUS["Confirmada"];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={cn("w-1 h-12 rounded-full", st.bar)} />
          <div>
            <h3 className="text-sm font-bold text-foreground">{session.client}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{session.type}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full border", st.color)}>
          {session.status}
        </span>
      </div>

      <div className="space-y-0 flex-1 overflow-y-auto">
        {[
          { icon: Clock, label: "Horário", value: `${session.time} – ${session.endTime} (${session.duration}h)` },
          { icon: User, label: "Artista", value: session.artistName },
          { icon: Palette, label: "Estilo", value: session.style },
          { icon: MapPin, label: "Placement", value: session.placement },
          { icon: DollarSign, label: "Valor", value: `R$ ${session.value?.toLocaleString("pt-BR")}` },
          { icon: DollarSign, label: "Depósito", value: session.deposit > 0 ? `R$ ${session.deposit.toLocaleString("pt-BR")}` : "Pendente" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 py-2.5 border-b border-border/20 last:border-0">
            <div className="w-7 h-7 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
              <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
              <span className="text-[11px] text-muted-foreground shrink-0">{item.label}</span>
              <span className="text-xs font-medium text-foreground text-right truncate">{item.value}</span>
            </div>
          </div>
        ))}

        {session.notes && (
          <div className="py-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Observações</p>
            <p className="text-xs text-foreground/80 leading-relaxed">{session.notes}</p>
          </div>
        )}
      </div>

      <div className="pt-4 space-y-2 border-t border-border/20 mt-2">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5" onClick={() => onEdit?.(session)} disabled={isSaving}>
            <Pencil className="w-3 h-3" /> Editar
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5 text-amber-400 hover:text-amber-300 border-amber-500/20 hover:border-amber-500/40" onClick={() => onEdit?.(session)} disabled={isSaving}>
            <CalendarRange className="w-3 h-3" /> Remarcar
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline" size="sm"
            className="text-xs h-8 gap-1.5 text-primary hover:text-primary/80 border-primary/20 hover:border-primary/40"
            onClick={() => onStatusChange?.(session.id, "Concluída")}
            disabled={isSaving}
          >
            <CheckCircle className="w-3 h-3" /> Concluir
          </Button>
          <Button
            variant="outline" size="sm"
            className="text-xs h-8 gap-1.5 text-destructive hover:text-destructive/80 border-destructive/20 hover:border-destructive/40"
            onClick={() => onStatusChange?.(session.id, "Cancelada")}
            disabled={isSaving}
          >
            <XCircle className="w-3 h-3" /> Cancelar
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5" onClick={() => onOpenProject?.(session.projectId)} disabled={isSaving}>
            <ExternalLink className="w-3 h-3" /> Abrir Projeto
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5 text-destructive hover:text-destructive/80 border-destructive/20 hover:border-destructive/40" onClick={() => onUnschedule?.(session.projectId)} disabled={isSaving}>
            <CalendarX className="w-3 h-3" /> Desagendar
          </Button>
        </div>
      </div>
    </div>
  );
}
