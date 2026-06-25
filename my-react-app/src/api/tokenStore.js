// Хранилище JWT-токенов.
//
// Бэкенд выдаёт пару { access, refresh } (SimpleJWT). access живёт ~60 минут,
// refresh ~14 дней. Храним в localStorage, чтобы сессия переживала перезагрузку
// страницы. Все обращения к токенам идут только через эти функции, чтобы при
// необходимости поменять хранилище (например, на httpOnly-cookie) было одно место.

const ACCESS_KEY = "sellix_access";
const REFRESH_KEY = "sellix_refresh";

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function setTokens(tokens) {
  if (!tokens) return;
  try {
    if (tokens.access) localStorage.setItem(ACCESS_KEY, tokens.access);
    if (tokens.refresh) localStorage.setItem(REFRESH_KEY, tokens.refresh);
  } catch (error) {
    console.error("Не удалось сохранить токены:", error);
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  } catch {
    /* noop */
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}
