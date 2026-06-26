import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";

export default function Cart() {
  const { cart, addToCart, removeFromCart, clearFromCart, totalPrice, checkout } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user?.id) {
      setMessage("Войдите, чтобы оформить заказ.");
      navigate("/auth");
      return;
    }

    try {
      setIsLoading(true);
      const order = await checkout(user.id);
      setMessage(`Заказ #${order.id} создан. Сумма: ${order.totalCost ?? totalPrice()} ₽`);
      navigate("/profile");
    } catch (err) {
      setMessage(err?.message || "Не удалось оформить заказ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Корзина</h1>

      {cart.length === 0 ? (
        <h2>Корзина пустая</h2>
      ) : (
        cart.map((item) => (
          <div className="cart-item" key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {item.image && (
              <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: "cover" }} />
            )}
            <div>
              <h3>{item.name}</h3>
              <p>
                {item.price} ₽ × {item.quantity || 1} = {(item.price || 0) * (item.quantity || 1)} ₽
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => addToCart(item)}>
                  +
                </button>
                <button onClick={() => removeFromCart(item.id)}>
                  -
                </button>
                <button onClick={() => clearFromCart(item.id)}>
                  Удалить товар
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      <h2>Итого: {totalPrice()} ₽</h2>
      {message && <p className="status-message">{message}</p>}
      <button onClick={handleCheckout} disabled={cart.length === 0 || isLoading}>
        {isLoading ? "Оформление..." : "Оформить заказ"}
      </button>
    </div>
  );
}
