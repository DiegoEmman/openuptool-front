import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/authService";
import type { User, LoginRequest } from "../types/auth";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    hasRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay usuario guardado al cargar
        const savedUser = authService.getUser();
        if (savedUser && authService.isAuthenticated()) {
            setUser(savedUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginRequest) => {
        const response = await authService.login(credentials);
        setUser(response.user);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        window.location.href = "/login";
    };

    const hasRole = (role: string | string[]) => {
        if (!user) return false;

        if (Array.isArray(role)) {
            return role.includes(user.role);
        }

        return user.role === role;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                hasRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
