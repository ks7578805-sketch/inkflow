import {
  Plus,
  Sparkles,
  CalendarClock,
  Activity,
  Check,
  BadgeDollarSign,
} from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import ClientCard from "./ClientCard";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const STAGE_ICONS = {
  interesse: Sparkles,
  agendado: CalendarClock,
  emAndamento: Activity,
  concluido: Check,
  pago: BadgeDollarSign,
};

// One pipeline stage column. Becomes a droppable surface (id = stage id) so
// dragging a card onto empty space at the bottom still has a clear target.
// The emerald drop-zone glow only fires when this column is the active drop
// target AND it isn't the source column (handed in via `isActiveDropZone`).
export default function ClientColumn({
  stage,
  clients,
  onCardClick,
  onAddClient,
  onOpenConversation,
  isActiveDropZone,
  activeId,
}) {
  const { setNodeRef } = useDroppable({ id: stage.id });
  const itemIds = clients.map((c) => c.id);
  const totalValue = clients.reduce((acc, c) => acc + (c.valor || 0), 0);
  const Icon = STAGE_ICONS[stage.id] ?? Sparkles;

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "relative flex w-[320px] shrink-0 flex-col overflow-hidden rounded-xl border bg-[#0d0e10]",
        "shadow-[0_0_0_1px_rgba(29,184,132,0.04)]",
        "transition-[border-color,box-shadow] duration-200 ease-out",
        isActiveDropZone
          ? "border-[#1db884]/60 shadow-[inset_0_0_0_1px_rgba(29,184,132,0.22),0_0_42px_-8px_rgba(29,184,132,0.55)]"
          : "border-[#1db884]/20",
      )}
      aria-label={`Coluna ${stage.label}`}
    >
      {/* Header */}
      <header className="border-b border-[#1db884]/[0.10] px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "grid h-6 w-6 shrink-0 place-items-center rounded-md transition-shadow duration-200",
                isActiveDropZone && "shadow-[0_0_12px_rgba(29,184,132,0.7)]",
              )}
              style={{
                backgroundColor: `${stage.dot}1F`,
                color: stage.dot,
              }}
              aria-hidden="true"
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
            </span>
            <h3 className="text-[12.5px] font-semibold tracking-tight text-white/95">
              {stage.label}
            </h3>
          </div>
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums transition-colors",
              isActiveDropZone
                ? "bg-[#1db884]/15 text-[#1db884]"
                : "bg-white/[0.04] text-white/55",
            )}
          >
            {clients.length}
          </span>
        </div>
        {totalValue > 0 && (
          <div className="mt-1.5 flex items-baseline gap-1.5 pl-8 text-[10.5px]">
            <span className="font-medium uppercase tracking-[0.08em] text-white/35">
              Soma
            </span>
            <span className="font-semibold tabular-nums text-white/75">
              {brl.format(totalValue)}
            </span>
          </div>
        )}
      </header>

      {/* Cards (sortable list) */}
      <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-2 pt-2">
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {clients.length === 0 ? (
            <div
              className={cn(
                "grid place-items-center rounded-lg border border-dashed py-8 text-center transition-colors",
                isActiveDropZone
                  ? "border-[#1db884]/35 bg-[#1db884]/[0.04]"
                  : "border-[#1db884]/[0.10] bg-white/[0.01]",
              )}
            >
              <p
                className={cn(
                  "text-[11px] transition-colors",
                  isActiveDropZone ? "text-[#1db884]/85" : "text-white/30",
                )}
              >
                {isActiveDropZone ? "Soltar aqui" : "Sem clientes neste estágio"}
              </p>
            </div>
          ) : (
            clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={onCardClick}
                onOpenConversation={onOpenConversation}
                isOverlayActive={activeId === client.id}
              />
            ))
          )}
        </SortableContext>
      </div>

      {/* Add client */}
      <footer className="border-t border-[#1db884]/[0.10] p-2">
        <button
          type="button"
          onClick={() => onAddClient?.(stage.id)}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#1db884]/15 px-3 py-2 text-[11px] font-medium text-[#1db884]/55",
            "transition-colors duration-150 hover:border-[#1db884]/40 hover:bg-[#1db884]/[0.06] hover:text-[#1db884]/90",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1db884]/40",
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar cliente
        </button>
      </footer>
    </section>
  );
}
