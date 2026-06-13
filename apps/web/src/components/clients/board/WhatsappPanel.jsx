import { useMemo, useState } from "react";
import { Link2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import WhatsappContactItem from "./WhatsappContactItem";
import WhatsappIcon from "./WhatsappIcon";

// Conversations panel that sits between the navigation sidebar and the board.
// Compact list of WhatsApp contacts — each one is draggable straight into a
// CRM column. A subtle footer note hints at the future label-sync story
// (WhatsApp tag colors flowing into the CRM via `corEtiqueta`).
export default function WhatsappPanel({
  contacts,
  activeId,
  onOpenConversation,
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.ultimaMensagem.toLowerCase().includes(q),
    );
  }, [contacts, query]);

  const unread = useMemo(
    () => contacts.filter((c) => c.naoLida).length,
    [contacts],
  );

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col overflow-hidden rounded-xl border border-[#1db884]/20 bg-[#0b0c0e] shadow-[0_0_0_1px_rgba(29,184,132,0.04)] md:flex">
      {/* Header */}
      <header className="border-b border-[#1db884]/[0.10] px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[#1db884]/[0.12] text-[#1db884] shadow-[inset_0_0_0_1px_rgba(29,184,132,0.20)]">
              <WhatsappIcon className="h-3.5 w-3.5" />
            </span>
            <div>
              <h3 className="text-[12.5px] font-semibold leading-tight text-white/95">
                WhatsApp
              </h3>
              <p className="text-[10px] leading-tight text-white/35">
                {contacts.length} conversa{contacts.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          {unread > 0 && (
            <span className="flex items-center gap-1 rounded-md bg-[#1db884]/[0.14] px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-[#1db884]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1db884] shadow-[0_0_6px_rgba(29,184,132,0.7)]" />
              {unread} nova{unread === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar conversa…"
            className="h-7 w-full rounded-md border border-[#1db884]/[0.12] bg-white/[0.025] pl-7 pr-2.5 text-[11.5px] text-white/90 placeholder:text-white/30 focus:border-[#1db884]/30 focus:bg-white/[0.04] focus:outline-none"
          />
        </div>
      </header>

      {/* Conversation list */}
      <div className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="grid place-items-center px-2 py-8 text-center">
            <p className="text-[11px] text-white/30">
              {query ? "Nada encontrado" : "Caixa de entrada vazia"}
            </p>
          </div>
        ) : (
          filtered.map((contact) => (
            <WhatsappContactItem
              key={contact.id}
              contact={contact}
              isOverlayActive={activeId === contact.id}
              onOpenConversation={onOpenConversation}
            />
          ))
        )}
      </div>

      {/* Sync note */}
      <footer
        className={cn(
          "flex items-start gap-2 border-t border-[#1db884]/[0.10] bg-[#1db884]/[0.025] px-4 py-3",
        )}
      >
        <Link2 className="mt-0.5 h-3 w-3 shrink-0 text-[#1db884]/65" />
        <p className="text-[10.5px] leading-snug text-white/45">
          Etiquetas sincronizam entre WhatsApp e CRM —{" "}
          <span className="text-white/65">cores acompanham o contato</span>.
        </p>
      </footer>
    </aside>
  );
}
