import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { PROVIDERS, isLiveProvider, buildAuthorizeUrl, sandboxCode } from "../auth/oauth.js";
import s from "../shared/styles.module.css";
import Logo from "../assets/Images/SelixLOGO.svg";
import YandexLogo from "../assets/Images/YandexId_Logo.jpg";
import VkLogo from "../assets/Images/VKId_Logo.png";

const LOGOS = { yandex: YandexLogo, vk: VkLogo };

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithOAuth } = useAuth();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const from = location.state?.from?.pathname || "/";

  async function handleProvider(key) {
    setError("");
    if (isLiveProvider(key)) { window.location.href = buildAuthorizeUrl(key); return; }
    setBusy(key);
    try {
      const data = await loginWithOAuth({ provider: key, code: sandboxCode(key) });
      if (!data.user?.role) navigate("/select-role", { replace: true });
      else if (data.user.role === "seller") navigate("/seller/create", { replace: true });
      else if (data.user.role === "producer") navigate("/producer/create", { replace: true });
      else if (data.user.role === "admin") navigate("/admin", { replace: true });
      else navigate(from, { replace: true });
    } catch (err) { setError(err.message || "Не удалось войти"); }
    finally { setBusy(""); }
  }

  return (
    <div className={s.authWrap}>
      <div className={s.authCard}>
        <div className={s.brand}><img src={Logo} alt="Sellix" /><span>Sellix</span></div>
        <h1 className={s.authTitle}>Вход в Sellix</h1>
        <p className={s.authSub}>Маркетплейс, где продавцы открывают магазины, а производители поставляют товары. Войдите, чтобы начать.</p>
        {Object.values(PROVIDERS).map(p => (
          <button key={p.key} type="button" className={s.providerBtn} onClick={() => handleProvider(p.key)} disabled={Boolean(busy)}>
            <img src={LOGOS[p.key]} alt="" />{busy === p.key ? "Входим…" : p.label}
          </button>
        ))}
        <div className={s.divider}>или</div>
        <button type="button" className={s.linkBtn} onClick={() => navigate("/admin/login")}>Вход для администратора</button>
        {error && <div className={s.error}>{error}</div>}
        {!isLiveProvider("yandex") && <p className={s.note}>Демо-режим: вход эмулируется без реальной учётной записи.</p>}
      </div>
    </div>
  );
}
