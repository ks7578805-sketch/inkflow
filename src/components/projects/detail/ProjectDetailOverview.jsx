import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, CalendarDays, Clock, DollarSign, Layers } from "lucide-react";

function KPI({ label, value, sub, accent }) {
  return (
    <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className={cn("text-xl font-bold", accent ? "text-primary" : "text-foreground")}>{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ProjectDetailOverview({ project, sessions }) {
  const totalHours = sessions.filter(s => s.status === "Concluída").reduce((a, s) => a + s.duration, 0);
  const saldo = (project.valueFinal || project.valueEstimated) - project.totalPaid;

  const timeline = sessions.map((s) => ({
    date: s.date,
    label: s.status === "Agendada" ? `Sessão agendada` : `Sessão concluída – ${s.duration}h`,
    done: s.status === "Concluída",
  }));

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Completeness bar */}
      <div className="bg-card border border-border/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold text-foreground">Projeto {project.completeness}% completo</span>
          <span className="text-xs text-primary font-bold">{project.completeness}%</span>
        </div>
        <Progress value={project.completeness} className="h-2 mb-4" />
        {project.completionItems.length > 0 && (
          <div>
            <p className="text-[11px] text-muted-foreground mb-2 uppercase tracking-wider">Pendências</p>
            <div className="flex flex-wrap gap-2">
              {project.completionItems.map((item) => (
                <span key={item} className="flex items-center gap-1 text-xs bg-muted/30 px-2.5 py-1 rounded-full text-muted-foreground border border-border/50">
                  <AlertCircle className="w-3 h-3 text-amber-400" /> {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Sessões" value={`${project.sessions.done}/${project.sessions.total}`} sub={`${project.sessions.total - project.sessions.done} restantes`} />
        <KPI label="Horas" value={`${totalHours}h`} sub={`de ${project.hoursEstimated}h est.`} />
        <KPI label="Total cobrado" value={`R$ ${(project.valueFinal || project.valueEstimated).toLocaleString("pt-BR")}`} sub="valor fechado" accent />
        <KPI label="Saldo" value={`R$ ${saldo.toLocaleString("pt-BR")}`} sub={`R$ ${project.totalPaid.toLocaleString("pt-BR")} recebido`} />
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          { label: "Cliente", value: project.client },
          { label: "Artista", value: project.artist },
          { label: "Estilo", value: project.style },
          { label: "Área do corpo", value: project.bodyPart },
          { label: "Criado em", value: project.createdAt },
          { label: "Próxima sessão", value: project.nextSession },
        ].map(({ label, value }) => (
          <div key={label} className="bg-muted/10 rounded-lg p-3 border border-border/30">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-sm font-medium text-foreground">{value || "—"}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {timeline.length > 0 && (
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Linha do tempo</h4>
          <div className="relative space-y-0">
            {timeline.map((step, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 last:pb-0 relative">
                <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 z-10 relative",
                  step.done ? "bg-primary" : "bg-muted border border-muted-foreground/30")} />
                {i < timeline.length - 1 && (
                  <div className="absolute left-[4px] top-4 bottom-0 w-px bg-border/50" />
                )}
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span className={cn("text-xs", step.done ? "text-foreground" : "text-muted-foreground")}>{step.label}</span>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">{step.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}