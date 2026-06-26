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

function getToken() {
  return localStorage.getItem("token");
}

function addAuthHeader(config) {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

gatewayApi.interceptors.request.use(addAuthHeader);
orderApi.interceptors.request.use(addAuthHeader);

export function getProductImageUrl(imageId) {
  if (!imageId) return null;
  return `${orderServiceBaseUrl}/images/${imageId}`;
}

export async function fetchProducts() {
  const response = await orderApi.get("/products");
  return response.data;
}

export async function loginUser(email, password) {
  const response = await gatewayApi.post("/api/login", { email, password });
  return response.data;
}

export async function registerUser(name, email, password) {
  const response = await gatewayApi.post("/api/register", { name, email, password });
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
