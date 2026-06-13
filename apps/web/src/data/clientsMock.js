// Reusable stage color map — covers dot/glow needs.
// `corEtiqueta` on a client overrides the stage dot color — preparing the WhatsApp
// label-sync feature where a client carries the color of their WhatsApp tag.
export const STAGES = [
  {
    id: "interesse",
    label: "Interesse",
    dot: "#9ca3af",
    glow: "rgba(156,163,175,0.18)",
  },
  {
    id: "agendado",
    label: "Agendado",
    dot: "#3b82f6",
    glow: "rgba(59,130,246,0.22)",
  },
  {
    id: "emAndamento",
    label: "Em andamento",
    dot: "#f59e0b",
    glow: "rgba(245,158,11,0.22)",
  },
  {
    id: "concluido",
    label: "Concluído",
    dot: "#06b6d4",
    glow: "rgba(6,182,212,0.22)",
  },
  {
    id: "pago",
    label: "Pago",
    dot: "#1db884",
    glow: "rgba(29,184,132,0.25)",
  },
];

export const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s]));

export function getClientDotColor(client) {
  if (client?.corEtiqueta) return client.corEtiqueta;
  return STAGE_BY_ID[client?.estagio]?.dot ?? "#6b7280";
}

// Builds a wa.me link from a phone number — strips anything that isn't a digit
// so it works with the E.164 mock entries ("+5511987654321" → "5511987654321").
export function whatsappUrl(phone = "") {
  const digits = phone.replace(/\D+/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const today = new Date();
const d = (offset) => {
  const next = new Date(today);
  next.setDate(today.getDate() + offset);
  const y = next.getFullYear();
  const m = String(next.getMonth() + 1).padStart(2, "0");
  const day = String(next.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Field contract (matches the future API):
//   id, nome, estilo, estagio, valor, proximaSessao, whatsapp, corEtiqueta?,
//   createdAt, depositoPago?, sessoesFeitas?, sessoesTotal?
export const MOCK_CLIENTS = [
  // Interesse
  { id: "c01", nome: "Rafaela Souza", estilo: "Aquarela", estagio: "interesse", valor: 1200, proximaSessao: null, whatsapp: "+5511987654321", createdAt: d(-4) },
  { id: "c02", nome: "Bruno Teixeira", estilo: "Blackwork", estagio: "interesse", valor: 900, proximaSessao: null, whatsapp: "+5511996541230", createdAt: d(-2) },
  { id: "c03", nome: "Luana Ferreira", estilo: "Fine Line", estagio: "interesse", valor: 600, proximaSessao: null, whatsapp: "+5511992134568", createdAt: d(-18) },
  { id: "c04", nome: "Diego Nunes", estilo: "Japonês", estagio: "interesse", valor: 2400, proximaSessao: d(14), whatsapp: "+5511933221144", createdAt: d(-7) },

  // Agendado
  { id: "c05", nome: "Lucas Mendes", estilo: "Japonês", estagio: "agendado", valor: 1500, proximaSessao: d(2), whatsapp: "+5511987112233", createdAt: d(-12), depositoPago: 500 },
  { id: "c06", nome: "Ana Beatriz Lima", estilo: "Fine Line", estagio: "agendado", valor: 800, proximaSessao: d(4), whatsapp: "+5511944556677", corEtiqueta: "#a855f7", createdAt: d(-9), depositoPago: 300 },
  { id: "c07", nome: "Mariana Lopes", estilo: "Lettering", estagio: "agendado", valor: 450, proximaSessao: d(6), whatsapp: "+5511933445566", createdAt: d(-15), depositoPago: 0 },
  { id: "c08", nome: "Pedro Oliveira", estilo: "Blackwork", estagio: "agendado", valor: 1800, proximaSessao: d(1), whatsapp: "+5511988776655", createdAt: d(-6), depositoPago: 600 },
  { id: "c09", nome: "Juliana Costa", estilo: "Realismo", estagio: "agendado", valor: 2200, proximaSessao: d(8), whatsapp: "+5511955443322", createdAt: d(-3), depositoPago: 800 },

  // Em andamento
  { id: "c10", nome: "Camila Gomes", estilo: "Aquarela", estagio: "emAndamento", valor: 3200, proximaSessao: d(3), whatsapp: "+5511922113344", createdAt: d(-21), depositoPago: 1200, sessoesFeitas: 2, sessoesTotal: 4 },
  { id: "c11", nome: "Eduardo Martins", estilo: "Japonês", estagio: "emAndamento", valor: 4800, proximaSessao: d(10), whatsapp: "+5511966778899", corEtiqueta: "#ec4899", createdAt: d(-28), depositoPago: 2400, sessoesFeitas: 3, sessoesTotal: 6 },
  { id: "c12", nome: "Patricia Alves", estilo: "Realismo", estagio: "emAndamento", valor: 5500, proximaSessao: d(5), whatsapp: "+5511911223344", createdAt: d(-35), depositoPago: 2000, sessoesFeitas: 4, sessoesTotal: 5 },

  // Concluído
  { id: "c13", nome: "Rodrigo Cunha", estilo: "Old School", estagio: "concluido", valor: 1400, proximaSessao: null, whatsapp: "+5511977889900", createdAt: d(-30), depositoPago: 700 },
  { id: "c14", nome: "Fernanda Dias", estilo: "Fine Line", estagio: "concluido", valor: 700, proximaSessao: null, whatsapp: "+5511944332211", createdAt: d(-22), depositoPago: 700 },
  { id: "c15", nome: "Thiago Barros", estilo: "Tribal", estagio: "concluido", valor: 950, proximaSessao: null, whatsapp: "+5511988991122", createdAt: d(-26), depositoPago: 0 },

  // Pago
  { id: "c16", nome: "Isabela Rocha", estilo: "Aquarela", estagio: "pago", valor: 1800, proximaSessao: null, whatsapp: "+5511933556677", createdAt: d(-45), depositoPago: 1800 },
  { id: "c17", nome: "Gustavo Pinto", estilo: "Blackwork", estagio: "pago", valor: 1100, proximaSessao: null, whatsapp: "+5511977665544", createdAt: d(-38), depositoPago: 1100 },
  { id: "c18", nome: "Clara Monteiro", estilo: "Geométrico", estagio: "pago", valor: 1300, proximaSessao: null, whatsapp: "+5511944778899", createdAt: d(-51), depositoPago: 1300 },
  { id: "c19", nome: "Felipe Azevedo", estilo: "Realismo", estagio: "pago", valor: 2100, proximaSessao: null, whatsapp: "+5511966554433", createdAt: d(-44), depositoPago: 2100 },
];

export function getClientsByStage(stageId, clients = MOCK_CLIENTS) {
  return clients.filter((c) => c.estagio === stageId);
}

// ── Date + aggregate helpers used by hero KPIs and cards ────────────────────
export function daysBetween(fromStr, ref = new Date()) {
  if (!fromStr) return null;
  const [y, m, day] = fromStr.split("-").map(Number);
  const from = new Date(y, m - 1, day);
  const ms = ref - from;
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function isWithinDays(dateStr, days) {
  if (!dateStr) return false;
  const diff = -daysBetween(dateStr);
  return diff >= 0 && diff <= days;
}

// CRM-level KPIs for the hero bar.
export function getCrmKPIs(clients = MOCK_CLIENTS) {
  const pipelineValue = clients
    .filter((c) => c.estagio !== "pago")
    .reduce((acc, c) => acc + (c.valor || 0), 0);

  const upcomingSessions = clients.filter((c) =>
    isWithinDays(c.proximaSessao, 7),
  ).length;

  const inProgress = clients.filter((c) => c.estagio === "emAndamento").length;

  const paid = clients.filter((c) => c.estagio === "pago").length;
  const conversionRate = clients.length > 0 ? paid / clients.length : 0;

  const totalClients = clients.length;

  return {
    pipelineValue,
    upcomingSessions,
    inProgress,
    conversionRate,
    paid,
    totalClients,
  };
}

// Per-stage column summary.
export function getStageSummary(stageId, clients = MOCK_CLIENTS) {
  const list = getClientsByStage(stageId, clients);
  const value = list.reduce((acc, c) => acc + (c.valor || 0), 0);
  return { count: list.length, value };
}
