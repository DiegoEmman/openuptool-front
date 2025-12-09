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
    Typography,
} from "@mui/material";
import type {
    Iteration,
    UpdateIterationVelocityInput,
} from "../../types/iteration";

interface IterationVelocityFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (iteration: Iteration) => void;
    iteration: Iteration;
}

export function IterationVelocityForm({
    open,
    onClose,
    onSuccess,
    iteration,
}: IterationVelocityFormProps) {
    const [formData, setFormData] = useState<UpdateIterationVelocityInput>({
        plannedPoints: iteration.plannedPoints,
        completedPoints: iteration.completedPoints ?? 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setFormData({
                plannedPoints: iteration.plannedPoints,
                completedPoints: iteration.completedPoints ?? 0,
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
            const updated = await iterationService.updateVelocity(
                iteration.projectId,
                iteration.id,
                formData
            );
            onSuccess(updated);
            onClose();
        } catch (err) {
            console.error("Error updating velocity:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al registrar velocidad"
            );
        } finally {
            setLoading(false);
        }
    };

    const accuracy =
        formData.plannedPoints && formData.completedPoints
            ? (
                  (formData.completedPoints / formData.plannedPoints) *
                  100
              ).toFixed(0)
            : null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    Registrar Velocidad - {iteration.name}
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
                            Registra los puntos completados al finalizar la
                            iteración. Esta información se usará para calcular
                            la velocidad del equipo.
                        </Alert>

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
                            helperText="Puntos que se planearon completar"
                            inputProps={{ min: 0 }}
                        />

                        <TextField
                            label="Puntos Completados"
                            type="number"
                            required
                            value={formData.completedPoints}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    completedPoints:
                                        parseInt(e.target.value) || 0,
                                })
                            }
                            helperText="Puntos realmente completados en esta iteración"
                            inputProps={{ min: 0 }}
                        />

                        {accuracy && (
                            <Alert
                                severity={
                                    parseInt(accuracy) >= 90
                                        ? "success"
                                        : parseInt(accuracy) >= 70
                                          ? "warning"
                                          : "info"
                                }
                            >
                                <Typography variant="body2">
                                    <strong>
                                        Precisión de estimación: {accuracy}%
                                    </strong>
                                    <br />
                                    {parseInt(accuracy) >= 90 &&
                                        "¡Excelente! Las estimaciones fueron muy precisas."}
                                    {parseInt(accuracy) >= 70 &&
                                        parseInt(accuracy) < 90 &&
                                        "Buena estimación, pero hay margen de mejora."}
                                    {parseInt(accuracy) < 70 &&
                                        "Considera revisar el proceso de estimación del equipo."}
                                </Typography>
                            </Alert>
                        )}
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
                        Registrar Velocidad
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
