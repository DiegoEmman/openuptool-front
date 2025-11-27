import React, { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRoles,
}) => {
    const { isAuthenticated, isLoading, hasRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (
            !isLoading &&
            isAuthenticated &&
            requiredRoles &&
            requiredRoles.length > 0
        ) {
            if (!hasRole(requiredRoles)) {
                navigate("/", { replace: true });
            }
        }
    }, [isLoading, isAuthenticated, requiredRoles, hasRole, navigate]);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (requiredRoles && requiredRoles.length > 0) {
        if (!hasRole(requiredRoles)) {
            return null;
        }
    }

    return <>{children}</>;
};
