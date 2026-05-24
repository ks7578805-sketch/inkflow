import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
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
  const [controlsOpen, setControlsOpen] = useState(false);

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

  useEffect(() => {
    const handlePaste = (e) => {
      const item = Array.from(e.clipboardData?.items || []).find(i => i.type.startsWith("image/"));
      if (!item) return;
      const blob = item.getAsFile();
      if (!blob) return;
      handleImageSuccess({ url: URL.createObjectURL(blob), name: "imagem_colada.png", size: blob.size, type: blob.type });
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

  // ── MOBILE LAYOUT ─────────────────────────────────────
  const MobileLayout = (
    <div className="flex flex-col min-h-[calc(100vh-112px)] pb-24">
      <div className="p-4 space-y-4">

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

        {/* 3. Controls — collapsible */}
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3.5 border-b border-border/30"
            onClick={() => setControlsOpen(o => !o)}
          >
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Controles</span>
            {controlsOpen
              ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
              : <ChevronDown className="w-4 h-4 text-muted-foreground" />
            }
          </button>
          {controlsOpen && (
            <div className="p-4">
              <ControlsContent />
            </div>
          )}
        </div>

        {/* 4. Center area / preview */}
        <div className="rounded-xl overflow-hidden border border-border/50 bg-card" style={{ minHeight: 280 }}>
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
            isMobile
          />
        </div>

        {/* 5. Versions & actions after result */}
        {hasResult && (
          <StencilRightPanel
            hasResult={hasResult}
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
            selectedStyle={selectedStyle}
            isMobile
          />
        )}
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50 p-3 safe-area-bottom">
        {!hasResult ? (
          <Button
            onClick={handleGenerate}
            disabled={!image || isGenerating}
            className={cn(
              "w-full h-12 font-bold gap-2 text-sm rounded-xl transition-all",
              image && !isGenerating
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_28px_rgba(52,211,153,0.25)]"
                : "bg-muted/20 text-muted-foreground/40 border border-border/20 cursor-not-allowed"
            )}
          >
            {isGenerating
              ? <><Loader2 className="w-4 h-4 animate-spin" />Gerando...</>
              : <><Wand2 className="w-4 h-4" />Gerar Stencil</>
            }
          </Button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="h-11 text-xs gap-1 border-border/40 font-medium">
              Salvar
            </Button>
            <Button variant="outline" className="h-11 text-xs gap-1 border-border/40 font-medium">
              PDF
            </Button>
            <Button variant="outline" className="h-11 text-xs gap-1 border-border/40 font-medium">
              PNG
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // ── DESKTOP LAYOUT ─────────────────────────────────────
  const DesktopLayout = (
    <div className="flex flex-1 gap-4 p-4 min-h-0 overflow-hidden">
      <aside className="w-[260px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto min-h-0 pb-2 pr-0.5">
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
        <StyleCard selectedStyle={selectedStyle} onSelect={setSelectedStyle} />
        <div className="bg-card border border-border/50 rounded-xl flex-shrink-0">
          <div className="px-4 pt-3.5 pb-3 border-b border-border/30">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Controles</span>
          </div>
          <div className="p-4">
            <ControlsContent />
          </div>
        </div>
        <div className="sticky bottom-0 pt-1 pb-0.5">
          <Button
            onClick={handleGenerate}
            disabled={!image || isGenerating}
            className={cn(
              "w-full h-11 font-bold gap-2 text-sm transition-all duration-200 rounded-xl",
              image && !isGenerating
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_28px_rgba(52,211,153,0.25)]"
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

      <StencilRightPanel
        hasResult={hasResult}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        selectedStyle={selectedStyle}
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

      {/* Mobile */}
      <div className="md:hidden flex-1 overflow-y-auto">
        {MobileLayout}
      </div>

      {/* Desktop */}
      <div className="hidden md:flex flex-1 min-h-0 overflow-hidden">
        {DesktopLayout}
      </div>
    </div>
  );
}

function ControlsContent() {
  const [values, setValues] = useState({ line: [50], simplify: [30], contrast: [70] });
  const [activeColor, setActiveColor] = useState(0);
  const set = (key) => (val) => setValues(v => ({ ...v, [key]: val }));

  return (
    <div className="space-y-4">
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
          <Slider value={ctrl.val} onValueChange={set(ctrl.key)} max={100} step={1} className="w-full" />
        </div>
      ))}

      <div>
        <span className="text-[11px] text-muted-foreground/80 block mb-2">Cor da Linha</span>
        <div className="flex gap-2">
          {["#080808", "#1a1a2e", "#16213e", "#0f3460", "#3d1035"].map((color, i) => (
            <button
              key={color}
              onClick={() => setActiveColor(i)}
              className={cn(
                "w-7 h-7 rounded-md border-2 transition-all",
                activeColor === i ? "border-primary shadow-[0_0_6px_rgba(52,211,153,0.4)] scale-110" : "border-border/40"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <span className="text-[11px] text-muted-foreground/80 block mb-2">Tamanho de Saída</span>
        <Select defaultValue="a4">
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