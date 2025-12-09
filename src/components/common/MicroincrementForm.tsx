import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    FormControl,
    InputLabel,
    Select,
    Alert,
} from "@mui/material";
import type {
    CreateMicroincrementInput,
    Microincrement,
} from "../../types/microincrement";
import type { Iteration, Artifact } from "../../types";

interface MicroincrementFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateMicroincrementInput) => Promise<void>;
    iterations: Iteration[];
    artifacts: Artifact[];
    editData?: Microincrement;
    projectId: string;
}

export function MicroincrementForm({
    open,
    onClose,
    onSubmit,
    iterations,
    artifacts,
    editData,
    projectId,
}: MicroincrementFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [author, setAuthor] = useState("");
    const [type, setType] = useState<"tecnico" | "funcional">("funcional");
    const [iterationId, setIterationId] = useState("");
    const [artifactId, setArtifactId] = useState("");
    const [evidenceUrl, setEvidenceUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setTitle(editData.title);
            setDescription(editData.description || "");
            setDate(editData.date.split("T")[0]);
            setAuthor(editData.author);
            setType(editData.type);
            setIterationId(editData.iterationId || "");
            setArtifactId(editData.artifactId);
            setEvidenceUrl(editData.evidenceUrl || "");
        } else {
            setTitle("");
            setDescription("");
            setDate(new Date().toISOString().split("T")[0]);
            setAuthor("");
            setType("funcional");
            setIterationId("");
            setArtifactId("");
            setEvidenceUrl("");
        }
        setError("");
    }, [editData, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("El título es obligatorio");
            return;
        }

        if (!artifactId) {
            setError("Debe seleccionar un artefacto");
            return;
        }

        if (!author.trim()) {
            setError("El autor es obligatorio");
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim() || undefined,
                date: new Date(date).toISOString(),
                author: author.trim(),
                type,
                iterationId: iterationId || undefined,
                artifactId,
                evidenceUrl: evidenceUrl.trim() || undefined,
            });
            onClose();
        } catch (err) {
            setError("Error al guardar el microincremento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {editData ? "Editar" : "Crear"} Microincremento
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <TextField
                            label="Título"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            rows={3}
                            fullWidth
                        />
                        <TextField
                            label="Fecha"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Autor"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                value={type}
                                label="Tipo"
                                onChange={(e) =>
                                    setType(
                                        e.target.value as
                                            | "tecnico"
                                            | "funcional"
                                    )
                                }
                            >
                                <MenuItem value="funcional">Funcional</MenuItem>
                                <MenuItem value="tecnico">Técnico</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel>Artefacto</InputLabel>
                            <Select
                                value={artifactId}
                                label="Artefacto"
                                onChange={(e) => setArtifactId(e.target.value)}
                            >
                                {artifacts.map((artifact) => (
                                    <MenuItem
                                        key={artifact.id}
                                        value={artifact.id}
                                    >
                                        {artifact.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Iteración (opcional)</InputLabel>
                            <Select
                                value={iterationId}
                                label="Iteración (opcional)"
                                onChange={(e) => setIterationId(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>Ninguna</em>
                                </MenuItem>
                                {iterations.map((iteration) => (
                                    <MenuItem
                                        key={iteration.id}
                                        value={iteration.id}
                                    >
                                        {iteration.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="URL de Evidencia (opcional)"
                            value={evidenceUrl}
                            onChange={(e) => setEvidenceUrl(e.target.value)}
                            fullWidth
                            placeholder="https://..."
                        />
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
                    >
                        {loading
                            ? "Guardando..."
                            : editData
                              ? "Actualizar"
                              : "Crear"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
