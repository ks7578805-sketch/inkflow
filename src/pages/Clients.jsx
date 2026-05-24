import Topbar from "@/components/layout/Topbar";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Plus, User, Phone, Instagram, Star, CalendarDays,
  ChevronRight, HeartPulse, FileCheck, X, Mail
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const clients = [
  { id: 1, name: "Lucas Mendes", phone: "+55 11 99999-1234", ig: "@lucasm.ink", sessions: 6, total: "R$ 4.800", vip: true, status: "active", nextSession: "28 Mai", tags: ["VIP", "Sessão futura"] },
  { id: 2, name: "Ana Beatriz", phone: "+55 11 98888-5678", ig: "@anab.tattoo", sessions: 3, total: "R$ 2.400", vip: false, status: "active", nextSession: "02 Jun", tags: ["Sessão futura", "Aprovação pendente"] },
  { id: 3, name: "Pedro Oliveira", phone: "+55 11 97777-9012", ig: "@pedroolv", sessions: 4, total: "R$ 3.500", vip: false, status: "active", nextSession: "30 Mai", tags: ["Aftercare"] },
  { id: 4, name: "Marina Santos", phone: "+55 11 96666-3456", ig: "@marinasantos", sessions: 2, total: "R$ 1.200", vip: false, status: "inactive", nextSession: "—", tags: [] },
  { id: 5, name: "Ricardo Lima", phone: "+55 11 95555-7890", ig: "@ricardoink", sessions: 8, total: "R$ 8.200", vip: true, status: "active", nextSession: "A definir", tags: ["VIP"] },
  { id: 6, name: "Juliana Costa", phone: "+55 11 94444-2345", ig: "@jucosta", sessions: 1, total: "R$ 600", vip: false, status: "active", nextSession: "05 Jun", tags: ["Sessão futura"] },
];

const tagColors = {
  "VIP": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Sessão futura": "bg-primary/10 text-primary border-primary/20",
  "Aprovação pendente": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Aftercare": "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function Clients() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen">
      <Topbar title="Clientes" subtitle="CRM de clientes do estúdio" />

      <div className="p-6 flex gap-6 h-[calc(100vh-64px)]">
        {/* List */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar clientes..." className="pl-9 h-9 bg-secondary/50 text-sm" />
            </div>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="bg-muted/30 h-9">
                <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
                <TabsTrigger value="vip" className="text-xs">VIP</TabsTrigger>
                <TabsTrigger value="active" className="text-xs">Ativos</TabsTrigger>
                <TabsTrigger value="aftercare" className="text-xs">Aftercare</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button size="sm" className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
              <Plus className="w-4 h-4" /> Novo
            </Button>
          </div>

          <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Cliente</th>
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Contato</th>
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Sessões</th>
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Total</th>
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Próxima</th>
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Tags</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className={cn(
                      "border-t border-border/20 cursor-pointer transition-colors",
                      selectedClient?.id === client.id ? "bg-primary/5" : "hover:bg-muted/20"
                    )}
                    onClick={() => setSelectedClient(client)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-primary">{client.name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                            {client.name}
                            {client.vip && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{client.ig}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{client.phone}</td>
                    <td className="px-4 py-3 text-sm font-medium">{client.sessions}</td>
                    <td className="px-4 py-3 text-sm font-medium text-primary">{client.total}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{client.nextSession}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {client.tags.map((tag) => (
                          <span key={tag} className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", tagColors[tag])}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Client Detail */}
        {selectedClient && (
          <div className="w-[340px] flex-shrink-0 bg-card border border-border/50 rounded-xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-foreground">Perfil do Cliente</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedClient(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-primary">{selectedClient.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <p className="text-base font-semibold text-foreground flex items-center justify-center gap-1.5">
                {selectedClient.name}
                {selectedClient.vip && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedClient.ig}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-muted/20 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-foreground">{selectedClient.sessions}</p>
                <p className="text-[10px] text-muted-foreground">Sessões</p>
              </div>
              <div className="bg-muted/20 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-primary">{selectedClient.total}</p>
                <p className="text-[10px] text-muted-foreground">Total gasto</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              {[
                { icon: Phone, label: "Telefone", value: selectedClient.phone },
                { icon: Instagram, label: "Instagram", value: selectedClient.ig },
                { icon: Mail, label: "Email", value: `${selectedClient.name.split(" ")[0].toLowerCase()}@email.com` },
                { icon: CalendarDays, label: "Próxima sessão", value: selectedClient.nextSession },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 py-1.5">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">{item.label}</p>
                    <p className="text-xs font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Observações</p>
              <div className="bg-muted/20 rounded-lg p-3">
                <p className="text-xs text-muted-foreground leading-relaxed">Sem alergias conhecidas. Prefere sessões pela manhã. Referências salvas no projeto.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5"><FileCheck className="w-3 h-3" /> Documentos</Button>
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5"><HeartPulse className="w-3 h-3" /> Aftercare</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}