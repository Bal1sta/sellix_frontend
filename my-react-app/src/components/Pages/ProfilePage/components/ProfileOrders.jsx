import React from "react";
import { formatPrice, getStatusLabel } from "../data/profileHelpers.js";
import styles from "./ProfileOrders.module.css";

export default function ProfileOrders({ orders }) {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <h2 className={styles.title}>История заказов</h2>
      </div>

      <div className={styles.ordersList}>
        {orders.length === 0 ? (
          <div className={styles.emptyState}>У вас пока нет заказов.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className={styles.orderItem}>
              <div className={styles.left}>
                <img
                  className={styles.productImage}
                  src={order.image}
                  alt={order.title}
                />

                <div className={styles.orderInfo}>
                  <p className={styles.orderId}>Заказ #{order.number}</p>
                  <h3 className={styles.orderTitle}>{order.title}</h3>
                  <p className={styles.orderDate}>{order.createdAt}</p>
                </div>
              </div>

              <div className={styles.right}>
                <span
                  className={`${styles.status} ${
                    order.status === "delivered"
                      ? styles.delivered
                      : order.status === "in_transit"
                      ? styles.inTransit
                      : order.status === "processing"
                      ? styles.processing
                      : styles.cancelled
                  }`}
                >
                  {getStatusLabel(order.status)}
                </span>

                <p className={styles.price}>{formatPrice(order.totalPrice)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}