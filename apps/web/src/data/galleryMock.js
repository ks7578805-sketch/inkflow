export const GALLERY_ITEMS = [
  {
    id: 1, title: "Sleeve Japonês", artist: "Rafael Ink", style: "Japanese",
    placement: "Braço inteiro", description: "Sleeve completo com temática japonesa — dragão, ondas, koi e flores de cerejeira.",
    duration: 18, sessions: 6, value: 4800,
    exclusive: true, repeatable: false, featured: true, isNew: false,
    tags: ["Sleeve", "Colorido", "Oriental"],
    colors: "from-red-900/60 to-orange-900/40",
    fromProject: "Projeto Sleeve — Lucas Mendes",
    views: 142, likes: 67,
  },
  {
    id: 2, title: "Fineline Floral", artist: "Marta Velez", style: "Fineline",
    placement: "Antebraço", description: "Composição floral delicada com rosas e folhagem em traço fino.",
    duration: 2, sessions: 1, value: 600,
    exclusive: false, repeatable: true, featured: true, isNew: false,
    tags: ["Delicado", "Feminino", "Floral"],
    colors: "from-rose-900/50 to-pink-900/40",
    fromProject: null,
    views: 98, likes: 45,
  },
  {
    id: 3, title: "Mandala Blackwork", artist: "Rafael Ink", style: "Geométrico",
    placement: "Costas", description: "Mandala geométrica com elementos tribais em blackwork sólido.",
    duration: 8, sessions: 3, value: 2400,
    exclusive: false, repeatable: true, featured: false, isNew: false,
    tags: ["Geométrico", "Blackwork", "Grande"],
    colors: "from-slate-800/80 to-gray-900/60",
    fromProject: null,
    views: 77, likes: 38,
  },
  {
    id: 4, title: "Retrato Realista", artist: "Marta Velez", style: "Realismo",
    placement: "Coxa", description: "Retrato fotorrealista em blackgray com sombreamento profundo.",
    duration: 6, sessions: 2, value: 1800,
    exclusive: true, repeatable: false, featured: true, isNew: false,
    tags: ["Retrato", "Realismo", "Coxa"],
    colors: "from-zinc-800/70 to-neutral-900/50",
    fromProject: "Projeto Retrato — Juliana Costa",
    views: 211, likes: 94,
  },
  {
    id: 5, title: "Dragão Neo Trad", artist: "João Lucas", style: "Neo Tradicional",
    placement: "Peitoral", description: "Dragão com paleta neo tradicional, linhas fortes e preenchimento rico.",
    duration: 5, sessions: 2, value: 1500,
    exclusive: false, repeatable: true, featured: false, isNew: true,
    tags: ["Dragão", "Colorido", "Neo Trad"],
    colors: "from-blue-900/60 to-indigo-900/50",
    fromProject: null,
    views: 34, likes: 19,
  },
  {
    id: 6, title: "Geometric Dotwork", artist: "Camila Torres", style: "Pontilhismo",
    placement: "Costela", description: "Composição abstrata geométrica em pontilhismo fino.",
    duration: 3, sessions: 1, value: 900,
    exclusive: false, repeatable: true, featured: false, isNew: true,
    tags: ["Geométrico", "Ponto", "Minimalista"],
    colors: "from-violet-900/50 to-purple-900/40",
    fromProject: null,
    views: 55, likes: 27,
  },
  {
    id: 7, title: "Lobo Blackwork", artist: "Rafael Ink", style: "Blackwork",
    placement: "Bíceps", description: "Lobo detalhado em blackwork com texturas densas e sombreamento.",
    duration: 4, sessions: 2, value: 1200,
    exclusive: false, repeatable: true, featured: false, isNew: false,
    tags: ["Animal", "Blackwork", "Escuro"],
    colors: "from-gray-800/80 to-zinc-900/60",
    fromProject: null,
    views: 88, likes: 52,
  },
  {
    id: 8, title: "Lettering Manuscrito", artist: "Camila Torres", style: "Lettering",
    placement: "Antebraço", description: "Frase em caligrafia manuscrita elegante com sombreamento sutil.",
    duration: 1.5, sessions: 1, value: 500,
    exclusive: false, repeatable: true, featured: false, isNew: false,
    tags: ["Texto", "Frase", "Minimalista"],
    colors: "from-amber-900/50 to-yellow-900/40",
    fromProject: null,
    views: 66, likes: 31,
  },
];

export const PORTFOLIO_FILTERS = [
  { id: "all", label: "Todos" },
  { id: "featured", label: "Destaques" },
  { id: "repeatable", label: "Repetíveis" },
  { id: "exclusive", label: "Exclusivos" },
  { id: "new", label: "Recentes" },
];

export const STYLES = ["Japanese", "Realismo", "Fineline", "Blackwork", "Geométrico", "Lettering", "Old School", "Neo Tradicional", "Aquarela", "Pontilhismo"];
export const BODY_PARTS = ["Braço inteiro", "Antebraço", "Bíceps", "Ombro", "Costas", "Peito", "Costela", "Perna", "Coxa", "Pulso", "Panturrilha"];
export const ARTISTS_GALLERY = ["Rafael Ink", "Marta Velez", "Camila Torres", "João Lucas"];

export const MOCK_CONCLUDED_PROJECTS = [
  { id: "p1", title: "Sleeve Japonês", client: "Lucas Mendes", artist: "Rafael Ink", style: "Japanese", placement: "Braço inteiro", sessions: 6, value: 4800, duration: 18 },
  { id: "p2", title: "Retrato Realista", client: "Juliana Costa", artist: "Marta Velez", style: "Realismo", placement: "Coxa", sessions: 2, value: 1800, duration: 6 },
  { id: "p3", title: "Mandala Costas", client: "Pedro Oliveira", artist: "Rafael Ink", style: "Geométrico", placement: "Costas", sessions: 3, value: 2400, duration: 8 },
];

export function applyGalleryFilter(items, filter, search, artistFilter) {
  let list = [...items];
  if (filter === "featured") list = list.filter(i => i.featured);
  else if (filter === "repeatable") list = list.filter(i => i.repeatable);
  else if (filter === "exclusive") list = list.filter(i => i.exclusive);
  else if (filter === "new") list = list.filter(i => i.isNew);

  if (artistFilter && artistFilter !== "all") list = list.filter(i => i.artist === artistFilter);

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.style.toLowerCase().includes(q) ||
      i.artist.toLowerCase().includes(q) ||
      i.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  return list;
}