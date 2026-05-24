import Topbar from "@/components/layout/Topbar";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Clock, User, DollarSign, MapPin, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const hours = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`);

const sessions = [
  { id: 1, client: "Lucas Mendes", time: "09:00", endTime: "12:00", type: "Sleeve Oriental (cont.)", status: "Em andamento", artist: "Marcelo", deposit: "R$ 300", placement: "Braço esquerdo", duration: 3 },
  { id: 2, client: "Ana Beatriz", time: "13:00", endTime: "15:00", type: "Fineline Floral", status: "Confirmada", artist: "Marcelo", deposit: "R$ 200", placement: "Antebraço direito", duration: 2 },
  { id: 3, client: "Pedro Oliveira", time: "16:00", endTime: "20:00", type: "Blackwork Geométrico", status: "Confirmada", artist: "Marcelo", deposit: "R$ 500", placement: "Costas", duration: 4 },
];

const statusColors = {
  "Em andamento": "border-l-blue-500 bg-blue-500/5",
  "Confirmada": "border-l-primary bg-primary/5",
  "Aguardando": "border-l-amber-500 bg-amber-500/5",
  "Cancelada": "border-l-destructive bg-destructive/5",
};

const statusBadgeMap = {
  "Em andamento": "info",
  "Confirmada": "success",
  "Aguardando": "warning",
};

export default function Calendar() {
  const [view, setView] = useState("day");
  const [selectedSession, setSelectedSession] = useState(null);

  return (
    <div className="min-h-screen">
      <Topbar title="Agenda" subtitle="Gerencie suas sessões e horários" />

      <div className="p-3 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 h-auto md:h-[calc(100vh-64px)]">
        {/* Calendar Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Calendar Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-sm md:text-base font-semibold text-foreground">24 de Maio, 2026</h2>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-primary">Hoje</Button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Select defaultValue="all">
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Artista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os artistas</SelectItem>
                  <SelectItem value="marcelo">Marcelo R.</SelectItem>
                  <SelectItem value="camila">Camila S.</SelectItem>
                </SelectContent>
              </Select>

              <Tabs value={view} onValueChange={setView}>
                <TabsList className="bg-muted/30 h-8">
                  <TabsTrigger value="day" className="text-xs h-7">Dia</TabsTrigger>
                  <TabsTrigger value="week" className="text-xs h-7">Semana</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs h-7">Mês</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" /><span className="hidden sm:inline">Nova Sessão</span><span className="sm:hidden">Nova</span>
              </Button>
            </div>
          </div>

          {/* Day View */}
          <div className="flex-1 bg-card border border-border/50 rounded-xl overflow-y-auto" style={{ minHeight: 400 }}>
            <div className="relative min-h-[780px]">
              {hours.map((hour, i) => (
                <div key={hour} className="flex border-b border-border/20" style={{ height: "60px" }}>
                  <div className="w-16 flex-shrink-0 text-[11px] font-mono text-muted-foreground pr-3 text-right pt-1">
                    {hour}
                  </div>
                  <div className="flex-1 relative">
                    {sessions.map((session) => {
                      const startHour = parseInt(session.time.split(":")[0]);
                      if (startHour !== i + 8) return null;
                      return (
                        <div
                          key={session.id}
                          onClick={() => setSelectedSession(session)}
                          className={cn(
                            "absolute left-1 right-4 rounded-lg border-l-[3px] p-3 cursor-pointer transition-all hover:shadow-lg z-10",
                            statusColors[session.status],
                            selectedSession?.id === session.id && "ring-1 ring-primary/30"
                          )}
                          style={{ height: `${session.duration * 60 - 4}px` }}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs font-semibold text-foreground">{session.client}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{session.type}</p>
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground">{session.time} – {session.endTime}</span>
                          </div>
                          {session.duration > 1 && (
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{session.placement}</span>
                              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{session.deposit}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session Detail Panel */}
        {selectedSession && (
          <div className="w-full md:w-80 flex-shrink-0 bg-card border border-border/50 rounded-xl p-4 md:p-5 overflow-y-auto md:max-h-[calc(100vh-130px)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Detalhes da Sessão</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedSession(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/20 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selectedSession.client}</p>
                  <p className="text-xs text-muted-foreground">Cliente</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Horário", value: `${selectedSession.time} – ${selectedSession.endTime}`, icon: Clock },
                  { label: "Tipo", value: selectedSession.type },
                  { label: "Placement", value: selectedSession.placement, icon: MapPin },
                  { label: "Depósito", value: selectedSession.deposit, icon: DollarSign },
                  { label: "Artista", value: selectedSession.artist, icon: User },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>

              <div>
                <span className="text-xs text-muted-foreground">Status</span>
                <div className="mt-1">
                  <StatusBadge label={selectedSession.status} variant={statusBadgeMap[selectedSession.status]} />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full text-xs">Abrir Projeto</Button>
                <Button variant="outline" size="sm" className="w-full text-xs">Abrir Cliente</Button>
                <Button variant="outline" size="sm" className="w-full text-xs text-amber-400 hover:text-amber-300">Remarcar</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}