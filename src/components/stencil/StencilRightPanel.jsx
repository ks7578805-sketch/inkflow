import { Save, Download, History, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const versionHistory = [
  { id: 1, label: "v3 – Fine Line + Alta", style: "Fine Line", time: "Agora" },
  { id: 2, label: "v2 – Bold Line + Média", style: "Bold", time: "5 min" },
  { id: 3, label: "v1 – Auto", style: "Auto", time: "12 min" },
];

function ActionButton({ icon: IconComp, label, disabled }) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      className={cn(
        "w-full justify-start gap-2 h-9 text-xs transition-all",
        disabled
          ? "border-border/20 text-muted-foreground/30 cursor-not-allowed"
          : "border-border/50 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
      )}
    >
      {disabled ? <Lock className="w-3.5 h-3.5 opacity-40" /> : <IconComp className="w-3.5 h-3.5" />}
      {label}
    </Button>
  );
}

export default function StencilRightPanel({ hasResult, selectedVersion, setSelectedVersion }) {
  return (
    <div className="w-64 flex-shrink-0 space-y-4 overflow-y-auto pb-6">

      {/* Actions */}
      <div className="bg-card border border-border/50 rounded-xl p-4 space-y-2">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Ações</p>
        <ActionButton icon={Save} label="Salvar Versão" disabled={!hasResult} />
        <ActionButton icon={Download} label="Exportar PDF" disabled={!hasResult} />
        <ActionButton icon={Download} label="Exportar PNG" disabled={!hasResult} />

        {!hasResult && (
          <p className="text-[10px] text-muted-foreground/40 text-center pt-1 leading-relaxed">
            Disponível após gerar um stencil
          </p>
        )}
      </div>

      {/* Version History */}
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-3.5 h-3.5 text-muted-foreground/60" />
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Versões</p>
        </div>

        {!hasResult ? (
          <div className="py-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center mx-auto mb-3">
              <History className="w-4 h-4 text-muted-foreground/30" />
            </div>
            <p className="text-xs text-muted-foreground/50">Nenhuma versão gerada ainda</p>
            <p className="text-[10px] text-muted-foreground/30 mt-1">As versões aparecerão aqui</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {versionHistory.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVersion(v.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all",
                  selectedVersion === v.id
                    ? "bg-primary/10 border border-primary/20 text-primary"
                    : "hover:bg-muted/50 text-muted-foreground border border-transparent"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[11px]">{v.label}</p>
                  {selectedVersion === v.id && <CheckCircle2 className="w-3 h-3 text-primary" />}
                </div>
                <p className="text-[10px] opacity-50 mt-0.5">{v.time} atrás</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Metadata – only when result */}
      {hasResult && (
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Metadados</p>
          <div className="space-y-2 text-[11px]">
            {[
              { label: "Resolução", value: "2480 × 3508" },
              { label: "Estilo", value: "Fine Line" },
              { label: "Espessura", value: "50%" },
              { label: "Formato", value: "A4" },
              { label: "Gerado em", value: "12s" },
              { label: "Modelo", value: "StencilNet v2.1" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-0.5 border-b border-border/20 last:border-0">
                <span className="text-muted-foreground/70">{item.label}</span>
                <span className="text-foreground font-medium font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}