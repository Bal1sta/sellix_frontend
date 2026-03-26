import React from 'react'
import { Link } from 'react-router-dom';
import electronicsStyle from './machineryAndElectronicsStyle.module.css'

export default function MachineryAndElectronics() {
  return (
    <div className={electronicsStyle.page}>
      <h1>Категория: Техника и электроника</h1>
      <p>Список товаров категории "machineryAndElectronics"</p>
      
      <Link to="/editing-page">
        <button className={electronicsStyle.backButton}>← Назад к панели управления</button>
      </Link>
    </div>
  )
}
