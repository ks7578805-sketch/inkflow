import { useState, useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";
import ReferenceCard from "@/components/stencil/ReferenceCard";
import StyleCard from "@/components/stencil/StyleCard";
import SectionBadge from "@/components/stencil/SectionBadge";
import StencilCenterArea from "@/components/stencil/StencilCenterArea";
import { createStencilGeneration, getStencilExportUrl, saveStencilVersion, uploadStencilAsset } from "@/lib/stencil";

// 1:1 — each style produces a single variant with the same id. Kept here so
// the front-end can pick the right version from a (possibly multi-variant)
// generation row coming back from the API.
const STYLE_TO_VARIANT_KIND = {
  fineline: "fineline",
  blackwork: "blackwork",
  realismo: "realismo",
};

export default function StencilAI() {
  const [image, setImage] = useState(null);
  const [asset, setAsset] = useState(null);
  const [generation, setGeneration] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("fineline");
  // GPT Image 2 is the default — produced the cleanest stencils in user
  // testing. Nano Banana 2 stays available via the pill toggle.
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [lineColor, setLineColor] = useState("#080808");
  const [outputSize, setOutputSize] = useState("a4");
  const [transparentBackground, setTransparentBackground] = useState(false);
  // Hybrid "Intensidade" master slider — derives 3 internal knobs
  // (contrast, detail, thickness). Brightness stays neutral at 50 to keep
  // the canvas centred on mid-tones.
  const [intensity, setIntensity] = useState(50);

  // Technical knobs (thickness, simplification, layers) live as fixed defaults
  // — the UI surface stays focused on color/size/transparency. The backend
  // still expects these values per the contract.
  const DEFAULT_LINE_THICKNESS = 50;
  const DEFAULT_SIMPLIFY = 30;
  const DEFAULT_LAYER_COUNT = 2;

  const uploadMutation = useMutation({
    mutationFn: uploadStencilAsset,
    onSuccess: ({ asset: uploadedAsset }) => {
      setAsset(uploadedAsset);
      setGeneration(null);
      setSelectedVersion(null);
    },
    onError: (error) => {
      toast({ title: "Falha ao enviar a imagem", description: error.message, variant: "destructive" });
    },
  });

  const generateMutation = useMutation({
    mutationFn: createStencilGeneration,
    onSuccess: ({ generation: createdGeneration }) => {
      setGeneration(createdGeneration);
      const preferred = createdGeneration.versions.find((version) => version.kind === STYLE_TO_VARIANT_KIND[selectedStyle]) || createdGeneration.versions[0] || null;
      setSelectedVersion(preferred?.id || null);
    },
    onError: (error) => {
      toast({ title: "Falha ao gerar o stencil", description: error.message, variant: "destructive" });
      setGeneration(null);
      setSelectedVersion(null);
    },
  });

  const saveMutation = useMutation({
    mutationFn: (versionId) => saveStencilVersion(versionId),
    onSuccess: ({ generation: nextGeneration }) => {
      setGeneration(nextGeneration);
      toast({ title: "Versão salva com sucesso" });
    },
    onError: (error) => {
      toast({ title: "Falha ao salvar a versão", description: error.message, variant: "destructive" });
    },
  });

  const handleImageSuccess = useCallback((imageData) => {
    setImage(imageData);
    setAsset(null);
    setGeneration(null);
    setSelectedVersion(null);
    if (imageData.file) {
      uploadMutation.mutate(imageData.file);
    }
  }, [uploadMutation]);

  const handleImageError = useCallback((msg) => toast({ title: msg, variant: "destructive" }), []);

  const {
    isDragOver,
    fileInputRef,
    openFilePicker,
    handleFileInputChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  } = useImageUpload({ onSuccess: handleImageSuccess, onError: handleImageError });

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setAsset(null);
    setGeneration(null);
    setSelectedVersion(null);
  }, []);

  const handleGenerate = useCallback(() => {
    if (!asset) {
      toast({ title: "Envie uma imagem antes de gerar o stencil", variant: "destructive" });
      return;
    }

    // Derived from the master Intensidade slider:
    //   thickness = intensity   (low → thin, high → bold)
    //   detail    = intensity   (low → simplified, high → maximum detail)
    //   contrast  = intensity   (low → soft, high → pushed)
    //   brightness = 50 (constant neutral so darks/lights don't shift)
    //   simplify  = 100 - detail (legacy field, kept for backwards compat)
    const thickness = intensity;
    const detail = intensity;
    const contrast = intensity;
    const brightness = 50;

    generateMutation.mutate({
      assetId: asset.id,
      selectedStyle,
      lineThickness: thickness,
      simplify: 100 - detail,
      layerCount: DEFAULT_LAYER_COUNT,
      lineColor,
      outputSize,
      provider: selectedProvider,
      transparentBackground,
      contrast,
      detail,
      brightness,
    });
  }, [asset, generateMutation, lineColor, outputSize, selectedStyle, selectedProvider, transparentBackground, intensity]);

  const currentStep = useMemo(() => {
    if (!generateMutation.isPending) return generation ? 4 : 0;
    if (!asset) return 0;
    return 2;
  }, [asset, generateMutation.isPending, generation]);

  const hasResult = Boolean(generation?.versions?.length);
  const isGenerating = generateMutation.isPending;
  const versions = generation?.versions ?? [];
  const selectedVersionData = versions.find((version) => version.id === selectedVersion) || versions[0] || null;
  const imageForPreview = image && asset ? { ...image, publicUrl: asset.publicUrl } : image;

  const downloadExport = useCallback((format) => {
    if (!selectedVersionData) return;
    window.open(getStencilExportUrl(selectedVersionData.id, format), "_blank", "noopener,noreferrer");
  }, [selectedVersionData]);

  const ControlsContent = (
    <ControlsPanel
      lineColor={lineColor}
      onLineColorChange={setLineColor}
      outputSize={outputSize}
      onOutputSizeChange={setOutputSize}
      transparentBackground={transparentBackground}
      onTransparentBackgroundChange={setTransparentBackground}
      intensity={intensity}
      onIntensityChange={setIntensity}
    />
  );

  const MobileLayout = (
    <div className="flex flex-col min-h-[calc(100vh-112px)] pb-24">
      <div className="p-4 space-y-4">
        <ReferenceCard
          image={imageForPreview}
          onReplace={openFilePicker}
          onRemove={handleRemoveImage}
          onClickUpload={openFilePicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          isDragOver={isDragOver}
        />

        <StyleCard
          selectedStyle={selectedStyle}
          onSelect={setSelectedStyle}
          selectedProvider={selectedProvider}
          onProviderSelect={setSelectedProvider}
        />

        <div className={cn(
          "relative bg-card/95 border border-foreground/[0.07] rounded-md overflow-hidden",
          "shadow-[0_8px_28px_-16px_rgba(0,0,0,0.7)]",
        )}>
          <button
            type="button"
            className="w-full relative"
            onClick={() => setControlsOpen((o) => !o)}
          >
            <SectionBadge step="3" title="Ajustes" hint="Cor, tamanho e transparência" />
            <span className="absolute right-5 top-5 text-foreground/40">
              {controlsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>
          {controlsOpen && <div className="p-5">{ControlsContent}</div>}
        </div>

        <div className="rounded-xl overflow-hidden border border-border/50 bg-card" style={{ minHeight: 280 }}>
          <StencilCenterArea
            image={imageForPreview}
            selectedVersion={selectedVersionData}
            isGenerating={isGenerating}
            hasResult={hasResult}
            currentStep={currentStep}
            onGenerate={handleGenerate}
            onReplaceImage={openFilePicker}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onSave={() => selectedVersionData && saveMutation.mutate(selectedVersionData.id)}
            onExportPdf={() => downloadExport("pdf")}
            onExportPng={() => downloadExport("png")}
            isMobile
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50 p-3 safe-area-bottom">
        <div className="text-[10px] text-muted-foreground/60 mb-2 px-1">
          {uploadMutation.isPending ? 'Enviando imagem...' : generateMutation.isPending ? 'Gerando stencil...' : hasResult ? 'Stencil pronto para salvar ou exportar' : 'Envie a referência e gere o stencil no estilo escolhido'}
        </div>
        {!hasResult ? (
          <Button
            onClick={handleGenerate}
            disabled={!asset || uploadMutation.isPending || isGenerating}
            className={cn(
              "w-full h-12 font-bold gap-2 text-sm rounded-xl transition-all",
              asset && !isGenerating && !uploadMutation.isPending
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_28px_rgba(39,134,95,0.25)]"
                : "bg-muted/20 text-muted-foreground/40 border border-border/20 cursor-not-allowed"
            )}
          >
            {uploadMutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</>
              : isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" />Gerando...</>
                : <><Wand2 className="w-4 h-4" />Gerar Stencil</>}
          </Button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="h-11 text-xs gap-1 border-border/40 font-medium" onClick={() => selectedVersionData && saveMutation.mutate(selectedVersionData.id)} disabled={!selectedVersionData || saveMutation.isPending}>
              Salvar
            </Button>
            <Button variant="outline" className="h-11 text-xs gap-1 border-border/40 font-medium" onClick={() => downloadExport("pdf")} disabled={!selectedVersionData}>
              PDF
            </Button>
            <Button variant="outline" className="h-11 text-xs gap-1 border-border/40 font-medium" onClick={() => downloadExport("png")} disabled={!selectedVersionData}>
              PNG
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const DesktopLayout = (
    <div className="flex flex-1 gap-5 p-4 min-h-0 overflow-hidden">
      <aside className="w-[280px] flex-shrink-0 flex flex-col gap-3.5 overflow-y-auto min-h-0 pb-2 pr-0.5">
        <ReferenceCard
          image={imageForPreview}
          onReplace={openFilePicker}
          onRemove={handleRemoveImage}
          onClickUpload={openFilePicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          isDragOver={isDragOver}
        />
        <StyleCard
          selectedStyle={selectedStyle}
          onSelect={setSelectedStyle}
          selectedProvider={selectedProvider}
          onProviderSelect={setSelectedProvider}
        />
        <div className={cn(
          "relative bg-card/95 border border-foreground/[0.07] rounded-md flex-shrink-0 overflow-hidden",
          "shadow-[0_8px_28px_-16px_rgba(0,0,0,0.7)]",
        )}>
          <SectionBadge step="3" title="Ajustes" hint="Cor, tamanho e transparência" />
          <div className="p-5">{ControlsContent}</div>
        </div>

        <div className={cn(
          "sticky bottom-0 relative bg-card/97 border border-primary/25 rounded-md flex-shrink-0 backdrop-blur-sm overflow-hidden",
          "shadow-[0_12px_36px_-12px_rgba(0,0,0,0.85)]",
        )}>
          <SectionBadge step="4" title="Gerar" hint={hasResult ? "Stencil pronto" : "Manda pra IA"} />
          <div className="p-3.5 space-y-2">
            <Button
              onClick={handleGenerate}
              disabled={!asset || uploadMutation.isPending || isGenerating}
              className={cn(
                "w-full h-11 font-bold gap-2 text-sm transition-all duration-200 rounded-xl",
                asset && !isGenerating && !uploadMutation.isPending
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_28px_rgba(39,134,95,0.25)]"
                  : "bg-muted/20 text-muted-foreground/40 border border-border/20 cursor-not-allowed shadow-none"
              )}
            >
              {uploadMutation.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</>
                : isGenerating
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Gerando...</>
                  : <><Wand2 className="w-4 h-4" />Gerar Stencil</>}
            </Button>
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={!image && !asset && !generation}
              className="w-full text-center text-[11px] font-medium text-muted-foreground/60 hover:text-foreground/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors py-1"
            >
              Resetar
            </button>
          </div>
        </div>
      </aside>

      <StencilCenterArea
        image={imageForPreview}
        selectedVersion={selectedVersionData}
        isGenerating={isGenerating}
        hasResult={hasResult}
        currentStep={currentStep}
        onGenerate={handleGenerate}
        onReplaceImage={openFilePicker}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onSave={() => selectedVersionData && saveMutation.mutate(selectedVersionData.id)}
        onExportPdf={() => downloadExport("pdf")}
        onExportPng={() => downloadExport("png")}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />
      <Topbar title="Stencil AI" subtitle="Gere stencils profissionais com inteligência artificial" />

      <div className="md:hidden flex-1 overflow-y-auto">{MobileLayout}</div>
      <div className="hidden md:flex flex-1 min-h-0 overflow-hidden">{DesktopLayout}</div>
    </div>
  );
}

// 5 stencil-line colors that match what tattoo artists actually transfer with.
// Thin contour lines compress visually — anti-aliased pixels fade fast — so
// every accent colour is biased toward higher luminance/saturation than a
// typical UI palette would use. Otherwise blue/red read as near-black on
// fineline work.
const LINE_COLOR_SWATCHES = [
  { hex: "#080808", label: "Preto" },
  { hex: "#e53935", label: "Vermelho" },
  { hex: "#3b82f6", label: "Azul" },
  { hex: "#22c55e", label: "Verde" },
  { hex: "#a855f7", label: "Violeta" },
];

const INTENSITY_PRESETS = [
  { value: 25, label: "Suave" },
  { value: 50, label: "Padrão" },
  { value: 75, label: "Forte" },
];

function ControlsPanel({
  lineColor,
  onLineColorChange,
  outputSize,
  onOutputSizeChange,
  transparentBackground,
  onTransparentBackgroundChange,
  intensity,
  onIntensityChange,
}) {
  return (
    <div className="space-y-4">
      {/* Sub-block: Intensidade — hybrid master slider that derives the
          4 internal knobs (contrast, detail, thickness, brightness). */}
      <div className="border-l-2 border-l-foreground/15 bg-background/25 px-3.5 py-3">
        <div className="flex items-end justify-between mb-2.5">
          <div>
            <div className="text-[9px] uppercase tracking-[0.20em] text-foreground/45 font-semibold mb-1">Master</div>
            <span className="text-[13px] font-bold text-foreground/95 tracking-tight">Intensidade</span>
          </div>
          <span className="text-[10px] font-mono text-foreground/40 mb-1">{intensity}</span>
        </div>
        <Slider
          value={[intensity]}
          onValueChange={([v]) => onIntensityChange(v)}
          min={0}
          max={100}
          step={1}
          className="w-full mb-2.5"
        />
        <div className="flex gap-1.5">
          {INTENSITY_PRESETS.map((preset) => {
            const active = intensity === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onIntensityChange(preset.value)}
                className={cn(
                  "flex-1 px-2 py-1.5 rounded-sm border text-[10px] font-bold uppercase tracking-[0.14em] transition-all",
                  active
                    ? "bg-primary/15 text-primary border-primary/45"
                    : "bg-background/40 text-foreground/55 border-foreground/[0.08] hover:text-foreground/85 hover:border-foreground/20",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-block: Modo */}
      <button
        type="button"
        onClick={() => onTransparentBackgroundChange(!transparentBackground)}
        className={cn(
          "w-full border-l-2 px-3.5 py-3 text-left transition-all bg-background/25",
          transparentBackground
            ? "border-l-primary bg-primary/[0.04]"
            : "border-l-foreground/15 hover:border-l-foreground/40 hover:bg-background/45",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[9px] uppercase tracking-[0.20em] text-foreground/45 font-semibold mb-1">Modo</div>
            <div className={cn("text-[13px] font-bold leading-tight tracking-tight", transparentBackground ? "text-primary" : "text-foreground/95")}>
              PNG sem fundo
            </div>
            <div className="text-[10.5px] text-foreground/45 leading-snug mt-1">
              Só linhas, transparente — Procreate-ready
            </div>
          </div>
          <div
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors flex-shrink-0",
              transparentBackground ? "bg-primary" : "bg-foreground/15",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-foreground shadow transition-transform",
                transparentBackground ? "translate-x-4" : "translate-x-0.5",
              )}
            />
          </div>
        </div>
      </button>

      {/* Sub-block: Tinta */}
      <div className="border-l-2 border-l-foreground/15 bg-background/25 px-3.5 py-3">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[9px] uppercase tracking-[0.20em] text-foreground/45 font-semibold mb-1">Tinta</div>
            <span className="text-[13px] font-bold text-foreground/95 tracking-tight">Cor da linha</span>
          </div>
          <span className="text-[10px] font-mono text-foreground/40 uppercase mb-1">{lineColor.replace("#","")}</span>
        </div>
        <div className="flex gap-2 justify-between">
          {LINE_COLOR_SWATCHES.map(({ hex, label }) => {
            const active = lineColor === hex;
            return (
              <button
                key={hex}
                type="button"
                title={label}
                aria-label={label}
                onClick={() => onLineColorChange(hex)}
                className={cn(
                  "w-9 h-9 rounded-full border-2 transition-all relative",
                  active
                    ? "border-primary shadow-[0_0_10px_rgba(39,134,95,0.45)] scale-110"
                    : "border-foreground/15 hover:border-foreground/35 hover:scale-105",
                )}
                style={{ backgroundColor: hex }}
              >
                {active && (
                  <span className="absolute -inset-1 rounded-full border border-primary/25 animate-pulse pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-block: Formato */}
      <div className="border-l-2 border-l-foreground/15 bg-background/25 px-3.5 py-3">
        <div className="text-[9px] uppercase tracking-[0.20em] text-foreground/45 font-semibold mb-1">Formato</div>
        <span className="text-[13px] font-bold text-foreground/95 tracking-tight block mb-2.5">Tamanho de saída</span>
        <Select value={outputSize} onValueChange={onOutputSizeChange}>
          <SelectTrigger className="h-9 text-xs bg-background/40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a4">A4 — 210×297mm</SelectItem>
            <SelectItem value="a3">A3 — 297×420mm</SelectItem>
            <SelectItem value="letter">Letter</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
