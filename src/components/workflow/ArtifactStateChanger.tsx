import { useState, useEffect, type FormEvent } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
} from "@mui/material";
import type {
    ArtifactWithWorkflow,
    ChangeArtifactStateInput,
    WorkflowState,
} from "../../types/workflow";
import {
    artifactStateService,
    workflowStateService,
} from "../../services/workflowService";

interface ArtifactStateChangerProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    artifactId: string;
    artifactName: string;
    workflowId?: string;
}

export function ArtifactStateChanger({
    open,
    onClose,
    onSuccess,
    artifactId,
    artifactName,
    workflowId,
}: ArtifactStateChangerProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [artifactInfo, setArtifactInfo] =
        useState<ArtifactWithWorkflow | null>(null);
    const [availableStates, setAvailableStates] = useState<WorkflowState[]>([]);
    const [selectedStateId, setSelectedStateId] = useState("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (open) {
            loadArtifactInfo();
        }
    }, [open, artifactId]);

    const loadArtifactInfo = async () => {
        setLoading(true);
        setError(null);

        try {
            const info =
                await artifactStateService.getArtifactWithWorkflow(artifactId);
            console.log("🔍 Artifact info:", info);
            console.log(
                "🔍 Has workflowId?",
                !!info?.workflowId,
                info?.workflowId
            );
            if (info) {
                setArtifactInfo(info);
                if (info.workflowId) {
                    console.log(
                        "🔍 Loading states for workflow:",
                        info.workflowId
                    );
                    const states = await workflowStateService.getByWorkflow(
                        info.workflowId
                    );
                    console.log("🔍 States loaded:", states);
                    if (states) {
                        const sortedStates = states.sort(
                            (a, b) => a.order - b.order
                        );
                        console.log("🔍 Sorted states:", sortedStates);
                        setAvailableStates(sortedStates);
                        console.log(
                            "🔍 Available states set, length:",
                            sortedStates.length
                        );
                    } else {
                        console.warn("⚠️ States is null/undefined");
                    }
                } else {
                    console.warn("⚠️ No workflowId found");
                }
            } else {
                console.warn("⚠️ Artifact info is null");
            }
        } catch (err) {
            console.error("❌ Error loading artifact info:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al cargar información"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedStateId) {
            setError("Debe seleccionar un estado");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const input: ChangeArtifactStateInput = {
                artifactId,
                toStateId: selectedStateId,
                comments: comment || undefined,
            };

            const success = await artifactStateService.changeState(input);
            if (success) {
                onSuccess();
                onClose();
                resetForm();
            } else {
                setError("No se pudo cambiar el estado");
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error al cambiar estado"
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedStateId("");
        setComment("");
        setError(null);
    };

    const currentState = artifactInfo?.currentStateId
        ? availableStates.find((s) => s.id === artifactInfo.currentStateId)
        : null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Cambiar Estado de Artefacto</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Typography variant="subtitle2" gutterBottom>
                        <strong>Artefacto:</strong> {artifactName}
                    </Typography>

                    {artifactInfo?.workflowName && (
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                        >
                            <strong>Flujo:</strong> {artifactInfo.workflowName}
                        </Typography>
                    )}

                    {currentState && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" gutterBottom>
                                <strong>Estado Actual:</strong>
                            </Typography>
                            <Chip
                                label={currentState.name}
                                sx={{
                                    bgcolor: currentState.color || "#gray",
                                    color: "white",
                                }}
                            />
                        </Box>
                    )}

                    {!artifactInfo?.workflowId && (
                        <Typography color="warning.main" sx={{ my: 2 }}>
                            Este artefacto no tiene un flujo de trabajo
                            asignado.
                        </Typography>
                    )}

                    {availableStates.length > 0 && (
                        <>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Nuevo Estado *</InputLabel>
                                <Select
                                    value={selectedStateId}
                                    onChange={(e) =>
                                        setSelectedStateId(e.target.value)
                                    }
                                    required
                                    label="Nuevo Estado *"
                                >
                                    {availableStates.map((state) => (
                                        <MenuItem
                                            key={state.id}
                                            value={state.id}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 16,
                                                        height: 16,
                                                        borderRadius: "50%",
                                                        bgcolor:
                                                            state.color ||
                                                            "#gray",
                                                    }}
                                                />
                                                {state.order}. {state.name}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {selectedStateId && (
                                <Box
                                    sx={{
                                        mb: 2,
                                        p: 2,
                                        bgcolor: "info.light",
                                        borderRadius: 1,
                                    }}
                                >
                                    {availableStates.find(
                                        (s) => s.id === selectedStateId
                                    )?.description && (
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            {
                                                availableStates.find(
                                                    (s) =>
                                                        s.id === selectedStateId
                                                )?.description
                                            }
                                        </Typography>
                                    )}
                                    {availableStates.find(
                                        (s) => s.id === selectedStateId
                                    )?.requiredActions && (
                                        <Typography variant="caption">
                                            <strong>
                                                Acciones requeridas:
                                            </strong>{" "}
                                            {
                                                availableStates.find(
                                                    (s) =>
                                                        s.id === selectedStateId
                                                )?.requiredActions
                                            }
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </>
                    )}

                    <TextField
                        label="Comentario"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        helperText="Opcional: Describe el motivo del cambio de estado"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !selectedStateId}
                    >
                        {loading ? "Cambiando..." : "Cambiar Estado"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
