import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    let productWithImage = product;
    try {
      if (!product.image) {
        const stored = localStorage.getItem(`product-image-${product.id}`);
        if (stored) productWithImage = { ...product, image: stored };
      }
    } catch (e) {}

    setCart([...cart, productWithImage]);
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function totalPrice() {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}
