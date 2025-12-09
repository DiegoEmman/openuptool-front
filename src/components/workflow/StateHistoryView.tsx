import { useState, useEffect } from "react";
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
    Chip,
} from "@mui/material";
import type { ArtifactStateHistory } from "../../types/workflow";
import { artifactStateService } from "../../services/workflowService";

interface StateHistoryViewProps {
    artifactId: string;
}

export function StateHistoryView({ artifactId }: StateHistoryViewProps) {
    const [history, setHistory] = useState<ArtifactStateHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, [artifactId]);

    const loadHistory = async () => {
        setLoading(true);
        const data = await artifactStateService.getHistory(artifactId);
        if (data) {
            setHistory(
                data.sort(
                    (a, b) =>
                        new Date(b.changedAt).getTime() -
                        new Date(a.changedAt).getTime()
                )
            );
        }
        setLoading(false);
    };

    if (loading) {
        return <Typography>Cargando historial...</Typography>;
    }

    if (history.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography color="textSecondary">
                    No hay historial de cambios de estado para este artefacto.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Historial de Estados
            </Typography>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Fecha</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Estado Anterior</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Estado Nuevo</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Cambiado Por</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Comentario</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>
                                    {new Date(item.changedAt).toLocaleString(
                                        "es-ES",
                                        {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item.fromStateName ? (
                                        <Chip
                                            label={item.fromStateName}
                                            size="small"
                                            sx={{
                                                bgcolor: "#6B7280",
                                                color: "white",
                                            }}
                                        />
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            -
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={item.toStateName}
                                        size="small"
                                        sx={{
                                            bgcolor: "#10B981",
                                            color: "white",
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{item.changedByUserName}</TableCell>
                                <TableCell>
                                    {item.comments || (
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            Sin comentario
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
