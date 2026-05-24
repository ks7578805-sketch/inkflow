import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TAG_COLORS } from "@/data/clientsMock";
import {
  X, Phone, Instagram, Mail, CalendarDays, Star, Pencil,
  HeartPulse, FileText, CalendarPlus, FolderOpen, DollarSign, Clock
} from "lucide-react";

export default function ClientDetailPanel({ client, onClose, onToggleVip }) {
  if (!client) return null;

  const initials = client.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full">
      {/* Close */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Perfil do Cliente</span>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Avatar + name */}
      <div className="text-center mb-4">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto">
            <span className="text-xl font-bold text-primary">{initials}</span>
          </div>
          {client.vip && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
              <Star className="w-2.5 h-2.5 text-white fill-white" />
            </div>
          )}
        </div>
        <p className="text-base font-bold text-foreground mt-2.5">{client.name}</p>
        {client.ig && <p className="text-xs text-muted-foreground mt-0.5">{client.ig}</p>}
        {/* Tags */}
        {client.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-center mt-2">
            {client.tags.map(tag => (
              <span key={tag} className={cn("text-[9px] px-2 py-0.5 rounded-full border font-semibold", TAG_COLORS[tag] || "bg-muted/30 text-muted-foreground border-border")}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-muted/20 border border-border/30 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-foreground">{client.sessions}</p>
          <p className="text-[10px] text-muted-foreground">Sessões</p>
        </div>
        <div className="bg-primary/8 border border-primary/15 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-primary">R$ {client.total.toLocaleString("pt-BR")}</p>
          <p className="text-[10px] text-muted-foreground">Total gasto</p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-0 mb-4 flex-1 overflow-y-auto">
        {[
          client.phone && { icon: Phone, label: "Telefone", value: client.phone },
          client.email && { icon: Mail, label: "Email", value: client.email },
          { icon: CalendarDays, label: "Próxima sessão", value: client.nextSession },
          { icon: Clock, label: "Última sessão", value: client.lastSession },
          client.artist && { icon: Pencil, label: "Artista", value: client.artist },
        ].filter(Boolean).map((item) => (
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
            <p className="text-xs text-foreground/80 leading-relaxed">{client.notes}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-border/20 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
            <CalendarPlus className="w-3 h-3" /> Nova Sessão
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
            <FolderOpen className="w-3 h-3" /> Projeto
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
            <FileText className="w-3 h-3" /> Documentos
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
            <HeartPulse className="w-3 h-3" /> Aftercare
          </Button>
        </div>
        <Button
          variant="outline" size="sm"
          onClick={() => onToggleVip(client.id)}
          className={cn(
            "w-full text-xs h-8 gap-1.5 transition-colors",
            client.vip
              ? "text-amber-400 border-amber-500/20 hover:border-amber-500/40"
              : "text-muted-foreground"
          )}
        >
          <Star className={cn("w-3 h-3", client.vip && "fill-amber-400")} />
          {client.vip ? "Remover VIP" : "Marcar como VIP"}
        </Button>
      </div>
    </div>
  );
}