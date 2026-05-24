import { motion, AnimatePresence } from "framer-motion";
import { Wand2, RefreshCw, Loader2, CheckCircle2, Clock, Upload, Cpu, Layers, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, Sparkles, ArrowLeftCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const processingSteps = [
  { label: "Na fila", icon: Clock },
  { label: "Preparando imagem", icon: Upload },
  { label: "Gerando com IA", icon: Cpu },
  { label: "Refinando stencil", icon: Wand2 },
  { label: "Finalizando versões", icon: Layers },
];

// Mocked stencil SVG
function StencilSVG() {
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full max-h-[360px] drop-shadow-sm">
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

export default function StencilCenterArea({
  image,
  isGenerating,
  hasResult,
  currentStep,
  showBefore,
  setShowBefore,
  onGenerate,
  onReplaceImage,
  onDragOver,
  onDragLeave,
  onDrop,
}) {
  return (
    <div
      className="flex-1 bg-card border border-border/50 rounded-xl overflow-hidden relative flex items-center justify-center min-h-0"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <AnimatePresence mode="wait">

        {/* ── A: ESTADO VAZIO — espera elegante */}
        {!image && !isGenerating && !hasResult && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center text-center px-10 py-16 max-w-md"
          >
            {/* Icon cluster */}
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-muted/40 to-muted/10 border border-border/30 flex items-center justify-center shadow-inner">
                <Wand2 className="w-10 h-10 text-muted-foreground/20" />
              </div>
              {/* Floating dots */}
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary/20 border border-primary/30 animate-pulse" />
              <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-primary/15 border border-primary/20 animate-pulse" style={{ animationDelay: "500ms" }} />
            </div>

            <h3 className="text-lg font-semibold text-foreground/60 mb-2 leading-tight">
              Adicione uma referência
            </h3>
            <p className="text-sm text-muted-foreground/40 leading-relaxed mb-6 max-w-xs">
              Carregue uma imagem no painel à esquerda, escolha um estilo e gere o stencil aqui
            </p>

            {/* Step hint */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground/30">
              <ArrowLeftCircle className="w-3.5 h-3.5" />
              Comece pelo painel de referência
            </div>

            {/* Decorative grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{
                backgroundImage: "radial-gradient(circle, hsl(160 84% 39%) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </motion.div>
        )}

        {/* ── B: IMAGEM CARREGADA — pronto para gerar */}
        {image && !isGenerating && !hasResult && (
          <motion.div
            key="loaded"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full h-full flex flex-col items-center justify-center gap-5 p-8"
          >
            {/* Subtle grid bg */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
              style={{
                backgroundImage: "radial-gradient(circle, hsl(160 84% 39%) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Image preview */}
            <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-[0_0_40px_rgba(0,0,0,0.4)] flex-1 max-w-[400px] w-full max-h-[58%]">
              <img
                src={image.url}
                alt="referência"
                className="w-full h-full object-contain bg-muted/10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[10px] text-white/80 font-semibold tracking-wide uppercase">
                  Original
                </span>
              </div>
            </div>

            {/* Hint */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/15">
              <Sparkles className="w-3.5 h-3.5 text-primary/70" />
              <p className="text-xs text-muted-foreground/70">Selecione um estilo e ajuste os controles antes de gerar</p>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 relative z-10">
              <Button
                onClick={onGenerate}
                className="h-12 px-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 text-sm shadow-[0_0_40px_rgba(52,211,153,0.3)] transition-all hover:shadow-[0_0_50px_rgba(52,211,153,0.4)] hover:scale-[1.02]"
              >
                <Wand2 className="w-5 h-5" />
                Gerar Stencil
              </Button>
              <Button
                variant="outline"
                onClick={onReplaceImage}
                className="h-12 px-5 gap-2 border-border/50 hover:border-primary/30 hover:bg-primary/5 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Trocar imagem
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── C: GERANDO — overlay com progresso premium */}
        {isGenerating && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            {/* Blurred background */}
            {image && (
              <img
                src={image.url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-[0.07] blur-xl scale-110"
              />
            )}
            <div className="absolute inset-0 bg-background/90 backdrop-blur-md" />

            {/* Progress content */}
            <div className="relative z-10 flex flex-col items-center gap-7 w-80">
              {/* Animated icon */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                  <Wand2 className="w-9 h-9 text-primary" />
                </div>
                <div className="absolute -inset-2 rounded-3xl border border-primary/15 animate-ping opacity-40" />
                <div className="absolute -inset-4 rounded-3xl border border-primary/8 animate-ping opacity-20" style={{ animationDelay: "300ms" }} />
              </div>

              <div className="text-center">
                <p className="text-base font-bold text-foreground mb-1">Gerando stencil com IA</p>
                <p className="text-xs text-muted-foreground/60">Aguarde enquanto processamos sua referência</p>
              </div>

              {/* Steps */}
              <div className="space-y-2 w-full">
                {processingSteps.map((step, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500",
                    i < currentStep
                      ? "bg-primary/5 border-primary/10 opacity-50"
                      : i === currentStep
                        ? "bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(52,211,153,0.12)]"
                        : "bg-muted/10 border-transparent"
                  )}>
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      {i < currentStep ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : i === currentStep ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : (
                        <step.icon className="w-4 h-4 text-muted-foreground/25" />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs font-medium flex-1",
                      i <= currentStep ? "text-foreground" : "text-muted-foreground/30"
                    )}>
                      {step.label}
                    </span>
                    {i === currentStep && (
                      <div className="flex gap-0.5 ml-auto">
                        {[0, 1, 2].map(d => (
                          <span key={d} className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: `${d * 120}ms` }} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── D: RESULTADO — before/after premium */}
        {hasResult && !isGenerating && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative w-full h-full flex flex-col items-center justify-center p-6 gap-4"
          >
            {/* Before/After split view */}
            <div className="relative flex-1 w-full max-w-[480px] max-h-[75%]">
              {showBefore && image ? (
                /* Before — original */
                <motion.div
                  key="before"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full rounded-2xl overflow-hidden border border-border/40 shadow-2xl"
                >
                  <img src={image.url} alt="original" className="w-full h-full object-contain bg-muted/10" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[10px] text-white/80 font-semibold tracking-wide uppercase">
                      Original
                    </span>
                  </div>
                </motion.div>
              ) : (
                /* After — stencil */
                <motion.div
                  key="after"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full rounded-2xl overflow-hidden border border-border/30 shadow-2xl bg-white flex items-center justify-center p-6"
                >
                  <StencilSVG />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-black/10 text-[10px] text-black/50 font-semibold tracking-wide uppercase">
                      Stencil v3
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Controls bar */}
            <div className="flex items-center gap-2 relative z-10">
              <div className="flex rounded-lg overflow-hidden border border-border/40">
                <button
                  onClick={() => setShowBefore(false)}
                  className={cn(
                    "px-4 py-2 text-xs font-medium transition-all flex items-center gap-1.5",
                    !showBefore ? "bg-primary/15 text-primary border-r border-primary/20" : "bg-card text-muted-foreground hover:bg-muted/50 border-r border-border/30"
                  )}
                >
                  <Wand2 className="w-3 h-3" /> Stencil
                </button>
                <button
                  onClick={() => setShowBefore(true)}
                  className={cn(
                    "px-4 py-2 text-xs font-medium transition-all flex items-center gap-1.5",
                    showBefore ? "bg-primary/15 text-primary" : "bg-card text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <Eye className="w-3 h-3" /> Original
                </button>
              </div>

              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm border-border/40">
                  <ZoomIn className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm border-border/40">
                  <ZoomOut className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm border-border/40">
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Success badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-4 right-4"
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