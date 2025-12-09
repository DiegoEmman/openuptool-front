import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Alert,
    CircularProgress,
} from "@mui/material";
import type {
    Iteration,
    UpdateIterationCapacityInput,
} from "../../types/iteration";

interface IterationCapacityFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (iteration: Iteration) => void;
    iteration: Iteration;
}

export function IterationCapacityForm({
    open,
    onClose,
    onSuccess,
    iteration,
}: IterationCapacityFormProps) {
    const [formData, setFormData] = useState<UpdateIterationCapacityInput>({
        plannedCapacityHours: iteration.plannedCapacityHours,
        teamSize: iteration.teamSize,
        plannedPoints: iteration.plannedPoints,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setFormData({
                plannedCapacityHours: iteration.plannedCapacityHours,
                teamSize: iteration.teamSize,
                plannedPoints: iteration.plannedPoints,
            });
            setError(null);
        }
    }, [open, iteration]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { iterationService } = await import(
                "../../services/iterationService"
            );
            const updated = await iterationService.updateCapacity(
                iteration.projectId,
                iteration.id,
                formData
            );
            onSuccess(updated);
            onClose();
        } catch (err) {
            console.error("Error updating capacity:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al actualizar capacidad"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    Configurar Capacidad - {iteration.name}
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        {error && <Alert severity="error">{error}</Alert>}

                        <Alert severity="info">
                            Define la capacidad del equipo para esta iteración.
                            Esta información se usará para calcular la velocidad
                            y hacer recomendaciones.
                        </Alert>

                        <TextField
                            label="Horas de Capacidad Planeadas"
                            type="number"
                            value={formData.plannedCapacityHours ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    plannedCapacityHours: e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined,
                                })
                            }
                            helperText="Total de horas disponibles del equipo (ejemplo: 160 horas)"
                            inputProps={{ min: 0 }}
                        />

                        <TextField
                            label="Tamaño del Equipo"
                            type="number"
                            value={formData.teamSize ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    teamSize: e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined,
                                })
                            }
                            helperText="Número de miembros del equipo"
                            inputProps={{ min: 1 }}
                        />

                        <TextField
                            label="Puntos Planeados"
                            type="number"
                            value={formData.plannedPoints ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    plannedPoints: e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined,
                                })
                            }
                            helperText="Puntos de historia que se planea completar"
                            inputProps={{ min: 0 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={
                            loading ? <CircularProgress size={20} /> : null
                        }
                    >
                        Guardar Capacidad
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
