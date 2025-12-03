import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { Navbar } from "../../components/common/Navbar";
import { testExecutionService } from "../../services/testExecutionService";
import { defectService } from "../../services/defectService";
import { TestExecutionForm } from "../../components/testing/TestExecutionForm";
import { TestExecutionList } from "../../components/testing/TestExecutionList";
import { DefectForm } from "../../components/defects/DefectForm";
import { DefectList } from "../../components/defects/DefectList";
import type { TestExecution } from "../../types/testExecution";
import type { Defect } from "../../types/defect";
import {
    Container,
    Box,
    Typography,
    Button,
    Stack,
    CircularProgress,
    Alert,
    Breadcrumbs,
    Tabs,
    Tab,
    Card,
    CardContent,
    Grid,
    Chip,
} from "@mui/material";
import {
    BugReport as BugIcon,
    Science as TestIcon,
    CheckCircle as PassIcon,
    Cancel as FailIcon,
    Warning as WarningIcon,
} from "@mui/icons-material";

interface TestingPageProps {
    projectId: string;
}

export function TestingPage({ projectId }: TestingPageProps) {
    const [tab, setTab] = useState(0);
    const [executions, setExecutions] = useState<TestExecution[]>([]);
    const [defects, setDefects] = useState<Defect[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showExecutionForm, setShowExecutionForm] = useState(false);
    const [showDefectForm, setShowDefectForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [executionSummary, setExecutionSummary] = useState<any>(null);
    const [defectSummary, setDefectSummary] = useState<any>(null);

    useEffect(() => {
        if (!projectId) return;

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [defectsData, defSummary] = await Promise.all([
                    defectService.getByProject(projectId),
                    defectService.getSummary(projectId),
                ]);

                setDefects(defectsData);
                setDefectSummary(defSummary);
            } catch (err) {
                console.error("Error loading testing data:", err);
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
                    <Typography color="text.primary">
                        Testing y Defectos
                    </Typography>
                </Breadcrumbs>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Typography variant="h4">Testing y Calidad</Typography>
                </Stack>

                {/* Resumen de Defectos */}
                {defectSummary && (
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Box>
                                            <Typography
                                                variant="h4"
                                                color="text.primary"
                                            >
                                                {defectSummary.totalDefects}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Total Defectos
                                            </Typography>
                                        </Box>
                                        <BugIcon
                                            fontSize="large"
                                            color="action"
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Box>
                                            <Typography
                                                variant="h4"
                                                color="error.main"
                                            >
                                                {defectSummary.open}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Abiertos
                                            </Typography>
                                        </Box>
                                        <WarningIcon
                                            fontSize="large"
                                            color="error"
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Box>
                                            <Typography
                                                variant="h4"
                                                color="warning.main"
                                            >
                                                {defectSummary.inProgress}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                En Progreso
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Box>
                                            <Typography
                                                variant="h4"
                                                color="success.main"
                                            >
                                                {defectSummary.resolved +
                                                    defectSummary.closed}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Resueltos
                                            </Typography>
                                        </Box>
                                        <PassIcon
                                            fontSize="large"
                                            color="success"
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                    <Tab
                        label="Defectos"
                        icon={<BugIcon />}
                        iconPosition="start"
                    />
                </Tabs>

                {tab === 0 && (
                    <Box>
                        <Stack direction="row" spacing={2} mb={3}>
                            <Button
                                variant="contained"
                                startIcon={<BugIcon />}
                                onClick={() => setShowDefectForm((v) => !v)}
                            >
                                {showDefectForm
                                    ? "Cancelar"
                                    : "Reportar Defecto"}
                            </Button>
                        </Stack>

                        {showDefectForm && (
                            <DefectForm
                                projectId={projectId!}
                                onCreated={() => {
                                    setShowDefectForm(false);
                                    handleRefresh();
                                }}
                                onCancel={() => setShowDefectForm(false)}
                            />
                        )}

                        {defects.length === 0 ? (
                            <Alert severity="info">
                                No hay defectos registrados. Haz clic en
                                "Reportar Defecto" para crear uno.
                            </Alert>
                        ) : (
                            <DefectList
                                defects={defects}
                                onUpdate={handleRefresh}
                            />
                        )}
                    </Box>
                )}
            </Container>
        </>
    );
}

export default TestingPage;
