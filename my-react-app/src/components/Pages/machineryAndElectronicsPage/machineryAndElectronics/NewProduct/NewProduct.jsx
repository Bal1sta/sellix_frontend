import React, { useEffect, useState } from 'react';
import NewProductStyle from './NewProductStyle.module.css';

export default function NewProduct() {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const handleAddProduct = () => {
    const trimmedName = productName.trim();
    const trimmedDescription = productDescription.trim();

    if (trimmedName.length < 2) {
      alert('Введите название товара');
      return;
    }

    if (!productPrice || Number(productPrice) <= 0) {
      alert('Введите корректную цену');
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: trimmedName,
      price: Number(productPrice),
      description: trimmedDescription,
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    setProductName('');
    setProductPrice('');
    setProductDescription('');
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  return (
    <div className={NewProductStyle.wrapper}>
      <div className={NewProductStyle.formBlock}>
        <h2 className={NewProductStyle.title}>Добавить товар</h2>

        <input
          type="text"
          placeholder="Название товара"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className={NewProductStyle.input}
        />

        <input
          type="number"
          placeholder="Цена"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          className={NewProductStyle.input}
        />

        <textarea
          placeholder="Описание товара"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className={NewProductStyle.textarea}
        />

        <button
          onClick={handleAddProduct}
          className={NewProductStyle.addButton}
        >
          Добавить товар
        </button>
      </div>

      <div className={NewProductStyle.listBlock}>
        <h2 className={NewProductStyle.title}>Список товаров</h2>

        {products.length === 0 ? (
          <p className={NewProductStyle.emptyText}>Товаров пока нет</p>
        ) : (
          <div className={NewProductStyle.productList}>
            {products.map((product) => (
              <div key={product.id} className={NewProductStyle.card}>
                <h3 className={NewProductStyle.productTitle}>{product.name}</h3>
                <p className={NewProductStyle.productPrice}>{product.price} ₽</p>
                <p className={NewProductStyle.productDescription}>
                  {product.description || 'Без описания'}
                </p>

                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className={NewProductStyle.deleteButton}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}