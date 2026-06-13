import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  Pencil,
  Plus,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STAGES,
  STAGE_BY_ID,
  getClientDotColor,
  daysBetween,
} from "@/data/clientsMock";
import ClientAvatar from "./ClientAvatar";
import WhatsappIcon from "./WhatsappIcon";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function relativeDateLabel(iso) {
  if (!iso) return "—";
  const date = parseISO(iso);
  const today = new Date();
  const diffDays = Math.round(
    (date - new Date(today.getFullYear(), today.getMonth(), today.getDate())) /
      86400000,
  );
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays === -1) return "Ontem";
  return format(date, "EEEE, d 'de' MMM", { locale: ptBR });
}

function daysAgoLabel(iso) {
  const days = daysBetween(iso);
  if (days == null) return null;
  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  return `Há ${days} dias`;
}

export default function ClientDetailPanel({
  client,
  onClose,
  onOpenConversation,
}) {
  return (
    <AnimatePresence>
      {client && (
        <motion.aside
          key={client.id}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.7 }}
          className="fixed bottom-4 right-4 top-[68px] z-40 flex w-[420px] flex-col overflow-hidden rounded-2xl border border-[#1db884]/25 bg-[#0c0e10] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85),0_0_0_1px_rgba(29,184,132,0.08)]"
        >
          <Header client={client} onClose={onClose} />

          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            <NextSession client={client} />
            <PipelineTimeline client={client} />
            <ValueBreakdown client={client} />
            <Notes client={client} />
          </div>

          <Footer client={client} onOpenConversation={onOpenConversation} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Header({ client, onClose }) {
  const stage = STAGE_BY_ID[client.estagio];
  const dotColor = getClientDotColor(client);

  return (
    <div className="relative overflow-hidden border-b border-[#1db884]/[0.12]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1db884]/[0.12] via-transparent to-transparent" />
      <div className="relative p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/55 transition-colors hover:bg-white/[0.05] hover:text-white"
            aria-label="Fechar"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            className="grid h-8 w-8 place-items-center rounded-lg text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white"
            aria-label="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <ClientAvatar name={client.nome} size={56} />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[18px] font-bold leading-tight text-white">
              {client.nome}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: dotColor }}
              />
              <span
                className="text-[11px] font-semibold tracking-tight"
                style={{ color: dotColor }}
              >
                {stage?.label || "—"}
              </span>
              <span className="text-white/15">·</span>
              <span className="text-[11px] text-white/45">
                {daysAgoLabel(client.createdAt) ?? "—"}
              </span>
            </div>
            <div className="mt-1 inline-flex items-center rounded-full border border-[#1db884]/25 bg-[#1db884]/[0.08] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[#1db884]/90">
              {client.estilo}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/35">
      {children}
    </p>
  );
}

function NextSession({ client }) {
  if (!client.proximaSessao) {
    return (
      <div>
        <SectionTitle>Próxima sessão</SectionTitle>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-white/[0.06] bg-white/[0.012] px-3 py-3 text-[12px] text-white/35">
          <Calendar className="h-3.5 w-3.5 text-white/25" />
          Nenhuma sessão agendada
        </div>
      </div>
    );
  }
  return (
    <div>
      <SectionTitle>Próxima sessão</SectionTitle>
      <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#1db884]/25 bg-[#1db884]/[0.06] p-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#1db884]/[0.15] text-[#1db884]">
          <Calendar className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold capitalize text-white/95">
            {relativeDateLabel(client.proximaSessao)}
          </p>
          <p className="text-[11px] text-white/45">
            {client.estilo} · {brl.format(client.valor)}
          </p>
        </div>
      </div>
    </div>
  );
}

function PipelineTimeline({ client }) {
  const currentIdx = STAGES.findIndex((s) => s.id === client.estagio);
  return (
    <div>
      <SectionTitle>Pipeline</SectionTitle>
      <div className="mt-2 space-y-2">
        {STAGES.map((stage, idx) => {
          const done = idx < currentIdx;
          const current = idx === currentIdx;
          return (
            <div key={stage.id} className="flex items-center gap-2.5">
              <div
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors",
                  current && "border-[#1db884] bg-[#1db884]/[0.18] shadow-[0_0_0_4px_rgba(29,184,132,0.06)]",
                  done && "border-white/[0.10] bg-white/[0.04]",
                  !current && !done && "border-white/[0.06] bg-transparent",
                )}
              >
                {done && <CheckCircle2 className="h-3 w-3 text-white/55" />}
                {current && (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: stage.dot }}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[12.5px] transition-colors",
                  current && "font-semibold text-white",
                  done && "text-white/55",
                  !current && !done && "text-white/35",
                )}
              >
                {stage.label}
              </span>
              {current && client.createdAt && (
                <span className="ml-auto text-[10.5px] tabular-nums text-white/40">
                  {daysAgoLabel(client.createdAt)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ValueBreakdown({ client }) {
  const total = client.valor || 0;
  const pago = client.depositoPago || 0;
  const saldo = Math.max(0, total - pago);
  const percent = total > 0 ? Math.round((pago / total) * 100) : 0;
  return (
    <div>
      <SectionTitle>Valor</SectionTitle>
      <div className="mt-2 space-y-2.5">
        <div className="rounded-xl border border-[#1db884]/[0.12] bg-white/[0.018] p-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/55">Total</span>
            <span className="font-bold tabular-nums text-white/95">
              {brl.format(total)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-white/55">Depósito pago</span>
            <span className="font-semibold tabular-nums text-[#1db884]">
              {brl.format(pago)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-white/55">Saldo</span>
            <span
              className={cn(
                "font-semibold tabular-nums",
                saldo > 0 ? "text-amber-400" : "text-white/55",
              )}
            >
              {brl.format(saldo)}
            </span>
          </div>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.04]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1db884]/70 to-[#1db884] transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Notes({ client }) {
  return (
    <div>
      <SectionTitle>Notas</SectionTitle>
      <div className="mt-2 rounded-xl border border-dashed border-white/[0.06] bg-white/[0.012] p-3">
        <p className="text-[12px] leading-relaxed text-white/45">
          Nenhuma nota ainda. Use este espaço pra registrar referências, alergias,
          preferências de horário ou contexto da próxima sessão.
        </p>
        <button className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#1db884]/85 hover:text-[#1db884]">
          <Plus className="h-3 w-3" /> Adicionar nota
        </button>
      </div>
      {client.createdAt && (
        <div className="mt-3 flex items-center gap-1.5 text-[10.5px] text-white/30">
          <Clock className="h-3 w-3" />
          Cliente desde{" "}
          {format(parseISO(client.createdAt), "d 'de' MMM, yyyy", { locale: ptBR })}
        </div>
      )}
    </div>
  );
}

function Footer({ client, onOpenConversation }) {
  return (
    <div className="grid grid-cols-2 gap-2 border-t border-[#1db884]/[0.12] bg-white/[0.012] p-3">
      <button
        onClick={() => onOpenConversation?.(client)}
        className="flex items-center justify-center gap-1.5 rounded-lg border border-[#1db884]/25 bg-[#1db884]/[0.08] px-3 py-2 text-[12px] font-semibold text-[#1db884] transition-colors hover:bg-[#1db884]/[0.14]"
      >
        <WhatsappIcon className="h-3.5 w-3.5" />
        Conversar
      </button>
      <button className="flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[12px] font-semibold text-white/80 transition-colors hover:bg-white/[0.04] hover:text-white">
        <Calendar className="h-3.5 w-3.5" />
        Agendar
      </button>
    </div>
  );
}
