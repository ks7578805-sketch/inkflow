import { useState, useCallback } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";
import ReferenceCard from "@/components/stencil/ReferenceCard";
import StyleCard from "@/components/stencil/StyleCard";
import StencilCenterArea from "@/components/stencil/StencilCenterArea";
import StencilRightPanel from "@/components/stencil/StencilRightPanel";

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
  const [selectedStyle, setSelectedStyle] = useState("fine");
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
  } = useImageUpload({ onSuccess: handleImageSuccess, onError: handleImageError });

  const handlePasteClick = useCallback(() => {
    navigator.clipboard.read?.().then(items => {
      for (const item of items) {
        const imageType = item.types.find(t => t.startsWith("image/"));
        if (imageType) {
          item.getType(imageType).then(blob => {
            const url = URL.createObjectURL(blob);
            handleImageSuccess({ url, name: "imagem_colada.png", size: blob.size, type: imageType });
          });
          return;
        }
      }
      toast.error("Nenhuma imagem encontrada no clipboard.");
    }).catch(() => {
      toast.info("Use Ctrl+V enquanto a janela estiver ativa.");
    });
  }, [handleImageSuccess]);

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
    <div className="min-h-screen bg-background">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <Topbar
        title="Stencil AI"
        subtitle="Gere stencils profissionais com inteligência artificial"
      />

      <div className="p-5 flex gap-4 h-[calc(100vh-64px)]">

        {/* ── LEFT PANEL */}
        <div className="w-[264px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto pb-4">

          {/* 1. Reference Card — entry point */}
          <ReferenceCard
            image={image}
            onReplace={openFilePicker}
            onRemove={handleRemoveImage}
            onClickUpload={openFilePicker}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            isDragOver={isDragOver}
          />

          {/* 2. Style Card — rich style picker with preview */}
          <StyleCard selectedStyle={selectedStyle} onSelect={setSelectedStyle} />

          {/* 3. Controls */}
          <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b border-border/30">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Controles</span>
            </div>
            <div className="p-4 space-y-4">
              {[
                { label: "Espessura da Linha", value: [50] },
                { label: "Simplificação", value: [30] },
                { label: "Contraste", value: [70] },
              ].map((ctrl) => (
                <div key={ctrl.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-muted-foreground">{ctrl.label}</span>
                    <span className="text-[11px] font-mono text-foreground/70 tabular-nums">{ctrl.value[0]}%</span>
                  </div>
                  <Slider defaultValue={ctrl.value} max={100} step={1} className="w-full" />
                </div>
              ))}

              {/* Line color */}
              <div className="space-y-2">
                <span className="text-[11px] text-muted-foreground">Cor da Linha</span>
                <div className="flex gap-2">
                  {["#0a0a0a", "#1a1a2e", "#16213e", "#0f3460", "#4a1942"].map((color, i) => (
                    <button
                      key={color}
                      className={cn(
                        "w-6 h-6 rounded-lg border-2 transition-all hover:scale-110",
                        i === 0 ? "border-primary/40 ring-1 ring-primary/30" : "border-border/30 hover:border-primary/40"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Output size */}
              <div className="space-y-2">
                <span className="text-[11px] text-muted-foreground">Tamanho de Saída</span>
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
          </div>

          {/* 4. Generate CTA */}
          <Button
            onClick={handleGenerate}
            disabled={!image || isGenerating}
            className={cn(
              "w-full h-11 font-bold gap-2 text-sm transition-all duration-200",
              image && !isGenerating
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_28px_rgba(52,211,153,0.25)] hover:shadow-[0_0_36px_rgba(52,211,153,0.35)] hover:scale-[1.01]"
                : "bg-muted/30 text-muted-foreground/40 border border-border/20 cursor-not-allowed"
            )}
          >
            {isGenerating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Gerando...</>
              : <><Wand2 className="w-4 h-4" /> Gerar Stencil</>
            }
          </Button>
        </div>

        {/* ── CENTER AREA — main stage */}
        <StencilCenterArea
          image={image}
          isGenerating={isGenerating}
          hasResult={hasResult}
          currentStep={currentStep}
          showBefore={showBefore}
          setShowBefore={setShowBefore}
          onGenerate={handleGenerate}
          onReplaceImage={openFilePicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />

        {/* ── RIGHT PANEL */}
        <StencilRightPanel
          hasResult={hasResult}
          selectedVersion={selectedVersion}
          setSelectedVersion={setSelectedVersion}
          image={image}
          selectedStyle={selectedStyle}
        />
      </div>
    </div>
  );
}