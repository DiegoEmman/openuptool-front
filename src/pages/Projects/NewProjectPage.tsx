import React, { useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Container,
    Grid,
    Stack,
    TextField,
    Typography,
    Breadcrumbs,
} from '@mui/material';
import { Link } from 'react-router';
import { projectService } from '../../services/projectService';
import { useNavigate } from 'react-router';
import type { CreateProjectInput } from '../../types/project';

export function NewProjectPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<CreateProjectInput>({
        name: '',
        identifier: '',
        startDate: new Date().toISOString().split('T')[0],
        owner: '',
        description: '',
        tags: [],
    });
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate(): boolean {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'Nombre requerido';
        if (!form.identifier.trim()) e.identifier = 'Identificador requerido';
        if (!form.startDate) e.startDate = 'Fecha inicio requerida';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function submit() {
        if (!validate()) return;
        projectService.createProject(form);
        navigate('/projects');
    }

    function addTag() {
        const t = tagInput.trim();
        if (t && !form.tags.includes(t)) {
            setForm((f) => ({ ...f, tags: [...f.tags, t] }));
            setTagInput('');
        }
    }

    function removeTag(tag: string) {
        setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
    }

    return (
        <Container sx={{ py: 4 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link to="/projects" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Proyectos
                </Link>
                <Typography color="text.primary">Nuevo Proyecto</Typography>
            </Breadcrumbs>
            <Typography variant="h4" mb={3}>
                Nuevo Proyecto
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Nombre"
                        fullWidth
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Identificador"
                        fullWidth
                        value={form.identifier}
                        onChange={(e) => setForm((f) => ({ ...f, identifier: e.target.value }))}
                        error={!!errors.identifier}
                        helperText={errors.identifier}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        type="date"
                        label="Fecha Inicio"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={form.startDate}
                        onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <TextField
                        label="Responsable"
                        fullWidth
                        value={form.owner}
                        onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Descripción"
                        multiline
                        minRows={3}
                        fullWidth
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" gap={2} alignItems="center">
                        <TextField
                            label="Tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                            size="small"
                        />
                        <Button variant="outlined" onClick={addTag}>
                            Agregar Tag
                        </Button>
                    </Stack>
                    <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                        {form.tags.map((t) => (
                            <Chip
                                key={t}
                                label={t}
                                onDelete={() =>
                                    setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))
                                }
                            />
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" gap={2}>
                        <Button variant="contained" onClick={submit}>
                            Guardar
                        </Button>
                        <Button variant="text" onClick={() => navigate(-1)}>
                            Cancelar
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}

export default NewProjectPage;
