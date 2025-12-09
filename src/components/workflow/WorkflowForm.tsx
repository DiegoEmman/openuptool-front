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
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import type { Workflow, CreateWorkflowInput } from "../../types/workflow";
import { workflowService } from "../../services/workflowService";

interface WorkflowFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    projectId: string;
    workflow?: Workflow;
}

export function WorkflowForm({
    open,
    onClose,
    onSuccess,
    projectId,
    workflow,
}: WorkflowFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (workflow) {
            setName(workflow.name);
            setDescription(workflow.description || "");
            setIsActive(workflow.isActive);
        } else {
            resetForm();
        }
    }, [workflow, open]);

    const resetForm = () => {
        setName("");
        setDescription("");
        setIsActive(true);
        setError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (workflow) {
                await workflowService.update(workflow.id, {
                    name,
                    description,
                    isActive,
                });
            } else {
                const input: CreateWorkflowInput = {
                    projectId,
                    name,
                    description: description || undefined,
                };
                await workflowService.create(input);
            }

            onSuccess();
            onClose();
            resetForm();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Error al guardar el flujo"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {workflow
                    ? "Editar Flujo de Trabajo"
                    : "Crear Flujo de Trabajo"}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <TextField
                        label="Nombre del Flujo *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        fullWidth
                        sx={{ mb: 2 }}
                        helperText="Ej: Revisión de Documentos, Desarrollo de Código"
                    />

                    <TextField
                        label="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        sx={{ mb: 2 }}
                        helperText="Descripción del propósito del flujo"
                    />

                    {workflow && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isActive}
                                    onChange={(e) =>
                                        setIsActive(e.target.checked)
                                    }
                                />
                            }
                            label="Flujo Activo"
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading
                            ? "Guardando..."
                            : workflow
                              ? "Actualizar"
                              : "Crear"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
