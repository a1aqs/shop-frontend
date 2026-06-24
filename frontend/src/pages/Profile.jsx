import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const { user, fetchOrders } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchOrders().then((res) => {
      if (mounted) setOrders(res);
    });
    return () => (mounted = false);
  }, [fetchOrders]);

  return (
    <div className="profile-page">
      <h1>Личный кабинет</h1>

      <p>
        Привет, <strong>{user?.name}</strong>
      </p>

      <h2>Заказы</h2>

      {orders.length === 0 ? (
        <p>Заказов нет</p>
      ) : (
        <ul className="orders-list">
          {orders.map((o) => (
            <li key={o.id} className="order-item">
              <div>
                Заказ <strong>#{o.id}</strong>
              </div>
              <div>Дата: {o.date}</div>
              <div>Сумма: {o.total} ₽</div>
              <div>
                Статус: <span className={`status ${o.status.toLowerCase()}`}>{o.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
