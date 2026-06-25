import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import s from "../shared/styles.module.css";
import { getStoreProduct } from "../api/storefront.js";
import { resolveMediaUrl } from "../config/runtime.js";
import { addToCart, setCartStoreSlug } from "../components/Pages/CartPage/utils/cartStorage.js";

const money = v => `${Number(v??0).toLocaleString("ru-RU")} ₽`;

export default function ProductDetail() {
  const { slug, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!slug || !productId) { setLoading(false); return; }
    getStoreProduct(slug, productId)
      .then(p => setProduct(p))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug, productId]);

  function handleAdd() {
    if (!product) return;
    setCartStoreSlug(slug);
    const img = product.images?.[0]?.image;
    addToCart({
      id: product.id,
      storeProductId: product.id,
      storeSlug: slug,
      title: product.name,
      subtitle: product.category_name || "",
      price: Number(product.price),
      image: img ? resolveMediaUrl(img) : "",
      quantity: qty,
      stock: product.in_stock ? 99 : 0,
    });
    setMsg("Добавлено в корзину!");
    setTimeout(() => setMsg(""), 2500);
  }

  if (loading) return <div className={s.shell}><Navbar /><div className={s.empty}>Загрузка…</div></div>;
  if (!product) return <div className={s.shell}><Navbar /><div className={s.empty}>Товар не найден.</div></div>;

  const images = (product.images || []).map(img => resolveMediaUrl(img.image));
  const mainImg = images[0] || "";

  return (
    <div className={s.shell}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>
        <button className={s.linkBtn} onClick={() => navigate(-1)} style={{ textAlign: "left", marginBottom: 16, color: "var(--color-black)" }}>← Назад</button>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 360px" }}>
            {mainImg && <img src={mainImg} alt="" style={{ width: "100%", borderRadius: 14, objectFit: "cover", aspectRatio: "1/1", background: "var(--color-lightGray)" }} />}
            {images.length > 1 && (
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {images.map((img, i) => <img key={i} src={img} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, cursor: "pointer", border: "1px solid var(--color-lightGray)" }} />)}
              </div>
            )}
          </div>
          <div style={{ flex: "1 1 300px" }}>
            <p className={s.muted}>{product.category_name}</p>
            <h1 style={{ fontSize: "1.6rem", color: "var(--color-black)", margin: "8px 0 16px" }}>{product.name}</h1>
            <div className={s.productPrice} style={{ fontSize: "1.4rem", marginBottom: 16 }}>{money(product.price)}</div>
            <p style={{ color: "rgb(80,80,90)", fontSize: ".88rem", lineHeight: 1.6, marginBottom: 24 }}>{product.description}</p>

            {product.in_stock ? (
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <div className={s.cartQty}>
                  <button className={s.cartQtyBtn} onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                  <span style={{ color: "var(--color-black)", fontSize: ".9rem", minWidth: 20, textAlign: "center" }}>{qty}</span>
                  <button className={s.cartQtyBtn} onClick={() => setQty(q => q+1)}>+</button>
                </div>
              </div>
            ) : (
              <span className={`${s.badge} ${s.badgeYellow}`} style={{ marginBottom: 16, display: "inline-block" }}>Нет в наличии</span>
            )}

            <button className={s.btn} onClick={handleAdd} disabled={!product.in_stock} style={{ width: "100%" }}>
              Добавить в корзину
            </button>
            {msg && <div className={s.success}>{msg}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
