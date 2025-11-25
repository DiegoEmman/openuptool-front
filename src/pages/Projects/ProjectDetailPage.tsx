import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { projectService } from "../../services/projectService";
import { planService } from "../../services/planService";
import { artifactCatalogService } from "../../services/artifactCatalogService";
import { artifactService } from "../../services/artifactService";
import { iterationService } from "../../services/iterationService";
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
} from "@mui/material";
import { PlanForm } from "../../components/plan/PlanForm";
import { PlanSummary } from "../../components/plan/PlanSummary";
import { InceptionArtifactCatalog } from "../../components/artifacts/InceptionArtifactCatalog";
import { ArtifactCreateForm } from "../../components/artifacts/ArtifactCreateForm";
import { PhaseArtifactsView } from "../../components/artifacts/PhaseArtifactsView";
import { IterationForm } from "../../components/iterations/IterationForm";
import { IterationsTable } from "../../components/iterations/IterationsTable";

export function ProjectDetailPage() {
    const { id } = useParams();
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

    useEffect(() => {
        if (!id) return;

        Promise.all([
            projectService.get(id),
            planService.getPlanByProject(id),
            artifactCatalogService.getArtifactTypesByPhase(phase),
            artifactService.getArtifacts(id, phase),
            iterationService.getIterations(id),
        ])
            .then(([proj, pln, types, arts, iters]) => {
                setProject(proj);
                setPlan(pln);
                setArtifactTypes(types);
                setArtifacts(arts);
                setIterations(iters);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading project details:", error);
                setLoading(false);
            });
    }, [id, catalogRefresh]);

    if (loading) {
        return (
            <Container
                sx={{ py: 4, display: "flex", justifyContent: "center" }}
            >
                <CircularProgress />
            </Container>
        );
    }

    if (!project) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography variant="h5">Proyecto no encontrado</Typography>
                <Button component={Link} to="/projects" sx={{ mt: 2 }}>
                    Volver
                </Button>
            </Container>
        );
    }

    return (
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
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4">{project.name}</Typography>
                <Button component={Link} to="/projects">
                    Volver
                </Button>
            </Stack>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Resumen" />
                <Tab label="Plan del Proyecto" />
                <Tab label="Incepción" />
                <Tab label="Iteraciones" />
            </Tabs>
            {tab === 0 && (
                <Box>
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Datos</Typography>
                            <Typography>
                                Identificador: {project.identifier}
                            </Typography>
                            <Typography>Inicio: {project.startDate}</Typography>
                            <Typography>Estado: {project.status}</Typography>
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
                        <PlanSummary plan={plan} projectName={project.name} />
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
                            onCreated={() => setShowArtifactForm(false)}
                            onCancel={() => setShowArtifactForm(false)}
                        />
                    )}
                    <InceptionArtifactCatalog
                        types={artifactTypes}
                        onUpdate={() => setCatalogRefresh((c) => c + 1)}
                    />
                    <PhaseArtifactsView artifacts={artifacts} />
                </Box>
            )}
            {tab === 3 && (
                <Box>
                    <Stack direction="row" gap={2} mb={2}>
                        <Button
                            variant="contained"
                            onClick={() => setShowIterationForm((v) => !v)}
                        >
                            Nueva Iteración
                        </Button>
                    </Stack>
                    {showIterationForm && (
                        <IterationForm
                            projectId={project.id}
                            onCreated={() => setShowIterationForm(false)}
                            onCancel={() => setShowIterationForm(false)}
                        />
                    )}
                    <IterationsTable iterations={iterations} />
                </Box>
            )}
        </Container>
    );
}

export default ProjectDetailPage;
