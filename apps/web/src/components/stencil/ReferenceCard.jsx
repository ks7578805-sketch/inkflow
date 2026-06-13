import { useState } from "react";
import { Upload, X, RefreshCw, FileImage, CheckCircle2, Maximize2, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/hooks/useImageUpload";
import { motion, AnimatePresence } from "framer-motion";
import SectionBadge from "./SectionBadge";

export default function ReferenceCard({
  image,
  onReplace,
  onRemove,
  onClickUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver,
}) {
  const [showFull, setShowFull] = useState(false);

  return (
    <>
      {/* Full-size preview modal */}
      <AnimatePresence>
        {showFull && image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowFull(false)}
          >
            <img src={image.url} alt="referência" className="max-w-full max-h-full rounded-xl shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "relative bg-card/95 rounded-md border transition-all duration-300 overflow-hidden flex-shrink-0",
          "shadow-[0_8px_28px_-16px_rgba(0,0,0,0.7)]",
          isDragOver
            ? "border-primary/55 bg-primary/[0.03]"
            : image
              ? "border-primary/25"
              : "border-foreground/[0.07] hover:border-foreground/[0.12]"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* Numbered header */}
        <div className="relative">
          <SectionBadge step="1" title="Referência" hint="Imagem base do stencil" />
          {image && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-medium text-primary">
              <CheckCircle2 className="w-3 h-3" />
              Carregada
            </span>
          )}
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {!image ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Drop / click zone */}
                <div
                  onClick={onClickUpload}
                  className={cn(
                    "rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 p-5 text-center",
                    isDragOver
                      ? "border-primary/60 bg-primary/5"
                      : "border-border/40 hover:border-primary/30 hover:bg-primary/[0.03]"
                  )}
                >
                  {isDragOver ? (
                    <div className="py-2">
                      <Upload className="w-6 h-6 text-primary mx-auto mb-2 animate-bounce" />
                      <p className="text-xs font-semibold text-primary">Solte para carregar</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/30 flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-5 h-5 text-muted-foreground/50" />
                      </div>
                      <p className="text-xs font-medium text-foreground/70 mb-1">Nenhuma referência carregada</p>
                      <p className="text-[10px] text-muted-foreground/50 mb-3 leading-relaxed">
                        Clique, arraste ou cole uma imagem
                      </p>
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {["JPG", "PNG", "WEBP"].map(f => (
                          <span key={f} className="px-1.5 py-0.5 rounded bg-muted/50 border border-border/30 text-[9px] font-mono font-semibold text-muted-foreground/70 tracking-wider">
                            {f}
                          </span>
                        ))}
                        <span className="text-[9px] text-muted-foreground/40">• máx. 10MB</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Clipboard hint */}
                <p className="text-[10px] text-muted-foreground/40 text-center mt-2.5 flex items-center justify-center gap-1">
                  <Clipboard className="w-2.5 h-2.5" />
                  Ctrl+V para colar do clipboard
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="loaded"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Thumbnail */}
                <div
                  className="relative rounded-lg overflow-hidden border border-border/30 group cursor-pointer"
                  onClick={() => setShowFull(true)}
                  style={{ aspectRatio: "4/3" }}
                >
                  <img
                    src={image.url}
                    alt="referência"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-200" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 rounded-md bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Maximize2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[9px] text-white/90 font-medium">
                      Original
                    </span>
                  </div>
                </div>

                {/* File metadata */}
                <div className="bg-muted/20 rounded-lg px-3 py-2.5 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <FileImage className="w-3 h-3 text-primary/70 shrink-0" />
                    <p className="text-xs font-medium text-foreground truncate">{image.name}</p>
                  </div>
                  <div className="flex gap-3 text-[10px] text-muted-foreground/60">
                    {image.width && image.height ? (
                      <span>{image.width}×{image.height}px</span>
                    ) : null}
                    <span>{formatFileSize(image.size)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-[11px] gap-1.5 border-border/40 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    onClick={onReplace}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Trocar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-border/40 hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
                    onClick={onRemove}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}