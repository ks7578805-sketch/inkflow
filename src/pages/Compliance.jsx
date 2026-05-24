import Topbar from "@/components/layout/Topbar";
import StatusBadge from "@/components/shared/StatusBadge";
import KPICard from "@/components/shared/KPICard";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ShieldCheck, FileCheck, Search, Upload, CheckCircle2, AlertTriangle, User, Calendar } from "lucide-react";
import { useState } from "react";

const consents = [
  { id: 1, client: "Lucas Mendes", date: "24/05/2026", session: "Sleeve Oriental", status: "Assinado", docType: "Consentimento + ID" },
  { id: 2, client: "Ana Beatriz", date: "23/05/2026", session: "Fineline Floral", status: "Pendente", docType: "Consentimento" },
  { id: 3, client: "Pedro Oliveira", date: "22/05/2026", session: "Blackwork Geo.", status: "Assinado", docType: "Consentimento + Health" },
  { id: 4, client: "Marina Santos", date: "20/05/2026", session: "Lettering", status: "Assinado", docType: "Consentimento + ID" },
  { id: 5, client: "Ricardo Lima", date: "18/05/2026", session: "Blackwork Perna", status: "Vencido", docType: "Consentimento" },
];

const traceability = [
  { id: 1, session: "Sleeve Oriental – Lucas M.", date: "24/05", ink: "Intenze Black (Lote TI-089)", needles: "RL 3 (Lote AG-042)", artist: "Marcelo R." },
  { id: 2, session: "Fineline – Ana B.", date: "23/05", ink: "Fusion White (Lote FU-015)", needles: "RL 5 (Lote AG-044)", artist: "Marcelo R." },
  { id: 3, session: "Blackwork – Pedro O.", date: "22/05", ink: "Intenze Black (Lote TI-089)", needles: "RS 7 (Lote AG-043)", artist: "Camila S." },
];

const checklist = [
  { label: "Superfícies desinfetadas", done: true },
  { label: "EPIs verificados", done: true },
  { label: "Materiais esterilizados", done: true },
  { label: "Autoclave verificada", done: true },
  { label: "Descarte de perfurocortantes", done: false },
  { label: "Ventilação adequada", done: true },
];

export default function Compliance() {
  const [tab, setTab] = useState("consents");

  return (
    <div className="min-h-screen">
      <Topbar title="Compliance" subtitle="Consentimento, rastreabilidade e conformidade" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <KPICard title="Conformidade Geral" value="94%" change="Meta: 100%" trend="up" icon={ShieldCheck} />
          <KPICard title="Consentimentos" value="28" change="2 pendentes" icon={FileCheck} />
          <KPICard title="Sessões Rastreadas" value="45" change="Últimos 30 dias" icon={Calendar} />
          <KPICard title="Checklist Diário" value="5/6" change="1 pendente" trend="down" icon={CheckCircle2} />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted/30 h-9">
              <TabsTrigger value="consents" className="text-xs">Consentimentos</TabsTrigger>
              <TabsTrigger value="traceability" className="text-xs">Rastreabilidade</TabsTrigger>
              <TabsTrigger value="checklist" className="text-xs">Checklist Sanitário</TabsTrigger>
              <TabsTrigger value="audit" className="text-xs">Auditoria</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-9 h-9 w-56 bg-secondary/50 text-sm" />
              </div>
              <Button size="sm" className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
                <Upload className="w-4 h-4" /> Upload
              </Button>
            </div>
          </div>

          <TabsContent value="consents" className="mt-4">
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Cliente</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Data</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Sessão</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Documentos</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {consents.map((c) => (
                    <tr key={c.id} className="border-t border-border/20 hover:bg-muted/10 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" /> {c.client}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{c.date}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{c.session}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{c.docType}</td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          label={c.status}
                          variant={c.status === "Assinado" ? "success" : c.status === "Pendente" ? "warning" : "error"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="traceability" className="mt-4">
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Sessão</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Data</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Tinta (Lote)</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Agulhas (Lote)</th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5">Artista</th>
                  </tr>
                </thead>
                <tbody>
                  {traceability.map((t) => (
                    <tr key={t.id} className="border-t border-border/20 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{t.session}</td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{t.date}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{t.ink}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{t.needles}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{t.artist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="mt-4">
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <SectionHeader title="Checklist Sanitário – Hoje" description="Verificação diária obrigatória" />
              <div className="space-y-2 mt-3">
                {checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/10 border border-border/20">
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    )}
                    <span className="text-sm text-foreground">{item.label}</span>
                    <StatusBadge label={item.done ? "OK" : "Pendente"} variant={item.done ? "success" : "warning"} className="ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <SectionHeader title="Histórico de Auditoria" description="Registro de verificações e atualizações" />
              <div className="space-y-3 mt-3">
                {[
                  { action: "Checklist sanitário completado", date: "24/05/2026 08:30", user: "Marcelo R." },
                  { action: "Consentimento assinado – Lucas M.", date: "24/05/2026 09:15", user: "Sistema" },
                  { action: "Rastreabilidade registrada – Sessão #45", date: "24/05/2026 09:20", user: "Marcelo R." },
                  { action: "ID verificado – Ana Beatriz", date: "23/05/2026 12:45", user: "Sistema" },
                  { action: "Autoclave verificada", date: "23/05/2026 08:00", user: "Camila S." },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-muted/10 border border-border/20">
                    <div>
                      <p className="text-xs font-medium text-foreground">{item.action}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.user}</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}