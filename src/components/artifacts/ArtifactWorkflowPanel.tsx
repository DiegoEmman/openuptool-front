import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Chip,
    Stack,
    CircularProgress,
    Divider,
} from "@mui/material";
import {
    Timeline as TimelineIcon,
    ChangeCircle as ChangeIcon,
    Link as LinkIcon,
} from "@mui/icons-material";
import type { ArtifactWithWorkflow } from "../../types/workflow";
import { artifactStateService } from "../../services/workflowService";
import { ArtifactStateChanger } from "../workflow/ArtifactStateChanger";
import { StateHistoryView } from "../workflow/StateHistoryView";
import { WorkflowSelector } from "../workflow/WorkflowSelector";

interface ArtifactWorkflowPanelProps {
    artifactId: string;
    artifactName: string;
    projectId: string;
    onUpdate?: () => void;
}

export function ArtifactWorkflowPanel({
    artifactId,
    artifactName,
    projectId,
    onUpdate,
}: ArtifactWorkflowPanelProps) {
    const [loading, setLoading] = useState(true);
    const [artifactInfo, setArtifactInfo] =
        useState<ArtifactWithWorkflow | null>(null);
    const [showStateChanger, setShowStateChanger] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showWorkflowSelector, setShowWorkflowSelector] = useState(false);

    useEffect(() => {
        loadArtifactInfo();
    }, [artifactId]);

    const loadArtifactInfo = async () => {
        setLoading(true);
        try {
            const info =
                await artifactStateService.getArtifactWithWorkflow(artifactId);
            setArtifactInfo(info || null);
        } catch (error) {
            console.error("Error loading artifact workflow info:", error);
            setArtifactInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const handleStateChanged = () => {
        loadArtifactInfo();
        onUpdate?.();
    };

    const handleWorkflowAssigned = () => {
        loadArtifactInfo();
        onUpdate?.();
        setShowWorkflowSelector(false);
    };

    if (loading) {
        return (
            <Box sx={{ p: 2, textAlign: "center" }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (!artifactInfo) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="textSecondary" variant="body2">
                    No se pudo cargar la información del workflow
                </Typography>
            </Box>
        );
    }

    if (!artifactInfo.workflowId) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="textSecondary" variant="body2" gutterBottom>
                    Este artefacto no está asociado a ningún flujo de trabajo.
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<LinkIcon />}
                    onClick={() => setShowWorkflowSelector(true)}
                    sx={{ mt: 2 }}
                >
                    Asignar Workflow
                </Button>

                <WorkflowSelector
                    open={showWorkflowSelector}
                    onClose={() => setShowWorkflowSelector(false)}
                    onSuccess={handleWorkflowAssigned}
                    artifactId={artifactId}
                    projectId={projectId}
                />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
                {/* Workflow Info */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Flujo de Trabajo
                    </Typography>
                    <Chip
                        label={artifactInfo.workflowName}
                        color="primary"
                        variant="outlined"
                        size="small"
                    />
                </Box>

                {/* Current State */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Estado Actual
                    </Typography>
                    <Chip
                        label={artifactInfo.currentStateName || "Sin estado"}
                        color={
                            artifactInfo.currentStateName
                                ? "success"
                                : "default"
                        }
                        size="small"
                        sx={{
                            bgcolor:
                                artifactInfo.currentStateColor || undefined,
                            color: artifactInfo.currentStateColor
                                ? "white"
                                : undefined,
                        }}
                    />
                </Box>

                <Divider />

                {/* Actions */}
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ChangeIcon />}
                        onClick={() => setShowStateChanger(true)}
                    >
                        Cambiar Estado
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<TimelineIcon />}
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? "Ocultar" : "Ver"} Historial
                    </Button>
                </Stack>

                {/* History View */}
                {showHistory && (
                    <Box sx={{ mt: 2 }}>
                        <StateHistoryView artifactId={artifactId} />
                    </Box>
                )}
            </Stack>

            {/* State Changer Dialog */}
            <ArtifactStateChanger
                open={showStateChanger}
                onClose={() => setShowStateChanger(false)}
                onSuccess={handleStateChanged}
                artifactId={artifactId}
                artifactName={artifactName}
                workflowId={artifactInfo.workflowId}
            />
        </Box>
    );
}
