import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPages.module.css";

import { useAuth } from "../../../auth/AuthContext.jsx";
import Logo from "../../../assets/Images/SelixLOGO.svg";

// Отдельный вход в Admin Panel (PRD 3.5): email + пароль, без OAuth.
export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginAsAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await loginAsAdmin({ email, password });
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Неверные учётные данные");
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <img src={Logo} alt="Sellix" />
          <span>Sellix</span>
        </div>

        <h1 className={styles.title}>Панель администратора</h1>
        <p className={styles.subtitle}>Вход для суперадмина платформы.</p>

        <form onSubmit={submit}>
          <div className={styles.field}>
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="admin-password">Пароль</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className={styles.submit} disabled={busy}>
            {busy ? "Входим…" : "Войти"}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        <button
          type="button"
          className={styles.backLink}
          onClick={() => navigate("/login")}
        >
          Обычный вход
        </button>
      </div>
    </div>
  );
}
