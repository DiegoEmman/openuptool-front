import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { planService } from "../../services/planService";
import type {
    CreateInitialPlanInput,
    PhaseScheduleItem,
} from "../../types/plan";

const DEFAULT_PHASES: PhaseScheduleItem[] = [
    {
        phaseName: "INCEPTION",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
    },
    { phaseName: "ELABORATION", startDate: "", endDate: "" },
    { phaseName: "CONSTRUCTION", startDate: "", endDate: "" },
    { phaseName: "TRANSITION", startDate: "", endDate: "" },
];

interface Props {
    projectId: string;
    onCreated(): void;
    onCancel(): void;
}

export function PlanForm({ projectId, onCreated, onCancel }: Props) {
    const [objectives, setObjectives] = useState("");
    const [scope, setScope] = useState("");
    const [observations, setObservations] = useState("");
    const [schedule, setSchedule] =
        useState<PhaseScheduleItem[]>(DEFAULT_PHASES);
    const [milestones, setMilestones] = useState<
        { name: string; date: string; description?: string }[]
    >([]);
    const [msDraft, setMsDraft] = useState({
        name: "",
        date: "",
        description: "",
    });

    function updatePhase(
        idx: number,
        field: keyof PhaseScheduleItem,
        value: string
    ) {
        setSchedule((s) =>
            s.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
        );
    }

    function addMilestone() {
        if (!msDraft.name || !msDraft.date) return;
        setMilestones((m) => [
            ...m,
            {
                name: msDraft.name,
                date: msDraft.date,
                description: msDraft.description,
            },
        ]);
        setMsDraft({ name: "", date: "", description: "" });
    }

    async function submit() {
        const input: CreateInitialPlanInput = {
            objectives,
            scope,
            observations,
            initialSchedule: schedule,
            milestones: milestones.map((m) => ({
                name: m.name,
                date: m.date,
                description: m.description,
            })),
        };
        try {
            await planService.createInitialPlan(projectId, input);
            onCreated();
        } catch (error) {
            console.error("Error creating plan:", error);
            alert(
                "Error al crear el plan: " +
                    (error instanceof Error
                        ? error.message
                        : "Error desconocido")
            );
        }
    }

    return (
        <Box my={3}>
            <Typography variant="h6" mb={2}>
                Crear Plan Inicial
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Objetivos"
                        fullWidth
                        multiline
                        minRows={2}
                        value={objectives}
                        onChange={(e) => setObjectives(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Alcance"
                        fullWidth
                        multiline
                        minRows={2}
                        value={scope}
                        onChange={(e) => setScope(e.target.value)}
                    />
                </Grid>
                {schedule.map((p, idx) => (
                    <Grid item xs={12} md={6} key={p.phaseName}>
                        <Typography variant="subtitle2" mb={1}>
                            {p.phaseName}
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Responsable"
                                    fullWidth
                                    value={p.responsible || ""}
                                    onChange={(e) =>
                                        updatePhase(
                                            idx,
                                            "responsible",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nombre del responsable de la fase"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type="date"
                                    label="Inicio"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={p.startDate}
                                    onChange={(e) =>
                                        updatePhase(
                                            idx,
                                            "startDate",
                                            e.target.value
                                        )
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type="date"
                                    label="Fin"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={p.endDate}
                                    onChange={(e) =>
                                        updatePhase(
                                            idx,
                                            "endDate",
                                            e.target.value
                                        )
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Typography variant="subtitle2">Hitos</Typography>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={3}>
                            <TextField
                                label="Nombre"
                                fullWidth
                                value={msDraft.name}
                                onChange={(e) =>
                                    setMsDraft((d) => ({
                                        ...d,
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                type="date"
                                label="Fecha"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={msDraft.date}
                                onChange={(e) =>
                                    setMsDraft((d) => ({
                                        ...d,
                                        date: e.target.value,
                                    }))
                                }
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Descripción"
                                fullWidth
                                value={msDraft.description}
                                onChange={(e) =>
                                    setMsDraft((d) => ({
                                        ...d,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button onClick={addMilestone}>Agregar</Button>
                        </Grid>
                    </Grid>
                    <Box mt={1}>
                        {milestones.map((m) => (
                            <Typography key={m.name}>
                                {m.name} - {m.date}
                            </Typography>
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Observaciones"
                        fullWidth
                        multiline
                        minRows={2}
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={submit} sx={{ mr: 2 }}>
                        Guardar Plan
                    </Button>
                    <Button onClick={onCancel}>Cancelar</Button>
                </Grid>
            </Grid>
        </Box>
    );
}
