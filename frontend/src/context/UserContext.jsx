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
    const data = await loginUser(email, password);
    const userPayload = buildUser(data, null, email);
    setUser(userPayload);
    return userPayload;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await registerUser(name, email, password);
    const userPayload = buildUser(data, name, email);
    setUser(userPayload);
    return userPayload;
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
