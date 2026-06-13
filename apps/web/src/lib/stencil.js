import { buildApiUrl } from '@/lib/api';

const STENCIL_STYLE_PRESETS = ['fineline', 'blackwork', 'realismo'];
const STENCIL_OUTPUT_SIZES = ['a4', 'a3', 'letter', 'custom'];
const STENCIL_PROVIDERS = ['google', 'openai'];

async function parseResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    const friendlyMessage = response.status === 503
      ? 'A geração de stencil está desativada porque GOOGLE_API_KEY não está configurada no backend.'
      : response.status === 502
        ? 'A API do Google falhou ao gerar o stencil. Tente novamente em instantes.'
        : (message || 'Request failed');
    const error = new Error(friendlyMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function uploadStencilAsset(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(buildApiUrl('/v1/stencil/assets/upload'), {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  return parseResponse(response);
}

export async function createStencilGeneration(payload) {
  if (!STENCIL_STYLE_PRESETS.includes(payload.selectedStyle)) {
    throw new Error('Estilo de stencil inválido.');
  }

  if (!STENCIL_OUTPUT_SIZES.includes(payload.outputSize)) {
    throw new Error('Tamanho de saída inválido.');
  }

  if (payload.provider !== undefined && !STENCIL_PROVIDERS.includes(payload.provider)) {
    throw new Error('Provider de IA inválido.');
  }

  const response = await fetch(buildApiUrl('/v1/stencil/generations'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function getStencilGeneration(id) {
  const response = await fetch(buildApiUrl(`/v1/stencil/generations/${id}`), {
    method: 'GET',
    credentials: 'include',
  });

  return parseResponse(response);
}

export async function saveStencilVersion(id, payload = {}) {
  const response = await fetch(buildApiUrl(`/v1/stencil/versions/${id}/save`), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export function getStencilExportUrl(id, format) {
  return buildApiUrl(`/v1/stencil/versions/${id}/export?format=${format}`);
}
