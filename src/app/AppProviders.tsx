import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query/queryClient";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AuthProvider } from "../contexts/AuthContext";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#2563eb" },
        secondary: { main: "#9333ea" },
    },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </AuthProvider>
            </ThemeProvider>
        </React.StrictMode>
    );
}
