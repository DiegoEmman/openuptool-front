import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Grid,
    Chip,
    Divider,
} from "@mui/material";
import {
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    TrendingUp as IncreaseIcon,
    TrendingDown as DecreaseIcon,
} from "@mui/icons-material";
import type { VersionComparison } from "../../types/artifact";

interface VersionComparisonDialogProps {
    open: boolean;
    onClose: () => void;
    comparison: VersionComparison | null;
}

function formatFileSize(bytes?: number): string {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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

function parseDuration(duration: string): string {
    // Duration viene como "d.hh:mm:ss" o "hh:mm:ss"
    const parts = duration.split(":");
    if (parts.length === 3) {
        const daysPart = parts[0].split(".");
        if (daysPart.length === 2) {
            const days = parseInt(daysPart[0]);
            const hours = parseInt(daysPart[1]);
            const minutes = parseInt(parts[1]);
            if (days > 0) return `${days}d ${hours}h ${minutes}m`;
            if (hours > 0) return `${hours}h ${minutes}m`;
            return `${minutes}m`;
        }
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }
    return duration;
}

export function VersionComparisonDialog({
    open,
    onClose,
    comparison,
}: VersionComparisonDialogProps) {
    if (!comparison) return null;

    const { version1, version2, differences } = comparison;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Comparación de Versiones: v{version1.versionNumber} vs v
                {version2.versionNumber}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    {/* Headers */}
                    <Grid item xs={6}>
                        <Box textAlign="center">
                            <Chip
                                label={`Versión ${version1.versionNumber}`}
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box textAlign="center">
                            <Chip
                                label={`Versión ${version2.versionNumber}`}
                                color="secondary"
                            />
                        </Box>
                    </Grid>

                    {/* Archivo */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>
                            Archivo{" "}
                            {differences.fileChanged ? (
                                <CancelIcon
                                    color="warning"
                                    fontSize="small"
                                    sx={{ verticalAlign: "middle" }}
                                />
                            ) : (
                                <CheckIcon
                                    color="success"
                                    fontSize="small"
                                    sx={{ verticalAlign: "middle" }}
                                />
                            )}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            {version1.fileName || "Sin archivo"}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            {version2.fileName || "Sin archivo"}
                        </Typography>
                    </Grid>

                    {/* Tamaño */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>
                            Tamaño del Archivo{" "}
                            {differences.fileSizeChanged ? (
                                differences.fileSizeDifference &&
                                differences.fileSizeDifference > 0 ? (
                                    <IncreaseIcon
                                        color="info"
                                        fontSize="small"
                                        sx={{ verticalAlign: "middle" }}
                                    />
                                ) : (
                                    <DecreaseIcon
                                        color="info"
                                        fontSize="small"
                                        sx={{ verticalAlign: "middle" }}
                                    />
                                )
                            ) : (
                                <CheckIcon
                                    color="success"
                                    fontSize="small"
                                    sx={{ verticalAlign: "middle" }}
                                />
                            )}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            {formatFileSize(version1.fileSize)}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            {formatFileSize(version2.fileSize)}
                            {differences.fileSizeDifference !== undefined &&
                                differences.fileSizeDifference !== 0 && (
                                    <Chip
                                        label={`${differences.fileSizeDifference > 0 ? "+" : ""}${formatFileSize(Math.abs(differences.fileSizeDifference))}`}
                                        size="small"
                                        color={
                                            differences.fileSizeDifference > 0
                                                ? "info"
                                                : "default"
                                        }
                                        sx={{ ml: 1 }}
                                    />
                                )}
                        </Typography>
                    </Grid>

                    {/* Autor */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>
                            Autor{" "}
                            {differences.authorChanged ? (
                                <CancelIcon
                                    color="warning"
                                    fontSize="small"
                                    sx={{ verticalAlign: "middle" }}
                                />
                            ) : (
                                <CheckIcon
                                    color="success"
                                    fontSize="small"
                                    sx={{ verticalAlign: "middle" }}
                                />
                            )}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            {version1.uploadedBy}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            {version2.uploadedBy}
                        </Typography>
                    </Grid>

                    {/* Fecha */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" gutterBottom>
                            Fecha de Carga
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(version1.uploadedAt)}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(version2.uploadedAt)}
                            <Chip
                                label={`+${parseDuration(differences.timeDifference)}`}
                                size="small"
                                color="info"
                                sx={{ ml: 1 }}
                            />
                        </Typography>
                    </Grid>

                    {/* Descripción de cambios */}
                    {differences.changeDescription && (
                        <>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="subtitle2" gutterBottom>
                                    Descripción de Cambios (v
                                    {version2.versionNumber})
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: "background.default",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography variant="body2">
                                        {differences.changeDescription}
                                    </Typography>
                                </Box>
                            </Grid>
                        </>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
}
