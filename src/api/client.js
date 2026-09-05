// Base URL comes from an env var so the same code works against your local
// backend during development and your deployed backend in production —
// see .env.example. Anything prefixed VITE_ gets bundled into the client
// JS and is publicly visible, so never put secrets here (a base URL is
// fine; an API key would not be).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // DELETE routes return 204 No Content — there's no body to parse.
  let data = null;
  if (response.status !== 204) {
    data = await response.json().catch(() => null);
  }

  if (!response.ok) {
    const message = data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path, token) => request(path, { method: "GET", token }),
  post: (path, body, token) => request(path, { method: "POST", body, token }),
  patch: (path, body, token) => request(path, { method: "PATCH", body, token }),
  delete: (path, token) => request(path, { method: "DELETE", token }),
};