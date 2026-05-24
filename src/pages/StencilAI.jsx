import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Upload, Wand2, Download, Save, RotateCcw, ZoomIn, ZoomOut,
  Layers, History, Eye, EyeOff, Loader2, CheckCircle2, Clock, Cpu
} from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const stylePresets = [
  { id: "fine", label: "Fine Line", active: false },
  { id: "bold", label: "Bold Line", active: false },
  { id: "dotwork", label: "Dotwork", active: false },
  { id: "traditional", label: "Traditional", active: false },
  { id: "geometric", label: "Geométrico", active: false },
  { id: "realism", label: "Realismo", active: false },
];

const versionHistory = [
  { id: 1, label: "v3 – Fine Line + Alta", time: "Agora" },
  { id: 2, label: "v2 – Bold Line + Média", time: "5 min" },
  { id: 3, label: "v1 – Auto", time: "12 min" },
];

const processingSteps = [
  { label: "Na fila", icon: Clock },
  { label: "Preparando imagem", icon: Upload },
  { label: "Gerando com IA", icon: Cpu },
  { label: "Refinando stencil", icon: Wand2 },
  { label: "Finalizando versões", icon: Layers },
];

export default function StencilAI() {
  const [hasImage, setHasImage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showBefore, setShowBefore] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(1);

  const handleUpload = useCallback(() => {
    setHasImage(true);
    setHasResult(false);
    setIsGenerating(false);
  }, []);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setHasResult(false);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setHasResult(true);
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  }, []);

  return (
    <div className="min-h-screen">
      <Topbar title="Stencil AI" subtitle="Gere stencils profissionais com inteligência artificial" />
      
      <div className="p-6 flex gap-6 h-[calc(100vh-64px)]">
        {/* Left Panel – Controls */}
        <div className="w-72 flex-shrink-0 space-y-5 overflow-y-auto pb-6">
          {/* Upload */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Referência</Label>
            <div
              onClick={handleUpload}
              className="border-2 border-dashed border-border/60 rounded-lg p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                {hasImage ? "imagem_referencia.jpg" : "Arraste ou clique para upload"}
              </p>
            </div>
          </div>

          {/* Style Presets */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Estilo</Label>
            <div className="grid grid-cols-2 gap-2">
              {stylePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={cn(
                    "text-xs py-2 px-3 rounded-lg border transition-all text-center font-medium",
                    selectedPreset === preset.id
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-muted/30 border-border/30 text-muted-foreground hover:border-border hover:text-foreground"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Controles</Label>
            
            {[
              { label: "Espessura da Linha", defaultValue: [50] },
              { label: "Simplificação", defaultValue: [30] },
              { label: "Contraste", defaultValue: [70] },
            ].map((ctrl) => (
              <div key={ctrl.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{ctrl.label}</span>
                  <span className="text-xs font-mono text-foreground">{ctrl.defaultValue[0]}%</span>
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
                    className="w-7 h-7 rounded-lg border-2 border-border/30 hover:border-primary/50 transition-colors"
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

          {/* Debug Mode */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Modo Debug</Label>
              <Switch />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!hasImage || isGenerating}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {isGenerating ? "Gerando..." : "Gerar Stencil"}
          </Button>
        </div>

        {/* Center – Preview Area */}
        <div className="flex-1 bg-card border border-border/50 rounded-xl overflow-hidden relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!hasImage && !isGenerating && !hasResult && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">Faça upload de uma imagem de referência</p>
                <p className="text-xs text-muted-foreground/60 mt-1">para começar a gerar seu stencil</p>
              </motion.div>
            )}

            {hasImage && !isGenerating && !hasResult && (
              <motion.div
                key="uploaded"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full flex items-center justify-center bg-muted/10"
              >
                <div className="w-80 h-80 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/30 flex items-center justify-center">
                  <div className="text-center">
                    <Layers className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Imagem de referência carregada</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">Pronta para gerar stencil</p>
                  </div>
                </div>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-10"
              >
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Loader2 className="w-7 h-7 text-primary animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Gerando stencil...</p>
                    <p className="text-xs text-muted-foreground">Isso pode levar alguns segundos</p>
                  </div>
                  <div className="space-y-2 w-72">
                    {processingSteps.map((step, i) => (
                      <div key={i} className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-500",
                        i < currentStep ? "bg-primary/5" :
                        i === currentStep ? "bg-primary/10 border border-primary/20" :
                        "bg-muted/20"
                      )}>
                        {i < currentStep ? (
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        ) : i === currentStep ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                        ) : (
                          <step.icon className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                        )}
                        <span className={cn(
                          "text-xs font-medium",
                          i <= currentStep ? "text-foreground" : "text-muted-foreground/40"
                        )}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {hasResult && !isGenerating && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <div className="w-[400px] h-[500px] rounded-xl bg-white/95 border border-border/20 shadow-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
                  <div className="relative text-center">
                    <div className="w-64 h-72 mx-auto mb-4 bg-gradient-to-b from-gray-200/50 to-gray-100/30 rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 200 240" className="w-48 h-56 opacity-80">
                        <path d="M100 20 C60 40 30 80 40 140 C50 200 80 220 100 230 C120 220 150 200 160 140 C170 80 140 40 100 20Z" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
                        <path d="M80 60 Q90 80 100 60 Q110 80 120 60" fill="none" stroke="#1a1a1a" strokeWidth="1" />
                        <path d="M70 100 Q100 130 130 100" fill="none" stroke="#1a1a1a" strokeWidth="1" />
                        <circle cx="85" cy="80" r="3" fill="none" stroke="#1a1a1a" strokeWidth="0.8" />
                        <circle cx="115" cy="80" r="3" fill="none" stroke="#1a1a1a" strokeWidth="0.8" />
                        <path d="M60 150 Q80 170 100 150 Q120 170 140 150" fill="none" stroke="#1a1a1a" strokeWidth="0.8" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Stencil gerado – v3</p>
                  </div>
                </div>

                {/* Before/After Toggle */}
                <div className="absolute top-4 left-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBefore(!showBefore)}
                    className="h-8 text-xs gap-1.5 bg-card/80 backdrop-blur-sm"
                  >
                    {showBefore ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showBefore ? "Ocultar original" : "Ver original"}
                  </Button>
                </div>

                {/* Zoom controls */}
                <div className="absolute bottom-4 left-4 flex gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm">
                    <ZoomOut className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-card/80 backdrop-blur-sm">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel – Metadata & Versions */}
        <div className="w-64 flex-shrink-0 space-y-4 overflow-y-auto pb-6">
          {/* Actions */}
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9 text-xs">
              <Save className="w-3.5 h-3.5" /> Salvar Versão
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9 text-xs">
              <Download className="w-3.5 h-3.5" /> Exportar PDF
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9 text-xs">
              <Download className="w-3.5 h-3.5" /> Exportar PNG
            </Button>
          </div>

          {/* Version History */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Versões</Label>
            </div>
            <div className="space-y-1.5">
              {versionHistory.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVersion(v.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-xs transition-all",
                    selectedVersion === v.id
                      ? "bg-primary/10 border border-primary/20 text-primary"
                      : "hover:bg-muted/50 text-muted-foreground"
                  )}
                >
                  <p className="font-medium">{v.label}</p>
                  <p className="text-[10px] opacity-60 mt-0.5">{v.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Metadata */}
          {hasResult && (
            <div className="bg-card border border-border/50 rounded-xl p-4">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Metadados</Label>
              <div className="space-y-2 text-xs">
                {[
                  { label: "Resolução", value: "2480 × 3508" },
                  { label: "Estilo", value: "Fine Line" },
                  { label: "Espessura", value: "50%" },
                  { label: "Formato", value: "A4" },
                  { label: "Gerado em", value: "12s" },
                  { label: "Modelo", value: "StencilNet v2.1" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}