import { useState, useMemo } from "react";
import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Heart, Eye, RefreshCw, Images } from "lucide-react";
import { cn } from "@/lib/utils";
import { GALLERY_ITEMS, PORTFOLIO_FILTERS, ARTISTS_GALLERY, applyGalleryFilter } from "@/data/galleryMock";
import AddWorkModal from "@/components/gallery/AddWorkModal";
import WorkDetailModal from "@/components/gallery/WorkDetailModal";

export default function FlashGallery() {
  const [items, setItems] = useState(GALLERY_ITEMS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [artistFilter, setArtistFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(
    () => applyGalleryFilter(items, filter, search, artistFilter),
    [items, filter, search, artistFilter]
  );

  const toggleFav = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleAdd = (data) => setItems(prev => [data, ...prev]);

  const handleToggleFeatured = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, featured: !i.featured } : i));
    setSelected(prev => prev?.id === id ? { ...prev, featured: !prev.featured } : prev);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar title="Galeria de Trabalhos" subtitle="Portfólio visual do estúdio" />

      <div className="flex-1 p-3 md:p-5 space-y-4">
        {/* Search + artist + add */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, estilo, tag..."
              className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-sm"
            />
          </div>
          <Select value={artistFilter} onValueChange={setArtistFilter}>
            <SelectTrigger className="h-9 w-36 text-xs bg-white/[0.04] border-white/[0.08]">
              <SelectValue placeholder="Artista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os artistas</SelectItem>
              {ARTISTS_GALLERY.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setShowAdd(true)} className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shrink-0">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar trabalho</span>
          </Button>
        </div>

        {/* Filter pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {PORTFOLIO_FILTERS.map(f => {
            const count = applyGalleryFilter(items, f.id, "", "all").length;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all",
                  filter === f.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-white/[0.03] text-white/45 border-white/[0.07] hover:bg-white/[0.06] hover:text-white/80"
                )}
              >
                {f.label}
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                  filter === f.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 glass-card rounded-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center mb-3">
              <Images className="w-5 h-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {search || artistFilter !== "all" ? "Nenhum resultado encontrado" : "Nenhum trabalho neste filtro"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search ? `Busca por "${search}"` : "Adicione um trabalho ou mude o filtro"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer group hover:border-primary/25 hover:shadow-lg hover:shadow-primary/[0.08] transition-all duration-200"
              >
                {/* Image */}
                <div className={cn("relative bg-gradient-to-br", item.colors)} style={{ paddingBottom: "75%" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-3xl font-black text-white/8 uppercase tracking-tighter text-center px-2 leading-none">
                      {item.style}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex gap-1 flex-wrap">
                    {item.featured && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-500/25 text-violet-300 border border-violet-500/25 font-bold backdrop-blur-sm">
                        Destaque
                      </span>
                    )}
                    {item.exclusive && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/25 font-bold backdrop-blur-sm">
                        Exclusivo
                      </span>
                    )}
                    {item.isNew && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/25 text-blue-300 border border-blue-500/25 font-bold backdrop-blur-sm">
                        Novo
                      </span>
                    )}
                  </div>

                  {/* Fav button */}
                  <button
                    onClick={e => toggleFav(item.id, e)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
                  >
                    <Heart className={cn("w-3.5 h-3.5", favorites.has(item.id) ? "text-rose-400 fill-rose-400" : "text-white/60")} />
                  </button>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                      <Eye className="w-3.5 h-3.5" /> Ver detalhes
                    </div>
                  </div>

                  {/* Repeatable */}
                  {item.repeatable && (
                    <div className="absolute bottom-2.5 right-2.5">
                      <div className="w-5 h-5 rounded-full bg-primary/30 backdrop-blur-sm flex items-center justify-center" title="Disponível para repetir">
                        <RefreshCw className="w-2.5 h-2.5 text-primary" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-bold text-foreground truncate">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{item.style} · {item.artist}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-primary">
                      {item.value > 0 ? `R$ ${item.value.toLocaleString("pt-BR")}` : "—"}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" />{item.likes}</span>
                      <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{item.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddWorkModal open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />
      <WorkDetailModal
        item={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onToggleFeatured={handleToggleFeatured}
      />
    </div>
  );
}