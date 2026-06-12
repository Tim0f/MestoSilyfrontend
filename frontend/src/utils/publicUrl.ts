export function getPublicUrl(path?: string | null) {
  if (!path) return '';

  // blob-ссылка (превью)
  if (path.startsWith('blob:')) return path;

  // уже полный путь к загрузкам API
  if (path.includes('/api/uploads/')) return path;

  // Абсолютные пути (начинаются с /) — возвращаем относительно фронтенда
  if (path.startsWith('/')) {
    // BASE_URL всегда имеет завершающий слеш (например, '/' или '/admin/')
    const base = import.meta.env.BASE_URL;
    return `${base}${path.slice(1)}`; // убираем начальный слеш, чтобы не дублировать
  }

  // Остальное – обычные загруженные файлы (относительный путь или имя)
  const rawBase =
    import.meta.env.VITE_API_URL ??
    import.meta.env.VITE_ADMIN_API_URL ??
    'http://localhost:3000';
  const base = rawBase.replace(/\/api$/, '');
  const clean = path
    .replace(/^https?:\/\/[^/]+/, '')
    .replace(/^\/?uploads\//, '');
  return `${base}/api/uploads/${clean}`;
}