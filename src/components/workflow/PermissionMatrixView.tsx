import { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Switch,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    Info as InfoIcon,
} from "@mui/icons-material";
import { workflowPermissionService } from "../../services/workflowService";
import type { WorkflowPermissionMatrix } from "../../types/workflow";

interface PermissionMatrixViewProps {
    workflowId: string;
}

// Definición de roles y acciones estándar
const ROLES = ["autor", "revisor", "PO", "admin"];
const ACTIONS = ["crear", "editar", "aprobar", "cambiar_estado"];

const ROLE_LABELS: Record<string, string> = {
    autor: "Autor",
    revisor: "Revisor",
    PO: "Product Owner",
    admin: "Administrador",
};

const ACTION_LABELS: Record<string, string> = {
    crear: "Crear",
    editar: "Editar",
    aprobar: "Aprobar",
    cambiar_estado: "Cambiar Estado",
};

const ACTION_DESCRIPTIONS: Record<string, string> = {
    crear: "Permite crear nuevos artefactos en el flujo",
    editar: "Permite modificar artefactos existentes",
    aprobar: "Permite aprobar artefactos en revisión",
    cambiar_estado: "Permite cambiar el estado de los artefactos",
};

export default function PermissionMatrixView({
    workflowId,
}: PermissionMatrixViewProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [matrix, setMatrix] = useState<WorkflowPermissionMatrix | null>(null);
    const [updating, setUpdating] = useState<string | null>(null); // "role-action" format

    useEffect(() => {
        loadMatrix();
    }, [workflowId]);

    const loadMatrix = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await workflowPermissionService.getMatrix(workflowId);
            setMatrix(data);
        } catch (err) {
            console.error("Error loading permission matrix:", err);
            setError("Error al cargar la matriz de permisos");
        } finally {
            setLoading(false);
        }
    };

    const getPermissionValue = (role: string, action: string): boolean => {
        if (!matrix) return false;

        const rolePermissions = matrix.permissions.find((p) => p.role === role);
        if (!rolePermissions) return false;

        return rolePermissions.actions[action] ?? false;
    };

    const handlePermissionToggle = async (role: string, action: string) => {
        const key = `${role}-${action}`;
        setUpdating(key);

        try {
            const currentValue = getPermissionValue(role, action);
            const newValue = !currentValue;

            // Buscar el permiso existente en la lista completa de permisos
            const permissions =
                await workflowPermissionService.getByWorkflow(workflowId);
            const existing = permissions.find(
                (p) => p.role === role && p.action === action
            );

            if (existing) {
                // Actualizar permiso existente
                await workflowPermissionService.update(existing.id, {
                    isAllowed: newValue,
                });
            } else {
                // Crear nuevo permiso
                await workflowPermissionService.create({
                    workflowId,
                    role,
                    action,
                    isAllowed: newValue,
                });
            }

            // Recargar matriz
            await loadMatrix();
        } catch (err) {
            console.error("Error updating permission:", err);
            setError("Error al actualizar el permiso");
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={4}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!matrix) {
        return (
            <Alert severity="info" sx={{ m: 2 }}>
                No se encontró la matriz de permisos
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Matriz de Permisos
                </Typography>
                <Chip
                    label={matrix.workflowName}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
                Define qué roles pueden realizar cada acción. Los usuarios sin
                permiso verán el contenido en modo solo lectura.
            </Alert>

            <TableContainer component={Paper} elevation={0} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    bgcolor: "grey.50",
                                    width: 150,
                                }}
                            >
                                Rol
                            </TableCell>
                            {ACTIONS.map((action) => (
                                <TableCell
                                    key={action}
                                    align="center"
                                    sx={{
                                        fontWeight: "bold",
                                        bgcolor: "grey.50",
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: "bold" }}
                                        >
                                            {ACTION_LABELS[action]}
                                        </Typography>
                                        <Tooltip
                                            title={ACTION_DESCRIPTIONS[action]}
                                        >
                                            <IconButton size="small">
                                                <InfoIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ROLES.map((role) => (
                            <TableRow
                                key={role}
                                hover
                                sx={{
                                    "&:last-child td": { border: 0 },
                                }}
                            >
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: "medium" }}
                                    >
                                        {ROLE_LABELS[role]}
                                    </Typography>
                                </TableCell>
                                {ACTIONS.map((action) => {
                                    const key = `${role}-${action}`;
                                    const isAllowed = getPermissionValue(
                                        role,
                                        action
                                    );
                                    const isUpdating = updating === key;

                                    return (
                                        <TableCell key={action} align="center">
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                {isUpdating ? (
                                                    <CircularProgress
                                                        size={20}
                                                    />
                                                ) : (
                                                    <>
                                                        <Switch
                                                            checked={isAllowed}
                                                            onChange={() =>
                                                                handlePermissionToggle(
                                                                    role,
                                                                    action
                                                                )
                                                            }
                                                            color="success"
                                                            size="small"
                                                        />
                                                        {isAllowed ? (
                                                            <CheckIcon
                                                                fontSize="small"
                                                                color="success"
                                                            />
                                                        ) : (
                                                            <CancelIcon
                                                                fontSize="small"
                                                                color="error"
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </Box>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    <strong>Nota:</strong> El rol "Administrador" tiene acceso
                    completo independientemente de los permisos configurados.
                </Typography>
            </Box>
        </Box>
    );
}
