export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://mockable.onrender.com");

