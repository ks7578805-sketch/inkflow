import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StickyNote, Plus } from "lucide-react";

export default function ProjectDetailNotes({ project, notes: initialNotes }) {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!newNote.trim()) return;
    setNotes([{ id: `n${Date.now()}`, content: newNote, date: new Date().toLocaleDateString("pt-BR"), author: "Você" }, ...notes]);
    setNewNote("");
    setAdding(false);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Notas do Projeto</h3>
        <Button size="sm" className="text-xs h-8 bg-primary text-primary-foreground gap-1.5" onClick={() => setAdding(!adding)}>
          <Plus className="w-3.5 h-3.5" /> Nova Nota
        </Button>
      </div>

      {adding && (
        <div className="bg-card border border-primary/20 rounded-xl p-4 space-y-3">
          <textarea
            autoFocus
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Escreva sua observação aqui..."
            className="w-full bg-muted/30 border border-border/50 rounded-lg p-3 text-sm text-foreground resize-none h-24 focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
          />
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => { setAdding(false); setNewNote(""); }}>Cancelar</Button>
            <Button size="sm" className="text-xs h-7 bg-primary text-primary-foreground" onClick={handleAdd}>Salvar Nota</Button>
          </div>
        </div>
      )}

      {notes.length === 0 && !adding ? (
        <div className="py-16 text-center">
          <StickyNote className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhuma nota registrada</p>
          <p className="text-xs text-muted-foreground mt-1">Adicione observações, lembretes e detalhes do projeto</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-card border border-border/50 rounded-xl p-4 hover:border-border transition-all">
              <p className="text-sm text-foreground/90 leading-relaxed">{note.content}</p>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
                <span className="font-medium text-foreground/60">{note.author}</span>
                <span>·</span>
                <span>{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}