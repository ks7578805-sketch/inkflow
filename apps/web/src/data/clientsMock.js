export const MOCK_CLIENTS = [
  {
    id: 1, name: "Lucas Mendes", phone: "+55 11 99999-1234", ig: "@lucasm.ink",
    email: "lucas.mendes@gmail.com", birthday: "1992-03-15",
    sessions: 6, total: 4800, lastSession: "12 Mai 2026", nextSession: "28 Mai 2026",
    vip: true, healing: false, activeProject: true, noReturn: false, isNew: false,
    artist: "Rafael Ink", style: "Japanese",
    tags: ["Projeto ativo"],
    notes: "Sem alergias conhecidas. Prefere sessões pela manhã. Sleeve japonês em andamento.",
    photo: null,
  },
  {
    id: 2, name: "Ana Beatriz", phone: "+55 11 98888-5678", ig: "@anab.tattoo",
    email: "ana.beatriz@outlook.com", birthday: "1995-07-22",
    sessions: 3, total: 2400, lastSession: "20 Mai 2026", nextSession: "02 Jun 2026",
    vip: false, healing: true, activeProject: false, noReturn: false, isNew: false,
    artist: "Marta Velez", style: "Fineline",
    tags: ["Em healing"],
    notes: "Cicatrização um pouco lenta. Usar pomada indicada. Retornar em 30 dias para avaliação.",
    photo: null,
  },
  {
    id: 3, name: "Pedro Oliveira", phone: "+55 11 97777-9012", ig: "@pedroolv",
    email: "pedro.olv@gmail.com", birthday: "1989-11-05",
    sessions: 4, total: 3500, lastSession: "10 Mai 2026", nextSession: "30 Mai 2026",
    vip: false, healing: false, activeProject: true, noReturn: false, isNew: false,
    artist: "Rafael Ink", style: "Blackwork",
    tags: ["Sessão futura"],
    notes: "Projeto de costas em desenvolvimento. Precisa de 2 sessões mais.",
    photo: null,
  },
  {
    id: 4, name: "Marina Santos", phone: "+55 11 96666-3456", ig: "@marinasantos",
    email: "marina.s@gmail.com", birthday: "1998-01-30",
    sessions: 2, total: 1200, lastSession: "Jan 2026", nextSession: "—",
    vip: false, healing: false, activeProject: false, noReturn: true, isNew: false,
    artist: "Camila Torres", style: "Lettering",
    tags: ["Sem retorno"],
    notes: "Última visita há mais de 4 meses. Considerar reativação.",
    photo: null,
  },
  {
    id: 5, name: "Ricardo Lima", phone: "+55 11 95555-7890", ig: "@ricardoink",
    email: "ricardo.lima@empresa.com", birthday: "1985-06-18",
    sessions: 8, total: 8200, lastSession: "18 Mai 2026", nextSession: "A definir",
    vip: true, healing: false, activeProject: false, noReturn: false, isNew: false,
    artist: "Rafael Ink", style: "Neo Tradicional",
    tags: ["VIP"],
    notes: "Cliente de alto ticket. Agenda esporadicamente mas sempre grandes projetos.",
    photo: null,
  },
  {
    id: 6, name: "Juliana Costa", phone: "+55 11 94444-2345", ig: "@jucosta",
    email: "juliana.costa@gmail.com", birthday: "2000-09-12",
    sessions: 1, total: 600, lastSession: "22 Mai 2026", nextSession: "05 Jun 2026",
    vip: false, healing: true, activeProject: false, noReturn: false, isNew: true,
    artist: "Marta Velez", style: "Realismo",
    tags: ["Em healing", "Novo"],
    notes: "Primeira tatuagem. Muito cuidadosa com aftercare. Acompanhar cicatrização.",
    photo: null,
  },
  {
    id: 7, name: "Thiago Rocha", phone: "+55 11 93333-6789", ig: "@thiagorocha",
    email: "thiago.r@gmail.com", birthday: "1993-04-27",
    sessions: 5, total: 3900, lastSession: "05 Mai 2026", nextSession: "15 Jun 2026",
    vip: false, healing: false, activeProject: true, noReturn: false, isNew: false,
    artist: "João Lucas", style: "Geométrico",
    tags: ["Sessão futura", "Projeto ativo"],
    notes: "Sleeve geométrico. Muito detalhista, aprova o stencil antes sempre.",
    photo: null,
  },
  {
    id: 8, name: "Fernanda Silva", phone: "+55 11 92222-0123", ig: "@fesilva.ink",
    email: "fer.silva@hotmail.com", birthday: "1991-12-03",
    sessions: 2, total: 1800, lastSession: "Nov 2025", nextSession: "—",
    vip: false, healing: false, activeProject: false, noReturn: true, isNew: false,
    artist: "Camila Torres", style: "Aquarela",
    tags: ["Sem retorno"],
    notes: "Sumiu depois de 2 sessões. Tentar reengajamento.",
    photo: null,
  },
];

export const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "future", label: "Sessão futura" },
  { id: "healing", label: "Em healing" },
  { id: "project", label: "Projeto ativo" },
  { id: "vip", label: "VIP" },
  { id: "noreturn", label: "Sem retorno" },
  { id: "new", label: "Novos" },
];

export function applyFilter(clients, filter) {
  switch (filter) {
    case "future": return clients.filter(c => c.nextSession !== "—" && c.nextSession !== "A definir");
    case "healing": return clients.filter(c => c.healing);
    case "project": return clients.filter(c => c.activeProject);
    case "vip": return clients.filter(c => c.vip);
    case "noreturn": return clients.filter(c => c.noReturn);
    case "new": return clients.filter(c => c.isNew);
    default: return clients;
  }
}

export const TAG_COLORS = {
  "VIP": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "Sessão futura": "bg-primary/15 text-primary border-primary/25",
  "Em healing": "bg-rose-500/15 text-rose-400 border-rose-500/25",
  "Projeto ativo": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "Sem retorno": "bg-muted/60 text-muted-foreground border-border",
  "Novo": "bg-blue-500/15 text-blue-400 border-blue-500/25",
};