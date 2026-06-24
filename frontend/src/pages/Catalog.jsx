import ProductCard from "../components/ProductCard";
import iphoneImg from "../assets/iphone.jpg";
import macImg from "../assets/MacBookPro.jpg";
import sonyImg from "../assets/SonyHeadphones.jpg";
import gamingImg from "../assets/GamingPC.jpg";

export default function Catalog() {
  const products = [
    { id: 1, name: "iPhone 15", description: "Смартфон Apple", price: 90000, image: iphoneImg },
    { id: 2, name: "MacBook Pro", description: "Ноутбук Apple", price: 150000, image: macImg },
    { id: 3, name: "Sony Headphones", description: "Беспроводные наушники", price: 25000, image: sonyImg },
    { id: 4, name: "Gaming PC", description: "Игровой компьютер", price: 120000, image: gamingImg },
  ];

  return (
    <div>
      <h1>Каталог товаров</h1>

      <div className="products">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
