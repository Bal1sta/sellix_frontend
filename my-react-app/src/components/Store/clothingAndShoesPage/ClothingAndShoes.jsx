import React from "react";
import NavBar from "../../layout/navBar/navBar.jsx";
import StoreHero from "./clothingAndShoes/StoreHero/StoreHero.jsx";
import Bestsellers from "./clothingAndShoes/Bestsellers/Bestsellers.jsx";
import FeaturedCategories from "./clothingAndShoes/FeaturedCategories/FeaturedCategories.jsx";
import NewArrivals from "./clothingAndShoes/NewArrivals/NewArrivals.jsx";
import SaleBanner from "./clothingAndShoes/SaleBanner/SaleBanner.jsx";
import BrandInfo from "./clothingAndShoes/BrandInfo/BrandInfo.jsx";
import Footer from "../../layout/Footer/Footer.jsx";

export default function ShopPage() {
  return (
    <>
      <NavBar />
      <StoreHero />
      <Bestsellers />
      <FeaturedCategories />
      <NewArrivals />
      <SaleBanner />
      <BrandInfo />
      <Footer />
    </>
  );
}