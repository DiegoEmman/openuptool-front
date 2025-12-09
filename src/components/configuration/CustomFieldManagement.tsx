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
    OutlinedInput,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
} from "@mui/icons-material";
import { configurationService } from "../../services/configurationService";
import type {
    CustomFieldDefinition,
    CreateCustomFieldDefinitionInput,
    UpdateCustomFieldDefinitionInput,
    ArtifactTypeTemplate,
} from "../../types/configuration";

interface CustomFieldManagementProps {
    configId: string;
}

export function CustomFieldManagement({
    configId,
}: CustomFieldManagementProps) {
    const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(
        []
    );
    const [artifactTypes, setArtifactTypes] = useState<ArtifactTypeTemplate[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingField, setEditingField] =
        useState<CustomFieldDefinition | null>(null);
    const [formData, setFormData] = useState({
        fieldName: "",
        displayName: "",
        fieldType: "text" as "text" | "number" | "date" | "boolean" | "select",
        defaultValue: "",
        options: "",
        artifactTypeTemplateId: "",
        isRequired: false,
    });

    useEffect(() => {
        loadData();
    }, [configId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [fieldsData, typesData] = await Promise.all([
                configurationService.getCustomFields(configId),
                configurationService.getArtifactTypes(configId),
            ]);
            setCustomFields(fieldsData);
            setArtifactTypes(typesData);
        } catch (err) {
            setError("Error al cargar datos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (field?: CustomFieldDefinition) => {
        if (field) {
            setEditingField(field);
            setFormData({
                fieldName: field.fieldName,
                displayName: field.displayName,
                fieldType: field.fieldType,
                defaultValue: field.defaultValue || "",
                options: field.options?.join(", ") || "",
                artifactTypeTemplateId: field.artifactTypeTemplateId,
                isRequired: field.isRequired,
            });
        } else {
            setEditingField(null);
            setFormData({
                fieldName: "",
                displayName: "",
                fieldType: "text",
                defaultValue: "",
                options: "",
                artifactTypeTemplateId: "",
                isRequired: false,
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingField(null);
        setFormData({
            fieldName: "",
            displayName: "",
            fieldType: "text",
            defaultValue: "",
            options: "",
            artifactTypeTemplateId: "",
            isRequired: false,
        });
    };

    const handleSubmit = async () => {
        try {
            const optionsArray =
                formData.fieldType === "select" && formData.options.trim()
                    ? formData.options
                          .split(",")
                          .map((o) => o.trim())
                          .filter((o) => o)
                    : undefined;

            if (editingField) {
                const input: UpdateCustomFieldDefinitionInput = {
                    fieldName: formData.fieldName,
                    displayName: formData.displayName,
                    fieldType: formData.fieldType,
                    defaultValue: formData.defaultValue || undefined,
                    options: optionsArray,
                    isRequired: formData.isRequired,
                };
                await configurationService.updateCustomField(
                    configId,
                    editingField.id,
                    input
                );
            } else {
                const input: CreateCustomFieldDefinitionInput = {
                    artifactTypeTemplateId: formData.artifactTypeTemplateId,
                    fieldName: formData.fieldName,
                    displayName: formData.displayName,
                    fieldType: formData.fieldType,
                    defaultValue: formData.defaultValue || undefined,
                    options: optionsArray,
                    isRequired: formData.isRequired,
                };
                await configurationService.createCustomField(configId, input);
            }
            handleCloseDialog();
            loadData();
        } catch (err) {
            setError("Error al guardar campo personalizado");
            console.error(err);
        }
    };

    const handleDelete = async (fieldId: string) => {
        if (
            !window.confirm(
                "¿Estás seguro de eliminar este campo personalizado?"
            )
        )
            return;

        try {
            await configurationService.deleteCustomField(configId, fieldId);
            loadData();
        } catch (err) {
            setError("Error al eliminar campo personalizado");
            console.error(err);
        }
    };

    const getArtifactTypeName = (typeId: string) => {
        return (
            artifactTypes.find((t) => t.id === typeId)?.name || "Desconocido"
        );
    };

    const getFieldTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            text: "Texto",
            number: "Número",
            date: "Fecha",
            boolean: "Booleano",
            select: "Selección",
        };
        return labels[type] || type;
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
                <Typography variant="h6">Campos Personalizados</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo Campo
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
                Los campos personalizados permiten extender los artefactos con
                información adicional específica del proyecto
            </Alert>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre para Mostrar</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Tipo de Artefacto</TableCell>
                            <TableCell>Requerido</TableCell>
                            <TableCell>Valor por Defecto</TableCell>
                            <TableCell>Opciones</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customFields.map((field) => (
                            <TableRow key={field.id}>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontWeight="medium"
                                    >
                                        {field.displayName}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {field.fieldName}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getFieldTypeLabel(
                                            field.fieldType
                                        )}
                                        size="small"
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell>
                                    {getArtifactTypeName(
                                        field.artifactTypeTemplateId
                                    )}
                                </TableCell>
                                <TableCell>
                                    {field.isRequired ? (
                                        <Chip
                                            label="Sí"
                                            size="small"
                                            color="error"
                                        />
                                    ) : (
                                        <Chip
                                            label="No"
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {field.defaultValue || "-"}
                                </TableCell>
                                <TableCell>
                                    {field.options &&
                                    field.options.length > 0 ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 0.5,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            {field.options.map(
                                                (option, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={option}
                                                        size="small"
                                                        color="secondary"
                                                    />
                                                )
                                            )}
                                        </Box>
                                    ) : (
                                        "-"
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleOpenDialog(field)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(field.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {customFields.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No hay campos personalizados configurados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {editingField
                        ? "Editar Campo Personalizado"
                        : "Nuevo Campo Personalizado"}
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
                            label="Nombre del Campo"
                            value={formData.fieldName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    fieldName: e.target.value,
                                })
                            }
                            required
                            fullWidth
                            placeholder="priority"
                            helperText="Nombre técnico del campo (sin espacios)"
                        />
                        <TextField
                            label="Nombre para Mostrar"
                            value={formData.displayName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    displayName: e.target.value,
                                })
                            }
                            required
                            fullWidth
                            placeholder="Prioridad"
                            helperText="Nombre visible en la interfaz"
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Tipo de Campo</InputLabel>
                            <Select
                                value={formData.fieldType}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        fieldType: e.target
                                            .value as typeof formData.fieldType,
                                        options:
                                            e.target.value === "select"
                                                ? formData.options
                                                : "",
                                    })
                                }
                                label="Tipo de Campo"
                            >
                                <MenuItem value="text">Texto</MenuItem>
                                <MenuItem value="number">Número</MenuItem>
                                <MenuItem value="date">Fecha</MenuItem>
                                <MenuItem value="boolean">Booleano</MenuItem>
                                <MenuItem value="select">Selección</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Valor por Defecto"
                            value={formData.defaultValue}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    defaultValue: e.target.value,
                                })
                            }
                            fullWidth
                        />
                        {formData.fieldType === "select" && (
                            <TextField
                                label="Opciones"
                                value={formData.options}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        options: e.target.value,
                                    })
                                }
                                fullWidth
                                helperText="Separar opciones con comas (ej: Alta, Media, Baja)"
                                required={formData.fieldType === "select"}
                            />
                        )}
                        <FormControl fullWidth required={!editingField}>
                            <InputLabel>Tipo de Artefacto</InputLabel>
                            <Select
                                value={formData.artifactTypeTemplateId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        artifactTypeTemplateId: e.target.value,
                                    })
                                }
                                label="Tipo de Artefacto"
                                disabled={!!editingField}
                            >
                                {artifactTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name} ({type.phaseCode})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Campo Requerido</InputLabel>
                            <Select
                                value={formData.isRequired ? "true" : "false"}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        isRequired: e.target.value === "true",
                                    })
                                }
                                label="Campo Requerido"
                            >
                                <MenuItem value="false">No</MenuItem>
                                <MenuItem value="true">Sí</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={
                            !formData.fieldName.trim() ||
                            !formData.displayName.trim() ||
                            (!editingField &&
                                !formData.artifactTypeTemplateId) ||
                            (formData.fieldType === "select" &&
                                !formData.options.trim())
                        }
                    >
                        {editingField ? "Actualizar" : "Crear"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
