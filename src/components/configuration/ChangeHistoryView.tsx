import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    CircularProgress,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import {
    History as HistoryIcon,
    Restore as RestoreIcon,
} from "@mui/icons-material";
import { configurationService } from "../../services/configurationService";
import type {
    ConfigurationChangeHistory,
    RollbackConfigurationInput,
} from "../../types/configuration";

interface ChangeHistoryViewProps {
    configId: string;
}

export function ChangeHistoryView({ configId }: ChangeHistoryViewProps) {
    const [history, setHistory] = useState<ConfigurationChangeHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rollbackDialogOpen, setRollbackDialogOpen] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
    const [rollbackReason, setRollbackReason] = useState("");

    useEffect(() => {
        loadHistory();
    }, [configId]);

    const loadHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await configurationService.getHistory(configId);
            setHistory(data.sort((a, b) => b.toVersion - a.toVersion));
        } catch (err) {
            setError("Error al cargar historial de cambios");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenRollbackDialog = (version: number) => {
        setSelectedVersion(version);
        setRollbackReason("");
        setRollbackDialogOpen(true);
    };

    const handleCloseRollbackDialog = () => {
        setRollbackDialogOpen(false);
        setSelectedVersion(null);
        setRollbackReason("");
    };

    const handleRollback = async () => {
        if (!selectedVersion) return;

        try {
            const input: RollbackConfigurationInput = {
                targetVersion: selectedVersion,
                reason: rollbackReason,
            };
            await configurationService.rollback(configId, input);
            handleCloseRollbackDialog();
            loadHistory();
            window.location.reload(); // Recargar para mostrar configuración restaurada
        } catch (err) {
            setError("Error al realizar rollback");
            console.error(err);
        }
    };

    const getChangeTypeColor = (changeType: string) => {
        switch (changeType.toLowerCase()) {
            case "created":
            case "creation":
                return "success";
            case "updated":
            case "update":
                return "info";
            case "deleted":
            case "deletion":
                return "error";
            case "rollback":
                return "warning";
            case "version_increment":
                return "secondary";
            default:
                return "default";
        }
    };

    const getChangeTypeLabel = (changeType: string) => {
        const labels: Record<string, string> = {
            created: "Creación",
            creation: "Creación",
            updated: "Actualización",
            update: "Actualización",
            deleted: "Eliminación",
            deletion: "Eliminación",
            rollback: "Rollback",
            version_increment: "Incremento de Versión",
        };
        return labels[changeType.toLowerCase()] || changeType;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <HistoryIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Historial de Cambios</Typography>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            <Alert severity="info" sx={{ mb: 2 }}>
                El historial muestra todos los cambios realizados en esta
                configuración. Puedes restaurar versiones anteriores.
            </Alert>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Versión</TableCell>
                            <TableCell>Tipo de Cambio</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Realizado Por</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>
                                    <Chip
                                        label={`v${entry.toVersion}`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getChangeTypeLabel(
                                            entry.changeType
                                        )}
                                        size="small"
                                        color={getChangeTypeColor(
                                            entry.changeType
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {entry.changeDescription || "-"}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {entry.changedBy || "Sistema"}
                                </TableCell>
                                <TableCell>
                                    {formatDate(entry.changedAt)}
                                </TableCell>
                                <TableCell align="center">
                                    {entry.toVersion <
                                        (history[0]?.toVersion || 0) && (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="warning"
                                            startIcon={<RestoreIcon />}
                                            onClick={() =>
                                                handleOpenRollbackDialog(
                                                    entry.toVersion
                                                )
                                            }
                                        >
                                            Restaurar
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {history.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No hay historial de cambios
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={rollbackDialogOpen}
                onClose={handleCloseRollbackDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Confirmar Rollback</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        <Alert severity="warning">
                            Estás a punto de restaurar la configuración a la
                            versión {selectedVersion}. Esto creará una nueva
                            versión con los datos de la versión seleccionada.
                        </Alert>
                        <TextField
                            label="Razón del Rollback"
                            value={rollbackReason}
                            onChange={(e) => setRollbackReason(e.target.value)}
                            multiline
                            rows={3}
                            fullWidth
                            required
                            helperText="Describe por qué realizas este rollback"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRollbackDialog}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleRollback}
                        variant="contained"
                        color="warning"
                        disabled={!rollbackReason.trim()}
                    >
                        Restaurar Versión
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
