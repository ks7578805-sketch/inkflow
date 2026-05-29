import { useEffect, useMemo, useRef, useState } from "react";
import { buildApiUrl } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock,
  Upload,
  Cpu,
  Layers,
  Sparkles,
  ArrowLeftCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const processingSteps = [
  { label: "Na fila", icon: Clock },
  { label: "Preparando imagem", icon: Upload },
  { label: "Gerando com IA", icon: Cpu },
  { label: "Refinando stencil", icon: Wand2 },
  { label: "Finalizando versões", icon: Layers },
];

const OUTPUT_SIZE_VIEWPORTS = {
  a4: { width: 2480, height: 3508 },
  a3: { width: 3508, height: 4961 },
  letter: { width: 2550, height: 3300 },
  custom: { width: 2480, height: 3508 },
};

function StencilSVG({ className = "" }) {
  return (
    <svg viewBox="0 0 200 240" className={cn("drop-shadow-sm", className)}>
      <path d="M100 18 C58 38 28 78 38 138 C48 198 78 218 100 228 C122 218 152 198 162 138 C172 78 142 38 100 18Z" fill="none" stroke="#0f172a" strokeWidth="1.6" />
      <path d="M78 58 Q88 78 100 58 Q112 78 122 58" fill="none" stroke="#0f172a" strokeWidth="1" />
      <path d="M68 98 Q100 128 132 98" fill="none" stroke="#0f172a" strokeWidth="1" />
      <circle cx="84" cy="78" r="3.5" fill="none" stroke="#0f172a" strokeWidth="0.9" />
      <circle cx="116" cy="78" r="3.5" fill="none" stroke="#0f172a" strokeWidth="0.9" />
      <path d="M58 148 Q78 168 100 148 Q122 168 142 148" fill="none" stroke="#0f172a" strokeWidth="0.9" />
      <path d="M54 118 Q64 112 69 122 Q74 130 80 118" fill="none" stroke="#0f172a" strokeWidth="0.7" />
      <path d="M120 118 Q130 112 136 122 Q141 130 146 118" fill="none" stroke="#0f172a" strokeWidth="0.7" />
      <path d="M72 165 Q86 158 100 162 Q114 158 128 165" fill="none" stroke="#0f172a" strokeWidth="0.6" />
    </svg>
  );
}

function getViewport(selectedVersion) {
  if (selectedVersion?.width && selectedVersion?.height) {
    return { width: selectedVersion.width, height: selectedVersion.height };
  }

  const fallback = OUTPUT_SIZE_VIEWPORTS[selectedVersion?.metadata?.outputSize] || OUTPUT_SIZE_VIEWPORTS.a4;
  return fallback;
}

function calculateContainRect(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  if (!sourceWidth || !sourceHeight || !targetWidth || !targetHeight) {
    return { x: 0, y: 0, width: targetWidth, height: targetHeight };
  }

  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;

  return {
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
    width,
    height,
  };
}

function SharedPreviewStage({ imageUrl, stencilUrl, selectedVersion, mode, dividerX, stencilOpacity, onDividerChange }) {
  const viewport = useMemo(() => getViewport(selectedVersion), [selectedVersion]);
  const containerRef = useRef(null);
  const draggingRef = useRef(false);

  const sourceWidth = selectedVersion?.metadata?.sourceWidth || null;
  const sourceHeight = selectedVersion?.metadata?.sourceHeight || null;
  const originalRect = useMemo(
    () => calculateContainRect(sourceWidth, sourceHeight, viewport.width, viewport.height),
    [sourceWidth, sourceHeight, viewport.height, viewport.width],
  );

  const updateDivider = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    onDividerChange(Math.max(5, Math.min(95, next)));
  };

  const handlePointerDown = (event) => {
    draggingRef.current = true;
    updateDivider(event.clientX);
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current || mode !== "compare") return;
    updateDivider(event.clientX);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const originalStyle = {
    left: `${(originalRect.x / viewport.width) * 100}%`,
    top: `${(originalRect.y / viewport.height) * 100}%`,
    width: `${(originalRect.width / viewport.width) * 100}%`,
    height: `${(originalRect.height / viewport.height) * 100}%`,
  };

  return (
    <div className="flex-1 w-full min-h-0 flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-full max-w-[980px] max-h-full rounded-2xl overflow-hidden border border-border/30 shadow-2xl bg-white select-none"
        style={{ aspectRatio: `${viewport.width} / ${viewport.height}` }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(15,23,42,0.015)_25%,transparent_25%,transparent_50%,rgba(15,23,42,0.015)_50%,rgba(15,23,42,0.015)_75%,transparent_75%,transparent)] bg-[length:18px_18px]" />
        {imageUrl && (
          <div className="absolute inset-0">
            <div className="absolute overflow-hidden" style={originalStyle}>
              <img src={imageUrl} alt="original" className="w-full h-full object-cover" draggable={false} />
            </div>
          </div>
        )}
        {stencilUrl ? (
          <div
            className="absolute inset-0"
            style={mode === "compare" ? { clipPath: `inset(0 ${100 - dividerX}% 0 0)` } : { opacity: stencilOpacity / 100 }}
          >
            <img src={stencilUrl} alt="stencil" className="w-full h-full object-contain" draggable={false} />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <StencilSVG className="w-full h-full max-h-[80%] max-w-[60%]" />
          </div>
        )}
        <div className="absolute top-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm">
          Original
        </div>
        <div className="absolute top-3 right-3 rounded-lg bg-black/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-black/55">
          Stencil
        </div>
        {mode === "compare" && (
          <div
            className="absolute top-0 bottom-0 z-20 flex items-center justify-center cursor-col-resize touch-none"
            style={{ left: `calc(${dividerX}% - 1px)` }}
            onPointerDown={handlePointerDown}
          >
            <div className="w-0.5 h-full bg-primary/80 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            <div className="absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background shadow-[0_0_12px_rgba(52,211,153,0.4)]">
              <span className="select-none text-[10px] font-bold text-primary">↔</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StencilCenterArea({
  image,
  selectedVersion,
  isGenerating,
  hasResult,
  currentStep,
  onReplaceImage,
  onDragOver,
  onDragLeave,
  onDrop,
  isMobile = false,
}) {
  const [previewMode, setPreviewMode] = useState("compare");
  const [dividerX, setDividerX] = useState(50);
  const [stencilOpacity, setStencilOpacity] = useState([100]);

  useEffect(() => {
    setPreviewMode("compare");
    setDividerX(50);
    setStencilOpacity([100]);
  }, [selectedVersion?.id]);

  const imageUrl = (image?.publicUrl ? buildApiUrl(image.publicUrl) : null) || image?.url;

  return (
    <div
      className={cn(
        "bg-card border border-border/50 rounded-xl overflow-hidden relative flex items-center justify-center",
        isMobile ? "w-full min-h-[300px]" : "flex-1 min-w-0 min-h-0",
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <AnimatePresence mode="wait">
        {!image && !isGenerating && !hasResult && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center justify-center text-center px-12 py-16 max-w-sm"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, hsl(160 84% 39% / 0.06) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative mb-7">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/10 border border-border/30 flex items-center justify-center">
                <Wand2 className="w-9 h-9 text-muted-foreground/15" />
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-primary/25 border border-primary/40 animate-pulse" />
              <div className="absolute -bottom-1 -left-2 w-2.5 h-2.5 rounded-full bg-primary/15 border border-primary/25 animate-pulse" style={{ animationDelay: "600ms" }} />
            </div>
            <h3 className="text-base font-semibold text-foreground/50 mb-2">Adicione uma referência</h3>
            <p className="text-sm text-muted-foreground/35 leading-relaxed mb-5">
              Carregue uma imagem no painel à esquerda, escolha um estilo e gere o stencil aqui
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/25">
              <ArrowLeftCircle className="w-3.5 h-3.5" />
              Comece pelo painel de referência
            </div>
          </motion.div>
        )}

        {image && !isGenerating && !hasResult && (
          <motion.div
            key="loaded"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full flex flex-col items-center justify-center gap-5 p-8"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, hsl(160 84% 39% / 0.04) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex-1 w-full max-w-[560px] max-h-[68%] bg-white">
              <img src={imageUrl} alt="referência" className="w-full h-full object-contain bg-muted/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[10px] text-white/80 font-semibold uppercase tracking-wide">
                Original
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/15">
              <Sparkles className="w-3.5 h-3.5 text-primary/60 shrink-0" />
              <p className="text-xs text-muted-foreground/60">Selecione um estilo e ajuste os controles antes de gerar</p>
            </div>
            <div className="flex gap-3 z-10">
              <Button
                variant="outline"
                onClick={onReplaceImage}
                className="h-10 px-5 gap-2 border-border/50 hover:border-primary/30 hover:bg-primary/5"
              >
                <RefreshCw className="w-4 h-4" />
                Trocar imagem
              </Button>
            </div>
          </motion.div>
        )}

        {isGenerating && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center z-10 bg-background"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, hsl(160 84% 39% / 0.05) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative z-10 flex flex-col items-center gap-8 w-[320px]">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-28 h-28 rounded-full border border-primary/8 animate-ping" style={{ animationDuration: "2s" }} />
                <div className="absolute w-20 h-20 rounded-full border border-primary/12 animate-ping" style={{ animationDuration: "2s", animationDelay: "400ms" }} />
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                  <Wand2 className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-base font-bold text-foreground">Gerando stencil com IA</p>
                <p className="text-xs text-muted-foreground/50">Aguarde enquanto processamos sua referência</p>
              </div>
              <div className="w-full space-y-1.5">
                {processingSteps.map((step, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-500",
                      i < currentStep
                        ? "bg-primary/5 border-primary/10 opacity-40"
                        : i === currentStep
                          ? "bg-primary/10 border-primary/30 shadow-[0_0_16px_rgba(52,211,153,0.1)]"
                          : "bg-muted/5 border-transparent",
                    )}
                  >
                    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                      {i < currentStep
                        ? <CheckCircle2 className="w-4 h-4 text-primary" />
                        : i === currentStep
                          ? <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          : <step.icon className="w-4 h-4 text-muted-foreground/20" />}
                    </div>
                    <span className={cn("text-xs font-medium flex-1", i <= currentStep ? "text-foreground/80" : "text-muted-foreground/25")}>
                      {step.label}
                    </span>
                    {i === currentStep && (
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map((dot) => (
                          <span key={dot} className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: `${dot * 120}ms` }} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {hasResult && !isGenerating && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-5 gap-4"
          >
            <div className="flex flex-wrap items-center justify-center gap-2 z-10 shrink-0">
              <div className="rounded-xl border border-border/40 bg-card/80 p-1 backdrop-blur-sm">
                <Button
                  type="button"
                  size="sm"
                  variant={previewMode === "compare" ? "default" : "ghost"}
                  className="h-8 px-3 text-xs"
                  onClick={() => setPreviewMode("compare")}
                >
                  Comparar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={previewMode === "overlay" ? "default" : "ghost"}
                  className="h-8 px-3 text-xs"
                  onClick={() => setPreviewMode("overlay")}
                >
                  Overlay
                </Button>
              </div>
              <div className="min-w-[220px] rounded-xl border border-border/40 bg-card/80 px-3 py-2 backdrop-blur-sm">
                <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-muted-foreground/70">
                  <span>{previewMode === "compare" ? "Divisor" : "Opacidade do stencil"}</span>
                  <span>{previewMode === "compare" ? `${Math.round(dividerX)}%` : `${stencilOpacity[0]}%`}</span>
                </div>
                <Slider
                  value={previewMode === "compare" ? [dividerX] : stencilOpacity}
                  onValueChange={previewMode === "compare" ? ([value]) => setDividerX(value) : setStencilOpacity}
                  min={5}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <SharedPreviewStage
              imageUrl={imageUrl}
              stencilUrl={buildApiUrl(selectedVersion?.publicUrl)}
              selectedVersion={selectedVersion}
              mode={previewMode}
              dividerX={dividerX}
              stencilOpacity={stencilOpacity[0]}
              onDividerChange={setDividerX}
            />

            <div className="z-10 shrink-0 rounded-lg bg-muted/30 border border-border/30 px-3 py-1.5 text-[10px] font-medium text-muted-foreground/60">
              {previewMode === "compare"
                ? "Original e stencil usam a mesma área visível para comparação precisa"
                : "Ajuste a transparência do stencil mantendo a original fixa abaixo"}
            </div>

            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-4 right-4 z-20"
            >
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/25 text-[11px] font-semibold text-primary shadow-[0_0_16px_rgba(52,211,153,0.15)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Stencil gerado
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
