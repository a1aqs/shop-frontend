import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";

export default function Header() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(UserContext);

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <h2>🛒 Магазин</h2>
      </Link>

      <nav>
        <Link to="/">Главная</Link>
        {user?.isGuest ? (
          <Link to="/auth">Войти</Link>
        ) : (
          <button className="link-button" onClick={logout}>
            Выйти
          </button>
        )}
        <Link to="/profile">Профиль</Link>
        <Link to="/cart">Корзина ({cart.length})</Link>
      </nav>
    </header>
  );
}
