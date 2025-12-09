import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { projectService } from "../../services/projectService";
import { planService } from "../../services/planService";
import { artifactCatalogService } from "../../services/artifactCatalogService";
import { artifactService } from "../../services/artifactService";
import { iterationService } from "../../services/iterationService";
import { Navbar } from "../../components/common/Navbar";
import { ProjectActionsMenu } from "../../components/common/ProjectActionsMenu";
import type { PhaseCode } from "../../types/artifact";
import type {
    Project,
    ProjectPlan,
    Artifact,
    Iteration,
    ArtifactType,
} from "../../types";
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    Stack,
    Card,
    CardContent,
    Breadcrumbs,
    CircularProgress,
    Chip,
    Alert,
    Divider,
} from "@mui/material";
import { PlanForm } from "../../components/plan/PlanForm";
import { PlanSummary } from "../../components/plan/PlanSummary";
import { InceptionArtifactCatalog } from "../../components/artifacts/InceptionArtifactCatalog";
import { ArtifactCreateForm } from "../../components/artifacts/ArtifactCreateForm";
import { PhaseArtifactsView } from "../../components/artifacts/PhaseArtifactsView";
import { IterationForm } from "../../components/iterations/IterationForm";
import { IterationsTable } from "../../components/iterations/IterationsTable";
import { VelocityStatsView } from "../../components/iterations/VelocityStatsView";
import { InviteUserModal } from "../../components/invitations/InviteUserModal";
import { InvitationsList } from "../../components/invitations/InvitationsList";
import { ProjectProgressSummary } from "../../components/plan/ProjectProgressSummary";
import { iterationProgressService } from "../../services/iterationProgressService";
import type { IterationSummary } from "../../types/iterationProgress";
import { useAuth } from "../../contexts/AuthContext";
import { AuditLogsTable } from "../../components/common/AuditLogsTable";
import { microincrementService } from "../../services/microincrementService";
import { MicroincrementForm } from "../../components/common/MicroincrementForm";
import { MicroincrementsTable } from "../../components/common/MicroincrementsTable";
import type {
    Microincrement,
    CreateMicroincrementInput,
    MicroincrementFilters,
} from "../../types/microincrement";
import {
    finalBuildService,
    projectClosureService,
} from "../../services/transitionService";
import type { FinalBuild, ProjectClosure } from "../../types/transition";
import { FinalBuildForm } from "../../components/transition/FinalBuildForm";
import { FinalBuildsTable } from "../../components/transition/FinalBuildsTable";
import { ProjectClosureForm } from "../../components/transition/ProjectClosureForm";
import { ProjectClosureView } from "../../components/transition/ProjectClosureView";
import { WorkflowsTable } from "../../components/workflow/WorkflowsTable";
import { WorkflowForm } from "../../components/workflow/WorkflowForm";
import { WorkflowStatesView } from "../../components/workflow/WorkflowStatesView";
import { WorkflowStateForm } from "../../components/workflow/WorkflowStateForm";
import PermissionMatrixView from "../../components/workflow/PermissionMatrixView";
import type { Workflow, WorkflowState } from "../../types/workflow";
import { workflowService } from "../../services/workflowService";

function formatDate(dateString: string | undefined): string {
    if (!dateString) return "-";
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
}

export function ProjectDetailPage() {
    const { id: projectId } = useParams<{ id: string }>();
    const { hasRole } = useAuth();
    const [project, setProject] = useState<Project | undefined>();
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [plan, setPlan] = useState<ProjectPlan | undefined>();
    const [showPlanForm, setShowPlanForm] = useState(false);
    const [showArtifactForm, setShowArtifactForm] = useState(false);
    const [showIterationForm, setShowIterationForm] = useState(false);
    const [catalogRefresh, setCatalogRefresh] = useState(0);
    const phase: PhaseCode = "INCEPTION";
    const [artifactTypes, setArtifactTypes] = useState<ArtifactType[]>([]);
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [iterations, setIterations] = useState<Iteration[]>([]);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [iterationSummaries, setIterationSummaries] = useState<
        IterationSummary[]
    >([]);
    const [microincrements, setMicroincrements] = useState<Microincrement[]>(
        []
    );
    const [showMicroincrementForm, setShowMicroincrementForm] = useState(false);
    const [editingMicroincrement, setEditingMicroincrement] = useState<
        Microincrement | undefined
    >();
    const [finalBuilds, setFinalBuilds] = useState<FinalBuild[]>([]);
    const [projectClosure, setProjectClosure] = useState<
        ProjectClosure | undefined
    >();
    const [showBuildForm, setShowBuildForm] = useState(false);
    const [editingBuild, setEditingBuild] = useState<FinalBuild | undefined>();
    const [showClosureForm, setShowClosureForm] = useState(false);

    // Workflows state
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
        null
    );
    const [showWorkflowForm, setShowWorkflowForm] = useState(false);
    const [editingWorkflow, setEditingWorkflow] = useState<
        Workflow | undefined
    >();
    const [showStateForm, setShowStateForm] = useState(false);
    const [editingState, setEditingState] = useState<
        WorkflowState | undefined
    >();
    const [workflowSubTab, setWorkflowSubTab] = useState(0);
    const [workflowsLoaded, setWorkflowsLoaded] = useState(false);
    const [iterationSubTab, setIterationSubTab] = useState(0);

    useEffect(() => {
        loadProjectData();
    }, [projectId, catalogRefresh]);

    const loadProjectData = () => {
        if (!projectId) return;

        Promise.all([
            projectService.get(projectId),
            planService.getPlanByProject(projectId),
            artifactCatalogService.getArtifactTypesByPhase(phase),
            artifactService.getArtifacts(projectId, phase),
            iterationService.getIterations(projectId),
            microincrementService.list(),
            finalBuildService.getByProject(projectId),
            projectClosureService.getByProject(projectId),
        ])
            .then(
                async ([
                    proj,
                    pln,
                    types,
                    arts,
                    iters,
                    micros,
                    builds,
                    closure,
                ]) => {
                    setProject(proj);
                    setPlan(pln);
                    setArtifactTypes(types);
                    setArtifacts(arts);
                    setIterations(iters);
                    setMicroincrements(micros);
                    setFinalBuilds(builds);
                    setProjectClosure(closure);

                    // Load iteration summaries for progress tracking
                    if (iters.length > 0) {
                        const summaries = await Promise.all(
                            iters.map((iter) =>
                                iterationProgressService
                                    .getSummary(iter.id)
                                    .catch(() => null)
                            )
                        );
                        setIterationSummaries(
                            summaries.filter(
                                (s) => s !== null
                            ) as IterationSummary[]
                        );
                    }

                    setLoading(false);
                }
            )
            .catch((error) => {
                console.error("Error loading project details:", error);
                setLoading(false);
            });
    };

    const handleProjectUpdated = (updatedProject: Project) => {
        setProject(updatedProject);
    };

    const loadWorkflows = async () => {
        if (!projectId) return;
        const data = await workflowService.getByProject(projectId);
        if (data) {
            setWorkflows(data);
            if (data.length > 0 && !selectedWorkflow) {
                setSelectedWorkflow(data[0]);
            }
        }
        setWorkflowsLoaded(true);
    };

    const handleWorkflowSuccess = async () => {
        await loadWorkflows();
        setShowWorkflowForm(false);
        setEditingWorkflow(undefined);
    };

    const handleStateSuccess = async () => {
        if (selectedWorkflow) {
            const updated = await workflowService.getById(selectedWorkflow.id);
            if (updated) {
                setSelectedWorkflow(updated);
                setWorkflows((prev) =>
                    prev.map((w) => (w.id === updated.id ? updated : w))
                );
            }
        }
        setShowStateForm(false);
        setEditingState(undefined);
    };

    useEffect(() => {
        if (tab === 9 && !workflowsLoaded) {
            loadWorkflows();
        }
    }, [tab]);

    if (loading) {
        return (
            <>
                <Navbar />
                <Container
                    sx={{ py: 4, display: "flex", justifyContent: "center" }}
                >
                    <CircularProgress />
                </Container>
            </>
        );
    }

    if (!project) {
        return (
            <>
                <Navbar />
                <Container sx={{ py: 4 }}>
                    <Typography variant="h5">Proyecto no encontrado</Typography>
                    <Button component={Link} to="/projects" sx={{ mt: 2 }}>
                        Volver
                    </Button>
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container sx={{ py: 4 }}>
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Link
                        to="/projects"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        Proyectos
                    </Link>
                    <Typography color="text.primary">{project.name}</Typography>
                </Breadcrumbs>

                {project.isArchived && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Este proyecto está archivado. Para modificarlo, primero
                        debe desarchivarlo.
                    </Alert>
                )}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="h4">{project.name}</Typography>
                        {project.isArchived && (
                            <Chip
                                label="Archivado"
                                color="warning"
                                size="small"
                            />
                        )}
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                        {hasRole(["Admin", "Manager"]) && (
                            <ProjectActionsMenu
                                project={project}
                                onProjectUpdated={handleProjectUpdated}
                            />
                        )}
                        <Button component={Link} to="/projects">
                            Volver
                        </Button>
                    </Box>
                </Stack>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{ mb: 3 }}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    <Tab label="Resumen" />
                    <Tab label="Plan del Proyecto" />
                    <Tab label="Incepción" />
                    <Tab label="Elaboración" />
                    <Tab label="Construcción" />
                    <Tab label="Transición" />
                    <Tab label="Iteraciones" />
                    <Tab label="Microincrementos" />
                    <Tab label="Testing" />
                    <Tab label="Flujos de Trabajo" />
                    <Tab label="Equipo" />
                    {hasRole(["Admin", "Manager"]) && <Tab label="Auditoría" />}
                </Tabs>
                {tab === 0 && (
                    <Box>
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">Datos</Typography>
                                <Typography>
                                    Identificador: {project.identifier}
                                </Typography>
                                <Typography>
                                    Inicio: {formatDate(project.startDate)}
                                </Typography>
                                <Typography>
                                    Estado: {project.status}
                                </Typography>
                                <Typography>
                                    Responsable: {project.owner || "-"}
                                </Typography>
                                <Typography>
                                    Tags: {project.tags.join(", ") || "-"}
                                </Typography>
                                <Typography>
                                    Descripción: {project.description || "-"}
                                </Typography>
                            </CardContent>
                        </Card>

                        {iterationSummaries.length > 0 && (
                            <ProjectProgressSummary
                                projectId={project.id}
                                iterations={iterationSummaries}
                            />
                        )}
                    </Box>
                )}
                {tab === 1 && (
                    <Box>
                        {!plan && !showPlanForm && (
                            <Button
                                variant="contained"
                                onClick={() => setShowPlanForm(true)}
                            >
                                Crear plan inicial
                            </Button>
                        )}
                        {showPlanForm && !plan && (
                            <PlanForm
                                projectId={project.id}
                                onCancel={() => setShowPlanForm(false)}
                                onCreated={() => {
                                    setShowPlanForm(false);
                                    // Recargar plan
                                    planService
                                        .getPlanByProject(project.id)
                                        .then(setPlan);
                                }}
                            />
                        )}
                        {plan && (
                            <PlanSummary
                                plan={plan}
                                projectName={project.name}
                            />
                        )}
                    </Box>
                )}
                {tab === 2 && (
                    <Box>
                        <Stack direction="row" gap={2} mb={2}>
                            <Button
                                variant="outlined"
                                onClick={() => setShowArtifactForm((v) => !v)}
                            >
                                Agregar artefacto
                            </Button>
                        </Stack>
                        {showArtifactForm && (
                            <ArtifactCreateForm
                                projectId={project.id}
                                phaseId={phase}
                                types={artifactTypes}
                                onCreated={() => {
                                    setShowArtifactForm(false);
                                    // Recargar artefactos
                                    artifactService
                                        .getArtifacts(projectId, phase)
                                        .then(setArtifacts);
                                    setCatalogRefresh((c) => c + 1);
                                }}
                                onCancel={() => setShowArtifactForm(false)}
                            />
                        )}
                        <InceptionArtifactCatalog
                            types={artifactTypes}
                            onUpdate={() => setCatalogRefresh((c) => c + 1)}
                        />
                        <PhaseArtifactsView
                            artifacts={artifacts}
                            projectId={projectId}
                            onUpdate={() => {
                                // Recargar artefactos
                                artifactService
                                    .getArtifacts(projectId, "INCEPTION")
                                    .then(setArtifacts);
                            }}
                        />
                    </Box>
                )}
                {tab === 3 && (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Fase de Elaboración
                        </Typography>
                        <Card sx={{ p: 3, textAlign: "center" }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Gestiona los artefactos de la fase de
                                Elaboración del proyecto
                            </Typography>
                            <Button
                                component={Link}
                                to={`/projects/${projectId}/elaboration`}
                                variant="contained"
                                size="large"
                            >
                                Ir a Elaboración
                            </Button>
                        </Card>
                    </Box>
                )}
                {tab === 4 && (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Fase de Construcción
                        </Typography>
                        <Card sx={{ p: 3, textAlign: "center" }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Gestiona los artefactos de la fase de
                                Construcción: código fuente, casos de prueba,
                                resultados y actividades de iteración
                            </Typography>
                            <Button
                                component={Link}
                                to={`/projects/${projectId}/construction`}
                                variant="contained"
                                size="large"
                            >
                                Ir a Construcción
                            </Button>
                        </Card>
                    </Box>
                )}
                {tab === 5 && (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Fase de Transición
                        </Typography>

                        {/* Final Builds Section */}
                        <Box sx={{ mb: 4 }}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={2}
                            >
                                <Typography variant="h6">
                                    Builds Finales
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setEditingBuild(undefined);
                                        setShowBuildForm(true);
                                    }}
                                >
                                    + Nuevo Build
                                </Button>
                            </Stack>

                            <FinalBuildsTable
                                builds={finalBuilds}
                                onEdit={(build) => {
                                    setEditingBuild(build);
                                    setShowBuildForm(true);
                                }}
                                onDelete={async (build) => {
                                    if (
                                        window.confirm(
                                            `¿Eliminar el build ${build.buildNumber}?`
                                        )
                                    ) {
                                        const success =
                                            await finalBuildService.delete(
                                                build.id
                                            );
                                        if (success) {
                                            const updated =
                                                await finalBuildService.getByProject(
                                                    projectId
                                                );
                                            setFinalBuilds(updated);
                                        }
                                    }
                                }}
                            />

                            <FinalBuildForm
                                open={showBuildForm}
                                onClose={() => {
                                    setShowBuildForm(false);
                                    setEditingBuild(undefined);
                                }}
                                onSuccess={async () => {
                                    const updated =
                                        await finalBuildService.getByProject(
                                            projectId
                                        );
                                    setFinalBuilds(updated);
                                }}
                                projectId={projectId}
                                build={editingBuild}
                            />
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        {/* Project Closure Section */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Cierre del Proyecto
                            </Typography>

                            <ProjectClosureView
                                projectId={projectId}
                                closure={projectClosure}
                                onEdit={() => setShowClosureForm(true)}
                                onRefresh={async () => {
                                    const updated =
                                        await projectClosureService.getByProject(
                                            projectId
                                        );
                                    setProjectClosure(updated);
                                }}
                            />

                            <ProjectClosureForm
                                open={showClosureForm}
                                onClose={() => setShowClosureForm(false)}
                                onSuccess={async () => {
                                    const updated =
                                        await projectClosureService.getByProject(
                                            projectId
                                        );
                                    setProjectClosure(updated);
                                }}
                                projectId={projectId}
                                closure={projectClosure}
                            />
                        </Box>
                    </Box>
                )}
                {tab === 6 && (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Iteraciones y Planificación
                        </Typography>

                        <Tabs
                            value={iterationSubTab}
                            onChange={(_, v) => setIterationSubTab(v)}
                            sx={{
                                mb: 3,
                                borderBottom: 1,
                                borderColor: "divider",
                            }}
                        >
                            <Tab label="Gestionar Iteraciones" />
                            <Tab label="Velocidad y Capacidad" />
                        </Tabs>

                        {iterationSubTab === 0 && (
                            <>
                                <Stack direction="row" gap={2} mb={2}>
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            setShowIterationForm((v) => !v)
                                        }
                                    >
                                        Nueva Iteración
                                    </Button>
                                </Stack>
                                {showIterationForm && (
                                    <IterationForm
                                        projectId={project.id}
                                        onCreated={() => {
                                            setShowIterationForm(false);
                                            // Recargar iteraciones
                                            iterationService
                                                .getIterations(projectId)
                                                .then(setIterations);
                                        }}
                                        onCancel={() =>
                                            setShowIterationForm(false)
                                        }
                                    />
                                )}
                                <IterationsTable
                                    iterations={iterations}
                                    projectId={projectId}
                                    onUpdate={() => {
                                        // Recargar iteraciones
                                        iterationService
                                            .getIterations(projectId)
                                            .then(setIterations);
                                    }}
                                />
                            </>
                        )}

                        {iterationSubTab === 1 && (
                            <VelocityStatsView projectId={projectId} />
                        )}
                    </Box>
                )}
                {tab === 7 && (
                    <Box>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={3}
                        >
                            <Typography variant="h5">
                                Microincrementos
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setEditingMicroincrement(undefined);
                                    setShowMicroincrementForm(true);
                                }}
                            >
                                + Nuevo Microincremento
                            </Button>
                        </Stack>

                        <MicroincrementsTable
                            microincrements={microincrements}
                            iterations={iterations}
                            artifacts={artifacts}
                            onEdit={(micro) => {
                                setEditingMicroincrement(micro);
                                setShowMicroincrementForm(true);
                            }}
                            onDelete={async (id) => {
                                const success =
                                    await microincrementService.delete(id);
                                if (success) {
                                    const updated =
                                        await microincrementService.list();
                                    setMicroincrements(updated);
                                }
                            }}
                            onFilterChange={async (filters) => {
                                const filtered =
                                    await microincrementService.getFiltered(
                                        filters
                                    );
                                setMicroincrements(filtered);
                            }}
                        />

                        <MicroincrementForm
                            open={showMicroincrementForm}
                            onClose={() => {
                                setShowMicroincrementForm(false);
                                setEditingMicroincrement(undefined);
                            }}
                            onSubmit={async (data) => {
                                if (editingMicroincrement) {
                                    await microincrementService.update(
                                        editingMicroincrement.id,
                                        data
                                    );
                                } else {
                                    await microincrementService.create(data);
                                }
                                const updated =
                                    await microincrementService.list();
                                setMicroincrements(updated);
                            }}
                            iterations={iterations}
                            artifacts={artifacts}
                            editData={editingMicroincrement}
                            projectId={projectId}
                        />
                    </Box>
                )}
                {tab === 8 && (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Testing y Defectos
                        </Typography>
                        <Card sx={{ p: 3, textAlign: "center" }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Gestiona ejecuciones de pruebas, resultados y
                                defectos del proyecto
                            </Typography>
                            <Button
                                component={Link}
                                to={`/projects/${projectId}/testing`}
                                variant="contained"
                                size="large"
                            >
                                Ir a Testing
                            </Button>
                        </Card>
                    </Box>
                )}
                {tab === 9 && (
                    <Box>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Gestión de Flujos de Trabajo
                        </Typography>

                        <Tabs
                            value={workflowSubTab}
                            onChange={(_, v) => setWorkflowSubTab(v)}
                            sx={{
                                mb: 3,
                                borderBottom: 1,
                                borderColor: "divider",
                            }}
                        >
                            <Tab label="Lista de Flujos" />
                            <Tab
                                label="Gestionar Estados"
                                disabled={!selectedWorkflow}
                            />
                            <Tab
                                label="Permisos"
                                disabled={!selectedWorkflow}
                            />
                        </Tabs>

                        {workflowSubTab === 0 && (
                            <>
                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    sx={{ mb: 2 }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            setShowWorkflowForm(true)
                                        }
                                    >
                                        ➕ Crear Flujo de Trabajo
                                    </Button>
                                </Stack>

                                {workflows.length === 0 ? (
                                    <Card sx={{ p: 8, textAlign: "center" }}>
                                        <Typography variant="h6" gutterBottom>
                                            No hay flujos de trabajo
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ mb: 3 }}
                                        >
                                            Crea el primer flujo para gestionar
                                            el ciclo de vida de tus artefactos
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                setShowWorkflowForm(true)
                                            }
                                        >
                                            ➕ Crear Flujo de Trabajo
                                        </Button>
                                    </Card>
                                ) : (
                                    <WorkflowsTable
                                        workflows={workflows}
                                        onView={(wf) => {
                                            setSelectedWorkflow(wf);
                                            setWorkflowSubTab(1);
                                        }}
                                        onEdit={(wf) => {
                                            setEditingWorkflow(wf);
                                            setShowWorkflowForm(true);
                                        }}
                                        onDelete={loadWorkflows}
                                    />
                                )}
                            </>
                        )}

                        {workflowSubTab === 1 && selectedWorkflow && (
                            <WorkflowStatesView
                                workflow={selectedWorkflow}
                                onAddState={() => {
                                    setEditingState(undefined);
                                    setShowStateForm(true);
                                }}
                                onEditState={(state) => {
                                    setEditingState(state);
                                    setShowStateForm(true);
                                }}
                                onRefresh={handleStateSuccess}
                                projectId={projectId}
                            />
                        )}

                        {workflowSubTab === 2 && selectedWorkflow && (
                            <PermissionMatrixView
                                workflowId={selectedWorkflow.id}
                            />
                        )}

                        {/* Workflow Form Dialog */}
                        <WorkflowForm
                            open={showWorkflowForm}
                            onClose={() => {
                                setShowWorkflowForm(false);
                                setEditingWorkflow(undefined);
                            }}
                            onSuccess={handleWorkflowSuccess}
                            projectId={projectId}
                            workflow={editingWorkflow}
                        />

                        {/* Workflow State Form Dialog */}
                        {selectedWorkflow && (
                            <WorkflowStateForm
                                open={showStateForm}
                                onClose={() => {
                                    setShowStateForm(false);
                                    setEditingState(undefined);
                                }}
                                onSuccess={handleStateSuccess}
                                workflowId={selectedWorkflow.id}
                                state={editingState}
                                nextOrder={selectedWorkflow.states.length + 1}
                            />
                        )}
                    </Box>
                )}
                {tab === 10 && (
                    <Box>
                        <Stack direction="row" gap={2} mb={3}>
                            <Button
                                variant="contained"
                                onClick={() => setShowInviteModal(true)}
                            >
                                ➕ Invitar Usuario
                            </Button>
                        </Stack>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Invitaciones del Proyecto
                        </Typography>
                        <InvitationsList projectId={projectId} />

                        <InviteUserModal
                            projectId={projectId}
                            isOpen={showInviteModal}
                            onClose={() => setShowInviteModal(false)}
                            onSuccess={() => {
                                // Recargar lista de invitaciones
                            }}
                        />
                    </Box>
                )}
                {tab === 11 && hasRole(["Admin", "Manager"]) && (
                    <Box>
                        <AuditLogsTable projectId={projectId} />
                    </Box>
                )}
            </Container>
        </>
    );
}

export default ProjectDetailPage;
