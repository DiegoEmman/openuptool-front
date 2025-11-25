import { ENV } from "../../config/environment";

// Cliente HTTP básico con configuración de base URL
export async function httpClient<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const fullUrl = url.startsWith("http") ? url : `${ENV.API_BASE_URL}${url}`;

    const defaultOptions: RequestInit = {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    };

    const res = await fetch(fullUrl, defaultOptions);

    if (!res.ok) {
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

    return (await res.json()) as T;
}
