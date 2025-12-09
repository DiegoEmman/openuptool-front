import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
} from "@mui/material";
import type { CreateWorkflowStateResponsibleInput } from "../../types/workflow";
import { workflowStateService } from "../../services/workflowService";

interface AddResponsibleDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    workflowStateId: string;
    projectId: string;
}

export function AddResponsibleDialog({
    open,
    onClose,
    onSuccess,
    workflowStateId,
}: AddResponsibleDialogProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState("");
    const [role, setRole] = useState("");

    const handleSubmit = async () => {
        if (!userEmail.trim()) {
            setError("Debe ingresar un correo electrónico");
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail.trim())) {
            setError("Ingrese un correo electrónico válido");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const input: CreateWorkflowStateResponsibleInput = {
                workflowStateId,
                userEmail: userEmail.trim(),
                role: role.trim() || undefined,
            };

            await workflowStateService.addResponsible(input);
            resetForm();
            onClose();
            onSuccess(); // Llamar onSuccess después de cerrar para refrescar
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al agregar responsable"
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setUserEmail("");
        setRole("");
        setError(null);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Agregar Responsable</DialogTitle>
            <DialogContent>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Box sx={{ mt: 1 }}>
                    <TextField
                        label="Correo Electrónico *"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        fullWidth
                        required
                        type="email"
                        sx={{ mb: 2 }}
                        helperText="Ingresa el correo del usuario miembro del proyecto"
                        placeholder="ej: usuario@example.com"
                    />

                    <TextField
                        label="Rol"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        fullWidth
                        placeholder="Ej: Revisor, Aprobador, QA Lead"
                        helperText="Opcional: Define el rol específico en este estado"
                    />

                    <Typography
                        variant="caption"
                        color="info.main"
                        sx={{ mt: 2, display: "block" }}
                    >
                        <strong>Tip:</strong> Usa el correo del usuario que
                        aparece en el tab "Equipo" del proyecto.
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        onClose();
                        resetForm();
                    }}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !userEmail.trim()}
                >
                    {loading ? "Agregando..." : "Agregar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
