// Эндпоинты аутентификации и профиля (apps.accounts на бэке).
import { api } from "./client.js";
import { setTokens, clearTokens } from "./tokenStore.js";

// Вход через OAuth (Яндекс ID / VK ID). На sandbox-бэке принимается любой code.
// Возвращает { tokens, user, is_new }. Токены сразу сохраняем.
export async function oauthLogin({ provider, code, redirectUri = "" }) {
  const data = await api.post(
    "/auth/oauth/",
    { provider, code, redirect_uri: redirectUri },
    { auth: false }
  );
  if (data?.tokens) setTokens(data.tokens);
  return data;
}

// Отдельный вход для суперадмина (email + пароль).
export async function adminLogin({ email, password }) {
  const data = await api.post("/auth/admin/", { email, password }, { auth: false });
  if (data?.tokens) setTokens(data.tokens);
  return data;
}

// Выбор роли (продавец/производитель) — один раз. Бэк вернёт новые токены с ролью.
export async function selectRole(role) {
  const data = await api.post("/me/role/", { role });
  if (data?.tokens) setTokens(data.tokens);
  return data;
}

// Текущий пользователь.
export function getMe() {
  return api.get("/me/");
}

export function updateMe(patch) {
  return api.patch("/me/", patch);
}

export async function logout() {
  try {
    await api.post("/auth/logout/", {});
  } catch {
    /* даже при ошибке чистим токены локально */
  }
  clearTokens();
}

// Адреса доставки покупателя.
export const addresses = {
  list: () => api.get("/addresses/"),
  create: (payload) => api.post("/addresses/", payload),
  update: (id, payload) => api.patch(`/addresses/${id}/`, payload),
  remove: (id) => api.delete(`/addresses/${id}/`),
};
