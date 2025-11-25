import React, { useState } from 'react';
import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import type { CreateIterationInput } from '../../types/iteration';
import type { PhaseCode } from '../../types/artifact';
import { iterationService } from '../../services/iterationService';

const PHASES: PhaseCode[] = ['INCEPTION', 'ELABORATION', 'CONSTRUCTION', 'TRANSITION'];

interface Props {
    projectId: string;
    onCreated(): void;
    onCancel(): void;
}
export function IterationForm({ projectId, onCreated, onCancel }: Props) {
    const [form, setForm] = useState<CreateIterationInput>({
        name: '',
        objective: '',
        phase: 'INCEPTION',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    });

    function submit() {
        if (!form.name.trim()) return;
        iterationService.createIteration(projectId, form);
        onCreated();
    }

    return (
        <Box mb={2}>
            <Typography variant="subtitle1" mb={1}>
                Nueva Iteración
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Nombre"
                        fullWidth
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        select
                        label="Fase"
                        fullWidth
                        value={form.phase}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, phase: e.target.value as PhaseCode }))
                        }
                    >
                        {PHASES.map((p) => (
                            <MenuItem key={p} value={p}>
                                {p}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Objetivo"
                        fullWidth
                        value={form.objective}
                        onChange={(e) => setForm((f) => ({ ...f, objective: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        type="date"
                        label="Inicio"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={form.startDate}
                        onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        type="date"
                        label="Fin"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={form.endDate}
                        onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={submit} sx={{ mr: 2 }}>
                        Crear Iteración
                    </Button>
                    <Button onClick={onCancel}>Cancelar</Button>
                </Grid>
            </Grid>
        </Box>
    );
}
