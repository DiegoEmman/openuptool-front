import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Typography,
    Tooltip,
    Box,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import type { Workflow } from "../../types/workflow";

interface WorkflowsTableProps {
    workflows: Workflow[];
    onEdit: (workflow: Workflow) => void;
    onDelete: (workflow: Workflow) => void;
    onView: (workflow: Workflow) => void;
}

export function WorkflowsTable({
    workflows,
    onEdit,
    onDelete,
    onView,
}: WorkflowsTableProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Estados</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Creado</TableCell>
                        <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {workflows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                <Typography color="textSecondary" py={2}>
                                    No hay flujos de trabajo creados
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        workflows.map((workflow) => (
                            <TableRow key={workflow.id} hover>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                    >
                                        {workflow.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{
                                            maxWidth: 300,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {workflow.description || "-"}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 0.5,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {workflow.states
                                            .sort((a, b) => a.order - b.order)
                                            .slice(0, 3)
                                            .map((state) => (
                                                <Chip
                                                    key={state.id}
                                                    label={state.name}
                                                    size="small"
                                                    sx={{
                                                        bgcolor:
                                                            state.color ||
                                                            "#gray",
                                                        color: "white",
                                                        fontSize: "0.7rem",
                                                    }}
                                                />
                                            ))}
                                        {workflow.states.length > 3 && (
                                            <Chip
                                                label={`+${workflow.states.length - 3}`}
                                                size="small"
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={
                                            workflow.isActive
                                                ? "Activo"
                                                : "Inactivo"
                                        }
                                        color={
                                            workflow.isActive
                                                ? "success"
                                                : "default"
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {formatDate(workflow.createdAt)}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Ver Estados">
                                        <IconButton
                                            size="small"
                                            onClick={() => onView(workflow)}
                                        >
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(workflow)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            size="small"
                                            onClick={() => onDelete(workflow)}
                                            color="error"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
