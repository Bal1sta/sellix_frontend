import React from "react";
import styles from "./ProfileDetails.module.css";

export default function ProfileDetails({
  user,
  formData,
  isEditing,
  saving,
  onEditStart,
  onEditCancel,
  onFieldChange,
  onSave,
}) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Данные аккаунта</h2>

      <div className={styles.infoGrid}>
        <div className={styles.infoBlock}>
          <label className={styles.label}>Имя</label>

          {isEditing ? (
            <input
              className={styles.input}
              type="text"
              value={formData.firstName}
              onChange={(event) => onFieldChange("firstName", event.target.value)}
            />
          ) : (
            <p className={styles.value}>{user.firstName}</p>
          )}
        </div>

        <div className={styles.infoBlock}>
          <label className={styles.label}>Фамилия</label>

          {isEditing ? (
            <input
              className={styles.input}
              type="text"
              value={formData.lastName}
              onChange={(event) => onFieldChange("lastName", event.target.value)}
            />
          ) : (
            <p className={styles.value}>{user.lastName}</p>
          )}
        </div>

        <div className={styles.infoBlock}>
          <label className={styles.label}>Электронная почта</label>

          {isEditing ? (
            <input
              className={styles.input}
              type="email"
              value={formData.email}
              onChange={(event) => onFieldChange("email", event.target.value)}
            />
          ) : (
            <p className={styles.value}>{user.email}</p>
          )}
        </div>

        <div className={styles.infoBlock}>
          <label className={styles.label}>Телефон</label>

          {isEditing ? (
            <input
              className={styles.input}
              type="text"
              value={formData.phone}
              onChange={(event) => onFieldChange("phone", event.target.value)}
            />
          ) : (
            <p className={styles.value}>{user.phone}</p>
          )}
        </div>

        <div className={`${styles.infoBlock} ${styles.fullWidth}`}>
          <label className={styles.label}>Основной адрес доставки</label>

          {isEditing ? (
            <textarea
              className={styles.textarea}
              value={formData.address}
              onChange={(event) => onFieldChange("address", event.target.value)}
              rows={4}
            />
          ) : (
            <p className={styles.value}>{user.address}</p>
          )}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.actions}>
        {!isEditing ? (
          <button
            type="button"
            className={styles.editButton}
            onClick={onEditStart}
          >
            Редактировать профиль
          </button>
        ) : (
          <>
            <button
              type="button"
              className={styles.saveButton}
              onClick={onSave}
              disabled={saving}
            >
              {saving ? "Сохранение..." : "Сохранить изменения"}
            </button>

            <button
              type="button"
              className={styles.cancelButton}
              onClick={onEditCancel}
              disabled={saving}
            >
              Отмена
            </button>
          </>
        )}
      </div>
    </div>
  );
}