import { Save, Download, History, CheckCircle2, Lock, FileOutput, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const VARIANT_PRESENTATION = {
  line_only: {
    label: "Fine Lines",
    description: "Contornos limpos, pouca sombra",
  },
  light_shade: {
    label: "Soft Shade",
    description: "Volume leve, leitura equilibrada",
  },
  heavy_shade: {
    label: "Rich Shade",
    description: "Mais profundidade e massa visual",
  },
};

function ActionBtn({ icon: Icon, label, sublabel, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-150 group",
        disabled
          ? "border-border/10 cursor-not-allowed opacity-50"
          : "border-border/40 hover:border-primary/40 hover:bg-primary/5 active:scale-[0.99]"
      )}
    >
      <div className={cn(
        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all",
        disabled ? "bg-muted/15" : "bg-muted/40 group-hover:bg-primary/15"
      )}>
        {disabled
          ? <Lock className="w-3.5 h-3.5 text-muted-foreground/20" />
          : <Icon className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-primary" />
        }
      </div>
      <div className="min-w-0">
        <p className={cn("text-xs font-medium leading-tight truncate", disabled ? "text-muted-foreground/25" : "text-foreground/80 group-hover:text-foreground")}>
          {label}
        </p>
        {sublabel && (
          <p className={cn("text-[10px] mt-0.5 leading-tight", disabled ? "text-muted-foreground/15" : "text-muted-foreground/45")}>
            {sublabel}
          </p>
        )}
      </div>
    </button>
  );
}

export default function StencilRightPanel({ hasResult, selectedVersion, setSelectedVersion, selectedStyle, versions = [], selectedVersionData = null, onSave, onExportPdf, onExportPng, isMobile = false }) {
  const content = (<>
      {/* Actions */}
      <div className="bg-card border border-border/50 rounded-xl flex-shrink-0">
        <div className="px-4 pt-3.5 pb-3 border-b border-border/30">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Ações</span>
        </div>
        <div className="p-3 space-y-1.5">
          <ActionBtn icon={Save} label="Salvar Versão" sublabel="Salvar no projeto" disabled={!hasResult || !selectedVersionData} onClick={onSave} />
          <ActionBtn icon={FileOutput} label="Exportar PDF" sublabel="Formato A4" disabled={!hasResult || !selectedVersionData} onClick={onExportPdf} />
          <ActionBtn icon={Download} label="Exportar PNG" sublabel="Alta resolução" disabled={!hasResult || !selectedVersionData} onClick={onExportPng} />
        </div>
        {!hasResult && (
          <p className="text-[10px] text-muted-foreground/30 text-center pb-3 px-3 leading-relaxed">
            Disponível após gerar um stencil
          </p>
        )}
      </div>

      {/* Versions */}
      <div className="bg-card border border-border/50 rounded-xl flex-shrink-0">
        <div className="flex items-center gap-2 px-4 pt-3.5 pb-3 border-b border-border/30">
          <History className="w-3.5 h-3.5 text-muted-foreground/40" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Versões</span>
        </div>

        <div className="p-3">
          <AnimatePresence mode="wait">
            {!hasResult ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-5 text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-muted/20 flex items-center justify-center mx-auto mb-2.5">
                  <Layers className="w-4 h-4 text-muted-foreground/20" />
                </div>
                <p className="text-[11px] text-muted-foreground/40 font-medium">Nenhuma versão ainda</p>
                <p className="text-[10px] text-muted-foreground/25 mt-1 leading-relaxed">
                  Aparecerão após a geração
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-1.5"
              >
                {versions.map((v) => {
                  const active = selectedVersion === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVersion(v.id)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-xl border transition-all",
                        active
                          ? "bg-primary/10 border-primary/25 shadow-[0_0_10px_rgba(52,211,153,0.08)]"
                          : "border-transparent hover:bg-muted/40 hover:border-border/30"
                      )}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={cn("font-semibold text-[11px]", active ? "text-primary" : "text-foreground/75")}>
                          {VARIANT_PRESENTATION[v.kind]?.label || v.label}
                        </p>
                        {active && <CheckCircle2 className="w-3 h-3 text-primary" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground/50 leading-snug">
                        {VARIANT_PRESENTATION[v.kind]?.description || v.kind}
                      </p>
                      <p className="text-[9px] text-muted-foreground/30 mt-0.5">{new Date(v.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Metadata — only after result */}
      <AnimatePresence>
        {hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-card border border-border/50 rounded-xl flex-shrink-0"
          >
            <div className="px-4 pt-3.5 pb-3 border-b border-border/30">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Metadados</span>
            </div>
            <div className="p-4 space-y-1.5">
              {[
                { label: 'Resolução', value: selectedVersionData?.width && selectedVersionData?.height ? `${selectedVersionData.width}×${selectedVersionData.height}` : '—' },
                { label: 'Estilo', value: selectedVersionData?.metadata?.preset || selectedStyle || '—' },
                { label: 'Espessura', value: selectedVersionData?.metadata ? `${selectedVersionData.metadata.lineThickness}%` : '—' },
                { label: 'Formato', value: selectedVersionData?.metadata?.outputSize || '—' },
                { label: 'Camadas', value: selectedVersionData?.metadata ? `${selectedVersionData.metadata.layerCount}` : '—' },
                { label: 'Variante', value: selectedVersionData ? (VARIANT_PRESENTATION[selectedVersionData.kind]?.label || selectedVersionData.kind) : '—' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-1 border-b border-border/10 last:border-0">
                  <span className="text-[10px] text-muted-foreground/45">{item.label}</span>
                  <span className="text-[10px] text-foreground/75 font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  </>);

  if (isMobile) return <div className="space-y-3">{content}</div>;
  return <aside className="w-[210px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto min-h-0 pb-2 pl-0.5">{content}</aside>;
}