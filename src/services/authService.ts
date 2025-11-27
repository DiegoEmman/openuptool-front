import { httpClient } from "./api/httpClient";
import type { LoginRequest, LoginResponse, User, Role } from "../types/auth";

const TOKEN_KEY = "openuptool_token";
const USER_KEY = "openuptool_user";

// Helper para verificar si estamos en el navegador
const isBrowser = typeof window !== "undefined";

export const authService = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await httpClient<LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });

        // Guardar token y usuario en localStorage (solo en el navegador)
        if (isBrowser) {
            localStorage.setItem(TOKEN_KEY, response.token);
            localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        }

        return response;
    },

    async register(data: any): Promise<User> {
        return httpClient<User>("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    logout(): void {
        if (isBrowser) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    },

    getToken(): string | null {
        if (!isBrowser) return null;
        return localStorage.getItem(TOKEN_KEY);
    },

    getUser(): User | null {
        if (!isBrowser) return null;
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    async getRoles(): Promise<Role[]> {
        return httpClient<Role[]>("/auth/roles");
    },

    hasRole(role: string | string[]): boolean {
        const user = this.getUser();
        if (!user) return false;

        if (Array.isArray(role)) {
            return role.includes(user.role);
        }

        return user.role === role;
    },
};
