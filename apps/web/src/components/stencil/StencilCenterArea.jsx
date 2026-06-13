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
  Save,
  Download,
  FileOutput,
  Zap,
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

// Canvas aspect ratio comes from the SOURCE image (or the rendered stencil
// when source dims aren't known yet). Both original and stencil fill the
// canvas edge-to-edge, so the opacity overlay aligns 1:1 — no centred margins,
// no aspect-mismatch when scrubbing.
function getPreviewAspect(selectedVersion) {
  const meta = selectedVersion?.metadata || {};
  if (meta.sourceWidth && meta.sourceHeight) {
    return meta.sourceWidth / meta.sourceHeight;
  }
  if (selectedVersion?.width && selectedVersion?.height) {
    return selectedVersion.width / selectedVersion.height;
  }
  return 2480 / 3508; // A4 fallback
}

function SharedPreviewStage({ imageUrl, stencilUrl, selectedVersion, dividerX, stencilOpacity, onDividerChange }) {
  const aspectRatio = useMemo(() => getPreviewAspect(selectedVersion), [selectedVersion]);
  const containerRef = useRef(null);
  const draggingRef = useRef(false);

  const updateDivider = (clientX) => {
    if (!containerRef.current || !onDividerChange) return;
    const rect = containerRef.current.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    onDividerChange(Math.max(2, Math.min(98, next)));
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
    draggingRef.current = true;
    updateDivider(event.clientX);
    if (event.target?.setPointerCapture && event.pointerId !== undefined) {
      try { event.target.setPointerCapture(event.pointerId); } catch (_e) { /* noop */ }
    }
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return;
    updateDivider(event.clientX);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div className="flex-1 w-full min-h-0 flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-full h-full max-w-full max-h-full rounded-md overflow-hidden border border-foreground/[0.08] shadow-2xl bg-white select-none"
        style={{ aspectRatio, maxHeight: "100%", maxWidth: "100%", cursor: stencilUrl ? "col-resize" : "default" }}
        onPointerDown={stencilUrl ? handlePointerDown : undefined}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(15,23,42,0.015)_25%,transparent_25%,transparent_50%,rgba(15,23,42,0.015)_50%,rgba(15,23,42,0.015)_75%,transparent_75%,transparent)] bg-[length:18px_18px]" />

        {/* Original — always full coverage */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="original"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        )}

        {/* Stencil overlay — clipped by divider AND attenuated by opacity, so
            the user can tune both knobs simultaneously. Setting opacity to 0
            effectively hides the stencil (sees the original everywhere);
            setting divider to 100 also hides it. */}
        {stencilUrl ? (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: `inset(0 0 0 ${dividerX}%)`,
              opacity: stencilOpacity / 100,
            }}
          >
            <img
              src={stencilUrl}
              alt="stencil"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <StencilSVG className="w-full h-full max-h-[80%] max-w-[60%]" />
          </div>
        )}

        {/* Labels — ANTES on the visible original side, DEPOIS on the stencil side */}
        <div className="absolute top-3 left-3 rounded-sm bg-black/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/95 backdrop-blur-sm z-20">
          Antes
        </div>
        {stencilUrl && (
          <div className="absolute top-3 right-3 rounded-sm bg-black/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/95 backdrop-blur-sm z-20">
            Depois
          </div>
        )}

        {/* Vertical divider with circular handle */}
        {stencilUrl && (
          <div
            className="absolute top-0 bottom-0 z-30 flex items-center justify-center cursor-col-resize touch-none"
            style={{ left: `calc(${dividerX}% - 1px)` }}
          >
            <div className="w-0.5 h-full bg-primary/85 shadow-[0_0_12px_rgba(39,134,95,0.55)]" />
            <div className="absolute flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-card/95 backdrop-blur-sm shadow-[0_0_18px_rgba(39,134,95,0.45)]">
              <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M6 4l-4 4 4 4M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
  onSave,
  onExportPdf,
  onExportPng,
  isMobile = false,
}) {
  const [dividerX, setDividerX] = useState(50);
  const [stencilOpacity, setStencilOpacity] = useState([100]);

  useEffect(() => {
    setDividerX(50);
    setStencilOpacity([100]);
  }, [selectedVersion?.id]);

  const imageUrl = (image?.publicUrl ? buildApiUrl(image.publicUrl) : null) || image?.url;

  return (
    <div
      className={cn(
        "relative bg-card/95 border border-foreground/[0.07] rounded-md overflow-hidden flex items-center justify-center",
        "shadow-[0_12px_36px_-16px_rgba(0,0,0,0.7)]",
        isMobile ? "w-full min-h-[300px]" : "flex-1 min-w-0 min-h-0",
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Top hairline — primary emerald, anchors the eye like the sidebar cards */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent z-10" />
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
                backgroundImage: "radial-gradient(circle, hsl(158 55% 34% / 0.05) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-md bg-card/70 border border-foreground/[0.08] flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-foreground/25" />
              </div>
              <span className="absolute -top-px inset-x-2 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            </div>
            <h3 className="text-[14px] font-bold uppercase tracking-[0.16em] text-foreground/75 mb-2">
              Pré-visualização
            </h3>
            <p className="text-[12px] text-foreground/40 leading-relaxed max-w-[34ch]">
              Suba uma referência na <span className="text-primary font-semibold">Etapa 01</span> à esquerda pra começar.
            </p>
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
                          ? "bg-primary/10 border-primary/30 shadow-[0_0_16px_rgba(39,134,95,0.1)]"
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
            <div className="flex flex-wrap items-center justify-center gap-3 z-10 shrink-0">
              {/* Divisor slider — controls the vertical clip-path */}
              <div className="min-w-[220px] rounded-md border border-foreground/[0.08] bg-card/85 px-3 py-2 backdrop-blur-sm">
                <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/55">
                  <span>Divisor</span>
                  <span className="text-foreground/85 font-mono">{Math.round(dividerX)}%</span>
                </div>
                <Slider
                  value={[dividerX]}
                  onValueChange={([value]) => setDividerX(value)}
                  min={2}
                  max={98}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Opacidade slider — controls overlay alpha (independent of divider) */}
              <div className="min-w-[220px] rounded-md border border-foreground/[0.08] bg-card/85 px-3 py-2 backdrop-blur-sm">
                <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/55">
                  <span>Opacidade</span>
                  <span className="text-foreground/85 font-mono">{stencilOpacity[0]}%</span>
                </div>
                <Slider
                  value={stencilOpacity}
                  onValueChange={setStencilOpacity}
                  min={0}
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
              dividerX={dividerX}
              stencilOpacity={stencilOpacity[0]}
              onDividerChange={setDividerX}
            />

            <div className="z-10 shrink-0 flex flex-col items-center gap-2.5 w-full max-w-[720px]">
              {/* Action row: Save / PDF / PNG — merged from former StencilRightPanel */}
              {(onSave || onExportPdf || onExportPng) && (
                <div className="w-full grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={onSave}
                    disabled={!onSave || !selectedVersion}
                    className={cn(
                      "group flex items-center justify-center gap-2 h-10 rounded-xl border text-[12px] font-semibold transition-all",
                      "border-[#27865f]/30 bg-card/80 text-foreground/80 backdrop-blur-sm",
                      "hover:border-primary/55 hover:bg-primary/[0.08] hover:text-primary",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                    )}
                  >
                    <Save className="w-3.5 h-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={onExportPdf}
                    disabled={!onExportPdf || !selectedVersion}
                    className={cn(
                      "group flex items-center justify-center gap-2 h-10 rounded-xl border text-[12px] font-semibold transition-all",
                      "border-[#27865f]/30 bg-card/80 text-foreground/80 backdrop-blur-sm",
                      "hover:border-primary/55 hover:bg-primary/[0.08] hover:text-primary",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                    )}
                  >
                    <FileOutput className="w-3.5 h-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={onExportPng}
                    disabled={!onExportPng || !selectedVersion}
                    className={cn(
                      "group flex items-center justify-center gap-2 h-10 rounded-xl border text-[12px] font-semibold transition-all",
                      "border-primary/40 bg-primary/[0.08] text-primary",
                      "hover:bg-primary/[0.14] hover:border-primary/60",
                      "shadow-[0_0_18px_-6px_rgba(39,134,95,0.45)]",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                    )}
                  >
                    <Download className="w-3.5 h-3.5" />
                    PNG
                  </button>
                </div>
              )}
              <div className="rounded-sm bg-muted/30 border border-foreground/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/55">
                Arraste o divisor pra comparar — arraste a opacidade pra sobrepor
              </div>
              <div className="w-full rounded-lg border border-primary/20 bg-primary/[0.04] px-3 py-2 text-[10.5px] leading-snug text-foreground/70">
                <span className="font-semibold text-primary mr-1">Procreate:</span>
                pressione e segure o stencil acima, escolha <span className="font-medium text-foreground/90">Copiar</span> e cole direto no Procreate pra editar.
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-5 right-5 z-20"
            >
              <span className="flex items-center gap-2 px-3 py-1.5 border border-primary/30 bg-card/70 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Zap className="w-3 h-3" />
                Qualidade alta
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
