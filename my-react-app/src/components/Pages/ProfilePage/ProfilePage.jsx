import React from "react";
import NavBar from "../../layout/navBar/navBar.jsx";
import Footer from "../../layout/Footer/Footer.jsx";
import ProfileSidebar from "./components/ProfileSidebar.jsx";
import ProfileDetails from "./components/ProfileDetails.jsx";
import ProfileOrders from "./components/ProfileOrders.jsx";
import { useProfilePage } from "./data/ProfilePage.js";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const {
    state,
    handleTabChange,
    handleEditStart,
    handleEditCancel,
    handleFieldChange,
    handleSave,
  } = useProfilePage();

  const { profile, orders, loading, saving, error, activeTab, isEditing, formData } =
    state;

  return (
    <>
      <NavBar />

      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Мой профиль</h1>
            <p className={styles.subtitle}>
              Управляйте настройками аккаунта и отслеживайте историю своих заказов.
            </p>
          </div>

          {loading ? (
            <div className={styles.messageBox}>Загрузка профиля...</div>
          ) : error ? (
            <div className={styles.errorBox}>{error}</div>
          ) : profile ? (
            <div className={styles.layout}>
              <ProfileSidebar
                user={profile}
                activeTab={activeTab}
                setActiveTab={handleTabChange}
              />

              <section className={styles.content}>
                {activeTab === "profile" && (
                  <ProfileDetails
                    user={profile}
                    formData={formData}
                    isEditing={isEditing}
                    saving={saving}
                    onEditStart={handleEditStart}
                    onEditCancel={handleEditCancel}
                    onFieldChange={handleFieldChange}
                    onSave={handleSave}
                  />
                )}

                {activeTab === "orders" && <ProfileOrders orders={orders} />}

                {activeTab === "payments" && (
                  <div className={styles.placeholder}>
                    <h2>Способы оплаты</h2>
                    <p>Здесь позже можно подключить сохранённые карты пользователя.</p>
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className={styles.placeholder}>
                    <h2>Параметры доставки</h2>
                    <p>Здесь позже можно подключить адреса и настройки доставки.</p>
                  </div>
                )}

                {activeTab === "newsletter" && (
                  <div className={styles.placeholder}>
                    <h2>Настройки рассылки</h2>
                    <p>Здесь позже можно подключить подписки и уведомления.</p>
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className={styles.messageBox}>Профиль не найден.</div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}