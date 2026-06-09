import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Search, Plus, FolderKanban, SlidersHorizontal, ChevronDown, X,
} from "lucide-react";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectDetail from "@/components/projects/ProjectDetail";
import NewProjectModal from "@/components/projects/NewProjectModal";
import {
  createProject,
  getProject,
  listProjects,
  normalizeProject,
  PROJECT_STATUS_OPTIONS,
  updateProject,
} from "@/lib/projects";
import { listClients } from "@/lib/clients";

const FILTER_TABS = [
  { id: "Todos", label: "Todos" },
  ...PROJECT_STATUS_OPTIONS.filter((status) => status !== "Arquivado").map((status) => ({ id: status, label: status })),
];

const SORT_OPTIONS = [
  { id: "recent", label: "Mais recentes" },
  { id: "value", label: "Maior valor" },
  { id: "progress", label: "Maior progresso" },
  { id: "sessions", label: "Mais sessões" },
];

export default function Projects() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState(searchParams.get("project"));
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingProject, setEditingProject] = useState(null);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  const selectedProjectQuery = useQuery({
    queryKey: ["project", selectedId],
    queryFn: () => getProject(selectedId),
    enabled: Boolean(selectedId),
  });

  const clientsQuery = useQuery({
    queryKey: ["clients", "project-modal"],
    queryFn: () => listClients(),
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: ({ project }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(["project", project.id], { project });
      setSelectedId(project.id);
      setSearchParams({ project: project.id });
      setModalOpen(false);
      setEditingProject(null);
      toast({ title: "Projeto criado", description: `${project.name} foi salvo com sucesso.` });
    },
    onError: (error) => {
      toast({ title: "Erro ao criar projeto", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateProject(id, payload),
    onSuccess: ({ project }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(["project", project.id], { project });
      setSelectedId(project.id);
      setSearchParams({ project: project.id });
      setModalOpen(false);
      setEditingProject(null);
      toast({ title: "Projeto atualizado", description: `${project.name} foi atualizado.` });
    },
    onError: (error) => {
      toast({ title: "Erro ao atualizar projeto", description: error.message, variant: "destructive" });
    },
  });

  const projects = useMemo(
    () => (projectsQuery.data?.items ?? []).map(normalizeProject),
    [projectsQuery.data],
  );

  const selectedProject = useMemo(() => {
    if (selectedProjectQuery.data?.project) {
      return normalizeProject(selectedProjectQuery.data.project);
    }

    return projects.find((project) => project.id === selectedId) ?? null;
  }, [projects, selectedId, selectedProjectQuery.data]);

  const counts = useMemo(() => {
    const summary = { Todos: projects.length };
    FILTER_TABS.slice(1).forEach((item) => {
      summary[item.id] = projects.filter((project) => project.status === item.id).length;
    });
    return summary;
  }, [projects]);

  const filtered = useMemo(() => {
    let list = projects;

    if (filter !== "Todos") {
      list = list.filter((project) => project.status === filter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter((project) =>
        project.name.toLowerCase().includes(query)
        || project.client.toLowerCase().includes(query)
        || project.artist.toLowerCase().includes(query)
        || project.style.toLowerCase().includes(query)
        || project.bodyPart.toLowerCase().includes(query)
        || project.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (sort === "value") {
      list = [...list].sort((current, next) => (next.valueFinal || next.valueEstimated) - (current.valueFinal || current.valueEstimated));
    }

    if (sort === "progress") {
      list = [...list].sort((current, next) => next.progress - current.progress);
    }

    if (sort === "sessions") {
      list = [...list].sort((current, next) => next.sessions.done - current.sessions.done);
    }

    return list;
  }, [projects, filter, search, sort]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openCreateModal = () => {
    setModalMode("create");
    setEditingProject(null);
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setModalMode("edit");
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleModalSubmit = async (payload) => {
    if (modalMode === "edit" && editingProject) {
      await updateMutation.mutateAsync({ id: editingProject.id, payload });
      return;
    }

    await createMutation.mutateAsync(payload);
  };

  if (selectedId) {
    if (!selectedProject && selectedProjectQuery.isLoading) {
      return (
        <div className="min-h-screen flex flex-col">
          <Topbar title="Projetos" subtitle="Central de casos e arquivo de tatuagens" />
          <div className="p-6">
            <div className="h-72 rounded-2xl bg-muted/20 animate-pulse" />
          </div>
          <NewProjectModal
            open={modalOpen}
            onClose={() => {
              if (isSaving) return;
              setModalOpen(false);
              setEditingProject(null);
            }}
            onSubmit={handleModalSubmit}
            initialValues={editingProject}
            mode={modalMode}
            isPending={isSaving}
            clients={clientsQuery.data?.items ?? []}
          />
        </div>
      );
    }

    if (!selectedProject && selectedProjectQuery.isError) {
      return (
        <div className="min-h-screen flex flex-col">
          <Topbar title="Projetos" subtitle="Central de casos e arquivo de tatuagens" />
          <div className="p-6">
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
              <p className="text-sm font-medium text-foreground">Não foi possível carregar o projeto</p>
              <p className="text-xs text-muted-foreground mt-1">{selectedProjectQuery.error.message}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                setSelectedId(null);
                setSearchParams({});
              }}>
                Voltar
              </Button>
            </div>
          </div>
          <NewProjectModal
            open={modalOpen}
            onClose={() => {
              if (isSaving) return;
              setModalOpen(false);
              setEditingProject(null);
            }}
            onSubmit={handleModalSubmit}
            initialValues={editingProject}
            mode={modalMode}
            isPending={isSaving}
            clients={clientsQuery.data?.items ?? []}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col">
        <ProjectDetail
          project={selectedProject}
          onBack={() => {
            setSelectedId(null);
            setSearchParams({});
          }}
          onEdit={openEditModal}
        />

        <NewProjectModal
          open={modalOpen}
          onClose={() => {
            if (isSaving) return;
            setModalOpen(false);
            setEditingProject(null);
          }}
          onSubmit={handleModalSubmit}
          initialValues={editingProject}
          mode={modalMode}
          isPending={isSaving}
          clients={clientsQuery.data?.items ?? []}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Projetos" subtitle="Central de casos e arquivo de tatuagens" />

      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por cliente, estilo, área..."
              className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative">
            <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5" onClick={() => setShowSortMenu((current) => !current)}>
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {SORT_OPTIONS.find((option) => option.id === sort)?.label}
              <ChevronDown className="w-3 h-3 opacity-60" />
            </Button>
            {showSortMenu && (
              <div className="absolute right-0 top-10 z-50 bg-popover border border-border rounded-xl shadow-xl py-1 min-w-[160px]">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSort(option.id);
                      setShowSortMenu(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs hover:bg-muted/30 transition-colors",
                      sort === option.id ? "text-primary font-semibold" : "text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={openCreateModal}
            className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" /> Novo projeto
          </Button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all border",
                filter === tab.id
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-white/[0.03] text-white/45 border-white/[0.07] hover:bg-white/[0.06] hover:text-white/80",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                  filter === tab.id ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground",
                )}
              >
                {counts[tab.id] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {filtered.length === 0 ? "Nenhum projeto encontrado" : `${filtered.length} projeto${filtered.length !== 1 ? "s" : ""}`}
            {search && <span> para "<span className="text-foreground">{search}</span>"</span>}
          </p>
        </div>

        {projectsQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-56 rounded-xl bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : projectsQuery.isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-sm font-medium text-foreground">Não foi possível carregar os projetos</p>
            <p className="text-xs text-muted-foreground mt-1">{projectsQuery.error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} search={search} onNew={openCreateModal} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                selected={selectedId === project.id}
                onClick={() => setSelectedId(project.id)}
              />
            ))}
          </div>
        )}
      </div>

      <NewProjectModal
        open={modalOpen}
        onClose={() => {
          if (isSaving) return;
          setModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleModalSubmit}
        initialValues={editingProject}
        mode={modalMode}
        isPending={isSaving}
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
          ? "Tente buscar por outro termo."
          : filter !== "Todos"
            ? `Você não tem projetos com status \"${filter}\" ainda.`
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
