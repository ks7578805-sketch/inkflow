import { buildApiUrl } from '@/lib/api';

async function parseResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    const error = new Error(message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function pad(value) {
  return String(value).padStart(2, '0');
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
    return 'unassigned';
  }

  return normalized
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unassigned';
}

function getClientDisplayName(project) {
  const firstName = project?.client?.firstName?.trim();
  const lastName = project?.client?.lastName?.trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

  return fullName || project?.clientName || '—';
}

export async function listSessions(params = {}) {
  const search = new URLSearchParams();

  if (params.from) search.set('from', params.from);
  if (params.to) search.set('to', params.to);
  if (params.projectId) search.set('projectId', params.projectId);

  const query = search.toString() ? `?${search.toString()}` : '';
  const response = await fetch(buildApiUrl(`/v1/sessions${query}`), {
    method: 'GET',
    credentials: 'include',
  });

  return parseResponse(response);
}

export async function getSession(id) {
  const response = await fetch(buildApiUrl(`/v1/sessions/${id}`), {
    method: 'GET',
    credentials: 'include',
  });

  return parseResponse(response);
}

export async function createSession(payload) {
  const response = await fetch(buildApiUrl('/v1/sessions'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function updateSession(id, payload) {
  const response = await fetch(buildApiUrl(`/v1/sessions/${id}`), {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function concludeSession(id) {
  const response = await fetch(buildApiUrl(`/v1/sessions/${id}/conclude`), {
    method: 'POST',
    credentials: 'include',
  });

  return parseResponse(response);
}

export async function cancelSession(id) {
  const response = await fetch(buildApiUrl(`/v1/sessions/${id}/cancel`), {
    method: 'POST',
    credentials: 'include',
  });

  return parseResponse(response);
}

export function buildSessionPayload({ projectId, date, time, endTime, status, notes }) {
  const startsAt = new Date(`${date}T${time}:00`);
  const requestedEndsAt = new Date(`${date}T${endTime}:00`);
  const endsAt = requestedEndsAt > startsAt ? requestedEndsAt : new Date(startsAt.getTime() + 60 * 60 * 1000);

  return {
    projectId,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    status: status?.trim() || 'Confirmada',
    notes: notes?.trim() || undefined,
  };
}

export function mapSessionToCalendarSession(session) {
  const startsAt = new Date(session.startsAt);
  const endsAt = new Date(session.endsAt);
  const project = session.project;
  const duration = Math.max(1, Number(((endsAt.getTime() - startsAt.getTime()) / (60 * 60 * 1000)).toFixed(1)));

  return {
    id: session.id,
    projectId: project.id,
    clientId: project.clientId ?? null,
    date: formatLocalDate(startsAt),
    time: formatLocalTime(startsAt),
    endTime: formatLocalTime(endsAt),
    duration,
    client: getClientDisplayName(project),
    artist: getArtistId(project.artistName),
    artistName: project.artistName || '—',
    style: project.style || '—',
    type: project.name,
    placement: project.bodyPart || '—',
    status: session.status || 'Confirmada',
    value: project.valueFinal ?? project.valueEstimated ?? 0,
    deposit: project.deposit ?? 0,
    notes: session.notes || project.notes || '',
  };
}
