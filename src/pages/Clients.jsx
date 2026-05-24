import { useState, useMemo } from "react";
import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_CLIENTS, FILTERS, applyFilter, TAG_COLORS } from "@/data/clientsMock";
import ClientDetailPanel from "@/components/clients/ClientDetailPanel";
import NewClientModal from "@/components/clients/NewClientModal";

export default function Clients() {
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    let list = applyFilter(clients, filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.ig?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.artist?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [clients, filter, search]);

  const handleNewClient = (data) => {
    setClients(prev => [data, ...prev]);
    setSelected(data);
  };

  const handleToggleVip = (id) => {
    setClients(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newVip = !c.vip;
      return {
        ...c, vip: newVip,
        tags: newVip
          ? [...c.tags.filter(t => t !== "VIP"), "VIP"]
          : c.tags.filter(t => t !== "VIP"),
      };
    }));
    setSelected(prev => {
      if (!prev || prev.id !== id) return prev;
      const newVip = !prev.vip;
      return {
        ...prev, vip: newVip,
        tags: newVip
          ? [...prev.tags.filter(t => t !== "VIP"), "VIP"]
          : prev.tags.filter(t => t !== "VIP"),
      };
    });
  };

  const initials = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar title="Clientes" subtitle="CRM do estúdio" />

      <div className="flex-1 flex flex-col p-3 md:p-5 gap-4 min-h-0">
        {/* Search + actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, @instagram, telefone..."
              className="pl-9 h-9 bg-secondary/50 border-border/50 text-sm"
            />
          </div>
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Cliente</span>
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {FILTERS.map((f) => {
            const count = applyFilter(clients, f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border",
                  filter === f.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/20 text-muted-foreground border-border/50 hover:bg-muted/30 hover:text-foreground"
                )}
              >
                {f.label}
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                  filter === f.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <div className="flex-1 flex gap-4 min-h-0" style={{ height: "calc(100vh - 250px)" }}>
          {/* Client list */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:flex flex-col flex-1 bg-card border border-border/50 rounded-xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[2fr_1.5fr_80px_100px_120px_140px] gap-0 border-b border-border/30 bg-muted/20 px-4 py-2.5">
                {["Cliente", "Contato", "Sessões", "Total", "Próxima Sessão", "Status"].map(h => (
                  <div key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</div>
                ))}
              </div>

              {/* Rows */}
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="w-10 h-10 rounded-2xl bg-muted/30 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {search ? "Nenhum resultado encontrado" : "Nenhum cliente neste filtro"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {search ? `Busca por "${search}"` : "Tente outro filtro"}
                    </p>
                  </div>
                ) : filtered.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelected(client)}
                    className={cn(
                      "grid grid-cols-[2fr_1.5fr_80px_100px_120px_140px] gap-0 items-center px-4 py-3 border-b border-border/15 last:border-0 cursor-pointer transition-all",
                      selected?.id === client.id
                        ? "bg-primary/8 border-l-2 border-l-primary"
                        : "hover:bg-muted/20"
                    )}
                  >
                    {/* Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-primary">{initials(client.name)}</span>
                        </div>
                        {client.vip && (
                          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center">
                            <Star className="w-2 h-2 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{client.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{client.ig}</p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="min-w-0">
                      <p className="text-xs text-foreground/80 truncate">{client.phone}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{client.email}</p>
                    </div>

                    {/* Sessions */}
                    <div className="text-sm font-bold text-foreground">{client.sessions}</div>

                    {/* Total */}
                    <div className="text-sm font-bold text-primary">
                      {client.total > 0 ? `R$ ${client.total.toLocaleString("pt-BR")}` : "—"}
                    </div>

                    {/* Next session */}
                    <div className="text-xs text-muted-foreground">{client.nextSession}</div>

                    {/* Tags */}
                    <div className="flex gap-1 flex-wrap">
                      {client.tags.slice(0, 2).map(tag => (
                        <span key={tag} className={cn("text-[9px] px-1.5 py-0.5 rounded-full border font-semibold", TAG_COLORS[tag] || "bg-muted/30 text-muted-foreground border-border")}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer count */}
              <div className="px-4 py-2 border-t border-border/20 bg-muted/10">
                <p className="text-[11px] text-muted-foreground">{filtered.length} cliente{filtered.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex-1 overflow-y-auto space-y-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center bg-card border border-border/50 rounded-xl">
                  <Users className="w-8 h-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhum cliente encontrado</p>
                </div>
              ) : filtered.map((client) => (
                <div
                  key={client.id}
                  onClick={() => setSelected(client)}
                  className={cn(
                    "bg-card border rounded-xl p-3.5 cursor-pointer transition-all active:scale-[0.99]",
                    selected?.id === client.id ? "border-primary/40 bg-primary/5" : "border-border/50 hover:border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{initials(client.name)}</span>
                      </div>
                      {client.vip && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                          <Star className="w-2.5 h-2.5 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{client.name}</p>
                      <p className="text-[11px] text-muted-foreground">{client.ig} · {client.sessions} sessões</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">{client.total > 0 ? `R$ ${client.total.toLocaleString("pt-BR")}` : "—"}</p>
                      <p className="text-[10px] text-muted-foreground">{client.nextSession !== "—" ? client.nextSession : "Sem sessão"}</p>
                    </div>
                  </div>
                  {client.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-2">
                      {client.tags.map(tag => (
                        <span key={tag} className={cn("text-[9px] px-2 py-0.5 rounded-full border font-semibold", TAG_COLORS[tag] || "bg-muted/30 text-muted-foreground border-border")}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel — desktop */}
          {selected && (
            <div className="hidden md:flex w-72 lg:w-80 flex-shrink-0 flex-col bg-card border border-border/50 rounded-xl p-5 overflow-y-auto">
              <ClientDetailPanel
                client={selected}
                onClose={() => setSelected(null)}
                onToggleVip={handleToggleVip}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile detail bottom sheet */}
      {selected && (
        <div className="fixed md:hidden inset-x-0 bottom-0 z-50 bg-card border-t border-border rounded-t-2xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="w-10 h-1 bg-muted-foreground/20 rounded-full mx-auto mb-4" />
          <ClientDetailPanel
            client={selected}
            onClose={() => setSelected(null)}
            onToggleVip={handleToggleVip}
          />
        </div>
      )}

      <NewClientModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleNewClient}
      />
    </div>
  );
}