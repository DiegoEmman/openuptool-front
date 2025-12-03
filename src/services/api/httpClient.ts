import { ENV } from "../../config/environment";

// Cliente HTTP básico con configuración de base URL
export async function httpClient<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const fullUrl = url.startsWith("http") ? url : `${ENV.API_BASE_URL}${url}`;

    console.log(`🌐 [httpClient] Fetching: ${fullUrl}`);

    // Obtener token de autenticación (solo en el navegador)
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("openuptool_token")
            : null;

    console.log(`🔑 [httpClient] Token exists: ${!!token}`);

    const defaultOptions: RequestInit = {
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options?.headers,
        },
        ...options,
    };

    // Agregar timeout de 30 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
        const res = await fetch(fullUrl, {
            ...defaultOptions,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log(`📡 [httpClient] Response status: ${res.status}`);

        if (!res.ok) {
            // Si es 401, limpiar token y redirigir al login (solo en el navegador)
            if (res.status === 401 && typeof window !== "undefined") {
                localStorage.removeItem("openuptool_token");
                localStorage.removeItem("openuptool_user");
                window.location.href = "/login";
            }

            let errorMessage = `HTTP Error ${res.status}`;
            try {
                const errorData = await res.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // Si no hay JSON, usar el mensaje por defecto
            }
            throw new Error(errorMessage);
        }

        // Si es 204 No Content, retornar objeto vacío
        if (res.status === 204) {
            return {} as T;
        }

        const data = await res.json();
        console.log(`✅ [httpClient] Success:`, data);
        return data as T;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === "AbortError") {
            console.error(`⏱️ [httpClient] Request timeout after 30s`);
            throw new Error(
                "La petición tardó demasiado tiempo. Por favor, intenta de nuevo."
            );
        }

        console.error(`❌ [httpClient] Request failed:`, error);
        throw error;
    }
}
