import { Progress } from "@/components/ui/progress";

function KPI({ label, value, sub, accent }) {
  return (
    <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className={accent ? "text-xl font-bold text-primary" : "text-xl font-bold text-foreground"}>{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ProjectDetailOverview({ project }) {
  const totalHours = project.hoursReal;
  const saldo = (project.valueFinal || project.valueEstimated) - project.totalPaid;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-card border border-border/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold text-foreground">Projeto {project.completeness}% completo</span>
          <span className="text-xs text-primary font-bold">{project.completeness}%</span>
        </div>
        <Progress value={project.completeness} className="h-2 mb-4" />
        <p className="text-xs text-muted-foreground">
          Os indicadores detalhados de pendências ainda não fazem parte desta migração.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Sessões" value={`${project.sessions.done}/${project.sessions.total}`} sub={`${Math.max(project.sessions.total - project.sessions.done, 0)} restantes`} />
        <KPI label="Horas" value={`${totalHours}h`} sub={`de ${project.hoursEstimated}h est.`} />
        <KPI label="Total cobrado" value={`R$ ${(project.valueFinal || project.valueEstimated).toLocaleString("pt-BR")}`} sub="valor fechado" accent />
        <KPI label="Saldo" value={`R$ ${saldo.toLocaleString("pt-BR")}`} sub={`R$ ${project.totalPaid.toLocaleString("pt-BR")} recebido`} />
      </div>

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
    </div>
  );
}
