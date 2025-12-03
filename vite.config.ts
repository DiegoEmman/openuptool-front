import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
        proxy: {
            // Ignorar solicitudes de Chrome DevTools
            "/.well-known": {
                target: "http://localhost:5173",
                bypass: () => "", // Retorna vacío para ignorar
            },
        },
    },
});

