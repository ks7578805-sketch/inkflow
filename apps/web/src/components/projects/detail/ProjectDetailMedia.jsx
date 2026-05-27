import { Image, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectDetailMedia() {
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Arquivo de Mídia</h3>
        <Button size="sm" variant="outline" className="text-xs h-8 gap-1.5" disabled>
          <Upload className="w-3.5 h-3.5" /> Adicionar mídia
        </Button>
      </div>

      <div className="py-16 text-center border border-border/50 rounded-xl bg-card">
        <Image className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Nenhuma mídia registrada</p>
        <p className="text-xs text-muted-foreground mt-1">A galeria do projeto ainda não foi migrada para a stack real deste slice.</p>
      </div>
    </div>
  );
}
