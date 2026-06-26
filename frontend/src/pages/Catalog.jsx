import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { fetchProducts, getProductImageUrl } from "../api.js";
import iphoneImg from "../assets/iphone.jpg";
import macImg from "../assets/MacBookPro.jpg";
import sonyImg from "../assets/SonyHeadphones.jpg";
import gamingImg from "../assets/GamingPC.jpg";

const fallbackImages = {
  1: iphoneImg,
  2: macImg,
  3: sonyImg,
  4: gamingImg,
};

const demoProducts = [
  {
    id: 1,
    name: "iPhone 14",
    description: "Смартфон Apple iPhone 14, отличная камера и стильный дизайн.",
    price: 79999,
    amount: 12,
    image: iphoneImg,
  },
  {
    id: 2,
    name: "MacBook Pro",
    description: "Ноутбук Apple MacBook Pro для работы и творчества.",
    price: 169999,
    amount: 5,
    image: macImg,
  },
  {
    id: 3,
    name: "Sony Headphones",
    description: "Наушники Sony с шумоподавлением для музыки и звонков.",
    price: 12999,
    amount: 8,
    image: sonyImg,
  },
  {
    id: 4,
    name: "Gaming PC",
    description: "Мощный игровой ПК с высокой производительностью.",
    price: 139999,
    amount: 3,
    image: gamingImg,
  },
];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchProducts()
      .then((data) => {
        if (!mounted) return;
        const normalized = (data || []).map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.cost,
          amount: product.amount,
          image: getProductImageUrl(product.imageInfos?.[0]?.id) || fallbackImages[product.id],
        }));
        setProducts(normalized);
      })
      .catch((err) => {
        if (!mounted) return;
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          setProducts(demoProducts);
          setError("Каталог доступен в демонстрационном режиме. Войдите в систему, чтобы увидеть актуальные товары.");
        } else {
          setError("Не удалось загрузить товары. Попробуйте позже.");
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="catalog-page">
      <div className="section-title">
        <div>
          <h2>Shop All Products</h2>
          <p style={{ margin: "8px 0 0", color: "var(--text-muted)" }}>
            Быстрый доступ к лучшим товарам магазина — всё в одном месте.
          </p>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
      {isLoading ? (
        <p>Загрузка товаров...</p>
      ) : (
        <div className="products">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
