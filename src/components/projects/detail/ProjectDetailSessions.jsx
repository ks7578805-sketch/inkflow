import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, CalendarDays, Plus, ChevronDown } from "lucide-react";

const STATUS_COLORS = {
  "Concluída": "bg-primary/10 text-primary",
  "Agendada": "bg-blue-500/10 text-blue-400",
  "Cancelada": "bg-destructive/10 text-destructive",
};

export default function ProjectDetailSessions({ project, sessions }) {
  const [expanded, setExpanded] = useState(null);
  const totalHours = sessions.filter(s => s.status === "Concluída").reduce((a, s) => a + s.duration, 0);

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Sessões do Projeto</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{totalHours}h acumuladas · {sessions.filter(s => s.status === "Concluída").length} sessões concluídas</p>
        </div>
        <Button size="sm" className="text-xs h-8 bg-primary text-primary-foreground gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Adicionar Sessão
        </Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Concluídas", value: sessions.filter(s => s.status === "Concluída").length, color: "text-primary" },
          { label: "Agendadas", value: sessions.filter(s => s.status === "Agendada").length, color: "text-blue-400" },
          { label: "Horas totais", value: `${totalHours}h`, color: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="bg-muted/20 rounded-xl p-3 border border-border/50 text-center">
            <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Session list */}
      <div className="space-y-2">
        {sessions.length === 0 ? (
          <div className="py-12 text-center">
            <CalendarDays className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma sessão registrada</p>
            <p className="text-xs text-muted-foreground mt-1">Clique em "Adicionar Sessão" para começar</p>
          </div>
        ) : sessions.map((session, i) => (
          <div key={session.id} className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center gap-3 p-4 hover:bg-muted/10 transition-colors"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className={cn("w-1.5 h-8 rounded-full shrink-0",
                session.status === "Concluída" ? "bg-primary" : session.status === "Agendada" ? "bg-blue-500" : "bg-muted")} />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">Sessão {i + 1}</p>
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", STATUS_COLORS[session.status] || "bg-muted text-muted-foreground")}>
                    {session.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{session.date}</span>
                  {session.duration > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{session.duration}h</span>}
                  {session.value > 0 && <span className="font-medium text-foreground/70">R$ {session.value.toLocaleString("pt-BR")}</span>}
                </div>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", expanded === i && "rotate-180")} />
            </button>

            {expanded === i && session.notes && (
              <div className="px-4 pb-4 border-t border-border/30 pt-3">
                <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Observações</p>
                <p className="text-xs text-foreground/80">{session.notes}</p>
                {session.materials.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1.5 font-semibold uppercase tracking-wider">Materiais</p>
                    <div className="flex flex-wrap gap-1">
                      {session.materials.map((m) => (
                        <span key={m} className="text-[10px] bg-muted/30 px-2 py-0.5 rounded text-muted-foreground border border-border/50">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}