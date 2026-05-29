import { buildApiUrl } from '@/lib/api';

const PROJECT_STATUS_OPTIONS = [
  "Em andamento",
  "Aguardando aprovação",
  "Pendente",
  "Finalizado",
  "Pausado",
  "Arquivado",
];

const CALENDAR_SESSION_STATUS_OPTIONS = [
  "Confirmada",
  "Aguardando depósito",
  "Em andamento",
  "Concluída",
  "Cancelada",
  "Reagendada",
];


async function parseResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;
    const error = new Error(message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function listProjects() {
  const response = await fetch(buildApiUrl("/v1/projects"), {
    method: "GET",
    credentials: "include",
  });

  return parseResponse(response);
}

export async function getProject(id) {
  const response = await fetch(buildApiUrl(`/v1/projects/${id}`), {
    method: "GET",
    credentials: "include",
  });

  return parseResponse(response);
}

export async function createProject(payload) {
  const response = await fetch(buildApiUrl("/v1/projects"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function updateProject(id, payload) {
  const response = await fetch(buildApiUrl(`/v1/projects/${id}`), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

function getClientDisplayName(project) {
  const firstName = project?.client?.firstName?.trim();
  const lastName = project?.client?.lastName?.trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return fullName || project?.clientName || "—";
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function clampProgress(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function toValidDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function formatLocalDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatLocalTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getArtistId(artistName) {
  const normalized = artistName?.trim();

  if (!normalized) {
    return "unassigned";
  }

  return normalized
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "unassigned";
}

function buildFallbackSessionEnd(startAt) {
  return new Date(startAt.getTime() + 3 * 60 * 60 * 1000);
}

export function buildCalendarArtistOptions(projects) {
  const entries = new Map();

  projects.forEach((project) => {
    const artistName = project.artistName?.trim();
    if (!artistName) {
      return;
    }

    entries.set(getArtistId(artistName), artistName);
  });

  return [
    { id: "all", name: "Todos os artistas" },
    ...Array.from(entries.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((current, next) => current.name.localeCompare(next.name, "pt-BR")),
  ];
}

export function mapProjectToCalendarSession(project) {
  const startAt = toValidDate(project?.nextSessionAt);

  if (!project || !startAt) {
    return null;
  }

  const parsedEndAt = toValidDate(project.nextSessionEndAt);
  const endAt = parsedEndAt && parsedEndAt > startAt ? parsedEndAt : buildFallbackSessionEnd(startAt);
  const duration = Math.max(1, Number(((endAt.getTime() - startAt.getTime()) / (60 * 60 * 1000)).toFixed(1)));

  return {
    id: project.id,
    projectId: project.id,
    clientId: project.clientId ?? null,
    date: formatLocalDate(startAt),
    time: formatLocalTime(startAt),
    endTime: formatLocalTime(endAt),
    duration,
    client: getClientDisplayName(project),
    artist: getArtistId(project.artistName),
    artistName: project.artistName || "—",
    style: project.style || "—",
    type: project.name,
    placement: project.bodyPart || "—",
    status: project.nextSessionStatus || "Confirmada",
    value: project.valueFinal ?? project.valueEstimated ?? 0,
    deposit: project.deposit ?? 0,
    notes: project.notes || "",
  };
}

export function buildCalendarSessionPayload({ date, time, endTime, status }) {
  const startAt = new Date(`${date}T${time}:00`);
  const requestedEndAt = new Date(`${date}T${endTime}:00`);
  const endAt = requestedEndAt > startAt ? requestedEndAt : new Date(startAt.getTime() + 60 * 60 * 1000);

  return {
    nextSessionAt: startAt.toISOString(),
    nextSessionEndAt: endAt.toISOString(),
    nextSessionStatus: status?.trim() || "Confirmada",
  };
}

export function normalizeProject(project) {
  if (!project) {
    return null;
  }

  return {
    ...project,
    client: getClientDisplayName(project),
    clientId: project.clientId ?? null,
    artist: project.artistName || "—",
    style: project.style || "—",
    bodyPart: project.bodyPart || "—",
    sessions: {
      done: project.sessionsDone ?? 0,
      total: project.sessionsTotal ?? 0,
    },
    nextSession: project.nextSessionAt ? formatDate(project.nextSessionAt) : "A definir",
    createdAt: formatDate(project.createdAt),
    updatedAt: formatDate(project.updatedAt),
    valueEstimated: project.valueEstimated ?? 0,
    valueFinal: project.valueFinal ?? null,
    deposit: project.deposit ?? 0,
    totalPaid: project.totalPaid ?? 0,
    progress: clampProgress(project.progress ?? 0),
    hoursEstimated: project.hoursEstimated ?? 0,
    hoursReal: project.hoursReal ?? 0,
    thumbnail: project.thumbnailUrl ?? null,
    badges: [],
    completeness: clampProgress(project.progress ?? 0),
    completionItems: [],
    tags: [],
  };
}

export { CALENDAR_SESSION_STATUS_OPTIONS, PROJECT_STATUS_OPTIONS };
