import React from "react";
import { Link } from "react-router-dom";
import heroStyle from "./storeHero.module.css";
import storeHeroData from "./storeHeroData";

export default function StoreHero() {
  const heroData = storeHeroData;

  const bannerStyle = {
    backgroundImage: heroData.banner ? `url(${heroData.banner})` : "none",
    border: heroData.banner ? "none" : "2px dashed #000000",
    height: heroData.height
  };

  const overlayStyle = {
    background: `rgba(0, 0, 0, ${heroData.overlayOpacity})`,
    justifyContent:
      heroData.contentPosition === "top"
        ? "flex-start"
        : heroData.contentPosition === "bottom"
          ? "flex-end"
          : "center",
    alignItems:
      heroData.textAlign === "left"
        ? "flex-start"
        : heroData.textAlign === "right"
          ? "flex-end"
          : "center",
    textAlign: heroData.textAlign
  };

  const titleStyle = {
    color: heroData.titleColor,
    fontSize: heroData.titleSize
  };

  const subtitleStyle = {
    color: heroData.subtitleColor,
    fontSize: heroData.subtitleSize
  };

  const buttonStyle = {
    background: heroData.buttonBg,
    color: heroData.buttonColor,
    border: heroData.buttonBorder
  };

  return (
    <section className={heroStyle.hero}>
      <div className={heroStyle.banner} style={bannerStyle}>
        <div className={heroStyle.overlay} style={overlayStyle}>
          <div className={heroStyle.content}>
            <h1 className={heroStyle.title} style={titleStyle}>
              {heroData.title.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index !== heroData.title.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>

            {heroData.subtitle && (
              <p className={heroStyle.subtitle} style={subtitleStyle}>
                {heroData.subtitle}
              </p>
            )}

            {heroData.buttonText && (
              <Link
                to={heroData.buttonLink}
                className={heroStyle.button}
                style={buttonStyle}
              >
                {heroData.buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}