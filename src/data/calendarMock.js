import { addDays, format } from "date-fns";

export const ARTISTS = [
  { id: "all", name: "Todos os artistas" },
  { id: "rafael", name: "Rafael Ink" },
  { id: "marta", name: "Marta Velez" },
  { id: "camila", name: "Camila Torres" },
  { id: "joao", name: "João Lucas" },
];

export const SESSION_STATUS = {
  "Confirmada": { color: "bg-primary/15 text-primary border-primary/25", bar: "bg-primary", dot: "bg-primary" },
  "Em andamento": { color: "bg-blue-500/15 text-blue-400 border-blue-500/25", bar: "bg-blue-500", dot: "bg-blue-500" },
  "Aguardando depósito": { color: "bg-amber-500/15 text-amber-400 border-amber-500/25", bar: "bg-amber-500", dot: "bg-amber-500" },
  "Concluída": { color: "bg-muted/60 text-muted-foreground border-border", bar: "bg-muted-foreground/40", dot: "bg-muted-foreground/60" },
  "Cancelada": { color: "bg-destructive/15 text-destructive border-destructive/25", bar: "bg-destructive", dot: "bg-destructive" },
  "Reagendada": { color: "bg-violet-500/15 text-violet-400 border-violet-500/25", bar: "bg-violet-500", dot: "bg-violet-500" },
  "Intervalo": { color: "bg-muted/40 text-muted-foreground border-border/40", bar: "bg-muted-foreground/20", dot: "bg-muted-foreground/30" },
};

// Generate sessions around today
const today = new Date();
const todayStr = format(today, "yyyy-MM-dd");
const tomorrowStr = format(addDays(today, 1), "yyyy-MM-dd");
const yestStr = format(addDays(today, -1), "yyyy-MM-dd");
const d2 = format(addDays(today, 2), "yyyy-MM-dd");
const d3 = format(addDays(today, 3), "yyyy-MM-dd");
const d5 = format(addDays(today, 5), "yyyy-MM-dd");
const d6 = format(addDays(today, 6), "yyyy-MM-dd");

export const MOCK_SESSIONS = [
  {
    id: "s1", date: todayStr, time: "09:00", endTime: "12:00", duration: 3,
    client: "Lucas Mendes", artist: "rafael", artistName: "Rafael Ink",
    style: "Japanese", type: "Sleeve Oriental (cont.)", placement: "Braço esquerdo",
    status: "Confirmada", value: 900, deposit: 300, notes: "Continuar shading das ondas. Cliente prefere sessões longas.",
    color: "primary",
  },
  {
    id: "s2", date: todayStr, time: "13:00", endTime: "15:00", duration: 2,
    client: "Ana Beatriz", artist: "marta", artistName: "Marta Velez",
    style: "Fineline", type: "Fineline Floral", placement: "Antebraço direito",
    status: "Confirmada", value: 600, deposit: 200, notes: "",
    color: "blue",
  },
  {
    id: "s3", date: todayStr, time: "15:30", endTime: "16:30", duration: 1,
    client: "Mariana Lopes", artist: "camila", artistName: "Camila Torres",
    style: "Lettering", type: "Lettering Minimalista", placement: "Pulso",
    status: "Aguardando depósito", value: 350, deposit: 0, notes: "Aguardando PIX do sinal.",
    color: "amber",
  },
  {
    id: "s4", date: todayStr, time: "17:00", endTime: "21:00", duration: 4,
    client: "Pedro Oliveira", artist: "rafael", artistName: "Rafael Ink",
    style: "Blackwork", type: "Blackwork Geométrico", placement: "Costas superiores",
    status: "Em andamento", value: 1400, deposit: 500, notes: "Sessão longa. Separar 4h sem interrupção.",
    color: "primary",
  },
  {
    id: "s5", date: tomorrowStr, time: "10:00", endTime: "13:00", duration: 3,
    client: "Juliana Costa", artist: "marta", artistName: "Marta Velez",
    style: "Realismo", type: "Retrato Realismo", placement: "Coxa",
    status: "Confirmada", value: 1200, deposit: 400, notes: "",
    color: "primary",
  },
  {
    id: "s6", date: tomorrowStr, time: "14:00", endTime: "17:00", duration: 3,
    client: "Ricardo Lima", artist: "joao", artistName: "João Lucas",
    style: "Neo Tradicional", type: "Neo Trad Águia", placement: "Peitoral",
    status: "Confirmada", value: 900, deposit: 300, notes: "",
    color: "primary",
  },
  {
    id: "s7", date: yestStr, time: "09:00", endTime: "12:00", duration: 3,
    client: "Fernanda Silva", artist: "camila", artistName: "Camila Torres",
    style: "Aquarela", type: "Aquarela Floral", placement: "Ombro",
    status: "Concluída", value: 800, deposit: 300, notes: "Sessão concluída com sucesso.",
    color: "muted",
  },
  {
    id: "s8", date: d2, time: "11:00", endTime: "14:00", duration: 3,
    client: "Carlos Motta", artist: "rafael", artistName: "Rafael Ink",
    style: "Old School", type: "Old School Anchor", placement: "Antebraço",
    status: "Confirmada", value: 700, deposit: 200, notes: "",
    color: "primary",
  },
  {
    id: "s9", date: d3, time: "09:00", endTime: "11:00", duration: 2,
    client: "Beatriz Alves", artist: "marta", artistName: "Marta Velez",
    style: "Fineline", type: "Constelações Fineline", placement: "Costela",
    status: "Aguardando depósito", value: 500, deposit: 0, notes: "",
    color: "amber",
  },
  {
    id: "s10", date: d5, time: "13:00", endTime: "16:00", duration: 3,
    client: "Thiago Rocha", artist: "joao", artistName: "João Lucas",
    style: "Geométrico", type: "Mandala Geométrica", placement: "Antebraço",
    status: "Confirmada", value: 850, deposit: 300, notes: "",
    color: "primary",
  },
  {
    id: "s11", date: d6, time: "10:00", endTime: "14:00", duration: 4,
    client: "Sofia Carvalho", artist: "rafael", artistName: "Rafael Ink",
    style: "Japanese", type: "Dragão Japonês", placement: "Perna",
    status: "Confirmada", value: 1600, deposit: 600, notes: "Início de sleeve de perna.",
    color: "primary",
  },
];