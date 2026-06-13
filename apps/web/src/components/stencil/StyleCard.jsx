import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Sparkles, Cpu, ZoomIn, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionBadge from "./SectionBadge";

// IA providers mirrored from the (now-merged) ProviderCard. Inline here so the
// "Estilo" card carries the AI engine switch as a pill toggle on top — same
// V1/V2 visual rhythm the TattoostencilPro card uses.
const PROVIDER_PILLS = [
  { id: "google", label: "Nano Banana 2", short: "Nano", Icon: Sparkles },
  { id: "openai", label: "GPT Image 2", short: "GPT", Icon: Cpu },
];

// All three styles produce STENCILS — transfer guides drawn in black ink on
// white paper. The difference between them is the density of detail, NOT the
// artistic medium. Each SVG mock is a portrait stencil with progressively more
// detail so the user can see at a glance what they're picking.
const STENCIL_FACE_OUTLINE = (
  <g stroke="#0a0a0a" strokeLinecap="round" strokeLinejoin="round" fill="none">
    {/* face outline */}
    <path d="M40 8 C26 8 19 22 19 34 C19 46 28 56 40 56 C52 56 61 46 61 34 C61 22 54 8 40 8 Z" strokeWidth="1.1" />
    {/* hair fall */}
    <path d="M22 22 Q18 14 24 8" strokeWidth="0.7" />
    <path d="M58 22 Q62 14 56 8" strokeWidth="0.7" />
    <path d="M28 14 Q30 10 34 9" strokeWidth="0.5" />
    <path d="M52 14 Q50 10 46 9" strokeWidth="0.5" />
    {/* brows */}
    <path d="M27 25 Q31 23 35 25" strokeWidth="0.7" />
    <path d="M45 25 Q49 23 53 25" strokeWidth="0.7" />
    {/* eyes */}
    <path d="M28 30 Q31 28 34 30 Q31 32 28 30 Z" strokeWidth="0.7" />
    <path d="M46 30 Q49 28 52 30 Q49 32 46 30 Z" strokeWidth="0.7" />
    <circle cx="31" cy="30" r="1.1" fill="#0a0a0a" />
    <circle cx="49" cy="30" r="1.1" fill="#0a0a0a" />
    {/* nose */}
    <path d="M40 31 L38.5 39 Q40 40.5 41.5 39" strokeWidth="0.6" />
    {/* mouth */}
    <path d="M34 45 Q40 47 46 45" strokeWidth="0.7" />
    <path d="M36 46 Q40 48 44 46" strokeWidth="0.4" />
  </g>
);

const STYLES = [
  {
    id: "fineline",
    label: "Fine Line",
    desc: "Só contornos. Linhas finas e limpas.",
    badge: "Mínimo",
    badgeColor: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    blurb:
      "Stencil de pura linha: só os contornos essenciais (rosto, olhos, nariz, boca, cabelo). Sem sombreado. Tatuador adiciona o trabalho de sombra dele em cima. Use pra desenhos delicados, retratos minimalistas, scripts.",
    detailLabel: "Detalhe: baixo",
    exampleSrc: "/styles/fineline.jpg",
    PreviewSvg: ({ large = false }) => (
      <svg viewBox="0 0 80 60" className={large ? "h-full w-full" : "h-14 w-20"}>
        <rect width="80" height="60" fill="#fff" />
        {STENCIL_FACE_OUTLINE}
      </svg>
    ),
  },
  {
    id: "blackwork",
    label: "Blackwork",
    desc: "Contornos + hatching leve onde sombreia.",
    badge: "Médio",
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    blurb:
      "Stencil com contornos + traços paralelos curtos nas zonas mais escuras (sob o queixo, olheiras, base do nariz, sombra do cabelo). Sem massas pretas sólidas. Indica pro tatuador onde compactar tinta.",
    detailLabel: "Detalhe: médio",
    exampleSrc: "/styles/blackwork.jpg",
    PreviewSvg: ({ large = false }) => (
      <svg viewBox="0 0 80 60" className={large ? "h-full w-full" : "h-14 w-20"}>
        <rect width="80" height="60" fill="#fff" />
        {STENCIL_FACE_OUTLINE}
        {/* sparse hatching in shadow zones */}
        <g stroke="#0a0a0a" strokeWidth="0.35" strokeLinecap="round">
          {/* jaw shadow */}
          <path d="M30 50 L31.5 53" />
          <path d="M33 50.5 L34.5 53.5" />
          <path d="M36 51 L37.5 54" />
          <path d="M43 51 L41.5 54" />
          <path d="M46 50.5 L44.5 53.5" />
          <path d="M49 50 L47.5 53" />
          {/* eye undershadow */}
          <path d="M28.5 32 L29.5 33.5" />
          <path d="M30 32 L31 33.5" />
          <path d="M46.5 32 L47.5 33.5" />
          <path d="M48 32 L49 33.5" />
          {/* nose underside */}
          <path d="M38.5 40 L37.8 41.5" />
          <path d="M41.5 40 L42.2 41.5" />
          {/* hair fall */}
          <path d="M21 28 L22 31" />
          <path d="M23 26 L24 29" />
          <path d="M57 28 L58 31" />
          <path d="M55 26 L56 29" />
        </g>
      </svg>
    ),
  },
  {
    id: "realismo",
    label: "Realismo",
    desc: "Contornos + stippling denso + hatching.",
    badge: "Alto",
    badgeColor: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    blurb:
      "Stencil de alta densidade: contornos + pontilhismo (pontos) na pele pra sardas/sombra + hatching no cabelo strand-por-strand. Mapa tonal completo — o tatuador segue a densidade de pontos pra saber onde sombrear mais.",
    detailLabel: "Detalhe: alto",
    exampleSrc: "/styles/realismo.jpg",
    PreviewSvg: ({ large = false }) => (
      <svg viewBox="0 0 80 60" className={large ? "h-full w-full" : "h-14 w-20"}>
        <rect width="80" height="60" fill="#fff" />
        {STENCIL_FACE_OUTLINE}
        {/* dense stippling on skin (sparse representation) */}
        <g fill="#0a0a0a">
          {/* cheek shadows */}
          {[
            [25, 37], [27, 38], [26, 40], [28, 41], [25, 42],
            [27, 43], [24, 44], [26, 45], [53, 37], [55, 38],
            [54, 40], [56, 41], [53, 42], [55, 43], [54, 44],
            [56, 45],
            // freckles / nose
            [37, 36], [40, 37], [43, 36], [39, 39], [41, 39],
            // jaw shadow
            [30, 49], [33, 50], [36, 51], [44, 51], [47, 50], [50, 49],
            // forehead light texture
            [33, 17], [40, 16], [47, 17], [37, 18], [43, 18],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="0.45" />
          ))}
        </g>
        {/* hair strands */}
        <g stroke="#0a0a0a" strokeWidth="0.3" fill="none" strokeLinecap="round">
          <path d="M22 11 Q24 7 28 6" />
          <path d="M25 12 Q27 8 32 7" />
          <path d="M30 10 Q32 7 36 7" />
          <path d="M44 7 Q49 8 51 11" />
          <path d="M48 7 Q53 9 56 13" />
          <path d="M52 8 Q56 11 58 15" />
        </g>
      </svg>
    ),
  },
];

export { STYLES };

function StyleZoomModal({ style, onClose }) {
  if (!style) return null;
  const { PreviewSvg, exampleSrc } = style;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.18 }}
          className="relative bg-card border border-foreground/[0.08] rounded-md max-w-4xl w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-sm border border-foreground/[0.08] bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-foreground/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            {/* Real before/after example image (with schematic SVG as fallback) */}
            <div className="relative bg-black/40 border-r border-foreground/[0.06] flex items-center justify-center overflow-hidden">
              {exampleSrc ? (
                <>
                  <img
                    src={exampleSrc}
                    alt={`Exemplo de stencil ${style.label}`}
                    className="w-full h-full object-cover max-h-[60vh]"
                    draggable={false}
                  />
                  <div className="absolute top-3 left-3 rounded-sm bg-black/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/95 backdrop-blur-sm">
                    Antes
                  </div>
                  <div className="absolute top-3 right-3 rounded-sm bg-primary/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    Depois
                  </div>
                </>
              ) : (
                <div className="bg-white w-full max-h-[60vh] aspect-[4/3] p-6 flex items-center justify-center">
                  <PreviewSvg large />
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <div className="text-[9px] uppercase tracking-[0.22em] text-primary font-mono font-semibold mb-1">
                  Exemplo de stencil
                </div>
                <h3 className="text-[20px] font-bold tracking-tight text-foreground/95">
                  {style.label}
                </h3>
                <p className="text-[11px] uppercase tracking-[0.16em] text-foreground/55 mt-1">
                  {style.detailLabel}
                </p>
              </div>
              <p className="text-[13px] leading-relaxed text-foreground/75">
                {style.blurb}
              </p>
              <div className="border-l-2 border-l-primary/40 pl-3 py-1">
                <p className="text-[11px] text-foreground/55 leading-snug">
                  Exemplo do tipo de saída esperado. O resultado real é gerado pela IA com a SUA imagem de referência — não com a do exemplo.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function StyleCard({ selectedStyle, onSelect, selectedProvider, onProviderSelect }) {
  const activeStyle = STYLES.find((s) => s.id === selectedStyle);
  const [zoomStyle, setZoomStyle] = useState(null);

  return (
    <div className={cn(
      "relative bg-card/95 border border-foreground/[0.07] rounded-md flex-shrink-0 overflow-hidden",
      "shadow-[0_8px_28px_-16px_rgba(0,0,0,0.7)]",
    )}>
      <SectionBadge step="2" title="Estilo" hint="Escolha o estilo + motor de IA" />

      {/* Provider pill toggle — sits at the top of the card like the V1/V2
          switch in the competitor reference. */}
      {onProviderSelect && (
        <div className="px-3 pt-3">
          <div className="inline-flex w-full rounded-lg border border-border/40 bg-muted/15 p-0.5">
            {PROVIDER_PILLS.map((p) => {
              const active = selectedProvider === p.id;
              const Icon = p.Icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onProviderSelect(p.id)}
                  className={cn(
                    "flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-all",
                    active
                      ? "bg-primary/15 text-primary shadow-[0_0_10px_-2px_rgba(39,134,95,0.45)] border border-primary/40"
                      : "text-muted-foreground/70 hover:text-foreground/90",
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3 stacked cards — wider, with built-in preview */}
      <div className="p-3 space-y-2">
        {STYLES.map((style) => {
          const active = selectedStyle === style.id;
          const { PreviewSvg } = style;
          return (
            <button
              key={style.id}
              onClick={() => onSelect(style.id)}
              className={cn(
                "relative w-full text-left rounded-lg border transition-all duration-200 group overflow-hidden",
                active
                  ? "bg-primary/[0.08] border-primary/45 shadow-[0_0_18px_-6px_rgba(39,134,95,0.45)]"
                  : "bg-muted/15 border-border/40 hover:border-border/70 hover:bg-muted/30",
              )}
            >
              <div className="flex items-center gap-3 px-3 py-2.5">
                {/* Mini preview swatch with magnifier overlay */}
                <div
                  className={cn(
                    "relative shrink-0 grid place-items-center rounded-md bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] transition-transform duration-200 overflow-hidden",
                    active && "scale-[1.04]",
                  )}
                  style={{ width: 60, height: 44 }}
                >
                  <PreviewSvg />
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setZoomStyle(style);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        e.preventDefault();
                        setZoomStyle(style);
                      }
                    }}
                    className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-sm bg-black/65 text-white/95 flex items-center justify-center hover:bg-primary cursor-pointer transition-colors"
                    aria-label="Ver exemplo grande"
                    title="Ver exemplo grande"
                  >
                    <ZoomIn className="w-2.5 h-2.5" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-[13px] font-semibold leading-tight",
                        active ? "text-primary" : "text-foreground/90",
                      )}
                    >
                      {style.label}
                    </span>
                    {active && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    )}
                  </div>
                  <span className="text-[10.5px] text-muted-foreground/70 leading-snug block mt-0.5">
                    {style.desc}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active style detail */}
      <AnimatePresence mode="wait">
        {activeStyle && (
          <motion.div
            key={activeStyle.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.18 }}
            className="mx-3 mb-3 rounded-lg border border-[#27865f]/[0.15] bg-[#27865f]/[0.04] px-3 py-2.5"
          >
            <p className="text-[10.5px] leading-snug text-foreground/70">
              {activeStyle.blurb}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lupinha zoom modal */}
      {zoomStyle && (
        <StyleZoomModal style={zoomStyle} onClose={() => setZoomStyle(null)} />
      )}
    </div>
  );
}
