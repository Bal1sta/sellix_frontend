import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetailsPage.module.css";
import { loadProduct } from "../data/productSource.js";
import {
  addToCart,
  setCartStoreSlug,
} from "../../../../Pages/CartPage/utils/cartStorage";

function getStockLabel(stock) {
  if (stock <= 0) return "Нет в наличии";
  if (stock <= 3) return `Осталось мало: ${stock} шт.`;
  return `В наличии: ${stock} шт.`;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadProduct(id)
      .then((p) => {
        if (active) setProduct(p);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const galleryImages = useMemo(() => {
    if (!product) return [];

    if (product.images && product.images.length > 0) {
      return product.images;
    }

    if (product.image) {
      return [product.image];
    }

    return [];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  // Когда товар загрузился — выставляем стартовые значения галереи/размера.
  useEffect(() => {
    if (!product) return;
    setSelectedImage(product.images?.[0] || product.image || "");
    setSelectedSize(product.sizes?.[0] || "");
    setQuantity(1);
  }, [product]);

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.notFound}>Загрузка товара…</div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className={styles.page}>
        <div className={styles.notFound}>Товар не найден</div>
      </section>
    );
  }

  const stock = product.stock ?? 0;
  const hasSizes = product.sizes && product.sizes.length > 0;
  const isAddDisabled = stock <= 0 || (hasSizes && !selectedSize);

  const increaseQuantity = () => {
    setQuantity((prev) => {
      if (prev >= stock) return prev;
      return prev + 1;
    });
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => {
      if (prev <= 1) return 1;
      return prev - 1;
    });
  };

  const handleAddToCart = () => {
    if (isAddDisabled) return;

    // Привязываем корзину к магазину товара (нужно для оформления заказа).
    if (product.storeSlug) {
      setCartStoreSlug(product.storeSlug);
    }

    const cartItem = {
      id: product.id,
      storeProductId: product.storeProductId || null,
      storeSlug: product.storeSlug || "",
      sku: product.sku || null,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      image: selectedImage || galleryImages[0] || "",
      selectedSize: selectedSize || null,
      quantity,
      stock: product.stock ?? 0,
    };

    addToCart(cartItem);
    setMessage("Товар добавлен в корзину");
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <section className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainImageWrap}>
            {selectedImage && (
              <img
                className={styles.mainImage}
                src={selectedImage}
                alt={product.title}
              />
            )}

            {product.badge && (
              <span className={styles.badge}>{product.badge}</span>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className={styles.thumbRow}>
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.thumbButton} ${
                    selectedImage === img ? styles.thumbButtonActive : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    className={styles.thumbImage}
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <p className={styles.brand}>{product.brand}</p>

          <h1 className={styles.title}>{product.title}</h1>

          {product.subtitle && (
            <p className={styles.subtitle}>{product.subtitle}</p>
          )}

          <p className={styles.price}>
            {product.price.toLocaleString("ru-RU")} ₽
          </p>

          <p className={styles.stock}>{getStockLabel(stock)}</p>

          {product.description && (
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Описание</h3>
              <p className={styles.description}>{product.description}</p>
            </div>
          )}

          {hasSizes && (
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Размер</h3>

              <div className={styles.sizeButtons}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`${styles.sizeButton} ${
                      selectedSize === size ? styles.sizeButtonActive : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Количество</h3>

            <div className={styles.quantityWrap}>
              <button
                type="button"
                className={styles.quantityButton}
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                −
              </button>

              <span className={styles.quantityValue}>{quantity}</span>

              <button
                type="button"
                className={styles.quantityButton}
                onClick={increaseQuantity}
                disabled={quantity >= stock || stock === 0}
              >
                +
              </button>
            </div>
          </div>

          {product.features && (
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Характеристики</h3>

              <div className={styles.features}>
                {product.features.material && (
                  <p>
                    <span>Материал:</span> {product.features.material}
                  </p>
                )}

                {product.features.country && (
                  <p>
                    <span>Страна:</span> {product.features.country}
                  </p>
                )}

                {product.features.season && (
                  <p>
                    <span>Сезон:</span> {product.features.season}
                  </p>
                )}

                {product.sku && (
                  <p>
                    <span>Артикул:</span> {product.sku}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            className={styles.addButton}
            disabled={isAddDisabled}
            onClick={handleAddToCart}
          >
            Добавить в корзину
          </button>

          {message && <p className={styles.successMessage}>{message}</p>}
        </div>
      </div>
    </section>
  );
}