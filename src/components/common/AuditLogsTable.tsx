import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Paper,
    Chip,
} from "@mui/material";
import { projectService } from "../../services/projectService";
import type { AuditLog } from "../../types/project";

interface AuditLogsTableProps {
    projectId: string;
}

function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getActionColor(
    action: string
): "default" | "primary" | "success" | "warning" | "error" {
    if (action.includes("Created") || action.includes("Added"))
        return "success";
    if (action.includes("Updated") || action.includes("Modified"))
        return "primary";
    if (action.includes("Archived")) return "warning";
    if (action.includes("Deleted")) return "error";
    return "default";
}

export function AuditLogsTable({ projectId }: AuditLogsTableProps) {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        projectService
            .getAuditLogs(projectId)
            .then((data) => {
                setLogs(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading audit logs:", err);
                setError("Error al cargar el historial de auditoría");
                setLoading(false);
            });
    }, [projectId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" py={4}>
                {error}
            </Typography>
        );
    }

    if (logs.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary">
                    No hay registros de auditoría disponibles
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper>
            <Box p={2}>
                <Typography variant="h6" gutterBottom>
                    Historial de Auditoría
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Registro de todas las acciones realizadas en este proyecto
                </Typography>
            </Box>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Fecha y Hora</TableCell>
                        <TableCell>Usuario</TableCell>
                        <TableCell>Acción</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Detalles</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.id} hover>
                            <TableCell>
                                {formatDateTime(log.createdAt)}
                            </TableCell>
                            <TableCell>{log.userName}</TableCell>
                            <TableCell>
                                <Chip
                                    label={log.action}
                                    color={getActionColor(log.action)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{log.entityType}</TableCell>
                            <TableCell>{log.details}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
