import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { redirectUri } from "../auth/oauth.js";
import s from "../shared/styles.module.css";
import Logo from "../assets/Images/SelixLOGO.svg";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const [error, setError] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const code = params.get("code"), provider = params.get("state") || params.get("provider");
    if (!code || !provider) { setError("Не получен код авторизации"); return; }
    (async () => {
      try {
        const data = await loginWithOAuth({ provider, code, redirectUri: redirectUri() });
        if (!data.user?.role) navigate("/select-role", { replace: true });
        else if (data.user.role === "seller") navigate("/seller/create", { replace: true });
        else if (data.user.role === "producer") navigate("/producer/create", { replace: true });
        else navigate("/", { replace: true });
      } catch (err) { setError(err.message || "Не удалось войти"); }
    })();
  }, [params, loginWithOAuth, navigate]);

  return (
    <div className={s.authWrap}>
      <div className={s.authCard}>
        <div className={s.brand}><img src={Logo} alt="Sellix" /><span>Sellix</span></div>
        {error ? (<><h1 className={s.authTitle}>Ошибка входа</h1><div className={s.error}>{error}</div>
          <button type="button" className={s.linkBtn} onClick={() => navigate("/login", { replace: true })}>Назад</button></>
        ) : (<><h1 className={s.authTitle}>Завершаем вход…</h1><p className={s.authSub}>Подождите.</p></>)}
      </div>
    </div>
  );
}
