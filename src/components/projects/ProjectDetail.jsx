import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { STATUS_COLORS, MOCK_SESSIONS, MOCK_PAYMENTS, MOCK_NOTES } from "@/data/projectsMock";
import {
  ArrowLeft, User, MapPin, Palette, Clock, DollarSign, Camera,
  Plus, CheckCircle2, Circle, CalendarDays, Image, FileText,
  Shield, Heart, StickyNote, ChevronRight, Zap
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

export default function ProjectDetail({ project, onBack }) {
  const [activeTab, setActiveTab] = useState("overview");
  const sessions = MOCK_SESSIONS[project.id] || [];
  const payments = MOCK_PAYMENTS[project.id] || [];
  const notes = MOCK_NOTES[project.id] || [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
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
                <Button variant="outline" size="sm" className="text-xs h-8">Editar</Button>
                <Button size="sm" className="text-xs h-8 bg-primary text-primary-foreground gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Ação rápida
                </Button>
              </div>
            </div>

            {/* KPI mini strip */}
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

        {/* Tabs */}
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "overview" && <ProjectDetailOverview project={project} sessions={sessions} />}
        {activeTab === "sessions" && <ProjectDetailSessions project={project} sessions={sessions} />}
        {activeTab === "media" && <ProjectDetailMedia project={project} />}
        {activeTab === "finance" && <ProjectDetailFinance project={project} payments={payments} />}
        {activeTab === "healing" && <ProjectDetailHealing project={project} />}
        {activeTab === "notes" && <ProjectDetailNotes project={project} notes={notes} />}
      </div>
    </div>
  );
}

function ProjectDetailHealing({ project }) {
  const checks = [
    { day: "Dia 1-3", label: "Película protetora", done: true, date: "23 Mai 2026" },
    { day: "Dia 3-7", label: "Lavagem e hidratação", done: true, date: "26 Mai 2026" },
    { day: "Dia 7-14", label: "Descamação normal", done: false, date: null },
    { day: "Dia 14-30", label: "Check-in fotográfico", done: false, date: null },
    { day: "Dia 30+", label: "Avaliação de retoque", done: false, date: null },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Acompanhamento de Healing</h3>
        <Button size="sm" variant="outline" className="text-xs h-8">+ Check-in</Button>
      </div>

      <div className="space-y-2">
        {checks.map((c, i) => (
          <div key={i} className={cn("flex items-center gap-3 p-3 rounded-lg border transition-all",
            c.done ? "border-primary/20 bg-primary/5" : "border-border/50 bg-card")}>
            {c.done
              ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              : <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={cn("text-sm font-medium", c.done ? "text-foreground" : "text-muted-foreground")}>{c.label}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{c.day}</span>
              </div>
              {c.date && <p className="text-[10px] text-muted-foreground mt-0.5">Registrado em {c.date}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-border/50 bg-card">
        <p className="text-xs font-semibold text-foreground mb-2">Aftercare enviado</p>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">Instruções enviadas via WhatsApp em 22 Mai 2026</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
        <p className="text-xs font-semibold text-amber-400 mb-1">Retoque</p>
        <p className="text-xs text-muted-foreground">Retoque sugerido após 60 dias. Confirmar na sessão 5.</p>
      </div>
    </div>
  );
}