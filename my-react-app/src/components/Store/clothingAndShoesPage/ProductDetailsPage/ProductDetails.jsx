import React from "react";
import NavBar from "../../../layout/navBar/navBar";
import ProductDetailsPage from "./components/ProductDetailsPage";
import Footer from "../../../layout/Footer/Footer";

export default function ProductDetails() {
  return (
    <>
      <NavBar />
      <ProductDetailsPage />
      <Footer />
    </>
  );
}