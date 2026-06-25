import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./AuthPages.module.css";

import { useAuth } from "../../../auth/AuthContext.jsx";
import {
  PROVIDERS,
  isLiveProvider,
  buildAuthorizeUrl,
  sandboxCode,
} from "../../../auth/oauth.js";

import Logo from "../../../assets/Images/SelixLOGO.svg";
import YandexLogo from "../../../assets/Images/YandexId_Logo.jpg";
import VkLogo from "../../../assets/Images/VKId_Logo.png";

const PROVIDER_LOGOS = { yandex: YandexLogo, vk: VkLogo };

// Шаг 0 онбординга (PRD 3.2.1): лендинг входа с двумя кнопками OAuth.
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithOAuth } = useAuth();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  async function handleProvider(providerKey) {
    setError("");

    // Боевой режим: редирект на провайдера. Вернётся на /auth/callback.
    if (isLiveProvider(providerKey)) {
      window.location.href = buildAuthorizeUrl(providerKey);
      return;
    }

    // Sandbox: бэк принимает любой code — входим сразу.
    setBusy(providerKey);
    try {
      const data = await loginWithOAuth({
        provider: providerKey,
        code: sandboxCode(providerKey),
      });
      // Роль не назначена (новый пользователь) → выбор роли (PRD 3.2.3).
      if (!data.user?.role) {
        navigate("/select-role", { replace: true });
      } else if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Не удалось войти");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <img src={Logo} alt="Sellix" />
          <span>Sellix</span>
        </div>

        <h1 className={styles.title}>Вход в Sellix</h1>
        <p className={styles.subtitle}>
          Маркетплейс, где продавцы открывают магазины, а производители
          поставляют товары. Войдите, чтобы начать.
        </p>

        <div className={styles.providers}>
          {Object.values(PROVIDERS).map((p) => (
            <button
              key={p.key}
              type="button"
              className={styles.provider}
              onClick={() => handleProvider(p.key)}
              disabled={Boolean(busy)}
            >
              <img src={PROVIDER_LOGOS[p.key]} alt="" />
              {busy === p.key ? "Входим…" : p.label}
            </button>
          ))}
        </div>

        <div className={styles.divider}>или</div>

        <button
          type="button"
          className={styles.adminLink}
          onClick={() => navigate("/admin/login")}
        >
          Вход для администратора
        </button>

        {error && <div className={styles.error}>{error}</div>}

        {!isLiveProvider("yandex") && (
          <p className={styles.note}>
            Демо-режим: вход через провайдеров эмулируется без реальной учётной
            записи Яндекс/VK.
          </p>
        )}
      </div>
    </div>
  );
}
