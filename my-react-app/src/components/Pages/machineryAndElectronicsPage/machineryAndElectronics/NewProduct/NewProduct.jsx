import React from 'react'
import NewProductStyle from './NewProductStyle.module.css'

export default function NewProduct() {
  return (
    <div className={NewProductStyle.productWrapper}>
      <div className={NewProductStyle.imageContainer}>
        <img 
          className={NewProductStyle.newProductImage}
          alt="Новый продукт"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC76VNtlEWPumf-k7jJDW2Odw2xJDageH0K3khw5aXKlnWDkmAN9U1bw0GdTLESJ3CcLVx8yZCgIaxjiOq6fvgGYxt3YSom9XZfY9OtWy2AjHybLk2yvwHwJGlar6F6KWzgjNjg9-jyGQbNbCno4lyxN3zjm574UQsCP9TRn3Ki8Z_RfMOei7ZlgNmZTZPmM_Jw7bwj3I34A1SZKnWHSyvAxx2h61XZufjSLoM2I-zBPbQTnXjH5nzSrYfzJCTrH2_Rlxbjg15m0ZFv"
        />
        <div className={NewProductStyle.textOverlay}>
          <h2 className={NewProductStyle.productTitle}>iPhone 15 Pro</h2>
          <p className={NewProductStyle.productDescription}>
            Супер крутой телефон будущего
          </p>
          <button className={NewProductStyle.buyButton}>Купить</button>
        </div>
      </div>
    </div>
  )
}
