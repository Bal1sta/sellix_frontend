import React from 'react'
import TwoSectionStyles from './TwoSection.module.css'
import Header from '../Header/Header'
// import Logo_Logo from '../../../../assets/Logo_Logo.jpg'
import Logo_Logo from "../../../../assets/Images/Logo_Logo.jpg"
import Y_Money_Logo from '../../../../assets/Images/Y_Money_Logo.png'
import SBP_Logo from '../../../../assets/Images/SBP_Logo.png'
import YandexId_Logo from '../../../../assets/Images/YandexId_Logo.jpg'
import VKId_Logo from '../../../../assets/Images/VKId_Logo.png'
import Cdek_Logo from '../../../../assets/Images/Cdek_Logo.png'
import PochtaRossii_Logo from '../../../../assets/Images/PochtaRossii_Logo.png'

export default function TwoSection() {
  return (
    <div className={TwoSectionStyles.ContainerTwoSection}>
        
        <div className={TwoSectionStyles.AboutUs}>

            <div className={TwoSectionStyles.AboutUsText}>
                <h2>О Sellix</h2>
                <p>Sellix — это молодой стартап, который разрабатывает современную платформу для создания и управления онлайн-магазинами. Его цель — упростить процесс запуска интернет-бизнеса, предоставляя предпринимателям интуитивные инструменты для продаж, оплаты и аналитики. Команда Sellix стремится сделать электронную коммерцию доступной каждому, независимо от технических навыков или масштаба бизнеса.</p>
            </div>
            <div className={TwoSectionStyles.ImgTwoSection}>
                <img src={Logo_Logo} alt="Картинка" className={TwoSectionStyles.Image}/>
            </div>
            
        </div>

        <div className={TwoSectionStyles.OpportunitiesHeading}>

            <h2>Ключевые возможности</h2>
            <p>Интегрируйтесь с ведущими сервисами для оптимизации вашей работы.</p>
            
            <div className={TwoSectionStyles.Opportunities}>
                <div className={TwoSectionStyles.Payments}>
                    <h3>Платежи</h3>
                    <img src={Y_Money_Logo} alt="Принимайте платежи с помощью YooMoney" />
                    <img src={SBP_Logo} alt="Быстрые платежи через SBP" />
                </div>

                <div className={TwoSectionStyles.Authentication}>
                    <h3>Авторизация</h3>
                    <img src={YandexId_Logo} alt="Войдите в систему с помощью Yandex ID" />
                    <img src={VKId_Logo} alt="Авторизация с помощью VK ID" />
                </div>

                <div className={TwoSectionStyles.Shipping}>
                    <h3>Доставка</h3>
                    <img src={Cdek_Logo} alt="Услуги по доставке CDEK" />
                    <img src={PochtaRossii_Logo} alt="Отправляем Почтой России" />
                </div>
            </div>

        </div>

        <div className={TwoSectionStyles.RoadMapText}>
            
            <div className={TwoSectionStyles.HeadingRoadMap}>
                <h2>Как это просто</h2>
                <p>Создайте свой онлайн-сайт за несколько простых шагов.</p>
            </div>

            <div className={TwoSectionStyles.RoadMap}>
                <div className={TwoSectionStyles.Circle}>1</div>
                <div className={TwoSectionStyles.LineRoadMap}></div>
                <div className={TwoSectionStyles.Circle}>2</div>
                <div className={TwoSectionStyles.LineRoadMap}></div>
                <div className={TwoSectionStyles.Circle}>3</div>
                <div className={TwoSectionStyles.LineRoadMap}></div>
                <div className={TwoSectionStyles.Circle}>4</div>
            </div>

            <div className={TwoSectionStyles.TextUnderCircle}>
                <p className={TwoSectionStyles.TextForCircle}>Выберите шаблон</p>
                <p className={TwoSectionStyles.TextForCircle}>Добавьте продукты</p>
                <p className={TwoSectionStyles.TextForCircle}>Подключите платежи и доставку</p>
                <p className={TwoSectionStyles.TextForCircle}>Публикуйте и развивайтесь</p>
            </div>

        </div>


    </div>
  )
}
