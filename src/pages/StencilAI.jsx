import { useState, useCallback } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Wand2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";
import ReferenceCard from "@/components/stencil/ReferenceCard";
import StencilCenterArea from "@/components/stencil/StencilCenterArea";
import StencilRightPanel from "@/components/stencil/StencilRightPanel";

const stylePresets = [
  { id: "fine", label: "Fine Line" },
  { id: "bold", label: "Bold Line" },
  { id: "dotwork", label: "Dotwork" },
  { id: "traditional", label: "Traditional" },
  { id: "geometric", label: "Geométrico" },
  { id: "realism", label: "Realismo" },
];

// Sample reference image
const SAMPLE_IMAGE = {
  url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80",
  name: "exemplo_referencia.jpg",
  size: 120000,
  type: "image/jpeg",
  width: 600,
  height: 400,
};

export default function StencilAI() {
  const [image, setImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState("fine");
  const [showBefore, setShowBefore] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(1);

  const handleImageSuccess = useCallback((imageData) => {
    setImage(imageData);
    setHasResult(false);
    setIsGenerating(false);
    toast.success("Imagem carregada com sucesso");
  }, []);

  const handleImageError = useCallback((msg) => {
    toast.error(msg);
  }, []);

  const {
    isDragOver,
    fileInputRef,
    openFilePicker,
    handleFileInputChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    loadFromUrl,
  } = useImageUpload({
    onSuccess: handleImageSuccess,
    onError: handleImageError,
  });

  const handlePasteClick = useCallback(() => {
    navigator.clipboard.read?.().then(items => {
      for (const item of items) {
        const imageType = item.types.find(t => t.startsWith("image/"));
        if (imageType) {
          item.getType(imageType).then(blob => {
            const file = new File([blob], "colado.png", { type: imageType });
            const url = URL.createObjectURL(file);
            handleImageSuccess({ url, name: "imagem_colada.png", size: blob.size, type: imageType });
          });
          return;
        }
      }
      toast.error("Nenhuma imagem encontrada no clipboard.");
    }).catch(() => {
      toast.info("Use Ctrl+V / Cmd+V enquanto a janela estiver ativa para colar uma imagem.");
    });
  }, [handleImageSuccess]);

  const handleUseSample = useCallback(() => {
    setImage(SAMPLE_IMAGE);
    setHasResult(false);
    setIsGenerating(false);
    toast.success("Imagem de exemplo carregada");
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setHasResult(false);
    setIsGenerating(false);
  }, []);

  const handleGenerate = useCallback(() => {
    if (!image) return;
    setIsGenerating(true);
    setHasResult(false);
    setCurrentStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setCurrentStep(step);
      if (step >= 4) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setHasResult(true);
          toast.success("Stencil gerado com sucesso!");
        }, 900);
      }
    }, 1300);
  }, [image]);

  return (
    <div className="min-h-screen">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <Topbar title="Stencil AI" subtitle="Gere stencils profissionais com inteligência artificial" />

      <div className="p-6 flex gap-5 h-[calc(100vh-64px)]">

        {/* ── LEFT PANEL */}
        <div className="w-[268px] flex-shrink-0 space-y-4 overflow-y-auto pb-6">

          {/* Reference Card */}
          <ReferenceCard
            image={image}
            onReplace={openFilePicker}
            onRemove={handleRemoveImage}
            onClickUpload={openFilePicker}
            isDragOver={isDragOver}
          />

          {/* Style Presets */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Estilo</p>
            <div className="grid grid-cols-2 gap-1.5">
              {stylePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={cn(
                    "text-xs py-2 px-3 rounded-lg border transition-all text-center font-medium",
                    selectedPreset === preset.id
                      ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_10px_rgba(52,211,153,0.1)]"
                      : "bg-muted/20 border-border/30 text-muted-foreground hover:border-border hover:text-foreground"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-4">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Controles</p>
            {[
              { label: "Espessura da Linha", defaultValue: [50] },
              { label: "Simplificação", defaultValue: [30] },
              { label: "Contraste", defaultValue: [70] },
            ].map((ctrl) => (
              <div key={ctrl.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{ctrl.label}</span>
                  <span className="text-xs font-mono text-foreground/80">{ctrl.defaultValue[0]}%</span>
                </div>
                <Slider defaultValue={ctrl.defaultValue} max={100} step={1} className="w-full" />
              </div>
            ))}

            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Cor da Linha</span>
              <div className="flex gap-2">
                {["#000000", "#1a1a2e", "#16213e", "#0f3460", "#533483"].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-md border-2 border-border/30 hover:border-primary/50 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Tamanho de Saída</span>
              <Select defaultValue="a4">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 (210×297mm)</SelectItem>
                  <SelectItem value="a3">A3 (297×420mm)</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Debug */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Modo Debug</Label>
              <Switch />
            </div>
          </div>

          {/* Generate */}
          <Button
            onClick={handleGenerate}
            disabled={!image || isGenerating}
            className={cn(
              "w-full h-11 font-semibold gap-2 text-sm transition-all",
              image && !isGenerating
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_25px_rgba(52,211,153,0.2)]"
                : "bg-muted/40 text-muted-foreground border border-border/30"
            )}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {isGenerating ? "Gerando..." : "Gerar Stencil"}
          </Button>
        </div>

        {/* ── CENTER AREA */}
        <StencilCenterArea
          image={image}
          isGenerating={isGenerating}
          hasResult={hasResult}
          currentStep={currentStep}
          showBefore={showBefore}
          setShowBefore={setShowBefore}
          onGenerate={handleGenerate}
          onReplaceImage={openFilePicker}
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClickUpload={openFilePicker}
          onPasteClick={handlePasteClick}
          onUrlSubmit={loadFromUrl}
          onUseSample={handleUseSample}
        />

        {/* ── RIGHT PANEL */}
        <StencilRightPanel
          hasResult={hasResult}
          selectedVersion={selectedVersion}
          setSelectedVersion={setSelectedVersion}
        />
      </div>
    </div>
  );
}