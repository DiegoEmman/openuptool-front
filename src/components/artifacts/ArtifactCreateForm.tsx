import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Button,
    Grid,
    MenuItem,
    TextField,
    Typography,
    FormControlLabel,
    Checkbox,
    Card,
    CardContent,
    Alert,
    Chip,
    Stack,
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    Description as DocIcon,
    Image as ImageIcon,
    Code as CodeIcon,
} from "@mui/icons-material";
import type { ArtifactType, PhaseCode } from "../../types/artifact";
import type { Workflow } from "../../types/workflow";
import { artifactService } from "../../services/artifactService";
import { workflowService } from "../../services/workflowService";

interface Props {
    projectId: string;
    phaseId: PhaseCode;
    types: ArtifactType[];
    onCreated(): void;
    onCancel(): void;
}

export function ArtifactCreateForm({
    projectId,
    phaseId,
    types,
    onCreated,
    onCancel,
}: Props) {
    const [artifactTypeId, setArtifactTypeId] = useState(types[0]?.id || "");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [isMandatory, setIsMandatory] = useState(false);
    const [contentText, setContentText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileCategory, setFileCategory] = useState<string>("");
    const [repositoryUrl, setRepositoryUrl] = useState("");
    const [workflowId, setWorkflowId] = useState<string>("");
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadWorkflows();
    }, [projectId]);

    const loadWorkflows = async () => {
        const data = await workflowService.getByProject(projectId);
        if (data) {
            setWorkflows(data);
        }
    };

    const selectedType = useMemo(
        () => types.find((t) => t.id === artifactTypeId),
        [types, artifactTypeId]
    );

    const needsFile =
        selectedType?.defaultFormat === "FILE" ||
        selectedType?.defaultFormat === "MIXED";
    const needsText =
        selectedType?.defaultFormat === "TEXT" ||
        selectedType?.defaultFormat === "MIXED";

    const getAcceptedFileTypes = (): string => {
        if (!fileCategory) return "*/*";

        switch (fileCategory) {
            case "DIAGRAM":
                return ".png,.jpg,.jpeg,.svg,.pdf";
            case "PROTOTYPE":
                return ".png,.jpg,.jpeg,.svg,.pdf,.fig";
            case "DOCUMENT":
                return ".pdf,.docx,.doc,.txt,.md";
            default:
                return "*/*";
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    async function submit() {
        if (!artifactTypeId || !title.trim()) {
            alert("El tipo y título son obligatorios");
            return;
        }

        if (needsFile && file && !fileCategory) {
            alert("Por favor selecciona una categoría para el archivo");
            return;
        }

        try {
            setSubmitting(true);
            await artifactService.createArtifact({
                projectId,
                phaseId,
                artifactTypeId,
                title,
                description,
                author,
                isMandatory,
                contentText: contentText || undefined,
                file: file || undefined,
                fileCategory: fileCategory || undefined,
                repositoryUrl: repositoryUrl || undefined,
                workflowId: workflowId || undefined,
            });
            onCreated();
        } catch (error) {
            console.error("Error creating artifact:", error);
            alert("Error al crear el artefacto");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" mb={2}>
                    Nuevo Artefacto
                </Typography>

                <Grid container spacing={2}>
                    {/* Tipo de artefacto */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            label="Tipo de Artefacto"
                            fullWidth
                            required
                            value={artifactTypeId}
                            onChange={(e) => setArtifactTypeId(e.target.value)}
                        >
                            {types.map((t) => (
                                <MenuItem key={t.id} value={t.id}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                    >
                                        <span>{t.name}</span>
                                        {t.isMandatory && (
                                            <Chip
                                                label="Obligatorio"
                                                size="small"
                                                color="error"
                                            />
                                        )}
                                    </Stack>
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Título */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Título"
                            fullWidth
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Modelo de Casos de Uso v1.0"
                        />
                    </Grid>

                    {/* Descripción */}
                    <Grid item xs={12}>
                        <TextField
                            label="Descripción"
                            fullWidth
                            multiline
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe brevemente el contenido del artefacto"
                        />
                    </Grid>

                    {/* Autor */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Autor"
                            fullWidth
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Nombre del responsable"
                        />
                    </Grid>

                    {/* Workflow */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            label="Flujo de Trabajo (Opcional)"
                            fullWidth
                            value={workflowId}
                            onChange={(e) => setWorkflowId(e.target.value)}
                            helperText="Asocia este artefacto a un flujo de trabajo para gestionar su ciclo de vida"
                        >
                            <MenuItem value="">
                                <em>Sin flujo de trabajo</em>
                            </MenuItem>
                            {workflows.map((w) => (
                                <MenuItem key={w.id} value={w.id}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                    >
                                        <span>{w.name}</span>
                                        {w.isActive && (
                                            <Chip
                                                label="Activo"
                                                size="small"
                                                color="success"
                                            />
                                        )}
                                    </Stack>
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Obligatorio */}
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isMandatory}
                                    onChange={(e) =>
                                        setIsMandatory(e.target.checked)
                                    }
                                />
                            }
                            label="Marcar como obligatorio"
                        />
                    </Grid>

                    {/* Contenido de texto (si el tipo lo requiere) */}
                    {needsText && (
                        <Grid item xs={12}>
                            <TextField
                                label="Contenido"
                                fullWidth
                                multiline
                                rows={6}
                                value={contentText}
                                onChange={(e) => setContentText(e.target.value)}
                                placeholder="Escribe el contenido del artefacto aquí..."
                                helperText="Puedes escribir directamente el contenido o adjuntar un archivo"
                            />
                        </Grid>
                    )}

                    {/* Archivo adjunto */}
                    {needsFile && (
                        <>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    label="Categoría de Archivo"
                                    fullWidth
                                    value={fileCategory}
                                    onChange={(e) =>
                                        setFileCategory(e.target.value)
                                    }
                                    helperText="Selecciona el tipo de archivo que vas a subir"
                                >
                                    <MenuItem value="DIAGRAM">
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >
                                            <ImageIcon fontSize="small" />
                                            <span>
                                                Diagrama (PNG, SVG, PDF)
                                            </span>
                                        </Stack>
                                    </MenuItem>
                                    <MenuItem value="PROTOTYPE">
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >
                                            <CodeIcon fontSize="small" />
                                            <span>
                                                Prototipo (PNG, SVG, PDF, FIG)
                                            </span>
                                        </Stack>
                                    </MenuItem>
                                    <MenuItem value="DOCUMENT">
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >
                                            <DocIcon fontSize="small" />
                                            <span>
                                                Documento (PDF, DOCX, MD)
                                            </span>
                                        </Stack>
                                    </MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<UploadIcon />}
                                    fullWidth
                                    sx={{ height: 56 }}
                                >
                                    {file ? file.name : "Seleccionar Archivo"}
                                    <input
                                        type="file"
                                        hidden
                                        accept={getAcceptedFileTypes()}
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                {file && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Tamaño: {(file.size / 1024).toFixed(2)}{" "}
                                        KB
                                    </Typography>
                                )}
                            </Grid>
                        </>
                    )}

                    {/* URL de repositorio (opcional) */}
                    <Grid item xs={12}>
                        <TextField
                            label="URL de Repositorio (opcional)"
                            fullWidth
                            value={repositoryUrl}
                            onChange={(e) => setRepositoryUrl(e.target.value)}
                            placeholder="https://github.com/usuario/repo"
                            helperText="Si el artefacto está versionado en un repositorio externo"
                        />
                    </Grid>

                    {/* Info del tipo seleccionado */}
                    {selectedType && (
                        <Grid item xs={12}>
                            <Alert severity="info" icon={<DocIcon />}>
                                <Typography variant="body2">
                                    <strong>{selectedType.name}:</strong>{" "}
                                    {selectedType.description}
                                </Typography>
                            </Alert>
                        </Grid>
                    )}

                    {/* Botones */}
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                onClick={submit}
                                disabled={submitting || !title.trim()}
                            >
                                {submitting ? "Creando..." : "Crear Artefacto"}
                            </Button>
                            <Button onClick={onCancel} disabled={submitting}>
                                Cancelar
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
