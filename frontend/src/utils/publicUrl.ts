export function getPublicUrl(path?: string | null) {
  if (!path) return '';

  // file preview
  if (path.startsWith('blob:')) return path;

  // already correct
  if (path.includes('/api/uploads/')) return path;

  const rawBase =
    import.meta.env.VITE_API_URL ??
    import.meta.env.VITE_ADMIN_API_URL ??
    'http://localhost:3000';

  // ❗ УБИРАЕМ /api В КОНЦЕ
  const base = rawBase.replace(/\/api$/, '');

  // backend may return:
  // - uploads/xxx.jpg
  // - /uploads/xxx.jpg
  // - http://host/uploads/xxx.jpg
  const clean = path
    .replace(/^https?:\/\/[^/]+/, '')
    .replace(/^\/?uploads\//, '');

  return `${base}/api/uploads/${clean}`;
}
