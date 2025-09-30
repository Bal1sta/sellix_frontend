import React from 'react'
import TwoSectionStyles from './TwoSection.module.css'
import CatImg from '../../../Images/cat.webp'
import Header from '../Header/Header'

export default function TwoSection() {
  return (
    <div className={TwoSectionStyles.ContainerTwoSection}>
        
        <div className={TwoSectionStyles.AboutUs}>

            <div className={TwoSectionStyles.AboutUsText}>
                <h2>O Commercia</h2>
                <p>Commercia — это ведущая платформа для создания и управления онлайн-магазинами. Мы стремимся предоставить предпринимателям по всему миру инструменты, необходимые для достижения успеха в электронной коммерции. Наша миссия — сделать запуск и развитие бизнеса в интернете простым и доступным для всех.</p>
            </div>
            <div className={TwoSectionStyles.ImgTwoSection}>
                <img src={CatImg} alt="Картинка" className={TwoSectionStyles.Image}/>
            </div>
            
        </div>

        <div className={TwoSectionStyles.OpportunitiesHeading}>

            <h2>Ключевые возможности</h2>
            <p>Интегрируйтесь с ведущими сервисами для оптимизации вашей работы.</p>
            
            <div className={TwoSectionStyles.Opportunities}>
                <div className={TwoSectionStyles.Payments}>
                    <h3>Платежи</h3>
                    <img src={CatImg} alt="Принимайте платежи с помощью YooMoney" />
                    <img src={CatImg} alt="Быстрые платежи через SBP" />
                </div>

                <div className={TwoSectionStyles.Authentication}>
                    <h3>Идентификация</h3>
                    <img src={CatImg} alt="Войдите в систему с помощью Yandex ID" />
                    <img src={CatImg} alt="Авторизация с помощью VK ID" />
                </div>

                <div className={TwoSectionStyles.Shipping}>
                    <h3>Доставка</h3>
                    <img src={CatImg} alt="Услуги по доставке CDEK" />
                    <img src={CatImg} alt="Отправляем Почтой России" />
                </div>
            </div>

        </div>

        <div className={TwoSectionStyles.RoadMapText}>
            
            <h3>Как это просто</h3>
            <p>Создайте свой онлайн-сайт всего за несколько простых шагов.</p>

            
            <div className={TwoSectionStyles.RoadMap}>
                <div className={TwoSectionStyles.Circle}>1</div>
                <div className={TwoSectionStyles.Circle}>2</div>
                <div className={TwoSectionStyles.Circle}>3</div>
                <div className={TwoSectionStyles.Circle}>4</div>
                <div className={TwoSectionStyles.LineRoadMap}></div>
            </div>

        </div>


    </div>
  )
}
