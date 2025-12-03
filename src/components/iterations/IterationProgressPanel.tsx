import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Grid,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type {
    IterationSummary,
    CreateIterationProgressInput,
} from "../../types/iterationProgress";

interface IterationProgressPanelProps {
    summary: IterationSummary;
    onProgressCreate: (input: CreateIterationProgressInput) => Promise<void>;
}

export function IterationProgressPanel({
    summary,
    onProgressCreate,
}: IterationProgressPanelProps) {
    const [showDialog, setShowDialog] = useState(false);

    // Usar latestProgress si existe para pre-llenar el formulario
    const currentProgress = summary.latestProgress || {
        completionPercentage: summary.completionPercentage || 0,
        totalTasks: summary.totalTasks || 0,
        completedTasks: summary.completedTasks || 0,
        inProgressTasks: summary.inProgressTasks || 0,
        blockedTasks: summary.blockedTasks || 0,
    };

    const [formData, setFormData] = useState<CreateIterationProgressInput>({
        recordDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD para el input
        completionPercentage: currentProgress.completionPercentage,
        totalTasks: currentProgress.totalTasks,
        completedTasks: currentProgress.completedTasks,
        inProgressTasks: currentProgress.inProgressTasks,
        blockedTasks: currentProgress.blockedTasks,
        blockers: "",
        observations: "",
    });

    const handleCreate = async () => {
        try {
            // Convertir la fecha a ISO DateTime para el backend
            const dataToSend = {
                ...formData,
                recordDate: new Date(formData.recordDate).toISOString(),
            };

            console.log("📝 Enviando registro de progreso:", dataToSend);
            await onProgressCreate(dataToSend);
            console.log("✅ Registro creado exitosamente");
            setShowDialog(false);
            setFormData({
                recordDate: new Date().toISOString().split("T")[0],
                completionPercentage: currentProgress.completionPercentage,
                totalTasks: currentProgress.totalTasks,
                completedTasks: currentProgress.completedTasks,
                inProgressTasks: currentProgress.inProgressTasks,
                blockedTasks: currentProgress.blockedTasks,
                blockers: "",
                observations: "",
            });
        } catch (error) {
            console.error("❌ Error al crear registro:", error);
            alert("Error al registrar el avance. Por favor intenta de nuevo.");
        }
    };

    const getStatusColor = (
        status: string
    ): "default" | "info" | "success" | "warning" | "error" => {
        switch (status.toLowerCase()) {
            case "completed":
            case "completada":
            case "finalizada":
                return "success";
            case "in progress":
            case "en curso":
                return "info";
            case "not started":
            case "no iniciada":
            case "planeada":
                return "default";
            case "delayed":
            case "retrasada":
                return "warning";
            default:
                return "default";
        }
    };

    // Calcular días
    const startDate = new Date(summary.startDate);
    const endDate = new Date(summary.endDate);
    const today = new Date();
    const totalDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const elapsedDays = Math.max(
        0,
        Math.ceil(
            (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
    );
    const remainingDays = Math.max(
        0,
        Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    );

    return (
        <Box>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                        <Box>
                            <Typography variant="h6">
                                {summary.iterationName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {startDate.toLocaleDateString("es-ES")} -{" "}
                                {endDate.toLocaleDateString("es-ES")}
                            </Typography>
                        </Box>
                        <Chip
                            label={summary.status}
                            color={getStatusColor(summary.status)}
                        />
                    </Stack>

                    <Box mb={2}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            mb={1}
                        >
                            <Typography variant="body2">
                                Progreso:{" "}
                                {currentProgress.completionPercentage.toFixed(
                                    1
                                )}
                                %
                            </Typography>
                            <Typography variant="body2">
                                {currentProgress.completedTasks} /{" "}
                                {currentProgress.totalTasks} tareas
                            </Typography>
                        </Stack>
                        <LinearProgress
                            variant="determinate"
                            value={currentProgress.completionPercentage}
                            sx={{ height: 8, borderRadius: 1 }}
                        />
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Días transcurridos
                            </Typography>
                            <Typography variant="h6">{elapsedDays}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Días restantes
                            </Typography>
                            <Typography variant="h6">
                                {remainingDays}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Total de días
                            </Typography>
                            <Typography variant="h6">{totalDays}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                En Progreso
                            </Typography>
                            <Typography variant="h6" color="info.main">
                                {currentProgress.inProgressTasks}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Bloqueadas
                            </Typography>
                            <Typography variant="h6" color="error.main">
                                {currentProgress.blockedTasks}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Pendientes
                            </Typography>
                            <Typography variant="h6">
                                {currentProgress.totalTasks -
                                    currentProgress.completedTasks -
                                    currentProgress.inProgressTasks}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                        <Typography variant="h6">Registrar Avance</Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            size="small"
                            onClick={() => setShowDialog(true)}
                        >
                            Nuevo Registro
                        </Button>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                        {summary.latestProgress
                            ? `Último registro: ${new Date(summary.latestProgress.recordDate).toLocaleDateString("es-ES")}`
                            : "No hay registros de progreso aún"}
                    </Typography>
                </CardContent>
            </Card>

            {/* Create Progress Dialog */}
            <Dialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Registrar Avance de Iteración</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Fecha"
                            type="date"
                            fullWidth
                            required
                            value={formData.recordDate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    recordDate: e.target.value,
                                })
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Porcentaje de Completado"
                            type="number"
                            fullWidth
                            required
                            value={formData.completionPercentage}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    completionPercentage: Number(
                                        e.target.value
                                    ),
                                })
                            }
                            inputProps={{ min: 0, max: 100, step: 0.1 }}
                        />
                        <TextField
                            label="Total de Tareas"
                            type="number"
                            fullWidth
                            required
                            value={formData.totalTasks}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    totalTasks: Number(e.target.value),
                                })
                            }
                        />
                        <TextField
                            label="Tareas Completadas"
                            type="number"
                            fullWidth
                            required
                            value={formData.completedTasks}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    completedTasks: Number(e.target.value),
                                })
                            }
                        />
                        <TextField
                            label="Tareas En Progreso"
                            type="number"
                            fullWidth
                            value={formData.inProgressTasks}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    inProgressTasks: Number(e.target.value),
                                })
                            }
                        />
                        <TextField
                            label="Tareas Bloqueadas"
                            type="number"
                            fullWidth
                            value={formData.blockedTasks}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    blockedTasks: Number(e.target.value),
                                })
                            }
                        />
                        <TextField
                            label="Bloqueos"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.blockers || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    blockers: e.target.value,
                                })
                            }
                            placeholder="Describe los bloqueos actuales"
                        />
                        <TextField
                            label="Observaciones"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.observations || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    observations: e.target.value,
                                })
                            }
                            placeholder="Comentarios sobre el avance, hitos alcanzados, etc."
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDialog(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleCreate} variant="contained">
                        Registrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
