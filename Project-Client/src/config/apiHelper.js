import { API_BASE } from "./api";

export const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const headers = {};
  if (user?.token) headers.Authorization = `Bearer ${user.token}`;
  return headers;
};

export const parseError = (json) => json?.error || json?.message || "Request failed";

export async function apiRequest(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = { ...getAuthHeaders(), ...options.headers };
  const config = {
    credentials: "include",
    ...options,
    headers,
  };
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(options.body);
  }
  const res = await fetch(url, config);
  let json = null;
  const text = await res.text();
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error("Invalid response from server");
    }
  }
  if (!res.ok) {
    throw new Error(parseError(json));
  }
  if (json && json.success === false) {
    throw new Error(parseError(json));
  }
  if (json && json.success === true && "data" in json) {
    return json.data;
  }
  return json;
}
