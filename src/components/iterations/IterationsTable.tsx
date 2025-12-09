import React, { useState } from "react";
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
    IconButton,
    Collapse,
    Button,
    Tooltip,
} from "@mui/material";
import {
    TrendingUp as TrendingUpIcon,
    Settings as SettingsIcon,
    CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { iterationService } from "../../services/iterationService";
import { useAuth } from "../../contexts/AuthContext";
import { IterationScopeManager } from "./IterationScopeManager";
import { IterationCapacityForm } from "./IterationCapacityForm";
import { IterationVelocityForm } from "./IterationVelocityForm";
import { Link } from "react-router";

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
    const [expandedIteration, setExpandedIteration] = useState<string | null>(
        null
    );
    const [editingCapacity, setEditingCapacity] = useState<Iteration | null>(
        null
    );
    const [editingVelocity, setEditingVelocity] = useState<Iteration | null>(
        null
    );

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
                            <TableCell width="30px"></TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Fase</TableCell>
                            <TableCell>Fechas</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Capacidad</TableCell>
                            <TableCell>Objetivo</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((i) => (
                            <React.Fragment key={i.id}>
                                <TableRow>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                setExpandedIteration(
                                                    expandedIteration === i.id
                                                        ? null
                                                        : i.id
                                                )
                                            }
                                        >
                                            {expandedIteration === i.id
                                                ? "▼"
                                                : "▶"}
                                        </IconButton>
                                    </TableCell>
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
                                            <Chip
                                                label={i.status}
                                                size="small"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {i.plannedCapacityHours ||
                                        i.teamSize ||
                                        i.plannedPoints ? (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 0.5,
                                                }}
                                            >
                                                {i.plannedCapacityHours && (
                                                    <Typography variant="caption">
                                                        ⏱️{" "}
                                                        {i.plannedCapacityHours}
                                                        h
                                                    </Typography>
                                                )}
                                                {i.teamSize && (
                                                    <Typography variant="caption">
                                                        👥 {i.teamSize} miembros
                                                    </Typography>
                                                )}
                                                {i.plannedPoints && (
                                                    <Typography variant="caption">
                                                        📊 {i.plannedPoints} pts
                                                    </Typography>
                                                )}
                                            </Box>
                                        ) : (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                Sin configurar
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>{i.objective || "-"}</TableCell>
                                    <TableCell align="right">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            {canEditStatus && (
                                                <>
                                                    <Tooltip title="Configurar capacidad">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                setEditingCapacity(
                                                                    i
                                                                )
                                                            }
                                                            color="primary"
                                                        >
                                                            <SettingsIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Registrar velocidad (puntos completados)">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                setEditingVelocity(
                                                                    i
                                                                )
                                                            }
                                                            color="success"
                                                        >
                                                            <CheckCircleIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                            <Button
                                                component={Link}
                                                to={`/projects/${projectId}/iterations/${i.id}`}
                                                size="small"
                                                startIcon={<TrendingUpIcon />}
                                                variant="outlined"
                                            >
                                                Ver Avance
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        style={{
                                            paddingBottom: 0,
                                            paddingTop: 0,
                                        }}
                                    >
                                        <Collapse
                                            in={expandedIteration === i.id}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <Box sx={{ margin: 2 }}>
                                                <IterationScopeManager
                                                    iterationId={i.id}
                                                    projectId={projectId}
                                                />
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
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

            {editingCapacity && (
                <IterationCapacityForm
                    open={true}
                    onClose={() => setEditingCapacity(null)}
                    onSuccess={() => {
                        setEditingCapacity(null);
                        onUpdate?.();
                    }}
                    iteration={editingCapacity}
                />
            )}

            {editingVelocity && (
                <IterationVelocityForm
                    open={true}
                    onClose={() => setEditingVelocity(null)}
                    onSuccess={() => {
                        setEditingVelocity(null);
                        onUpdate?.();
                    }}
                    iteration={editingVelocity}
                />
            )}
        </Box>
    );
}
