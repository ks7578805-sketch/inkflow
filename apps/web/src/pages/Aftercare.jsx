import Topbar from "@/components/layout/Topbar";
import StatusBadge from "@/components/shared/StatusBadge";
import KPICard from "@/components/shared/KPICard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { HeartPulse, Search, Calendar, Camera, AlertTriangle, CheckCircle2, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const cases = [
  { id: 1, client: "Lucas Mendes", tattoo: "Sleeve Oriental", startDate: "24/05", day: 1, progress: 5, status: "Início", photos: 0, symptoms: [], nextReminder: "Amanhã" },
  { id: 2, client: "Pedro Oliveira", tattoo: "Blackwork Geo.", startDate: "20/05", day: 5, progress: 25, status: "Descascando", photos: 2, symptoms: ["Leve coceira"], nextReminder: "Hoje" },
  { id: 3, client: "Marina Santos", tattoo: "Lettering", startDate: "15/05", day: 10, progress: 50, status: "Cicatrizando", photos: 4, symptoms: [], nextReminder: "Em 3 dias" },
  { id: 4, client: "Ricardo Lima", tattoo: "Blackwork Perna", startDate: "01/05", day: 24, progress: 85, status: "Quase curado", photos: 6, symptoms: [], nextReminder: "—" },
  { id: 5, client: "Juliana Costa", tattoo: "Fineline Rose", startDate: "10/05", day: 15, progress: 65, status: "Cicatrizando", photos: 3, symptoms: ["Retoque solicitado"], nextReminder: "Em 5 dias" },
];

const statusVariant = {
  "Início": "info",
  "Descascando": "warning",
  "Cicatrizando": "success",
  "Quase curado": "success",
};

const timeline = [
  { day: "Dia 1", label: "Tatuagem feita. Remover filme em 4h.", done: true },
  { day: "Dia 2-3", label: "Lavar com sabonete neutro. Hidratar com pomada.", done: true },
  { day: "Dia 4-7", label: "Início do descascamento. Não coçar.", done: true },
  { day: "Dia 7-14", label: "Cicatrização ativa. Manter hidratado.", done: false },
  { day: "Dia 14-21", label: "Pele renovando. Proteger do sol.", done: false },
  { day: "Dia 21-30", label: "Cicatrização completa. Foto final.", done: false },
];

export default function Aftercare() {
  const [selectedCase, setSelectedCase] = useState(null);

  return (
    <div className="min-h-screen">
      <Topbar title="Aftercare" subtitle="Acompanhamento pós-tatuagem" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <KPICard title="Em Healing" value="5" change="Clientes em acompanhamento" icon={HeartPulse} />
          <KPICard title="Lembretes Hoje" value="2" change="Enviar follow-up" trend="up" icon={Calendar} />
          <KPICard title="Fotos Recebidas" value="15" change="Última: hoje" icon={Camera} />
          <KPICard title="Retoques Solicitados" value="1" change="Juliana Costa" trend="down" icon={AlertTriangle} />
        </div>

        <div className="flex gap-6 h-[calc(100vh-280px)]">
          {/* Cases List */}
          <div className="flex-1 space-y-3 overflow-y-auto">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar pacientes..." className="pl-9 h-9 bg-secondary/50 text-sm" />
            </div>

            {cases.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={cn(
                  "bg-card border rounded-xl p-4 cursor-pointer transition-all",
                  selectedCase?.id === c.id ? "border-primary/30 bg-primary/5" : "border-border/50 hover:border-border"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">{c.client.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.client}</p>
                      <p className="text-xs text-muted-foreground">{c.tattoo}</p>
                    </div>
                  </div>
                  <StatusBadge label={c.status} variant={statusVariant[c.status] || "neutral"} />
                </div>
                <Progress value={c.progress} className="h-1.5 mb-2" />
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span>Dia {c.day}</span>
                  <span>{c.photos} fotos</span>
                  <span>Lembrete: {c.nextReminder}</span>
                  {c.symptoms.length > 0 && (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {c.symptoms[0]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          {selectedCase && (
            <div className="w-[380px] flex-shrink-0 bg-card border border-border/50 rounded-xl p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-foreground">Acompanhamento</h3>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedCase(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto mb-2">
                  <HeartPulse className="w-6 h-6 text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground">{selectedCase.client}</p>
                <p className="text-xs text-muted-foreground">{selectedCase.tattoo} · Dia {selectedCase.day}</p>
              </div>

              <div className="bg-muted/20 rounded-lg p-3 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Progresso de cicatrização</span>
                  <span className="text-sm font-bold text-primary">{selectedCase.progress}%</span>
                </div>
                <Progress value={selectedCase.progress} className="h-2" />
              </div>

              {/* Timeline */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Timeline</h4>
                <div className="space-y-2">
                  {timeline.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-1.5",
                          step.done ? "bg-primary" : "bg-muted-foreground/30"
                        )} />
                        {i < timeline.length - 1 && <div className="w-px flex-1 bg-border/30 my-1" />}
                      </div>
                      <div className="pb-3">
                        <p className={cn("text-xs font-medium", step.done ? "text-foreground" : "text-muted-foreground/60")}>{step.day}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{step.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos placeholder */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Fotos de Evolução</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: selectedCase.photos || 0 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-muted/30 border border-border/20 flex items-center justify-center">
                      <Camera className="w-4 h-4 text-muted-foreground/30" />
                    </div>
                  ))}
                  <div className="aspect-square rounded-lg border-2 border-dashed border-border/30 flex items-center justify-center cursor-pointer hover:border-primary/30 transition-colors">
                    <span className="text-lg text-muted-foreground/30">+</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                  <MessageSquare className="w-3 h-3" /> Enviar Lembrete
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                  <CheckCircle2 className="w-3 h-3" /> Marcar como Curado
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}