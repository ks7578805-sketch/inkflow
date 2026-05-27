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

export async function listClients(search = '') {
  const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
  const response = await fetch(buildApiUrl(`/v1/clients${query}`), {
    method: 'GET',
    credentials: 'include',
  });

  return parseResponse(response);
}

export async function getClient(id) {
  const response = await fetch(buildApiUrl(`/v1/clients/${id}`), {
    method: 'GET',
    credentials: 'include',
  });

  return parseResponse(response);
}

export async function createClient(payload) {
  const response = await fetch(buildApiUrl('/v1/clients'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function updateClient(id, payload) {
  const response = await fetch(buildApiUrl(`/v1/clients/${id}`), {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function deleteClient(id) {
  const response = await fetch(buildApiUrl(`/v1/clients/${id}`), {
    method: 'DELETE',
    credentials: 'include',
  });

  return parseResponse(response);
}
