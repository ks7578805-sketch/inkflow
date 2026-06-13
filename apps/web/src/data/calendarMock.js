import { addDays, format } from "date-fns";

const d = (offset) => format(addDays(new Date(), offset), "yyyy-MM-dd");

// Status color map — structured for future per-client WhatsApp label overrides.
// corEtiqueta (optional hex) overrides the status color when present.
export const STATUS_COLORS = {
  confirmado: {
    dot: "#1db884",
    chipBg: "rgba(29,184,132,0.09)",
    chipBorder: "rgba(29,184,132,0.18)",
    chipText: "#1db884",
    bar: "#1db884",
    label: "Confirmado",
  },
  pendente: {
    dot: "#f59e0b",
    chipBg: "rgba(245,158,11,0.09)",
    chipBorder: "rgba(245,158,11,0.18)",
    chipText: "#f59e0b",
    bar: "#f59e0b",
    label: "Pendente",
  },
  cancelado: {
    dot: "rgba(255,255,255,0.22)",
    chipBg: "rgba(255,255,255,0.03)",
    chipBorder: "rgba(255,255,255,0.07)",
    chipText: "rgba(255,255,255,0.28)",
    bar: "rgba(255,255,255,0.14)",
    label: "Cancelado",
  },
};

// Status style map keyed by the API status labels (capitalized PT-BR).
// Consumed by DayView, WeekView and SessionDetailPanel — values are Tailwind classes.
export const SESSION_STATUS = {
  "Confirmada": { bar: "bg-primary", dot: "bg-primary", color: "bg-primary/10 border-primary/20 text-primary" },
  "Concluída": { bar: "bg-muted-foreground/40", dot: "bg-muted-foreground/40", color: "bg-muted/30 border-border/30 text-muted-foreground" },
  "Em andamento": { bar: "bg-blue-500", dot: "bg-blue-500", color: "bg-blue-500/10 border-blue-500/20 text-blue-500" },
  "Aguardando depósito": { bar: "bg-amber-500", dot: "bg-amber-500", color: "bg-amber-500/10 border-amber-500/20 text-amber-500" },
  "Cancelada": { bar: "bg-destructive", dot: "bg-destructive", color: "bg-destructive/10 border-destructive/20 text-destructive" },
};

// Builds a full color config from a single hex (e.g. a synced WhatsApp label color).
// Keeps the same shape as STATUS_COLORS so consumers stay agnostic to the source.
function buildColorFromHex(hex) {
  const m = hex.replace("#", "").match(/.{1,2}/g);
  if (!m || m.length < 3) return STATUS_COLORS.confirmado;
  const [r, g, b] = m.map((h) => parseInt(h, 16));
  const rgba = (a) => `rgba(${r},${g},${b},${a})`;
  return {
    dot: hex,
    chipBg: rgba(0.09),
    chipBorder: rgba(0.18),
    chipText: hex,
    bar: hex,
    label: "Etiqueta",
  };
}

// Returns color config for a session. A per-client/label color (corEtiqueta) takes
// precedence — this is where synced WhatsApp label colors will plug in — and falls
// back to the status color when absent.
export function getSessionColor(session) {
  if (session?.corEtiqueta) return buildColorFromHex(session.corEtiqueta);
  return STATUS_COLORS[session?.status] ?? STATUS_COLORS.confirmado;
}

// ── Session helpers (pure, mock-shape; mirror the future API contract) ──────────
export const firstName = (fullName = "") => fullName.trim().split(/\s+/)[0] ?? "";

export const shortTime = (hhmm = "") => hhmm.slice(0, 5);

export function sessionDuration(session) {
  const [sh, sm] = session.horarioInicio.split(":").map(Number);
  const [eh, em] = session.horarioFim.split(":").map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
}

export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Deterministic gradient pick for an avatar (Tailwind classes).
const AVATAR_GRADIENTS = [
  "from-emerald-500/35 to-emerald-700/40 text-emerald-100",
  "from-violet-500/35 to-violet-700/40 text-violet-100",
  "from-sky-500/35 to-sky-700/40 text-sky-100",
  "from-amber-500/30 to-amber-700/40 text-amber-100",
  "from-rose-500/30 to-rose-700/40 text-rose-100",
  "from-teal-500/35 to-teal-700/40 text-teal-100",
  "from-indigo-500/35 to-indigo-700/40 text-indigo-100",
];

export function avatarGradient(seed = "") {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
}

// Returns the session merged with any local override (mock-only, in-memory state).
export function applyOverride(session, overrides) {
  if (!overrides || !overrides.size) return session;
  const ov = overrides.get(session.id);
  return ov ? { ...session, ...ov } : session;
}

// ── Aggregate helpers for the stats bar ────────────────────────────────────────
export function getMonthStats(cursor, overrides) {
  ensureIndex();
  const year = cursor.getFullYear();
  const month = String(cursor.getMonth() + 1).padStart(2, "0");
  const prefix = `${year}-${month}-`;

  let total = 0;
  let active = 0;
  let cancelled = 0;
  let confirmed = 0;
  let revenue = 0;
  let busyHours = 0;
  const daysWithSessions = new Set();

  for (const [date, list] of SESSIONS_BY_DATE) {
    if (!date.startsWith(prefix)) continue;
    for (const raw of list) {
      const s = applyOverride(raw, overrides);
      total += 1;
      if (s.status === "cancelado") {
        cancelled += 1;
        continue;
      }
      active += 1;
      if (s.status === "confirmado") confirmed += 1;
      revenue += s.depositoTotal || 0;
      busyHours += sessionDuration(s);
      daysWithSessions.add(date);
    }
  }

  const daysInMonth = new Date(year, cursor.getMonth() + 1, 0).getDate();
  const businessHoursPerDay = 11; // 09:00–20:00 — must match TIMELINE_* in DayDetailPanel
  const capacity = daysInMonth * businessHoursPerDay;
  const occupancy = capacity > 0 ? busyHours / capacity : 0;

  return {
    total,
    active,
    cancelled,
    confirmed,
    revenue,
    busyHours,
    occupancy,
    daysWithSessions: daysWithSessions.size,
  };
}

export function getNextSession(reference = new Date()) {
  ensureIndex();
  const refDate = format2(reference);
  const refTime = String(reference.getHours()).padStart(2, "0") + ":" +
    String(reference.getMinutes()).padStart(2, "0");

  let best = null;
  for (const [date, list] of SESSIONS_BY_DATE) {
    if (date < refDate) continue;
    for (const s of list) {
      if (s.status === "cancelado") continue;
      if (date === refDate && s.horarioInicio < refTime) continue;
      if (!best || date < best.data || (date === best.data && s.horarioInicio < best.horarioInicio)) {
        best = s;
      }
    }
  }
  return best;
}

function format2(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Unique artist list (for the filter dropdown).
export function getArtists() {
  return Array.from(new Set(MOCK_SESSIONS.map((s) => s.artistaNome))).sort();
}

// Pre-built index — avoids O(N) filter on every calendar cell render.
const EMPTY_SESSIONS = Object.freeze([]);
const SESSIONS_BY_DATE = new Map();
function ensureIndex() {
  if (SESSIONS_BY_DATE.size) return;
  for (const s of MOCK_SESSIONS) {
    const arr = SESSIONS_BY_DATE.get(s.data);
    if (arr) arr.push(s);
    else SESSIONS_BY_DATE.set(s.data, [s]);
  }
  for (const arr of SESSIONS_BY_DATE.values()) {
    arr.sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio));
  }
}

export const getSessionsByDate = (dateStr) => {
  ensureIndex();
  return SESSIONS_BY_DATE.get(dateStr) ?? EMPTY_SESSIONS;
};

// Session data — all dates dynamic relative to new Date().
// Fields match the future API contract: id, clienteNome, estilo, horarioInicio,
// horarioFim, status, corEtiqueta, depositoPago, depositoTotal, artistaNome.
export const MOCK_SESSIONS = [
  // -7 (June 4)
  { id: "s01", data: d(-7), horarioInicio: "10:00", horarioFim: "13:00", clienteNome: "Rafaela Souza", estilo: "Aquarela", artistaNome: "Camila Torres", status: "confirmado", depositoPago: 350, depositoTotal: 1050, corEtiqueta: null },
  { id: "s02", data: d(-7), horarioInicio: "14:00", horarioFim: "16:00", clienteNome: "Bruno Teixeira", estilo: "Blackwork", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 250, depositoTotal: 700, corEtiqueta: null },

  // -6 (June 5, sábado)
  { id: "s03", data: d(-6), horarioInicio: "11:00", horarioFim: "14:00", clienteNome: "Luana Ferreira", estilo: "Fine Line", artistaNome: "Marta Velez", status: "confirmado", depositoPago: 300, depositoTotal: 900, corEtiqueta: null },

  // -4 (June 7, domingo)
  { id: "s04", data: d(-4), horarioInicio: "09:00", horarioFim: "12:00", clienteNome: "Diego Nunes", estilo: "Japonês", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 400, depositoTotal: 1200, corEtiqueta: null },

  // -3 (June 8)
  { id: "s05", data: d(-3), horarioInicio: "09:00", horarioFim: "11:00", clienteNome: "Clara Monteiro", estilo: "Geométrico", artistaNome: "João Lucas", status: "confirmado", depositoPago: 200, depositoTotal: 600, corEtiqueta: null },
  { id: "s06", data: d(-3), horarioInicio: "13:00", horarioFim: "16:00", clienteNome: "Felipe Azevedo", estilo: "Realismo", artistaNome: "Marta Velez", status: "cancelado", depositoPago: 0, depositoTotal: 1100, corEtiqueta: null },
  { id: "s07", data: d(-3), horarioInicio: "17:00", horarioFim: "20:00", clienteNome: "Amanda Reis", estilo: "Old School", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 300, depositoTotal: 850, corEtiqueta: null },

  // -2 (June 9)
  { id: "s08", data: d(-2), horarioInicio: "10:00", horarioFim: "12:00", clienteNome: "Gustavo Pinto", estilo: "Blackwork", artistaNome: "João Lucas", status: "confirmado", depositoPago: 200, depositoTotal: 550, corEtiqueta: null },
  { id: "s09", data: d(-2), horarioInicio: "15:00", horarioFim: "18:00", clienteNome: "Isabela Rocha", estilo: "Aquarela", artistaNome: "Camila Torres", status: "pendente", depositoPago: 0, depositoTotal: 950, corEtiqueta: null },

  // -1 (June 10)
  { id: "s10", data: d(-1), horarioInicio: "09:00", horarioFim: "12:00", clienteNome: "Mateus Lima", estilo: "Japonês", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 500, depositoTotal: 1500, corEtiqueta: null },
  { id: "s11", data: d(-1), horarioInicio: "14:00", horarioFim: "17:00", clienteNome: "Natalia Costa", estilo: "Fine Line", artistaNome: "Marta Velez", status: "confirmado", depositoPago: 300, depositoTotal: 800, corEtiqueta: null },

  // 0 (June 11 — hoje, 4 sessões)
  { id: "s12", data: d(0), horarioInicio: "09:00", horarioFim: "12:00", clienteNome: "Lucas Mendes", estilo: "Japonês", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 400, depositoTotal: 1200, corEtiqueta: null },
  { id: "s13", data: d(0), horarioInicio: "13:00", horarioFim: "15:00", clienteNome: "Ana Beatriz", estilo: "Fine Line", artistaNome: "Marta Velez", status: "confirmado", depositoPago: 200, depositoTotal: 600, corEtiqueta: null },
  { id: "s14", data: d(0), horarioInicio: "15:30", horarioFim: "16:30", clienteNome: "Mariana Lopes", estilo: "Lettering", artistaNome: "Camila Torres", status: "pendente", depositoPago: 0, depositoTotal: 350, corEtiqueta: null },
  { id: "s15", data: d(0), horarioInicio: "17:00", horarioFim: "21:00", clienteNome: "Pedro Oliveira", estilo: "Blackwork", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 500, depositoTotal: 1400, corEtiqueta: null },

  // +1 (June 12)
  { id: "s16", data: d(1), horarioInicio: "10:00", horarioFim: "13:00", clienteNome: "Juliana Costa", estilo: "Realismo", artistaNome: "Marta Velez", status: "confirmado", depositoPago: 400, depositoTotal: 1200, corEtiqueta: null },
  { id: "s17", data: d(1), horarioInicio: "14:00", horarioFim: "17:00", clienteNome: "Ricardo Lima", estilo: "Old School", artistaNome: "João Lucas", status: "confirmado", depositoPago: 300, depositoTotal: 900, corEtiqueta: null },

  // +3 (June 14, sábado)
  { id: "s18", data: d(3), horarioInicio: "11:00", horarioFim: "14:00", clienteNome: "Thais Cardoso", estilo: "Geométrico", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 300, depositoTotal: 850, corEtiqueta: null },

  // +4 (June 15)
  { id: "s19", data: d(4), horarioInicio: "09:00", horarioFim: "11:00", clienteNome: "Vinicius Santos", estilo: "Blackwork", artistaNome: "João Lucas", status: "pendente", depositoPago: 0, depositoTotal: 550, corEtiqueta: null },
  { id: "s20", data: d(4), horarioInicio: "12:00", horarioFim: "15:00", clienteNome: "Camila Gomes", estilo: "Aquarela", artistaNome: "Camila Torres", status: "confirmado", depositoPago: 350, depositoTotal: 1000, corEtiqueta: null },
  { id: "s21", data: d(4), horarioInicio: "16:00", horarioFim: "19:00", clienteNome: "Eduardo Martins", estilo: "Japonês", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 400, depositoTotal: 1100, corEtiqueta: null },

  // +5 (June 16)
  { id: "s22", data: d(5), horarioInicio: "10:00", horarioFim: "13:00", clienteNome: "Patricia Alves", estilo: "Realismo", artistaNome: "Marta Velez", status: "confirmado", depositoPago: 500, depositoTotal: 1400, corEtiqueta: null },
  { id: "s23", data: d(5), horarioInicio: "15:00", horarioFim: "18:00", clienteNome: "Rodrigo Cunha", estilo: "Old School", artistaNome: "Rafael Ink", status: "cancelado", depositoPago: 0, depositoTotal: 750, corEtiqueta: null },

  // +6 (June 17)
  { id: "s24", data: d(6), horarioInicio: "09:00", horarioFim: "12:00", clienteNome: "Fernanda Dias", estilo: "Fine Line", artistaNome: "Camila Torres", status: "confirmado", depositoPago: 250, depositoTotal: 700, corEtiqueta: null },
  { id: "s25", data: d(6), horarioInicio: "14:00", horarioFim: "16:00", clienteNome: "Leonardo Moraes", estilo: "Geométrico", artistaNome: "João Lucas", status: "pendente", depositoPago: 0, depositoTotal: 600, corEtiqueta: null },

  // +7 (June 18)
  { id: "s26", data: d(7), horarioInicio: "10:00", horarioFim: "13:00", clienteNome: "Tatiana Ribeiro", estilo: "Blackwork", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 300, depositoTotal: 900, corEtiqueta: null },
  { id: "s27", data: d(7), horarioInicio: "13:30", horarioFim: "15:30", clienteNome: "Henrique Carvalho", estilo: "Old School", artistaNome: "Marta Velez", status: "confirmado", depositoPago: 200, depositoTotal: 650, corEtiqueta: null },
  { id: "s28", data: d(7), horarioInicio: "16:00", horarioFim: "18:00", clienteNome: "Samara Pereira", estilo: "Fine Line", artistaNome: "Camila Torres", status: "pendente", depositoPago: 0, depositoTotal: 550, corEtiqueta: null },

  // +8 (June 19)
  { id: "s29", data: d(8), horarioInicio: "11:00", horarioFim: "14:00", clienteNome: "André Mendonça", estilo: "Japonês", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 400, depositoTotal: 1300, corEtiqueta: null },

  // +11 (June 22)
  { id: "s30", data: d(11), horarioInicio: "09:00", horarioFim: "11:00", clienteNome: "Bruna Oliveira", estilo: "Lettering", artistaNome: "João Lucas", status: "confirmado", depositoPago: 150, depositoTotal: 400, corEtiqueta: null },
  { id: "s31", data: d(11), horarioInicio: "12:00", horarioFim: "15:00", clienteNome: "Caio Ferreira", estilo: "Realismo", artistaNome: "Marta Velez", status: "confirmado", depositoPago: 450, depositoTotal: 1350, corEtiqueta: null },
  { id: "s32", data: d(11), horarioInicio: "16:00", horarioFim: "19:00", clienteNome: "Débora Santos", estilo: "Aquarela", artistaNome: "Rafael Ink", status: "pendente", depositoPago: 0, depositoTotal: 950, corEtiqueta: null },

  // +13 (June 24)
  { id: "s33", data: d(13), horarioInicio: "10:00", horarioFim: "13:00", clienteNome: "Fábio Ribeiro", estilo: "Blackwork", artistaNome: "João Lucas", status: "confirmado", depositoPago: 300, depositoTotal: 800, corEtiqueta: null },
  { id: "s34", data: d(13), horarioInicio: "15:00", horarioFim: "18:00", clienteNome: "Giovana Lima", estilo: "Geométrico", artistaNome: "Camila Torres", status: "confirmado", depositoPago: 350, depositoTotal: 950, corEtiqueta: null },

  // +14 (June 25)
  { id: "s35", data: d(14), horarioInicio: "09:00", horarioFim: "12:00", clienteNome: "Hugo Barbosa", estilo: "Old School", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 300, depositoTotal: 850, corEtiqueta: null },
  { id: "s36", data: d(14), horarioInicio: "14:00", horarioFim: "16:00", clienteNome: "Ingrid Campos", estilo: "Fine Line", artistaNome: "Marta Velez", status: "pendente", depositoPago: 0, depositoTotal: 650, corEtiqueta: null },

  // +16 (June 27, sábado)
  { id: "s37", data: d(16), horarioInicio: "11:00", horarioFim: "15:00", clienteNome: "Jonas Nascimento", estilo: "Japonês", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 500, depositoTotal: 1500, corEtiqueta: null },

  // +18 (June 29)
  { id: "s38", data: d(18), horarioInicio: "09:00", horarioFim: "12:00", clienteNome: "Karina Melo", estilo: "Realismo", artistaNome: "Marta Velez", status: "confirmado", depositoPago: 400, depositoTotal: 1200, corEtiqueta: null },
  { id: "s39", data: d(18), horarioInicio: "13:00", horarioFim: "15:00", clienteNome: "Luis Fernando", estilo: "Blackwork", artistaNome: "João Lucas", status: "confirmado", depositoPago: 200, depositoTotal: 600, corEtiqueta: null },
  { id: "s40", data: d(18), horarioInicio: "16:00", horarioFim: "19:00", clienteNome: "Marina Souza", estilo: "Aquarela", artistaNome: "Camila Torres", status: "pendente", depositoPago: 0, depositoTotal: 950, corEtiqueta: null },

  // +19 (June 30)
  { id: "s41", data: d(19), horarioInicio: "10:00", horarioFim: "13:00", clienteNome: "Nelson Prado", estilo: "Old School", artistaNome: "Rafael Ink", status: "confirmado", depositoPago: 350, depositoTotal: 950, corEtiqueta: null },
  { id: "s42", data: d(19), horarioInicio: "15:00", horarioFim: "17:00", clienteNome: "Olivia Campos", estilo: "Geométrico", artistaNome: "João Lucas", status: "confirmado", depositoPago: 200, depositoTotal: 550, corEtiqueta: null },
];
