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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { configurationService } from "../../services/configurationService";
import type {
    ArtifactTypeTemplate,
    CreateArtifactTypeTemplateInput,
    UpdateArtifactTypeTemplateInput,
    PhaseTemplate,
} from "../../types/configuration";

interface ArtifactTypeManagementProps {
    configId: string;
}

export function ArtifactTypeManagement({
    configId,
}: ArtifactTypeManagementProps) {
    const [artifactTypes, setArtifactTypes] = useState<ArtifactTypeTemplate[]>(
        []
    );
    const [phases, setPhases] = useState<PhaseTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingArtifactType, setEditingArtifactType] =
        useState<ArtifactTypeTemplate | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        phaseCode: "",
        description: "",
        isRequired: false,
        orderIndex: 0,
    });

    useEffect(() => {
        loadData();
    }, [configId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [artifactTypesData, phasesData] = await Promise.all([
                configurationService.getArtifactTypes(configId),
                configurationService.getPhases(configId),
            ]);
            setArtifactTypes(
                artifactTypesData.sort((a, b) => a.orderIndex - b.orderIndex)
            );
            setPhases(phasesData.sort((a, b) => a.orderIndex - b.orderIndex));
        } catch (err) {
            setError("Error al cargar datos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (artifactType?: ArtifactTypeTemplate) => {
        if (artifactType) {
            setEditingArtifactType(artifactType);
            setFormData({
                name: artifactType.name,
                code: artifactType.code,
                phaseCode: artifactType.phaseCode,
                description: artifactType.description || "",
                isRequired: artifactType.isRequired,
                orderIndex: artifactType.orderIndex,
            });
        } else {
            setEditingArtifactType(null);
            setFormData({
                name: "",
                code: "",
                phaseCode: phases[0]?.code || "",
                description: "",
                isRequired: false,
                orderIndex: artifactTypes.length + 1,
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingArtifactType(null);
        setFormData({
            name: "",
            code: "",
            phaseCode: "",
            description: "",
            isRequired: false,
            orderIndex: 0,
        });
    };

    const handleSubmit = async () => {
        try {
            if (editingArtifactType) {
                const input: UpdateArtifactTypeTemplateInput = {
                    name: formData.name,
                    code: formData.code.toUpperCase(),
                    phaseCode: formData.phaseCode,
                    description: formData.description || undefined,
                    isRequired: formData.isRequired,
                    orderIndex: formData.orderIndex,
                };
                await configurationService.updateArtifactType(
                    configId,
                    editingArtifactType.id,
                    input
                );
            } else {
                const input: CreateArtifactTypeTemplateInput = {
                    name: formData.name,
                    code: formData.code.toUpperCase(),
                    phaseCode: formData.phaseCode,
                    description: formData.description || undefined,
                    isRequired: formData.isRequired,
                    orderIndex: formData.orderIndex,
                };
                await configurationService.createArtifactType(configId, input);
            }
            handleCloseDialog();
            loadData();
        } catch (err) {
            setError("Error al guardar tipo de artefacto");
            console.error(err);
        }
    };

    const handleDelete = async (artifactTypeId: string) => {
        if (
            !window.confirm("¿Estás seguro de eliminar este tipo de artefacto?")
        )
            return;

        try {
            await configurationService.deleteArtifactType(
                configId,
                artifactTypeId
            );
            loadData();
        } catch (err) {
            setError(
                "Error al eliminar tipo de artefacto. Puede estar en uso por artefactos existentes."
            );
            console.error(err);
        }
    };

    const getPhaseName = (phaseCode: string) => {
        return phases.find((p) => p.code === phaseCode)?.name || phaseCode;
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
                <Typography variant="h6">Tipos de Artefactos</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo Tipo de Artefacto
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
                Los tipos de artefactos definen los documentos y entregables
                esperados en cada fase
            </Alert>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Orden</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Código</TableCell>
                            <TableCell>Fase</TableCell>
                            <TableCell>Requerido</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {artifactTypes.map((artifactType) => (
                            <TableRow key={artifactType.id}>
                                <TableCell>{artifactType.orderIndex}</TableCell>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontWeight="medium"
                                    >
                                        {artifactType.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={artifactType.code}
                                        size="small"
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getPhaseName(
                                            artifactType.phaseCode
                                        )}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    {artifactType.isRequired && (
                                        <CheckCircleIcon
                                            color="success"
                                            fontSize="small"
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {artifactType.description || "-"}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                            handleOpenDialog(artifactType)
                                        }
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            handleDelete(artifactType.id)
                                        }
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {artifactTypes.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No hay tipos de artefactos configurados
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
                    {editingArtifactType
                        ? "Editar Tipo de Artefacto"
                        : "Nuevo Tipo de Artefacto"}
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
                            placeholder="Vision Document"
                        />
                        <TextField
                            label="Código"
                            value={formData.code}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    code: e.target.value.toUpperCase(),
                                })
                            }
                            required
                            fullWidth
                            placeholder="VISION_DOC"
                            helperText="Código único en mayúsculas sin espacios"
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Fase</InputLabel>
                            <Select
                                value={formData.phaseCode}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phaseCode: e.target.value,
                                    })
                                }
                                label="Fase"
                            >
                                {phases.map((phase) => (
                                    <MenuItem key={phase.id} value={phase.code}>
                                        {phase.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.isRequired}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            isRequired: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Artefacto requerido"
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
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={
                            !formData.name.trim() ||
                            !formData.code.trim() ||
                            !formData.phaseCode
                        }
                    >
                        {editingArtifactType ? "Actualizar" : "Crear"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
