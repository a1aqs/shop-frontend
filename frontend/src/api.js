import axios from "axios";

const apiGatewayBaseUrl = import.meta.env.VITE_API_GATEWAY || "http://localhost:41303";
const orderServiceBaseUrl = import.meta.env.VITE_ORDER_SERVICE || "http://localhost:41301";

const gatewayApi = axios.create({
  baseURL: apiGatewayBaseUrl,
  headers: { "Content-Type": "application/json" },
});

const orderApi = axios.create({
  baseURL: orderServiceBaseUrl,
  headers: { "Content-Type": "application/json" },
});

function buildBasicHeader(email, password) {
  // Browser environment: use btoa to base64-encode credentials
  try {
    const token = btoa(`${email}:${password}`);
    return `Basic ${token}`;
  } catch (e) {
    // fallback for environments without btoa
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

// attach Authorization header (Basic) from localStorage for all requests
gatewayApi.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth) {
    config.headers = config.headers || {};
    config.headers.Authorization = auth;
  }
  return config;
});

orderApi.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth) {
    config.headers = config.headers || {};
    config.headers.Authorization = auth;
  }
  return config;
});

export function getProductImageUrl(imageId) {
  if (!imageId) return null;
  return `${orderServiceBaseUrl}/images/${imageId}`;
}

export async function fetchProducts() {
  const response = await orderApi.get("/products");
  return response.data;
}

export async function loginUser(email, password) {
  const auth = buildBasicHeader(email, password);
  const response = await gatewayApi.post(
    "/api/login",
    null,
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
    { name },
    {
      headers: {
        Authorization: auth,
      },
    }
  );
  return response.data;
}

export async function fetchOrders() {
  const response = await orderApi.get("/orders");
  return response.data;
}

export async function createOrder(clientId, productInfos) {
  const response = await orderApi.post("/orders", {
    clientId,
    productInfos,
  });
  return response.data;
}
