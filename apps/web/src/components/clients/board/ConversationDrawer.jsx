import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateConversation } from "@/data/conversationMock";
import ClientAvatar from "./ClientAvatar";
import WhatsappIcon from "./WhatsappIcon";

// In-app conversation drawer. Slides in from the right and renders a virtual
// chat — used while the WhatsApp Business integration is not wired yet.
// Person shape: { id, nome, whatsapp?, estilo?, valor? }
export default function ConversationDrawer({ person, onClose }) {
  return (
    <AnimatePresence>
      {person && (
        <motion.aside
          key={person.id}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.7 }}
          className="fixed bottom-4 right-4 top-[68px] z-50 flex w-[380px] flex-col overflow-hidden rounded-2xl border border-[#1db884]/25 bg-[#0c0e10] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85),0_0_0_1px_rgba(29,184,132,0.10)]"
        >
          <ChatHeader person={person} onClose={onClose} />
          <ChatBody person={person} />
          <ChatFooter />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function ChatHeader({ person, onClose }) {
  return (
    <div className="relative overflow-hidden border-b border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1db884]/[0.10] via-transparent to-transparent" />
      <div className="relative flex items-center gap-3 px-3 py-3">
        <button
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-lg text-white/55 transition-colors hover:bg-white/[0.05] hover:text-white"
          aria-label="Fechar conversa"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <ClientAvatar name={person.nome} size={38} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[13px] font-semibold text-white/95">
              {person.nome}
            </span>
            <span
              className="grid h-4 w-4 place-items-center rounded-md bg-[#1db884]/[0.12] text-[#1db884]"
              title="WhatsApp vinculado"
            >
              <WhatsappIcon className="h-2.5 w-2.5" />
            </span>
          </div>
          {person.whatsapp && (
            <div className="mt-0.5 flex items-center gap-1 text-[10.5px] text-white/45">
              <Phone className="h-2.5 w-2.5" />
              <span className="tabular-nums">{formatPhone(person.whatsapp)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatBody({ person }) {
  const messages = useMemo(() => generateConversation(person), [person]);

  return (
    <div className="flex-1 space-y-1.5 overflow-y-auto bg-[#08090a] px-3 py-4">
      {messages.length === 0 ? (
        <div className="grid h-full place-items-center">
          <p className="text-[11px] text-white/35">Sem mensagens</p>
        </div>
      ) : (
        messages.map((m, idx) => {
          const prev = messages[idx - 1];
          const showAvatar = m.side === "them" && (!prev || prev.side !== "them");
          return (
            <Bubble
              key={m.id}
              message={m}
              showAvatar={showAvatar}
              name={person.nome}
            />
          );
        })
      )}
    </div>
  );
}

function Bubble({ message, showAvatar, name }) {
  const me = message.side === "me";
  return (
    <div
      className={cn(
        "flex w-full items-end gap-1.5",
        me ? "justify-end" : "justify-start",
      )}
    >
      {!me && showAvatar ? (
        <ClientAvatar name={name} size={24} />
      ) : (
        !me && <div className="w-6 shrink-0" />
      )}
      <div
        className={cn(
          "max-w-[260px] rounded-xl px-2.5 py-1.5 text-[12px] leading-snug",
          me
            ? "rounded-br-sm bg-[#1db884]/[0.18] text-white/95 shadow-[inset_0_0_0_1px_rgba(29,184,132,0.30)]"
            : "rounded-bl-sm bg-white/[0.05] text-white/85 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
        )}
      >
        <p>{message.text}</p>
        <div
          className={cn(
            "mt-0.5 text-[9px] tabular-nums",
            me ? "text-[#1db884]/70" : "text-white/35",
          )}
        >
          {message.time}
        </div>
      </div>
    </div>
  );
}

function ChatFooter() {
  return (
    <div className="flex items-center gap-2 border-t border-white/[0.06] bg-white/[0.012] px-3 py-2.5">
      <div className="grid h-7 w-7 place-items-center rounded-md bg-amber-500/[0.10] text-amber-400">
        <Lock className="h-3 w-3" />
      </div>
      <div className="flex-1">
        <p className="text-[10.5px] font-medium leading-tight text-white/65">
          WhatsApp não conectado
        </p>
        <p className="text-[9.5px] leading-tight text-white/35">
          Conecte para enviar mensagens reais — conversas são mockadas
        </p>
      </div>
    </div>
  );
}

function formatPhone(raw = "") {
  const digits = raw.replace(/\D+/g, "");
  if (digits.length < 12) return raw;
  // +55 11 98765-4321
  const country = digits.slice(0, 2);
  const ddd = digits.slice(2, 4);
  const first = digits.slice(4, digits.length - 4);
  const last = digits.slice(-4);
  return `+${country} ${ddd} ${first}-${last}`;
}
