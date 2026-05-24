import { motion, AnimatePresence } from "framer-motion";
import { Wand2, RefreshCw, Loader2, CheckCircle2, Clock, Upload, Cpu, Layers, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StencilDropzone from "./StencilDropzone";

const processingSteps = [
  { label: "Na fila", icon: Clock },
  { label: "Preparando imagem", icon: Upload },
  { label: "Gerando com IA", icon: Cpu },
  { label: "Refinando stencil", icon: Wand2 },
  { label: "Finalizando versões", icon: Layers },
];

export default function StencilCenterArea({
  image,
  isGenerating,
  hasResult,
  currentStep,
  showBefore,
  setShowBefore,
  onGenerate,
  onReplaceImage,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClickUpload,
  onPasteClick,
  onUrlSubmit,
  onUseSample,
}) {
  return (
    <div className="flex-1 bg-card border border-border/50 rounded-xl overflow-hidden relative flex items-center justify-center min-h-0">
      <AnimatePresence mode="wait">

        {/* ── ESTADO VAZIO ─ dropzone premium */}
        {!image && !isGenerating && !hasResult && (
          <StencilDropzone
            key="dropzone"
            isDragOver={isDragOver}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClickUpload={onClickUpload}
            onPasteClick={onPasteClick}
            onUrlSubmit={onUrlSubmit}
            onUseSample={onUseSample}
          />
        )}

        {/* ── IMAGEM CARREGADA – pronta para gerar */}
        {image && !isGenerating && !hasResult && (
          <motion.div
            key="loaded"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full h-full flex flex-col items-center justify-center gap-5 p-8"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {/* Preview da imagem */}
            <div className="relative rounded-xl overflow-hidden border border-border/30 shadow-2xl max-w-sm w-full flex-1 max-h-[65%]">
              <img
                src={image.url}
                alt="referência"
                className="w-full h-full object-contain bg-muted/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-white/80 font-medium">Original</span>
              </div>
            </div>

            {/* Hint */}
            <p className="text-xs text-muted-foreground/60 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-primary/50" />
              Ajuste estilo e controles antes de gerar
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={onGenerate}
                className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 text-sm shadow-[0_0_30px_rgba(52,211,153,0.25)]"
              >
                <Wand2 className="w-4 h-4" />
                Gerar Stencil
              </Button>
              <Button
                variant="outline"
                onClick={onReplaceImage}
                className="h-11 px-5 gap-2 border-border/60 hover:border-primary/40 hover:bg-primary/5"
              >
                <RefreshCw className="w-4 h-4" />
                Trocar imagem
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── GERANDO – overlay com progresso */}
        {isGenerating && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            {/* Background image blurred */}
            {image && (
              <img
                src={image.url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-10 blur-sm scale-105"
              />
            )}
            <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />

            {/* Progress panel */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              {/* Spinner */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Wand2 className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -inset-1 rounded-2xl border border-primary/20 animate-ping opacity-30" />
              </div>

              <div className="text-center">
                <p className="text-base font-semibold text-foreground mb-1">Gerando stencil...</p>
                <p className="text-xs text-muted-foreground">Usando IA para criar o stencil perfeito</p>
              </div>

              {/* Steps */}
              <div className="space-y-2 w-72">
                {processingSteps.map((step, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-500",
                    i < currentStep ? "bg-primary/5 border-primary/10 opacity-60" :
                    i === currentStep ? "bg-primary/10 border-primary/30 shadow-[0_0_15px_rgba(52,211,153,0.1)]" :
                    "bg-muted/10 border-transparent"
                  )}>
                    {i < currentStep ? (
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : i === currentStep ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                    ) : (
                      <step.icon className="w-4 h-4 text-muted-foreground/30 flex-shrink-0" />
                    )}
                    <span className={cn(
                      "text-xs font-medium",
                      i <= currentStep ? "text-foreground" : "text-muted-foreground/30"
                    )}>{step.label}</span>

                    {i === currentStep && (
                      <div className="ml-auto flex gap-0.5">
                        {[0,1,2].map(d => (
                          <span key={d} className="w-1 h-1 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: `${d * 150}ms` }} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── RESULTADO */}
        {hasResult && !isGenerating && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative w-full h-full flex items-center justify-center p-6"
          >
            {/* Stencil canvas */}
            <div className="relative rounded-xl overflow-hidden border border-border/30 shadow-2xl max-w-sm w-full flex-1 max-h-[80%] bg-white">
              <div className="w-full h-full min-h-[400px] flex items-center justify-center p-6">
                <svg viewBox="0 0 200 240" className="w-full h-full max-h-[380px] drop-shadow-sm">
                  <path d="M100 20 C60 40 30 80 40 140 C50 200 80 220 100 230 C120 220 150 200 160 140 C170 80 140 40 100 20Z" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                  <path d="M80 60 Q90 80 100 60 Q110 80 120 60" fill="none" stroke="#0f172a" strokeWidth="1" />
                  <path d="M70 100 Q100 130 130 100" fill="none" stroke="#0f172a" strokeWidth="1" />
                  <circle cx="85" cy="80" r="3" fill="none" stroke="#0f172a" strokeWidth="0.8" />
                  <circle cx="115" cy="80" r="3" fill="none" stroke="#0f172a" strokeWidth="0.8" />
                  <path d="M60 150 Q80 170 100 150 Q120 170 140 150" fill="none" stroke="#0f172a" strokeWidth="0.8" />
                  <path d="M55 120 Q65 115 70 125 Q75 130 80 120" fill="none" stroke="#0f172a" strokeWidth="0.6" />
                  <path d="M120 120 Q130 115 135 125 Q140 130 145 120" fill="none" stroke="#0f172a" strokeWidth="0.6" />
                </svg>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-1 rounded-md bg-black/10 text-[10px] text-black/50 font-medium">Stencil v3</span>
              </div>
            </div>

            {/* Controls overlay */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBefore(!showBefore)}
                className="h-8 text-xs gap-1.5 bg-card/80 backdrop-blur-sm border-border/50"
              >
                {showBefore ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showBefore ? "Ocultar original" : "Ver original"}
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm border-border/50">
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm border-border/50">
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm border-border/50">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Badge result */}
            <div className="absolute top-4 right-4">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[11px] font-semibold text-primary">
                <CheckCircle2 className="w-3 h-3" />
                Gerado com sucesso
              </span>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}