import React, { useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Chip,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
} from "@mui/icons-material";
import type {
    IterationTask,
    CreateIterationTaskInput,
    UpdateIterationTaskInput,
} from "../../types/iterationProgress";

interface IterationTaskListProps {
    tasks: IterationTask[];
    onTaskCreate: (input: CreateIterationTaskInput) => Promise<void>;
    onTaskUpdate: (
        taskId: string,
        changes: UpdateIterationTaskInput
    ) => Promise<void>;
    onTaskDelete: (taskId: string) => Promise<void>;
}

const taskStatusColors: Record<
    string,
    "default" | "info" | "success" | "error"
> = {
    pending: "default",
    in_progress: "info",
    completed: "success",
    blocked: "error",
};

const taskStatusLabels: Record<string, string> = {
    pending: "Pendiente",
    in_progress: "En Progreso",
    completed: "Completada",
    blocked: "Bloqueada",
};

const taskStatuses = ["pending", "in_progress", "completed", "blocked"];

export function IterationTaskList({
    tasks,
    onTaskCreate,
    onTaskUpdate,
    onTaskDelete,
}: IterationTaskListProps) {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingTask, setEditingTask] = useState<IterationTask | null>(null);
    const [formData, setFormData] = useState<
        CreateIterationTaskInput | UpdateIterationTaskInput
    >({
        name: "",
        description: "",
        estimatedHours: 0,
        priority: 3,
    });

    const handleCreate = async () => {
        await onTaskCreate(formData as CreateIterationTaskInput);
        setShowCreateDialog(false);
        setFormData({
            name: "",
            description: "",
            estimatedHours: 0,
            priority: 3,
        });
    };

    const handleEdit = (task: IterationTask) => {
        setEditingTask(task);
        setFormData({
            name: task.name,
            description: task.description,
            estimatedHours: task.estimatedHours,
            actualHours: task.actualHours,
            status: task.status,
            priority: task.priority,
            blockerDescription: task.blockerDescription,
        });
        setShowEditDialog(true);
    };

    const handleUpdate = async () => {
        if (!editingTask) return;
        await onTaskUpdate(
            editingTask.id,
            formData as UpdateIterationTaskInput
        );
        setShowEditDialog(false);
        setEditingTask(null);
        setFormData({
            name: "",
            description: "",
            estimatedHours: 0,
            priority: 3,
        });
    };

    const handleDelete = async (taskId: string) => {
        if (confirm("¿Estás seguro de eliminar esta tarea?")) {
            await onTaskDelete(taskId);
        }
    };

    const totalHours = tasks.reduce(
        (sum, task) => sum + (task.estimatedHours || 0),
        0
    );
    const completedTasks = tasks.filter(
        (task) => task.status === "completed"
    ).length;

    return (
        <Box>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Box>
                    <Typography variant="h6">Tareas de la Iteración</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {completedTasks} / {tasks.length} tareas completadas •{" "}
                        {totalHours.toFixed(1)} horas estimadas
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowCreateDialog(true)}
                >
                    Nueva Tarea
                </Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Horas Est.</TableCell>
                            <TableCell>Horas Real</TableCell>
                            <TableCell>Asignado</TableCell>
                            <TableCell>Prioridad</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No hay tareas registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight="medium"
                                        >
                                            {task.name}
                                        </Typography>
                                        {task.description && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                display="block"
                                            >
                                                {task.description}
                                            </Typography>
                                        )}
                                        {task.status === "blocked" &&
                                            task.blockerDescription && (
                                                <Typography
                                                    variant="caption"
                                                    color="error"
                                                    display="block"
                                                >
                                                    🚫 {task.blockerDescription}
                                                </Typography>
                                            )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={
                                                taskStatusLabels[task.status] ||
                                                task.status
                                            }
                                            color={
                                                taskStatusColors[task.status] ||
                                                "default"
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {task.estimatedHours?.toFixed(1) || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {task.actualHours?.toFixed(1) || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {task.assignedToName || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.priority}
                                            size="small"
                                            color={
                                                task.priority <= 2
                                                    ? "error"
                                                    : task.priority <= 4
                                                      ? "warning"
                                                      : "default"
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(task)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() =>
                                                handleDelete(task.id)
                                            }
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Dialog */}
            <Dialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Nueva Tarea</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Nombre"
                            fullWidth
                            required
                            value={
                                (formData as CreateIterationTaskInput).name ||
                                ""
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Descripción"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Horas Estimadas"
                            type="number"
                            fullWidth
                            value={formData.estimatedHours || 0}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    estimatedHours: Number(e.target.value),
                                })
                            }
                        />
                        <TextField
                            label="Prioridad (1=Alta, 5=Baja)"
                            type="number"
                            fullWidth
                            value={
                                (formData as CreateIterationTaskInput)
                                    .priority || 3
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    priority: Number(e.target.value),
                                })
                            }
                            inputProps={{ min: 1, max: 5 }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCreateDialog(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCreate}
                        variant="contained"
                        disabled={!(formData as CreateIterationTaskInput).name}
                    >
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Editar Tarea</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Nombre"
                            fullWidth
                            required
                            value={
                                (formData as UpdateIterationTaskInput).name ||
                                ""
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Descripción"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Estado"
                            select
                            fullWidth
                            value={
                                (formData as UpdateIterationTaskInput).status ||
                                "pending"
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value,
                                })
                            }
                        >
                            {taskStatuses.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {taskStatusLabels[status]}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Horas Estimadas"
                            type="number"
                            fullWidth
                            value={formData.estimatedHours || 0}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    estimatedHours: Number(e.target.value),
                                })
                            }
                        />
                        <TextField
                            label="Horas Reales"
                            type="number"
                            fullWidth
                            value={
                                (formData as UpdateIterationTaskInput)
                                    .actualHours || 0
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    actualHours: Number(e.target.value),
                                })
                            }
                        />
                        <TextField
                            label="Prioridad (1=Alta, 5=Baja)"
                            type="number"
                            fullWidth
                            value={
                                (formData as UpdateIterationTaskInput)
                                    .priority || 3
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    priority: Number(e.target.value),
                                })
                            }
                            inputProps={{ min: 1, max: 5 }}
                        />
                        {(formData as UpdateIterationTaskInput).status ===
                            "blocked" && (
                            <TextField
                                label="Descripción del Bloqueo"
                                fullWidth
                                multiline
                                rows={2}
                                value={
                                    (formData as UpdateIterationTaskInput)
                                        .blockerDescription || ""
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        blockerDescription: e.target.value,
                                    })
                                }
                            />
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowEditDialog(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        variant="contained"
                        disabled={!(formData as UpdateIterationTaskInput).name}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
