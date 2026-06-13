import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  XCircle,
  CalendarOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getSessionsByDate,
  getSessionColor,
  sessionDuration,
  shortTime,
  applyOverride,
} from "@/data/calendarMock";
import StatusAvatar from "./StatusAvatar";

const TIMELINE_START = 9;
const TIMELINE_END = 20;
const HOUR_HEIGHT = 64;
const TIMELINE_HOURS = TIMELINE_END - TIMELINE_START;

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function fmtDuration(hours) {
  const total = Math.round(hours * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return `${h}h${String(m).padStart(2, "0")}`;
  if (h) return `${h}h`;
  return `${m}min`;
}

function matchesFilters(session, filters) {
  if (!filters) return true;
  if (filters.statuses?.length && !filters.statuses.includes(session.status)) {
    return false;
  }
  if (filters.artists?.length && !filters.artists.includes(session.artistaNome)) {
    return false;
  }
  return true;
}

function SessionBlock({ session, selected, onSelect, onConfirm, onCancel }) {
  const color = getSessionColor(session);
  const [sh, sm] = session.horarioInicio.split(":").map(Number);
  const start = sh + sm / 60;
  const dur = sessionDuration(session);
  const visualStart = Math.max(start, TIMELINE_START);
  const visualEnd = Math.min(start + dur, TIMELINE_END);
  if (visualEnd <= visualStart) return null;

  const top = (visualStart - TIMELINE_START) * HOUR_HEIGHT;
  const height = Math.max(36, (visualEnd - visualStart) * HOUR_HEIGHT - 4);
  const muted = session.status === "cancelado";
  const depositPaid = (session.depositoPago || 0) > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(session.id)}
      style={{
        top,
        height,
        borderLeftColor: color.bar,
      }}
      className={cn(
        "group absolute left-14 right-1 overflow-hidden rounded-lg border border-white/[0.06] border-l-[3px] bg-white/[0.025] p-2 text-left",
        "transition-[background-color,box-shadow,transform] duration-150 ease-out",
        "hover:-translate-y-[1px] hover:bg-white/[0.045] hover:shadow-[0_6px_20px_rgba(0,0,0,0.28)]",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1db884]/40",
        muted && "opacity-55",
        selected &&
          "ring-2 ring-[#1db884]/55 shadow-[0_0_0_3px_rgba(29,184,132,0.08),0_0_22px_rgba(29,184,132,0.32)]",
      )}
    >
      <div className="flex items-start gap-2">
        <StatusAvatar session={session} size={32} />

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] tabular-nums text-white/45">
            <span>
              {shortTime(session.horarioInicio)} – {shortTime(session.horarioFim)}
            </span>
            <span className="text-white/15">·</span>
            <span>{fmtDuration(dur)}</span>
            <span
              className={cn(
                "ml-auto h-1.5 w-1.5 rounded-full",
                depositPaid ? "bg-[#1db884]" : "bg-amber-400",
              )}
              title={depositPaid ? "Depósito pago" : "Depósito pendente"}
            />
          </div>
          <div className="mt-0.5 truncate text-[13px] font-semibold text-white/95">
            {session.clienteNome}
          </div>
          <div className="truncate text-[11px] text-white/55">
            {session.estilo} · {session.artistaNome}
          </div>
        </div>
      </div>

      {/* Quick actions on hover (hidden when cancelled/finished) */}
      {!muted && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm?.(session.id);
            }}
            className="grid h-7 w-7 place-items-center rounded-md border border-[#1db884]/30 bg-[#08090a]/70 text-[#1db884] backdrop-blur transition-colors hover:bg-[#1db884]/15"
            aria-label="Confirmar"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.(session.id);
            }}
            className="grid h-7 w-7 place-items-center rounded-md border border-rose-500/25 bg-[#08090a]/70 text-rose-400 backdrop-blur transition-colors hover:bg-rose-500/15"
            aria-label="Cancelar"
          >
            <XCircle className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </button>
  );
}

function NowIndicator({ minutes }) {
  if (minutes == null) return null;
  const startMinutes = TIMELINE_START * 60;
  const endMinutes = TIMELINE_END * 60;
  if (minutes < startMinutes || minutes > endMinutes) return null;
  const top = ((minutes - startMinutes) / 60) * HOUR_HEIGHT;
  return (
    <div
      className="pointer-events-none absolute left-12 right-1 z-10 flex items-center"
      style={{ top }}
    >
      <div className="relative -ml-1.5 h-3 w-3">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#1db884]/60" />
        <span className="absolute inset-[3px] rounded-full bg-[#1db884] shadow-[0_0_8px_rgba(29,184,132,0.7)]" />
      </div>
      <div className="ml-1.5 h-px flex-1 bg-gradient-to-r from-[#1db884]/70 to-transparent" />
    </div>
  );
}

function MetricCard({ label, value, accent }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 transition-colors hover:bg-white/[0.035]">
      <div className="text-[10px] uppercase tracking-[0.06em] text-white/40">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-sm font-semibold tabular-nums",
          accent || "text-white/90",
        )}
      >
        {value}
      </div>
    </div>
  );
}

export default function DayDetailPanel({
  day,
  onClose,
  onToday,
  filters,
  overrides,
  onConfirm,
  onCancel,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const scrollRef = useRef(null);
  const [nowMinutes, setNowMinutes] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });

  const dateStr = useMemo(() => format(day, "yyyy-MM-dd"), [day]);
  const rawSessions = useMemo(() => getSessionsByDate(dateStr), [dateStr]);
  const allSessions = useMemo(
    () =>
      overrides?.size
        ? rawSessions.map((s) => applyOverride(s, overrides))
        : rawSessions,
    [rawSessions, overrides],
  );
  const sessions = useMemo(
    () => (filters ? allSessions.filter((s) => matchesFilters(s, filters)) : allSessions),
    [allSessions, filters],
  );
  const isToday = isSameDay(day, new Date());

  // Refresh the now-indicator every minute when the panel shows today.
  useEffect(() => {
    if (!isToday) return;
    const tick = () => {
      const n = new Date();
      setNowMinutes(n.getHours() * 60 + n.getMinutes());
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [isToday]);

  const metrics = useMemo(() => {
    const active = sessions.filter((s) => s.status !== "cancelado");
    const totalHours = active.reduce((acc, s) => acc + sessionDuration(s), 0);
    const recebidos = active.reduce(
      (acc, s) => acc + (s.depositoPago || 0),
      0,
    );
    const pendentes = active.reduce(
      (acc, s) =>
        acc + Math.max(0, (s.depositoTotal || 0) - (s.depositoPago || 0)),
      0,
    );
    return { count: active.length, totalHours, recebidos, pendentes };
  }, [sessions]);

  // Reset selection on day change; auto-scroll to "now" (today) or first session.
  useEffect(() => {
    setSelectedId(null);
    if (!scrollRef.current) return;
    const sessionStart = sessions[0]?.horarioInicio;
    const focusHour = isToday
      ? Math.max(TIMELINE_START, nowMinutes / 60 - 1)
      : sessionStart
        ? (() => {
            const [sh, sm] = sessionStart.split(":").map(Number);
            return Math.max(TIMELINE_START, sh + sm / 60);
          })()
        : TIMELINE_START;
    const top = Math.max(0, (focusHour - TIMELINE_START) * HOUR_HEIGHT - 24);
    scrollRef.current.scrollTo({ top, behavior: "smooth" });
    // We deliberately do not depend on nowMinutes — only the initial focus matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateStr, sessions]);

  const weekday = format(day, "EEEE", { locale: ptBR });
  const dayNum = format(day, "d");
  const monthLabel = format(day, "MMM", { locale: ptBR });
  const hours = Array.from(
    { length: TIMELINE_HOURS + 1 },
    (_, i) => TIMELINE_START + i,
  );

  return (
    <motion.aside
      key={dateStr}
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.7 }}
      className="flex w-full max-w-[440px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.018] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
    >
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1db884]/[0.10] via-transparent to-transparent" />
        <div className="relative flex items-start gap-3 p-4">
          <button
            onClick={onClose}
            className="mt-1 grid h-8 w-8 place-items-center rounded-lg text-white/55 transition-colors hover:bg-white/[0.05] hover:text-white"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold leading-none tabular-nums text-white">
                {dayNum}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#1db884]">
                {monthLabel}
              </span>
              {isToday && (
                <span className="rounded-full bg-[#1db884]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#1db884]">
                  Hoje
                </span>
              )}
            </div>
            <div className="mt-1 text-[12px] capitalize text-white/55">
              {weekday}
            </div>
          </div>

          <button
            onClick={onToday}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-[11px] font-medium text-white/70 transition-colors hover:bg-white/[0.05] hover:text-white/95"
          >
            <CalendarDays className="h-3 w-3" /> Hoje
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 py-3 scroll-smooth"
      >
        <div
          className="relative"
          style={{ height: TIMELINE_HOURS * HOUR_HEIGHT }}
        >
          {/* Hour rows + grid lines */}
          {hours.map((h, idx) => (
            <div
              key={h}
              className="pointer-events-none absolute left-0 right-0 flex items-start"
              style={{ top: idx * HOUR_HEIGHT }}
            >
              <div className="w-12 -translate-y-1 text-right text-[10px] tabular-nums text-white/30">
                {String(h).padStart(2, "0")}:00
              </div>
              <div className="ml-2 mt-0 flex-1 border-t border-white/[0.05]" />
            </div>
          ))}

          {/* Now indicator */}
          {isToday && <NowIndicator minutes={nowMinutes} />}

          {/* Sessions */}
          {sessions.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.03] text-white/40">
                <CalendarOff className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/75">
                  {allSessions.length === 0
                    ? "Dia livre"
                    : "Nenhuma sessão filtrada"}
                </p>
                <p className="mt-0.5 text-[11px] text-white/35">
                  {allSessions.length === 0
                    ? "Nenhuma sessão agendada para este dia."
                    : "Ajuste os filtros para visualizar sessões."}
                </p>
              </div>
            </div>
          ) : (
            sessions.map((s) => (
              <SessionBlock
                key={s.id}
                session={s}
                selected={selectedId === s.id}
                onSelect={setSelectedId}
                onConfirm={onConfirm}
                onCancel={onCancel}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer metrics */}
      <div className="grid grid-cols-2 gap-2 border-t border-white/[0.06] bg-white/[0.012] p-3">
        <MetricCard label="Sessões agendadas" value={metrics.count} />
        <MetricCard
          label="Duração total"
          value={fmtDuration(metrics.totalHours)}
        />
        <MetricCard
          label="Depósitos recebidos"
          value={brl.format(metrics.recebidos)}
          accent="text-[#1db884]"
        />
        <MetricCard
          label="Depósitos pendentes"
          value={brl.format(metrics.pendentes)}
          accent="text-amber-400"
        />
      </div>
    </motion.aside>
  );
}
