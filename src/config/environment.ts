// Centralización de variables de entorno y configuración.

export const ENV = {
    NODE_ENV: import.meta.env.MODE,
    API_BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
};
