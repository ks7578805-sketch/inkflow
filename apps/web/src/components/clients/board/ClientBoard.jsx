import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { STAGES, getClientsByStage } from "@/data/clientsMock";
import ClientColumn from "./ClientColumn";

// Horizontal kanban board. The DndContext lives one level up in `Clients.jsx`
// because the WhatsApp panel and the board share a single drag space — this
// component just renders columns and reflects the lifted drag state via props.
//
// Wheel ΔY → scrollLeft is the Linear-style horizontal-pan trick; it only fires
// when the gesture is clearly vertical-dominant so a real horizontal trackpad
// swipe still works as expected.
export default function ClientBoard({
  clients,
  onCardClick,
  onAddClient,
  onOpenConversation,
  activeId,
  overStageId,
  sourceStageId,
}) {
  const scrollRef = useRef(null);
  const [atEnd, setAtEnd] = useState(false);

  const stageClients = useMemo(
    () =>
      STAGES.map((stage) => ({
        stage,
        clients: getClientsByStage(stage.id, clients),
      })),
    [clients],
  );

  const onWheel = useCallback((event) => {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    el.scrollLeft += event.deltaY;
    event.preventDefault();
  }, []);

  const updateEdgeState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const remaining = el.scrollWidth - el.clientWidth - el.scrollLeft;
    setAtEnd(remaining <= 8);
  }, []);

  useEffect(() => {
    updateEdgeState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdgeState, { passive: true });
    const ro = new ResizeObserver(updateEdgeState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateEdgeState);
      ro.disconnect();
    };
  }, [updateEdgeState]);

  return (
    <div className="relative flex-1 min-h-0 min-w-0">
      <div
        ref={scrollRef}
        onWheel={onWheel}
        className="flex h-full gap-6 overflow-x-auto overflow-y-hidden scroll-smooth px-1 pb-2"
        style={{ scrollbarGutter: "stable" }}
      >
        {stageClients.map(({ stage, clients: list }) => {
          const isActiveDropZone =
            Boolean(activeId) &&
            overStageId === stage.id &&
            sourceStageId !== stage.id;
          return (
            <ClientColumn
              key={stage.id}
              stage={stage}
              clients={list}
              onCardClick={onCardClick}
              onAddClient={onAddClient}
              onOpenConversation={onOpenConversation}
              isActiveDropZone={isActiveDropZone}
              activeId={activeId}
            />
          );
        })}
        <div className="w-2 shrink-0" aria-hidden="true" />
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#08090a] via-[#08090a]/70 to-transparent transition-opacity duration-200",
          atEnd && "opacity-0",
        )}
        aria-hidden="true"
      />
    </div>
  );
}
