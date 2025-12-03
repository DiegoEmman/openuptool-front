import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Chip,
    Stack,
    Alert,
    CircularProgress,
    Tooltip,
    Checkbox,
} from "@mui/material";
import {
    Download as DownloadIcon,
    Add as AddIcon,
    Compare as CompareIcon,
    History as HistoryIcon,
} from "@mui/icons-material";
import { artifactService } from "../../services/artifactService";
import { CreateVersionDialog } from "./CreateVersionDialog";
import { VersionComparisonDialog } from "./VersionComparisonDialog";
import type { VersionHistory, VersionComparison } from "../../types/artifact";

interface ArtifactVersionHistoryProps {
    projectId: string;
    artifactId: string;
    artifactTitle: string;
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatFileSize(bytes?: number): string {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ArtifactVersionHistory({
    projectId,
    artifactId,
    artifactTitle,
}: ArtifactVersionHistoryProps) {
    const [history, setHistory] = useState<VersionHistory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [compareDialogOpen, setCompareDialogOpen] = useState(false);
    const [comparison, setComparison] = useState<VersionComparison | null>(
        null
    );
    const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

    const loadHistory = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await artifactService.getVersionHistory(
                projectId,
                artifactId
            );
            setHistory(data);
        } catch (err) {
            console.error("Error loading version history:", err);
            setError("Error al cargar el historial de versiones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, [projectId, artifactId]);

    const handleDownload = async (versionId: string, fileName: string) => {
        try {
            const blob = await artifactService.downloadVersion(
                projectId,
                artifactId,
                versionId
            );
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName || "archivo";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Error downloading version:", err);
            alert("Error al descargar el archivo");
        }
    };

    const handleVersionSelect = (versionId: string) => {
        setSelectedVersions((prev) => {
            if (prev.includes(versionId)) {
                return prev.filter((id) => id !== versionId);
            }
            if (prev.length < 2) {
                return [...prev, versionId];
            }
            // Si ya hay 2 seleccionadas, reemplazar la primera
            return [prev[1], versionId];
        });
    };

    const handleCompare = async () => {
        if (selectedVersions.length !== 2) {
            alert("Debes seleccionar exactamente 2 versiones para comparar");
            return;
        }

        try {
            const comp = await artifactService.compareVersions(
                projectId,
                artifactId,
                selectedVersions[0],
                selectedVersions[1]
            );
            setComparison(comp);
            setCompareDialogOpen(true);
        } catch (err) {
            console.error("Error comparing versions:", err);
            alert("Error al comparar versiones");
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!history) {
        return (
            <Alert severity="info" sx={{ mb: 2 }}>
                No se encontró el historial de versiones
            </Alert>
        );
    }

    const nextVersionNumber = history.totalVersions + 1;

    return (
        <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <HistoryIcon />
                            <Typography variant="h6">
                                Historial de Versiones
                            </Typography>
                            <Chip
                                label={`${history.totalVersions} versión${history.totalVersions !== 1 ? "es" : ""}`}
                                size="small"
                                color="primary"
                            />
                        </Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            {artifactTitle}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<CompareIcon />}
                            onClick={handleCompare}
                            disabled={selectedVersions.length !== 2}
                        >
                            Comparar ({selectedVersions.length}/2)
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            Nueva Versión
                        </Button>
                    </Stack>
                </Stack>

                {history.versions.length === 0 ? (
                    <Alert severity="info">
                        No hay versiones registradas. Crea la primera versión
                        para comenzar el control de cambios.
                    </Alert>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Tooltip title="Selecciona 2 versiones para comparar">
                                            <CompareIcon
                                                fontSize="small"
                                                color="action"
                                            />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>Versión</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Autor</TableCell>
                                    <TableCell>Archivo</TableCell>
                                    <TableCell>Tamaño</TableCell>
                                    <TableCell>
                                        Descripción de Cambios
                                    </TableCell>
                                    <TableCell align="center">
                                        Acciones
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.versions.map((version) => (
                                    <TableRow
                                        key={version.id}
                                        hover
                                        selected={selectedVersions.includes(
                                            version.id
                                        )}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedVersions.includes(
                                                    version.id
                                                )}
                                                onChange={() =>
                                                    handleVersionSelect(
                                                        version.id
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`v${version.versionNumber}`}
                                                size="small"
                                                color={
                                                    version.versionNumber ===
                                                    history.totalVersions
                                                        ? "primary"
                                                        : "default"
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(version.uploadedAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {version.uploadedBy}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                color={
                                                    version.fileName
                                                        ? "text.primary"
                                                        : "text.secondary"
                                                }
                                            >
                                                {version.fileName ||
                                                    "Sin archivo"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatFileSize(
                                                    version.fileSize
                                                )}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    maxWidth: 300,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {version.changeDescription ||
                                                    "-"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            {version.fileName && (
                                                <Tooltip title="Descargar">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleDownload(
                                                                version.id,
                                                                version.fileName!
                                                            )
                                                        }
                                                    >
                                                        <DownloadIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <CreateVersionDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                projectId={projectId}
                artifactId={artifactId}
                artifactTitle={artifactTitle}
                nextVersionNumber={nextVersionNumber}
                onSuccess={() => {
                    loadHistory();
                    setSelectedVersions([]);
                }}
            />

            <VersionComparisonDialog
                open={compareDialogOpen}
                onClose={() => setCompareDialogOpen(false)}
                comparison={comparison}
            />
        </Box>
    );
}
