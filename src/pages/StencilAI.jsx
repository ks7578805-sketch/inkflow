import { useState, useCallback, useEffect } from "react";
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

export default function StencilAI() {
  const [image, setImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState("fine");
  const [selectedVersion, setSelectedVersion] = useState(1);

  const handleImageSuccess = useCallback((imageData) => {
    setImage(imageData);
    setHasResult(false);
    setIsGenerating(false);
    toast.success("Imagem carregada com sucesso");
  }, []);

  const handleImageError = useCallback((msg) => toast.error(msg), []);

  const {
    isDragOver,
    fileInputRef,
    openFilePicker,
    handleFileInputChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  } = useImageUpload({ onSuccess: handleImageSuccess, onError: handleImageError });

  // Ctrl+V paste globally
  useEffect(() => {
    const handlePaste = (e) => {
      const item = Array.from(e.clipboardData?.items || []).find(i => i.type.startsWith("image/"));
      if (!item) return;
      const blob = item.getAsFile();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      handleImageSuccess({ url, name: "imagem_colada.png", size: blob.size, type: blob.type });
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
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
    /* Full-screen shell — 100vh minus the app sidebar topbar */
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <Topbar title="Stencil AI" subtitle="Gere stencils profissionais com inteligência artificial" />

      {/* Main 3-column workspace — takes all remaining height */}
      <div className="flex flex-1 gap-4 p-4 min-h-0 overflow-hidden">

        {/* ── LEFT PANEL — scrollable independently */}
        <aside className="w-[260px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto min-h-0 pb-2 pr-0.5">

          {/* 1. Reference */}
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

          {/* 2. Style */}
          <StyleCard selectedStyle={selectedStyle} onSelect={setSelectedStyle} />

          {/* 3. Controls */}
          <ControlsCard />

          {/* 4. Generate CTA — sticky at the bottom */}
          <div className="sticky bottom-0 pt-1 pb-0.5">
            <Button
              onClick={handleGenerate}
              disabled={!image || isGenerating}
              className={cn(
                "w-full h-11 font-bold gap-2 text-sm transition-all duration-200 rounded-xl",
                image && !isGenerating
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_28px_rgba(52,211,153,0.25)] hover:shadow-[0_0_36px_rgba(52,211,153,0.35)]"
                  : "bg-muted/20 text-muted-foreground/40 border border-border/20 cursor-not-allowed shadow-none"
              )}
            >
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" />Gerando...</>
                : <><Wand2 className="w-4 h-4" />Gerar Stencil</>
              }
            </Button>
          </div>
        </aside>

        {/* ── CENTER AREA — main stage, fills remaining space */}
        <StencilCenterArea
          image={image}
          isGenerating={isGenerating}
          hasResult={hasResult}
          currentStep={currentStep}
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
          selectedStyle={selectedStyle}
        />
      </div>
    </div>
  );
}

/* Controls sub-component — self-contained */
function ControlsCard() {
  const [values, setValues] = useState({ line: [50], simplify: [30], contrast: [70] });
  const [activeColor, setActiveColor] = useState(0);

  const set = (key) => (val) => setValues(v => ({ ...v, [key]: val }));

  return (
    <div className="bg-card border border-border/50 rounded-xl flex-shrink-0">
      <div className="px-4 pt-3.5 pb-3 border-b border-border/30">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Controles</span>
      </div>
      <div className="p-4 space-y-4">
        {[
          { label: "Espessura da Linha", key: "line", val: values.line },
          { label: "Simplificação", key: "simplify", val: values.simplify },
          { label: "Contraste", key: "contrast", val: values.contrast },
        ].map((ctrl) => (
          <div key={ctrl.key}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] text-muted-foreground/80">{ctrl.label}</span>
              <span className="text-[11px] font-mono text-foreground/60 tabular-nums w-8 text-right">{ctrl.val[0]}</span>
            </div>
            <Slider
              value={ctrl.val}
              onValueChange={set(ctrl.key)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        ))}

        {/* Line color */}
        <div>
          <span className="text-[11px] text-muted-foreground/80 block mb-2">Cor da Linha</span>
          <div className="flex gap-2">
            {["#080808", "#1a1a2e", "#16213e", "#0f3460", "#3d1035"].map((color, i) => (
              <button
                key={color}
                onClick={() => setActiveColor(i)}
                className={cn(
                  "w-6 h-6 rounded-md border-2 transition-all duration-150 hover:scale-110",
                  activeColor === i
                    ? "border-primary shadow-[0_0_6px_rgba(52,211,153,0.4)] scale-110"
                    : "border-border/40 hover:border-primary/40"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Output size */}
        <div>
          <span className="text-[11px] text-muted-foreground/80 block mb-2">Tamanho de Saída</span>
          <Select defaultValue="a4">
            <SelectTrigger className="h-8 text-xs">
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
    </div>
  );
}