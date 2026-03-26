import React from 'react'


import './electronicsStyle.css'
import NavBar from './machineryAndElectronics/navBar/navBar.jsx'
import NewProduct from './machineryAndElectronics/NewProduct/NewProduct.jsx'



import MachineryAndElectronics from './machineryAndElectronics/machineryAndElectronics.jsx';

export default function ElectronicsPage() {
  return (
    <div>
        <NavBar/>
        <NewProduct/>
        {/* <MachineryAndElectronics /> */}
    </div>
  )
}
