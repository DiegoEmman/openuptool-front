import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Chip,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Stack,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    ArrowUpward as ArrowUpIcon,
    ArrowDownward as ArrowDownIcon,
} from "@mui/icons-material";
import type { Workflow, WorkflowState } from "../../types/workflow";
import { workflowStateService } from "../../services/workflowService";
import { AddResponsibleDialog } from "./AddResponsibleDialog";

interface WorkflowStatesViewProps {
    workflow: Workflow;
    onAddState: () => void;
    onEditState: (state: WorkflowState) => void;
    onRefresh: () => void;
    projectId: string;
}

export function WorkflowStatesView({
    workflow,
    onAddState,
    onEditState,
    onRefresh,
    projectId,
}: WorkflowStatesViewProps) {
    const [deleting, setDeleting] = useState<string | null>(null);
    const [addResponsibleOpen, setAddResponsibleOpen] = useState(false);
    const [selectedStateForResponsible, setSelectedStateForResponsible] =
        useState<string | null>(null);
    const [deletingResponsible, setDeletingResponsible] = useState<
        string | null
    >(null);

    const handleDeleteState = async (stateId: string) => {
        if (!window.confirm("¿Eliminar este estado?")) return;

        setDeleting(stateId);
        const success = await workflowStateService.delete(stateId);
        setDeleting(null);

        if (success) {
            onRefresh();
        }
    };

    const handleAddResponsible = (stateId: string) => {
        setSelectedStateForResponsible(stateId);
        setAddResponsibleOpen(true);
    };

    const handleRemoveResponsible = async (
        stateId: string,
        userId: string,
        responsibleId: string
    ) => {
        if (!window.confirm("¿Eliminar este responsable del estado?")) return;

        setDeletingResponsible(responsibleId);
        const success =
            await workflowStateService.removeResponsible(responsibleId);
        setDeletingResponsible(null);

        if (success) {
            onRefresh();
        }
    };

    const handleResponsibleSuccess = () => {
        setAddResponsibleOpen(false);
        setSelectedStateForResponsible(null);
        onRefresh();
    };

    const sortedStates = [...workflow.states].sort((a, b) => a.order - b.order);

    return (
        <Box>
            <Paper sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Box>
                        <Typography variant="h6">{workflow.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {workflow.description || "Sin descripción"}
                        </Typography>
                    </Box>
                    <Chip
                        label={workflow.isActive ? "Activo" : "Inactivo"}
                        color={workflow.isActive ? "success" : "default"}
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        Estados del Flujo ({workflow.states.length})
                    </Typography>
                    <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        size="small"
                        onClick={onAddState}
                    >
                        Agregar Estado
                    </Button>
                </Box>

                {sortedStates.length === 0 ? (
                    <Typography color="textSecondary" textAlign="center" py={4}>
                        No hay estados configurados. Agrega el primer estado.
                    </Typography>
                ) : (
                    <List>
                        {sortedStates.map((state, index) => (
                            <Paper
                                key={state.id}
                                variant="outlined"
                                sx={{ mb: 1, position: "relative" }}
                            >
                                <ListItem>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 1,
                                            bgcolor: state.color || "#gray",
                                            mr: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Typography
                                            color="white"
                                            fontWeight="bold"
                                            fontSize="1.2rem"
                                        >
                                            {state.order}
                                        </Typography>
                                    </Box>
                                    <ListItemText
                                        primary={
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="bold"
                                                >
                                                    {state.name}
                                                </Typography>
                                                {state.isInitialState && (
                                                    <Chip
                                                        label="Inicial"
                                                        size="small"
                                                        color="info"
                                                    />
                                                )}
                                                {state.isFinalState && (
                                                    <Chip
                                                        label="Final"
                                                        size="small"
                                                        color="success"
                                                    />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                {state.description && (
                                                    <Typography
                                                        variant="body2"
                                                        component="div"
                                                    >
                                                        {state.description}
                                                    </Typography>
                                                )}
                                                {state.requiredActions && (
                                                    <Typography
                                                        variant="caption"
                                                        component="div"
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        <strong>
                                                            Acciones:
                                                        </strong>{" "}
                                                        {(() => {
                                                            try {
                                                                const actions =
                                                                    JSON.parse(
                                                                        state.requiredActions
                                                                    );
                                                                return Array.isArray(
                                                                    actions
                                                                )
                                                                    ? actions.join(
                                                                          ", "
                                                                      )
                                                                    : state.requiredActions;
                                                            } catch {
                                                                return state.requiredActions;
                                                            }
                                                        })()}
                                                    </Typography>
                                                )}
                                                {state.responsibles.length >
                                                    0 && (
                                                    <Box sx={{ mt: 0.5 }}>
                                                        <Typography
                                                            variant="caption"
                                                            display="inline"
                                                            fontWeight="bold"
                                                        >
                                                            Responsables:{" "}
                                                        </Typography>
                                                        {state.responsibles.map(
                                                            (resp) => (
                                                                <Chip
                                                                    key={
                                                                        resp.id
                                                                    }
                                                                    label={`${resp.userName} ${resp.role ? `(${resp.role})` : ""}`}
                                                                    size="small"
                                                                    onDelete={() =>
                                                                        handleRemoveResponsible(
                                                                            state.id,
                                                                            resp.userId,
                                                                            resp.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        deletingResponsible ===
                                                                        resp.id
                                                                    }
                                                                    sx={{
                                                                        mr: 0.5,
                                                                        mt: 0.5,
                                                                    }}
                                                                />
                                                            )
                                                        )}
                                                        <Chip
                                                            label="+ Agregar"
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            onClick={() =>
                                                                handleAddResponsible(
                                                                    state.id
                                                                )
                                                            }
                                                            sx={{
                                                                mr: 0.5,
                                                                mt: 0.5,
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                                {state.responsibles.length ===
                                                    0 && (
                                                    <Box sx={{ mt: 0.5 }}>
                                                        <Button
                                                            size="small"
                                                            startIcon={
                                                                <AddIcon />
                                                            }
                                                            onClick={() =>
                                                                handleAddResponsible(
                                                                    state.id
                                                                )
                                                            }
                                                        >
                                                            Agregar Responsable
                                                        </Button>
                                                    </Box>
                                                )}
                                            </>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <Stack direction="row" spacing={0.5}>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    onEditState(state)
                                                }
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleDeleteState(state.id)
                                                }
                                                disabled={deleting === state.id}
                                                color="error"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </Paper>
                        ))}
                    </List>
                )}

                <Box
                    sx={{ mt: 3, p: 2, bgcolor: "info.light", borderRadius: 1 }}
                >
                    <Typography variant="caption" display="block">
                        <strong>Nota:</strong> Los estados se ordenan
                        automáticamente según el número de orden. El flujo va
                        del orden menor al mayor.
                    </Typography>
                </Box>
            </Paper>

            {/* Add Responsible Dialog */}
            {selectedStateForResponsible && (
                <AddResponsibleDialog
                    open={addResponsibleOpen}
                    onClose={() => {
                        setAddResponsibleOpen(false);
                        setSelectedStateForResponsible(null);
                    }}
                    onSuccess={handleResponsibleSuccess}
                    workflowStateId={selectedStateForResponsible}
                    projectId={projectId}
                />
            )}
        </Box>
    );
}
