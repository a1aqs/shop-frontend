import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, totalPrice } = useContext(CartContext);

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
              <p>{item.price} ₽</p>
              <button onClick={() => removeFromCart(item.id)}>Удалить</button>
            </div>
          </div>
        ))
      )}

      <h2>Итого: {totalPrice()} ₽</h2>

      <button>Оформить заказ</button>
    </div>
  );
}
