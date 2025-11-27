import { ENV } from "../../config/environment";

interface RequestOptions {
    params?: Record<string, string | number | boolean>;
    headers?: Record<string, string>;
}

class ApiClient {
    private getToken(): string | null {
        if (typeof window !== "undefined") {
            // Support both legacy and new token keys
            return (
                localStorage.getItem("openuptool_token") ||
                localStorage.getItem("token") ||
                null
            );
        }
        return null;
    }

    private buildUrl(
        path: string,
        params?: Record<string, string | number | boolean>
    ): string {
        // Safe string concatenation to preserve '/api' segment from base URL.
        const base = (ENV.API_BASE_URL || "").replace(/\/$/, "");
        const segment = path.replace(/^\//, "");
        let url = `${base}/${segment}`;

        if (params) {
            const query = new URLSearchParams(
                Object.entries(params).reduce<Record<string, string>>(
                    (acc, [k, v]) => {
                        acc[k] = String(v);
                        return acc;
                    },
                    {}
                )
            ).toString();
            url += `?${query}`;
        }

        return url;
    }

    private async request<T>(
        method: string,
        path: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T> {
        const token = this.getToken();
        const url = this.buildUrl(path, options?.params);

        const headers: Record<string, string> = {
            ...options?.headers,
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            method,
            headers,
        };

        if (body instanceof FormData) {
            // Let browser set correct multipart boundaries
            config.body = body;
        } else if (body) {
            // Set JSON Content-Type for regular JSON bodies
            headers["Content-Type"] = "application/json";
            config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);

        if (!response.ok) {
            if (response.status === 401 && typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }

            let errorMessage = `HTTP Error ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // Si no hay JSON, usar mensaje por defecto
            }
            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    async get<T>(path: string, options?: RequestOptions): Promise<T> {
        return this.request<T>("GET", path, undefined, options);
    }

    async post<T>(
        path: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>("POST", path, body, options);
    }

    async put<T>(
        path: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>("PUT", path, body, options);
    }

    async delete<T>(path: string, options?: RequestOptions): Promise<T> {
        return this.request<T>("DELETE", path, undefined, options);
    }
}

export const apiClient = new ApiClient();
