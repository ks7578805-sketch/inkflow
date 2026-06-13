import { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import ClientBoard from "@/components/clients/board/ClientBoard";
import WhatsappPanel from "@/components/clients/board/WhatsappPanel";
import { ClientCardVisual } from "@/components/clients/board/ClientCard";
import { WhatsappContactItemVisual } from "@/components/clients/board/WhatsappContactItem";
import ConversationDrawer from "@/components/clients/board/ConversationDrawer";
import ClientsHero from "@/components/clients/board/ClientsHero";
import ClientDetailPanel from "@/components/clients/board/ClientDetailPanel";
import { MOCK_CLIENTS, STAGE_BY_ID } from "@/data/clientsMock";
import { MOCK_WHATSAPP_CONTACTS } from "@/data/whatsappMock";

const WA_PREFIX = "wa-";

export default function Clients() {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [contacts, setContacts] = useState(MOCK_WHATSAPP_CONTACTS);
  const [activeId, setActiveId] = useState(null);
  const [overStageId, setOverStageId] = useState(null);
  const [openConversation, setOpenConversation] = useState(null);
  const [openDetail, setOpenDetail] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.estilo.toLowerCase().includes(q) ||
        (c.whatsapp || "").includes(q),
    );
  }, [clients, search]);

  // The drag source's "stage" — undefined for WhatsApp contacts so any column
  // they land on lights up. For a board card it's the current column.
  const sourceStageId = useMemo(() => {
    if (!activeId) return null;
    if (activeId.startsWith(WA_PREFIX)) return null;
    return clients.find((c) => c.id === activeId)?.estagio ?? null;
  }, [activeId, clients]);

  // Keeps the detail panel in sync with the latest version of the client after
  // a drag drop — the panel reads from the source-of-truth array.
  const openDetailClient = useMemo(() => {
    if (!openDetail) return null;
    return clients.find((c) => c.id === openDetail.id) ?? openDetail;
  }, [openDetail, clients]);

  // Reorders the global client array so the moved client sits at the right
  // position inside its (possibly new) stage. The board derives per-stage
  // lists by filtering this flat array, so position here drives column order.
  const moveClient = useCallback((id, targetStage, beforeId) => {
    setClients((prev) => {
      const fromIndex = prev.findIndex((c) => c.id === id);
      if (fromIndex === -1) return prev;
      const current = prev[fromIndex];
      if (current.estagio === targetStage && current.id === beforeId) {
        return prev;
      }

      const next = prev.slice();
      const [removed] = next.splice(fromIndex, 1);
      const updated = { ...removed, estagio: targetStage };

      let insertAt;
      if (beforeId) {
        const idx = next.findIndex((c) => c.id === beforeId);
        insertAt = idx === -1 ? next.length : idx;
      } else {
        let lastIdx = -1;
        for (let i = 0; i < next.length; i += 1) {
          if (next[i].estagio === targetStage) lastIdx = i;
        }
        insertAt = lastIdx + 1;
      }

      next.splice(insertAt, 0, updated);
      return next;
    });
  }, []);

  // Converts a WhatsApp contact into a board client and removes it from the inbox.
  const addClientFromContact = useCallback(
    (contact, targetStage, beforeId) => {
      const todayStr = (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      })();
      const newClient = {
        id: `c-from-${contact.id}`,
        nome: contact.nome,
        estilo: "A definir",
        estagio: targetStage,
        valor: 0,
        proximaSessao: null,
        whatsapp: contact.whatsapp,
        corEtiqueta: contact.corEtiqueta ?? null,
        createdAt: todayStr,
      };

      setClients((prev) => {
        const next = prev.slice();
        let insertAt;
        if (beforeId) {
          const idx = next.findIndex((c) => c.id === beforeId);
          insertAt = idx === -1 ? next.length : idx;
        } else {
          let lastIdx = -1;
          for (let i = 0; i < next.length; i += 1) {
            if (next[i].estagio === targetStage) lastIdx = i;
          }
          insertAt = lastIdx + 1;
        }
        next.splice(insertAt, 0, newClient);
        return next;
      });

      setContacts((prev) => prev.filter((c) => c.id !== contact.id));
    },
    [],
  );

  const resolveStageId = useCallback(
    (id) => {
      if (!id) return null;
      if (STAGE_BY_ID[id]) return id;
      const client = clients.find((c) => c.id === id);
      return client?.estagio ?? null;
    },
    [clients],
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setOverStageId(resolveStageId(event.active.id));
  };

  const handleDragOver = (event) => {
    setOverStageId(resolveStageId(event.over?.id));
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverStageId(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverStageId(null);
    if (!over) return;

    const overId = over.id;
    let targetStage;
    let beforeId = null;
    if (STAGE_BY_ID[overId]) {
      targetStage = overId;
    } else {
      const overClient = clients.find((c) => c.id === overId);
      if (!overClient) return;
      targetStage = overClient.estagio;
      beforeId = overClient.id;
    }

    const draggedId = active.id;
    if (draggedId.startsWith(WA_PREFIX)) {
      const contact = contacts.find((c) => c.id === draggedId);
      if (!contact) return;
      addClientFromContact(contact, targetStage, beforeId);
    } else {
      moveClient(draggedId, targetStage, beforeId);
    }
  };

  const handleCardClick = useCallback((client) => {
    setOpenDetail(client);
  }, []);

  const handleOpenConversation = useCallback((person) => {
    setOpenConversation(person);
  }, []);

  const handleAddClient = (stageId) => {
    // Hook reservado para o NewClientModal (próxima fase de integração).
    // eslint-disable-next-line no-console
    console.info("[clients] add to stage →", stageId);
  };

  const activeClient =
    activeId && !activeId.startsWith(WA_PREFIX)
      ? clients.find((c) => c.id === activeId)
      : null;
  const activeContact =
    activeId && activeId.startsWith(WA_PREFIX)
      ? contacts.find((c) => c.id === activeId)
      : null;

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#08090a]">
      <Topbar title="Clientes" subtitle="CRM do estúdio" />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 min-h-0 min-w-0">
          {/* Hero with greeting + KPIs */}
          <ClientsHero clients={clients} />

          {/* Toolbar — search + filter + new */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px] flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, estilo ou telefone…"
                className="h-9 w-full rounded-lg border border-[#1db884]/20 bg-white/[0.025] pl-9 pr-3 text-[13px] text-white/90 placeholder:text-white/30 focus:border-[#1db884]/40 focus:bg-white/[0.04] focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg border border-[#1db884]/20 bg-white/[0.025] text-white/55 transition-colors hover:border-[#1db884]/40 hover:bg-white/[0.04] hover:text-white"
              aria-label="Filtros"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => handleAddClient(null)}
              className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-[#1db884] px-3 text-xs font-semibold text-[#08090a] shadow-[0_0_0_1px_rgba(29,184,132,0.4),0_6px_18px_-4px_rgba(29,184,132,0.55)] transition-colors hover:bg-[#26d39a]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Adicionar cliente</span>
            </button>
          </div>

          {/* WhatsApp panel + Board */}
          <div className="flex flex-1 gap-4 min-h-0 min-w-0">
            <WhatsappPanel
              contacts={contacts}
              activeId={activeId}
              onOpenConversation={handleOpenConversation}
            />

            <ClientBoard
              clients={filteredClients}
              onCardClick={handleCardClick}
              onAddClient={handleAddClient}
              onOpenConversation={handleOpenConversation}
              activeId={activeId}
              overStageId={overStageId}
              sourceStageId={sourceStageId}
            />
          </div>
        </div>

        {/* Drag overlay — paints whichever lifted clone is in motion. */}
        <DragOverlay
          dropAnimation={{
            duration: 220,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {activeClient ? (
            <div className="rotate-[2deg]">
              <ClientCardVisual client={activeClient} isDragging />
            </div>
          ) : activeContact ? (
            <div className="w-[280px] rotate-[1.5deg]">
              <WhatsappContactItemVisual contact={activeContact} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Detail drawer — z-40 so it sits below the conversation overlay */}
      <ClientDetailPanel
        client={openDetailClient}
        onClose={() => setOpenDetail(null)}
        onOpenConversation={handleOpenConversation}
      />

      {/* Conversation drawer — z-50, sits above the detail panel when both open */}
      <ConversationDrawer
        person={openConversation}
        onClose={() => setOpenConversation(null)}
      />
    </div>
  );
}
