import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Alert,
    CircularProgress,
} from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { artifactService } from "../../services/artifactService";
import type { CreateVersionInput } from "../../types/artifact";

interface CreateVersionDialogProps {
    open: boolean;
    onClose: () => void;
    projectId: string;
    artifactId: string;
    artifactTitle: string;
    nextVersionNumber: number;
    onSuccess: () => void;
}

export function CreateVersionDialog({
    open,
    onClose,
    projectId,
    artifactId,
    artifactTitle,
    nextVersionNumber,
    onSuccess,
}: CreateVersionDialogProps) {
    const [changeDescription, setChangeDescription] = useState("");
    const [file, setFile] = useState<File | undefined>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        setFile(selectedFile);
        setError("");
    };

    const handleSubmit = async () => {
        if (!changeDescription.trim()) {
            setError("La descripción de cambios es obligatoria");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const input: CreateVersionInput = {
                changeDescription: changeDescription.trim(),
                file,
            };

            await artifactService.createVersion(projectId, artifactId, input);
            setChangeDescription("");
            setFile(undefined);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Error creating version:", err);
            setError("Error al crear la versión. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setChangeDescription("");
            setFile(undefined);
            setError("");
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Nueva Versión - v{nextVersionNumber}
                <Typography variant="body2" color="text.secondary">
                    {artifactTitle}
                </Typography>
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Descripción de cambios *"
                    multiline
                    rows={4}
                    fullWidth
                    value={changeDescription}
                    onChange={(e) => setChangeDescription(e.target.value)}
                    placeholder="Describe los cambios realizados en esta versión..."
                    sx={{ mb: 3 }}
                    disabled={loading}
                    helperText="Especifica qué cambios, mejoras o correcciones incluye esta versión"
                />

                <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Archivo (opcional)
                    </Typography>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadIcon />}
                        fullWidth
                        disabled={loading}
                    >
                        {file ? file.name : "Seleccionar archivo"}
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    {file && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1, display: "block" }}
                        >
                            Tamaño: {(file.size / 1024).toFixed(2)} KB
                        </Typography>
                    )}
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                    La versión anterior se mantendrá intacta en el historial
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !changeDescription.trim()}
                    startIcon={loading && <CircularProgress size={20} />}
                >
                    {loading ? "Creando..." : "Crear Versión"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
