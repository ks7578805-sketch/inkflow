import { StickyNote } from "lucide-react";

export default function ProjectDetailNotes({ project }) {
  if (!project.notes) {
    return (
      <div className="space-y-5 max-w-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Notas do Projeto</h3>
        </div>

        <div className="py-16 text-center">
          <StickyNote className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhuma nota registrada</p>
          <p className="text-xs text-muted-foreground mt-1">Use a edição do projeto para salvar observações e combinados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Notas do Projeto</h3>
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-4">
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{project.notes}</p>
        <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
          <span>Atualizado em {project.updatedAt}</span>
        </div>
      </div>
    </div>
  );
}
