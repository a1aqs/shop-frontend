import { Link } from "react-router-dom";
import homeImg from "../assets/home.jpg";

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Новости</span>
          <h1>Магазин электроники</h1>
          <p>
            Брендовые аксессуары и электроника с минималистичным дизайном и
            аккуратным оформлением. Перейдите в каталог, чтобы выбрать товары.
          </p>
          <div className="hero-actions">
            <Link to="/catalog" className="button">
              Перейти в каталог
            </Link>
          </div>
        </div>
        <img src={homeImg} alt="Shop" className="home-image" />
      </section>
    </div>
  );
}
