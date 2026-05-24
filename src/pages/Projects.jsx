import Topbar from "@/components/layout/Topbar";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FolderKanban, Search, Plus, Clock, DollarSign, Layers,
  ChevronRight, User, CalendarDays
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const projects = [
  {
    id: 1, name: "Sleeve Oriental – Lucas M.", client: "Lucas Mendes", status: "Em andamento",
    progress: 65, sessions: { done: 4, total: 6 }, budget: "R$ 4.800", style: "Japanese",
    nextSession: "28 Mai", lastUpdate: "Há 2 dias"
  },
  {
    id: 2, name: "Backpiece Realismo – Ana B.", client: "Ana Beatriz", status: "Aguardando aprovação",
    progress: 20, sessions: { done: 1, total: 8 }, budget: "R$ 12.000", style: "Realismo",
    nextSession: "02 Jun", lastUpdate: "Há 5 dias"
  },
  {
    id: 3, name: "Geométrico Braço – Pedro O.", client: "Pedro Oliveira", status: "Em andamento",
    progress: 40, sessions: { done: 2, total: 5 }, budget: "R$ 3.500", style: "Geométrico",
    nextSession: "30 Mai", lastUpdate: "Ontem"
  },
  {
    id: 4, name: "Lettering Costela – Marina S.", client: "Marina Santos", status: "Finalizado",
    progress: 100, sessions: { done: 2, total: 2 }, budget: "R$ 1.200", style: "Lettering",
    nextSession: "—", lastUpdate: "Há 1 semana"
  },
  {
    id: 5, name: "Blackwork Perna – Ricardo L.", client: "Ricardo Lima", status: "Pausado",
    progress: 30, sessions: { done: 2, total: 7 }, budget: "R$ 5.600", style: "Blackwork",
    nextSession: "A definir", lastUpdate: "Há 3 semanas"
  },
];

const statusVariant = {
  "Em andamento": "info",
  "Aguardando aprovação": "warning",
  "Finalizado": "success",
  "Pausado": "neutral",
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen">
      <Topbar title="Projetos" subtitle="Gerencie projetos e sessões" />

      <div className="p-6 flex gap-6 h-[calc(100vh-64px)]">
        {/* List */}
        <div className="w-[420px] flex-shrink-0 space-y-4 overflow-y-auto pb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar projetos..." className="pl-9 h-9 bg-secondary/50 text-sm" />
            </div>
            <Button size="sm" className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
              <Plus className="w-4 h-4" /> Novo
            </Button>
          </div>

          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-muted/30 w-full grid grid-cols-4 h-9">
              <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
              <TabsTrigger value="active" className="text-xs">Ativos</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">Pendentes</TabsTrigger>
              <TabsTrigger value="done" className="text-xs">Finalizados</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  "bg-card border rounded-xl p-4 cursor-pointer transition-all",
                  selectedProject?.id === project.id
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 hover:border-border"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{project.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{project.style}</p>
                  </div>
                  <StatusBadge label={project.status} variant={statusVariant[project.status]} />
                </div>
                <Progress value={project.progress} className="h-1.5 mb-2" />
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {project.sessions.done}/{project.sessions.total} sessões</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {project.budget}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {project.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        {selectedProject && (
          <div className="flex-1 bg-card border border-border/50 rounded-xl p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedProject.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> {selectedProject.client}
                  </span>
                  <StatusBadge label={selectedProject.status} variant={statusVariant[selectedProject.status]} />
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs">Editar Projeto</Button>
            </div>

            {/* Progress */}
            <div className="bg-muted/20 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progresso Geral</span>
                <span className="text-lg font-bold text-primary">{selectedProject.progress}%</span>
              </div>
              <Progress value={selectedProject.progress} className="h-2.5 mb-3" />
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{selectedProject.sessions.done}</p>
                  <p className="text-[11px] text-muted-foreground">Sessões feitas</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{selectedProject.sessions.total - selectedProject.sessions.done}</p>
                  <p className="text-[11px] text-muted-foreground">Restantes</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{selectedProject.budget}</p>
                  <p className="text-[11px] text-muted-foreground">Orçamento total</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Timeline do Projeto</h3>
              <div className="space-y-3">
                {[
                  { date: "15 Abr", label: "Briefing e referências", done: true },
                  { date: "20 Abr", label: "Stencil aprovado", done: true },
                  { date: "28 Abr", label: "Sessão 1 – Outline", done: true },
                  { date: "10 Mai", label: "Sessão 2 – Shading base", done: selectedProject.progress > 40 },
                  { date: "28 Mai", label: "Sessão 3 – Detalhes", done: false },
                  { date: "15 Jun", label: "Sessão final – Acabamento", done: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                      step.done ? "bg-primary" : "bg-muted-foreground/30"
                    )} />
                    <div className="flex-1 flex items-center justify-between">
                      <span className={cn("text-xs", step.done ? "text-foreground" : "text-muted-foreground")}>{step.label}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Session */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Próxima Sessão</span>
              </div>
              <p className="text-sm text-foreground font-medium">{selectedProject.nextSession}</p>
              <p className="text-xs text-muted-foreground mt-1">Detalhes e shading – Sessão {selectedProject.sessions.done + 1}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}