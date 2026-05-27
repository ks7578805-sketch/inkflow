import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/projects";
import {
  ArrowLeft, User, MapPin, Palette, Clock, DollarSign,
  CalendarDays, Image, Heart, StickyNote, Zap,
} from "lucide-react";
import ProjectDetailOverview from "./detail/ProjectDetailOverview";
import ProjectDetailSessions from "./detail/ProjectDetailSessions";
import ProjectDetailMedia from "./detail/ProjectDetailMedia";
import ProjectDetailFinance from "./detail/ProjectDetailFinance";
import ProjectDetailNotes from "./detail/ProjectDetailNotes";

const TABS = [
  { id: "overview", label: "Overview", icon: Zap },
  { id: "sessions", label: "Sessões", icon: CalendarDays },
  { id: "media", label: "Mídia", icon: Image },
  { id: "finance", label: "Financeiro", icon: DollarSign },
  { id: "healing", label: "Healing", icon: Heart },
  { id: "notes", label: "Notas", icon: StickyNote },
];

export default function ProjectDetail({ project, onBack, onEdit }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 bg-card border-b border-border px-6 pt-5 pb-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para projetos
        </button>

        <div className="flex items-start gap-4 mb-4">
          {project.thumbnail ? (
            <img src={project.thumbnail} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-muted/40 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-muted-foreground/40" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-foreground">{project.name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><User className="w-3.5 h-3.5" />{project.client}</span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Palette className="w-3.5 h-3.5" />{project.style}</span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="w-3.5 h-3.5" />{project.bodyPart}</span>
                  <span className={cn("text-[11px] font-semibold px-2.5 py-0.5 rounded-full border", STATUS_COLORS[project.status])}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => onEdit(project)}>Editar</Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs">
                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Próxima:</span>
                <span className="font-semibold text-foreground">{project.nextSession}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-semibold text-foreground">{project.hoursReal}h</span>
                <span className="text-muted-foreground">/ {project.hoursEstimated}h est.</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-semibold text-foreground">R$ {project.totalPaid.toLocaleString("pt-BR")}</span>
                <span className="text-muted-foreground">/ R$ {(project.valueFinal || project.valueEstimated).toLocaleString("pt-BR")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "overview" && <ProjectDetailOverview project={project} />}
        {activeTab === "sessions" && <ProjectDetailSessions project={project} />}
        {activeTab === "media" && <ProjectDetailMedia project={project} />}
        {activeTab === "finance" && <ProjectDetailFinance project={project} />}
        {activeTab === "healing" && <ProjectDetailHealing />}
        {activeTab === "notes" && <ProjectDetailNotes project={project} />}
      </div>
    </div>
  );
}

function ProjectDetailHealing() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Acompanhamento de Healing</h3>
      </div>

      <div className="p-5 rounded-xl border border-border/50 bg-card text-center">
        <Heart className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground">Sem check-ins registrados</p>
        <p className="text-xs text-muted-foreground mt-1">
          O acompanhamento de healing ainda não foi migrado para a stack real deste slice.
        </p>
      </div>
    </div>
  );
}
