import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Chip,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    Download as DownloadIcon,
    History as HistoryIcon,
} from "@mui/icons-material";
import type {
    ArtifactVersion,
    VersionHistory as VersionHistoryType,
    CreateArtifactVersionInput,
} from "../../../types/artifactVersion";
import { artifactVersionService } from "../../../services/artifactVersionService";

interface VersionHistoryProps {
    projectId: string;
    artifactId: string;
}

export function VersionHistory({ projectId, artifactId }: VersionHistoryProps) {
    const [history, setHistory] = useState<VersionHistoryType | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploadDialog, setUploadDialog] = useState(false);
    const [uploadData, setUploadData] = useState<CreateArtifactVersionInput>({
        changeDescription: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        loadHistory();
    }, [projectId, artifactId]);

    const loadHistory = async () => {
        try {
            const data = await artifactVersionService.getVersionHistory(
                projectId,
                artifactId
            );
            setHistory(data);
        } catch (error) {
            console.error("Error loading version history:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            await artifactVersionService.createVersion(projectId, artifactId, {
                ...uploadData,
                file: selectedFile,
            });
            setUploadDialog(false);
            setUploadData({ changeDescription: "" });
            setSelectedFile(null);
            loadHistory();
        } catch (error) {
            console.error("Error uploading version:", error);
            alert("Error al subir la nueva versión");
        }
    };

    const handleDownload = async (versionId: string, fileName: string) => {
        try {
            const blob = await artifactVersionService.downloadVersion(
                projectId,
                artifactId,
                versionId
            );
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading version:", error);
            alert("Error al descargar la versión");
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!history) {
        return (
            <Typography color="text.secondary">
                No se pudo cargar el historial de versiones
            </Typography>
        );
    }

    return (
        <>
            <Box>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Box>
                        <Typography variant="h6">
                            <HistoryIcon
                                sx={{ mr: 1, verticalAlign: "middle" }}
                            />
                            Historial de Versiones
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {history.totalVersions} versiones • Versión actual:{" "}
                            {history.currentVersion}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={() => setUploadDialog(true)}
                    >
                        Nueva Versión
                    </Button>
                </Stack>

                <Stack spacing={2}>
                    {history.versions.map((version: ArtifactVersion) => (
                        <Card key={version.id}>
                            <CardContent>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                >
                                    <Box>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            mb={1}
                                        >
                                            <Typography variant="h6">
                                                Versión {version.versionNumber}
                                            </Typography>
                                            {version.versionNumber ===
                                                history.currentVersion && (
                                                <Chip
                                                    label="Actual"
                                                    size="small"
                                                    color="primary"
                                                />
                                            )}
                                        </Stack>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {version.fileName} •{" "}
                                            {formatFileSize(version.fileSize)}
                                        </Typography>

                                        {version.changeDescription && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                mt={1}
                                            >
                                                {version.changeDescription}
                                            </Typography>
                                        )}

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Subido:{" "}
                                            {new Date(
                                                version.uploadedAt
                                            ).toLocaleString()}
                                        </Typography>
                                    </Box>

                                    <Tooltip title="Descargar">
                                        <IconButton
                                            onClick={() =>
                                                handleDownload(
                                                    version.id,
                                                    version.fileName
                                                )
                                            }
                                        >
                                            <DownloadIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Box>

            <Dialog
                open={uploadDialog}
                onClose={() => setUploadDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Subir Nueva Versión</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Button variant="outlined" component="label" fullWidth>
                            Seleccionar Archivo
                            <input
                                type="file"
                                hidden
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setSelectedFile(file);
                                }}
                            />
                        </Button>

                        {selectedFile && (
                            <Typography variant="body2" color="text.secondary">
                                Archivo seleccionado: {selectedFile.name} (
                                {formatFileSize(selectedFile.size)})
                            </Typography>
                        )}

                        <TextField
                            label="Descripción de Cambios"
                            multiline
                            rows={4}
                            fullWidth
                            value={uploadData.changeDescription}
                            onChange={(e) =>
                                setUploadData({
                                    ...uploadData,
                                    changeDescription: e.target.value,
                                })
                            }
                            placeholder="Describe los cambios en esta versión..."
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUploadDialog(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleUpload}
                        variant="contained"
                        disabled={!selectedFile}
                    >
                        Subir Versión
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
