import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Chip,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Breadcrumbs,
    Link as MuiLink,
} from "@mui/material";
import {
    Add as AddIcon,
    ContentCopy as CloneIcon,
    Compare as CompareIcon,
    Download as ExportIcon,
    Upload as ImportIcon,
    History as HistoryIcon,
    Delete as DeleteIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router";
import { Navbar } from "../../components/common/Navbar";
import { ChangeHistoryView } from "../../components/configuration/ChangeHistoryView";
import { configurationService } from "../../services/configurationService";
import type {
    TemplateListItem,
    SaveAsTemplateInput,
    CloneTemplateInput,
    TemplateComparison,
} from "../../types/configuration";

export function TemplateManagementPage() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState<TemplateListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Save as template dialog
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [saveSourceId, setSaveSourceId] = useState<string | null>(null);
    const [saveFormData, setSaveFormData] = useState<SaveAsTemplateInput>({
        name: "",
        description: "",
        tags: "",
    });

    // Clone dialog
    const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
    const [cloneSourceId, setCloneSourceId] = useState<string | null>(null);
    const [cloneFormData, setCloneFormData] = useState<CloneTemplateInput>({
        newName: "",
        newDescription: "",
    });

    // Compare dialog
    const [compareDialogOpen, setCompareDialogOpen] = useState(false);
    const [compareTemplate1, setCompareTemplate1] = useState<string>("");
    const [compareTemplate2, setCompareTemplate2] = useState<string>("");
    const [comparison, setComparison] = useState<TemplateComparison | null>(
        null
    );

    // Import dialog
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);

    // History dialog
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [historyConfigId, setHistoryConfigId] = useState<string | null>(null);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await configurationService.getTemplates();
            setTemplates(data);
        } catch (err) {
            console.error("Error loading templates:", err);
            setError("Error al cargar plantillas");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAsTemplate = async () => {
        if (!saveSourceId || !saveFormData.name.trim()) {
            setError("El nombre es requerido");
            return;
        }

        try {
            await configurationService.saveAsTemplate(
                saveSourceId,
                saveFormData
            );
            setSuccess("Plantilla guardada correctamente");
            setSaveDialogOpen(false);
            setSaveFormData({ name: "", description: "", tags: "" });
            loadTemplates();
        } catch (err) {
            console.error("Error saving template:", err);
            setError("Error al guardar plantilla");
        }
    };

    const handleCloneTemplate = async () => {
        if (!cloneSourceId || !cloneFormData.newName.trim()) {
            setError("El nombre es requerido");
            return;
        }

        try {
            await configurationService.cloneTemplate(
                cloneSourceId,
                cloneFormData
            );
            setSuccess("Plantilla clonada correctamente");
            setCloneDialogOpen(false);
            setCloneFormData({ newName: "", newDescription: "" });
            loadTemplates();
        } catch (err) {
            console.error("Error cloning template:", err);
            setError("Error al clonar plantilla");
        }
    };

    const handleCompare = async () => {
        if (!compareTemplate1 || !compareTemplate2) {
            setError("Selecciona dos plantillas para comparar");
            return;
        }

        try {
            const result = await configurationService.compareTemplates(
                compareTemplate1,
                compareTemplate2
            );
            setComparison(result);
        } catch (err) {
            console.error("Error comparing templates:", err);
            setError("Error al comparar plantillas");
        }
    };

    const handleExport = async (templateId: string) => {
        try {
            const exported =
                await configurationService.exportTemplate(templateId);
            const blob = new Blob([JSON.stringify(exported, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `template-${exported.name}-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            setSuccess("Plantilla exportada correctamente");
        } catch (err) {
            console.error("Error exporting template:", err);
            setError("Error al exportar plantilla");
        }
    };

    const handleImport = async () => {
        if (!importFile) {
            setError("Selecciona un archivo para importar");
            return;
        }

        try {
            const content = await importFile.text();
            const data = JSON.parse(content);
            await configurationService.importTemplate(data);
            setSuccess("Plantilla importada correctamente");
            setImportDialogOpen(false);
            setImportFile(null);
            loadTemplates();
        } catch (err) {
            console.error("Error importing template:", err);
            setError("Error al importar plantilla");
        }
    };

    const getDifferenceTypeColor = (type: string) => {
        switch (type) {
            case "ADDED":
                return "success";
            case "REMOVED":
                return "error";
            case "MODIFIED":
                return "warning";
            default:
                return "default";
        }
    };

    const getDifferenceTypeLabel = (type: string) => {
        switch (type) {
            case "ADDED":
                return "Agregado";
            case "REMOVED":
                return "Eliminado";
            case "MODIFIED":
                return "Modificado";
            default:
                return type;
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                    <Box
                        sx={{ display: "flex", justifyContent: "center", p: 4 }}
                    >
                        <CircularProgress />
                    </Box>
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink
                        component={Link}
                        to="/"
                        underline="hover"
                        color="inherit"
                    >
                        Inicio
                    </MuiLink>
                    <Typography color="text.primary">
                        Gestión de Plantillas
                    </Typography>
                </Breadcrumbs>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Typography variant="h4">
                        Plantillas OpenUP (HU-019)
                    </Typography>
                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<CompareIcon />}
                            onClick={() => setCompareDialogOpen(true)}
                            sx={{ mr: 1 }}
                        >
                            Comparar
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ImportIcon />}
                            onClick={() => setImportDialogOpen(true)}
                        >
                            Importar
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert
                        severity="success"
                        sx={{ mb: 3 }}
                        onClose={() => setSuccess(null)}
                    >
                        {success}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {templates.map((template) => (
                        <Grid item xs={12} md={6} lg={4} key={template.id}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            mb: 2,
                                        }}
                                    >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {template.name}
                                                {template.isDefault && (
                                                    <StarIcon
                                                        sx={{
                                                            ml: 1,
                                                            color: "warning.main",
                                                            fontSize: 20,
                                                        }}
                                                    />
                                                )}
                                            </Typography>
                                            {template.description && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mb: 1 }}
                                                >
                                                    {template.description}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Chip
                                            label={`v${template.version}`}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                        <Chip
                                            label={
                                                template.isActive
                                                    ? "Activa"
                                                    : "Inactiva"
                                            }
                                            size="small"
                                            color={
                                                template.isActive
                                                    ? "success"
                                                    : "default"
                                            }
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                        {template.tags &&
                                            template.tags
                                                .split(",")
                                                .map((tag) => (
                                                    <Chip
                                                        key={tag}
                                                        label={tag.trim()}
                                                        size="small"
                                                        sx={{
                                                            mr: 0.5,
                                                            mb: 0.5,
                                                        }}
                                                    />
                                                ))}
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: 1,
                                            mb: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Roles: {template.rolesCount}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Fases: {template.phasesCount}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Artefactos:{" "}
                                            {template.artifactTypesCount}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Flujos: {template.workflowsCount}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ gridColumn: "1 / -1" }}
                                        >
                                            Proyectos usando:{" "}
                                            {template.projectsUsingCount}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                    >
                                        Creado por {template.createdBy} el{" "}
                                        {new Date(
                                            template.createdAt
                                        ).toLocaleDateString("es-ES")}
                                    </Typography>
                                </CardContent>

                                <Box
                                    sx={{
                                        p: 2,
                                        pt: 0,
                                        display: "flex",
                                        gap: 1,
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <Tooltip title="Clonar">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setCloneSourceId(
                                                        template.id
                                                    );
                                                    setCloneFormData({
                                                        newName: `${template.name} (Copia)`,
                                                        newDescription:
                                                            template.description,
                                                    });
                                                    setCloneDialogOpen(true);
                                                }}
                                            >
                                                <CloneIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Exportar">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleExport(template.id)
                                                }
                                            >
                                                <ExportIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Ver historial">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setHistoryConfigId(
                                                        template.id
                                                    );
                                                    setHistoryDialogOpen(true);
                                                }}
                                            >
                                                <HistoryIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() =>
                                            navigate(
                                                `/configuration?config=${template.id}`
                                            )
                                        }
                                    >
                                        Gestionar
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}

                    {templates.length === 0 && (
                        <Grid item xs={12}>
                            <Alert severity="info">
                                No hay plantillas disponibles. Crea una nueva
                                configuración y guárdala como plantilla.
                            </Alert>
                        </Grid>
                    )}
                </Grid>

                {/* Save As Template Dialog */}
                <Dialog
                    open={saveDialogOpen}
                    onClose={() => setSaveDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Guardar como Plantilla</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Nombre de la Plantilla"
                            fullWidth
                            required
                            value={saveFormData.name}
                            onChange={(e) =>
                                setSaveFormData({
                                    ...saveFormData,
                                    name: e.target.value,
                                })
                            }
                            sx={{ mt: 2, mb: 2 }}
                        />
                        <TextField
                            label="Descripción"
                            fullWidth
                            multiline
                            rows={3}
                            value={saveFormData.description}
                            onChange={(e) =>
                                setSaveFormData({
                                    ...saveFormData,
                                    description: e.target.value,
                                })
                            }
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Tags (separados por comas)"
                            fullWidth
                            value={saveFormData.tags}
                            onChange={(e) =>
                                setSaveFormData({
                                    ...saveFormData,
                                    tags: e.target.value,
                                })
                            }
                            helperText="Ej: custom, sprint3, producción"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSaveDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSaveAsTemplate}
                            variant="contained"
                        >
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Clone Template Dialog */}
                <Dialog
                    open={cloneDialogOpen}
                    onClose={() => setCloneDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Clonar Plantilla</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Nuevo Nombre"
                            fullWidth
                            required
                            value={cloneFormData.newName}
                            onChange={(e) =>
                                setCloneFormData({
                                    ...cloneFormData,
                                    newName: e.target.value,
                                })
                            }
                            sx={{ mt: 2, mb: 2 }}
                        />
                        <TextField
                            label="Nueva Descripción"
                            fullWidth
                            multiline
                            rows={3}
                            value={cloneFormData.newDescription}
                            onChange={(e) =>
                                setCloneFormData({
                                    ...cloneFormData,
                                    newDescription: e.target.value,
                                })
                            }
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCloneDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCloneTemplate}
                            variant="contained"
                        >
                            Clonar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Compare Templates Dialog */}
                <Dialog
                    open={compareDialogOpen}
                    onClose={() => {
                        setCompareDialogOpen(false);
                        setComparison(null);
                    }}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Comparar Plantillas</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 3 }}>
                            <TextField
                                select
                                label="Plantilla 1"
                                fullWidth
                                value={compareTemplate1}
                                onChange={(e) =>
                                    setCompareTemplate1(e.target.value)
                                }
                                SelectProps={{ native: true }}
                            >
                                <option value="">Seleccionar...</option>
                                {templates.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} (v{t.version})
                                    </option>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Plantilla 2"
                                fullWidth
                                value={compareTemplate2}
                                onChange={(e) =>
                                    setCompareTemplate2(e.target.value)
                                }
                                SelectProps={{ native: true }}
                            >
                                <option value="">Seleccionar...</option>
                                {templates.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} (v{t.version})
                                    </option>
                                ))}
                            </TextField>
                        </Box>

                        <Button
                            variant="contained"
                            onClick={handleCompare}
                            disabled={!compareTemplate1 || !compareTemplate2}
                            fullWidth
                            sx={{ mb: 3 }}
                        >
                            Comparar
                        </Button>

                        {comparison && (
                            <Box>
                                <Alert
                                    severity={
                                        comparison.summary.areIdentical
                                            ? "success"
                                            : "info"
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    {comparison.summary.areIdentical
                                        ? "Las plantillas son idénticas"
                                        : `Se encontraron ${comparison.summary.totalDifferences} diferencias`}
                                </Alert>

                                {!comparison.summary.areIdentical && (
                                    <TableContainer component={Paper}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        Tipo de Entidad
                                                    </TableCell>
                                                    <TableCell>
                                                        Diferencia
                                                    </TableCell>
                                                    <TableCell>
                                                        Elemento
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {comparison.differences.map(
                                                    (diff, idx) => (
                                                        <TableRow key={idx}>
                                                            <TableCell>
                                                                {
                                                                    diff.entityType
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={getDifferenceTypeLabel(
                                                                        diff.differenceType
                                                                    )}
                                                                    size="small"
                                                                    color={getDifferenceTypeColor(
                                                                        diff.differenceType
                                                                    )}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    diff.entityName
                                                                }
                                                                {diff.propertyChanged &&
                                                                    ` (${diff.propertyChanged})`}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setCompareDialogOpen(false);
                                setComparison(null);
                            }}
                        >
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Import Template Dialog */}
                <Dialog
                    open={importDialogOpen}
                    onClose={() => setImportDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Importar Plantilla</DialogTitle>
                    <DialogContent>
                        <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                            Selecciona un archivo JSON exportado previamente
                            desde el sistema.
                        </Alert>
                        <input
                            type="file"
                            accept=".json"
                            onChange={(e) =>
                                setImportFile(e.target.files?.[0] || null)
                            }
                            style={{ width: "100%" }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setImportDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleImport}
                            variant="contained"
                            disabled={!importFile}
                        >
                            Importar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* History Dialog */}
                <Dialog
                    open={historyDialogOpen}
                    onClose={() => setHistoryDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Historial de Cambios de la Plantilla
                    </DialogTitle>
                    <DialogContent>
                        {historyConfigId && (
                            <ChangeHistoryView configId={historyConfigId} />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setHistoryDialogOpen(false)}>
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}
