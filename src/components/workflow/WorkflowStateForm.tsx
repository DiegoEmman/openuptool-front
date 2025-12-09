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
import type {
    WorkflowState,
    CreateWorkflowStateInput,
} from "../../types/workflow";
import { workflowStateService } from "../../services/workflowService";

interface WorkflowStateFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    workflowId: string;
    state?: WorkflowState;
    nextOrder: number;
}

export function WorkflowStateForm({
    open,
    onClose,
    onSuccess,
    workflowId,
    state,
    nextOrder,
}: WorkflowStateFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [order, setOrder] = useState(nextOrder);
    const [color, setColor] = useState("#6366F1");
    const [isInitialState, setIsInitialState] = useState(false);
    const [isFinalState, setIsFinalState] = useState(false);
    const [requiredActions, setRequiredActions] = useState("");

    useEffect(() => {
        if (state) {
            setName(state.name);
            setDescription(state.description || "");
            setOrder(state.order);
            setColor(state.color || "#6366F1");
            setIsInitialState(state.isInitialState);
            setIsFinalState(state.isFinalState);

            // Si requiredActions es JSON, parsearlo y convertirlo a texto con líneas
            try {
                const actions = state.requiredActions
                    ? JSON.parse(state.requiredActions)
                    : [];
                setRequiredActions(
                    Array.isArray(actions) ? actions.join("\n") : ""
                );
            } catch {
                setRequiredActions(state.requiredActions || "");
            }
        } else {
            resetForm();
        }
    }, [state, open, nextOrder]);

    const resetForm = () => {
        setName("");
        setDescription("");
        setOrder(nextOrder);
        setColor("#6366F1");
        setIsInitialState(false);
        setIsFinalState(false);
        setRequiredActions("");
        setError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Si requiredActions tiene contenido, convertirlo a JSON array
            // Si está vacío, enviarlo como undefined
            const processedActions = requiredActions.trim()
                ? JSON.stringify(
                      requiredActions.split("\n").filter((line) => line.trim())
                  )
                : undefined;

            if (state) {
                await workflowStateService.update(state.id, {
                    name,
                    description: description || undefined,
                    order,
                    color,
                    isInitialState,
                    isFinalState,
                    requiredActions: processedActions,
                });
            } else {
                const input: CreateWorkflowStateInput = {
                    workflowId,
                    name,
                    description: description || undefined,
                    order,
                    color,
                    isInitialState,
                    isFinalState,
                    requiredActions: processedActions,
                };
                await workflowStateService.create(input);
            }

            onSuccess();
            onClose();
            resetForm();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al guardar el estado"
            );
        } finally {
            setLoading(false);
        }
    };

    const colorPresets = [
        { name: "Azul", value: "#6366F1" },
        { name: "Verde", value: "#10B981" },
        { name: "Amarillo", value: "#F59E0B" },
        { name: "Rojo", value: "#EF4444" },
        { name: "Morado", value: "#8B5CF6" },
        { name: "Gris", value: "#6B7280" },
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {state ? "Editar Estado" : "Crear Estado"}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <TextField
                            label="Nombre del Estado *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            fullWidth
                            helperText="Ej: Borrador, En Revisión, Aprobado"
                        />
                        <TextField
                            label="Orden *"
                            type="number"
                            value={order}
                            onChange={(e) => setOrder(parseInt(e.target.value))}
                            required
                            sx={{ width: 120 }}
                            inputProps={{ min: 1 }}
                        />
                    </Box>

                    <TextField
                        label="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={2}
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Color del Estado
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                            {colorPresets.map((preset) => (
                                <Box
                                    key={preset.value}
                                    onClick={() => setColor(preset.value)}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: preset.value,
                                        borderRadius: 1,
                                        cursor: "pointer",
                                        border:
                                            color === preset.value
                                                ? "3px solid black"
                                                : "1px solid #ccc",
                                    }}
                                    title={preset.name}
                                />
                            ))}
                        </Box>
                        <TextField
                            label="Color Hex"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            fullWidth
                            size="small"
                            helperText="Color en formato hexadecimal"
                        />
                    </Box>

                    <TextField
                        label="Acciones Requeridas"
                        value={requiredActions}
                        onChange={(e) => setRequiredActions(e.target.value)}
                        multiline
                        rows={2}
                        fullWidth
                        sx={{ mb: 2 }}
                        helperText="Lista de acciones a realizar en este estado (una por línea)"
                    />

                    <Box>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isInitialState}
                                    onChange={(e) =>
                                        setIsInitialState(e.target.checked)
                                    }
                                />
                            }
                            label="Estado Inicial"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isFinalState}
                                    onChange={(e) =>
                                        setIsFinalState(e.target.checked)
                                    }
                                />
                            }
                            label="Estado Final"
                        />
                    </Box>
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
                            : state
                              ? "Actualizar"
                              : "Crear"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
