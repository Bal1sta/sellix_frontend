// Помощник OAuth-редиректов на Яндекс ID / VK ID.
//
// Боевой режим: если в .env заданы VITE_YANDEX_CLIENT_ID / VITE_VK_CLIENT_ID,
// кнопка ведёт на страницу авторизации провайдера. Провайдер вернёт пользователя
// на /auth/callback?code=...&state=provider, откуда код уходит на бэк.
//
// Sandbox-режим (ключи не заданы): бэк принимает любой code, поэтому вход
// выполняется сразу — без внешнего редиректа, с детерминированным тестовым кодом.

const YANDEX_CLIENT_ID = import.meta.env.VITE_YANDEX_CLIENT_ID ?? "";
const VK_CLIENT_ID = import.meta.env.VITE_VK_CLIENT_ID ?? "";

export const PROVIDERS = {
  yandex: {
    key: "yandex",
    label: "Войти через Яндекс ID",
    clientId: YANDEX_CLIENT_ID,
    authorizeUrl: "https://oauth.yandex.ru/authorize",
  },
  vk: {
    key: "vk",
    label: "Войти через VK ID",
    clientId: VK_CLIENT_ID,
    authorizeUrl: "https://oauth.vk.com/authorize",
  },
};

// Куда провайдер вернёт пользователя.
export function redirectUri() {
  return `${window.location.origin}/auth/callback`;
}

// Есть ли у провайдера реальные ключи (боевой режим).
export function isLiveProvider(providerKey) {
  return Boolean(PROVIDERS[providerKey]?.clientId);
}

// Полный URL авторизации провайдера (боевой режим).
export function buildAuthorizeUrl(providerKey) {
  const p = PROVIDERS[providerKey];
  const params = new URLSearchParams({
    response_type: "code",
    client_id: p.clientId,
    redirect_uri: redirectUri(),
    state: providerKey, // вернётся в callback, чтобы знать провайдера
  });
  return `${p.authorizeUrl}?${params.toString()}`;
}

// Детерминированный код для sandbox-входа (один и тот же пользователь при
// повторном входе того же провайдера в рамках демо-сессии).
export function sandboxCode(providerKey) {
  return `sandbox-${providerKey}-demo`;
}
