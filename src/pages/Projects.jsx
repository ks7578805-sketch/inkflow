import { useState, useMemo } from "react";
import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Search, Plus, FolderKanban, SlidersHorizontal, ChevronDown, X
} from "lucide-react";
import { MOCK_PROJECTS, STATUS_COLORS } from "@/data/projectsMock";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectDetail from "@/components/projects/ProjectDetail";
import NewProjectModal from "@/components/projects/NewProjectModal";

const FILTER_TABS = [
  { id: "Todos", label: "Todos" },
  { id: "Em andamento", label: "Em andamento" },
  { id: "Aguardando aprovação", label: "Aguardando aprovação" },
  { id: "Pendente", label: "Pendente" },
  { id: "Finalizado", label: "Finalizado" },
  { id: "Pausado", label: "Pausado" },
];

const SORT_OPTIONS = [
  { id: "recent", label: "Mais recentes" },
  { id: "value", label: "Maior valor" },
  { id: "progress", label: "Maior progresso" },
  { id: "sessions", label: "Mais sessões" },
];

export default function Projects() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [showModal, setShowModal] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const counts = useMemo(() => {
    const c = { Todos: projects.length };
    FILTER_TABS.slice(1).forEach((f) => {
      c[f.id] = projects.filter((p) => p.status === f.id).length;
    });
    return c;
  }, [projects]);

  const filtered = useMemo(() => {
    let list = projects;
    if (filter !== "Todos") list = list.filter((p) => p.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.artist?.toLowerCase().includes(q) ||
        p.style?.toLowerCase().includes(q) ||
        p.bodyPart?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sort === "value") list = [...list].sort((a, b) => (b.valueFinal || b.valueEstimated) - (a.valueFinal || a.valueEstimated));
    if (sort === "progress") list = [...list].sort((a, b) => b.progress - a.progress);
    if (sort === "sessions") list = [...list].sort((a, b) => b.sessions.done - a.sessions.done);
    return list;
  }, [projects, filter, search, sort]);

  const handleNewProject = (data) => {
    setProjects((prev) => [data, ...prev]);
  };

  // Detail view (full-width)
  if (selectedProject) {
    const project = projects.find((p) => p.id === selectedProject.id) || selectedProject;
    return (
      <div className="min-h-screen flex flex-col">
        <ProjectDetail
          project={project}
          onBack={() => setSelectedProject(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Projetos" subtitle="Central de casos e arquivo de tatuagens" />

      <div className="p-4 md:p-6 space-y-4">
        {/* Search + actions row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente, estilo, área..."
              className="pl-9 h-9 bg-secondary/50 border-border/50 text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5" onClick={() => setShowSortMenu(!showSortMenu)}>
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {SORT_OPTIONS.find(o => o.id === sort)?.label}
              <ChevronDown className="w-3 h-3 opacity-60" />
            </Button>
            {showSortMenu && (
              <div className="absolute right-0 top-10 z-50 bg-popover border border-border rounded-xl shadow-xl py-1 min-w-[160px]">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSort(opt.id); setShowSortMenu(false); }}
                    className={cn("w-full text-left px-3 py-2 text-xs hover:bg-muted/30 transition-colors",
                      sort === opt.id ? "text-primary font-semibold" : "text-foreground")}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" /> Novo projeto
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all border",
                filter === tab.id
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {tab.label}
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                filter === tab.id ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
              )}>
                {counts[tab.id] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {filtered.length === 0 ? "Nenhum projeto encontrado" : `${filtered.length} projeto${filtered.length !== 1 ? "s" : ""}`}
            {search && <span> para "<span className="text-foreground">{search}</span>"</span>}
          </p>
        </div>

        {/* Project grid */}
        {filtered.length === 0 ? (
          <EmptyState filter={filter} search={search} onNew={() => setShowModal(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                selected={selectedProject?.id === project.id}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}
      </div>

      <NewProjectModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleNewProject}
      />
    </div>
  );
}

function EmptyState({ filter, search, onNew }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
        <FolderKanban className="w-7 h-7 text-muted-foreground/40" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        {search ? "Nenhum resultado encontrado" : filter !== "Todos" ? `Nenhum projeto ${filter.toLowerCase()}` : "Nenhum projeto criado"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {search
          ? `Tente buscar por outro termo.`
          : filter !== "Todos"
            ? `Você não tem projetos com status "${filter}" ainda.`
            : "Comece criando o primeiro projeto do seu estúdio."}
      </p>
      {!search && (
        <Button size="sm" onClick={onNew} className="mt-5 bg-primary text-primary-foreground gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Novo projeto
        </Button>
      )}
    </div>
  );
}