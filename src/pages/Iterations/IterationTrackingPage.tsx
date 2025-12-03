import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Navbar } from "../../components/common/Navbar";
import { iterationService } from "../../services/iterationService";
import { iterationProgressService } from "../../services/iterationProgressService";
import { iterationTaskService } from "../../services/iterationTaskService";
import type {
    IterationSummary,
    IterationTask,
    BurndownData,
    CreateIterationProgressInput,
    CreateIterationTaskInput,
    UpdateIterationTaskInput,
} from "../../types/iterationProgress";
import {
    Container,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    Stack,
    Breadcrumbs,
} from "@mui/material";
import { Link } from "react-router";
import { IterationProgressPanel } from "../../components/iterations/IterationProgressPanel";
import { IterationTaskList } from "../../components/iterations/IterationTaskList";
import { BurndownChart } from "../../components/iterations/BurndownChart";

interface IterationTrackingPageProps {
    projectId: string;
    iterationId: string;
}

export function IterationTrackingPage({
    projectId,
    iterationId,
}: IterationTrackingPageProps) {
    const [summary, setSummary] = useState<IterationSummary | null>(null);
    const [tasks, setTasks] = useState<IterationTask[]>([]);
    const [burndownData, setBurndownData] = useState<BurndownData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        console.log(
            "🔄 useEffect ejecutándose - refreshTrigger:",
            refreshTrigger
        );
        loadData();
    }, [iterationId, refreshTrigger]);

    const loadData = async () => {
        try {
            console.log("📥 Cargando datos de la iteración...");
            setLoading(true);
            setError(null);

            const [summaryData, tasksData, burndownDataRes] = await Promise.all(
                [
                    iterationProgressService.getSummary(iterationId),
                    iterationTaskService.getTasksByIteration(iterationId),
                    iterationProgressService.getBurndownData(iterationId),
                ]
            );

            console.log(
                "📊 Summary recibido:",
                JSON.stringify(summaryData, null, 2)
            );
            console.log(
                "📊 latestProgress del summary:",
                summaryData.latestProgress
            );
            console.log("📋 Tasks recibidas:", tasksData.length);
            console.log("📈 Burndown recibido:", burndownDataRes);

            setSummary(summaryData);
            setTasks(tasksData);
            setBurndownData(burndownDataRes);
        } catch (err) {
            console.error("Error loading iteration data:", err);
            setError(
                err instanceof Error ? err.message : "Error al cargar datos"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleProgressCreate = async (
        input: CreateIterationProgressInput
    ) => {
        try {
            console.log(
                "🚀 Creando registro de progreso para iteración:",
                iterationId
            );
            console.log("📦 Datos a enviar:", input);

            const result = await iterationProgressService.createProgressRecord(
                iterationId,
                input
            );

            console.log("✅ Registro creado exitosamente:", result);
            console.log("🔄 Refrescando datos...");

            setRefreshTrigger((prev) => prev + 1);

            alert("✅ Avance registrado exitosamente");
        } catch (error) {
            console.error("❌ Error completo al crear progreso:", error);
            if (error instanceof Error) {
                alert(`Error al registrar el avance: ${error.message}`);
            } else {
                alert("Error desconocido al registrar el avance");
            }
        }
    };

    const handleTaskCreate = async (input: CreateIterationTaskInput) => {
        try {
            await iterationTaskService.createTask(iterationId, input);
            setRefreshTrigger((prev) => prev + 1);
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Error al crear la tarea");
        }
    };

    const handleTaskUpdate = async (
        taskId: string,
        changes: UpdateIterationTaskInput
    ) => {
        try {
            await iterationTaskService.updateTask(iterationId, taskId, changes);
            setRefreshTrigger((prev) => prev + 1);
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Error al actualizar la tarea");
        }
    };

    const handleTaskDelete = async (taskId: string) => {
        try {
            await iterationTaskService.deleteTask(iterationId, taskId);
            setRefreshTrigger((prev) => prev + 1);
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Error al eliminar la tarea");
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

    if (error || !summary) {
        return (
            <>
                <Navbar />
                <Container sx={{ py: 4 }}>
                    <Alert severity="error">
                        {error || "Datos no disponibles"}
                    </Alert>
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
                        Seguimiento de Iteración
                    </Typography>
                </Breadcrumbs>

                <Typography variant="h4" mb={3}>
                    Seguimiento de Iteración
                </Typography>

                <IterationProgressPanel
                    summary={summary}
                    onProgressCreate={handleProgressCreate}
                />

                <Box sx={{ borderBottom: 1, borderColor: "divider", my: 3 }}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                        <Tab label="Tareas" />
                        <Tab label="Burndown" />
                    </Tabs>
                </Box>

                {tab === 0 && (
                    <IterationTaskList
                        tasks={tasks}
                        onTaskCreate={handleTaskCreate}
                        onTaskUpdate={handleTaskUpdate}
                        onTaskDelete={handleTaskDelete}
                    />
                )}

                {tab === 1 && burndownData && (
                    <BurndownChart data={burndownData} />
                )}
            </Container>
        </>
    );
}

export default IterationTrackingPage;
