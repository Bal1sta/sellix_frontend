import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import s from "../shared/styles.module.css";
import legal from "./LegalPage.module.css";
import Logo from "../assets/Images/SelixLOGO.svg";
import { LEGAL_DOCS } from "./legalContent.js";

// Универсальная страница для правовых документов.
// docKey приходит из роутера и определяет, какой документ показать.
export default function LegalPage({ docKey }) {
  const navigate = useNavigate();
  const doc = LEGAL_DOCS[docKey];

  useEffect(() => { window.scrollTo(0, 0); }, [docKey]);

  if (!doc) {
    return (
      <div className={legal.wrap}>
        <div className={legal.empty}>Документ не найден.</div>
      </div>
    );
  }

  return (
    <div className={legal.wrap}>
      {/* Шапка */}
      <header className={legal.header}>
        <button className={legal.brand} onClick={() => navigate("/")}>
          <img src={Logo} alt="Sellix" />
          <span>Sellix</span>
        </button>
        <button className={legal.back} onClick={() => navigate(-1)}>← Назад</button>
      </header>

      {/* Документ */}
      <main className={legal.doc}>
        <h1 className={legal.title}>{doc.title}</h1>
        <p className={legal.meta}>Редакция от {doc.updated}</p>

        {doc.sections.map((sec, i) => (
          <section key={i} className={legal.section}>
            {sec.heading && <h2 className={legal.heading}>{sec.heading}</h2>}
            {sec.paragraphs.map((para, j) => (
              <p key={j} className={legal.para}>{para}</p>
            ))}
            {sec.list && (
              <ul className={legal.list}>
                {sec.list.map((item, k) => <li key={k}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}

        {/* Навигация между документами */}
        <div className={legal.docNav}>
          <h3>Другие документы</h3>
          <div className={legal.docNavLinks}>
            {Object.entries(LEGAL_DOCS)
              .filter(([key]) => key !== docKey)
              .map(([key, d]) => (
                <button key={key} onClick={() => navigate(`/legal/${key}`)}>
                  {d.title}
                </button>
              ))}
          </div>
        </div>
      </main>

      {/* Подвал */}
      <footer className={legal.footer}>
        <span>© 2025 Sellix · ООО «Селликс»</span>
        <a href="mailto:support@mysellix.ru">support@mysellix.ru</a>
      </footer>
    </div>
  );
}
