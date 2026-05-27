import { useState, useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import ContrastPreview from "@/components/stencil/ContrastPreview";
import LayerSelector from "@/components/stencil/LayerSelector";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";
import ReferenceCard from "@/components/stencil/ReferenceCard";
import StyleCard from "@/components/stencil/StyleCard";
import StencilCenterArea from "@/components/stencil/StencilCenterArea";
import StencilRightPanel from "@/components/stencil/StencilRightPanel";
import { createStencilGeneration, getStencilExportUrl, saveStencilVersion, uploadStencilAsset } from "@/lib/stencil";

const STYLE_TO_VARIANT_KIND = {
  fine: "line_only",
  bold: "heavy_shade",
  dotwork: "light_shade",
  traditional: "heavy_shade",
  geometric: "line_only",
  realism: "light_shade",
};

export default function StencilAI() {
  const [image, setImage] = useState(null);
  const [asset, setAsset] = useState(null);
  const [generation, setGeneration] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("fine");
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [contrastValue, setContrastValue] = useState(50);
  const [layerCount, setLayerCount] = useState(2);
  const [lineThickness, setLineThickness] = useState([50]);
  const [simplify, setSimplify] = useState([30]);
  const [lineColor, setLineColor] = useState("#080808");
  const [outputSize, setOutputSize] = useState("a4");

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

    generateMutation.mutate({
      assetId: asset.id,
      selectedStyle,
      lineThickness: lineThickness[0],
      simplify: simplify[0],
      layerCount,
      lineColor,
      outputSize,
    });
  }, [asset, generateMutation, lineColor, lineThickness, layerCount, outputSize, selectedStyle, simplify]);

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
      image={imageForPreview}
      contrastValue={contrastValue}
      onContrastChange={setContrastValue}
      layerCount={layerCount}
      onLayerChange={setLayerCount}
      lineThickness={lineThickness}
      onLineThicknessChange={setLineThickness}
      simplify={simplify}
      onSimplifyChange={setSimplify}
      lineColor={lineColor}
      onLineColorChange={setLineColor}
      outputSize={outputSize}
      onOutputSizeChange={setOutputSize}
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

        <StyleCard selectedStyle={selectedStyle} onSelect={setSelectedStyle} />

        <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3.5 border-b border-border/30"
            onClick={() => setControlsOpen((o) => !o)}
          >
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Controles</span>
            {controlsOpen
              ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
              : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {controlsOpen && <div className="p-4">{ControlsContent}</div>}
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
            isMobile
          />
        </div>

        {hasResult && (
          <StencilRightPanel
            hasResult={hasResult}
            versions={versions}
            selectedVersion={selectedVersionData?.id || null}
            selectedVersionData={selectedVersionData}
            setSelectedVersion={setSelectedVersion}
            selectedStyle={selectedStyle}
            onSave={() => selectedVersionData && saveMutation.mutate(selectedVersionData.id)}
            onExportPdf={() => downloadExport("pdf")}
            onExportPng={() => downloadExport("png")}
            isMobile
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50 p-3 safe-area-bottom">
        <div className="text-[10px] text-muted-foreground/60 mb-2 px-1">
          {uploadMutation.isPending ? 'Enviando imagem...' : generateMutation.isPending ? 'Gerando stencil...' : hasResult ? 'Stencil pronto para salvar ou exportar' : 'Envie a referência e gere 3 variações de stencil'}
        </div>
        {!hasResult ? (
          <Button
            onClick={handleGenerate}
            disabled={!asset || uploadMutation.isPending || isGenerating}
            className={cn(
              "w-full h-12 font-bold gap-2 text-sm rounded-xl transition-all",
              asset && !isGenerating && !uploadMutation.isPending
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_28px_rgba(52,211,153,0.25)]"
                : "bg-muted/20 text-muted-foreground/40 border border-border/20 cursor-not-allowed"
            )}
          >
            {uploadMutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</>
              : isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" />Gerando...</>
                : <><Wand2 className="w-4 h-4" />Gerar 3 Stencils</>}
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
    <div className="flex flex-1 gap-4 p-4 min-h-0 overflow-hidden">
      <aside className="w-[260px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto min-h-0 pb-2 pr-0.5">
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
        <StyleCard selectedStyle={selectedStyle} onSelect={setSelectedStyle} />
        <div className="bg-card border border-border/50 rounded-xl flex-shrink-0">
          <div className="px-4 pt-3.5 pb-3 border-b border-border/30">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Controles</span>
          </div>
          <div className="p-4">{ControlsContent}</div>
        </div>
        <div className="sticky bottom-0 pt-1 pb-0.5">
          <Button
            onClick={handleGenerate}
            disabled={!asset || uploadMutation.isPending || isGenerating}
            className={cn(
              "w-full h-11 font-bold gap-2 text-sm transition-all duration-200 rounded-xl",
              asset && !isGenerating && !uploadMutation.isPending
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_28px_rgba(52,211,153,0.25)]"
                : "bg-muted/20 text-muted-foreground/40 border border-border/20 cursor-not-allowed shadow-none"
            )}
          >
            {uploadMutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</>
              : isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" />Gerando...</>
                : <><Wand2 className="w-4 h-4" />Gerar 3 Stencils</>}
          </Button>
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
      />

      <StencilRightPanel
        hasResult={hasResult}
        versions={versions}
        selectedVersion={selectedVersionData?.id || null}
        selectedVersionData={selectedVersionData}
        setSelectedVersion={setSelectedVersion}
        selectedStyle={selectedStyle}
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

function ControlsPanel({
  image,
  contrastValue,
  onContrastChange,
  layerCount,
  onLayerChange,
  lineThickness,
  onLineThicknessChange,
  simplify,
  onSimplifyChange,
  lineColor,
  onLineColorChange,
  outputSize,
  onOutputSizeChange,
}) {
  return (
    <div className="space-y-4">
      {[
        { label: "Espessura da Linha", value: lineThickness, onChange: onLineThicknessChange },
        { label: "Simplificação", value: simplify, onChange: onSimplifyChange },
      ].map((ctrl) => (
        <div key={ctrl.label}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] text-muted-foreground/80">{ctrl.label}</span>
            <span className="text-[11px] font-mono text-foreground/60 tabular-nums w-8 text-right">{ctrl.value[0]}</span>
          </div>
          <Slider value={ctrl.value} onValueChange={ctrl.onChange} max={100} step={1} className="w-full" />
        </div>
      ))}

      <LayerSelector value={layerCount} onChange={onLayerChange} />
      <ContrastPreview image={image} value={contrastValue} onChange={onContrastChange} />

      <div>
        <span className="text-[11px] text-muted-foreground/80 block mb-2">Cor da Linha</span>
        <div className="flex gap-2">
          {["#080808", "#1a1a2e", "#16213e", "#0f3460", "#3d1035"].map((color) => (
            <button
              key={color}
              onClick={() => onLineColorChange(color)}
              className={cn(
                "w-7 h-7 rounded-md border-2 transition-all",
                lineColor === color ? "border-primary shadow-[0_0_6px_rgba(52,211,153,0.4)] scale-110" : "border-border/40"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <span className="text-[11px] text-muted-foreground/80 block mb-2">Tamanho de Saída</span>
        <Select value={outputSize} onValueChange={onOutputSizeChange}>
          <SelectTrigger className="h-9 text-xs">
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
