import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    Container,
    Paper,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login({ email, password });
            navigate("/");
        } catch (err: any) {
            setError(
                err.message ||
                    "Error al iniciar sesión. Verifica tus credenciales."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Paper elevation={3} sx={{ width: "100%", p: 4 }}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            OpenUpTool
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Inicia sesión para continuar
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            fullWidth
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {isLoading
                                ? "Iniciando sesión..."
                                : "Iniciar Sesión"}
                        </Button>
                    </form>

                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            bgcolor: "grey.100",
                            borderRadius: 1,
                        }}
                    >
                        <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                        >
                            <strong>Usuario de prueba:</strong>
                        </Typography>
                        <Typography variant="caption" display="block">
                            Email: admin@openuptool.com
                        </Typography>
                        <Typography variant="caption" display="block">
                            Password: Admin123!
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
