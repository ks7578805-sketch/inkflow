import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { STAGE_BY_ID } from "@/data/clientsMock";
import ClientAvatar from "./ClientAvatar";

// One row of the WhatsApp conversation list. Draggable straight into a board
// column. Visual is intentionally lean — avatar, name, last-message preview,
// timestamp, label dot — so a dense list reads at a glance without feeling
// noisy.
//
// `isOverlayActive` matches the board's pattern: the row stays mounted but
// fades while the DragOverlay paints the lifted clone on top.
export function WhatsappContactItemVisual({ contact, isDragging }) {
  const dotColor =
    contact.corEtiqueta ?? STAGE_BY_ID[contact.estagioSugerido]?.dot ?? "#6b7280";
  const unread = contact.naoLida;

  return (
    <div
      className={cn(
        "group flex items-start gap-2.5 rounded-lg border border-transparent bg-transparent px-2.5 py-2 text-left",
        "transition-[background-color,border-color,box-shadow] duration-150",
        "hover:bg-white/[0.025] hover:border-[#1db884]/[0.20] hover:shadow-[0_4px_14px_-8px_rgba(29,184,132,0.18)]",
        unread && "bg-[#1db884]/[0.04] border-[#1db884]/[0.10]",
        isDragging &&
          "border-[#1db884]/40 bg-[#16181c] shadow-[0_20px_46px_-16px_rgba(0,0,0,0.85),0_0_0_1px_rgba(29,184,132,0.4),0_0_28px_-6px_rgba(29,184,132,0.35)]",
      )}
    >
      <div className="relative">
        <ClientAvatar name={contact.nome} size={32} />
        {unread && (
          <span
            className="absolute -right-0.5 -top-0.5 grid h-2.5 w-2.5 place-items-center rounded-full bg-[#1db884] shadow-[0_0_6px_rgba(29,184,132,0.7)] ring-2 ring-[#0b0c0e]"
            aria-label="Mensagem não lida"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: dotColor }}
              aria-hidden="true"
            />
            <span
              className={cn(
                "truncate text-[12.5px] leading-tight",
                unread ? "font-semibold text-white" : "font-medium text-white/90",
              )}
            >
              {contact.nome}
            </span>
          </div>
          <span
            className={cn(
              "shrink-0 text-[9.5px] font-medium tabular-nums",
              unread ? "text-[#1db884]" : "text-white/30",
            )}
          >
            {contact.quandoLabel}
          </span>
        </div>
        <p
          className={cn(
            "mt-0.5 truncate text-[10.5px] leading-snug",
            unread ? "text-white/75" : "text-white/45",
          )}
        >
          {contact.ultimaMensagem}
        </p>
      </div>
    </div>
  );
}

// Default export — draggable wrapper used inside the panel list.
// A click without movement opens the in-app conversation drawer (the WhatsApp
// integration isn't live yet, so we show mock messages). A click with movement
// (≥8px) becomes a drag (PointerSensor activationConstraint upstream).
export default function WhatsappContactItem({
  contact,
  isOverlayActive,
  onOpenConversation,
}) {
  const draggable = useDraggable({ id: contact.id });
  const style = {
    transform: CSS.Transform.toString(draggable.transform),
    opacity: isOverlayActive ? 0.3 : 1,
  };

  const handleOpen = () => {
    onOpenConversation?.(contact);
  };

  return (
    <div
      ref={draggable.setNodeRef}
      style={style}
      {...draggable.attributes}
      {...draggable.listeners}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
      className={cn(
        "touch-none cursor-grab active:cursor-grabbing",
        isOverlayActive && "pointer-events-none",
      )}
    >
      <WhatsappContactItemVisual contact={contact} isDragging={false} />
    </div>
  );
}
