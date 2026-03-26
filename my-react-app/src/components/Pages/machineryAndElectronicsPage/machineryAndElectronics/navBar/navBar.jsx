import React from 'react'

import Logo from '../../../../Images/SelixLOGO.svg'
import navBarStyle from './navBarStyle.module.css'


export default function NavBar() {
  return (
    <div className={navBarStyle.navBarContainer}>
        
        {/* Логотип */}
        <div className={navBarStyle.logo}>
            <img 
                src={Logo} 
                alt="Sellix" 
                className={navBarStyle.logoIcon}
                width="40"
                height="40"
            />
            <h2>Sellix</h2>
        </div>

        {/* Поиск */}
        <div className={navBarStyle.searchAll}>
            <input 
                type="text" 
                placeholder="Поиск товаров..."
                className={navBarStyle.searchInput}
            />
            <button className={navBarStyle.searchBtn}>
                Поиск
            </button>
        </div>

        {/* Панель инструментов */}
        <div className={navBarStyle.panelTool}>

            <div className={navBarStyle.chosenOne}>
                <img src="" alt="" />
                🖤
            </div>
            <div className={navBarStyle.profile}>
                <img src="" alt="" />
                👤
            </div>
            <div className={navBarStyle.basket}>
                <img src="" alt="" />
                <span>Корзина</span>
            </div>

        </div>

    </div>
  )
}
