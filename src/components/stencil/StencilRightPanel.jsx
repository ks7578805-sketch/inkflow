import { Save, Download, History, CheckCircle2, Lock, FileOutput, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const versionHistory = [
  { id: 1, label: "Clean", desc: "Fine Line · Alta resolução", time: "Agora", active: true },
  { id: 2, label: "Bold", desc: "Bold Line · Média resolução", time: "5 min", active: false },
  { id: 3, label: "Detailed", desc: "Realismo · Alta resolução", time: "12 min", active: false },
];

const workflowSteps = [
  { step: 1, label: "Carregar referência", key: "image" },
  { step: 2, label: "Escolher estilo", key: "style" },
  { step: 3, label: "Ajustar controles", key: "controls" },
  { step: 4, label: "Gerar stencil", key: "generate" },
  { step: 5, label: "Salvar e exportar", key: "export" },
];

function ActionButton({ icon: IconComp, label, sublabel, disabled }) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 text-left group",
        disabled
          ? "border-border/15 cursor-not-allowed"
          : "border-border/40 hover:border-primary/40 hover:bg-primary/5"
      )}
    >
      <div className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all",
        disabled ? "bg-muted/20" : "bg-muted/40 group-hover:bg-primary/15"
      )}>
        {disabled
          ? <Lock className="w-3.5 h-3.5 text-muted-foreground/20" />
          : <IconComp className="w-3.5 h-3.5 text-muted-foreground/70 group-hover:text-primary" />
        }
      </div>
      <div>
        <p className={cn("text-xs font-medium leading-tight", disabled ? "text-muted-foreground/25" : "text-foreground/80 group-hover:text-foreground")}>{label}</p>
        {sublabel && <p className={cn("text-[10px] mt-0.5", disabled ? "text-muted-foreground/15" : "text-muted-foreground/50")}>{sublabel}</p>}
      </div>
    </button>
  );
}

export default function StencilRightPanel({ hasResult, selectedVersion, setSelectedVersion, image, selectedStyle }) {
  // Compute workflow progress
  const stepDone = {
    image: !!image,
    style: !!selectedStyle,
    controls: !!image,
    generate: hasResult,
    export: hasResult,
  };

  return (
    <div className="w-[220px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto pb-6">

      {/* Workflow checklist */}
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Fluxo</p>
        <div className="space-y-1">
          {workflowSteps.map((s, i) => {
            const done = stepDone[s.key];
            const current = !done && workflowSteps.slice(0, i).every(prev => stepDone[prev.key]);
            return (
              <div key={s.step} className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all",
                done ? "opacity-60" : current ? "bg-primary/8 border border-primary/15" : ""
              )}>
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border text-[10px] font-bold",
                  done
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : current
                      ? "bg-primary/10 border-primary/25 text-primary"
                      : "bg-muted/30 border-border/30 text-muted-foreground/30"
                )}>
                  {done ? <CheckCircle2 className="w-3 h-3" /> : s.step}
                </div>
                <span className={cn(
                  "text-[11px] font-medium",
                  done ? "text-muted-foreground/50 line-through" : current ? "text-foreground/80" : "text-muted-foreground/40"
                )}>{s.label}</span>
                {current && <ArrowRight className="w-3 h-3 text-primary ml-auto" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Ações</p>
        <div className="space-y-1.5">
          <ActionButton icon={Save} label="Salvar Versão" sublabel="Salvar no projeto" disabled={!hasResult} />
          <ActionButton icon={FileOutput} label="Exportar PDF" sublabel="Formato A4" disabled={!hasResult} />
          <ActionButton icon={Download} label="Exportar PNG" sublabel="Alta resolução" disabled={!hasResult} />
        </div>
        {!hasResult && (
          <p className="text-[9px] text-muted-foreground/30 text-center mt-3 leading-relaxed">
            Disponível após gerar um stencil
          </p>
        )}
      </div>

      {/* Versions */}
      <div className="bg-card border border-border/50 rounded-xl p-4 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-3.5 h-3.5 text-muted-foreground/50" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Versões</p>
        </div>

        <AnimatePresence mode="wait">
          {!hasResult ? (
            <motion.div
              key="empty-versions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-5 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center mx-auto mb-2.5">
                <Layers className="w-4 h-4 text-muted-foreground/20" />
              </div>
              <p className="text-[11px] text-muted-foreground/40 font-medium">Nenhuma versão ainda</p>
              <p className="text-[10px] text-muted-foreground/25 mt-1 leading-relaxed">
                As versões aparecerão após a geração
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="versions-list"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-1.5"
            >
              {versionHistory.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVersion(v.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all border",
                    selectedVersion === v.id
                      ? "bg-primary/10 border-primary/25 shadow-[0_0_10px_rgba(52,211,153,0.08)]"
                      : "border-transparent hover:bg-muted/40 hover:border-border/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={cn("font-semibold text-[11px]", selectedVersion === v.id ? "text-primary" : "text-foreground/80")}>
                      {v.label}
                    </p>
                    {selectedVersion === v.id && <CheckCircle2 className="w-3 h-3 text-primary" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground/50">{v.desc}</p>
                  <p className="text-[9px] text-muted-foreground/30 mt-0.5">{v.time} atrás</p>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Metadata – only when result */}
      <AnimatePresence>
        {hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-card border border-border/50 rounded-xl p-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Metadados</p>
            <div className="space-y-1.5">
              {[
                { label: "Resolução", value: "2480×3508" },
                { label: "Estilo", value: "Fine Line" },
                { label: "Espessura", value: "50%" },
                { label: "Formato", value: "A4" },
                { label: "Gerado em", value: "12s" },
                { label: "Modelo", value: "StencilNet v2" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-1 border-b border-border/15 last:border-0">
                  <span className="text-[10px] text-muted-foreground/50">{item.label}</span>
                  <span className="text-[10px] text-foreground/80 font-mono font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}