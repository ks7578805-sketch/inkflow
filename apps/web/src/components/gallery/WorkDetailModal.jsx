import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, Layers, MapPin, DollarSign, Heart, Eye, Star, FolderOpen, Wand2, X, User } from "lucide-react";

export default function WorkDetailModal({ item, open, onClose, onToggleFeatured }) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header image area */}
        <div className={cn("h-56 relative bg-gradient-to-br", item.colors)}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-5xl font-black text-white/10 uppercase tracking-tighter">{item.style}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {item.exclusive && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold backdrop-blur-sm">
                Exclusivo
              </span>
            )}
            {item.repeatable && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/25 text-primary border border-primary/30 font-bold backdrop-blur-sm">
                Repetível
              </span>
            )}
            {item.featured && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-violet-500/25 text-violet-300 border border-violet-500/30 font-bold backdrop-blur-sm">
                Destaque
              </span>
            )}
            {item.isNew && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-500/25 text-blue-300 border border-blue-500/30 font-bold backdrop-blur-sm">
                Novo
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="absolute bottom-4 right-4 flex gap-3">
            <span className="flex items-center gap-1.5 text-xs text-white/70 backdrop-blur-sm">
              <Eye className="w-3.5 h-3.5" /> {item.views}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/70 backdrop-blur-sm">
              <Heart className="w-3.5 h-3.5" /> {item.likes}
            </span>
          </div>

          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">{item.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: User, label: "Artista", value: item.artist },
              { icon: MapPin, label: "Placement", value: item.placement },
              { icon: Clock, label: "Duração", value: `${item.duration}h` },
              { icon: Layers, label: "Sessões", value: item.sessions },
            ].map(info => (
              <div key={info.label} className="bg-muted/20 border border-border/30 rounded-xl p-3 text-center">
                <info.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
                <p className="text-xs font-bold text-foreground">{info.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{info.label}</p>
              </div>
            ))}
          </div>

          {/* Value + Style */}
          <div className="flex items-center gap-4">
            <div className="bg-primary/8 border border-primary/20 rounded-xl px-4 py-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <div>
                <p className="text-lg font-bold text-primary">R$ {item.value.toLocaleString("pt-BR")}</p>
                <p className="text-[10px] text-muted-foreground">Valor de referência</p>
              </div>
            </div>
            <div className="flex-1 bg-muted/20 border border-border/30 rounded-xl px-4 py-3">
              <p className="text-sm font-bold text-foreground">{item.style}</p>
              <p className="text-[10px] text-muted-foreground">Estilo</p>
            </div>
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {item.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-muted/30 border border-border/40 text-muted-foreground font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* From project */}
          {item.fromProject && (
            <div className="flex items-center gap-3 bg-muted/20 border border-border/30 rounded-xl p-3">
              <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Originado do projeto</p>
                <p className="text-xs font-medium text-foreground">{item.fromProject}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 gap-1.5">
                <Wand2 className="w-3.5 h-3.5" /> Usar como inspiração
              </Button>
              <Button variant="outline" className="text-xs h-9 gap-1.5">
                <Wand2 className="w-3.5 h-3.5" /> Criar stencil deste
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {item.fromProject && (
                <Button variant="outline" size="sm" className="text-xs h-8 gap-1">
                  <FolderOpen className="w-3 h-3" /> Projeto
                </Button>
              )}
              <Button
                variant="outline" size="sm"
                onClick={() => onToggleFeatured && onToggleFeatured(item.id)}
                className={cn("text-xs h-8 gap-1", item.featured && "text-violet-400 border-violet-500/20")}
              >
                <Star className={cn("w-3 h-3", item.featured && "fill-violet-400")} />
                {item.featured ? "Remover destaque" : "Destacar"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}