import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
	const { addToCart } = useContext(CartContext);

	return (
		<div className="product">
			{product.image && (
				<div style={{ marginBottom: 8 }}>
					<img src={product.image} alt={product.name} style={{ maxWidth: 220, maxHeight: 220, display: "block" }} />
				</div>
			)}

			<h2>{product.name}</h2>
			<p>{product.description}</p>
			<h3>{product.price} ₽</h3>
			<button onClick={() => addToCart(product)}>Добавить</button>
		</div>
	);
}