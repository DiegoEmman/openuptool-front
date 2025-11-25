import React, { useState } from 'react';
import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import type { ArtifactType, PhaseCode } from '../../types/artifact';
import { artifactService } from '../../services/artifactService';

interface Props {
    projectId: string;
    phaseId: PhaseCode;
    types: ArtifactType[];
    onCreated(): void;
    onCancel(): void;
}

export function ArtifactCreateForm({ projectId, phaseId, types, onCreated, onCancel }: Props) {
    const [artifactTypeId, setArtifactTypeId] = useState(types[0]?.id || '');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');

    function submit() {
        if (!artifactTypeId || !title.trim()) return;
        artifactService.createArtifact({
            projectId,
            phaseId,
            artifactTypeId,
            title,
            description,
            author,
        });
        onCreated();
    }

    return (
        <Box mb={2}>
            <Typography variant="subtitle1" mb={1}>
                Nuevo Artefacto
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <TextField
                        select
                        label="Tipo"
                        fullWidth
                        value={artifactTypeId}
                        onChange={(e) => setArtifactTypeId(e.target.value)}
                    >
                        {types.map((t) => (
                            <MenuItem key={t.id} value={t.id}>
                                {t.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={8}>
                    <TextField
                        label="Título"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Descripción"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Autor"
                        fullWidth
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={submit} sx={{ mr: 2 }}>
                        Crear
                    </Button>
                    <Button onClick={onCancel}>Cancelar</Button>
                </Grid>
            </Grid>
        </Box>
    );
}
