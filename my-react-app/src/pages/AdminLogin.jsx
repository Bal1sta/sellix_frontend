import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import s from "../shared/styles.module.css";
import Logo from "../assets/Images/SelixLOGO.svg";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAsAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError("");
    try { await loginAsAdmin({ email, password }); navigate("/admin", { replace: true }); }
    catch (err) { setError(err.message || "Неверные данные"); setBusy(false); }
  }

  return (
    <div className={s.authWrap}>
      <div className={s.authCard}>
        <div className={s.brand}><img src={Logo} alt="Sellix" /><span>Sellix</span></div>
        <h1 className={s.authTitle}>Панель администратора</h1>
        <form onSubmit={submit}>
          <div className={s.field}><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div className={s.field}><label>Пароль</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <button type="submit" className={s.submitBtn} disabled={busy}>{busy ? "Входим…" : "Войти"}</button>
        </form>
        {error && <div className={s.error}>{error}</div>}
        <button type="button" className={s.linkBtn} style={{ marginTop: 18 }} onClick={() => navigate("/login")}>Обычный вход</button>
      </div>
    </div>
  );
}
