import axios from "axios";

const apiGatewayBaseUrl = import.meta.env.VITE_API_GATEWAY || "/api";

const gatewayApi = axios.create({
  baseURL: apiGatewayBaseUrl,
  headers: { "Content-Type": "application/json" },
});

function buildBasicHeader(email, password) {
  try {
    const token = btoa(`${email}:${password}`);
    return `Basic ${token}`;
  } catch (e) {
    return `Basic ${Buffer.from(`${email}:${password}`).toString("base64")}`;
  }
}

function getStoredAuth() {
  try {
    return localStorage.getItem("token");
  } catch (e) {
    return null;
  }
}

gatewayApi.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth) {
    config.headers = config.headers || {};
    config.headers.Authorization = auth;
  }
  return config;
});

export function getProductImageUrl(imageId) {
  if (!imageId) return null;
  return `/api/images/${imageId}`;
}

export async function fetchProducts() {
  const response = await gatewayApi.get("/api/products");
  return response.data;
}

export async function loginUser(email, password) {
  const auth = buildBasicHeader(email, password);
  const response = await gatewayApi.post(
    "/api/login",
    { email, password },
    {
      headers: {
        Authorization: auth,
      },
    }
  );
  return response.data;
}

export async function registerUser(name, email, password) {
  const auth = buildBasicHeader(email, password);
  const response = await gatewayApi.post(
    "/api/register",
    { name, email, password },
    {
      headers: {
        Authorization: auth,
      },
    }
  );
  return response.data;
}

export async function fetchOrders(userId) {
  if (!userId) {
    return [];
  }
  const response = await gatewayApi.get(`/api/orders/${userId}`);
  return response.data;
}

export async function createOrder(clientId, productInfos) {
  const response = await gatewayApi.post("/api/orders", {
    clientId,
    productInfos,
  });
  return response.data;
}
