// Ядро HTTP-клиента для общения с Django REST API.
//
// Возможности:
//  - подставляет Authorization: Bearer <access> к каждому запросу;
//  - при 401 один раз пытается обновить access по refresh-токену и повторяет запрос;
//  - нормализует ошибки бэка ({ error: { detail, status } }) в единый ApiError;
//  - поддерживает JSON и FormData (загрузка фото товара) — Content-Type для
//    FormData не выставляем, чтобы браузер сам проставил boundary.

import { API_BASE } from "../config/runtime.js";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./tokenStore.js";

export class ApiError extends Error {
  constructor(message, { status, detail, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
    this.payload = payload;
  }
}

// Достаём осмысленный текст ошибки из тела ответа бэка.
function extractErrorMessage(body, status) {
  if (!body) return `Ошибка запроса (${status})`;
  const err = body.error ?? body;
  const detail = err.detail ?? err;

  if (typeof detail === "string") return detail;

  // DRF-валидация: { field: ["сообщение"] } или { detail: "..." }
  if (detail && typeof detail === "object") {
    if (detail.detail && typeof detail.detail === "string") return detail.detail;
    const firstKey = Object.keys(detail)[0];
    if (firstKey) {
      const val = detail[firstKey];
      const text = Array.isArray(val) ? val[0] : val;
      return typeof text === "string" ? text : `Ошибка запроса (${status})`;
    }
  }
  return `Ошибка запроса (${status})`;
}

let refreshPromise = null; // защита от параллельных refresh-запросов

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  // Если refresh уже идёт — ждём тот же промис.
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })
      .then(async (res) => {
        if (!res.ok) {
          clearTokens();
          return null;
        }
        const data = await res.json();
        // SimpleJWT при ROTATE_REFRESH_TOKENS возвращает и новый refresh.
        setTokens({ access: data.access, refresh: data.refresh });
        return data.access;
      })
      .catch(() => {
        clearTokens();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function doFetch(path, { method = "GET", body, headers = {}, auth = true, isForm = false } = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const finalHeaders = { ...headers };
  let finalBody = body;

  if (body !== undefined && !isForm) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = JSON.stringify(body);
  }

  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, { method, headers: finalHeaders, body: finalBody });
}

// Основная функция запроса. options: { method, body, headers, auth, isForm }
export async function apiRequest(path, options = {}) {
  let response = await doFetch(path, options);

  // Просроченный access → пробуем обновить и повторить один раз.
  if (response.status === 401 && options.auth !== false && getRefreshToken()) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      response = await doFetch(path, options);
    }
  }

  // 204 No Content — тела нет.
  if (response.status === 204) return null;

  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(payload, response.status), {
      status: response.status,
      detail: payload?.error?.detail ?? payload,
      payload,
    });
  }

  return payload;
}

// Сахар для частых методов.
export const api = {
  get: (path, opts) => apiRequest(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => apiRequest(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => apiRequest(path, { ...opts, method: "PATCH", body }),
  put: (path, body, opts) => apiRequest(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => apiRequest(path, { ...opts, method: "DELETE" }),
  // Загрузка файлов (multipart/form-data).
  postForm: (path, formData, opts) =>
    apiRequest(path, { ...opts, method: "POST", body: formData, isForm: true }),
};
