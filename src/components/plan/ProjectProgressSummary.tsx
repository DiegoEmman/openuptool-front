import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    LinearProgress,
    Chip,
    Button,
} from "@mui/material";
import { TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import { Link } from "react-router";
import type { IterationSummary } from "../../types/iterationProgress";

interface ProjectProgressSummaryProps {
    projectId: string;
    iterations: IterationSummary[];
}

export function ProjectProgressSummary({
    projectId,
    iterations,
}: ProjectProgressSummaryProps) {
    // Calcular estadísticas generales del proyecto
    const totalTasks = iterations.reduce(
        (sum, iter) => sum + iter.totalTasks,
        0
    );
    const completedTasks = iterations.reduce(
        (sum, iter) => sum + iter.completedTasks,
        0
    );
    const overallProgress =
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Obtener iteraciones activas (en curso)
    const activeIterations = iterations.filter(
        (iter) =>
            iter.status.toLowerCase() === "en curso" ||
            iter.status.toLowerCase() === "in progress"
    );

    // Calcular progreso por fase (estimado basado en iteraciones)
    const phases = ["INCEPTION", "ELABORATION", "CONSTRUCTION", "TRANSITION"];
    const iterationsPerPhase = Math.ceil(iterations.length / phases.length);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" mb={2}>
                    Resumen de Avance del Proyecto
                </Typography>

                {/* Progreso General */}
                <Box mb={3}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Progreso Total
                        </Typography>
                        <Typography variant="h6">
                            {overallProgress.toFixed(1)}%
                        </Typography>
                    </Stack>
                    <LinearProgress
                        variant="determinate"
                        value={overallProgress}
                        sx={{ height: 10, borderRadius: 1 }}
                    />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        mt={0.5}
                    >
                        {completedTasks} / {totalTasks} tareas completadas
                    </Typography>
                </Box>

                {/* Iteraciones Activas */}
                {activeIterations.length > 0 && (
                    <Box mb={3}>
                        <Typography variant="subtitle2" mb={1}>
                            Iteraciones Activas
                        </Typography>
                        <Stack spacing={1}>
                            {activeIterations.map((iter) => (
                                <Card
                                    key={iter.iterationId}
                                    variant="outlined"
                                    sx={{ p: 1.5 }}
                                >
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mb={1}
                                    >
                                        <Typography
                                            variant="body2"
                                            fontWeight="medium"
                                        >
                                            {iter.iterationName}
                                        </Typography>
                                        <Chip
                                            label={`${iter.completionPercentage}%`}
                                            size="small"
                                            color="info"
                                        />
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={iter.completionPercentage}
                                        sx={{ mb: 1 }}
                                    />
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {iter.completedTasks} /{" "}
                                            {iter.totalTasks} tareas
                                        </Typography>
                                        <Button
                                            component={Link}
                                            to={`/projects/${projectId}/iterations/${iter.iterationId}`}
                                            size="small"
                                            startIcon={<TrendingUpIcon />}
                                        >
                                            Ver Seguimiento
                                        </Button>
                                    </Stack>
                                </Card>
                            ))}
                        </Stack>
                    </Box>
                )}

                {/* Resumen de Iteraciones */}
                <Box>
                    <Typography variant="subtitle2" mb={1}>
                        Estado de Iteraciones
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Box>
                            <Typography variant="h4">
                                {iterations.length}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Total
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" color="success.main">
                                {
                                    iterations.filter(
                                        (i) =>
                                            i.status.toLowerCase() ===
                                                "completed" ||
                                            i.status.toLowerCase() ===
                                                "completada"
                                    ).length
                                }
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Completadas
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" color="info.main">
                                {activeIterations.length}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                En Curso
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4">
                                {
                                    iterations.filter(
                                        (i) =>
                                            i.status.toLowerCase() ===
                                                "not started" ||
                                            i.status.toLowerCase() ===
                                                "no iniciada"
                                    ).length
                                }
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Pendientes
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
