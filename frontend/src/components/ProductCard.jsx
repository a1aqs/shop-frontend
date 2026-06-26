import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <article className="product">
      {product.image && <img src={product.image} alt={product.name} />}

      <div className="product-content">
        <div>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </div>

        <div className="product-meta">
          <span className="product-price">{product.price} ₽</span>
          <span className="product-badge">{product.amount ? `${product.amount} в наличии` : "Нет в наличии"}</span>
        </div>

        <button onClick={() => addToCart(product)} disabled={product.amount <= 0}>
          {product.amount > 0 ? "Добавить в корзину" : "Нет в наличии"}
        </button>
      </div>
    </article>
  );
}
