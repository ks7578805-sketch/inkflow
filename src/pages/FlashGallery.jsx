import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Heart, DollarSign, Eye, X, Tag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const flashes = [
  { id: 1, name: "Rosa Delicada", style: "Fine Line", price: "R$ 400", status: "Disponível", exclusive: false, artist: "Marcelo R.", likes: 24, colors: "from-rose-500/20 to-rose-900/30" },
  { id: 2, name: "Dragão Oriental", style: "Japanese", price: "R$ 800", status: "Reservado", exclusive: true, artist: "Marcelo R.", likes: 45, colors: "from-red-500/20 to-orange-900/30" },
  { id: 3, name: "Mandala Geométrica", style: "Geométrico", price: "R$ 500", status: "Disponível", exclusive: false, artist: "Camila S.", likes: 31, colors: "from-blue-500/20 to-indigo-900/30" },
  { id: 4, name: "Lobo Blackwork", style: "Blackwork", price: "R$ 600", status: "Disponível", exclusive: true, artist: "Marcelo R.", likes: 52, colors: "from-gray-500/20 to-gray-900/30" },
  { id: 5, name: "Borboleta Dotwork", style: "Dotwork", price: "R$ 350", status: "Disponível", exclusive: false, artist: "Camila S.", likes: 18, colors: "from-violet-500/20 to-purple-900/30" },
  { id: 6, name: "Serpente Realista", style: "Realismo", price: "R$ 900", status: "Reservado", exclusive: true, artist: "Marcelo R.", likes: 67, colors: "from-emerald-500/20 to-teal-900/30" },
  { id: 7, name: "Crânio Traditional", style: "Traditional", price: "R$ 450", status: "Disponível", exclusive: false, artist: "Camila S.", likes: 29, colors: "from-amber-500/20 to-yellow-900/30" },
  { id: 8, name: "Flor de Lótus", style: "Fine Line", price: "R$ 350", status: "Disponível", exclusive: false, artist: "Marcelo R.", likes: 37, colors: "from-pink-500/20 to-fuchsia-900/30" },
];

export default function FlashGallery() {
  const [selectedFlash, setSelectedFlash] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      <Topbar title="Flash Gallery" subtitle="Catálogo de flashes disponíveis" />

      <div className="p-6 space-y-5">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar flashes..." className="pl-9 h-9 bg-secondary/50 text-sm" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-40 text-xs">
              <SelectValue placeholder="Estilo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estilos</SelectItem>
              <SelectItem value="fineline">Fine Line</SelectItem>
              <SelectItem value="blackwork">Blackwork</SelectItem>
              <SelectItem value="japanese">Japanese</SelectItem>
              <SelectItem value="geometric">Geométrico</SelectItem>
              <SelectItem value="dotwork">Dotwork</SelectItem>
              <SelectItem value="realism">Realismo</SelectItem>
              <SelectItem value="traditional">Traditional</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-36 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="available">Disponível</SelectItem>
              <SelectItem value="reserved">Reservado</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-36 text-xs">
              <SelectValue placeholder="Artista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="marcelo">Marcelo R.</SelectItem>
              <SelectItem value="camila">Camila S.</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 ml-auto">
            <Plus className="w-4 h-4" /> Novo Flash
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-4">
          {flashes.map((flash) => (
            <div
              key={flash.id}
              onClick={() => setSelectedFlash(flash)}
              className="bg-card border border-border/50 rounded-xl overflow-hidden cursor-pointer group hover:border-primary/20 transition-all"
            >
              {/* Image placeholder */}
              <div className={cn("h-48 relative bg-gradient-to-br", flash.colors)}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-background/10 flex items-center justify-center backdrop-blur-sm">
                    <Tag className="w-8 h-8 text-foreground/30" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {flash.exclusive && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/20 font-semibold backdrop-blur-sm">
                      Exclusivo
                    </span>
                  )}
                  {flash.status === "Reservado" && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/20 text-destructive border border-destructive/20 font-semibold backdrop-blur-sm">
                      Reservado
                    </span>
                  )}
                </div>

                {/* Favorite */}
                <button
                  onClick={(e) => toggleFavorite(flash.id, e)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center hover:bg-background/40 transition-colors"
                >
                  <Heart className={cn("w-4 h-4", favorites.has(flash.id) ? "text-rose-400 fill-rose-400" : "text-foreground/60")} />
                </button>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="outline" className="text-xs bg-card/80 backdrop-blur-sm gap-1">
                    <Eye className="w-3 h-3" /> Ver detalhes
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{flash.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{flash.style} · {flash.artist}</p>
                  </div>
                  <p className="text-sm font-bold text-primary">{flash.price}</p>
                </div>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {flash.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Detail Modal */}
      <Dialog open={!!selectedFlash} onOpenChange={() => setSelectedFlash(null)}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle>{selectedFlash?.name}</DialogTitle>
          </DialogHeader>
          {selectedFlash && (
            <div className="space-y-4">
              <div className={cn("h-64 rounded-xl bg-gradient-to-br flex items-center justify-center", selectedFlash.colors)}>
                <Tag className="w-16 h-16 text-foreground/20" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground text-xs">Estilo</span><p className="font-medium">{selectedFlash.style}</p></div>
                <div><span className="text-muted-foreground text-xs">Preço</span><p className="font-bold text-primary">{selectedFlash.price}</p></div>
                <div><span className="text-muted-foreground text-xs">Artista</span><p className="font-medium">{selectedFlash.artist}</p></div>
                <div><span className="text-muted-foreground text-xs">Status</span><p className="font-medium">{selectedFlash.status}</p></div>
                <div><span className="text-muted-foreground text-xs">Tipo</span><p className="font-medium">{selectedFlash.exclusive ? "Exclusivo" : "Repetível"}</p></div>
                <div><span className="text-muted-foreground text-xs">Curtidas</span><p className="font-medium">{selectedFlash.likes}</p></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={selectedFlash.status === "Reservado"}>
                  {selectedFlash.status === "Reservado" ? "Reservado" : "Reservar Flash"}
                </Button>
                <Button variant="outline" className="flex-1">Compartilhar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}