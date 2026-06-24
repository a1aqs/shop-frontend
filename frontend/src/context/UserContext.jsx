import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: "Иван Иванов",
      orders: [
        { id: "1001", date: "2026-06-01", status: "DELIVERED", total: 1200 },
        { id: "1002", date: "2026-06-10", status: "PROCESSING", total: 4500 },
      ],
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (e) {}
  }, [user]);

  function fetchOrders() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(user.orders || []), 200);
    });
  }

  return (
    <UserContext.Provider value={{ user, setUser, fetchOrders }}>
      {children}
    </UserContext.Provider>
  );
}
