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
    Paper,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    Chip,
    Alert,
} from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
} from "@mui/icons-material";
import type {
    ProjectClosure,
    CreateProjectClosureInput,
    ClosureCriteria,
    ClosureValidation,
} from "../../types/transition";
import { projectClosureService } from "../../services/transitionService";

interface ProjectClosureFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    projectId: string;
    closure?: ProjectClosure;
}

const DEFAULT_CRITERIA: ClosureCriteria[] = [
    {
        criteriaId: "deliverables",
        name: "Todos los entregables completados",
        isMandatory: true,
        isCompleted: false,
        notes: "",
    },
    {
        criteriaId: "tests",
        name: "Pruebas finales aprobadas",
        isMandatory: true,
        isCompleted: false,
        notes: "",
    },
    {
        criteriaId: "documentation",
        name: "Documentación completa (Manual Usuario, Manual Técnico)",
        isMandatory: true,
        isCompleted: false,
        notes: "",
    },
    {
        criteriaId: "training",
        name: "Capacitación realizada",
        isMandatory: false,
        isCompleted: false,
        notes: "",
    },
    {
        criteriaId: "acceptance",
        name: "Aceptación del cliente",
        isMandatory: true,
        isCompleted: false,
        notes: "",
    },
];

export function ProjectClosureForm({
    open,
    onClose,
    onSuccess,
    projectId,
    closure,
}: ProjectClosureFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validation, setValidation] = useState<ClosureValidation | null>(
        null
    );
    const [summary, setSummary] = useState("");
    const [lessonsLearned, setLessonsLearned] = useState("");
    const [recommendations, setRecommendations] = useState("");
    const [checklist, setChecklist] =
        useState<ClosureCriteria[]>(DEFAULT_CRITERIA);

    useEffect(() => {
        if (open && !closure) {
            loadValidation();
        }
    }, [open, projectId]);

    useEffect(() => {
        if (closure) {
            setSummary(closure.summary || "");
            setLessonsLearned(closure.lessonsLearned || "");
            setRecommendations(closure.recommendations || "");
            if (closure.checklist && closure.checklist.length > 0) {
                setChecklist(closure.checklist);
            }
        } else {
            resetForm();
        }
    }, [closure, open]);

    const loadValidation = async () => {
        try {
            const result = await projectClosureService.validate(projectId);
            setValidation(result);
        } catch (err) {
            console.error("Error loading validation:", err);
        }
    };

    const resetForm = () => {
        setSummary("");
        setLessonsLearned("");
        setRecommendations("");
        setChecklist(DEFAULT_CRITERIA);
        setError(null);
        setValidation(null);
    };

    const handleToggleCriteria = (index: number) => {
        const updated = [...checklist];
        updated[index].isCompleted = !updated[index].isCompleted;
        setChecklist(updated);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const input: CreateProjectClosureInput = {
                projectId,
                summary,
                lessonsLearned,
                recommendations,
                checklist,
            };

            if (closure) {
                await projectClosureService.update(closure.id, input);
            } else {
                await projectClosureService.create(input);
            }

            onSuccess();
            onClose();
            resetForm();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al guardar el cierre del proyecto"
            );
        } finally {
            setLoading(false);
        }
    };

    const mandatoryCompleted = checklist.filter(
        (c) => c.isMandatory && c.isCompleted
    ).length;
    const mandatoryTotal = checklist.filter((c) => c.isMandatory).length;
    const allMandatoryMet = mandatoryCompleted === mandatoryTotal;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {closure
                    ? "Editar Cierre de Proyecto"
                    : "Crear Cierre de Proyecto"}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {validation && !validation.canClose && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <Typography variant="body2" fontWeight="bold">
                                Atención: Faltan criterios obligatorios
                            </Typography>
                            <ul style={{ marginTop: 4, marginBottom: 0 }}>
                                {validation.missingMandatoryCriteria.map(
                                    (err, i) => (
                                        <li key={i}>{err}</li>
                                    )
                                )}
                            </ul>
                        </Alert>
                    )}

                    <TextField
                        label="Resumen del Cierre"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        multiline
                        rows={2}
                        fullWidth
                        sx={{ mb: 2 }}
                        helperText="Descripción breve del cierre del proyecto"
                    />

                    <TextField
                        label="Lecciones Aprendidas"
                        value={lessonsLearned}
                        onChange={(e) => setLessonsLearned(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        sx={{ mb: 2 }}
                        helperText="Conocimientos y experiencias obtenidas"
                    />

                    <TextField
                        label="Recomendaciones"
                        value={recommendations}
                        onChange={(e) => setRecommendations(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        sx={{ mb: 2 }}
                        helperText="Sugerencias para proyectos futuros"
                    />

                    <Box sx={{ mb: 2 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold">
                                Criterios de Cierre ({mandatoryCompleted}/
                                {mandatoryTotal} obligatorios)
                            </Typography>
                            {allMandatoryMet ? (
                                <Chip
                                    icon={<CheckCircleIcon />}
                                    label="Completo"
                                    color="success"
                                    size="small"
                                />
                            ) : (
                                <Chip
                                    icon={<WarningIcon />}
                                    label="Pendiente"
                                    color="warning"
                                    size="small"
                                />
                            )}
                        </Box>

                        <Paper variant="outlined">
                            <List dense>
                                {checklist.map((criterion, index) => (
                                    <ListItem
                                        key={criterion.criteriaId}
                                        sx={{
                                            bgcolor: criterion.isCompleted
                                                ? "success.light"
                                                : "inherit",
                                            opacity: criterion.isCompleted
                                                ? 0.8
                                                : 1,
                                        }}
                                    >
                                        <Checkbox
                                            checked={criterion.isCompleted}
                                            onChange={() =>
                                                handleToggleCriteria(index)
                                            }
                                        />
                                        <ListItemText
                                            primary={
                                                <>
                                                    {criterion.name}
                                                    {criterion.isMandatory && (
                                                        <Chip
                                                            label="Obligatorio"
                                                            size="small"
                                                            color="error"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    )}
                                                </>
                                            }
                                            secondary={criterion.notes}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Box>

                    {!allMandatoryMet && (
                        <Alert severity="info">
                            Completa todos los criterios obligatorios antes de
                            enviar el cierre
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !allMandatoryMet}
                    >
                        {loading
                            ? "Guardando..."
                            : closure
                              ? "Actualizar"
                              : "Crear Cierre"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
