import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Upload, Move, RotateCw, Save, Maximize2, Grid3x3, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const sizePresets = [
  { label: "P (5cm)", value: 5 },
  { label: "M (10cm)", value: 10 },
  { label: "G (15cm)", value: 15 },
  { label: "GG (20cm)", value: 20 },
];

const savedMockups = [
  { id: 1, label: "Antebraço – v1", area: "Braço esquerdo" },
  { id: 2, label: "Costela – v2", area: "Lateral direita" },
  { id: 3, label: "Panturrilha – v1", area: "Perna direita" },
];

export default function PlacementPreview() {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(10);
  const [opacity, setOpacity] = useState([75]);
  const [rotation, setRotation] = useState([0]);
  const [scale, setScale] = useState([100]);

  return (
    <div className="min-h-screen">
      <Topbar title="Placement Preview" subtitle="Visualize o stencil aplicado no corpo" />

      <div className="p-6 flex gap-6 h-[calc(100vh-64px)]">
        {/* Controls */}
        <div className="w-72 flex-shrink-0 space-y-4 overflow-y-auto pb-6">
          {/* Photo Upload */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Foto do Corpo</Label>
            <div
              onClick={() => setHasPhoto(true)}
              className="border-2 border-dashed border-border/60 rounded-lg p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                {hasPhoto ? "foto_antebraco.jpg" : "Upload da área do corpo"}
              </p>
            </div>
          </div>

          {/* Size Presets */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Tamanho</Label>
            <div className="grid grid-cols-2 gap-2">
              {sizePresets.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setSelectedPreset(p.value)}
                  className={cn(
                    "text-xs py-2 px-3 rounded-lg border transition-all text-center font-medium",
                    selectedPreset === p.value
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-muted/30 border-border/30 text-muted-foreground hover:border-border"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Adjustments */}
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Ajustes</Label>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Escala</span>
                <span className="font-mono text-foreground">{scale[0]}%</span>
              </div>
              <Slider value={scale} onValueChange={setScale} max={200} min={20} step={5} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Rotação</span>
                <span className="font-mono text-foreground">{rotation[0]}°</span>
              </div>
              <Slider value={rotation} onValueChange={setRotation} max={360} min={0} step={1} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Opacidade</span>
                <span className="font-mono text-foreground">{opacity[0]}%</span>
              </div>
              <Slider value={opacity} onValueChange={setOpacity} max={100} min={10} step={5} />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-sm font-medium">
              <Save className="w-4 h-4" /> Salvar Mockup
            </Button>
            <Button variant="outline" className="w-full h-10 gap-2 text-sm">
              <Grid3x3 className="w-4 h-4" /> Comparar
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-card border border-border/50 rounded-xl overflow-hidden relative flex items-center justify-center">
          {!hasPhoto ? (
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                <Move className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground">Faça upload de uma foto da área do corpo</p>
              <p className="text-xs text-muted-foreground/60 mt-1">O stencil será sobreposto na imagem</p>
            </div>
          ) : (
            <div className="relative w-full h-full bg-gradient-to-b from-muted/5 to-muted/20 flex items-center justify-center">
              {/* Body area placeholder */}
              <div className="w-[300px] h-[500px] rounded-2xl bg-gradient-to-b from-[#d4a574]/30 to-[#c69c6d]/20 border border-[#d4a574]/10 relative">
                {/* Stencil overlay */}
                <div
                  className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 rounded-lg flex items-center justify-center cursor-move"
                  style={{
                    opacity: opacity[0] / 100,
                    transform: `translate(-50%, -50%) rotate(${rotation[0]}deg) scale(${scale[0] / 100})`,
                  }}
                >
                  <svg viewBox="0 0 120 150" className="w-full h-full">
                    <path d="M60 10 C30 30 10 60 20 100 C30 130 50 140 60 145 C70 140 90 130 100 100 C110 60 90 30 60 10Z" fill="none" stroke="#1a1a1a" strokeWidth="1.2" />
                    <path d="M45 45 Q55 60 60 45 Q65 60 75 45" fill="none" stroke="#1a1a1a" strokeWidth="0.8" />
                    <circle cx="50" cy="55" r="2" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                    <circle cx="70" cy="55" r="2" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                  </svg>
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] text-muted-foreground/60 bg-background/50 px-2 py-1 rounded">
                  <Move className="w-3 h-3 inline mr-1" />Arraste para reposicionar
                </div>
              </div>

              {/* Toolbar */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5">
                <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm">
                  <RotateCw className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Saved Mockups */}
        <div className="w-56 flex-shrink-0 space-y-4 overflow-y-auto pb-6">
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Mockups Salvos</Label>
            <div className="space-y-2">
              {savedMockups.map((m) => (
                <div key={m.id} className="p-3 rounded-lg bg-muted/30 border border-border/20 hover:border-primary/20 cursor-pointer transition-all">
                  <div className="w-full h-20 rounded bg-gradient-to-br from-muted/40 to-muted/20 mb-2 flex items-center justify-center">
                    <Maximize2 className="w-4 h-4 text-muted-foreground/30" />
                  </div>
                  <p className="text-xs font-medium text-foreground">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground">{m.area}</p>
                </div>
              ))}
              <button className="w-full p-3 rounded-lg border-2 border-dashed border-border/40 text-center text-xs text-muted-foreground hover:border-primary/30 transition-colors flex items-center justify-center gap-1">
                <Plus className="w-3 h-3" /> Novo mockup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}