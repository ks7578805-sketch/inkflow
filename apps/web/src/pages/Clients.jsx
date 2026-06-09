import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Users, LayoutList, Kanban } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import ClientDetailPanel from "@/components/clients/ClientDetailPanel";
import ClientPipelineView from "@/components/clients/ClientPipelineView";
import NewClientModal from "@/components/clients/NewClientModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient, deleteClient, getClient, listClients, updateClient } from "@/lib/clients";
import { toast } from "@/components/ui/use-toast";

function fullName(client) {
  return `${client.firstName} ${client.lastName}`.trim();
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function Clients() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [view, setView] = useState("list");

  const clientsQuery = useQuery({
    queryKey: ["clients", search.trim()],
    queryFn: () => listClients(search),
  });

  const selectedClientQuery = useQuery({
    queryKey: ["client", selectedId],
    queryFn: () => getClient(selectedId),
    enabled: Boolean(selectedId),
  });

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: ({ client }) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.setQueryData(["client", client.id], { client });
      setSelectedId(client.id);
      setModalOpen(false);
      setEditingClient(null);
      toast({ title: "Cliente criado", description: `${fullName(client)} foi salvo com sucesso.` });
    },
    onError: (error) => {
      toast({ title: "Erro ao criar cliente", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateClient(id, payload),
    onSuccess: ({ client }) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.setQueryData(["client", client.id], { client });
      setSelectedId(client.id);
      setModalOpen(false);
      setEditingClient(null);
      toast({ title: "Cliente atualizado", description: `${fullName(client)} foi atualizado.` });
    },
    onError: (error) => {
      toast({ title: "Erro ao atualizar cliente", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => deleteClient(id),
    onSuccess: ({ client }) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.removeQueries({ queryKey: ["client", client.id] });
      setSelectedId((current) => (current === client.id ? null : current));
      setEditingClient((current) => (current?.id === client.id ? null : current));
      setModalOpen(false);
      toast({ title: "Cliente excluído", description: `${fullName(client)} foi removido.` });
    },
    onError: (error) => {
      toast({ title: "Erro ao excluir cliente", description: error.message, variant: "destructive" });
    },
  });

  const clients = clientsQuery.data?.items ?? [];
  const selectedClient = selectedClientQuery.data?.client ?? clients.find((client) => client.id === selectedId) ?? null;

  const summary = useMemo(() => {
    const total = clients.length;
    const withEmail = clients.filter((client) => client.email).length;
    const withPhone = clients.filter((client) => client.phone).length;
    return [
      { id: "all", label: "Todos", value: total },
      { id: "email", label: "Com email", value: withEmail },
      { id: "phone", label: "Com telefone", value: withPhone },
    ];
  }, [clients]);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const openCreateModal = () => {
    setModalMode("create");
    setEditingClient(null);
    setModalOpen(true);
  };

  const openEditModal = (client) => {
    setModalMode("edit");
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleModalSubmit = async (payload) => {
    if (modalMode === "edit" && editingClient) {
      await updateMutation.mutateAsync({ id: editingClient.id, payload });
      return;
    }

    await createMutation.mutateAsync(payload);
  };

  const handleDeleteClient = async (client) => {
    await deleteMutation.mutateAsync({ id: client.id });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar title="Clientes" subtitle="CRM do estúdio" />

      <div className="flex-1 flex flex-col p-3 md:p-5 gap-4 min-h-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, email ou telefone..."
              className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-sm"
            />
          </div>
          <div className="flex items-center gap-1 border border-border/50 rounded-lg p-0.5 bg-muted/20">
            <button
              onClick={() => setView("list")}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
              title="Visualização em lista"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("pipeline")}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                view === "pipeline" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
              title="Visualização em pipeline"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>
          <Button
            size="sm"
            onClick={openCreateModal}
            className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Cliente</span>
          </Button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {summary.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border bg-muted/20 text-muted-foreground border-border/50"
            >
              {item.label}
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center bg-muted/50 text-muted-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {view === "pipeline" && (
          <div className="flex-1 min-h-0" style={{ height: "calc(100vh - 220px)" }}>
            <ClientPipelineView
              clients={clients}
              onClientClick={(id) => {
                setView("list");
                setSelectedId(id);
              }}
            />
          </div>
        )}

        <div className={cn("flex gap-4 min-h-0", view === "pipeline" ? "hidden" : "flex-1")} style={{ height: "calc(100vh - 250px)" }}>
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="hidden md:flex flex-col flex-1 glass-card rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[2fr_1.5fr_140px] gap-0 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
                {["Cliente", "Contato", "Atualizado"].map((header) => (
                  <div key={header} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{header}</div>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto">
                {clientsQuery.isLoading ? (
                  <div className="space-y-2 p-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="h-16 rounded-xl bg-muted/20 animate-pulse" />
                    ))}
                  </div>
                ) : clientsQuery.isError ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                    <div className="w-10 h-10 rounded-2xl bg-destructive/10 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-destructive/60" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Não foi possível carregar os clientes</p>
                    <p className="text-xs text-muted-foreground mt-1">{clientsQuery.error.message}</p>
                  </div>
                ) : clients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="w-10 h-10 rounded-2xl bg-muted/30 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {search.trim() ? "Nenhum resultado encontrado" : "Nenhum cliente cadastrado"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {search.trim() ? `Busca por "${search}"` : "Crie o primeiro cliente do estúdio"}
                    </p>
                  </div>
                ) : clients.map((client) => {
                  const name = fullName(client);
                  return (
                    <div
                      key={client.id}
                      onClick={() => setSelectedId(client.id)}
                      className={cn(
                        "grid grid-cols-[2fr_1.5fr_140px] gap-0 items-center px-4 py-3 border-b border-border/15 last:border-0 cursor-pointer transition-all",
                        selectedId === client.id ? "bg-primary/[0.08] border-l-2 border-l-primary" : "hover:bg-white/[0.03]"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-primary">{initials(name)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{client.instagram || "Sem Instagram"}</p>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-foreground/80 truncate">{client.phone || "Sem telefone"}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{client.email || "Sem email"}</p>
                      </div>

                      <div className="text-xs text-muted-foreground">{formatDate(client.updatedAt)}</div>
                    </div>
                  );
                })}
              </div>

              <div className="px-4 py-2 border-t border-border/20 bg-muted/10">
                <p className="text-[11px] text-muted-foreground">{clients.length} cliente{clients.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="md:hidden flex-1 overflow-y-auto space-y-2">
              {clientsQuery.isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-24 rounded-xl bg-muted/20 animate-pulse" />
                ))
              ) : clientsQuery.isError ? (
                <div className="flex flex-col items-center justify-center h-48 text-center bg-card border border-border/50 rounded-xl px-6">
                  <Users className="w-8 h-8 text-destructive/40 mb-2" />
                  <p className="text-sm text-foreground">Não foi possível carregar os clientes</p>
                  <p className="text-xs text-muted-foreground mt-1">{clientsQuery.error.message}</p>
                </div>
              ) : clients.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center bg-card border border-border/50 rounded-xl">
                  <Users className="w-8 h-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">{search.trim() ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}</p>
                </div>
              ) : clients.map((client) => {
                const name = fullName(client);
                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedId(client.id)}
                    className={cn(
                      "bg-card border rounded-xl p-3.5 cursor-pointer transition-all active:scale-[0.99]",
                      selectedId === client.id ? "border-primary/40 bg-primary/5" : "border-border/50 hover:border-border"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{initials(name)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{client.instagram || client.email || "Sem contato digital"}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[11px] text-muted-foreground">Atualizado</p>
                        <p className="text-[10px] text-muted-foreground">{formatDate(client.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedId && (
            <div className="hidden md:flex w-72 lg:w-80 flex-shrink-0 flex-col bg-card border border-border/50 rounded-xl p-5 overflow-y-auto">
              {selectedClientQuery.isLoading && !selectedClient ? (
                <div className="h-full rounded-xl bg-muted/20 animate-pulse" />
              ) : (
                <ClientDetailPanel
                  client={selectedClient}
                  onClose={() => setSelectedId(null)}
                  onEdit={openEditModal}
                  onDelete={handleDeleteClient}
                  isDeleting={isDeleting}
                />
              )}
            </div>
          )}
        </div>


      </div>

      {selectedId && selectedClient && (
        <div className="fixed md:hidden inset-x-0 bottom-0 z-50 bg-card border-t border-border rounded-t-2xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="w-10 h-1 bg-muted-foreground/20 rounded-full mx-auto mb-4" />
          <ClientDetailPanel
            client={selectedClient}
            onClose={() => setSelectedId(null)}
            onEdit={openEditModal}
            onDelete={handleDeleteClient}
            isDeleting={isDeleting}
          />
        </div>
      )}

      <NewClientModal
        open={modalOpen}
        onClose={() => {
          if (isSaving) return;
          setModalOpen(false);
          setEditingClient(null);
        }}
        onSubmit={handleModalSubmit}
        initialValues={editingClient}
        mode={modalMode}
        isPending={isSaving}
      />
    </div>
  );
}
