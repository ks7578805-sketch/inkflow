import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_PROJECTS } from "@/data/projectsMock";
import { Loader2, Download, File } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function SaveStencilModal({ open, onClose, stencilRef, fileName = "stencil" }) {
  const [mode, setMode] = useState("project"); // "project" | "direct"
  const [selectedProject, setSelectedProject] = useState("");
  const [customName, setCustomName] = useState(fileName);
  const [isSaving, setSaving] = useState(false);

  const projectOptions = MOCK_PROJECTS.filter(p => p.status !== "Finalizado");

  const handleSaveAsPNG = async () => {
    if (!stencilRef?.current) return;
    try {
      setSaving(true);
      const canvas = await html2canvas(stencilRef.current, { backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${customName}.png`;
      link.click();
    } catch (err) {
      console.error("Erro ao salvar PNG:", err);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  const handleSaveAsPDF = async () => {
    if (!stencilRef?.current) return;
    try {
      setSaving(true);
      const canvas = await html2canvas(stencilRef.current, { backgroundColor: "#ffffff" });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210 - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`${customName}.pdf`);
    } catch (err) {
      console.error("Erro ao salvar PDF:", err);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  const handleSaveToProject = () => {
    if (!selectedProject) return;
    const project = MOCK_PROJECTS.find(p => p.id === selectedProject);
    alert(`Stencil "${customName}" salvo no projeto "${project.name}"`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle>Salvar Stencil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          {/* Mode selector */}
          <div className="flex gap-2">
            {["project", "direct"].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  mode === m
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/20 text-muted-foreground border-border/50 hover:bg-muted/30"
                }`}
              >
                {m === "project" ? "Salvar em Projeto" : "Download"}
              </button>
            ))}
          </div>

          {/* Common: file name */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Nome do arquivo</Label>
            <Input
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder="stencil_design"
              className="h-9 bg-secondary/50 text-sm"
            />
          </div>

          {/* Project mode */}
          {mode === "project" && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Projeto *</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="h-9 text-sm bg-secondary/50">
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projectOptions.length === 0 ? (
                    <div className="p-2 text-xs text-muted-foreground">Nenhum projeto disponível</div>
                  ) : (
                    projectOptions.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.client})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Download mode */}
          {mode === "direct" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Escolha o formato para download:</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveAsPNG}
                  disabled={isSaving}
                  className="flex-1 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground h-10"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <File className="w-3.5 h-3.5" />}
                  PNG
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveAsPDF}
                  disabled={isSaving}
                  className="flex-1 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground h-10"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  PDF
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
            {mode === "project" && (
              <Button
                size="sm"
                onClick={handleSaveToProject}
                disabled={!selectedProject}
                className="bg-primary text-primary-foreground"
              >
                Salvar em Projeto
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}