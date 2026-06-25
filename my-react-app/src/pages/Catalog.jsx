import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import s from "../shared/styles.module.css";
import { getStore, getStoreProducts, listCategories } from "../api/storefront.js";
import { resolveMediaUrl } from "../config/runtime.js";

const money = v => `${Number(v??0).toLocaleString("ru-RU")} ₽`;
const asList = d => Array.isArray(d) ? d : d?.results ?? [];

// Если slug не передан — показывает общий каталог (демо).
// Если передан — показывает витрину конкретного магазина.
export default function Catalog() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeCat = searchParams.get("category") || "";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (slug) {
        const [st, prods, cats] = await Promise.all([
          getStore(slug).catch(() => null),
          getStoreProducts(slug, { category: activeCat || undefined, page_size: 50 }),
          listCategories().catch(() => []),
        ]);
        setStore(st);
        setProducts(asList(prods));
        setCategories(asList(cats));
      } else {
        const cats = asList(await listCategories().catch(() => []));
        setCategories(cats);
        setProducts([]);
      }
    } catch { /* fallback empty */ }
    finally { setLoading(false); }
  }, [slug, activeCat]);

  useEffect(() => { load(); }, [load]);

  function filterByCat(catId) {
    if (catId === activeCat) setSearchParams({});
    else setSearchParams({ category: catId });
  }

  return (
    <div className={s.shell}>
      <Navbar />
      <div className={s.catalogWrap}>
        <div className={s.catalogHeader}>
          <h1>{store?.name || "Каталог товаров"}</h1>
          {store && <p className={s.muted}>{store.description || `Витрина: ${store.slug}`}</p>}
          {!slug && <p className={s.muted}>Откройте магазин по прямой ссылке, чтобы увидеть товары.</p>}
        </div>

        {categories.length > 0 && (
          <div className={s.catalogFilters}>
            {categories.map(c => (
              <button key={c.id} type="button"
                className={activeCat === c.id ? `${s.catalogFilter} ${s.catalogFilterActive}` : s.catalogFilter}
                onClick={() => filterByCat(c.id)}>
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? <div className={s.empty}>Загрузка…</div> : products.length === 0 ? (
          <div className={s.empty}>Товаров не найдено.</div>
        ) : (
          <div className={s.grid}>
            {products.map(p => {
              const img = p.images?.[0]?.image;
              return (
                <Link to={slug ? `/shop/${slug}/product/${p.id}` : `/product/${p.id}`} key={p.id} style={{ textDecoration: "none" }}>
                  <div className={s.productCard}>
                    <img className={s.productThumb} src={img ? resolveMediaUrl(img) : ""} alt="" />
                    <div className={s.productBody}>
                      <div className={s.productName}>{p.name}</div>
                      <p className={s.muted}>{p.category_name}</p>
                      <div className={s.productPrice}>{money(p.price)}</div>
                      {!p.in_stock && <span className={`${s.badge} ${s.badgeYellow}`} style={{marginTop:6}}>Нет в наличии</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
