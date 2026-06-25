import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "../shared/styles.module.css";
import Logo from "../assets/Images/SelixLOGO.svg";
import { profile as profileApi } from "../api/producer.js";
import { listCategories } from "../api/storefront.js";

const asList = d => Array.isArray(d) ? d : d?.results ?? [];

export default function CreateProducerProfile() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [form, setForm] = useState({
    company_name: "",
    inn: "",
    ogrn: "",
    contact_email: "",
    contact_phone: "",
  });

  // Если профиль уже создан — сразу в кабинет
  useEffect(() => {
    profileApi.get()
      .then(() => navigate("/producer", { replace: true }))
      .catch(() => setChecking(false));
    listCategories().then(d => setCategories(asList(d))).catch(() => {});
  }, [navigate]);

  function toggleCat(id) {
    setSelectedCats(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 3 ? prev : [...prev, id]
    );
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (form.company_name.trim().length < 2) { setError("Название слишком короткое"); return; }
    setBusy(true); setError("");
    try {
      await profileApi.create({ ...form, category_ids: selectedCats });
      navigate("/producer", { replace: true });
    } catch (err) {
      if (/уже создан|already/i.test(err.message || "")) {
        navigate("/producer", { replace: true });
      } else {
        setError(err.message || "Не удалось создать профиль");
        setBusy(false);
      }
    }
  }

  if (checking) return <div className={s.authWrap}><div className={s.authCard}><p className={s.authSub}>Проверяем…</p></div></div>;

  return (
    <div className={s.authWrap}>
      <div className={s.authCard}>
        <div className={s.brand}><img src={Logo} alt="Sellix" /><span>Sellix</span></div>
        <h1 className={s.authTitle}>Профиль компании</h1>
        <p className={s.authSub}>Введите основные данные о вашей компании. Остальное можно настроить позже.</p>

        <form onSubmit={handleCreate}>
          <div className={s.field}>
            <label>Название компании</label>
            <input
              value={form.company_name}
              onChange={e => setForm({ ...form, company_name: e.target.value })}
              placeholder="ООО «Ромашка»"
              required
            />
          </div>

          <div className={s.row}>
            <div className={s.field}>
              <label>ИНН</label>
              <input value={form.inn} onChange={e => setForm({ ...form, inn: e.target.value })} />
            </div>
            <div className={s.field}>
              <label>ОГРН / ОГРНИП</label>
              <input value={form.ogrn} onChange={e => setForm({ ...form, ogrn: e.target.value })} />
            </div>
          </div>

          {categories.length > 0 && (
            <div className={s.field}>
              <label>Категории продукции (до 3)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {categories.map(c => (
                  <label key={c.id} style={{ display: "flex", gap: 6, fontSize: ".82rem", color: "var(--color-black)", cursor: "pointer" }}>
                    <input type="checkbox" checked={selectedCats.includes(c.id)} onChange={() => toggleCat(c.id)} />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={s.row}>
            <div className={s.field}>
              <label>Контактный email</label>
              <input type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
            </div>
            <div className={s.field}>
              <label>Телефон</label>
              <input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} />
            </div>
          </div>

          {error && <div className={s.error}>{error}</div>}
          <button type="submit" className={s.submitBtn} disabled={busy}>
            {busy ? "Создаём…" : "Создать профиль"}
          </button>
        </form>
      </div>
    </div>
  );
}
