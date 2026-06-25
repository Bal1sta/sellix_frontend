import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./AuthPages.module.css";

import { useAuth } from "../../../auth/AuthContext.jsx";
import { redirectUri } from "../../../auth/oauth.js";

import Logo from "../../../assets/Images/SelixLOGO.svg";

// Боевой callback OAuth (PRD 3.2.1): провайдер вернул ?code=...&state=provider.
// Меняем код на JWT через бэк и ведём пользователя дальше.
export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const [error, setError] = useState("");
  const ranRef = useRef(false); // защита от двойного запуска в StrictMode

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const code = params.get("code");
    const provider = params.get("state") || params.get("provider");

    if (!code || !provider) {
      setError("Не получен код авторизации от провайдера");
      return;
    }

    (async () => {
      try {
        const data = await loginWithOAuth({
          provider,
          code,
          redirectUri: redirectUri(),
        });
        if (!data.user?.role) {
          navigate("/select-role", { replace: true });
        } else if (data.user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (err) {
        setError(err.message || "Не удалось завершить вход");
      }
    })();
  }, [params, loginWithOAuth, navigate]);

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <img src={Logo} alt="Sellix" />
          <span>Sellix</span>
        </div>
        {error ? (
          <>
            <h1 className={styles.title}>Ошибка входа</h1>
            <div className={styles.error}>{error}</div>
            <button
              type="button"
              className={styles.backLink}
              onClick={() => navigate("/login", { replace: true })}
            >
              Вернуться ко входу
            </button>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Завершаем вход…</h1>
            <p className={styles.subtitle}>Подождите, проверяем авторизацию.</p>
          </>
        )}
      </div>
    </div>
  );
}
