import React from "react";
import type { Iteration } from "../../types/iteration";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Box,
    Chip,
    Select,
    MenuItem,
} from "@mui/material";
import { iterationService } from "../../services/iterationService";
import { useAuth } from "../../contexts/AuthContext";

function formatDate(dateString: string | undefined): string {
    if (!dateString) return "-";
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
}

interface Props {
    iterations: Iteration[];
    projectId: string;
    onUpdate?: () => void;
}
export function IterationsTable({ iterations, projectId, onUpdate }: Props) {
    const { hasRole } = useAuth();
    const canEditStatus = hasRole(["Admin", "Manager"]);

    const active = iterations.filter((i) => i.status !== "Finalizada");
    const past = iterations.filter((i) => i.status === "Finalizada");

    const handleStatusChange = async (
        iterationId: string,
        newStatus: Iteration["status"]
    ) => {
        try {
            await iterationService.updateStatus(
                projectId,
                iterationId,
                newStatus
            );
            onUpdate?.();
        } catch (error) {
            console.error("Error updating iteration status:", error);
        }
    };

    function section(title: string, data: Iteration[]) {
        return (
            <Box mb={3}>
                <Typography variant="subtitle1" mb={1}>
                    {title}
                </Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Fase</TableCell>
                            <TableCell>Fechas</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Objetivo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((i) => (
                            <TableRow key={i.id}>
                                <TableCell>{i.name}</TableCell>
                                <TableCell>{i.phase}</TableCell>
                                <TableCell>
                                    {formatDate(i.startDate)} -{" "}
                                    {formatDate(i.endDate)}
                                </TableCell>
                                <TableCell>
                                    {canEditStatus ? (
                                        <Select
                                            size="small"
                                            value={i.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    i.id,
                                                    e.target
                                                        .value as Iteration["status"]
                                                )
                                            }
                                            sx={{ minWidth: 120 }}
                                        >
                                            <MenuItem value="Planeada">
                                                Planeada
                                            </MenuItem>
                                            <MenuItem value="En curso">
                                                En curso
                                            </MenuItem>
                                            <MenuItem value="Finalizada">
                                                Finalizada
                                            </MenuItem>
                                        </Select>
                                    ) : (
                                        <Chip label={i.status} size="small" />
                                    )}
                                </TableCell>
                                <TableCell>{i.objective || "-"}</TableCell>
                            </TableRow>
                        ))}
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Sin iteraciones
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>
        );
    }

    return (
        <Box>
            {section("Iteraciones activas", active)}
            {section("Iteraciones pasadas", past)}
        </Box>
    );
}
