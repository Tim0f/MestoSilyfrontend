export function getPublicUrl(path: string | null | undefined): string {
  if (!path) return '';

  // blob preview
  if (path.startsWith('blob:')) return path;

  // data:image/*
  if (path.startsWith('data:')) return path;

  // если backend уже вернул абсолютный URL — НЕ ТРОГАЕМ
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // ⚠️ ВАЖНО: берём origin БЕЗ /api
  const apiUrl = import.meta.env.VITE_API_URL;
  const origin = apiUrl.replace(/\/api\/?$/, '');

  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}
