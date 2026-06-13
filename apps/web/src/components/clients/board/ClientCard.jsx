import { Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { getClientDotColor, daysBetween } from "@/data/clientsMock";
import ClientAvatar from "./ClientAvatar";
import WhatsappIcon from "./WhatsappIcon";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function nextSessionLabel(value) {
  if (!value) return null;
  const date = parseISO(value);
  if (isToday(date)) return "Hoje";
  if (isTomorrow(date)) return "Amanhã";
  return format(date, "d 'de' MMM", { locale: ptBR });
}

// Surfaces a "stale" warning when a card sat in its stage for too long.
function staleWarning(client) {
  const days = daysBetween(client.createdAt);
  if (days == null) return null;
  if (client.estagio === "interesse" && days >= 14) {
    return `Sem resposta há ${days}d`;
  }
  if (client.estagio === "agendado" && (client.depositoPago || 0) === 0 && days >= 7) {
    return "Aguardando depósito";
  }
  if (client.estagio === "concluido" && (client.depositoPago || 0) === 0) {
    return "Pagamento pendente";
  }
  return null;
}

// Highlights the next session when it's close (today/tomorrow).
function isImminent(value) {
  if (!value) return false;
  const date = parseISO(value);
  return isToday(date) || isTomorrow(date);
}

// Renders the card visual. Used both in-place (via the sortable wrapper below)
// and standalone inside DragOverlay — that's why `isDragging` is a prop.
export function ClientCardVisual({ client, onClick, onOpenConversation, isDragging }) {
  const dotColor = getClientDotColor(client);
  const sessionLabel = nextSessionLabel(client.proximaSessao);
  const imminent = isImminent(client.proximaSessao);
  const stale = staleWarning(client);
  const isPaid = client.estagio === "pago";
  const inProgress = client.estagio === "emAndamento";
  const progressPct =
    inProgress && client.sessoesTotal
      ? Math.round((client.sessoesFeitas / client.sessoesTotal) * 100)
      : null;

  const handleWhatsapp = (event) => {
    event.stopPropagation();
    onOpenConversation?.(client);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(client)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(client);
        }
      }}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border bg-[#16181c] p-3 text-left",
        "shadow-[0_0_0_1px_rgba(29,184,132,0.05),0_2px_8px_-4px_rgba(29,184,132,0.10)]",
        "transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out",
        "hover:-translate-y-[1px] hover:bg-[#1a1d22] hover:shadow-[0_10px_26px_-12px_rgba(29,184,132,0.30),0_2px_8px_-2px_rgba(0,0,0,0.4)]",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1db884]/50",
        isPaid
          ? "border-[#1db884]/45 hover:border-[#1db884]/65"
          : "border-[#1db884]/30 hover:border-[#1db884]/55",
        isDragging &&
          "shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(29,184,132,0.5),0_0_36px_-4px_rgba(29,184,132,0.45)]",
      )}
    >
      {/* Top accent line for paid — subtle "closed deal" cue */}
      {isPaid && (
        <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#1db884]/70 to-transparent" />
      )}

      <div className="flex items-start gap-2.5">
        <ClientAvatar name={client.nome} size={36} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: dotColor }}
              aria-hidden="true"
            />
            <span className="truncate text-[13.5px] font-semibold leading-tight text-white/95">
              {client.nome}
            </span>
          </div>
          <div className="mt-1.5 inline-flex items-center rounded-full border border-[#1db884]/25 bg-[#1db884]/[0.08] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[#1db884]/90">
            {client.estilo}
          </div>
        </div>
      </div>

      {/* Progress bar for "em andamento" — shows campaign-style completion */}
      {inProgress && progressPct != null && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[10px]">
            <span className="font-medium uppercase tracking-[0.08em] text-white/40">
              Progresso
            </span>
            <span className="font-semibold tabular-nums text-white/75">
              {client.sessoesFeitas}/{client.sessoesTotal}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/[0.04]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1db884]/70 to-[#1db884] transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Stale warning */}
      {stale && (
        <div className="mt-2.5 flex items-center gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/[0.08] px-2 py-1 text-[10.5px] font-medium text-amber-300/90">
          <AlertTriangle className="h-3 w-3" />
          <span>{stale}</span>
        </div>
      )}

      <div className="mt-3 flex items-end justify-between gap-3 border-t border-[#1db884]/[0.10] pt-3">
        <div>
          <div className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-white/35">
            Valor
          </div>
          <div className="mt-0.5 text-[15px] font-bold tabular-nums leading-none text-white/95">
            {brl.format(client.valor)}
          </div>
        </div>

        {sessionLabel ? (
          <div
            className={cn(
              "flex items-center gap-1 rounded-md border px-1.5 py-1 text-[10.5px] font-medium transition-colors",
              imminent
                ? "border-[#1db884]/35 bg-[#1db884]/[0.08] text-[#1db884]"
                : "border-white/[0.05] bg-white/[0.02] text-white/65",
            )}
          >
            <Calendar
              className={cn(
                "h-3 w-3",
                imminent ? "text-[#1db884]" : "text-white/40",
              )}
            />
            <span className="tabular-nums">{sessionLabel}</span>
          </div>
        ) : (
          <span className="text-[10.5px] font-medium text-white/30">
            Sem agenda
          </span>
        )}
      </div>

      {/* Top-right corner — WhatsApp on most, paid badge on closed deals */}
      <div className="absolute right-2 top-2 flex items-center gap-1">
        {isPaid && (
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[#1db884]/[0.15] text-[#1db884]">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </span>
        )}
        {client.whatsapp && (
          <button
            type="button"
            onClick={handleWhatsapp}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Abrir conversa no WhatsApp"
            title="Abrir conversa"
            className="grid h-6 w-6 place-items-center rounded-md text-white/30 transition-colors hover:bg-[#1db884]/[0.12] hover:text-[#1db884] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1db884]/40"
          >
            <WhatsappIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Default export: the sortable wrapper used inside columns. When the card is
// being dragged, the in-place version stays mounted but fades (so the column
// keeps its layout height) while the DragOverlay paints the lifted version
// on top via ClientCardVisual.
export default function ClientCard({
  client,
  onClick,
  onOpenConversation,
  isOverlayActive,
}) {
  const sortable = useSortable({ id: client.id });
  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
    opacity: isOverlayActive ? 0.3 : 1,
  };

  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      {...sortable.attributes}
      {...sortable.listeners}
      className={cn("touch-none", isOverlayActive && "pointer-events-none")}
    >
      <ClientCardVisual
        client={client}
        onClick={onClick}
        onOpenConversation={onOpenConversation}
        isDragging={false}
      />
    </div>
  );
}
