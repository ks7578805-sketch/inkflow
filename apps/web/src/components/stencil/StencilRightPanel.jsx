import { Save, Download, History, Lock, FileOutput, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const STYLE_LABELS = {
  fineline: "Fine Line",
  blackwork: "Blackwork",
  realismo: "Realismo",
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
          : "border-[#27865f]/20 hover:border-[#27865f]/45 hover:bg-[#27865f]/[0.06] active:scale-[0.99]",
      )}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all",
          disabled ? "bg-muted/15" : "bg-muted/40 group-hover:bg-[#27865f]/[0.18]",
        )}
      >
        {disabled ? (
          <Lock className="w-3.5 h-3.5 text-muted-foreground/20" />
        ) : (
          <Icon className="w-3.5 h-3.5 text-muted-foreground/65 group-hover:text-[#27865f]" />
        )}
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "text-xs font-medium leading-tight truncate",
            disabled
              ? "text-muted-foreground/25"
              : "text-foreground/85 group-hover:text-foreground",
          )}
        >
          {label}
        </p>
        {sublabel && (
          <p
            className={cn(
              "text-[10px] mt-0.5 leading-tight",
              disabled ? "text-muted-foreground/15" : "text-muted-foreground/55",
            )}
          >
            {sublabel}
          </p>
        )}
      </div>
    </button>
  );
}

// Phase A: one generation produces one version. We drop the version picker
// entirely and surface actions + metadata. The single result is rendered by
// StencilCenterArea, so the right panel is purely for export/save/info.
export default function StencilRightPanel({
  hasResult,
  selectedStyle,
  selectedVersionData = null,
  onSave,
  onExportPdf,
  onExportPng,
  isMobile = false,
}) {
  const content = (
    <>
      {/* Actions */}
      <div className="bg-card border border-[#27865f]/20 rounded-xl flex-shrink-0">
        <div className="px-4 pt-3.5 pb-3 border-b border-[#27865f]/[0.10]">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Ações
          </span>
        </div>
        <div className="p-3 space-y-1.5">
          <ActionBtn
            icon={Save}
            label="Salvar Versão"
            sublabel="Salvar no projeto"
            disabled={!hasResult || !selectedVersionData}
            onClick={onSave}
          />
          <ActionBtn
            icon={FileOutput}
            label="Exportar PDF"
            sublabel="Formato A4"
            disabled={!hasResult || !selectedVersionData}
            onClick={onExportPdf}
          />
          <ActionBtn
            icon={Download}
            label="Exportar PNG"
            sublabel="Alta resolução"
            disabled={!hasResult || !selectedVersionData}
            onClick={onExportPng}
          />
        </div>
        {!hasResult && (
          <p className="text-[10px] text-muted-foreground/35 text-center pb-3 px-3 leading-relaxed">
            Disponível após gerar um stencil
          </p>
        )}
      </div>

      {/* Metadata — only after result */}
      <AnimatePresence>
        {hasResult && selectedVersionData && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-card border border-[#27865f]/20 rounded-xl flex-shrink-0"
          >
            <div className="flex items-center gap-2 px-4 pt-3.5 pb-3 border-b border-[#27865f]/[0.10]">
              <History className="w-3.5 h-3.5 text-muted-foreground/55" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Detalhes
              </span>
            </div>
            <div className="p-4 space-y-1.5">
              {[
                {
                  label: "Estilo",
                  value:
                    STYLE_LABELS[selectedVersionData?.metadata?.preset] ||
                    STYLE_LABELS[selectedStyle] ||
                    selectedStyle ||
                    "—",
                },
                {
                  label: "Resolução",
                  value:
                    selectedVersionData?.width && selectedVersionData?.height
                      ? `${selectedVersionData.width}×${selectedVersionData.height}`
                      : "—",
                },
                {
                  label: "Formato",
                  value: (selectedVersionData?.metadata?.outputSize || "—").toString().toUpperCase(),
                },
                {
                  label: "Espessura",
                  value: selectedVersionData?.metadata
                    ? `${selectedVersionData.metadata.lineThickness}%`
                    : "—",
                },
                {
                  label: "Camadas",
                  value: selectedVersionData?.metadata
                    ? `${selectedVersionData.metadata.layerCount}`
                    : "—",
                },
                {
                  label: "Cor",
                  value: selectedVersionData?.metadata?.lineColor || "—",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-1 border-b border-border/10 last:border-0"
                >
                  <span className="text-[10px] text-muted-foreground/55">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-foreground/85 font-mono">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {!hasResult && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-card border border-[#27865f]/[0.10] rounded-xl flex-shrink-0 py-6 text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-muted/20 flex items-center justify-center mx-auto mb-2.5">
              <Layers className="w-4 h-4 text-muted-foreground/25" />
            </div>
            <p className="text-[11px] text-muted-foreground/45 font-medium">
              Nenhum stencil gerado
            </p>
            <p className="text-[10px] text-muted-foreground/30 mt-1 leading-relaxed px-4">
              Envie uma referência, escolha o estilo e gere
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (isMobile) return <div className="space-y-3">{content}</div>;
  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto min-h-0 pb-2 pl-0.5">
      {content}
    </aside>
  );
}
