/**
 * Backend уже возвращает корректный абсолютный URL.
 * Утилита нужна только для защиты от null / undefined.
 */
export const mediaUrl = (value?: string | null): string => {
  return value ?? "";
};
