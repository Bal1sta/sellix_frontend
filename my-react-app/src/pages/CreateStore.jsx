import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "../shared/styles.module.css";
import preview from "./StorePreview.module.css";
import Logo from "../assets/Images/SelixLOGO.svg";
import { store as storeApi } from "../api/seller.js";
import { TEMPLATE_LIST } from "./StorePreview.jsx";

export default function CreateStore() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({
    name: "",
    niche: "clothing",     // = выбранный шаблон
    contact_email: "",
    contact_phone: "",
  });

  useEffect(() => {
    storeApi.get()
      .then(() => navigate("/seller", { replace: true }))
      .catch(() => setChecking(false));
  }, [navigate]);

  async function handleCreate(e) {
    e.preventDefault();
    if (form.name.trim().length < 2) { setError("Название слишком короткое"); return; }
    setBusy(true); setError("");
    try {
      await storeApi.create(form);
      navigate("/seller", { replace: true });
    } catch (err) {
      if (/один магазин|already/i.test(err.message || "")) navigate("/seller", { replace: true });
      else { setError(err.message || "Не удалось создать магазин"); setBusy(false); }
    }
  }

  if (checking) return <div className={s.authWrap}><div className={s.authCard}><p className={s.authSub}>Проверяем…</p></div></div>;

  return (
    <div className={s.authWrap}>
      <div className={s.authCard} style={{ maxWidth: 560 }}>
        <div className={s.brand}><img src={Logo} alt="Sellix" /><span>Sellix</span></div>
        <h1 className={s.authTitle}>Создание магазина</h1>
        <p className={s.authSub}>Выберите шаблон витрины и введите название. Оформление зависит от выбранной категории.</p>

        <form onSubmit={handleCreate}>
          <div className={s.field}>
            <label>Название магазина</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Мой магазин" required />
          </div>

          <div className={s.field}>
            <label>Шаблон витрины (категория)</label>
            <div className={preview.tplGrid}>
              {TEMPLATE_LIST.map(t => (
                <button
                  type="button"
                  key={t.key}
                  className={form.niche === t.key ? `${preview.tplCard} ${preview.tplCardActive}` : preview.tplCard}
                  onClick={() => setForm({ ...form, niche: t.key })}
                >
                  <div className={preview.tplSwatch} style={{ background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accent2} 100%)` }} />
                  <div className={preview.tplName}>{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className={s.row}>
            <div className={s.field}><label>Контактный email</label><input type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} /></div>
            <div className={s.field}><label>Телефон</label><input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} /></div>
          </div>

          {error && <div className={s.error}>{error}</div>}
          <button type="submit" className={s.submitBtn} disabled={busy}>{busy ? "Создаём…" : "Создать магазин"}</button>
        </form>
      </div>
    </div>
  );
}
