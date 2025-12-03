import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Navbar } from "../../components/common/Navbar";
import { artifactService } from "../../services/artifactService";
import { artifactCatalogService } from "../../services/artifactCatalogService";
import { PhaseValidationDialog } from "../../components/artifacts/PhaseValidationDialog";
import type { Artifact, ArtifactType } from "../../types";
import {
    Container,
    Box,
    Typography,
    Button,
    Stack,
    CircularProgress,
    Alert,
    Breadcrumbs,
} from "@mui/material";
import { ArtifactCreateForm } from "../../components/artifacts/ArtifactCreateForm";
import { ConstructionArtifactsView } from "../../components/artifacts/ConstructionArtifactsView";

interface ConstructionPhasePageProps {
    projectId: string;
}

export function ConstructionPhasePage({
    projectId,
}: ConstructionPhasePageProps) {
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [artifactTypes, setArtifactTypes] = useState<ArtifactType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [validationResult, setValidationResult] = useState<any>(null);

    useEffect(() => {
        if (!projectId) return;

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [artifactsData, typesData] = await Promise.all([
                    artifactService.getArtifacts(projectId, "CONSTRUCTION"),
                    artifactCatalogService.getArtifactTypesByPhase(
                        "CONSTRUCTION"
                    ),
                ]);

                setArtifacts(artifactsData);
                setArtifactTypes(typesData);
            } catch (err) {
                console.error("Error loading construction data:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Error al cargar los datos"
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [projectId, refreshTrigger]);

    const handleRefresh = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleValidatePhase = async () => {
        if (!projectId) return;

        try {
            const result = await artifactService.validatePhase(
                projectId,
                "CONSTRUCTION"
            );

            setValidationResult(result);
            setShowValidationDialog(true);
        } catch (error) {
            console.error("Error validating phase:", error);
            alert("Error al validar la fase");
        }
    };

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

    if (error) {
        return (
            <>
                <Navbar />
                <Container sx={{ py: 4 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Button variant="contained" onClick={handleRefresh}>
                        Reintentar
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
                    <Link
                        to={`/projects/${projectId}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        Proyecto
                    </Link>
                    <Typography color="text.primary">Construcción</Typography>
                </Breadcrumbs>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Typography variant="h4">Fase de Construcción</Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            onClick={handleValidatePhase}
                        >
                            Validar Fase
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setShowCreateForm((v) => !v)}
                        >
                            {showCreateForm ? "Cancelar" : "Agregar Artefacto"}
                        </Button>
                    </Stack>
                </Stack>

                {showCreateForm && (
                    <Box mb={3}>
                        <ArtifactCreateForm
                            projectId={projectId!}
                            phaseId="CONSTRUCTION"
                            types={artifactTypes}
                            onCreated={() => {
                                setShowCreateForm(false);
                                handleRefresh();
                            }}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    </Box>
                )}

                {artifacts.length === 0 ? (
                    <Alert severity="info">
                        No hay artefactos registrados en la fase de
                        Construcción. Haz clic en "Agregar Artefacto" para crear
                        uno.
                    </Alert>
                ) : (
                    <ConstructionArtifactsView
                        artifacts={artifacts}
                        projectId={projectId!}
                        onUpdate={handleRefresh}
                    />
                )}

                <PhaseValidationDialog
                    open={showValidationDialog}
                    onClose={() => setShowValidationDialog(false)}
                    phaseName="Construcción"
                    result={validationResult}
                />
            </Container>
        </>
    );
}

export default ConstructionPhasePage;
