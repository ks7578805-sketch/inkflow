// Deterministic mock conversation generator — same input always produces the
// same chat. Used by the in-app conversation drawer while WhatsApp is not yet
// wired to the API. Roteiros são curtos e em PT-BR para parecerem reais.
//
// Each message: { id, side: "them" | "me", text, time }

const SCRIPTS = [
  [
    { side: "them", text: "Oi! Vi os trabalhos no insta de vocês e amei 🙌" },
    { side: "them", text: "Queria fechar um {estilo} no antebraço" },
    { side: "me", text: "Oi {primeiro}! Que bom que curtiu o trabalho 🙏" },
    { side: "me", text: "Manda referência do que tem em mente?" },
    { side: "them", text: "Bora! Já te mando umas fotos aqui 📸" },
    { side: "me", text: "Show. Pelo briefing inicial fica em torno de {valor}." },
    { side: "them", text: "Fechado, vou separar a referência e te mando hoje à noite" },
  ],
  [
    { side: "them", text: "Boa tarde, posso confirmar a sessão pra essa semana?" },
    { side: "me", text: "Oi {primeiro}! Posso te confirmar quinta às 14h?" },
    { side: "them", text: "Pode sim, perfeito 🙌" },
    { side: "me", text: "Beleza. Te mando lembrete um dia antes." },
    { side: "them", text: "Top! Já fiz o PIX do sinal" },
    { side: "me", text: "Confirmado! Recebi aqui ✅" },
  ],
  [
    { side: "them", text: "E aí, tudo bem?" },
    { side: "them", text: "Queria saber se faz {estilo}?" },
    { side: "me", text: "Tudo certo! Faço sim, é um dos estilos que mais curto fazer" },
    { side: "me", text: "Quer me passar mais detalhes? Tamanho, local..." },
    { side: "them", text: "Bem grande, no antebraço inteiro." },
    { side: "them", text: "Mas tô na dúvida entre dois desenhos ainda" },
    { side: "me", text: "Tranquilo, posso te ajudar a escolher. Marca uma consulta?" },
    { side: "them", text: "Bora! Manda os horários" },
  ],
  [
    { side: "me", text: "Oi {primeiro}, tudo bem? Tô confirmando a sessão de amanhã" },
    { side: "them", text: "Tudo certo! Confirmado sim 👍" },
    { side: "them", text: "Que horas mesmo?" },
    { side: "me", text: "10h, na nossa unidade da Augusta" },
    { side: "them", text: "Beleza, tô anotando aqui" },
    { side: "me", text: "Lembrete: vem alimentado e dormido bem, viu? 😅" },
    { side: "them", text: "Pode deixar haha valeu!" },
  ],
];

const TIMES = [
  ["09:14", "09:16", "09:18", "09:22", "10:01", "10:05", "10:30", "11:00"],
  ["10:42", "10:45", "10:48", "11:03", "11:15", "12:01", "13:20"],
  ["14:02", "14:08", "14:11", "14:30", "15:00", "15:45", "16:20", "17:00"],
  ["19:05", "19:09", "19:15", "19:30", "20:00", "20:20", "20:50"],
];

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function hashStr(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function firstName(name = "") {
  return name.trim().split(/\s+/)[0] || "amigo(a)";
}

function applyVars(text, vars) {
  return text
    .replace(/\{primeiro\}/g, vars.primeiro)
    .replace(/\{estilo\}/g, vars.estilo)
    .replace(/\{valor\}/g, vars.valor);
}

export function generateConversation(person) {
  if (!person) return [];
  const seed = hashStr(person.nome || person.id || "");
  const script = SCRIPTS[seed % SCRIPTS.length];
  const times = TIMES[seed % TIMES.length];

  const vars = {
    primeiro: firstName(person.nome),
    estilo: person.estilo && person.estilo !== "A definir" ? person.estilo : "fineline",
    valor: BRL.format(person.valor || 800),
  };

  return script.map((m, idx) => ({
    id: `${person.id}-msg-${idx}`,
    side: m.side,
    text: applyVars(m.text, vars),
    time: times[idx] ?? times[times.length - 1],
  }));
}
