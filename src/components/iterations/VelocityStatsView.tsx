import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    CircularProgress,
    Chip,
    Grid,
    Divider,
} from "@mui/material";
import {
    TrendingUp as TrendingUpIcon,
    Speed as SpeedIcon,
    Group as GroupIcon,
    EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import type { ProjectVelocityStats } from "../../types/iteration";
import { iterationService } from "../../services/iterationService";

interface VelocityStatsViewProps {
    projectId: string;
}

export function VelocityStatsView({ projectId }: VelocityStatsViewProps) {
    const [stats, setStats] = useState<ProjectVelocityStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStats();
    }, [projectId]);

    const loadStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await iterationService.getVelocityStats(projectId);
            setStats(data);
        } catch (err) {
            console.error("Error loading velocity stats:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al cargar estadísticas de velocidad"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!stats || stats.totalIterationsWithData === 0) {
        return (
            <Alert severity="info">
                No hay datos de velocidad disponibles. Comienza a registrar la
                capacidad y puntos completados en las iteraciones para ver
                estadísticas.
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Velocidad y Capacidad del Equipo
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
                <strong>Recomendación para planificación:</strong> Basado en el
                historial, se sugiere planificar{" "}
                <strong>
                    {Math.round(stats.suggestedPointsNextIteration)} puntos
                </strong>{" "}
                para la próxima iteración.
            </Alert>

            {/* Tarjetas de resumen */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                }}
                            >
                                <SpeedIcon color="primary" sx={{ mr: 1 }} />
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                >
                                    Velocidad Promedio
                                </Typography>
                            </Box>
                            <Typography variant="h4">
                                {stats.averageVelocity.toFixed(1)}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                puntos/iteración
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                }}
                            >
                                <TrendingUpIcon
                                    color="success"
                                    sx={{ mr: 1 }}
                                />
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                >
                                    Capacidad Promedio
                                </Typography>
                            </Box>
                            <Typography variant="h4">
                                {stats.averageCapacityHours.toFixed(0)}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                horas/iteración
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                }}
                            >
                                <GroupIcon color="info" sx={{ mr: 1 }} />
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                >
                                    Tamaño de Equipo
                                </Typography>
                            </Box>
                            <Typography variant="h4">
                                {stats.averageTeamSize.toFixed(1)}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                miembros promedio
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                }}
                            >
                                <TrophyIcon color="warning" sx={{ mr: 1 }} />
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                >
                                    Total Completado
                                </Typography>
                            </Box>
                            <Typography variant="h4">
                                {stats.totalCompletedPoints}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                puntos totales
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Historial de iteraciones */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                Historial de Iteraciones ({stats.totalIterationsWithData} de{" "}
                {stats.totalIterations})
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Iteración</TableCell>
                            <TableCell>Fase</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="right">Capacidad (hrs)</TableCell>
                            <TableCell align="right">Equipo</TableCell>
                            <TableCell align="right">Planeados</TableCell>
                            <TableCell align="right">Completados</TableCell>
                            <TableCell align="right">Puntos/Hora</TableCell>
                            <TableCell align="right">Puntos/Miembro</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stats.iterationHistory.map((iteration) => {
                            const accuracy =
                                iteration.plannedPoints &&
                                iteration.completedPoints
                                    ? (
                                          (iteration.completedPoints /
                                              iteration.plannedPoints) *
                                          100
                                      ).toFixed(0)
                                    : null;

                            return (
                                <TableRow key={iteration.iterationId}>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight="medium"
                                        >
                                            {iteration.iterationName}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {new Date(
                                                iteration.startDate
                                            ).toLocaleDateString()}{" "}
                                            -{" "}
                                            {new Date(
                                                iteration.endDate
                                            ).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={iteration.phase}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={iteration.status}
                                            size="small"
                                            color={
                                                iteration.status ===
                                                "Finalizada"
                                                    ? "success"
                                                    : iteration.status ===
                                                        "En curso"
                                                      ? "primary"
                                                      : "default"
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {iteration.plannedCapacityHours ?? "-"}
                                    </TableCell>
                                    <TableCell align="right">
                                        {iteration.teamSize ?? "-"}
                                    </TableCell>
                                    <TableCell align="right">
                                        {iteration.plannedPoints ?? "-"}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "flex-end",
                                                gap: 1,
                                            }}
                                        >
                                            <strong>
                                                {iteration.completedPoints ??
                                                    "-"}
                                            </strong>
                                            {accuracy && (
                                                <Chip
                                                    label={`${accuracy}%`}
                                                    size="small"
                                                    color={
                                                        parseInt(accuracy) >= 90
                                                            ? "success"
                                                            : parseInt(
                                                                    accuracy
                                                                ) >= 70
                                                              ? "warning"
                                                              : "error"
                                                    }
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        {iteration.velocityPerHour
                                            ? iteration.velocityPerHour.toFixed(
                                                  2
                                              )
                                            : "-"}
                                    </TableCell>
                                    <TableCell align="right">
                                        {iteration.pointsPerMember
                                            ? iteration.pointsPerMember.toFixed(
                                                  1
                                              )
                                            : "-"}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body2">
                    <strong>💡 Consejos de planificación:</strong>
                </Typography>
                <ul style={{ marginTop: 8, marginBottom: 0 }}>
                    <li>
                        Usa la velocidad promedio (
                        {stats.averageVelocity.toFixed(1)} puntos) como guía
                        para comprometer historias en la próxima iteración.
                    </li>
                    <li>
                        Considera la capacidad del equipo (
                        {stats.averageCapacityHours.toFixed(0)} horas) al
                        planificar el trabajo.
                    </li>
                    <li>
                        Revisa la precisión de estimaciones pasadas (%) para
                        mejorar futuras planificaciones.
                    </li>
                </ul>
            </Alert>
        </Box>
    );
}
