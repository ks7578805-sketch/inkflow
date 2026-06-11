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

// Returns color config for a session. When corEtiqueta is set (future WhatsApp sync),
// it will build a custom color from that hex; falls back to status color.
export function getSessionColor(session) {
  // Future: if (session.corEtiqueta) return buildColorFromHex(session.corEtiqueta);
  return STATUS_COLORS[session.status] ?? STATUS_COLORS.confirmado;
}

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
