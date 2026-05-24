import { Upload, X, RefreshCw, ImageIcon, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/hooks/useImageUpload";

export default function ReferenceCard({ image, onReplace, onRemove, onClickUpload, isDragOver }) {
  return (
    <div className={cn(
      "bg-card border rounded-xl p-4 transition-all duration-300",
      isDragOver ? "border-primary/50 shadow-[0_0_20px_rgba(52,211,153,0.1)]" : "border-border/50"
    )}>
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Referência</p>

      {!image ? (
        <div
          onClick={onClickUpload}
          className="rounded-lg border border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer p-4 text-center"
        >
          <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center mx-auto mb-2">
            <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
          </div>
          <p className="text-xs text-muted-foreground/70">Nenhuma referência carregada</p>
          <p className="text-[10px] text-muted-foreground/40 mt-0.5">JPG, PNG, WEBP · máx. 10MB</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Thumbnail */}
          <div className="relative rounded-lg overflow-hidden aspect-video bg-muted/30 border border-border/30">
            <img
              src={image.url}
              alt="referência"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* File info */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <FileImage className="w-3 h-3 text-muted-foreground/60 shrink-0" />
              <p className="text-xs text-foreground font-medium truncate">{image.name}</p>
            </div>
            <div className="flex gap-3 text-[10px] text-muted-foreground/60">
              {image.width && image.height && (
                <span>{image.width} × {image.height}px</span>
              )}
              <span>{formatFileSize(image.size)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-7 text-[10px] gap-1 border-border/50 hover:border-primary/40 hover:bg-primary/5"
              onClick={onReplace}
            >
              <RefreshCw className="w-3 h-3" />
              Trocar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 border-border/50 hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
              onClick={onRemove}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}