export function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
}

export function buildApiUrl(path) {
  if (!path) {
    return path;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}
