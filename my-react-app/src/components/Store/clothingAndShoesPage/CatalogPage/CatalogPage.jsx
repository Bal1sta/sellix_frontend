import React, { useEffect, useMemo, useState } from "react";
import styles from "./CatalogPage.module.css";
import NavBar from "../../../layout/navBar/navBar.jsx";
import CatalogIntro from "./components/CatalogIntro.jsx";
import FiltersSidebar from "./components/FiltersSidebar.jsx";
import CatalogToolbar from "./components/CatalogToolbar.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import Pagination from "./components/Pagination.jsx";
import Footer from "../../../layout/Footer/Footer.jsx";
import { getCatalogData } from "./api/catalogApi.js";
import {
  applyCatalogFilters,
  sortProducts,
  paginateProducts,
  getPriceBounds,
} from "./utils/catalogUtils.js";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [availableFilters, setAvailableFilters] = useState({
    brands: [],
    categories: [],
    sizes: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    sizes: [],
    priceMin: 0,
    priceMax: 100000,
  });

  const productsPerPage = 6;

  useEffect(() => {
    async function loadCatalog() {
      try {
        const data = await getCatalogData();

        setProducts(data.products || []);
        setAvailableFilters(
          data.filters || {
            brands: [],
            categories: [],
            sizes: [],
          }
        );

        const { minPrice, maxPrice } = getPriceBounds(data.products || []);

        setFilters((prev) => ({
          ...prev,
          priceMin: minPrice,
          priceMax: maxPrice,
        }));
      } catch (error) {
        console.error("Ошибка загрузки каталога:", error);
      }
    }

    loadCatalog();
  }, []);

  const filteredProducts = useMemo(() => {
    return applyCatalogFilters(products, filters);
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortBy);
  }, [filteredProducts, sortBy]);

  const totalProducts = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / productsPerPage));

  const currentProducts = useMemo(() => {
    return paginateProducts(sortedProducts, currentPage, productsPerPage);
  }, [sortedProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const exists = prev[key].includes(value);

      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((item) => item !== value)
          : [...prev[key], value],
      };
    });
  };

  const handleSizeClick = (size) => {
    handleCheckboxChange("sizes", size);
  };

  const handlePriceChange = (field, value) => {
    const numericValue = Number(value) || 0;

    setFilters((prev) => ({
      ...prev,
      [field]: numericValue,
    }));
  };

  const handleResetFilters = () => {
    const { minPrice, maxPrice } = getPriceBounds(products);

    setFilters({
      categories: [],
      brands: [],
      sizes: [],
      priceMin: minPrice,
      priceMax: maxPrice,
    });
  };

  return (
    <div>
      <NavBar />

      <section className={styles.page}>
        <CatalogIntro />

        <div className={styles.content}>
          <FiltersSidebar
            products={products}
            availableFilters={availableFilters}
            filters={filters}
            onCheckboxChange={handleCheckboxChange}
            onSizeClick={handleSizeClick}
            onPriceChange={handlePriceChange}
            onResetFilters={handleResetFilters}
          />

          <div className={styles.main}>
            <CatalogToolbar
              currentPage={currentPage}
              productsPerPage={productsPerPage}
              totalProducts={totalProducts}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <ProductGrid products={currentProducts} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

      </section>
      <Footer />
    </div>
  );
}