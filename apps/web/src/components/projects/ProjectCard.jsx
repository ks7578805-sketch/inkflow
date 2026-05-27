import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Clock, Layers, User, MapPin, Zap } from "lucide-react";
import { STATUS_COLORS } from "@/lib/projects";

const BADGE_COLORS = {
  "Healing em andamento": "bg-teal-500/10 text-teal-400",
  "Aguardando aprovação": "bg-amber-500/10 text-amber-400",
  "Falta foto antes": "bg-rose-500/10 text-rose-400",
  "Materiais pendentes": "bg-orange-500/10 text-orange-400",
  "Retoque sugerido": "bg-violet-500/10 text-violet-400",
  "Falta stencil": "bg-blue-500/10 text-blue-400",
  "Falta foto final": "bg-rose-500/10 text-rose-400",
};

export default function ProjectCard({ project, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative bg-card border rounded-xl p-4 cursor-pointer transition-all duration-200",
        selected
          ? "border-primary/40 bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]"
          : "border-border/50 hover:border-border hover:bg-card/80",
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-muted/40 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-muted-foreground/40" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground leading-tight truncate">{project.name}</p>
            <span className={cn("shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border", STATUS_COLORS[project.status] || "bg-muted text-muted-foreground border-border")}>
              {project.status}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <User className="w-3 h-3" /> {project.client}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="w-3 h-3" /> {project.bodyPart}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-2.5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-muted-foreground">{project.style}</span>
          <span className="text-[10px] font-semibold text-primary">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1 bg-muted/30" />
      </div>

      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2.5">
        <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {project.sessions.done}/{project.sessions.total}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {project.hoursReal}h/{project.hoursEstimated}h</span>
        <span className="ml-auto font-semibold text-foreground/80">
          R$ {(project.valueFinal || project.valueEstimated).toLocaleString("pt-BR")}
        </span>
      </div>

      {project.badges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.badges.slice(0, 2).map((badge) => (
            <span key={badge} className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", BADGE_COLORS[badge] || "bg-muted text-muted-foreground")}>
              {badge}
            </span>
          ))}
          {project.badges.length > 2 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">+{project.badges.length - 2}</span>
          )}
        </div>
      )}
    </div>
  );
}
