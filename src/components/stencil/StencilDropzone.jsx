import { useCallback, useState } from "react";
import { Upload, Link, Clipboard, ImagePlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const formatBadges = ["JPG", "PNG", "WEBP"];

export default function StencilDropzone({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClickUpload,
  onPasteClick,
  onUrlSubmit,
  onUseSample,
}) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");

  const handleUrlSubmit = () => {
    if (urlValue.trim()) {
      onUrlSubmit?.(urlValue.trim());
      setUrlValue("");
      setShowUrlInput(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="w-full h-full flex items-center justify-center p-8"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div
        className={cn(
          "relative w-full max-w-xl flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer",
          "px-10 py-14",
          isDragOver
            ? "border-primary bg-primary/5 shadow-[0_0_60px_rgba(52,211,153,0.12)]"
            : "border-border/40 bg-card/40 hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-[0_0_40px_rgba(52,211,153,0.07)]"
        )}
        onClick={onClickUpload}
      >
        {/* Drag overlay */}
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-10 bg-primary/5 backdrop-blur-sm border-2 border-primary/50"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 text-primary animate-bounce" />
            </div>
            <p className="text-primary font-semibold text-base">Solte a imagem aqui</p>
            <p className="text-primary/60 text-sm mt-1">para usar como referência</p>
          </motion.div>
        )}

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center mb-6">
          <ImagePlus className="w-9 h-9 text-primary/80" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
          Carregue sua imagem de referência
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm leading-relaxed">
          Arraste e solte, clique para selecionar, cole do clipboard ou informe uma URL
        </p>

        {/* Actions */}
        <div
          className="flex flex-wrap gap-3 justify-center mb-8"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="sm"
            className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold"
            onClick={(e) => { e.stopPropagation(); onClickUpload?.(); }}
          >
            <Upload className="w-4 h-4" />
            Selecionar imagem
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 gap-2 border-border/60 hover:border-primary/40 hover:bg-primary/5"
            onClick={(e) => { e.stopPropagation(); onPasteClick?.(); }}
          >
            <Clipboard className="w-4 h-4" />
            Colar imagem
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 px-4 gap-2 border-border/60 hover:border-primary/40 hover:bg-primary/5",
              showUrlInput && "border-primary/40 bg-primary/5"
            )}
            onClick={(e) => { e.stopPropagation(); setShowUrlInput(!showUrlInput); }}
          >
            <Link className="w-4 h-4" />
            Colar URL
          </Button>
        </div>

        {/* URL Input */}
        {showUrlInput && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2">
              <Input
                autoFocus
                placeholder="https://exemplo.com/imagem.jpg"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                className="h-9 text-sm bg-secondary/50 border-border/60 focus:border-primary/50"
              />
              <Button size="sm" className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0" onClick={handleUrlSubmit}>
                Usar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Format badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-4">
          {formatBadges.map((fmt) => (
            <span key={fmt} className="px-2.5 py-1 rounded-md bg-muted/60 border border-border/40 text-[11px] font-mono font-semibold text-muted-foreground tracking-wider">
              {fmt}
            </span>
          ))}
          <span className="text-[11px] text-muted-foreground/50">• máx. 10MB</span>
        </div>

        {/* Sample button */}
        <button
          className="text-xs text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-1.5 mt-1"
          onClick={(e) => { e.stopPropagation(); onUseSample?.(); }}
        >
          <Sparkles className="w-3 h-3" />
          Usar imagem de exemplo
        </button>
      </div>
    </motion.div>
  );
}