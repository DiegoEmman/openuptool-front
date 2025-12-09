import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Typography,
    Chip,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
} from "@mui/icons-material";
import { configurationService } from "../../services/configurationService";
import type {
    PhaseTemplate,
    CreatePhaseTemplateInput,
    UpdatePhaseTemplateInput,
} from "../../types/configuration";

interface PhaseManagementProps {
    configId: string;
}

export function PhaseManagement({ configId }: PhaseManagementProps) {
    const [phases, setPhases] = useState<PhaseTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPhase, setEditingPhase] = useState<PhaseTemplate | null>(
        null
    );
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        orderIndex: 0,
        defaultDurationDays: undefined as number | undefined,
        isMandatory: true,
    });

    useEffect(() => {
        loadPhases();
    }, [configId]);

    const loadPhases = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await configurationService.getPhases(configId);
            setPhases(data.sort((a, b) => a.orderIndex - b.orderIndex));
        } catch (err) {
            setError("Error al cargar fases");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (phase?: PhaseTemplate) => {
        if (phase) {
            setEditingPhase(phase);
            setFormData({
                name: phase.name || "",
                code: phase.phaseCode || phase.code || "",
                description: phase.description || "",
                orderIndex: phase.orderIndex || 0,
                defaultDurationDays: phase.defaultDurationDays,
                isMandatory: phase.isMandatory ?? true,
            });
        } else {
            setEditingPhase(null);
            setFormData({
                name: "",
                code: "",
                description: "",
                orderIndex: phases.length + 1,
                defaultDurationDays: undefined,
                isMandatory: true,
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingPhase(null);
        setFormData({ name: "", code: "", description: "", orderIndex: 0 });
    };

    const handleSubmit = async () => {
        try {
            if (editingPhase) {
                const input: UpdatePhaseTemplateInput = {
                    name: formData.name,
                    code: formData.code.toUpperCase(),
                    phaseCode: formData.code.toUpperCase(),
                    description: formData.description || undefined,
                    orderIndex: formData.orderIndex,
                    defaultDurationDays: formData.defaultDurationDays,
                    isMandatory: formData.isMandatory,
                };
                await configurationService.updatePhase(
                    configId,
                    editingPhase.id,
                    input
                );
            } else {
                const input: CreatePhaseTemplateInput = {
                    name: formData.name,
                    code: formData.code.toUpperCase(),
                    phaseCode: formData.code.toUpperCase(),
                    description: formData.description || undefined,
                    orderIndex: formData.orderIndex,
                    defaultDurationDays: formData.defaultDurationDays,
                    isMandatory: formData.isMandatory,
                };
                await configurationService.createPhase(configId, input);
            }
            handleCloseDialog();
            loadPhases();
        } catch (err) {
            setError("Error al guardar fase");
            console.error(err);
        }
    };

    const handleDelete = async (phaseId: string) => {
        if (!window.confirm("¿Estás seguro de eliminar esta fase?")) return;

        try {
            await configurationService.deletePhase(configId, phaseId);
            loadPhases();
        } catch (err) {
            setError(
                "Error al eliminar fase. Puede estar en uso por proyectos existentes."
            );
            console.error(err);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h6">Fases del Proceso</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nueva Fase
                </Button>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            <Alert severity="info" sx={{ mb: 2 }}>
                Las fases definen las etapas del proceso (ejemplo: INCEPTION,
                ELABORATION, CONSTRUCTION, TRANSITION)
            </Alert>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Orden</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Código</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Duración (días)</TableCell>
                            <TableCell>Obligatoria</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {phases.map((phase) => (
                            <TableRow key={phase.id}>
                                <TableCell>{phase.orderIndex}</TableCell>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontWeight="medium"
                                    >
                                        {phase.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={phase.phaseCode || phase.code}
                                        size="small"
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell>
                                    {phase.description || "-"}
                                </TableCell>
                                <TableCell>
                                    {phase.defaultDurationDays || "-"}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={phase.isMandatory ? "Sí" : "No"}
                                        size="small"
                                        color={
                                            phase.isMandatory
                                                ? "success"
                                                : "default"
                                        }
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleOpenDialog(phase)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(phase.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {phases.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No hay fases configuradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingPhase ? "Editar Fase" : "Nueva Fase"}
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        <TextField
                            label="Nombre"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            required
                            fullWidth
                            placeholder="Elaboración"
                        />
                        <TextField
                            label="Código"
                            value={formData.code}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    code: (e.target.value || "").toUpperCase(),
                                })
                            }
                            required
                            fullWidth
                            placeholder="ELABORATION"
                            helperText="Código único en mayúsculas sin espacios"
                        />
                        <TextField
                            label="Descripción"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            multiline
                            rows={3}
                            fullWidth
                        />
                        <TextField
                            label="Duración por defecto (días)"
                            type="number"
                            value={formData.defaultDurationDays || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    defaultDurationDays: e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined,
                                })
                            }
                            fullWidth
                            helperText="Duración estimada de la fase en días"
                        />
                        <TextField
                            label="Orden"
                            type="number"
                            value={formData.orderIndex}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    orderIndex: parseInt(e.target.value),
                                })
                            }
                            fullWidth
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.isMandatory}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            isMandatory: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Fase obligatoria"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={
                            !(formData.name || "").trim() ||
                            !(formData.code || "").trim()
                        }
                    >
                        {editingPhase ? "Actualizar" : "Crear"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
