import React from "react";
import NavBar from "../../layout/navBar/navBar.jsx";
import CartPage from "./components/CartPage.jsx";
import Footer from "../../layout/Footer/Footer.jsx";

export default function Cart() {
  return (
    <>
      <NavBar />

      <CartPage />

      <Footer />
    </>
  );
}