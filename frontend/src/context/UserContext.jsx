import { createContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, fetchOrders as apiFetchOrders } from "../api.js";

export const UserContext = createContext();

const DEFAULT_USER = {
  id: null,
  name: "Гость",
  email: "",
  role: "",
  token: null,
  isGuest: true,
};

function loadSavedUser() {
  try {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_USER, ...parsed, isGuest: !parsed?.id };
    }
  } catch (e) {}
  return DEFAULT_USER;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(loadSavedUser);

  useEffect(() => {
    try {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.token) {
        localStorage.setItem("token", user.token);
      } else {
        localStorage.removeItem("token");
      }
    } catch (e) {}
  }, [user]);

  const buildUser = (data, fallbackName, fallbackEmail) => {
    const token = data?.token ?? null;
    const userData = data?.user ?? null;

    if (userData) {
      return { ...DEFAULT_USER, ...userData, token, isGuest: false };
    }

    if (token) {
      return {
        ...DEFAULT_USER,
        name: fallbackName || fallbackEmail || "Пользователь",
        email: fallbackEmail || "",
        token,
        isGuest: false,
      };
    }

    return {
      ...DEFAULT_USER,
      name: fallbackName || fallbackEmail || "Пользователь",
      email: fallbackEmail || "",
      token: null,
      isGuest: false,
    };
  };

  const login = useCallback(async (email, password) => {
    try {
      const data = await loginUser(email, password);
      const userPayload = buildUser(data, null, email);
      // ensure token contains Basic header so interceptor can attach it
      try {
        const basic = typeof btoa === "function" ? `Basic ${btoa(`${email}:${password}`)}` : `Basic ${Buffer.from(`${email}:${password}`).toString("base64")}`;
        userPayload.token = data?.token ?? basic;
      } catch (e) {
        userPayload.token = data?.token ?? null;
      }
      setUser(userPayload);
      return userPayload;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Ошибка входа";
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const data = await registerUser(name, email, password);
      const userPayload = buildUser(data, name, email);
      try {
        const basic = typeof btoa === "function" ? `Basic ${btoa(`${email}:${password}`)}` : `Basic ${Buffer.from(`${email}:${password}`).toString("base64")}`;
        userPayload.token = data?.token ?? basic;
      } catch (e) {
        userPayload.token = data?.token ?? null;
      }
      setUser(userPayload);
      return userPayload;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Ошибка регистрации";
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(DEFAULT_USER);
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) {
      return [];
    }
    const orders = await apiFetchOrders();
    return orders.filter((order) => order.clientId === user.id);
  }, [user?.id]);

  return (
    <UserContext.Provider value={{ user, setUser, login, register, logout, fetchOrders }}>
      {children}
    </UserContext.Provider>
  );
}
