/**
 * Возвращает путь к аватарке по её ID (1-7)
 * @param id - идентификатор аватарки (число или строка)
 * @returns строка вида "/avatars/3.png"
 */
export const getAvatarUrl = (id: number | string): string => {
  return `/avatars/${id}.png`;
};