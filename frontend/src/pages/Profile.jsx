import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, fetchOrders } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchOrders()
      .then((res) => {
        if (mounted) setOrders(res || []);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => (mounted = false);
  }, [fetchOrders]);

  if (user?.isGuest) {
    return (
      <div className="profile-page">
        <h1>Личный кабинет</h1>
        <p>Пожалуйста, войдите в аккаунт, чтобы просмотреть заказы.</p>
        <Link to="/auth">Перейти к авторизации</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>Личный кабинет</h1>

      <p>
        Привет, <strong>{user?.name}</strong>
      </p>

      <h2>Заказы</h2>
      {isLoading ? (
        <p>Загрузка заказов...</p>
      ) : orders.length === 0 ? (
        <p>Заказов нет</p>
      ) : (
        <ul className="orders-list">
          {orders.map((o) => (
            <li key={o.id} className="order-item">
              <div>
                Заказ <strong>#{o.id}</strong>
              </div>
              <div>Дата: {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</div>
              <div>Сумма: {o.totalCost ?? o.total ?? 0} ₽</div>
              <div>
                Статус: <span className={`status ${String(o.status || "").toLowerCase()}`}>{o.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
