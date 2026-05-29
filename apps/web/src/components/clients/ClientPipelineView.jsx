import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, DollarSign } from "lucide-react";
import { listProjects } from "@/lib/projects";
import { updateClient } from "@/lib/clients";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const PIPELINE_STAGES = [
  { id: "Interesse",    label: "Interesse",    color: "#6b7280" },
  { id: "Agendado",     label: "Agendado",     color: "#3b82f6" },
  { id: "Em andamento", label: "Em andamento", color: "#1db884" },
  { id: "Concluído",   label: "Concluído",    color: "#06b6d4" },
  { id: "Pago",        label: "Pago",         color: "#10b981" },
];

function fullName(client) {
  return `${client.firstName} ${client.lastName}`.trim();
}

function initials(name) {
  return name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function formatMoney(cents) {
  if (!cents) return null;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function formatDate(value) {
  if (!value) return null;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(value));
}

export default function ClientPipelineView({ clients, onClientClick }) {
  const queryClient = useQueryClient();
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  const moveMutation = useMutation({
    mutationFn: ({ id, pipelineStatus }) => updateClient(id, { pipelineStatus }),
    onMutate: async ({ id, pipelineStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });
      const snapshots = queryClient.getQueriesData({ queryKey: ["clients"] });
      queryClient.setQueriesData({ queryKey: ["clients"] }, (old) => {
        if (!old?.items) return old;
        return { ...old, items: old.items.map((c) => c.id === id ? { ...c, pipelineStatus } : c) };
      });
      return { snapshots };
    },
    onError: (err, _, context) => {
      context?.snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast({ title: "Erro ao mover cliente", description: err.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const projects = projectsQuery.data?.items ?? [];

  const clientProjectsMap = {};
  for (const project of projects) {
    if (!project.clientId) continue;
    if (!clientProjectsMap[project.clientId]) {
      clientProjectsMap[project.clientId] = { nextSession: null, totalValue: 0 };
    }
    const entry = clientProjectsMap[project.clientId];
    entry.totalValue += project.valueFinal ?? project.valueEstimated ?? 0;
    if (project.nextSessionAt) {
      const d = new Date(project.nextSessionAt);
      if (d > new Date() && (!entry.nextSession || d < new Date(entry.nextSession))) {
        entry.nextSession = project.nextSessionAt;
      }
    }
  }

  const handleDragStart = (e, clientId) => {
    setDraggedId(clientId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stageId);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    if (draggedId) {
      const client = clients.find((c) => c.id === draggedId);
      if (client && (client.pipelineStatus ?? "Interesse") !== stageId) {
        moveMutation.mutate({ id: draggedId, pipelineStatus: stageId });
      }
    }
    setDraggedId(null);
    setDragOverStage(null);
  };

  return (
    <div className="flex gap-3 h-full overflow-x-auto pb-2 select-none">
      {PIPELINE_STAGES.map((stage) => {
        const stageClients = clients.filter((c) => (c.pipelineStatus ?? "Interesse") === stage.id);
        const isOver = dragOverStage === stage.id;

        return (
          <div
            key={stage.id}
            className={cn(
              "flex flex-col w-60 flex-shrink-0 rounded-xl border transition-colors duration-150",
              isOver ? "border-primary/50 bg-primary/5" : "border-border/40 bg-muted/10"
            )}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDrop={(e) => handleDrop(e, stage.id)}
            onDragLeave={handleDragLeave}
          >
            <div className="flex items-center gap-2 px-3 pt-3 pb-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
              <span className="text-xs font-semibold text-foreground/80 flex-1 truncate">{stage.label}</span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                style={{ backgroundColor: `${stage.color}22`, color: stage.color }}
              >
                {stageClients.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2 min-h-[100px]">
              {stageClients.map((client) => {
                const name = fullName(client);
                const info = clientProjectsMap[client.id];
                const isDragging = draggedId === client.id;

                return (
                  <div
                    key={client.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, client.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onClientClick?.(client.id)}
                    className={cn(
                      "bg-card border border-border/40 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all",
                      isDragging
                        ? "opacity-40 scale-95 shadow-none"
                        : "hover:border-primary/30 hover:shadow-sm hover:shadow-black/20"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${stage.color}33, ${stage.color}11)`,
                          color: stage.color,
                        }}
                      >
                        {initials(name)}
                      </div>
                      <p className="text-xs font-semibold text-foreground truncate">{name}</p>
                    </div>

                    {(info?.nextSession || info?.totalValue > 0) && (
                      <div className="space-y-1 mt-1">
                        {info?.nextSession && (
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <Calendar className="w-3 h-3 flex-shrink-0" style={{ color: stage.color }} />
                            <span>{formatDate(info.nextSession)}</span>
                          </div>
                        )}
                        {info?.totalValue > 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <DollarSign className="w-3 h-3 flex-shrink-0" style={{ color: stage.color }} />
                            <span>{formatMoney(info.totalValue)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {stageClients.length === 0 && (
                <div
                  className={cn(
                    "flex items-center justify-center h-16 rounded-lg border border-dashed text-[10px] transition-colors",
                    isOver
                      ? "border-primary/40 text-primary/50 bg-primary/5"
                      : "border-border/20 text-muted-foreground/40"
                  )}
                >
                  {isOver ? "Soltar aqui" : "Vazio"}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
