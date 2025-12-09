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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Typography,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Collapse,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { configurationService } from "../../services/configurationService";
import type {
    WorkflowTemplate,
    CreateWorkflowTemplateInput,
    UpdateWorkflowTemplateInput,
    WorkflowStateTemplate,
    CreateWorkflowStateTemplateInput,
    PhaseTemplate,
} from "../../types/configuration";

interface WorkflowManagementProps {
    configId: string;
}

export function WorkflowManagement({ configId }: WorkflowManagementProps) {
    const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);
    const [phases, setPhases] = useState<PhaseTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [stateDialogOpen, setStateDialogOpen] = useState(false);
    const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(
        null
    );
    const [editingWorkflow, setEditingWorkflow] =
        useState<WorkflowTemplate | null>(null);
    const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
        null
    );
    const [workflowStates, setWorkflowStates] = useState<
        WorkflowStateTemplate[]
    >([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        applicablePhases: [] as string[],
    });
    const [stateFormData, setStateFormData] = useState({
        name: "",
        description: "",
        orderIndex: 0,
        color: "#808080",
        isInitialState: false,
        isFinalState: false,
    });

    useEffect(() => {
        loadData();
    }, [configId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [workflowsData, phasesData] = await Promise.all([
                configurationService.getWorkflows(configId),
                configurationService.getPhases(configId),
            ]);
            setWorkflows(workflowsData);
            setPhases(phasesData.sort((a, b) => a.orderIndex - b.orderIndex));
        } catch (err) {
            setError("Error al cargar datos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadWorkflowStates = async (workflowId: string) => {
        try {
            const states = await configurationService.getWorkflowStates(
                configId,
                workflowId
            );
            setWorkflowStates(
                states.sort((a, b) => a.orderIndex - b.orderIndex)
            );
        } catch (err) {
            setError("Error al cargar estados del flujo");
            console.error(err);
        }
    };

    const handleExpandWorkflow = async (workflowId: string) => {
        if (expandedWorkflow === workflowId) {
            setExpandedWorkflow(null);
        } else {
            setExpandedWorkflow(workflowId);
            await loadWorkflowStates(workflowId);
        }
    };

    const handleOpenDialog = (workflow?: WorkflowTemplate) => {
        if (workflow) {
            setEditingWorkflow(workflow);
            setFormData({
                name: workflow.name,
                description: workflow.description || "",
                applicablePhases: workflow.applicablePhases || [],
            });
        } else {
            setEditingWorkflow(null);
            setFormData({
                name: "",
                description: "",
                applicablePhases: [],
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingWorkflow(null);
        setFormData({ name: "", description: "", applicablePhases: [] });
    };

    const handleSubmit = async () => {
        try {
            if (editingWorkflow) {
                const input: UpdateWorkflowTemplateInput = {
                    name: formData.name,
                    description: formData.description || undefined,
                    applicablePhases: formData.applicablePhases,
                };
                await configurationService.updateWorkflow(
                    configId,
                    editingWorkflow.id,
                    input
                );
            } else {
                const input: CreateWorkflowTemplateInput = {
                    name: formData.name,
                    description: formData.description || undefined,
                    applicablePhases: formData.applicablePhases,
                };
                await configurationService.createWorkflow(configId, input);
            }
            handleCloseDialog();
            loadData();
        } catch (err) {
            setError("Error al guardar flujo de trabajo");
            console.error(err);
        }
    };

    const handleDelete = async (workflowId: string) => {
        if (!window.confirm("¿Estás seguro de eliminar este flujo de trabajo?"))
            return;

        try {
            await configurationService.deleteWorkflow(configId, workflowId);
            loadData();
        } catch (err) {
            setError("Error al eliminar flujo de trabajo");
            console.error(err);
        }
    };

    const handleOpenStateDialog = (workflowId: string) => {
        setSelectedWorkflowId(workflowId);
        setStateFormData({
            name: "",
            description: "",
            orderIndex: workflowStates.length + 1,
            color: "#808080",
            isInitialState: false,
            isFinalState: false,
        });
        setStateDialogOpen(true);
    };

    const handleCloseStateDialog = () => {
        setStateDialogOpen(false);
        setSelectedWorkflowId(null);
        setStateFormData({
            name: "",
            description: "",
            orderIndex: 0,
            color: "#808080",
            isInitialState: false,
            isFinalState: false,
        });
    };

    const handleSubmitState = async () => {
        if (!selectedWorkflowId) return;

        try {
            const input: CreateWorkflowStateTemplateInput = {
                workflowTemplateId: selectedWorkflowId,
                name: stateFormData.name,
                description: stateFormData.description || undefined,
                orderIndex: stateFormData.orderIndex,
                color: stateFormData.color,
                isInitialState: stateFormData.isInitialState,
                isFinalState: stateFormData.isFinalState,
            };
            await configurationService.createWorkflowState(
                configId,
                selectedWorkflowId,
                input
            );
            handleCloseStateDialog();
            loadWorkflowStates(selectedWorkflowId);
        } catch (err) {
            setError("Error al crear estado");
            console.error(err);
        }
    };

    const handleDeleteState = async (stateId: string) => {
        if (
            !expandedWorkflow ||
            !window.confirm("¿Estás seguro de eliminar este estado?")
        )
            return;

        try {
            await configurationService.deleteWorkflowState(
                configId,
                expandedWorkflow,
                stateId
            );
            loadWorkflowStates(expandedWorkflow);
        } catch (err) {
            setError("Error al eliminar estado");
            console.error(err);
        }
    };

    const getPhaseName = (phaseCode: string) => {
        return phases.find((p) => p.code === phaseCode)?.name || phaseCode;
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
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h6">Flujos de Trabajo</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo Flujo de Trabajo
                </Button>
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
                Los flujos de trabajo definen los estados posibles de los
                artefactos en cada fase
            </Alert>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={50}></TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Fases Aplicables</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workflows.map((workflow) => (
                            <React.Fragment key={workflow.id}>
                                <TableRow>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                handleExpandWorkflow(
                                                    workflow.id
                                                )
                                            }
                                        >
                                            {expandedWorkflow ===
                                            workflow.id ? (
                                                <ExpandLessIcon />
                                            ) : (
                                                <ExpandMoreIcon />
                                            )}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight="medium"
                                        >
                                            {workflow.name}
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
                                            {workflow.applicablePhases?.map(
                                                (phaseCode) => (
                                                    <Chip
                                                        key={phaseCode}
                                                        label={getPhaseName(
                                                            phaseCode
                                                        )}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )
                                            ) || "-"}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {workflow.description || "-"}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() =>
                                                handleOpenDialog(workflow)
                                            }
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() =>
                                                handleDelete(workflow.id)
                                            }
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        sx={{ p: 0, borderBottom: "none" }}
                                    >
                                        <Collapse
                                            in={
                                                expandedWorkflow === workflow.id
                                            }
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    bgcolor:
                                                        "background.default",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle2"
                                                        color="text.secondary"
                                                    >
                                                        Estados del Flujo
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        startIcon={<AddIcon />}
                                                        onClick={() =>
                                                            handleOpenStateDialog(
                                                                workflow.id
                                                            )
                                                        }
                                                    >
                                                        Agregar Estado
                                                    </Button>
                                                </Box>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>
                                                                Orden
                                                            </TableCell>
                                                            <TableCell>
                                                                Nombre
                                                            </TableCell>
                                                            <TableCell>
                                                                Color
                                                            </TableCell>
                                                            <TableCell>
                                                                Inicial
                                                            </TableCell>
                                                            <TableCell>
                                                                Final
                                                            </TableCell>
                                                            <TableCell>
                                                                Descripción
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                Acciones
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {workflowStates.map(
                                                            (state) => (
                                                                <TableRow
                                                                    key={
                                                                        state.id
                                                                    }
                                                                >
                                                                    <TableCell>
                                                                        {
                                                                            state.orderIndex
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            state.name
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Box
                                                                            sx={{
                                                                                width: 30,
                                                                                height: 20,
                                                                                bgcolor:
                                                                                    state.color ||
                                                                                    "#808080",
                                                                                border: "1px solid #ddd",
                                                                                borderRadius: 1,
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {state.isInitialState && (
                                                                            <Chip
                                                                                label="Inicial"
                                                                                size="small"
                                                                                color="primary"
                                                                            />
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {state.isFinalState && (
                                                                            <Chip
                                                                                label="Final"
                                                                                size="small"
                                                                                color="success"
                                                                            />
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {state.description ||
                                                                            "-"}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="error"
                                                                            onClick={() =>
                                                                                handleDeleteState(
                                                                                    state.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )}
                                                        {workflowStates.length ===
                                                            0 && (
                                                            <TableRow>
                                                                <TableCell
                                                                    colSpan={6}
                                                                    align="center"
                                                                >
                                                                    No hay
                                                                    estados
                                                                    configurados
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                        {workflows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No hay flujos de trabajo configurados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Workflow */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingWorkflow
                        ? "Editar Flujo de Trabajo"
                        : "Nuevo Flujo de Trabajo"}
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        <TextField
                            label="Nombre"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            required
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Fases Aplicables</InputLabel>
                            <Select
                                multiple
                                value={formData.applicablePhases}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        applicablePhases: e.target
                                            .value as string[],
                                    })
                                }
                                input={
                                    <OutlinedInput label="Fases Aplicables" />
                                }
                                renderValue={(selected) => (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5,
                                        }}
                                    >
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={getPhaseName(value)}
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                )}
                            >
                                {phases.map((phase) => (
                                    <MenuItem key={phase.id} value={phase.code}>
                                        {phase.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Descripción"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            multiline
                            rows={3}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.name.trim()}
                    >
                        {editingWorkflow ? "Actualizar" : "Crear"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Workflow State */}
            <Dialog
                open={stateDialogOpen}
                onClose={handleCloseStateDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Nuevo Estado</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        <TextField
                            label="Nombre"
                            value={stateFormData.name}
                            onChange={(e) =>
                                setStateFormData({
                                    ...stateFormData,
                                    name: e.target.value,
                                })
                            }
                            required
                            fullWidth
                        />
                        <TextField
                            label="Descripción"
                            value={stateFormData.description}
                            onChange={(e) =>
                                setStateFormData({
                                    ...stateFormData,
                                    description: e.target.value,
                                })
                            }
                            multiline
                            rows={2}
                            fullWidth
                        />
                        <TextField
                            label="Orden"
                            type="number"
                            value={stateFormData.orderIndex}
                            onChange={(e) =>
                                setStateFormData({
                                    ...stateFormData,
                                    orderIndex: parseInt(e.target.value) || 0,
                                })
                            }
                            fullWidth
                        />
                        <TextField
                            label="Color"
                            type="color"
                            value={stateFormData.color}
                            onChange={(e) =>
                                setStateFormData({
                                    ...stateFormData,
                                    color: e.target.value,
                                })
                            }
                            fullWidth
                            helperText="Color para mostrar en la interfaz"
                        />
                        <FormControl>
                            <InputLabel>Estado Inicial</InputLabel>
                            <Select
                                value={
                                    stateFormData.isInitialState
                                        ? "true"
                                        : "false"
                                }
                                onChange={(e) =>
                                    setStateFormData({
                                        ...stateFormData,
                                        isInitialState:
                                            e.target.value === "true",
                                    })
                                }
                                label="Estado Inicial"
                            >
                                <MenuItem value="false">No</MenuItem>
                                <MenuItem value="true">Sí</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel>Estado Final</InputLabel>
                            <Select
                                value={
                                    stateFormData.isFinalState
                                        ? "true"
                                        : "false"
                                }
                                onChange={(e) =>
                                    setStateFormData({
                                        ...stateFormData,
                                        isFinalState: e.target.value === "true",
                                    })
                                }
                                label="Estado Final"
                            >
                                <MenuItem value="false">No</MenuItem>
                                <MenuItem value="true">Sí</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseStateDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSubmitState}
                        variant="contained"
                        disabled={!stateFormData.name.trim()}
                    >
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
