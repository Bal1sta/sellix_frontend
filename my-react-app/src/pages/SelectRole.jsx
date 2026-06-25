import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import s from "../shared/styles.module.css";
import Logo from "../assets/Images/SelixLOGO.svg";

export default function SelectRole() {
  const navigate = useNavigate();
  const { chooseRole, roleAssigned, role } = useAuth();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  // Если роль уже есть — перенаправляем дальше
  if (roleAssigned) {
    if (role === "seller") { navigate("/seller/create", { replace: true }); return null; }
    if (role === "producer") { navigate("/producer/create", { replace: true }); return null; }
    navigate("/", { replace: true }); return null;
  }

  async function pick(r) {
    setBusy(r); setError("");
    try {
      await chooseRole(r);
      // После выбора роли → на страницу создания магазина/профиля
      navigate(r === "seller" ? "/seller/create" : "/producer/create", { replace: true });
    } catch (err) { setError(err.message); setBusy(""); }
  }

  return (
    <div className={s.authWrap}>
      <div className={s.authCard}>
        <div className={s.brand}><img src={Logo} alt="Sellix" /><span>Sellix</span></div>
        <h1 className={s.authTitle}>Кто вы на платформе?</h1>
        <p className={s.authSub}>Роль выбирается один раз. Сменить её позже можно через поддержку.</p>
        <div className={s.roleGrid}>
          <button type="button" className={s.roleCard} onClick={() => pick("seller")} disabled={Boolean(busy)}>
            <h3>Я продавец</h3><p>Открою магазин, выберу товары из пула и буду продавать со своей наценкой.</p>
          </button>
          <button type="button" className={s.roleCard} onClick={() => pick("producer")} disabled={Boolean(busy)}>
            <h3>Я производитель</h3><p>Размещу товары в пуле — их смогут продавать магазины платформы.</p>
          </button>
        </div>
        {error && <div className={s.error}>{error}</div>}
      </div>
    </div>
  );
}
