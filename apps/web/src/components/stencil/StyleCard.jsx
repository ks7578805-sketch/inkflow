import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = [
  {
    id: "fine",
    label: "Fine Line",
    desc: "Linhas delicadas",
    badge: "Delicado",
    badgeColor: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    preview: {
      photo: "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&w=300&q=70",
      desc: "Traços finos e precisos, ideal para designs detalhados",
    },
  },
  {
    id: "bold",
    label: "Bold Line",
    desc: "Contorno forte",
    badge: "Intenso",
    badgeColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    preview: {
      photo: "https://images.unsplash.com/photo-1542727365-19732a80dcfd?auto=format&fit=crop&w=300&q=70",
      desc: "Linhas grossas, presença forte e boa legibilidade",
    },
  },
  {
    id: "dotwork",
    label: "Dotwork",
    desc: "Textura pontilhada",
    badge: "Textura",
    badgeColor: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    preview: {
      photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=70",
      desc: "Composição por pontos, gradientes únicos",
    },
  },
  {
    id: "traditional",
    label: "Traditional",
    desc: "Contraste clássico",
    badge: "Clássico",
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    preview: {
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=70",
      desc: "Estilo americano clássico, contrastes marcantes",
    },
  },
  {
    id: "geometric",
    label: "Geométrico",
    desc: "Formas limpas",
    badge: "Moderno",
    badgeColor: "text-teal-400 bg-teal-400/10 border-teal-400/20",
    preview: {
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=70",
      desc: "Padrões geométricos precisos e contemporâneos",
    },
  },
  {
    id: "realism",
    label: "Realismo",
    desc: "Mais detalhes",
    badge: "Detalhado",
    badgeColor: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    preview: {
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=70",
      desc: "Alta fidelidade, preserva detalhes complexos",
    },
  },
];

export { STYLES };

export default function StyleCard({ selectedStyle, onSelect }) {
  const activeStyle = STYLES.find(s => s.id === selectedStyle);

  return (
    <div className="bg-card border border-border/50 rounded-xl flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-border/30">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Estilo</span>
        {activeStyle && (
          <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-semibold border", activeStyle.badgeColor)}>
            {activeStyle.badge}
          </span>
        )}
      </div>

      {/* Style grid */}
      <div className="p-3 grid grid-cols-2 gap-1.5">
        {STYLES.map((style) => {
          const active = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => onSelect(style.id)}
              className={cn(
                "relative text-left rounded-lg px-3 py-2.5 border transition-all duration-200 group",
                active
                  ? "bg-primary/10 border-primary/40 shadow-[0_0_12px_rgba(52,211,153,0.12)]"
                  : "bg-muted/20 border-border/30 hover:border-border/70 hover:bg-muted/40"
              )}
            >
              <div className="flex items-start justify-between mb-0.5">
                <span className={cn("text-xs font-semibold leading-tight", active ? "text-primary" : "text-foreground/80")}>
                  {style.label}
                </span>
                {active && <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-0.5" />}
              </div>
              <span className="text-[10px] text-muted-foreground/60 leading-tight block">{style.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Style preview panel */}
      <AnimatePresence mode="wait">
        {activeStyle && (
          <motion.div
            key={activeStyle.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mx-3 mb-3 rounded-xl overflow-hidden border border-border/40 bg-muted/20"
          >
            {/* Split preview: photo left / mock stencil right */}
            <div className="relative h-24 flex overflow-hidden">
              {/* Photo side */}
              <div className="w-1/2 relative overflow-hidden">
                <img
                  src={activeStyle.preview.photo}
                  alt={activeStyle.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
                <span className="absolute bottom-1.5 left-2 text-[8px] font-semibold text-white/70 uppercase tracking-wider">
                  Foto
                </span>
              </div>

              {/* Divider line */}
              <div className="absolute inset-y-0 left-1/2 w-px bg-primary/40 z-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-5 h-5 rounded-full bg-background border border-primary/40 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-primary">↔</span>
                </div>
              </div>

              {/* Stencil mock side */}
              <div className="w-1/2 relative bg-white flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 60 60" className="w-16 h-16 opacity-75">
                  <circle cx="30" cy="22" r="10" fill="none" stroke="#0f172a" strokeWidth="1.2" />
                  <path d="M20 40 Q30 30 40 40" fill="none" stroke="#0f172a" strokeWidth="1" />
                  <path d="M15 50 Q30 42 45 50" fill="none" stroke="#0f172a" strokeWidth="0.8" />
                  <circle cx="26" cy="20" r="1.5" fill="#0f172a" opacity="0.5" />
                  <circle cx="34" cy="20" r="1.5" fill="#0f172a" opacity="0.5" />
                  <path d="M26 26 Q30 29 34 26" fill="none" stroke="#0f172a" strokeWidth="0.8" />
                </svg>
                <span className="absolute bottom-1.5 right-2 text-[8px] font-semibold text-black/40 uppercase tracking-wider">
                  Stencil
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="px-3 py-2 flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground/70 leading-snug">{activeStyle.preview.desc}</p>
              <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-semibold border shrink-0 ml-2", activeStyle.badgeColor)}>
                {activeStyle.badge}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}