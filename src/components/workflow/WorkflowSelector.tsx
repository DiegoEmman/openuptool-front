import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Alert,
    CircularProgress,
    Box,
    Typography,
} from "@mui/material";
import type { Workflow } from "../../types/workflow";
import {
    workflowService,
    artifactStateService,
} from "../../services/workflowService";

interface WorkflowSelectorProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    artifactId: string;
    projectId: string;
}

export function WorkflowSelector({
    open,
    onClose,
    onSuccess,
    artifactId,
    projectId,
}: WorkflowSelectorProps) {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && projectId) {
            loadWorkflows();
        }
    }, [open, projectId]);

    const loadWorkflows = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await workflowService.getByProject(projectId);
            setWorkflows(data || []);
            if (data && data.length > 0) {
                setSelectedWorkflowId(data[0].id);
            }
        } catch (err) {
            console.error("Error loading workflows:", err);
            setError("Error al cargar los flujos de trabajo");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedWorkflowId) {
            setError("Selecciona un flujo de trabajo");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const success = await artifactStateService.assignWorkflow(
                artifactId,
                selectedWorkflowId
            );

            if (success) {
                onSuccess();
                handleClose();
            } else {
                setError("Error al asignar el flujo de trabajo");
            }
        } catch (err) {
            console.error("Error assigning workflow:", err);
            setError("Error al asignar el flujo de trabajo");
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedWorkflowId("");
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Asignar Flujo de Trabajo</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 3,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : workflows.length === 0 ? (
                    <Alert severity="info">
                        No hay flujos de trabajo disponibles para este proyecto.
                        Crea uno primero desde la sección de Workflows.
                    </Alert>
                ) : (
                    <>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <FormControl component="fieldset" fullWidth>
                            <FormLabel component="legend" sx={{ mb: 2 }}>
                                Selecciona el flujo de trabajo que deseas
                                asociar a este artefacto
                            </FormLabel>
                            <RadioGroup
                                value={selectedWorkflowId}
                                onChange={(e) =>
                                    setSelectedWorkflowId(e.target.value)
                                }
                            >
                                {workflows.map((workflow) => (
                                    <FormControlLabel
                                        key={workflow.id}
                                        value={workflow.id}
                                        control={<Radio />}
                                        label={
                                            <Box>
                                                <Typography variant="body1">
                                                    {workflow.name}
                                                </Typography>
                                                {workflow.description && (
                                                    <Typography
                                                        variant="caption"
                                                        color="textSecondary"
                                                        display="block"
                                                    >
                                                        {workflow.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={submitting}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={submitting || loading || workflows.length === 0}
                >
                    {submitting ? "Asignando..." : "Asignar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
