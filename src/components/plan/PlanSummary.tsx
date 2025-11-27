import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Stack,
    Box,
    Button,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import type { ProjectPlan } from "../../types/plan";
import { exportPlanToPDF } from "../../utils/exportPlan";

function formatDate(dateString: string | undefined): string {
    if (!dateString) return "?";
    // Extraer solo la parte de la fecha (YYYY-MM-DD)
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
}

export function PlanSummary({
    plan,
    projectName,
}: {
    plan: ProjectPlan;
    projectName?: string;
}) {
    return (
        <Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h6">Plan del Proyecto</Typography>
                <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() =>
                        exportPlanToPDF(plan, projectName || "Proyecto")
                    }
                >
                    Exportar a PDF
                </Button>
            </Box>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Objetivos</Typography>
                            <Typography whiteSpace="pre-line">
                                {plan.objectives}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Alcance</Typography>
                            <Typography whiteSpace="pre-line">
                                {plan.scope}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" mb={1}>
                                Cronograma Inicial
                            </Typography>
                            <Stack spacing={1}>
                                {plan.initialSchedule.map((s) => (
                                    <Box key={s.phaseName}>
                                        <Chip
                                            label={s.phaseName}
                                            color="primary"
                                            size="small"
                                        />
                                        <Typography component="span" ml={1}>
                                            {formatDate(s.startDate)} -{" "}
                                            {formatDate(s.endDate)}
                                            {s.responsible && (
                                                <Typography
                                                    component="span"
                                                    ml={1}
                                                    color="text.secondary"
                                                >
                                                    (Resp: {s.responsible})
                                                </Typography>
                                            )}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" mb={1}>
                                Hitos
                            </Typography>
                            {plan.milestones.map((m) => (
                                <Typography key={m.id}>
                                    {m.name} - {formatDate(m.date)}
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
                {plan.observations && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    Observaciones
                                </Typography>
                                <Typography whiteSpace="pre-line">
                                    {plan.observations}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
