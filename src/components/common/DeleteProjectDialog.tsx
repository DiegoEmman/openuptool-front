import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

interface DeleteProjectDialogProps {
    open: boolean;
    projectName: string;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export function DeleteProjectDialog({
    open,
    projectName,
    onClose,
    onConfirm,
    loading = false,
}: DeleteProjectDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <WarningIcon color="error" />
                    <span>Confirmar eliminación permanente</span>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Esta acción es irreversible y eliminará permanentemente el
                    proyecto.
                </Alert>
                <Typography variant="body1" gutterBottom>
                    ¿Estás seguro de que deseas eliminar permanentemente el
                    proyecto <strong>"{projectName}"</strong>?
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Se eliminarán todos los datos asociados incluyendo:
                </Typography>
                <Box component="ul" sx={{ mt: 1 }}>
                    <Typography component="li" variant="body2">
                        Plan del proyecto
                    </Typography>
                    <Typography component="li" variant="body2">
                        Fases e iteraciones
                    </Typography>
                    <Typography component="li" variant="body2">
                        Artefactos y entregables
                    </Typography>
                    <Typography component="li" variant="body2">
                        Historial de auditoría
                    </Typography>
                    <Typography component="li" variant="body2">
                        Asignaciones de usuarios
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? "Eliminando..." : "Eliminar permanentemente"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
