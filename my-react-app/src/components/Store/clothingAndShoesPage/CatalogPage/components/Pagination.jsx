import React from "react";
import styles from "./Pagination.module.css";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.arrow}
        onClick={handlePrev}
        disabled={currentPage === 1}
        type="button"
      >
        ‹
      </button>

      <div className={styles.pages}>
        {pages.map((page) => (
          <button
            key={page}
            className={`${styles.pageButton} ${
              currentPage === page ? styles.active : ""
            }`}
            onClick={() => onPageChange(page)}
            type="button"
          >
            {String(page).padStart(2, "0")}
          </button>
        ))}
      </div>

      <button
        className={styles.arrow}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        type="button"
      >
        ›
      </button>
    </div>
  );
}