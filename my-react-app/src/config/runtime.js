// Единая точка конфигурации фронтенда.
//
// Фронт и бэк деплоятся на одном сервере, поэтому по умолчанию API-запросы
// идут на тот же origin по относительному пути (/api/v1). Nginx проксирует
// /api и /media на Django (gunicorn). Это полностью убирает проблему CORS,
// потому что браузер видит один и тот же домен.
//
// Переопределить базовый URL можно через переменную окружения Vite
// VITE_API_BASE (например, для локальной разработки против удалённого бэка).

const RAW_BASE = import.meta.env.VITE_API_BASE ?? "/api/v1";

// Убираем хвостовой слэш, чтобы не плодить двойные // при склейке путей.
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

// Базовый origin для медиа-файлов (картинки товаров и т.п.).
// Если задан VITE_MEDIA_BASE — используем его, иначе относительный /media.
export const MEDIA_BASE = (import.meta.env.VITE_MEDIA_BASE ?? "").replace(/\/+$/, "");

// Превращает относительный путь медиа из API (/media/...) в абсолютный URL,
// если задан внешний MEDIA_BASE. На одном сервере вернёт путь как есть.
export function resolveMediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path; // уже абсолютный
  if (!MEDIA_BASE) return path; // тот же origin — относительный путь рабочий
  return `${MEDIA_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}
