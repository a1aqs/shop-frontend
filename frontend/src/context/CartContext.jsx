import { createContext, useState } from "react";
import { createOrder } from "../api.js";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    const productWithImage = { ...product, quantity: 1 };
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...currentCart, productWithImage];
    });
  }

  function removeFromCart(id) {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== id) return item;
          const quantity = item.quantity || 1;
          if (quantity <= 1) return null;
          return { ...item, quantity: quantity - 1 };
        })
        .filter(Boolean)
    );
  }

  function clearFromCart(id) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  }

  function totalPrice() {
    return cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
  }

  async function checkout(clientId) {
    if (!clientId) {
      throw new Error("Требуется идентификатор пользователя для оформления заказа");
    }
    if (cart.length === 0) {
      throw new Error("Корзина пуста");
    }

    const productInfos = cart.map((item) => ({
      productId: item.id,
      productAmount: item.quantity || 1,
    }));

    const order = await createOrder(clientId, productInfos);
    setCart([]);
    return order;
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearFromCart, totalPrice, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
}
