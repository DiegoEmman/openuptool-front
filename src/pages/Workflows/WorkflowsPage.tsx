import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Box,
    Button,
    Tabs,
    Tab,
    CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type { Workflow, WorkflowState } from "../../types/workflow";
import { workflowService } from "../../services/workflowService";
import { WorkflowForm } from "../../components/workflow/WorkflowForm";
import { WorkflowsTable } from "../../components/workflow/WorkflowsTable";
import { WorkflowStatesView } from "../../components/workflow/WorkflowStatesView";
import { WorkflowStateForm } from "../../components/workflow/WorkflowStateForm";
import PermissionMatrixView from "../../components/workflow/PermissionMatrixView";

interface WorkflowsPageProps {
    projectId: string;
}

export function WorkflowsPage({ projectId }: WorkflowsPageProps) {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
        null
    );
    const [currentTab, setCurrentTab] = useState(0);

    // Dialog states
    const [createWorkflowOpen, setCreateWorkflowOpen] = useState(false);
    const [editWorkflowOpen, setEditWorkflowOpen] = useState(false);
    const [workflowToEdit, setWorkflowToEdit] = useState<
        Workflow | undefined
    >();
    const [createStateOpen, setCreateStateOpen] = useState(false);
    const [editStateOpen, setEditStateOpen] = useState(false);
    const [stateToEdit, setStateToEdit] = useState<WorkflowState | undefined>();

    useEffect(() => {
        if (projectId) {
            loadWorkflows();
        }
    }, [projectId]);

    const loadWorkflows = async () => {
        if (!projectId) return;
        setLoading(true);
        const data = await workflowService.getByProject(projectId);
        if (data) {
            setWorkflows(data);
            if (data.length > 0 && !selectedWorkflow) {
                setSelectedWorkflow(data[0]);
            }
        }
        setLoading(false);
    };

    const handleWorkflowSelect = (workflow: Workflow) => {
        setSelectedWorkflow(workflow);
        setCurrentTab(1);
    };

    const handleEditWorkflow = (workflow: Workflow) => {
        setWorkflowToEdit(workflow);
        setEditWorkflowOpen(true);
    };

    const handleAddState = () => {
        setStateToEdit(undefined);
        setCreateStateOpen(true);
    };

    const handleEditState = (state: WorkflowState) => {
        setStateToEdit(state);
        setEditStateOpen(true);
    };

    const handleWorkflowSuccess = () => {
        loadWorkflows();
        setCreateWorkflowOpen(false);
        setEditWorkflowOpen(false);
        setWorkflowToEdit(undefined);
    };

    const handleStateSuccess = async () => {
        // Reload the selected workflow to get updated states
        if (selectedWorkflow) {
            const updated = await workflowService.getById(selectedWorkflow.id);
            if (updated) {
                setSelectedWorkflow(updated);
                // Also update in the list
                setWorkflows((prev) =>
                    prev.map((w) => (w.id === updated.id ? updated : w))
                );
            }
        }
        setCreateStateOpen(false);
        setEditStateOpen(false);
        setStateToEdit(undefined);
    };

    if (loading) {
        return (
            <Container
                sx={{ display: "flex", justifyContent: "center", py: 4 }}
            >
                <CircularProgress />
            </Container>
        );
    }

    if (!projectId) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography color="error">
                    ID de proyecto no encontrado
                </Typography>
            </Container>
        );
    }

    console.log(
        "🔥 WorkflowsPage ACTUALIZADO - Debe tener 3 tabs",
        selectedWorkflow
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Gestión de Flujos de Trabajo
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Configura flujos de trabajo con estados y responsables para
                    gestionar el ciclo de vida de tus artefactos.
                </Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
                    <Tab label="Lista de Flujos" />
                    <Tab
                        label="Gestionar Estados"
                        disabled={!selectedWorkflow}
                    />
                    <Tab label="Permisos" disabled={!selectedWorkflow} />
                </Tabs>
            </Box>

            {currentTab === 0 && (
                <>
                    <Box
                        sx={{
                            mb: 2,
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            startIcon={<AddIcon />}
                            variant="contained"
                            onClick={() => setCreateWorkflowOpen(true)}
                        >
                            Crear Flujo de Trabajo
                        </Button>
                    </Box>

                    {workflows.length === 0 ? (
                        <Box
                            sx={{
                                textAlign: "center",
                                py: 8,
                                bgcolor: "background.paper",
                                borderRadius: 1,
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                No hay flujos de trabajo
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ mb: 3 }}
                            >
                                Crea el primer flujo de trabajo para este
                                proyecto
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setCreateWorkflowOpen(true)}
                            >
                                Crear Flujo de Trabajo
                            </Button>
                        </Box>
                    ) : (
                        <WorkflowsTable
                            workflows={workflows}
                            onView={handleWorkflowSelect}
                            onEdit={handleEditWorkflow}
                            onDelete={loadWorkflows}
                        />
                    )}
                </>
            )}

            {currentTab === 1 && selectedWorkflow && (
                <WorkflowStatesView
                    workflow={selectedWorkflow}
                    onAddState={handleAddState}
                    onEditState={handleEditState}
                    onRefresh={handleStateSuccess}
                    projectId={projectId}
                />
            )}

            {currentTab === 2 && selectedWorkflow && (
                <PermissionMatrixView workflowId={selectedWorkflow.id} />
            )}

            {/* Dialogs */}
            <WorkflowForm
                open={createWorkflowOpen}
                onClose={() => setCreateWorkflowOpen(false)}
                onSuccess={handleWorkflowSuccess}
                projectId={projectId}
            />

            <WorkflowForm
                open={editWorkflowOpen}
                onClose={() => {
                    setEditWorkflowOpen(false);
                    setWorkflowToEdit(undefined);
                }}
                onSuccess={handleWorkflowSuccess}
                projectId={projectId}
                workflow={workflowToEdit}
            />

            {selectedWorkflow && (
                <>
                    <WorkflowStateForm
                        open={createStateOpen}
                        onClose={() => setCreateStateOpen(false)}
                        onSuccess={handleStateSuccess}
                        workflowId={selectedWorkflow.id}
                        nextOrder={selectedWorkflow.states.length + 1}
                    />

                    {stateToEdit && (
                        <WorkflowStateForm
                            open={editStateOpen}
                            onClose={() => {
                                setEditStateOpen(false);
                                setStateToEdit(undefined);
                            }}
                            onSuccess={handleStateSuccess}
                            workflowId={selectedWorkflow.id}
                            state={stateToEdit}
                            nextOrder={selectedWorkflow.states.length + 1}
                        />
                    )}
                </>
            )}
        </Container>
    );
}
