import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Image, Upload, SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["Todos", "Referência", "Antes", "Durante", "Depois", "Cicatrizada", "Stencil"];

const MOCK_MEDIA = [
  { id: 1, cat: "Referência", url: "https://images.unsplash.com/photo-1562962230-16b5bca0e98d?w=300&q=75", label: "Referência 1" },
  { id: 2, cat: "Referência", url: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=300&q=75", label: "Referência 2" },
  { id: 3, cat: "Stencil", url: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=300&q=75", label: "Stencil final" },
  { id: 4, cat: "Antes", url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&q=75", label: "Antes - braço" },
  { id: 5, cat: "Durante", url: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=300&q=75", label: "Sessão 1" },
  { id: 6, cat: "Durante", url: "https://images.unsplash.com/photo-1562962230-16b5bca0e98d?w=300&q=75", label: "Sessão 2" },
];

export default function ProjectDetailMedia({ project }) {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [compareMode, setCompareMode] = useState(false);
  const [comparePos, setComparePos] = useState(50);

  const filtered = activeFilter === "Todos" ? MOCK_MEDIA : MOCK_MEDIA.filter(m => m.cat === activeFilter);
  const before = MOCK_MEDIA.find(m => m.cat === "Antes");
  const after = MOCK_MEDIA.find(m => m.cat === "Durante");

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Actions row */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Arquivo de Mídia</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5" onClick={() => setCompareMode(!compareMode)}>
            <SlidersHorizontal className="w-3.5 h-3.5" /> {compareMode ? "Galeria" : "Comparar"}
          </Button>
          <Button size="sm" className="text-xs h-8 gap-1.5 bg-primary text-primary-foreground">
            <Upload className="w-3.5 h-3.5" /> Adicionar mídia
          </Button>
        </div>
      </div>

      {/* Compare mode */}
      {compareMode && before && after ? (
        <div className="rounded-xl overflow-hidden border border-border/50 bg-card">
          <div className="p-4 border-b border-border/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comparador Antes / Depois</p>
          </div>
          <div
            className="relative h-64 md:h-96 select-none overflow-hidden cursor-col-resize"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setComparePos(((e.clientX - rect.left) / rect.width) * 100);
            }}
          >
            <img src={after.url} alt="depois" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${comparePos}%` }}>
              <img src={before.url} alt="antes" className="w-full h-full object-cover" style={{ minWidth: `${10000 / comparePos}%` }} />
            </div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.8)]" style={{ left: `${comparePos}%` }}>
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-gray-700" />
              </div>
            </div>
            <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-semibold">ANTES</div>
            <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-semibold">DEPOIS</div>
          </div>
        </div>
      ) : null}

      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={cn(
              "shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all border",
              activeFilter === cat
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Image className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhuma mídia nesta categoria</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-border/50 bg-card aspect-square cursor-pointer hover:border-primary/30 transition-all">
              <img src={item.url} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-xs font-semibold text-white">{item.label}</p>
                <span className="text-[9px] text-white/70 bg-white/10 px-1.5 py-0.5 rounded">{item.cat}</span>
              </div>
            </div>
          ))}
          <button className="aspect-square rounded-xl border-2 border-dashed border-border/50 hover:border-primary/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-all">
            <Upload className="w-6 h-6" />
            <span className="text-xs">Adicionar</span>
          </button>
        </div>
      )}
    </div>
  );
}