import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Header() {
  const { cart } = useContext(CartContext);

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <h2>🛒 Магазин</h2>
      </Link>

      <nav>
        <Link to="/">Главная</Link>
        <Link to="/auth">Войти</Link>
        <Link to="/profile">Профиль</Link>
        <Link to="/cart">Корзина ({cart.length})</Link>
      </nav>
    </header>
  );
}
