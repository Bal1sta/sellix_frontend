import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPages.module.css";

import { useAuth } from "../../../auth/AuthContext.jsx";
import Logo from "../../../assets/Images/SelixLOGO.svg";

// Шаг 2 онбординга (PRD 3.2.3): выбор роли продавец/производитель.
// Покупателю роль присваивается автоматически при первом заказе, поэтому
// здесь только две роли.
export default function SelectRolePage() {
  const navigate = useNavigate();
  const { chooseRole, roleAssigned } = useAuth();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  // Если роль уже есть — сюда заходить незачем.
  if (roleAssigned) {
    navigate("/", { replace: true });
    return null;
  }

  async function pick(role) {
    setBusy(role);
    setError("");
    try {
      await chooseRole(role);
      navigate(role === "seller" ? "/seller" : "/producer", { replace: true });
    } catch (err) {
      setError(err.message || "Не удалось сохранить роль");
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

        <h1 className={styles.title}>Кто вы на платформе?</h1>
        <p className={styles.subtitle}>
          Роль выбирается один раз. Сменить её позже можно только через поддержку.
        </p>

        <div className={styles.roleGrid}>
          <button
            type="button"
            className={styles.roleCard}
            onClick={() => pick("seller")}
            disabled={Boolean(busy)}
          >
            <h3>Я продавец</h3>
            <p>
              Открою магазин, выберу товары из общего пула и буду продавать со
              своей наценкой.
            </p>
          </button>

          <button
            type="button"
            className={styles.roleCard}
            onClick={() => pick("producer")}
            disabled={Boolean(busy)}
          >
            <h3>Я производитель</h3>
            <p>
              Размещу товары в общем пуле по своей цене — их смогут продавать
              магазины.
            </p>
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
